const TripTiming = (() => {
  function hav(a, b) {
    const latitude = (b[0] - a[0]) * Math.PI / 180;
    const longitude = (b[1] - a[1]) * Math.PI / 180;
    const arc = Math.sin(latitude / 2) ** 2 +
      Math.cos(a[0] * Math.PI / 180) * Math.cos(b[0] * Math.PI / 180) * Math.sin(longitude / 2) ** 2;
    return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, arc)));
  }

  function estMode(mode, km, drive) {
    function pack(wait, ride, distance, src) {
      return { wait, ride, min: ride + wait, km: distance, src };
    }
    if (mode === "walk") {
      const useRoadDistance = drive && drive.km < km * 2.5;
      const distance = useRoadDistance ? drive.km : km * 1.35;
      return pack(0, distance / 4.5 * 60, distance, useRoadDistance ? "OSRM距離+步速" : "估算");
    }
    if (mode === "taxi") {
      return drive ? pack(2, drive.min, drive.km, "OSRM實測") : pack(2, km * 1.3 / 28 * 60, km * 1.3, "估算");
    }
    if (mode === "bus") return pack(6, km * 1.4 / 16 * 60, km * 1.4, "等車6分+車速估");
    return pack(5, km * 1.25 / 28 * 60, km * 1.25, "等車5分+車速估");
  }

  return { hav, estMode };
})();
