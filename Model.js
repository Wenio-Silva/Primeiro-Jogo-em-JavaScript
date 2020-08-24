import { desenhaChao, obs1, obs2, obs3, obs4 } from "./Sprites.js";

//variaveis do jogo
export var canvas, ctx, ALTURA, LARGURA,
maxPulos = 2, velocidade = 6, estadoAtual, record,
TOUCH = 0, leveln = 0, img,

estados = {
	jogar: 0,
	jogando: 1,
	perdeu: 2
},

chao = {
	x: 0,
	y: 550,

	atualiza: function() {
		this.x -= velocidade;
		if (this.x <= -600) {
			this.x = 0;
		}
	},

	desenha: function() {
		desenhaChao.desenha(this.x, this.y);
        desenhaChao.desenha(this.x + desenhaChao.largura, this.y);
	}
},

Personagem = {
	x: 50,
	y: 0,
	largura: 50,
	altura: 50,
	cor: "green",
	gravidade: 1.6,
	velocidade: 0,
	forcaDoPulo: 20,
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
		novoRecord();

		this.velocidade = 0;
		this.y = 0;

		leveln = 0;
		this.score = 0;

		
	},
},

obstaculos = {
	_obs: [],
	_sprites: [ obs1, obs2, obs3, obs4 ],
	tempoInsere: 0,
	minimoInsere: 0,

	insere: function() {
		this._obs.push({
			spriteObs: this._sprites[Math.floor(4*Math.random())],
			x: LARGURA			
			
		});
		// Niveis de dificuldade distancia e velocidade dos obs
		//this.tempoInsere = 40 + Math.floor(30 * Math.random());
		// 8 linhas de codigo, sendo uma a variavel minimoInsere
		
		if (Personagem.score == 0){
			this.minimoInsere = 70;
		}
		
		if (Personagem.score % 10 == 0 && this.minimoInsere >= 40)
			this.minimoInsere -= 5;
			//console.log("Decrescimo: " + this.minimoInsere);

		this.tempoInsere = this.minimoInsere + Math.floor(20 * Math.random())
	},

	desenha: function() {
		if (estadoAtual == estados.jogando){
			for (var i = 0, tam = this._obs.length; i < tam; i++) {
				var obs = this._obs[i];
				obs.spriteObs.desenha(obs.x, ALTURA - obs.spriteObs.altura - 50);
				//ctx.drawImage(img, 14, 107, 40, 207, 250, 300, 40, 207);

				//console.log(obs.spriteObs.desenha);
				//console.log(obs.x);
			}
		}
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
		}

		//retira os obstaculos
		if (obs.x <= 100) {
			this._obs.splice(i, 1);
			tam--;
			i--;
		}
	},

	colisao: function() {
		if (obs.x == 48)
				atualizaPontuacao();

		//colisão 
		if (Personagem.x < obs.x + obs.largura && Personagem.x + Personagem.largura >=
		obs.x && Personagem.y + Personagem.altura >= chao.y - obs.altura)
			estadoAtual = estados.perdeu;			
	},

	//reinicia o trafego dos obstaculos
	limpa: function() {
		this._obs = [];
	},
};

//Pontuações do jogo
function atualizaPontuacao() {
		Personagem.score++;
		leveln = Personagem.score / 10;
};

function novoRecord() {
	if (Personagem.score>record){
		localStorage.setItem("record", Personagem.score);
		record = Personagem.score;
	}
};

//Inputs
document.addEventListener("keydown", entrada);
document.addEventListener("touchstart", toque => {
	TOUCH = 1;
	entrada();
	TOUCH = 0;
});

function entrada(event) {
	ações();
};

//Ações do cliente
function ações() {
	if ( TOUCH == 1 || event.key == "ArrowUp" || event.key == "w" || event.key == " " ) {
		switch (estadoAtual) {
			case estados.jogando:
				Personagem.pula();
				break;
			case estados.jogar:
				estadoAtual = estados.jogando;
				
				break;
			case estados.perdeu:
				Personagem.reset();
				estadoAtual = estados.jogar;
				obstaculos.limpa();
		}
	}
};

//Função Principal
export function main() {
	//window.innerHeight e o width devolvem a altura e largura da tela
	ALTURA = window.innerHeight;
	LARGURA = window.innerWidth;
	
	//limita o tamanho do canvas
	if (LARGURA >= 500) {
		LARGURA = 600;
		ALTURA = 600;
	}

	canvas = document.createElement("canvas");

	canvas.width = LARGURA;
	canvas.height = ALTURA;

	canvas.style.border = "1px solid #000";

	ctx = canvas.getContext("2d");

	//Adicionou a canvas como uma tag no documento html
	document.body.appendChild(canvas);

	//o jogo inicializa no estado "jogar"
	estadoAtual = estados.jogar;

	record = localStorage.getItem("record");

	if (record == null){
		record = 0;
	}

	//iniciação da movimentação do chao
	//chao.move();

	//Define a folha de sprites do jogo
	img = new Image();
	img.src = "imagens/sprites.png";
}

export function atualiza() {
	if (estadoAtual == estados.jogando){
		obstaculos.atualiza();
	}
	
	Personagem.atualiza();
	
	chao.atualiza();
}

// Falta salvar os novos recordes