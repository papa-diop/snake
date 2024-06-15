window.onload =  function(){

    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 100;
    var mySnake;
    var myApple;
    var widthinBlocks = canvasWidth/blockSize;
    var heightInBlocks = canvasHeight/blockSize;
    var score;
    var timeOut;

    init();

    function init(){
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid grey";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        mySnake = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]], "right");
        myApple = new Apple([10,10]);
        score=0;
        refreshCanvas();
    }

    function refreshCanvas(){
        mySnake.advance();
        if(mySnake.checkCollision()){
            gameOver();
        }else{
            if(mySnake.isEatingApple(myApple)){
                score++;
                mySnake.ateApple=true;
                do{
                    myApple.setNewPosition();
                }
                while(myApple.isOnSnake(mySnake))
            }
            ctx.clearRect(0,0,canvasWidth,canvasHeight);
            drawScore();
            mySnake.draw();
            myApple.draw();
            timeOut = setTimeout(refreshCanvas,delay);
        }  
    }

    function gameOver(){
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.strokeText("GameOver",centreX,centreY-180);
        ctx.fillText("GameOver",centreX,centreY-180)
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur la touche espace pour rejouer",centreX, centreY-120);
        ctx.fillText("Appuyer sur la touche espace pour rejouer",centreX, centreY-120);
        ctx.restore();
    }

    function restart(){
        mySnake = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]], "right");
        myApple = new Apple([10,10]);
        score=0;
        clearTimeout(timeOut);
        refreshCanvas();
    }

    function drawScore(){
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "grey";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.fillText(score.toString(),centreX, centreY);
        ctx.restore();
    }

    function drawBlock(ctx, position){
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x,y, blockSize,blockSize);
    }

    function Snake (body, direction) {
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function () {
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for (var i = 0; i < this.body.length; i++) {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };
        this.advance = function (){
            var nPosition = this.body[0].slice();
            switch(this.direction){
                case "left":
                    nPosition[0] -= 1;
                    break;
                case "right":
                    nPosition[0] += 1;
                    break;
                case "down":
                    nPosition[1] += 1;
                    break;
                case "up":
                    nPosition[1] -= 1;
                    break;
                default :
                    throw("Invalid direction");
            }
            this.body.unshift(nPosition);
            if(!this.ateApple)
                this.body.pop();
            else
                this.ateApple = false;
        };
        this.setDirection = function(nDirection){
            var allowedDirections;
            switch(this.direction){
                case "left":
                case "right":
                    allowedDirections = ["up", "down"];
                    break;
                case "down":
                case "up" :
                    allowedDirections = ["left", "right"];
                    break;
                default :
                    throw("Invalid direction");
            }
            if(allowedDirections.indexOf(nDirection) > -1){
                    this.direction = nDirection;
            }
        };
        this.checkCollision = function(){
            var wallCollision =  false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthinBlocks - 1;
            var maxY = heightInBlocks - 1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls){
                wallCollision = true;
            }
            for(var i = 0; i < rest.length; i++){
                if(snakeX === rest[i][0] && snakeY === rest[i][1]){
                    snakeCollision = true;
                }
            }
            return (wallCollision || snakeCollision);
        };
        this.isEatingApple = function(appleToEat)
        {
            var head = this.body[0];
            if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]){
                return true;
            }
            return false;
        };
    }

    function Apple(position){
        this.position = position;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var radius = blockSize/2;
            var x = this.position[0]*blockSize + radius;
            var y = this.position[1]*blockSize + radius;
            ctx.arc(x, y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        };
        this.setNewPosition = function(){
            var newX = Math.round(Math.random()*(widthinBlocks - 1));
            var newY = Math.round(Math.random()*(heightInBlocks - 1));
            this.position =[newX, newY];

        };
        this.isOnSnake = function(snakeToCheck){
            var isOnSnake = false;
            for(i=0; i<snakeToCheck.body.length; i++) {
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[0] === snakeToCheck.body[i][1])
                isOnSnake = true;
            }
            return isOnSnake;
        };
    }
    
    document.onkeydown = function handleKeyDown(e) {
        var key = e.keyCode;
        var nDirection;
        switch(key){
            case 37:
                nDirection = "left"
                break;
            case 38:
                nDirection = "up"
                break;
            case 39:
                nDirection = "right"
                break;
            case 40:
                nDirection = "down"
                break;
            case 32:
                restart();
                return;
            default :
                return;
        }
        mySnake.setDirection(nDirection);
    }
    
}