//variaveis Globais
export var canvas, ctx, ALTURA, LARGURA, frames = 0, maxPulos = 1, velocidade = 6,
estadoAtual, record, TOUCH = 0, leveln = 0,

//Entidades do jogo
estados = {
    jogar: 0,
    jogando: 1,
    perdeu: 2
},

chao = {
    y: 550,
    altura: 50,
    cor: "#e8da78",

    desenha: function() {
        ctx.fillStyle = this.cor;
        ctx.fillRect(0, this.y, LARGURA, ALTURA);
    }
},

bloco = {
    x: 50,
    y: 0,
    largura: 50,
    altura: 50,
    cor: "green",
    gravidade: 1.6,
    velocidade: 0,
    forcaDoPulo: 31.6,
    qntPulos: 0,
    score: 0,

    //soma a gravidade com a velocidade e a velocidade com o y a cada atualização
    atualiza: function() {
        this.velocidade += this.gravidade;
        this.y += this.velocidade;

        //mantém o personagem no chao e reinicia a quantidade de pulos 
        if (this.y > chao.y - this.altura && estadoAtual != estados.perdeu) {
            this.y = chao.y - this.altura;
            this.qntPulos = 0;
            this.velocidade = 0;
        }
    },

    pula: function() {
        //limita a quantidade de pulos
        if (this.qntPulos < maxPulos) {
            this.velocidade = -this.forcaDoPulo;
            this.qntPulos++;
            }
    },

    reset: function() {
        this.velocidade = 0;
        this.y = 0;

        if (this.score > record) {
            localStorage.setItem("record", this.score);
            record = this.score;
        }

        leveln = 0;
        this.score = 0;
    },

    desenha: function() {
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }
},

obstaculos = {
    _obs: [],
    cores: ["red", "yellow", "blue", "purple", "orange"],
    tempoInsere: 0,
    minimoInsere: 0,

    insere: function() {
        this._obs.push({
            x: LARGURA,
        /* A largura do obstaculo tambem variava aleatoriamente
            porém mudei para facilitar a contagem dos pontos (score): 
            largura: 30 + Math.floor(20*Math.random()), */
            largura: 50,
            altura: 30 + Math.floor(120*Math.random()),
            cor: this.cores[Math.floor(5*Math.random())]
        });

        // Niveis de dificuldade distancia e velocidade dos obs
        //this.tempoInsere = 40 + Math.floor(30 * Math.random());
        // 8 linhas de codigo, sendo uma a variavel minimoInsere
        
        if (bloco.score == 0){
            this.minimoInsere = 70;
        }
        
        if (bloco.score % 10 == 0 && this.minimoInsere >= 40)
            this.minimoInsere -= 5;
            //console.log("Decrescimo: " + this.minimoInsere);

        this.tempoInsere = this.minimoInsere + Math.floor(20 * Math.random())
    },
    
    atualiza: function() {
        if (this.tempoInsere == 0){
            this.insere();
        } 
        else 
            this.tempoInsere--;

        for (var i = 0, tam = this._obs.length; i < tam; i++) {
            var obs = this._obs[i];

            obs.x -= velocidade;
            
            //colisão 
            if (bloco.x < obs.x + obs.largura && bloco.x + bloco.largura >=
            obs.x && bloco.y + bloco.altura >= chao.y - obs.altura)
                estadoAtual = estados.perdeu;
            
            // Se o obstaculo passar do personagem soma-se um ponto
            if (obs.x == 48)
                bloco.score++;
            
        
            //retira os obstaculos
            else if (obs.x <= -obs.largura) {
                this._obs.splice(i, 1);
                tam--;
                i--;
            }

        }
    },

    //reinicia o trafego dos obstaculos
    limpa: function() {
        this._obs = [];
    },
};

// Inputs
function toque(e) {
    TOUCH = 1;
    clique();
};

function clique(event) {
    if ( TOUCH == 1 || event.keyCode == 38 || event.keyCode == 87 || event.keyCode == 56 || event.keyCode == 32 ) {
        if (estadoAtual == estados.jogando) {
            bloco.pula();
        }

        else if (estadoAtual == estados.jogar) {
            estadoAtual = estados.jogando;
        }
        else if (estadoAtual == estados.perdeu && bloco.y >= 2 * ALTURA) {
            estadoAtual = estados.jogar;
            obstaculos.limpa();
            bloco.reset();
        }
    }
};

