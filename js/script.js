import {wordsBD, getRandomWord}  from "./words.js";
import {animateCSS}  from "./animate.js";
const CANTWORDS = 6;
const CANTLETTERS = 5;
let currWord = 0;
let currLetter = 0;
let currGuess = [];

const renderGameBoard = () => {
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
        const word = document.querySelectorAll('.letter-row')[currWord];
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
        const word = document.querySelectorAll('.letter-row')[currWord];
        const letter = word.children[(currLetter - 1)];
        animateCSS(letter, "fadeOut", undefined, 0.2);
        letter.innerText = '';
        currGuess.pop();
        currLetter--;
    }
}

// Función que valida la palabra al presionar enter
const validateWord = async () => {
    // console.log(currLetter);
    // console.log(currWord);
    const word = document.querySelectorAll('.letter-row')[currWord];
    if(currLetter !== CANTLETTERS && currWord < CANTWORDS){
        animateCSS(word, "headShake", undefined, 0.8);
        Toastify({
            text: "La palabra debe contener 5 letras",
            style: {
                background: "rgb(220,53,69)",
                background: "linear-gradient(90deg, rgba(220,53,69,1) 0%, rgba(255,108,122,1) 100%)"
            }
        }).showToast();
    }
    if(currLetter === CANTLETTERS && currWord < CANTWORDS){
        let thisGuess = currGuess.join('');
        if(!wordsBD.some((row) => row == thisGuess)){
            animateCSS(word, "headShake", undefined, 0.8);
            Toastify({
                text: `La palabra '${thisGuess}' no existe en el diccionario`,
                style: {
                    background: "rgb(220,53,69)",
                    background: "linear-gradient(90deg, rgba(220,53,69,1) 0%, rgba(255,108,122,1) 100%)"
                }
            }).showToast();
            return false;
        }
        console.log(word);
        for (const letter of word.children) {
            letter.classList.add('incorrect')
            await animateCSS(letter, 'fadeIn', undefined, 0.4);
        }
        currWord++;
        currLetter = 0;
        currGuess = [];
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
    // const randomWord = await getRandomWord();
    // console.log(randomWord);
    
    // Renderizamos tablero
    renderGameBoard();
    // Evento cuando escriben por teclado físico
    window.addEventListener("keyup", (event) => {
        keyboardActions(event.key);
    })
    // Eventos cuando usan el teclado virtual
    const btnVirtualKB = document.querySelectorAll(".keyboard-button");
    for(const keyb of btnVirtualKB) {
        keyb.addEventListener('click', () => {
            keyboardActions(keyb.getAttribute('data-value'));
        });
    }
});