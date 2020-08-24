import { img, ctx } from "./Model.js";

function Sprite(x, y, largura, altura, larguraReal, alturaReal) {
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;
    this.larguraReal = larguraReal;
    this.alturaReal = alturaReal; 

    this.desenha = function(xCanvas, yCanvas) {
        ctx.drawImage(img, this.x, this.y, this.largura, this.altura, xCanvas, yCanvas, this.larguraReal, this.alturaReal);
    };
};

export var desenhaChao = new Sprite(0, 0, 600, 50, 600, 50),
Personagem1 = new Sprite(256, 104, 41, 50, 41, 50),
Personagem2 = new Sprite(314, 106, 31, 48, 31, 48),
Personagem3 = new Sprite(361, 104, 34, 50, 34, 50),
Personagem4 = new Sprite(401, 103, 50, 50, 50, 50),
Personagem5 = new Sprite(256, 158, 43, 49, 43, 49),
Personagem6 = new Sprite(311, 159, 35, 50, 35, 50),
Personagem7 = new Sprite(363, 159, 33, 50, 33, 50),
Personagem8 = new Sprite(406, 159, 37, 50, 37, 50),

bg = new Sprite(0, 294, 600, 844, 600, 844),

obs1 = new Sprite(14, 178, 26, 29, 32, 35),
obs2 = new Sprite(62, 108, 45, 99, 45, 99),
obs3 = new Sprite(134, 181, 17, 26, 17, 26),
obs4 = new Sprite(190, 178, 26, 29, 26, 29),

moeda = new Sprite(475, 73, 50, 50, 50, 50),

telaInicial = new Sprite(19, 863, 264, 259, 264, 259),
telaFinal = new Sprite(316, 864, 264, 259, 264, 259);