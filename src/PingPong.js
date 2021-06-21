class PingPong{
    constructor(canvas, options){
        options = options || {}; // IF DOWS NOT EXIST CALL IT EMPTY OBJECT
        this.options = options

        // BOT
        this.bot = (options.bot)? options.bot : 'Bot';
        this.botVelocity = (options.botVelocity)? options.botVelocity : 5;
        // CANVAS
        this.canvas = canvas;

        this.canvasOptions = {
            x: 0,
            y: 0,
            w: (options.canvas && options.canvas.width)? options.canvas.width : 700,
            h: (options.canvas && options.canvas.height)? options.canvas.height : 400,
            color: (options.canvas && options.canvas.color)? options.canvas.color : '#000',
            orientation: (options.canvas && options.canvas.orientation)? options.canvas.orientation : 'horizontal'
        }
        this.canvas.width = this.canvasOptions.w;
        this.canvas.height = this.canvasOptions.h;

        if(this.canvasOptions.orientation == 'vertical'){
            // ROTATE
            this.canvas.style.transform = 'rotate(-90deg)';
        }

        // CONTEXT
        this.ctx = this.canvas.getContext('2d');

        // USER AND COMPUTER
        this.userOptions = {
            x: 0,
            y: (options.paddle && options.paddle.height)? (this.canvas.height/2) - (options.paddle.height/2) : (this.canvas.height/2) - (100/2), // THE MIDDLE OF THE CANVAS HEIGHT - PADDLE HEIGHT, JUST IN THE MIDDLE
            w: (options.paddle && options.paddle.width)? options.paddle.width : 10,
            h: (options.paddle && options.paddle.height)? options.paddle.height : 100,
            score: 0,
            color: (options.paddle && options.paddle.color)? options.paddle.color : '#fff'
        }
        this.computerOptions = {
            x: (options.paddle && options.paddle.width)? this.canvas.width - options.paddle.width : this.canvas.width - 10, // THE END OF THE CANVAS - WIDTH OF THE PADDLE
            y: (options.paddle && options.paddle.height)? (this.canvas.height/2) - (options.paddle.height/2) : (this.canvas.height/2) - (100/2),
            w: (options.paddle && options.paddle.width)? options.paddle.width : 10,
            h: (options.paddle && options.paddle.height)? options.paddle.height : 100,
            score: 0,
            color: (options.paddle && options.paddle.color)? options.paddle.color : '#fff'
        }

        // BALL
        this.ballOptions = {
            x: this.canvas.width/2,
            y: this.canvas.height/2,
            r: (options.ball && options.ball.radius)? options.ball.radius : 10,
            color: (options.ball && options.ball.color)? options.ball.color : '#ff0000', // DEFAULT RED
            velocity: (options.ball && options.ball.velocity)? options.ball.velocity : [5, 5],
            speed: (options.ball && options.ball.speed)? ((options.ball.speed > 0) ? options.ball.speed : -options.ball.speed ) : 5, // NOT VECTORIAL, WHITHOUT DIRECTION
            acceleration: (options.ball && options.ball.acceleration)? options.ball.acceleration : 0.1
        }

        // NET
        this.netOptions = {
            x: (options.net && options.net.width)? (this.canvas.width/2) - (options.net.width/2) : (this.canvas.width/2) - (2/2), // IN THE MIDDLE
            y: 0,
            w: (options.net && options.net.width)? options.net.width : 2,
            h: (options.net && options.net.height)? options.net.height : 10,
            space: (options.net && options.net.space)? options.net.space : 15,
            color: (options.net && options.net.color)? options.net.color : '#fff'
        }

        // SCORES
        this.scoresOptions = {
            fontSize: (options.scores && options.scores.fontSize)? options.scores.fontSize : 32,
            fontFamily: (options.scores && options.scores.fontFamily)? options.scores.fontFamily : 'Consolas',
            color: (options.scores && options.scores.color)? options.scores.color : '#fff'
        }
        this.userScoreOptions = {
            x: this.canvas.width/4,
            y: this.canvas.height/5,
        }
        this.computerScoreOptions = {
            x: 3*(this.canvas.width/4),
            y: this.canvas.height/5,
        }

        //=========================================================================00
        this.controlPaddle = (options.controls)? options.controls : ['keyboard'];
        // PADDLE MOVE EVENT
        if(this.controlPaddle.includes('keyboard')){
            window.addEventListener('keydown', e => {

                if(e.keyCode == 38 || e.keyCode == 87){
                    // IF THE USER PRESS UP ARROW OR W KEY
                    this.userOptions.y = this.userOptions.y - 5;
                }else if(e.keyCode == 40 || e.keyCode == 83){
                    // IF THE USER PRESS DOWN ARROW OR S KEY
                    this.userOptions.y = this.userOptions.y + 5;
                }

            });
        }

        if(this.controlPaddle.includes('mouse')){
            this.canvas.addEventListener('mousemove', e => {
                // CURSOR FOLLOW
                this.userOptions.y = e.clientY - (this.userOptions.h/2) - this.canvas.getBoundingClientRect().top;
            });
        }

        // MOBILE DEVICES
        if(this.controlPaddle.includes('touch')){
            this.canvas.addEventListener('touchmove', e => {
                var touch = e.touches[0] || e.changedTouches[0];
                // CURSOR FOLLOW
                this.userOptions.y = touch.pageX - (this.userOptions.h/2) -  this.canvas.getBoundingClientRect().left;
            });
        }
    }

    
    init(){
        // const framePerSecond = 60;
        // setInterval(() => {

        //     // CALL FUNCTION
        //     this.render(this);

        // }, 1000/framePerSecond); --------------> OLD VERSION

        console.log('Game starting...');

        // CALL ANIMATION FRAME
        this.animationFrame = requestAnimationFrame(() => this.play());
    }

    pause(){
        cancelAnimationFrame(this.animationFrame);
    }

    // RESET THE GAME
    reset(){
        this.userOptions.score = 0;
        this.computerOptions.score = 0;

        this.ballReset();

        return true;
    }

    //! NOT PUBLIC CALLABLE FUNCTIONS
    drawRect(x, y, w, h, color){
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, w, h);
    }
    drawCircle(x, y, r, color){
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI * 2, false);
        this.ctx.closePath();

        this.ctx.fill();
    }
    drawText(num, x, y, color){
        this.ctx.fillStyle = color;
        this.ctx.font = `${this.scoresOptions.fontSize}px ${this.scoresOptions.fontFamily}`;

        this.ctx.fillText(num, x, y);
    }

    drawNet(){
        for (let i = 0; i < this.canvas.height; i = i + this.netOptions.space) {
            this.drawRect(this.netOptions.x, i, this.netOptions.w, this.netOptions.h, this.netOptions.color); // DRAW A RECTANGLE WITH SPACE
        }
    }


    play(){
        this.update()
        this.render();

        // CALL FRAME
        this.animationFrame = requestAnimationFrame(() => this.play());
    }

    // START RENDERING THE GAME
    render(){
        // CANVAS
        this.drawRect(this.canvasOptions.x, this.canvasOptions.y, this.canvasOptions.w, this.canvasOptions.h, this.canvasOptions.color);
        // PADDLE
        this.drawRect(this.userOptions.x, this.userOptions.y, this.userOptions.w, this.userOptions.h, this.userOptions.color);
        this.drawRect(this.computerOptions.x, this.computerOptions.y, this.computerOptions.w, this.computerOptions.h, this.computerOptions.color);
        // NET
        this.drawNet();
        // BALL
        this.drawCircle(this.ballOptions.x, this.ballOptions.y, this.ballOptions.r, this.ballOptions.color);
        // SCORES
        this.drawText(this.userOptions.score, this.userScoreOptions.x, this.userScoreOptions.y, this.scoresOptions.color);
        this.drawText(this.computerOptions.score, this.computerScoreOptions.x, this.computerScoreOptions.y, this.scoresOptions.color);
    }

    // UPDATE, COLISSION DETECTION AND SCORE UPDATE
    update(){
        this.ballOptions.y += this.ballOptions.velocity[1];
        this.ballOptions.x += this.ballOptions.velocity[0]; // INCREASE TO THE CORRECT POSITION

        // BALL COLLISION CHECK
        this.ballCollision();
        // BOT ENGINE
        this.botPaddle();
    }

    paddleCollision(ball, player){
        ball.top = ball.y - ball.r;
        ball.bottom = ball.y + ball.r;
        ball.left = ball.x - ball.r;
        ball.right = ball.x + ball.r;

        player.top = player.y;
        player.bottom = player.y + player.h;
        player.left = player.x;
        player.right = player.x + player.w;

        return ball.top < player.bottom && ball.bottom > player.top && ball.left < player.right && ball.right > player.left;
    }

    ballCollision(){
        // CANVAS WALL COLLISION
        if(
            (this.ballOptions.y + this.ballOptions.r) >= this.canvas.height || // COLLISION IN THE WALL OF THE BOTTOM OF THE CANVAS 
            (this.ballOptions.y - this.ballOptions.r) <= 0 // THE TOP
        ){

            // REVERSE THE VELOCITY Y DIRECTION
            this.ballOptions.velocity[1] = - this.ballOptions.velocity[1];
        }

        // PADDLE COLLISION
        let playerSide = (this.ballOptions.x > this.canvas.width/2)? this.computerOptions : this.userOptions;  // PASS THE CORRECT SIDE IN THE CANVAS, MEANS THAT IF THE BALL IS IN THE SIDE OF THE COMPUTER CHECK THE COMPUTER ONLY
        // PADDLE COLLISION
        if(this.paddleCollision(this.ballOptions, playerSide)){ //

            // CREATE A RELATIVE COLLIDEPOINT BECAUSE THE BALL WHEN COLLIDE WITH ONE PADDLE THE PADDLE WILL RETURN THE BALL WITH AN CERTAIN ANGLE
            //
            // -- TOP ------> Return -45º
            // ||
            // || MIDDLE ---> Return 0º
            // ||
            // -- BOTTOM --> Return 45º
            //----------------------------------------------------------------------------------------------------------
            // HOW TO GET?
            // 
            //                  user.y - ( paddle.y + paddle.height/2 )
            // collidepoint = --------------------------------------------
            //                          (paddle.height/2)
            //
            //
            //                             100 - (80 + 100/2)       100 - (80 + 50)         100 - 130       -30
            // EXAMPLE: collidepoint = ------------------------ = -------------------- = --------------- = ------ = -0.6
            //                                    (100/2)               50                     50            50
            //-----------------------------------------------------------------------------------------------------------
            // AND IF WE USE sin AND COS WE CAN GET VELOCITY VECTOR
            //
            // EXAMPLE: THE BALL COLLIDE WITH THE PADDLE AND WILL RETURN NEW VELOCITY AND CREATE AN ANGLE ( MAX ANGLE 45º IN THE TOP AND THE BOTTON)
            //
            // angle = collidepoint * (Math.PI/4) = -0.47º // IN RADIAN
            //
            // ball.speed = 5; // THIS IS THE DEFAULT SPEED, THIS VALUE IS NOT A VECTOR SO IT MUSN'T BE A NEGATIVE
            //
            // y = ball.speed * sin( angle ) = ball.speed * -0.45399... = 5 * -0.453... = -2.2699... // THE BALL MOVE UP 
            // x = ball.speed * cos( angle ) = ball.speed * 0.8910... = 5 * 0.8910... = 4.4550.... // THE BALL MOVE FORWARDS
            // velocity = [x, y];

            let collidePoint = this.ballOptions.y - ( playerSide.y + playerSide.h/2 );
            collidePoint = collidePoint / (playerSide.h/2);

            let angleRad = collidePoint * (Math.PI/4); // RADIANS 2𝜋 IS A FULL CIRCLE, 𝜋 SEMICIRCLE, 𝜋/2 90º

            let direction = (this.ballOptions.x < this.canvas.width/2)? 1 : -1; // CORRECT DIRECTION

            this.ballOptions.velocity[0] = direction * (this.ballOptions.speed * Math.cos(angleRad));
            this.ballOptions.velocity[1] = (this.ballOptions.speed * Math.sin(angleRad));


            this.ballOptions.speed += this.ballOptions.acceleration; // THE BALL WILL BE MORE FASTER THAN BEFORE
        }

        // CHECK IF COLLITE IN THE BOTTOM AND EARN ONE POINT
        if((this.ballOptions.x + this.ballOptions.r) > this.canvas.width){
            // USER WON
            this.userOptions.score += 1;
            this.ballReset();
        }else if((this.ballOptions.x - this.ballOptions.r) < 0){
            // COMPUTER WON
            this.computerOptions.score += 1;
            this.ballReset();
        }
    }
    
    // RESET THE BALL
    ballReset(){
        this.ballOptions.x = this.canvas.width/2;
        this.ballOptions.y = this.canvas.height/2;

        // RESET SPEED
        this.ballOptions.speed = (this.options.ball && this.options.ball.speed)? ((this.options.ball.speed > 0) ? this.options.ball.speed : -this.options.ball.speed ) : 5;
        this.ballOptions.velocity[0] = -this.ballOptions.velocity[0]; // CHANGE THE DIRECTION
    }

    // BOT PADDLE ENGINE
    botPaddle(){

        if(this.bot == 'Bot'){
            // CALL THE NORMAL BOT
            this.botEngine();
        }else if(this.bot == 'Random'){
            // CALL RANDOM BOT
            this.randomBot();
        }
    }

    // TYPES OF BOT
    botEngine(){
        // SIMPLE AND EASY BOT
        // ONLY FOLLOW THE BALL
        this.computerOptions.y = (this.ballOptions.y - (this.computerOptions.h/2));
    }

    
    randomBot(){
        // IF TOUCH THE WALL CHANGE DIRECTION
        if(this.computerOptions.y <= 0 || this.computerOptions.y >= this.canvas.height){
            this.botVelocity = -this.botVelocity;
        }

        this.computerOptions.y += this.botVelocity;

    }
}