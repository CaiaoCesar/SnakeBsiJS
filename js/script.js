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
    const controles = document.querySelector(".controles");
    const instrucoes = document.querySelector(".instrucoes");
    const formularioGameOver = document.querySelector("#formularioGameOver");
    const inputNomeJogador = document.querySelector("#inputNomeJogador");
    const salvarNomeBtn = document.querySelector("#salvarNomeBtn");
    const ranking = document.querySelector("#ranking");
    const listaRanking = document.querySelector("#listaRanking");
    const fecharRankingBtn = document.querySelector("#fecharRankingBtn");
    const menuModo = document.querySelector("#menuModo");
    const modoClassicoBtn = document.querySelector("#modoClassicoBtn");
    const modoVsCpuBtn = document.querySelector("#modoVsCpuBtn");
    const textoInstrucao = document.querySelector("#textoInstrucao");

    let gameOver = false;
    let score = 0;
    let scoreCpu = 0;
    let foodX, foodY;
    let snakeX = 15, snakeY = 15;
    let snakeCpuX = 5, snakeCpuY = 5;
    let speedX = 0, speedY = 0;
    let speedCpuX = 0, speedCpuY = 0;
    let snakeBody = [{ x: snakeX, y: snakeY }];
    let snakeCpuBody = [{ x: snakeCpuX, y: snakeCpuY }];
    let obstacles = [];
    let intervalId;
    let modoVsCpu = false;

    let highScore = localStorage.getItem("High-Score") || 0;
    highScoreElement.innerText = `High Score: ${highScore}`;

    // Evento para iniciar o jogo ao pressionar a barra de espaço
    document.addEventListener("keydown", (event) => {
        if (event.key === " ") {
            home.style.display = "none";
            tutorial.style.display = "block";
            controles.classList.add("hidden");
            instrucoes.classList.add("hidden");
        }
        if (event.key === "Shift") {
            tutorial.style.display = "none";
            controles.classList.add("hidden"); // Oculta os controles
            setTimeout(() => {
                menuModo.classList.remove("hidden");
            }, 500); // Mostra o menu de modos após 500ms
        }
    });

    // Eventos para os botões de controle
    setaCima.addEventListener("click", () => moverCobra(0, -1));
    setaBaixo.addEventListener("click", () => moverCobra(0, 1));
    setaEsquerda.addEventListener("click", () => moverCobra(-1, 0));
    setaDireita.addEventListener("click", () => moverCobra(1, 0));

    // Converte o nome do jogador para maiúsculas automaticamente
    inputNomeJogador.addEventListener("input", () => {
        inputNomeJogador.value = inputNomeJogador.value.toUpperCase();
    });

    // Salva o nome do jogador e exibe o ranking
    salvarNomeBtn.addEventListener("click", () => {
        const nomeJogador = inputNomeJogador.value.trim();
        if (nomeJogador) {
            salvarScore(nomeJogador, modoVsCpu ? scoreCpu : score);
            exibirRanking();
            formularioGameOver.classList.add("hidden");
            ranking.classList.remove("hidden");
        } else {
            alert("Por favor, insira seu nome!");
        }
    });

    // Fecha o ranking e reinicia o jogo
    fecharRankingBtn.addEventListener("click", () => {
        ranking.classList.add("hidden");
        menuModo.classList.remove("hidden");
    });

    // Seleção de modo de jogo
    modoClassicoBtn.addEventListener("click", () => {
        modoVsCpu = false;
        controles.classList.remove("hidden"); // Mostra os controles
        atualizarInstrucoes(); // Atualiza as instruções
        iniciarJogo();
    });

    modoVsCpuBtn.addEventListener("click", () => {
        modoVsCpu = true;
        controles.classList.remove("hidden"); // Mostra os controles
        atualizarInstrucoes(); // Atualiza as instruções
        iniciarJogo();
    });

    // Função para mover a cobra
    function moverCobra(x, y) {
        speedX = x;
        speedY = y;
    }

    // Função para atualizar as instruções com base no modo de jogo
    function atualizarInstrucoes() {
        if (modoVsCpu) {
            textoInstrucao.innerHTML = `
                <br>✔ Objetivo: Seja o primeiro a coletar <strong><span class="maca-label">10 maçãs</span></strong>!<br>
                <br>✔ Sua cobra: <span class="player-label">Laranja/Cinza</span><br>
                <br>✔ Cobra da CPU: <span class="cpu-label">Verde</span><br>
                <br>✔ <strong><span class="player-label">Cuidado com colisões entre as cobras!</span></strong><br>
                <br>✔ <span class="obstaculos-label">Obstaculos</span> mudam a cada partida.<br>
                <br><br>Reinicie a Partida com Shift ⬆
            `;
        } else {
            textoInstrucao.innerHTML = `
                <br>✔ Clique em alguma seta para iniciar o jogo.<br>
                <br>✔ Colete o máximo das <span class="maca-label">maçãs</span> possiveís!<br>
                <br>✔ Sua cobra: <span class="player-label">Laranja/Cinza</span><br>
                <br>✔ Os <span class="obstaculos-label">obstaculos</span> são criados de forma aleatoria <br> a cada reinicio de jogo.<br> 
                <br>Reinicie a Partida com Shift ⬆
            `;
        }
    }

    // Função para iniciar o jogo
    function iniciarJogo() {
        game.style.display = "grid";
        controles.classList.remove("hidden");
        instrucoes.classList.remove("hidden");
        formularioGameOver.classList.add("hidden");
        ranking.classList.add("hidden");
        menuModo.classList.add("hidden");
        gameOver = false;
        score = 0;
        scoreCpu = 0;
        snakeX = 15;
        snakeY = 15;
        snakeCpuX = 5;
        snakeCpuY = 5;
        snakeBody = [{ x: snakeX, y: snakeY }];
        snakeCpuBody = [{ x: snakeCpuX, y: snakeCpuY }];
        speedX = 0;
        speedY = 0;
        speedCpuX = 0;
        speedCpuY = 0;
        generateObstacles();
        updateFoodPosition();
        scoreGame.innerText = `Score: ${score}`;
        clearInterval(intervalId);
        intervalId = setInterval(iniciaGame, 300);
    }

    // Função para gerar obstáculos
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

    // Função para atualizar a posição da maçã
    function updateFoodPosition() {
        do {
            foodX = Math.floor(Math.random() * 30);
            foodY = Math.floor(Math.random() * 30);
        } while (obstacles.some(obs => obs.x === foodX && obs.y === foodY));
    }

    // Função principal do jogo
    function iniciaGame() {
        if (gameOver) return;

        // Movimento da cobra do jogador
        snakeX += speedX;
        snakeY += speedY;

        // Movimento da cobra da CPU (inteligência média)
        if (modoVsCpu) {
            moverCobraCpu();
            snakeCpuX += speedCpuX;
            snakeCpuY += speedCpuY;
        }

        // Verifica colisões da cobra do jogador
        if (snakeX < 0 || snakeX >= 30 || snakeY < 0 || snakeY >= 30 ||
            snakeBody.slice(1).some(segment => segment.x === snakeX && segment.y === snakeY) ||
            obstacles.some(obs => obs.x === snakeX && obs.y === snakeY)) {
            gameOver = true;
            exibirFormularioGameOver("Você perdeu!");
            return;
        }

        // Verifica colisões da cobra da CPU
        if (modoVsCpu && (snakeCpuX < 0 || snakeCpuX >= 30 || snakeCpuY < 0 || snakeCpuY >= 30 ||
            snakeCpuBody.slice(1).some(segment => segment.x === snakeCpuX && segment.y === snakeCpuY) ||
            obstacles.some(obs => obs.x === snakeCpuX && obs.y === snakeCpuY))) {
            gameOver = true;
            let motivo = "";
            if (snakeCpuX < 0 || snakeCpuX >= 30 || snakeCpuY < 0 || snakeCpuY >= 30) {
                motivo = "A CPU bateu na parede!";
            } else if (snakeCpuBody.slice(1).some(segment => segment.x === snakeCpuX && segment.y === snakeCpuY)) {
                motivo = "A CPU bateu em si mesma!";
            } else if (obstacles.some(obs => obs.x === snakeCpuX && obs.y === snakeCpuY)) {
                motivo = "A CPU bateu em um obstáculo!";
            }
            exibirFormularioGameOver(`A CPU perdeu! ${motivo}`);
            return;
        }

        // Verifica colisão entre cobras (modo VS CPU)
        if (modoVsCpu) {
            const colisaoJogadorVsCpu = snakeBody.some(segment => 
                snakeCpuBody.some(cpuSegment => 
                    segment.x === cpuSegment.x && segment.y === cpuSegment.y
                )
            );

            if (colisaoJogadorVsCpu) {
                gameOver = true;
                const jogadorMorreu = snakeBody[0].x === snakeCpuX && snakeBody[0].y === snakeCpuY;
                const cpuMorreu = snakeCpuBody[0].x === snakeX && snakeCpuBody[0].y === snakeY;
                
                let mensagem = "";
                if (jogadorMorreu && cpuMorreu) {
                    mensagem = "Empate! Ambas as cobras colidiram!";
                } else if (jogadorMorreu) {
                    mensagem = "Você perdeu! Sua cobra colidiu com a CPU!";
                } else if (cpuMorreu) {
                    mensagem = "CPU perdeu! Colidiu com sua cobra!";
                }
                
                exibirFormularioGameOver(mensagem);
                return;
            }
        }

        // Adiciona a nova cabeça ANTES de verificar a maçã
        snakeBody.unshift({ x: snakeX, y: snakeY });

        // Verifica se a cobra do jogador comeu a maçã
        if (snakeX === foodX && snakeY === foodY) {
            score++;
            updateFoodPosition();
            if (modoVsCpu && score >= 10) {
                gameOver = true;
                exibirFormularioGameOver("Você venceu!");
                return;
            }
        } else {
            snakeBody.pop();  // Remove APENAS se não comeu
        }

        // Verifica se a cobra da CPU comeu a maçã
        if (modoVsCpu) {
            snakeCpuBody.unshift({ x: snakeCpuX, y: snakeCpuY });
            if (snakeCpuX === foodX && snakeCpuY === foodY) {
                scoreCpu++;
                updateFoodPosition();
                if (scoreCpu >= 10) {
                    gameOver = true;
                    exibirFormularioGameOver("A CPU venceu!");
                    return;
                }
            } else {
                snakeCpuBody.pop();
            }
        }

        // Atualiza o placar
        scoreGame.innerText = `Jogador: ${score}${modoVsCpu ? ` | CPU: ${scoreCpu}` : ""}`;

        // Renderiza o jogo
        renderGame();
    }

    // Função para mover a cobra da CPU
    function moverCobraCpu() {
        // Evita que a CPU se mova na direção oposta
        if (foodX > snakeCpuX && speedCpuX !== -1) {
            speedCpuX = 1;
            speedCpuY = 0;
        } else if (foodX < snakeCpuX && speedCpuX !== 1) {
            speedCpuX = -1;
            speedCpuY = 0;
        } else if (foodY > snakeCpuY && speedCpuY !== -1) {
            speedCpuY = 1;
            speedCpuX = 0;
        } else if (foodY < snakeCpuY && speedCpuY !== 1) {
            speedCpuY = -1;
            speedCpuX = 0;
        }

        // Evita colisões com obstáculos
        const proximoX = snakeCpuX + speedCpuX;
        const proximoY = snakeCpuY + speedCpuY;

        if (obstacles.some(obs => obs.x === proximoX && obs.y === proximoY)) {
            // Se o próximo movimento for um obstáculo, muda de direção
            if (speedCpuX !== 0) {
                speedCpuX = 0;
                speedCpuY = foodY > snakeCpuY ? 1 : -1;
            } else {
                speedCpuY = 0;
                speedCpuX = foodX > snakeCpuX ? 1 : -1;
            }
        }
    }

    // Função para exibir o formulário de Game Over
    function exibirFormularioGameOver(mensagem) {
        formularioGameOver.classList.remove("hidden");
        game.style.display = "none";
        controles.classList.add("hidden");
        instrucoes.classList.add("hidden");
        formularioGameOver.querySelector("h2").textContent = mensagem;
    }

    // Função para salvar o score do jogador
    function salvarScore(nome, score) {
        const scores = JSON.parse(localStorage.getItem("scores")) || [];
        scores.push({ nome, score });
        scores.sort((a, b) => b.score - a.score); // Ordena do maior para o menor
        localStorage.setItem("scores", JSON.stringify(scores.slice(0, 5))); // Armazena apenas os top 5
    }

    // Função para exibir o ranking
    function exibirRanking() {
        const scores = JSON.parse(localStorage.getItem("scores")) || [];
        listaRanking.innerHTML = ""; // Limpa a lista antes de atualizar

        scores.forEach((item, index) => {
            const li = document.createElement("li");
            li.textContent = `${index + 1}. ${item.nome} - ${item.score}`;
            listaRanking.appendChild(li);
        });
    }

    // Função para renderizar o jogo
    function renderGame() {
        game.innerHTML = ""; // Limpa o jogo antes de renderizar novamente

        // Renderiza a maçã
        let foodElement = document.createElement("div");
        foodElement.classList.add("food");
        foodElement.style.gridColumnStart = foodX + 1;
        foodElement.style.gridRowStart = foodY + 1;
        game.appendChild(foodElement);

        // Renderiza os obstáculos
        obstacles.forEach(obs => {
            let obstacleElement = document.createElement("div");
            obstacleElement.classList.add("obstaculo");
            obstacleElement.style.gridColumnStart = obs.x + 1;
            obstacleElement.style.gridRowStart = obs.y + 1;
            game.appendChild(obstacleElement);
        });

        // Renderiza a cobra do jogador
        snakeBody.forEach((segment, index) => {
            let snakePart = document.createElement("div");
            snakePart.classList.add("cobra");
            snakePart.style.gridColumnStart = segment.x + 1;
            snakePart.style.gridRowStart = segment.y + 1;
            snakePart.style.backgroundColor = index % 2 === 0 ? "darkslategray" : "orangered";
            game.appendChild(snakePart);
        });

        // Renderiza a cobra da CPU (se estiver no modo VS CPU)
        if (modoVsCpu) {
            snakeCpuBody.forEach((segment, index) => {
                let snakeCpuPart = document.createElement("div");
                snakeCpuPart.classList.add("cobra-cpu");
                snakeCpuPart.style.gridColumnStart = segment.x + 1;
                snakeCpuPart.style.gridRowStart = segment.y + 1;
                snakeCpuPart.style.backgroundColor = index % 2 === 0 ? "darkgreen" : "limegreen";
                game.appendChild(snakeCpuPart);
            });
        }
    }
});