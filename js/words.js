export const wordsBD = [
    "ameno", "ficus", "audio", "ratio", "laser",
    "dieta", "avena", "fuego", "duelo", "sueño",
    "cuero", "cielo", "nieto", "bolsa", "raton",
    "mosca", "saber", "jamon", "natal", "cuqui",
    "patin", "rapar", "canto", "arbol", "dardo",
    "covid", "gmail", "robar", "caeis", "padel",
    "caigo", "ganar", "metro", "cajon", "tonto",
    "arroz", "cejas", "manos", "brazo", "vamos",
    "vengo", "estar", "comer", "mojar", "orden",
    "beber", "decir", "poner", "madre", "padre",
    "llano", "hondo", "lindo", "caldo", "fumar",
    "cagar", "mocos", "vaper", "gatos", "perro",
    "ratas", "potos", "pollo", "porro", "chulo",
    "delta", "aireo", "fresa", "guapa", "guapo",
    "coche", "carro", "cavar", "adios", "cardo",
    "coral", "fiera", "fideo", "aleta", "parto",
    "golfo", "atado", "fuera", "tanto", "suave",
    "poema", "nueva", "menos", "trufa", "cerda",
    "rampa", "super", "litio", "cutre", "culos",
    "ratos", "monta", "suero", "tongo", "criba",
    "insta", "toros", "toreo", "ruedo", "juego",
    "claro", "rotar", "astro", "agrio", "rubio",
    "monja", "perno", "recta", "resta", "rubia",
    "ramon", "potra", "gordo", "gorda", "arpia",
    "jarto", "basto", "molar", "tetas", "bufas", 
    "frigo", "tripa", "bravo", "berza", "droga", 
    "listo", "razon", "terca", "brava", "serie",
    "busca", "guiar", "potar", "pitar", "justo", 
    "crudo", "moñas", "penas", "menas", "brasa",
    "venas", "demas", "bruma", "plata", "karma",
    "pares", "hijas", "hijos", "pagar", "zorro",
    "atroz", "piano", "enano", "aureo", "cloro",
    "cromo", "corro", "piara", "pinos", "rupia",
    "panes", "silba", "falta", "doblo", "porra",
    "turra", "saque", "nadie"
];

export const getRandomWord = async () => {
    try {
        const response = await fetch('https://palabras-aleatorias-public-api.herokuapp.com/random-by-length?length=5');
        const randomWord = await response.json();
        return randomWord.body["Word"];
    } catch (error) {
        console.log("Hubo un error");
    }
}