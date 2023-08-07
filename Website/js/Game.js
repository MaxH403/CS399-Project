
// variable to keep track of current country
let currentCountry = null; 
let incorrectAttempts = 0;
let score=0;
let attemptTime=5

//Set Score
function setScore(){
    let curscore=document.getElementById("game-score");
    curscore.innerHTML=`Score: ${score}`;
}

//Set Attempt
function setAttempt(){
    let curscore=document.getElementById("game-attempt");
    curscore.innerHTML=`Attempt left: ${attemptTime}`;
}

// picks random country to ensure no repeats
async function getRandomCountry() {
    // fetch countries from server
    const response = await fetch('/countries');
    if (!response.ok) {
        console.error(`Error fetching countries: ${response.status}`);
        return;
    }
    // convert response to json 
    const countries = await response.json();
    // pick random country
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * countries.length);
    } while (currentCountry && currentCountry.code === countries[randomIndex].code);

    currentCountry = countries[randomIndex];
    console.log(currentCountry); // This will log the selected country in the console
}

// fetches a flag image from the flagcdn.com API using the country's code
function setRandomImage() {
    // Call the getRandomImageName function to get a random image name
    getRandomCountry().then(() => {
        const flagUrl = `https://flagcdn.com/w320/${currentCountry.code.toLowerCase()}.png`;
        // set image source to random image
        document.getElementById("game-img").src = flagUrl;
        // create empty boxes for user to guess
        createEmptyBoxes(currentCountry.name.length);
        incorrectAttempts = 0 // Reset incorrect attempts
    }).catch(error => {
        console.error('Error:', error); // if there's an error, it will be logged in the console
    });
}


