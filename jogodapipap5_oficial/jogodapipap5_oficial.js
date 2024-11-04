// Variáveis para o jogo
let pipaPos, inimigaPos, aliadaPos, pipaEspecialPos;
let score = 0;
let gameOver = false;
let telaAtual = 0; // 0 - Menu, 1 - Jogo, 2 - Game Over
let skyTop, skyBottom;
let ultimaPosX = 0; // Última posição X da pipa
let tamanhoPipaPrincipal = 100; // Tamanho inicial da pipa principal

// Cores para as pipas
let coresPipaPrincipal = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'];
let coresPipaInimiga = ['#FF6464', '#FF9696', '#FFB8B8', '#FF3232'];
let coresPipaAliada = ['#64FF64', '#96FF96', '#B8FFB8', '#32FF32'];

// Variáveis para a colisão
let popupTexto = "";
let popupTempo = 0;
let ps; // Sistema de partículas

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Cores do céu
  skyTop = color(0, 100, 200);
  skyBottom = color(135, 206, 250);
  
  // Definir posição inicial
  pipaPos = createVector(width / 2, height - 100);
  inimigaPos = createVector(random(width), -100);
  aliadaPos = createVector(random(width), -100);
  pipaEspecialPos = createVector(random(width), -100);
  ultimaPosX = pipaPos.x;
  ps = new ParticleSystem(createVector(0, 0));
}

function draw() {
  if (telaAtual === 0) {
    desenhaMenu();
  } else if (telaAtual === 1) {
    desenhaCenario();
    movePipa();
    desenhaPipa();
    movimentarInimiga();
    movimentarAliada();
    movimentarPipaEspecial();
    desenhaPlacar();
    verificaColisoes();
    ps.run();
    desenhaPopup();
  } else if (telaAtual === 2) {
    // Exibir tela de Game Over
  }
}

function desenhaMenu() {
  background(239, 3, 252);
  textAlign(CENTER);
  textSize(32);
  fill(255);
  text("PUXE a linha para iniciar", width / 2, height / 2);
}

function desenhaCenario() {
  for (let i = 0; i < height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(skyTop, skyBottom, inter);
    stroke(c);
    line(0, i, width, i);
  }
}

function desenhaPipa() {
  fill(255);
  let tamanho = tamanhoPipaPrincipal;

  desenhaPipaTriangular(pipaPos.x, pipaPos.y, coresPipaPrincipal, tamanho);
  
  stroke(255);
  noFill();
  
  let linhaBaseX = width / 2;
  let linhaY = height;
  
  let curvaOffset = 0;
  if (pipaPos.x < ultimaPosX) {
    curvaOffset = -50; // Curva para a esquerda
  } else if (pipaPos.x > ultimaPosX) {
    curvaOffset = 50; // Curva para a direita
  }
  
  ultimaPosX = pipaPos.x;

  beginShape();
  curveVertex(pipaPos.x + 38, pipaPos.y + tamanho / 12);
  curveVertex(pipaPos.x + 38, pipaPos.y + tamanho / 12);
  curveVertex(linhaBaseX, pipaPos.y + 600 + curvaOffset);
  curveVertex(linhaBaseX, linhaY);
  curveVertex(linhaBaseX, linhaY);
  endShape();
}

function desenhaPipaTriangular(x, y, cores, tamanho) {
  let base = tamanho;
  let altura = tamanho;
  
  for (let i = 0; i < 4; i++) {
    fill(cores[i]);
    noStroke();
    
    switch (i) {
      case 0:
        triangle(x, y, x + base / 2, y - altura, x + base / 2, y);
        break;
      case 1:
        triangle(x + base, y, x + base / 2, y - altura, x + base / 2, y);
        break;
      case 2:
        triangle(x, y, x + base / 2, y + altura, x + base / 2, y);
        break;
      case 3:
        triangle(x + base, y, x + base / 2, y + altura, x + base / 2, y);
        break;
    }
  }
}

function movimentarInimiga() {
  inimigaPos.y += 6;
  if (inimigaPos.y > height) {
    inimigaPos.set(random(width), -100);
  }
  
  fill(255);
  desenhaPipaTriangular(inimigaPos.x, inimigaPos.y, coresPipaInimiga, 60);
}

function movimentarAliada() {
  aliadaPos.y += 3;
  if (aliadaPos.y > height) {
    aliadaPos.set(random(width), -100);
  }
  
  fill(255);
  desenhaPipaTriangular(aliadaPos.x, aliadaPos.y, coresPipaAliada, 60);
}

function movimentarPipaEspecial() {
  pipaEspecialPos.y += 4;
  if (pipaEspecialPos.y > height) {
    pipaEspecialPos.set(random(width), -100);
  }
  
  fill(255, 200, 0);
  desenhaPipaTriangular(pipaEspecialPos.x, pipaEspecialPos.y, coresPipaAliada, 60);
}

function desenhaPlacar() {
  textAlign(LEFT);
  textSize(24);
  fill(0);
  text("Pontuação: " + score, 10, 30);
}

function verificaColisoes() {
  // Verificar colisão com pipa inimiga
  if (pipaPos.x + 50 > inimigaPos.x && pipaPos.x + 50 < inimigaPos.x + 60 &&
      pipaPos.y < inimigaPos.y + 60) {
    inimigaPos.set(-100, -100);
    score += 200;
    mostraPopup("Pontuação: +200");
    ps.origin.set(pipaPos.x + 30, pipaPos.y + 30);
    for (let i = 0; i < 100; i++) {
      ps.addParticle();
    }
  }
  
  // Verificar colisão com pipa aliada
  if (pipaPos.x + 50 > aliadaPos.x && pipaPos.x + 50 < aliadaPos.x + 60 &&
      pipaPos.y < aliadaPos.y + 60) {
    aliadaPos.set(-100, -100);
    score += 200;
    mostraPopup("Pontuação: +200");
    ps.origin.set(pipaPos.x + 30, pipaPos.y + 30);
    for (let i = 0; i < 100; i++) {
      ps.addParticle();
    }
    aliadaPos.set(random(width), -100);
  }
  
  // Verificar colisão com pipa especial
  if (pipaPos.x + 50 > pipaEspecialPos.x && pipaPos.x + 50 < pipaEspecialPos.x + 60 &&
      pipaPos.y < pipaEspecialPos.y + 60) {
    pipaEspecialPos.set(-100, -100);
    score += 300;
    mostraPopup("Pontuação: +300");
    ps.origin.set(pipaPos.x + 30, pipaPos.y + 30);
    for (let i = 0; i < 100; i++) {
      ps.addParticle();
    }
  }
}

function mostraPopup(texto) {
  popupTexto = texto;
  popupTempo = 40; // Exibir por 40 frames
}

function desenhaPopup() {
  if (popupTempo > 0) {
    textAlign(CENTER);
    textSize(20);
    fill(255);
    text(popupTexto, width / 2, height / 2);
    popupTempo--;
  }
}

function keyPressed() {
  if (telaAtual === 0 && keyCode === ENTER) {
    telaAtual = 1;
    score = 0;
    pipaPos.set(width / 2, height - 100);
    inimigaPos.set(random(width), -100);
    aliadaPos.set(random(width), -100);
    pipaEspecialPos.set(random(width), -100);
    ultimaPosX = pipaPos.x;
  } else if (telaAtual === 2 && key === 'r') {
    telaAtual = 0; // Volta ao menu
  }
}

function movePipa() {
  let velocidade = 0.8; // Diminuição da velocidade de resposta ao movimento do mouse
  pipaPos.x += constrain(mouseX - (pipaPos.x + 50), -velocidade, velocidade);
}
