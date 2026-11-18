const pets = {
  fox: { name: "Pip the Fox", emoji: "🦊" },
  owl: { name: "Milo the Owl", emoji: "🦉" },
  bunny: { name: "Sunny the Bunny", emoji: "🐰" },
};

const petSelect = document.querySelector("#pet-select");
const petEmoji = document.querySelector("#pet-emoji");
const questionInput = document.querySelector("#question");
const askButton = document.querySelector("#ask-button");
const answerCard = document.querySelector("#answer-card");
const answerText = document.querySelector("#answer-text");
const statusText = document.querySelector("#status");
const practiceButton = document.querySelector("#practice-button");
const practiceBox = document.querySelector("#practice-box");
const practiceQuestion = document.querySelector("#practice-question");
const practiceInput = document.querySelector("#practice-answer");
const practiceCheck = document.querySelector("#practice-check");
const practiceResult = document.querySelector("#practice-result");
const progressText = document.querySelector("#progress");
const listenButton = document.querySelector("#listen-button");

let currentPracticeAnswer = null;
let recognition = null;

function setStatus(message, kind = "") {
  statusText.textContent = message;
  statusText.className = kind;
}

function renderProgress() {
  const progress = MathSmartStorage.get();
  progressText.textContent = `${progress.questionsAsked} question${progress.questionsAsked === 1 ? "" : "s"} · ${progress.practiceDone} practice problem${progress.practiceDone === 1 ? "" : "s"} done`;
}

function speak(text) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  }
}

function updatePet() {
  const pet = pets[petSelect.value];
  petEmoji.textContent = pet.emoji;
  petEmoji.setAttribute("aria-label", pet.name);
}

async function askMath() {
  const question = questionInput.value.trim();
  if (!question) {
    setStatus("Please say a math question first.", "error");
    return;
  }
  askButton.disabled = true;
  listenButton.disabled = true;
  answerCard.hidden = true;
  setStatus("Thinking…");
  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const body = await response.json();
    if (!response.ok || body.error) throw new Error(body.error?.message || "Please check the internet and try again.");
    answerText.textContent = body.answer;
    answerCard.hidden = false;
    MathSmartStorage.recordQuestion(question);
    renderProgress();
    speak(body.answer);
    setStatus("You can try the practice problem below!");
  } catch (error) {
    setStatus(error.message || "Please check the internet and try again.", "error");
  } finally {
    askButton.disabled = false;
    listenButton.disabled = false;
  }
}

function startListening() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    setStatus("Voice input is not available in this browser. Try Chrome or Safari.", "error");
    return;
  }
  recognition?.stop();
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  listenButton.disabled = true;
  setStatus("Listening… say a math problem.");
  recognition.onresult = event => {
    questionInput.value = event.results[0][0].transcript;
    setStatus("I heard you. Press Check My Math!");
  };
  recognition.onerror = () => setStatus("I could not hear that. Try again.", "error");
  recognition.onend = () => { listenButton.disabled = false; };
  recognition.start();
}

function makePracticeProblem() {
  const a = Math.floor(Math.random() * 8) + 2;
  const b = Math.floor(Math.random() * 8) + 2;
  currentPracticeAnswer = a + b;
  practiceQuestion.textContent = `What is ${a} + ${b}?`;
  practiceInput.value = "";
  practiceResult.textContent = "";
  practiceBox.hidden = false;
  practiceInput.focus();
}

function checkPractice() {
  const answer = Number(practiceInput.value);
  if (answer === currentPracticeAnswer) {
    practiceResult.textContent = "Great job! You got it!";
    practiceResult.className = "success";
    MathSmartStorage.recordPractice();
    renderProgress();
  } else {
    practiceResult.textContent = "Almost! Try it one more time.";
    practiceResult.className = "error";
  }
}

petSelect.addEventListener("change", updatePet);
askButton.addEventListener("click", askMath);
listenButton.addEventListener("click", startListening);
practiceButton.addEventListener("click", makePracticeProblem);
practiceCheck.addEventListener("click", checkPractice);
practiceInput.addEventListener("keydown", event => { if (event.key === "Enter") checkPractice(); });
updatePet();
renderProgress();
