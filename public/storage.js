// One small browser-storage file so a real database can replace it later.
const MathSmartStorage = (() => {
  const KEY = "mathsmart-progress-v1";
  const sample = { questionsAsked: 0, practiceDone: 0, recentQuestion: "" };

  function read() {
    try {
      return { ...sample, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
    } catch {
      return { ...sample };
    }
  }

  function write(progress) {
    localStorage.setItem(KEY, JSON.stringify(progress));
  }

  return {
    get() { return read(); },
    recordQuestion(question) {
      const progress = read();
      progress.questionsAsked += 1;
      progress.recentQuestion = question;
      write(progress);
      return progress;
    },
    recordPractice() {
      const progress = read();
      progress.practiceDone += 1;
      write(progress);
      return progress;
    },
  };
})();
