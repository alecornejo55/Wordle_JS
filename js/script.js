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

const resetGame = () => {
    //Volvemos a 0 las variables
    currWord = 0;
    currLetter = 0;
    currGuess = [];

    // Vaciamos el tablero
    const gameBoardContainer = document.getElementById("game-board");
    gameBoardContainer.innerHTML = '';

    // Quitamos estilos al keyboard virtual
    const keys = document.querySelectorAll('.keyboard-button');
    keys.forEach(key => {
        key.classList.remove('correct');
        key.classList.remove('inWord');
        key.classList.remove('incorrect');
    });

    startGame();
};
// Función de inicio de juego
const startGame = async () => {
    const homeGame = document.getElementById("homeGame");
    const dashGame = document.getElementById("dashGame");
    const divLoading = document.getElementById("loading");
    const kboard = document.getElementById('keyboard-cont');

    // Oculta el home, mostramos el juego
    homeGame.classList.add('d-none');
    dashGame.classList.remove('d-none');
    divLoading.classList.remove('d-none');

    // Oculta el teclado
    kboard.classList.add('d-none');

    // Obtiene una palabra aleatoria y renderiza el tablero
    randomWord = await getRandomWord();

    // Fuerzo un timeout para que se vea el loading (menos de 1 segundo)
    setTimeout(() => {
        renderBoard();
        // Oculta el loading y muestra el teclado
        divLoading.classList.add('d-none');
        kboard.classList.remove('d-none');
    }, 800);
    
    // Evento cuando escriben por teclado físico
    window.onkeyup = (event) => {
        keyboardActions(event.key);
    };
    // Eventos cuando usan el teclado virtual
    kboard.onclick = (e) => {
        const keyClicked = e.target;
        const keyValue = keyClicked.getAttribute('data-value');
        if(keyValue !== null){
            keyboardActions(keyValue);
        }
        keyClicked.blur();
    };
}
// Función de finalización de juego
const finishGame = (result) => {
    let word = randomWord.word.toUpperCase();
    let title = `¡Oops!`;
    let message = `¡Perdiste! La palabra era "<b>${word}</b>"`;
    let icon = `error`;
    
    if(result){
        title = `¡Felicitaciones!`;
        message = `¡Adivinaste la palabra!`;
        icon = `success`;
    }

    currWord = CANTWORDS;
    currLetter = CANTLETTERS;

    Swal.fire({
        title: `${title}`,
        html: `${message}<br>¿Querés jugar de nuevo?`,
        icon: `${icon}`,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cerrar',
        confirmButtonText: 'Volver a jugar',
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-secondary'
        },
    })
    .then((result) => {
        // Pregunta si desea jugar otra vez
        if (result.isConfirmed) {
            resetGame();
        }
    })
}
// Función que habilita / deshabilita el darkmode
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

// Función que renderiza el tablero
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
    // Si la cantidad de letras es menor a la cantidad de letras del tablero
    if(currLetter < CANTLETTERS){
        const word = document.querySelectorAll('#game-board .letter-row')[currWord];
        const letter = word.children[currLetter];
        animateCSS(letter, "fadeIn", undefined, 0.2);
        letter.innerText = newLetter;
        
        // Inserta la letra en el array de letras
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
    // Extrae la palabra que se ingresó
    const word = document.querySelectorAll('#game-board .letter-row')[currWord];

    // Si escribió menos de la cantidad de letras requeridas y si no terminó el juego
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

    // Si escribió la cantidad de letras requeridas y si no terminó el juego
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

            letter.classList.add(thisLetter);
            const keyV = document.querySelector(`.keyboard-button[data-value="${letterText}"]`);
            // remuevo la clase inword del teclado físico por si la letra fue acertada
            keyV.classList.remove('inWord');

            keyV.classList.add(thisLetter);

            await animateCSS(letter, 'fadeIn', undefined, 0.3);
            if(thisLetter !== 'correct'){
                correct = false;
            }
            index++;
        }
        if(correct){
            finishGame(true)
        }
        else if( currWord === (CANTWORDS - 1) ){
            finishGame(false)
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
        startGame();
    });

    // acción boton darkmode
    btnDarkMode.onclick = (e) => {
        const checkDarkMode = btnDarkMode.checked;
        switchDarkMode(checkDarkMode);
    };
    //Ejecutamos por primera vez el darkmode
    switchDarkMode(darkMode);
});