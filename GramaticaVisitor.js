import antlr4 from 'antlr4';

export default class GramaticaVisitor extends antlr4.tree.ParseTreeVisitor {
    visitPrograma(ctx) { return this.visitChildren(ctx); }
    visitInstruccion(ctx) { return this.visitChildren(ctx); }
    visitBucle(ctx) { return this.visitChildren(ctx); }
    visitSalida(ctx) { return this.visitChildren(ctx); }
    visitCondicion(ctx) { return this.visitChildren(ctx); }
}