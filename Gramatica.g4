grammar Gramatica;

// REGLAS SINTÁCTICAS (Parser)
programa    : instruccion* EOF ;
instruccion : bucle | salida ;
bucle       : 'mientras' condicion '{' instruccion* '}' ;
salida      : 'imprimir' '(' cadena ')' ';' ;
condicion   : 'verdadero' | 'falso' ;
cadena      : '"' CARACTER* '"' ;

// REGLAS LÉXICAS (Lexer)
fragment CARACTER : LETRA | DIGITO | ' ' | SIMBOLO ;
fragment LETRA    : [a-zA-Z] ;
fragment DIGITO   : [0-9] ;
fragment SIMBOLO  : ['.' | ',' | '!' | '?' | ':' | ';' | '\''] ;

// Palabras reservadas y símbolos con tokens específicos asignados implícitamente
MIENTRAS  : 'mientras' ;
IMPRIMIR  : 'imprimir' ;
VERDADERO : 'verdadero' ;
FALSO     : 'falso' ;

// Manejo de espacios en blanco ignorados entre tokens
WS : [ \t\r\n]+ -> skip ;