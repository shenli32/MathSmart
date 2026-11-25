const PetPocketStorage = (() => {
  const KEY = "petpocket-save-v1";
  const starter = { name: "Buddy", type: "dog", coins: 0, happiness: 80, energy: 80 };

  function get() {
    try { return { ...starter, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; }
    catch { return { ...starter }; }
  }

  function save(game) { localStorage.setItem(KEY, JSON.stringify(game)); return game; }

  return { get, save, reset() { localStorage.removeItem(KEY); return get(); } };
})();