// Função principal
export function main() {
    //window.innerHeight e o width devolvem a altura e largura da tela
    ALTURA = window.innerHeight;
    LARGURA = window.innerWidth;
    
    
    //limita o tamanho da canvas
    if (LARGURA >= 500) {
        LARGURA = 600;
        ALTURA = 600;
    }

    //criação da canvas
    canvas = document.createElement("canvas");
    //delimita a largura e altura do canvas
    canvas.width = LARGURA;
    canvas.height = ALTURA;
    //desenha uma borda solida preta de 1 pixel no perimetro da canvas
    canvas.style.border = "1px solid #000";

    //as animações serão em 2D
    ctx = canvas.getContext("2d");

    //adicionou a canvas como uma tag no documento html. para editala com "css" no "head"
    document.body.appendChild(canvas);

    //detecta o clique do mouse e envia para a funcao "clique"
    //document.addEventListener("mousedown", clique);
    document.addEventListener("keydown", clique);
    document.addEventListener("touchstart", toque);

    //o jogo inicializa no estado "jogar"
    estadoAtual = estados.jogar;

    record = localStorage.getItem("record");

    if (record == null)
        record = 0;



    roda();
};

// Funções secundárias
function roda() {
    atualiza();
    desenha();

    window.requestAnimationFrame(roda);

};

function atualiza() {
    frames++;

    bloco.atualiza();

    if (estadoAtual == estados.jogando)
        obstaculos.atualiza();
};

function desenha () {
					
    ctx.fillStyle = "#50beff";
    ctx.fillRect(0, 0, LARGURA, ALTURA);

    ctx.fillStyle = "#fff";
    ctx.font = "50px Arial";
    ctx.fillText(bloco.score, 30, 68);

    if (estadoAtual == estados.jogar) {
        ctx.fillStyle = "green";
        ctx.fillRect(LARGURA / 2 - 50, ALTURA / 2 - 50, 100, 100);

        //mensagem de play
        ctx.fillStyle = "#fff";
        ctx.fillText("Play", 250, 310);

        //mesagem dos creditos
        ctx.fillStyle = "#fff";
        ctx.font = '20px Helvetica';
        ctx.fillText("criador: Wenio's", 225, 380);
        ctx.fillText("Deseigner: Taisson", 210, 400)
    };

    if (estadoAtual == estados.perdeu) {
        ctx.fillStyle = "red";
        ctx.fillRect(LARGURA / 2 - 50, ALTURA / 2 - 50, 100, 100);

        ctx.save();
        ctx.translate(LARGURA / 2, ALTURA / 2);
        ctx.fillStyle = "#fff";

        // Exibir Record Novo
        if (bloco.score > record)
            ctx.fillText("Novo Record!", -150, -65);

        // Exibir record atual
        else if (record < 10)
            ctx.fillText("Record: " + record, -99, -65);

        else if (record >= 10 && record < 100)
            ctx.fillText("Record: " + record, -112, -65);

        else 
            ctx.fillText("Record: " + record, -125, -65);

        // Exibir Pontuação de cada jogo
        if (bloco.score < 10) {
            ctx.fillText(bloco.score, -13, 19);
            
        }
        else if (bloco.score >= 10 && bloco.score < 100) {
            ctx.fillText(bloco.score, -28, 19);
            
        }
        else {
            ctx.fillText(bloco.score, -43, 19);
            
        }

        ctx.restore();
    }

    if (estadoAtual == estados.jogando){
        obstaculos.desenha();
        
        //Níveis
        if (bloco.score % 10 == 0 && bloco.score != 0){

            leveln = bloco.score / 10;

            ctx.font = "35px Helvetica, Arial";
            ctx.fillStyle = "yellow";
            ctx.fillText("Nível: "+ leveln, 210, 200);
        }
    }
    chao.desenha();

    bloco.desenha();
};

//Níveis
if (estadoAtual == estados.jogando){
    if (bloco.score % 10 == 0 && bloco.score != 0){
        leveln = bloco.score / 10;
    }
};

//teste
export var lego = {
    alt: 5,
    larg: 8,
    cor: "vermelho"
},

leguin = {
    intruso: true,
};