const PingPongParams = {

    controls: ['keyboard'], // HOW TO CONTROL THE PADDLE

    // AVALIABLE OPTIONS
    // 
    // keyboard, mouse, touch

    bot: 'Bot', // TWO VALUES AVALIABLES: 'Random' and 'Bot'
    botVelocity: 5, // IN CASE YOU CHOOSE 'Random' YOU MUST TO SPECIFY THE VELOCITY

    canvas: {
        height: 400, // THE HEIGHT OF THE CANVAS
        width: 700, // THE WIDTH OF THE CANVAS
        color: '#fff', // THE BACKGROUND OF THE CANVAS
        orientation: 'horizontal' // FOR MOBILE DEVICES CHOOSE VERTICAL orientation: 'vertical'
    },

    paddle: {
        width: 10, // WIDTH OF THE PADDLE
        height: 100, // HEIGHT OF THE PADDLE
        color: '#fff' // THE COLOR OF THE PADDLE
    },

    net: {
        width: 2,
        height: 10, // THE HEIGHT OF EVERY MINI RECTANGLES
        space: 15, // THE EMPTY SPACE FOR EVERY MINI RECTANGLES OF THE NET
        color: '#fff'
    },

    ball: {
        radius: 10, // THE WIDTH & HEIGHT ( radius ) OF THE BALL
        color: '#ff0000', // COLOR OF THE BALL
        velocity: [5, 5], // VELOCITY ARRAY [x, y]
        speed: 5, // CONSTANT VELOCITY THAT IS NOT A VECTOR, THAT MEANS THIS VALUE DIDN'T HAVE DIRECTION
        acceleration: 0.1 // EVERY TIMES WHEN THE BALL COLLIDE THE PADDLES ADD THIS ACCELERATION, IF YOU WANT MAKE NEUTRAL PUT 0 OR NEGATIVE FOR SLOW DOWN BUT WHEN THE BALL SPEED BECOME 0 THE BALL WILL MAKE NEGATIVE VELOCITY
    },

    scores: {
        fontSize: 32, // THE FONTSIZE OF THE NUMBER SCORE IN PX
        fontFamily: 'Consolas', // FONTFAMILY MUST BE ONE THAT EVERY COMPUTER HAVE IT LIKE ARIAL
        color: '#fff' // COLOR OF THE NUMBER
    }
}