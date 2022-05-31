import {wordsBD, getRandomWord}  from "./words.js";
import {animateCSS}  from "./animate.js";
const CANTWORDS = 6;
const CANTLETTERS = 5;
let currWord = 0;
let currLetter = 0;
let currGuess = [];
let randomWord = "";
let darkMode = JSON.parse(localStorage.getItem('darkMode')) ?? false;
// boton darkmode
const btnDarkMode = document.getElementById('switchDarkMode');

const starGame = async () => {
    const homeGame = document.getElementById("homeGame");
    const dashGame = document.getElementById("dashGame");
    const divLoading = document.getElementById("loading");
    const kboard = document.getElementById('keyboard-cont');
    homeGame.classList.toggle('d-none');
    dashGame.classList.toggle('d-none');
    randomWord = await getRandomWord();
    // console.log(randomWord);
    renderBoard();
    divLoading.classList.toggle('d-none');
    kboard.classList.toggle('d-none');
    // Evento cuando escriben por teclado físico
    window.addEventListener("keyup", (event) => {
        keyboardActions(event.key);
    });
    // Eventos cuando usan el teclado virtual
    kboard.addEventListener('click', (e) => {
        const keyClicked = e.target;
        const keyValue = keyClicked.getAttribute('data-value');
        if(keyValue !== null){
            keyboardActions(keyValue);
        }
        keyClicked.blur();
    });
}

const switchDarkMode = (checkDarkMode) => {
    const body = document.querySelector('body');
    // console.log(checkDarkMode);
    if(checkDarkMode){
        body.classList.add('darkmode');
    }
    else {
        body.classList.remove('darkmode');
    }
    btnDarkMode.checked = checkDarkMode;
    localStorage.setItem('darkMode', JSON.stringify(checkDarkMode));
}
const renderBoard = () => {
    const gameBoardContainer = document.getElementById("game-board");
    // recorre cantidad de filas
    for(let row = 1 ; row <= CANTWORDS; row++){
        // Creamos el div de la fila
        const div = document.createElement("div");
        div.className = 'letter-row';
        // inserta
        gameBoardContainer.appendChild(div);

        // recorre las letras por fila
        for(let letter = 1; letter <= CANTLETTERS; letter++){
            // creamos la letra
            const celda = document.createElement("div");
            celda.className = 'letter-box';
            // inserta
            div.appendChild(celda);
        }
    }
}

// Función que ingresa letra en el tablero
const insertLetter = (newLetter) => {
    if(currLetter < CANTLETTERS){
        const word = document.querySelectorAll('#game-board .letter-row')[currWord];
        const letter = word.children[currLetter];
        animateCSS(letter, "fadeIn", undefined, 0.2);
        letter.innerText = newLetter;
        currGuess.push(newLetter)
        currLetter++;
    }
}

// Función que elimina letra del tablero
const deleteLetter = () => {
    if(currLetter > 0){
        const word = document.querySelectorAll('#game-board .letter-row')[currWord];
        const letter = word.children[(currLetter - 1)];
        animateCSS(letter, "fadeOut", undefined, 0.2);
        letter.innerText = '';
        currGuess.pop();
        currLetter--;
    }
}

const checkLetter = (letter, index) => {
    letter = letter.toLowerCase();
    let correct = 'incorrect';
    // console.log(randomWord, index);
    randomWord['array'].forEach((row, i) => {
        if(row.letter == letter && i === index && row.validated === false){
            correct = 'correct';
            row.validated = true;
        }
        if(row.letter == letter && i !== index && row.validated === false && correct === 'incorrect'){
            correct = 'inWord';
            row.validated = true;
        }
        // console.log(row.letter, letter, i, row.validated);
    });
    return correct;
}

// Función que valida la palabra al presionar enter
const validateWord = async () => {
    // console.log(currLetter);
    // console.log(currWord);
    const word = document.querySelectorAll('#game-board .letter-row')[currWord];
    if(currLetter !== CANTLETTERS && currWord < CANTWORDS){
        animateCSS(word, "headShake", undefined, 0.8);
        Toastify({
            text: "La palabra debe contener 5 letras",
            className: "bg-danger bg-gradient text-white",
            style: {
                background: "unset",
            }
        }).showToast();
    }
    if(currLetter === CANTLETTERS && currWord < CANTWORDS){
        let thisGuess = currGuess.join('');
        if(!wordsBD.some((row) => row == thisGuess)){
            animateCSS(word, "headShake", undefined, 0.8);
            Toastify({
                text: `La palabra '${thisGuess}' no existe en el diccionario`,
                className: "bg-danger bg-gradient text-white",
                style: {
                    background: "unset",
                }
            }).showToast();
            return false;
        }
        // console.log(word);
        let index = 0;
        let correct = true;
        for (const letter of word.children) {
            const letterText = letter.innerText.toLowerCase();
            const thisLetter = checkLetter(letterText, index);
            // console.log(letterText);
            letter.classList.add(thisLetter);
            document.querySelector(`.keyboard-button[data-value="${letterText}"]`).classList.add(thisLetter);
            await animateCSS(letter, 'fadeIn', undefined, 0.3);
            if(thisLetter !== 'correct'){
                correct = false;
            }
            index++;
        }
        if(correct){
            Swal.fire(
                '¡Felicitaciones!',
                '¡Adivinaste la palabra!',
                'success'
            );
            currWord = CANTWORDS;
            currLetter = CANTLETTERS;
        }
        else {
            // reseteo validaciones
            randomWord['array'].map((row) => row.validated = false);
            currWord++;
            currLetter = 0;
            currGuess = [];
        }
        // console.log(currWord);
    }
}

// Acciones del teclado / teclado virtual
const keyboardActions = (letter) => {
    letter = letter.trim();
    if (letter.length === 1) {
        insertLetter(letter);
    }
    if(letter === 'Backspace'){
        deleteLetter();
    }
    if(letter === 'Enter'){
        validateWord();
    }
}

// Función inicial
window.addEventListener("DOMContentLoaded", (event) => {
    // acción del botón de inicio de juego  
    const btnStart = document.getElementById('btn-start');
    btnStart.addEventListener('click', (e) => {
        starGame();
    });

    // acción boton darkmode
    btnDarkMode.onclick = (e) => {
        const checkDarkMode = btnDarkMode.checked;
        switchDarkMode(checkDarkMode);
    };
    //Ejecutamos por primera vez el darkmode
    switchDarkMode(darkMode);
});