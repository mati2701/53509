import fs from 'fs';
import GramaticaLexer from './GramaticaLexer.js';
import GramaticaParser from './GramaticaParser.js';

// --- CONFIGURACIÓN DE PRUEBA ---
// Cambia este nombre para pasear por tus 4 archivos txt:
// 'correcto1.txt', 'correcto2.txt', 'incorrecto1.txt', 'incorrecto2.txt'
const ARCHIVO_A_PROBAR = 'input_correcto1.txt'; 

function ejecutarAnalizador() {
    if (!fs.existsSync(ARCHIVO_A_PROBAR)) {
        console.error(`No se encontró el archivo de prueba: ${ARCHIVO_A_PROBAR}`);
        return;
    }

    console.log(`=========================================`);
    console.log(`📂 PROBANDO ARCHIVO: ${ARCHIVO_A_PROBAR}`);
    console.log(`=========================================\n`);
    
    const input = fs.readFileSync(ARCHIVO_A_PROBAR, 'utf-8');

    // 1. Ejecutar Análisis Léxico
    const lexer = new GramaticaLexer(input);
    const { tokens, errors: lexErrors } = lexer.obtenerTokens();

    if (lexErrors.length > 0) {
        console.log("=== PUNTO 1: ERRORES LÉXICOS ENCONTRADOS ===");
        lexErrors.forEach(err => console.error(err));
        return;
    }

    // 2. Ejecutar Análisis Sintáctico
    const parser = new GramaticaParser(tokens);
    const { ast, errors: sinErrors } = parser.parse();

    if (sinErrors.length > 0) {
        console.log("=== PUNTO 1: ERRORES SINTÁCTICOS ENCONTRADOS ===");
        sinErrors.forEach(err => console.error(err));
        return;
    }

    console.log("✅ PUNTO 1: Análisis completado sin errores léxicos ni sintácticos.\n");

    // PUNTO 2: Tabla de lexemas y tokens reconocidos
    console.log("=== PUNTO 2: TABLA DE LEXEMAS Y TOKENS ===");
    console.log(`-------------------------------------------------`);
    console.log(`Lexema\t\t\t\t| Token`);
    console.log(`-------------------------------------------------`);
    tokens.forEach(t => {
        let lexema = t.text.replace(/\n/g, '\\n');
        if (lexema.length < 8) lexema += '\t\t\t';
        else if (lexema.length < 16) lexema += '\t\t';
        else lexema += '\t';
        console.log(`${lexema}\t| ${t.type}`);
    });
    console.log(`-------------------------------------------------\n`);

    // PUNTO 3: Mostrar el Árbol Sintáctico Concrete (Representación Textual)
    console.log("=== PUNTO 3: ÁRBOL SINTÁCTICO CONCRETO ===");
    
    function imprimirArbol(nodo, sangria = "") {
        if (nodo.type === 'programa') {
            console.log(`${sangria}(programa`);
            nodo.hijos.forEach(h => imprimirArbol(h, sangria + "  "));
            console.log(`${sangria})`);
        } else if (nodo.type === 'bucle') {
            console.log(`${sangria}(bucle mientras (condicion ${nodo.condicion}) {`);
            nodo.cuerpo.forEach(h => imprimirArbol(h, sangria + "    "));
            console.log(`${sangria}})`);
        } else if (nodo.type === 'salida') {
            console.log(`${sangria}(salida imprimir (cadena ${nodo.cadena});)`);
        }
    }
    imprimirArbol(ast);
    console.log("\n");

    // PUNTO 4: Traducción a JavaScript y Simulación del Intérprete
    console.log("=== PUNTO 4: TRADUCCIÓN A JAVASCRIPT & EJECUCIÓN ===");
    
    function generarCodigoJS(nodo) {
        let codigo = "";
        if (nodo.type === 'programa') {
            nodo.hijos.forEach(h => codigo += generarCodigoJS(h));
        } else if (nodo.type === 'bucle') {
            let condJS = nodo.condicion === 'verdadero' ? 'true' : 'false';
            codigo += `while (${condJS}) {\n`;
            nodo.cuerpo.forEach(h => {
                codigo += "  " + generarCodigoJS(h).replace(/\n/g, '\n  ').trim() + "\n";
            });
            codigo += `  break; // Break de seguridad para evitar congelar la consola\n}\n`;
        } else if (nodo.type === 'salida') {
            codigo += `console.log(${nodo.cadena});\n`;
        }
        return codigo;
    }

    const codigoTraducido = generarCodigoJS(ast);
    console.log("--- [Código JS Traducido] ---");
    console.log(codigoTraducido);

    console.log("--- [Ejecución del Intérprete] ---");
    try {
        eval(codigoTraducido);
    } catch (e) {
        console.error("Error durante la interpretación:", e.message);
    }
    console.log("=========================================\n");
}

ejecutarAnalizador();