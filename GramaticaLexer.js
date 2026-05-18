export default class GramaticaLexer {
    constructor(input) {
        this.input = input;
        this.index = 0;
        this.line = 1;
        this.column = 1;
        this.errors = [];
    }

    error(msg) {
        this.errors.push(`❌ ERROR Léxico en Línea ${this.line}:${this.column} -> ${msg}`);
    }

    obtenerTokens() {
        const tokens = [];
        
        while (this.index < this.input.length) {
            let char = this.input[this.index];

            // Manejo de saltos de línea y espacios
            if (char === '\n') {
                this.line++;
                this.column = 1;
                this.index++;
                continue;
            }
            if (/\s/.test(char)) {
                this.index++;
                this.column++;
                continue;
            }

            // Detectar Cadenas de texto: "..."
            if (char === '"') {
                let startCol = this.column;
                let text = '"';
                this.index++; this.column++;
                
                while (this.index < this.input.length && this.input[this.index] !== '"' && this.input[this.index] !== '\n') {
                    text += this.input[this.index];
                    this.index++; this.column++;
                }
                
                if (this.index < this.input.length && this.input[this.index] === '"') {
                    text += '"';
                    this.index++; this.column++;
                    tokens.push({ type: 'TEXTO_CADENA', text, line: this.line, column: startCol });
                } else {
                    this.error(`Cadena de texto sin cerrar: ${text}`);
                }
                continue;
            }

            // Símbolos de un solo carácter
            if (['{', '}', '(', ')', ';'].includes(char)) {
                let type = '';
                if (char === '{') type = 'LLAVE_ABRE';
                if (char === '}') type = 'LLAVE_CIERRA';
                if (char === '(') type = 'PARENTESIS_ABRE';
                if (char === ')') type = 'PARENTESIS_CIERRA';
                if (char === ';') type = 'PUNTO_Y_COMA';
                
                tokens.push({ type, text: char, line: this.line, column: this.column });
                this.index++; this.column++;
                continue;
            }

            // Identificar Palabras (mientras, imprimir, verdadero, falso)
            if (/[a-zA-Z]/.test(char)) {
                let startCol = this.column;
                let word = '';
                while (this.index < this.input.length && /[a-zA-Z0-9]/.test(this.input[this.index])) {
                    word += this.input[this.index];
                    this.index++; this.column++;
                }

                let type = 'IDENTIFICADOR';
                if (word === 'mientras') type = 'MIENTRAS';
                if (word === 'imprimir') type = 'IMPRIMIR';
                if (word === 'verdadero') type = 'VERDADERO';
                if (word === 'falso') type = 'FALSO';

                tokens.push({ type, text: word, line: this.line, column: startCol });
                continue;
            }

            // Si llegó acá, es un carácter que la gramática no reconoce (Error Léxico)
            this.error(`Carácter inválido no reconocido por la gramática: '${char}'`);
            this.index++; this.column++;
        }

        return { tokens, errors: this.errors };
    }
}