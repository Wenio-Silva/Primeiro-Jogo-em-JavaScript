import { ctx, LARGURA, ALTURA, chao, Personagem, obstaculos, estadoAtual, estados, record, leveln, atualiza, main } from "./Model.js";

//Declara o objeto como a unica exportação do arquivo
export var impressao = {
    //Impressões dos objetos
    desenhaChao: function() {
		ctx.fillStyle = chao.cor;
		ctx.fillRect(0, chao.y, LARGURA, ALTURA);
    },
    
    desenhaPersonagem: function() {
		ctx.fillStyle = Personagem.cor;
        ctx.fillRect(Personagem.x, Personagem.y,
        Personagem.largura, Personagem.altura);
    },
    
    desenhaObstaculos: function() {
        if (estadoAtual == estados.jogando){
            for (var i = 0, tam = obstaculos._obs.length; i < tam; i++) {
                var obs = obstaculos._obs[i];
                ctx.fillStyle = obs.cor;
                ctx.fillRect(obs.x, chao.y - obs.altura, obs.largura, obs.altura);
            }
        }
    },

    desenhaTelaInicial: function() {
        if (estadoAtual == estados.jogar) {
            ctx.fillStyle = "green";
            ctx.fillRect(LARGURA / 2 - 50, ALTURA / 2 - 50, 100, 100);
        }
    },

    desenhaTelaFinal: function() {
        if (estadoAtual == estados.perdeu) {
            ctx.fillStyle = "red";
            ctx.fillRect(LARGURA / 2 - 50, ALTURA / 2 - 50, 100, 100);
    
            ctx.save();
            ctx.translate(LARGURA / 2, ALTURA / 2);
            ctx.fillStyle = "#fff";
    
            ctx.restore();
        }
    },

    desenhaPlanoDeFundo: function() {
        ctx.fillStyle = "#50beff";
        ctx.fillRect(0, 0, LARGURA, ALTURA);
    },

    //Níveis
    desenhaPontuacao: function(){
        ctx.font = "25px Helvetica, Arial";
        ctx.fillStyle = "yellow";
        ctx.fillText("Nível: " + leveln, 450, 60);

        if (Personagem.score > record && estadoAtual==estados.perdeu) {
            ctx.font = "25px Helvetica, Arial";
            ctx.fillText(`Novo Record! ${record}`, 150, 65);
        }else {
            ctx.font = "25px Helvetica, Arial";
            ctx.fillText(`Record: ${record}`, 50, 60);
        }
    },

    //encapsuladora
    Sprites: function() {
        this.desenhaPlanoDeFundo();

        this.desenhaTelaInicial();

        this.desenhaTelaFinal();
    
        this.desenhaObstaculos();

        this.desenhaChao();
    
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