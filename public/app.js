const pets = {
  dog: { emoji: "🐶", label: "Dog" },
  cat: { emoji: "🐱", label: "Cat" },
  bunny: { emoji: "🐰", label: "Bunny" },
  hamster: { emoji: "🐹", label: "Hamster" },
  turtle: { emoji: "🐢", label: "Turtle" },
  fox: { emoji: "🦊", label: "Fox" },
  owl: { emoji: "🦉", label: "Owl" },
  penguin: { emoji: "🐧", label: "Penguin" },
  frog: { emoji: "🐸", label: "Frog" },
  parrot: { emoji: "🦜", label: "Parrot" },
};

const game = PetPocketStorage.get();
const elements = {
  name: document.querySelector("#pet-name"), nameHeading: document.querySelector("#pet-name-heading"),
  careName: document.querySelector("#care-name"), title: document.querySelector("#pet-title"),
  face: document.querySelector("#pet-face"), mood: document.querySelector("#pet-mood"),
  coins: document.querySelector("#coin-count"), savings: document.querySelector("#savings-count"),
  savingsMessage: document.querySelector("#savings-message"), happinessValue: document.querySelector("#happiness-value"),
  happinessMeter: document.querySelector("#happiness-meter"), energyValue: document.querySelector("#energy-value"),
  energyMeter: document.querySelector("#energy-meter"), hearts: document.querySelector("#hearts"), status: document.querySelector("#status"),
};

function clamp(value) { return Math.max(0, Math.min(100, value)); }

function render() {
  const pet = pets[game.type] || pets.dog;
  elements.name.value = game.name;
  elements.nameHeading.textContent = game.name;
  elements.careName.textContent = game.name;
  elements.title.textContent = `${game.name} the ${pet.label}`;
  elements.face.textContent = pet.emoji;
  elements.face.setAttribute("aria-label", `${game.name} the ${pet.label}`);
  elements.coins.textContent = game.coins;
  elements.savings.textContent = game.coins;
  elements.savingsMessage.textContent = game.coins ? `${game.name} is helping you save little by little!` : "Play with your pet to earn more coins.";
  elements.happinessValue.textContent = `${game.happiness}%`;
  elements.happinessMeter.style.width = `${game.happiness}%`;
  elements.energyValue.textContent = `${game.energy}%`;
  elements.energyMeter.style.width = `${game.energy}%`;
  document.querySelectorAll(".pet-choice").forEach(button => button.classList.toggle("selected", button.dataset.pet === game.type));
}

function say(message, mood = "") {
  elements.status.textContent = message;
  elements.mood.textContent = mood || message;
  elements.hearts.classList.remove("pop");
  void elements.hearts.offsetWidth;
  elements.hearts.classList.add("pop");
}

function saveAndRender(message, mood) { PetPocketStorage.save(game); render(); say(message, mood); }

document.querySelector("#save-name").addEventListener("click", () => {
  const newName = elements.name.value.trim().replace(/[^a-zA-Z0-9 '!?.-]/g, "").slice(0, 18);
  if (!newName) { say("Please choose a name first!", "A name would be fun!"); return; }
  game.name = newName;
  saveAndRender(`${game.name} is ready for an adventure!`, "Nice name!");
});

elements.name.addEventListener("keydown", event => { if (event.key === "Enter") document.querySelector("#save-name").click(); });

document.querySelectorAll(".pet-choice").forEach(button => button.addEventListener("click", () => {
  game.type = button.dataset.pet;
  saveAndRender(`${game.name} picked a new look!`, "Looking cute!");
}));

document.querySelector("#feed-button").addEventListener("click", () => {
  game.happiness = clamp(game.happiness + 10);
  game.energy = clamp(game.energy - 2);
  saveAndRender(`${game.name} loved the crunchy apple!`, "Yum yum!");
});

document.querySelector("#play-button").addEventListener("click", () => {
  if (game.energy < 10) { say(`${game.name} needs a nap first.`, "A little sleepy..."); return; }
  game.coins += 5;
  game.happiness = clamp(game.happiness + 6);
  game.energy = clamp(game.energy - 10);
  saveAndRender("Great playing! You earned 5 coins.", "That was fun!");
});

document.querySelector("#rest-button").addEventListener("click", () => {
  game.energy = clamp(game.energy + 20);
  game.happiness = clamp(game.happiness - 2);
  saveAndRender(`${game.name} had a cozy rest.`, "So refreshed!");
});

document.querySelector("#reset-button").addEventListener("click", () => {
  if (!window.confirm("Start over and clear this pet's coins?")) return;
  Object.assign(game, PetPocketStorage.reset());
  saveAndRender("A brand-new pet adventure begins!", "Hello, friend!");
});

const mathQuestion = document.querySelector("#math-question");
const mathSubmit = document.querySelector("#math-submit");
const voiceButton = document.querySelector("#voice-button");
const stopVoiceButton = document.querySelector("#stop-voice");
const mathStatus = document.querySelector("#math-status");
const mathAnswer = document.querySelector("#math-answer");
const mathAnswerText = document.querySelector("#math-answer-text");
let recognition = null;
let speaking = false;

function setMathStatus(message, error = false) {
  mathStatus.textContent = message;
  mathStatus.className = `math-status${error ? " error" : ""}`;
}

function speakMath(text) {
  if (!("speechSynthesis" in window)) {
    setMathStatus("I showed the hint, but this browser cannot read it aloud.");
    return;
  }
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  speaking = true;
}

function stopMathSpeech() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  speaking = false;
  setMathStatus("Reading stopped. You can still read the hint.");
}

async function askMathQuestion() {
  const question = mathQuestion.value.trim();
  if (!question) { setMathStatus("Say or type a math question first.", true); return; }
  mathSubmit.disabled = true;
  voiceButton.disabled = true;
  mathAnswer.hidden = true;
  setMathStatus("Thinking about your math question…");
  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || body.error) throw new Error(body.error?.message || "The math helper could not answer right now.");
    mathAnswerText.textContent = body.answer;
    mathAnswer.hidden = false;
    speakMath(body.answer);
    setMathStatus("Your hint is ready. Try the next step yourself!");
  } catch (error) {
    setMathStatus(error.message || "Please check the connection and try again.", true);
  } finally {
    mathSubmit.disabled = false;
    voiceButton.disabled = false;
  }
}

function listenForMath() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) { setMathStatus("Voice input is not available here. You can type the problem instead.", true); return; }
  recognition?.stop();
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  voiceButton.disabled = true;
  setMathStatus("Listening… say your whole math problem.");
  recognition.onresult = event => {
    mathQuestion.value = Array.from(event.results).map(result => result[0].transcript).join("");
  };
  recognition.onerror = () => { voiceButton.disabled = false; setMathStatus("I could not hear that. Check microphone permission or type the problem.", true); };
  recognition.onend = () => { voiceButton.disabled = false; if (mathQuestion.value.trim()) setMathStatus("I heard you. Press Explain with a hint!"); };
  recognition.start();
}

voiceButton.addEventListener("click", listenForMath);
mathSubmit.addEventListener("click", askMathQuestion);
stopVoiceButton.addEventListener("click", stopMathSpeech);
mathQuestion.addEventListener("keydown", event => { if (event.key === "Enter") askMathQuestion(); });

render();
