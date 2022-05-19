import wordsBD  from "./words.js";
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
const insertLetter = (newLetter) => {
    if(currLetter < CANTLETTERS){
        const word = document.querySelectorAll('.letter-row')[currWord];
        const letter = word.querySelectorAll('.letter-box')[currLetter];
        animateCSS(letter, "fadeIn", undefined, 0.2);
        letter.innerHTML = newLetter;
        currGuess.push(newLetter)
        currLetter++;
    }
}
const deleteLetter = () => {
    if(currLetter > 0){
        const word = document.querySelectorAll('.letter-row')[currWord];
        const letter = word.querySelectorAll('.letter-box')[(currLetter - 1)];
        animateCSS(letter, "fadeOut", undefined, 0.2);
        letter.innerHTML = '';
        currGuess.pop();
        currLetter--;
    }
}
const validateWord = () => {
    // console.log(currLetter);
    // console.log(currWord);
    if(currLetter === CANTLETTERS && currWord < CANTWORDS){
        let word = currGuess.join('');
        if(!wordsBD.some((row) => row == word)){
            const word = document.querySelectorAll('.letter-row')[currWord];
            animateCSS(word, "headShake", undefined, 0.8);
            return false;
        }
        currWord++;
        currLetter = 0;
        currGuess = [];
        // console.log(currWord);
    }
}
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
window.addEventListener("DOMContentLoaded", (event) => {
    renderGameBoard();
    window.addEventListener("keyup", (event) => {
        keyboardActions(event.key);
    })
    const btnVirtualKB = document.querySelectorAll(".keyboard-button");
    for(let i = 0; i < btnVirtualKB.length; i++){
        let keyb = btnVirtualKB[i];
        keyb.addEventListener('click', () => {
            keyboardActions(keyb.getAttribute('data-value'));
        })
    }
});