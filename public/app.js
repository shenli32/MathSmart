const pets = {
  dog: { emoji: "🐶", label: "Dog" },
  cat: { emoji: "🐱", label: "Cat" },
  bunny: { emoji: "🐰", label: "Bunny" },
  hamster: { emoji: "🐹", label: "Hamster" },
  turtle: { emoji: "🐢", label: "Turtle" },
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

render();