// Function to create empty boxes
function createEmptyBoxes(numBoxes) {
    const boxesContainer = document.getElementById("boxes-container");
    boxesContainer.innerHTML = ''; // Clear previous boxes
    for (let i = 0; i < numBoxes; i++) {
        // create an input box
        const box = document.createElement("input"); 
        box.type = "text";
        box.maxLength = "1"; // limit the input length to 1 character
        box.classList.add("empty-box"); // you can define "empty-box" class in your css

        // Listen to the input event
        box.addEventListener('input', function() {
            // Convert value to uppercase
            box.value = box.value.toUpperCase();

            // If user enters a value and there is a next box, focus it
            if (box.value !== '' && i < numBoxes - 1) {
                boxesContainer.children[i + 1].focus();
            }
        });

        // listen to keydown event for "Enter" and "Backspace" keys
        box.addEventListener('keydown', function(event) {
            if (event.key === "Enter") {
                processGuess();
            } else if (event.key === "Backspace" && box.value === '' && i > 0) {
                // if backspace is pressed in an empty box, move focus to the previous box
                boxesContainer.children[i - 1].focus();
            }
        });
        // append the box to the container
        boxesContainer.appendChild(box);
    }

    // Focus on the first box
    if (numBoxes > 0) {
        boxesContainer.children[0].focus();
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

    const currentWord = currentCountry.name;

    // Check if the length of the user's guess matches the length of the current word
    if (userGuess.length !== currentWord.length) {
        // If lengths don't match, display a prompt and don't process the guess
        alert('Guesses must match character amount in the string!');
        return;
    }

    // Check user's guess against the current word
    compareGuess(guessBoxes);

    // Create a guess row from the boxes
    createGuessRowFromBoxes(guessBoxes);

    // Check if the guess was correct
    let isCorrect = true;
    for (let i = 0; i < guessBoxes.length; i++) {
        if (!guessBoxes[i].classList.contains("correct-letter")) {
            isCorrect = false;
            break;
        }
    }

    clearBoxes(guessBoxes);

    // If the guess was correct, set a new random image and remove all guess rows from previous guesses
    if (!isCorrect){
        incorrectAttempts++;
        if (incorrectAttempts == 3) {
            showHint();
        }
        attemptTime--;
        setAttempt();
    } else {
        alert("Congratulations! You've guessed the correct country!");
        clearKeyColors();
        setRandomImage();
        removeGuessRows(guessBoxes);
        score+=10;
        setScore();
        attemptTime=5;
        incorrectAttempts = 0;
        setAttempt();
    }

    // If the guess was over the attempt times than restart a new game
    if (attemptTime<=0){
        alert(`Game over, correct answer is ${currentCountry.name}`)
        clearKeyColors();
        setRandomImage();
        removeGuessRows(guessBoxes);
        score-=10;
        setScore();
        attemptTime=5;
        incorrectAttempts = 0;
        setAttempt();
    }
    

    // Focus on the first box
    const boxesContainer = document.getElementById("boxes-container");
    if (boxesContainer.children.length > 0) {
        boxesContainer.children[0].focus();
    }
}

function showHint() {
    const hint = currentCountry.continent;
    alert(`Hint: The country is located in ${hint}`);
}


// function to clear boxes
function clearBoxes(guessBoxes) {
    for (let i = 0; i < guessBoxes.length; i++) {
        guessBoxes[i].value = '';  // clear the box
        guessBoxes[i].className = "empty-box";  // reset the class name
    }
}

function updateKeyboard(letter, className) {
    // Select all keys with the given letter
    const keys = document.querySelectorAll(`#keyboard .key[onclick="handleKeyPress('${letter.toUpperCase()}')"]`);
    keys.forEach(key => {
        // If the key is already marked as correct, do not change its class
        if (key.classList.contains("correct-letter")) return;

        // Clear previous classes from the key
        key.className = "key";

        // Add the new class
        key.classList.add(className);
    });
}

// Function to compare the user's guess with the current word from the array
function compareGuess(guessBoxes) {
    const currentWord = currentCountry.name.toUpperCase();

    for (let i = 0; i < currentWord.length; i++) {
        let box = guessBoxes[i];
        let className;

        // Clear previous classes from the box
        box.className = "empty-box";

        if (box.value.toUpperCase() === currentWord[i]) {
            className = "correct-letter";
        } else if (currentWord.includes(box.value.toUpperCase())) {
            className = "right-letter";
        } else {
            className = "wrong-letter";
        }

        box.classList.add(className);
        updateKeyboard(box.value, className);
    }
}

function handleKeyPress(letter) {
    // Find the first empty box
    const boxes = document.querySelectorAll('.empty-box');
    for (const box of boxes) {
      if (box.value === '') {
        box.value = letter;
        break;
      }
    }
}

function clearKeyColors() {
    const keys = document.querySelectorAll('#keyboard .key');
    keys.forEach(key => {
      key.classList.remove('correct-letter', 'right-letter', 'wrong-letter');
    });
}
  

/* 
    Function to create a guess row from the boxes after the user submits a guess to display the result
*/
function createGuessRowFromBoxes(guessBoxes) {
    // create a new div element to hold the guess row and append it to the guess result container
    const guessResultContainer = document.getElementById("guess-result");
    const guessRow = document.createElement("div");
    guessRow.classList.add("guess-row"); // you can define "guess-row" class in your CSS for styling

    for (let i = 0; i < guessBoxes.length; i++) {
        // create a span element to hold the guess box and append it to the guess row
        const guessBox = document.createElement("span");
        guessBox.classList.add("guess-box");
        // set text content of the guess box to value of the input box
        guessBox.textContent = guessBoxes[i].value;

        // logic to set the class name of the guess box
        if (guessBoxes[i].classList.contains("correct-letter")) {
            guessBox.classList.add("correct-letter");
        } else if (guessBoxes[i].classList.contains("right-letter")) {
            guessBox.classList.add("right-letter");
        } else if (guessBoxes[i].classList.contains("wrong-letter")) {
            guessBox.classList.add("wrong-letter");
        }

        guessRow.appendChild(guessBox);
    }

    guessResultContainer.appendChild(guessRow);
}

// removes all guess rows from the guess result container
function removeGuessRows(guessBoxes) {
    // get the guess result container
    const guessResultContainer = document.getElementById("guess-result");
    //get all guess rows
    const guessRows = guessResultContainer.children;
    // clear the guess result container
    guessResultContainer.innerHTML = '';
    
    for (let i = 0; i < guessRows.length; i++) {
        // remove the guess row from the guess result container
        guessResultContainer.removeChild(guessRows[i]);
    }
}

// Function to get random integer from N to M
function getRandom(N, M) {
    return Math.floor(Math.random() * (M - N + 1)) + N;
}

// Set a random image when the webpage is loaded
setRandomImage();
