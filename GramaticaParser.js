export default class GramaticaParser {
    constructor(tokens) {
        this.tokens = tokens;
        this.index = 0;
        this.errors = [];
    }

    peek() {
        return this.tokens[this.index] || { type: 'EOF', text: '' };
    }

    consume(expectedType, errorMsg) {
        let tok = this.peek();
        if (tok.type === expectedType) {
            this.index++;
            return tok;
        }
        this.errors.push(`❌ ERROR Sintáctico en Línea ${tok.line}:${tok.column} -> Esperaba '${errorMsg}', se encontró: [${tok.text}]`);
        return null;
    }

    parse() {
        let ast = { type: 'programa', hijos: [] };
        
        while (this.peek().type !== 'EOF' && this.errors.length === 0) {
            let inst = this.parseInstruccion();
            if (inst) ast.hijos.push(inst);
            else break;
        }
        
        return { ast, errors: this.errors };
    }

    parseInstruccion() {
        let tok = this.peek();
        if (tok.type === 'MIENTRAS') {
            return this.parseBucle();
        } else if (tok.type === 'IMPRIMIR') {
            return this.parseSalida();
        } else {
            this.errors.push(`❌ ERROR Sintáctico en Línea ${tok.line}:${tok.column} -> Instrucción no reconocida comenzando con [${tok.text}]`);
            this.index++;
            return null;
        }
    }

    parseBucle() {
        let nodo = { type: 'bucle', condicion: '', cuerpo: [] };
        this.consume('MIENTRAS', 'mientras');
        
        let condTok = this.peek();
        if (condTok.type === 'VERDADERO' || condTok.type === 'FALSO') {
            nodo.condicion = condTok.text;
            this.index++;
        } else {
            this.errors.push(`❌ ERROR Sintáctico en Línea ${condTok.line}:${condTok.column} -> Se esperaba una condición ('verdadero' o 'falso')`);
        }

        this.consume('LLAVE_ABRE', '{');

        while (this.peek().type !== 'LLAVE_CIERRA' && this.peek().type !== 'EOF' && this.errors.length === 0) {
            let inst = this.parseInstruccion();
            if (inst) nodo.cuerpo.push(inst);
        }

        this.consume('LLAVE_CIERRA', '}');
        return nodo;
    }

    parseSalida() {
        let nodo = { type: 'salida', cadena: '' };
        this.consume('IMPRIMIR', 'imprimir');
        this.consume('PARENTESIS_ABRE', '(');
        
        let cadTok = this.consume('TEXTO_CADENA', 'una cadena de texto entre comillas');
        if (cadTok) nodo.cadena = cadTok.text;

        this.consume('PARENTESIS_CIERRA', ')'); // Buscará cerrar paréntesis
        this.consume('PUNTO_Y_COMA', ';');
        return nodo;
    }
}