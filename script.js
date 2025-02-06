document.addEventListener("DOMContentLoaded", () => {
    const home = document.querySelector(".Home");
    const tutorial = document.querySelector(".tutorial");
    const game = document.querySelector(".tela_de_jogo");
    const scoreGame = document.querySelector("#placar");
    const highScoreElement = document.querySelector("#recorde");
    const setaCima = document.querySelector("#setaCima");
    const setaBaixo = document.querySelector("#setaBaixo");
    const setaEsquerda = document.querySelector("#setaEsquerda");
    const setaDireita = document.querySelector("#setaDireita");
    const controles = document.querySelector(".controles"); // Seleciona a div dos controles
    const instrucoes = document.querySelector(".instrucoes");

    let gameOver = false;
    let score = 0;
    let foodX, foodY;
    let snakeX = 15, snakeY = 15;
    let speedX = 0, speedY = 0;
    let snakeBody = [{ x: snakeX, y: snakeY }];
    let obstacles = [];
    let intervalId;

    let highScore = localStorage.getItem("High-Score") || 0;
    highScoreElement.innerText = `High Score: ${highScore}`;

    document.addEventListener("keydown", (event) => {
        if (event.key === " ") { // Barra de espaço inicia o tutorial primeiro
            home.style.display = "none";
            tutorial.style.display = "block";
            controles.classList.add("hidden"); // Esconde os controles no tutorial
            instrucoes.classList.add("hidden");
        }
        if (event.key === "Shift") { // Shift pula o tutorial e inicia o jogo
            tutorial.style.display = "none";
            iniciarJogo();
        }
    });

    // Configurações dos botões de controle
    setaCima.addEventListener("click", () => moverCobra(0, -1));
    setaBaixo.addEventListener("click", () => moverCobra(0, 1));
    setaEsquerda.addEventListener("click", () => moverCobra(-1, 0));
    setaDireita.addEventListener("click", () => moverCobra(1, 0));

    function moverCobra(x, y) {
        speedX = x;
        speedY = y;
    }

    function iniciarJogo() {
        game.style.display = "grid";
        controles.classList.remove("hidden"); // Mostra os controles na tela de jogo
        instrucoes.classList.remove("hidden");
        gameOver = false;
        score = 0;
        snakeX = 15;
        snakeY = 15;
        snakeBody = [{ x: snakeX, y: snakeY }];
        speedX = 0;
        speedY = 0;
        generateObstacles();
        updateFoodPosition();
        scoreGame.innerText = `Score: ${score}`;
        clearInterval(intervalId);
        intervalId = setInterval(iniciaGame, 200);
    }

    function generateObstacles() {
        obstacles = [];
        for (let i = 0; i < 5; i++) {
            let obsX, obsY;
            do {
                obsX = Math.floor(Math.random() * 30);
                obsY = Math.floor(Math.random() * 30);
            } while (obsX === snakeX && obsY === snakeY || (obsX === foodX && obsY === foodY));
            obstacles.push({ x: obsX, y: obsY });
        }
    }

    function updateFoodPosition() {
        do {
            foodX = Math.floor(Math.random() * 30);
            foodY = Math.floor(Math.random() * 30);
        } while (obstacles.some(obs => obs.x === foodX && obs.y === foodY));
    }

    function iniciaGame() {
        if (gameOver) return;

        snakeX += speedX;
        snakeY += speedY;

        if (snakeX < 0 || snakeX >= 30 || snakeY < 0 || snakeY >= 30) {
            gameOver = true;
            alert("Game Over! Você bateu na parede! Pressione Shift para reiniciar.");
            return;
        }

        for (let i = 1; i < snakeBody.length; i++) {
            if (snakeBody[i].x === snakeX && snakeBody[i].y === snakeY) {
                gameOver = true;
                alert("Game Over! Você bateu em si mesmo! Pressione Shift para reiniciar.");
                return;
            }
        }

        if (obstacles.some(obs => obs.x === snakeX && obs.y === snakeY)) {
            gameOver = true;
            alert("Game Over! Você bateu em um obstáculo! Pressione Shift para reiniciar.");
            return;
        }

        snakeBody.unshift({ x: snakeX, y: snakeY });

        if (snakeX === foodX && snakeY === foodY) {
            score++;
            updateFoodPosition();
            scoreGame.innerText = `Score: ${score}`;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("High-Score", highScore);
                highScoreElement.innerText = `High Score: ${highScore}`;
            }
        } else {
            snakeBody.pop();
        }

        renderGame();
    }

    function renderGame() {
        game.innerHTML = "";

        let foodElement = document.createElement("div");
        foodElement.classList.add("food");
        foodElement.style.gridColumnStart = foodX + 1;
        foodElement.style.gridRowStart = foodY + 1;
        game.appendChild(foodElement);

        obstacles.forEach(obs => {
            let obstacleElement = document.createElement("div");
            obstacleElement.classList.add("obstaculo");
            obstacleElement.style.gridColumnStart = obs.x + 1;
            obstacleElement.style.gridRowStart = obs.y + 1;
            game.appendChild(obstacleElement);
        });

        snakeBody.forEach((segment, index) => {
            let snakePart = document.createElement("div");
            snakePart.classList.add("cobra");
            snakePart.style.gridColumnStart = segment.x + 1;
            snakePart.style.gridRowStart = segment.y + 1;
            snakePart.style.backgroundColor = index % 2 === 0 ? "darkslategray" : "orangered";
            game.appendChild(snakePart);
        });
    }
});