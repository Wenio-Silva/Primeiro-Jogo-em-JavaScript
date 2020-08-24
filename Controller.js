import { ctx, LARGURA, ALTURA, chao, Personagem, obstaculos, estadoAtual, estados, record, leveln, atualiza, main } from "./Model.js";
import { bg, telaInicial, telaFinal, Personagem1 } from "./Sprites.js";

//Declara o objeto como a unica exportação do arquivo
export var impressao = {
    //Impressões dos objetos
    
    desenhaPersonagem: function() {
        Personagem1.desenha(Personagem.x, Personagem.y);
    },

    desenhaTelaInicial: function() {
        if (estadoAtual == estados.jogar) {
            telaInicial.desenha(168, 170);
        }
    },

    desenhaTelaFinal: function() {
        if (estadoAtual == estados.perdeu) {
            telaFinal.desenha(168, 170);
    
            ctx.save();
            ctx.translate(LARGURA / 2, ALTURA / 2);
            ctx.fillStyle = "#fff";
    
            ctx.restore();
        }
    },

    //Níveis
    desenhaPontuacao: function(){
        ctx.font = "25px Helvetica, Arial";
        ctx.fillStyle = "black";
        ctx.fillText("Nível: " + leveln, 450, 60);

        if (Personagem.score > record && estadoAtual==estados.perdeu) {
            ctx.font = "25px Helvetica, Arial";
            ctx.fillText(`Novo Record! ${record}`, 150, 65);
        }else {
            ctx.font = "25px Helvetica, Arial";
            ctx.fillText(`Record: ${record}`, 50, 90);
        }
    },

    //encapsuladora
    Sprites: function() {
        bg.desenha(0, 0);

        this.desenhaTelaInicial();

        this.desenhaTelaFinal();

        obstaculos.desenha();

        chao.desenha();

        this.desenhaPersonagem();
        
        this.desenhaPontuacao();
    },

    //Atualiza os sprites a cada frame
    roda: function() {
        atualiza();
        impressao.Sprites();
        window.requestAnimationFrame(impressao.roda);
    },
}

//interMain intermedia a conexão do Model para a view
export var bigMain = main;