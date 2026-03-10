//context.fillRect(x: number, y: number, w: number, h: number)

var pontuacao = document.getElementById("pontuacao"); //pega o texto que exibe a pontuação do html para alterar quando necessário

//configurações do quadro
var board;
var context;
var boxSize = 25;
var rows = 20;
var colums = 20;
var score = 0; //pontuação feita no jogo, começa como 0

//coordenadas da cabeça da cobra, posição onde ela inicia
var snakeX = boxSize * 5;
var snakeY = boxSize * 5;

//velocicade da cobra
var velocityX = 0;
var velocityY = 0;

// o snakeBody é um array contendo varios segmentos com as coordenadas de cada segmento do corpo
var snakeBody = [];

//coordenadas da comida
var foodX;
var foodY;

//variavél que diz quando o jogo acaba
var gameOver = false;

window.onload = function () {

    if (gameOver) { // se a variavel gameOver for verdadeira, ele para de atualizar o canvas
        return
    }

    document.addEventListener("keydown", function (e) {
        if (e.code === "KeyR") location.reload();
    });

    board = document.getElementById("board");
    board.height = rows * boxSize;
    board.width = colums * boxSize;
    context = board.getContext("2d");

    placeFruit();
    document.addEventListener("keyup", changeDirection); //1º a ação que vai ativar a função, 2º a função a ser executada quando a ação for feita
    setInterval(update, 1000 / 10); //a cada 100 milisegundos ele chama a função update
}

function update() {
    if (gameOver) return; //verifica se o game over é true logo no começo, se for, ele nem atualiza, apenas retorna

    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle = "red";
    context.fillRect(foodX, foodY, boxSize, boxSize);

    if (snakeX == foodX && snakeY == foodY) { //verifica se comeu a comida
        snakeBody.push([foodX, foodY]); //adiciona no array a coordenada da comida que a cobra comeu, podendo adicionar no corpo dela
        score += 1;
        pontuacao.textContent = score;
        placeFruit();
    }

    for (let i = snakeBody.length - 1; i > 0; i--) { //pra mexer os segmentos certinho, a cauda se mexe primeiro(começa da ultima posição do array), e somente quando ela chega na posição anterior da cabeça, ela permite a cabeça mexer
        snakeBody[i] = snakeBody[i - 1];
    }

    if (snakeBody.length) { //atualiza o penultimo segmento para a posição da cabeça, pra finalizar a curva
        snakeBody[0] = [snakeX, snakeY];
    }

    context.fillStyle = "lime";
    snakeX += velocityX * boxSize;
    snakeY += velocityY * boxSize;
    context.fillRect(snakeX, snakeY, boxSize, boxSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], boxSize, boxSize);
    }

    //condicoes para gameOver = true:
    if (snakeX < 0 || snakeX > (colums - 1) * boxSize || snakeY < 0 || snakeY > (rows - 1) * boxSize) { //se a cobra sai do quadro, ou seja, das coordenadas 0 ou ultrapassa e vai além, gameOver = true
        endGame()
    }
    for (let i = 0; i < snakeBody.length; i++) { //checa colisão da cabeça com cada segmento do corpo, como a checagem da colisão com a fruta, mas agora checa a colisão com o corpo da cobra
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            endGame()
        }
    }

}

function placeFruit() { //gera uma comida em uma posição aleatória no quadro
    //math.random gera nuúmero entre (0-1); * colums(20) -> (0-19.999999); math.floor transforma -> (0-19) * 25(tamanho de cada "pixel")
    foodX = Math.floor(Math.random() * colums) * boxSize;
    foodY = Math.floor(Math.random() * rows) * boxSize;
}

function changeDirection(event) {
    if ((event.code == "ArrowUp" || event.code == "KeyW") && velocityY != 1) { //checa se o usuário clicou na seta para cima e se a velocidade é diferente de 1, isso é, se ele ja estiver indo pra baixo, não pode ir pra cima, porque senão iria colidir com o proprio corpo
        velocityX = 0; //não muda, pq é só pra esquerda e pra direita
        velocityY = -1; //pra cima no board diminui a posição da cobrinha
    }
    else if ((event.code == "ArrowDown" || event.code == "KeyS") && velocityY != -1) {
        velocityX = 0; //não muda, pq é só pra esquerda e pra direita
        velocityY = 1; //pra baixo no board aumenta a posição da cobrinha
    }
    else if ((event.code == "ArrowLeft" || event.code == "KeyA") && velocityX != 1) {
        velocityX = -1; //pra esquerda no board diminui a posição da cobrinha
        velocityY = 0; //não muda, pq é só pra cima e pra baixo
    }
    else if ((event.code == "ArrowRight" || event.code == "KeyD") && velocityX != -1) {
        velocityX = 1; //pra direita no board aumenta a posição da cobrinha
        velocityY = 0; //não muda, pq é só pra cima e pra baixo
    }
}

function endGame() { // função que faz o jogo parar
    gameOver = true;
    document.getElementById("finalScore").innerText = "pontuacao final: " + score;
    document.getElementById("gameOverScreen").style.display = "flex";
}

function restartGame() { //função para reinicar o jogo
    location.reload();
}