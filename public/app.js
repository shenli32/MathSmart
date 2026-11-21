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
const stopSpeechButton = document.querySelector("#stop-speech");
const practiceBox = document.querySelector("#practice-box");
const practiceQuestion = document.querySelector("#practice-question");
const practiceInput = document.querySelector("#practice-answer");
const practiceCheck = document.querySelector("#practice-check");
const practiceResult = document.querySelector("#practice-result");
const progressText = document.querySelector("#progress");
const listenButton = document.querySelector("#listen-button");

let currentPracticeAnswer = null;
let recognition = null;
let listening = false;
let listeningDeadline = 0;
let listeningTimer = null;

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

function stopSpeaking() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  setStatus("Reading stopped. You can still read the explanation.");
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
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  listening = true;
  listeningDeadline = Date.now() + 20_000;
  listenButton.disabled = true;
  setStatus("Listening… you have up to 20 seconds. Say your whole math problem.");
  clearTimeout(listeningTimer);
  listeningTimer = setTimeout(() => {
    listening = false;
    recognition.stop();
  }, 20_000);
  recognition.onresult = event => {
    let transcript = "";
    for (let index = 0; index < event.results.length; index += 1) {
      transcript += event.results[index][0].transcript;
    }
    questionInput.value = transcript;
    setStatus("I’m listening… keep talking, or press Check My Math when you’re done.");
  };
  recognition.onerror = () => {
    listening = false;
    clearTimeout(listeningTimer);
    setStatus("I could not hear that. Check microphone permission and try again.", "error");
  };
  recognition.onend = () => {
    if (listening && Date.now() < listeningDeadline) {
      try { recognition.start(); } catch { /* The browser may already be restarting. */ }
      return;
    }
    listening = false;
    clearTimeout(listeningTimer);
    listenButton.disabled = false;
    if (questionInput.value.trim()) setStatus("I heard you. Press Check My Math!");
  };
  recognition.start();
}

function makePracticeProblem() {
  const topic = questionInput.value.trim().toLowerCase();
  let question;

  if (topic.includes("limit")) {
    currentPracticeAnswer = 5;
    question = "Find the limit as x approaches 2: x + 3";
  } else if (topic.includes("derivative") || topic.includes("differentiate")) {
    currentPracticeAnswer = 6;
    question = "If f(x) = x², what is f′(3)?";
  } else if (topic.includes("integral") || topic.includes("integrate")) {
    currentPracticeAnswer = 4;
    question = "What is ∫ 2x dx from x = 0 to x = 2?";
  } else if (topic.includes("percent") || topic.includes("percentage")) {
    currentPracticeAnswer = 20;
    question = "What is 20% of 100?";
  } else if (topic.includes("divide") || topic.includes("division") || topic.includes("÷") || topic.includes("/")) {
    currentPracticeAnswer = 6;
    question = "What is 24 ÷ 4?";
  } else if (topic.includes("multiply") || topic.includes("multiplication") || topic.includes("times") || topic.includes("×")) {
    currentPracticeAnswer = 24;
    question = "What is 6 × 4?";
  } else if (topic.includes("subtract") || topic.includes("minus") || topic.includes("difference")) {
    currentPracticeAnswer = 7;
    question = "What is 15 − 8?";
  } else if (topic.includes("equation") || topic.includes("solve for") || topic.includes("variable")) {
    currentPracticeAnswer = 4;
    question = "Solve for x: x + 3 = 7";
  } else {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 8) + 2;
    currentPracticeAnswer = a + b;
    question = `What is ${a} + ${b}?`;
  }

  practiceQuestion.textContent = question;
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
stopSpeechButton.addEventListener("click", stopSpeaking);
practiceCheck.addEventListener("click", checkPractice);
practiceInput.addEventListener("keydown", event => { if (event.key === "Enter") checkPractice(); });
updatePet();
renderProgress();
