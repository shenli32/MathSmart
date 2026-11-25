const pets = {
  dog: { label: "Dog" }, cat: { label: "Cat" }, bunny: { label: "Bunny" }, hamster: { label: "Hamster" },
  turtle: { label: "Turtle" }, fox: { label: "Fox" }, owl: { label: "Owl" }, penguin: { label: "Penguin" },
  frog: { label: "Frog" }, parrot: { label: "Parrot" },
};

const petSvg = type => {
  const drawings = {
    dog: `<svg viewBox="0 0 160 140" aria-hidden="true"><path fill="#9c633e" stroke="#75482f" stroke-width="4" d="M47 49C43 35 43 20 49 14c7 2 15 12 20 22-8 3-15 7-22 13zM113 49c4-14 4-29-2-35-7 2-15 12-20 22 8 3 15 7 22 13z"/><path fill="#c98952" stroke="#75482f" stroke-width="4" d="M45 51c0-22 70-22 70 0v48c0 20-13 32-35 32s-35-12-35-32z"/><path fill="#fff1db" stroke="#b27a50" stroke-width="3" d="M57 91c3-17 43-17 46 0 2 14-8 25-23 25S55 105 57 91z"/><circle cx="64" cy="76" r="6" fill="#30364f"/><circle cx="96" cy="76" r="6" fill="#30364f"/><ellipse cx="80" cy="92" rx="10" ry="7" fill="#30364f"/><path fill="#e7788e" d="M74 103q6 15 12 0z"/><path fill="none" stroke="#d3a05e" stroke-width="5" d="M48 112h64"/><path fill="#5b9bd5" stroke="#356d9f" stroke-width="2" d="M48 109h64v8H48z"/><path fill="#c98952" stroke="#75482f" stroke-width="4" d="M53 124v10m54-10v10"/></svg>`,
    cat: `<svg viewBox="0 0 160 140" aria-hidden="true"><path fill="#dfa5c8" stroke="#8c4e76" stroke-width="4" d="M35 55 30 17l29 21c13-5 29-5 42 0l29-21-5 38c7 9 10 20 10 34 0 29-20 42-50 42s-50-13-50-42c0-14 3-25 10-34z"/><circle cx="63" cy="78" r="6" fill="#30364f"/><circle cx="97" cy="78" r="6" fill="#30364f"/><path fill="none" stroke="#704052" stroke-width="4" stroke-linecap="round" d="M73 94q7 6 14 0M43 91 20 86m25 14-25 2m92-11 23-5m-25 14 25 2"/></svg>`,
    bunny: `<svg viewBox="0 0 160 140" aria-hidden="true"><path fill="#f1e4dc" stroke="#a88c84" stroke-width="4" d="M53 59C27 52 31 3 48 5c17 2 15 35 15 35 9-3 25-3 34 0 0 0-2-33 15-35 17-2 21 47-5 54 7 8 10 18 10 31 0 27-17 40-37 40s-37-13-37-40c0-13 3-23 10-31z"/><path stroke="#ddaec0" stroke-width="5" d="M49 14c9 9 7 19 7 27m55-27c-9 9-7 19-7 27"/><circle cx="63" cy="83" r="6" fill="#30364f"/><circle cx="97" cy="83" r="6" fill="#30364f"/><path fill="#e994aa" d="M74 96c0-8 12-8 12 0s-12 8-12 0z"/></svg>`,
    hamster: `<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="42" cy="47" r="17" fill="#edc38d" stroke="#a87545" stroke-width="4"/><circle cx="118" cy="47" r="17" fill="#edc38d" stroke="#a87545" stroke-width="4"/><ellipse cx="80" cy="82" rx="49" ry="48" fill="#e8b36f" stroke="#a87545" stroke-width="4"/><circle cx="62" cy="78" r="6" fill="#30364f"/><circle cx="98" cy="78" r="6" fill="#30364f"/><circle cx="80" cy="96" r="8" fill="#f3b0b8"/><path fill="none" stroke="#a87545" stroke-width="3" d="M80 103v10m-8 0h16"/></svg>`,
    turtle: `<svg viewBox="0 0 160 140" aria-hidden="true"><ellipse cx="78" cy="77" rx="56" ry="42" fill="#4f9d70" stroke="#31704e" stroke-width="5"/><path fill="#72c49a" stroke="#31704e" stroke-width="4" d="M120 68c23-11 32 0 29 13-3 11-17 14-31 5M34 49c-16-13-28-5-26 7 2 11 12 15 25 11m4 44c-14 13-4 24 8 21 9-2 13-11 9-21m57-1c13 14 26 4 22-7-3-9-13-12-22-8z"/><path fill="#8dd6a9" stroke="#31704e" stroke-width="3" d="M48 77c14-23 49-29 66-4-10 9-21 14-34 15-13 1-23-3-32-11z"/><circle cx="139" cy="76" r="3" fill="#30364f"/></svg>`,
    fox: `<svg viewBox="0 0 160 140" aria-hidden="true"><path fill="#e8864e" stroke="#a34c2b" stroke-width="4" d="M29 53 35 13l31 25c9-3 19-3 28 0l31-25 6 40c7 9 10 19 10 32 0 29-24 43-50 43s-50-14-50-43c0-13 3-23 10-32z"/><path fill="#fff4e5" d="M53 92q27 20 54 0c-5 21-17 29-27 29s-22-8-27-29z"/><circle cx="62" cy="76" r="6" fill="#30364f"/><circle cx="98" cy="76" r="6" fill="#30364f"/><path fill="#30364f" d="M74 91c0-8 12-8 12 0s-12 8-12 0z"/></svg>`,
    owl: `<svg viewBox="0 0 160 140" aria-hidden="true"><path fill="#806ab4" stroke="#574486" stroke-width="4" d="M80 17c-35 0-54 27-49 75 3 30 24 40 49 40s46-10 49-40c5-48-14-75-49-75z"/><circle cx="57" cy="68" r="23" fill="#f5e6b7" stroke="#574486" stroke-width="4"/><circle cx="103" cy="68" r="23" fill="#f5e6b7" stroke="#574486" stroke-width="4"/><circle cx="58" cy="70" r="7" fill="#30364f"/><circle cx="102" cy="70" r="7" fill="#30364f"/><path fill="#e5a94d" d="m80 75 10 12-10 10-10-10z"/></svg>`,
    penguin: `<svg viewBox="0 0 160 140" aria-hidden="true"><ellipse cx="80" cy="76" rx="48" ry="58" fill="#46516e" stroke="#30364f" stroke-width="4"/><ellipse cx="80" cy="84" rx="31" ry="45" fill="#f5f1e9"/><circle cx="63" cy="55" r="6" fill="white"/><circle cx="97" cy="55" r="6" fill="white"/><circle cx="63" cy="55" r="3" fill="#30364f"/><circle cx="97" cy="55" r="3" fill="#30364f"/><path fill="#f0b652" d="m70 67 20 0-10 13z"/><path fill="#f0b652" d="M51 127h24l-12 8zm34 0h24l-12 8z"/></svg>`,
    frog: `<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="52" cy="40" r="24" fill="#79cf87" stroke="#3b9861" stroke-width="4"/><circle cx="108" cy="40" r="24" fill="#79cf87" stroke="#3b9861" stroke-width="4"/><ellipse cx="80" cy="86" rx="55" ry="45" fill="#66bd78" stroke="#3b9861" stroke-width="4"/><circle cx="52" cy="39" r="7" fill="#30364f"/><circle cx="108" cy="39" r="7" fill="#30364f"/><path fill="none" stroke="#3b9861" stroke-width="4" stroke-linecap="round" d="M54 96q26 21 52 0"/></svg>`,
    parrot: `<svg viewBox="0 0 160 140" aria-hidden="true"><path fill="#4b9bd0" stroke="#326d9a" stroke-width="4" d="M73 30c-23 4-39 28-34 62 4 27 23 39 45 39 26 0 39-17 38-42-1-36-21-64-49-59z"/><path fill="#f0808b" d="M49 77c16-18 35-16 47 6-10 26-30 31-47 12z"/><circle cx="90" cy="53" r="7" fill="white"/><circle cx="92" cy="53" r="3" fill="#30364f"/><path fill="#f4c76b" stroke="#aa7541" stroke-width="3" d="m104 50 39 13-38 14z"/><path fill="#f4c76b" d="M65 127h20l-10 10z"/></svg>`,
  };
  return drawings[type] || drawings.dog;
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
  elements.face.textContent = "";
  elements.face.className = `pet-face pet-art pet-${game.type}`;
  elements.face.innerHTML = petSvg(game.type);
  elements.face.setAttribute("aria-label", `${game.name} the ${pet.label}`);
  elements.coins.textContent = game.coins;
  elements.savings.textContent = game.coins;
  elements.savingsMessage.textContent = game.coins ? `${game.name} is helping you save little by little!` : "Play with your pet to earn more coins.";
  elements.happinessValue.textContent = `${game.happiness}%`;
  elements.happinessMeter.style.width = `${game.happiness}%`;
  elements.energyValue.textContent = `${game.energy}%`;
  elements.energyMeter.style.width = `${game.energy}%`;
  document.querySelectorAll(".pet-choice").forEach(button => {
    button.classList.toggle("selected", button.dataset.pet === game.type);
    button.querySelector(".choice-art").innerHTML = petSvg(button.dataset.pet);
  });
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
