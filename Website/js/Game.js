// Game.js

const imageNames = ["America", "Australia", "Brazil", "China", "France", "Stonehenge"];
let currentWordIndex = 0; // Index to keep track of the current word from the array
let isSubmitClicked = false;

// Function to get a random image name from the array
function getRandomImageName() {
  let randomIndex;
  do {
    randomIndex = getRandom(0, imageNames.length - 1);
  } while (randomIndex === currentWordIndex); // Repeat until we get a different image

  currentWordIndex = randomIndex;
  return imageNames[randomIndex];
}

// Function to set a random image on the webpage
function setRandomImage() {
  const imageName = getRandomImageName();
  const imgElement = document.getElementById("game-img");
  imgElement.src = `../images/${imageName}.jpg`;
  createEmptyBoxes(imageName.length); // Call function to create empty boxes
}

// Function to create empty boxes
function createEmptyBoxes(numBoxes) {
  const boxesContainer = document.getElementById("boxes-container");
  boxesContainer.innerHTML = ''; // Clear previous boxes
  for (let i = 0; i < numBoxes; i++) {
    const box = document.createElement("input");
    box.type = "text";
    box.maxLength = "1"; // limit the input length to 1 character
    box.classList.add("empty-box"); // you can define "empty-box" class in your css

    // Listen to the input event
    box.addEventListener('input', function() {
      // If user enters a value and there is a next box, focus it
      if (box.value !== '' && i < numBoxes - 1) {
        boxesContainer.children[i + 1].focus();
      }
    });

    // Listen to keydown event for "Enter" and "Backspace" keys
    box.addEventListener('keydown', function(event) {
      if (event.key === "Enter") {
        processGuess();
      } else if (event.key === "Backspace" && box.value === '' && i > 0) {
        // If backspace is pressed in an empty box, move focus to the previous box
        boxesContainer.children[i - 1].focus();
      }
    });

    boxesContainer.appendChild(box);
  }

  // Focus on the first box
  if (numBoxes > 0) {
    boxesContainer.children[0].focus();
  }
}

function compareGuessAndClear(guessBoxes) {
  // Call the original compareGuess function first
  compareGuess(guessBoxes);

  // Then clear the boxes
  for (let i = 0; i < guessBoxes.length; i++) {
    guessBoxes[i].value = '';  // clear the box
    guessBoxes[i].className = "empty-box";  // reset the class name
  }
}

// Add an event listener to the "Submit guess" button
document.getElementById("submit-button").addEventListener("click", processGuess);

function processGuess() {
  // Collect user's guesses from each input box
  const guessBoxes = document.querySelectorAll('.empty-box');
  let userGuess = '';
  guessBoxes.forEach((box) => {
    userGuess += box.value;
  });

  const currentWord = imageNames[currentWordIndex];

  // Check if the length of the user's guess matches the length of the current word
  if (userGuess.length !== currentWord.length) {
    // If lengths don't match, display a prompt and don't process the guess
    alert('Guesses must match character amount in the string!');
    return;
  }

  // Print the guess content to the web page
  printUserGuess(userGuess);

  // Check user's guess against the current word and clear the boxes
  compareGuessAndClear(guessBoxes);

  // Check if the guess was correct
  let isCorrect = true;
  for (let i = 0; i < guessBoxes.length; i++) {
    if (!guessBoxes[i].classList.contains("correct-letter")) {
      isCorrect = false;
      break;
    }
  }

  // If the guess was correct, set a new random image
  if (isCorrect) {
    setRandomImage();
  }

  // Focus on the first box
  const boxesContainer = document.getElementById("boxes-container");
  if (boxesContainer.children.length > 0) {
    boxesContainer.children[0].focus();
  }
}

// Function to compare the user's guess with the current word from the array
function compareGuess(guessBoxes) {
  const currentWord = imageNames[currentWordIndex];
  
  for (let i = 0; i < currentWord.length; i++) {
    let box = guessBoxes[i];

    if (box.value === '') {
      box.classList.remove("correct-letter");
      box.classList.remove("wrong-letter");
      box.classList.remove("right-letter");
    } else if (box.value === currentWord[i]) {
      box.classList.remove("wrong-letter");
      box.classList.remove("right-letter");
      box.classList.add("correct-letter");
    } else if (currentWord.includes(box.value)) {
      box.classList.remove("correct-letter");
      box.classList.remove("wrong-letter");
      box.classList.add("right-letter");
    } else {
      box.classList.remove("correct-letter");
      box.classList.remove("right-letter");
      box.classList.add("wrong-letter");
    }
  }
}

// Function to print the user's guess content to the web page
function printUserGuess(guess) {
  const guessResultContainer = document.getElementById("guess-result");
  const guessRow = document.createElement("div");
  guessRow.classList.add("guess-row"); // you can define "guess-row" class in your CSS for styling

  for (let i = 0; i < guess.length; i++) {
    const guessBox = document.createElement("span");
    guessBox.classList.add("guess-box"); // you can define "guess-box" class in your CSS for styling
    guessBox.textContent = guess[i];

    if (guess[i] === imageNames[currentWordIndex][i]) {
      guessBox.classList.add("correct-letter");
    } else if (imageNames[currentWordIndex].includes(guess[i])) {
      guessBox.classList.add("right-letter");
    } else {
      guessBox.classList.add("wrong-letter");
    }
    
    guessRow.appendChild(guessBox);
  }

  guessResultContainer.appendChild(guessRow);
}

// Function to get random integer from N to M
function getRandom(N, M) {
  return Math.floor(Math.random() * (M - N + 1)) + N;
}

// Set a random image when the webpage is loaded
setRandomImage();
