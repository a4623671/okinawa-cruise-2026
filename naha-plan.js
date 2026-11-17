const NahaPlan = (() => {
  const date = "2026-12-18";
  const slots = ["morning", "afternoon", "evening"];
  const pier = [26.2364909, 127.6777349];
  const defaultDeadline = "2026-12-02T22:00:00+08:00";

  function dayOf(plan, dateKey = date) {
    const day = plan?.items?.[dateKey];
    return day && slots.every(slot => Array.isArray(day.slots?.[slot]) &&
      day.slots[slot].every(stop => stop && typeof stop.t === "string")) ? day : null;
  }

  function minutes(time) {
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return null;
    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute;
  }

  function format(time) {
    if (time == null) return "—";
    const rounded = Math.round(time);
    const hour = String(Math.floor(rounded / 60) % 24).padStart(2, "0");
    return `${rounded >= 1440 ? "次日 " : ""}${hour}:${String(rounded % 60).padStart(2, "0")}`;
  }

  function rows(day) {
    return slots.flatMap(slot => day.slots[slot].map(stop => ({ slot, stop })));
  }

  function clock(day) {
    return { off: day.off || day.arr || "07:00", board: day.board || day.by || "18:00" };
  }

  function coordinate(stop) {
    return stop && Number.isFinite(stop.lat) && Number.isFinite(stop.lng) &&
      (!stop.place || stop.place === "naha") ? [stop.lat, stop.lng] : null;
  }

  function forecast(day) {
    const { off, board } = clock(day);
    let time = minutes(off);
    let last = null;
    let afterTravel = 0;
    const visible = [];
    function travel(start, end, mode) {
      if (time === null) return;
      time = start && end ? time + TripTiming.estMode(mode, TripTiming.hav(start, end), null).min : null;
    }
    for (const [index, row] of rows(day).entries()) {
      const { stop } = row;
      if (stop.skip) {
        visible.push({ ...row, start: null, end: null });
        continue;
      }
      if (stop.gap && stop.after) {
        afterTravel += Number(stop.min) || 0;
        continue;
      }
      if (!stop.gap) {
        const from = last ? coordinate(last.stop) : pier;
        const mode = last ? day.legs?.[last.index]?.mode : day.portMode?.in;
        travel(from, coordinate(stop), mode || "mono");
        if (time !== null) time += afterTravel;
        afterTravel = 0;
        last = { index, stop };
        const earliest = minutes(stop.from || stop.notBefore);
        if (time !== null && earliest !== null) time = Math.max(time, earliest);
      }
      const start = time;
      const duration = Number(stop.min);
      time = time !== null && Number.isFinite(duration) && duration >= 0 ? time + duration : null;
      visible.push({ ...row, start, end: time });
    }
    if (time !== null) time += afterTravel;
    if (last) travel(coordinate(last.stop), pier, day.portMode?.out || "mono");
    const meal = Math.max(0, Number(day.mealMin) || 0);
    const deadline = minutes(board);
    const returnAt = last && time !== null ? time + meal : null;
    return { rows: visible, returnAt, margin: returnAt === null || deadline === null ? null : deadline - returnAt };
  }

  function lockMessage(plan, now = Date.now()) {
    if (!dayOf(plan)) return "行程尚未載入";
    if (plan.finalized) return "行程已定案";
    const deadline = Date.parse(plan.deadline || defaultDeadline);
    return !Number.isFinite(deadline) || now > deadline ? "已過排程編輯截止" : "";
  }

  function revision(plan) {
    return JSON.stringify([dayOf(plan), plan?.deadline, Boolean(plan?.finalized)]);
  }

  function insert(plan, card, slot, duration, name) {
    const day = dayOf(plan);
    if (!day || !card.stop || !slots.includes(slot) || !Number.isInteger(duration) || duration < 5 || duration > 120) {
      throw new Error("請選擇時段及 5–120 分鐘的停留時間");
    }
    if (rows(day).some(({ stop }) => stop.id === card.id)) return plan;
    const locked = lockMessage(plan);
    if (locked) throw new Error(locked);
    const next = structuredClone(plan);
    const target = dayOf(next);
    const offset = slots.slice(0, slots.indexOf(slot) + 1).reduce((sum, period) => sum + target.slots[period].length, 0);
    target.legs = Object.fromEntries(Object.entries(target.legs || {}).map(([index, leg]) =>
      [/^\d+$/.test(index) && Number(index) >= offset ? Number(index) + 1 : index, leg]
    ));
    target.slots[slot].push({
      id: card.id,
      t: card.venue,
      kind: "food",
      place: "naha",
      lat: card.stop.lat,
      lng: card.stop.lng,
      min: duration,
      src: "user",
      by: name,
    });
    return next;
  }

  return { date, dayOf, rows, clock, forecast, format, lockMessage, revision, insert };
})();
