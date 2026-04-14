let board = document.querySelector('.board');
const modal = document.querySelector('.modal')
const startGame  = document.querySelector('.start-game')
const gameOverModal = document.querySelector('.game-over')
const startGameButton = document.querySelector('.btn-start')
const restartButton = document.querySelector('.btn-game-over ')

let highScoreElement = document.querySelector('#high-score')
let scoreElement = document.querySelector('#score')
let timeElement = document.querySelector('#time')

let highScore = localStorage.getItem('highScore') || 0
let score = 0
let time = `00:00`
highScoreElement.innerHTML = highScore

const blockWidth = 50
const blockHeight = 50
const cols = Math.floor(board.clientWidth / blockWidth)
const rows = Math.floor(board.clientHeight / blockHeight)
let blocks = []
let snake = [{x : 1 , y : 2}]

let direction = 'down'

let intervelID = null
let timerIntervelId = null
let food = {x:Math.floor(Math.random()*rows) , y : Math.floor(Math.random()*cols)}

for(let row = 0 ; row<rows ; row++){
    for(let col = 0; col < cols ; col++){
        const block = document.createElement('div')
        block.classList.add('box')
        board.appendChild(block);

        blocks[`${row}-${col}`] = block
    }
}


function render(){

    blocks[`${food.x}-${food.y}`].classList.add('food')

    let head = null
    if(direction === 'right'){
        head = {x : snake[0].x , y : snake[0].y+1}
    } else if(direction === 'left'){
        head = {x:snake[0].x , y : snake[0].y-1}
    } else if(direction === 'up'){
        head = {x : snake[0].x-1 , y : snake[0].y}
    } else{
        head = {x:snake[0].x+1 , y : snake[0].y}
    }
    // Snake Stumble into Wall 
    if(head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols){
        clearInterval(intervelID)
        modal.style.display = 'flex'
        startGame.style.display = 'none'
        gameOverModal.style.display = 'flex'
        return;
    }
    //Food Consume
    if(head.x === food.x && head.y === food.y){
        blocks[`${food.x}-${food.y}`].classList.remove('food')
        food = {x:Math.floor(Math.random()*rows) , y : Math.floor(Math.random()*cols)}
        blocks[`${food.x}-${food.y}`].classList.add('food')
        snake.unshift(head);
        score += 10
        scoreElement.innerText = score
        if(score > highScore){
            highScore =score
            localStorage.setItem("highScore" , highScore.toString())
            highScoreElement.innerText = highScore
        }
    }

    snake.forEach(segment =>{
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill')
    })

    snake.unshift(head);
    snake.pop();
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add('fill')
        
    })
}


function restartGame(){
    score = 0
    time = `00:00`
    scoreElement.innerText = score
    timeElement.innerText = time
    highScore.innerText = highScore
    blocks[`${food.x}-${food.y}`].classList.remove('food')
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill')})
        direction = 'down'
        modal.style.display = 'none'
        intervelID = setInterval(()=>{render()} , 300)
        food = {x:Math.floor(Math.random()*rows) , y : Math.floor(Math.random()*cols)}
        snake = [{x : 1 , y : 3}]
}

addEventListener('keydown' , (event)=>{
    if(event.key === "ArrowDown"){
        direction = 'down'
    }
    else if (event.key === "ArrowUp"){
        direction = 'up'
    }
    else if(event.key === "ArrowRight"){
        direction = 'right'
    }
    else{
        direction = 'left'
    }
})


startGameButton.addEventListener('click' , ()=>{
    modal.style.display = "none"
    intervelID = setInterval(()=>{render()} , 300)
    timerIntervelId = setInterval(() => {
        let [min,sec] = time.split(":").map(Number)
        if(sec === 59){
            min +=1
            sec = 0
        }
        else{
            sec += 1
        }
        time = `${min}:${sec}`
        timeElement.innerText = time
    }, 1000)
})

restartButton.addEventListener('click' , restartGame)
