var Tank = {};
var score = 0;
var scoreText;

Tank.configs = {
    GAME_WIDTH: 800,
    GAME_HIGHT: 600
};
window.onload = function() {
    Tank.game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
        preload: preload,
        create: create,
        update: update
    });
};

function preload() {

    Tank.game.load.image('sky', 'assets/sky.png');
    Tank.game.load.image('ground', 'assets/platform.png');
    Tank.game.load.image('star', 'assets/star.png');
    Tank.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

function create() {


    //Khoi dong che do physics
    Tank.game.physics.startSystem(Phaser.Physics.ARCADE);

    Tank.game.add.sprite(0, 0, 'sky');

    //Tao Group platforms
    Tank.platforms = Tank.game.add.group();
    Tank.stars = Tank.game.add.group();
    //Bat che do vat ly voi tat ca doi tuong tao ra tu Group
    Tank.platforms.enableBody = true;

    //Tao bai co
    Tank.ground = Tank.platforms.create(0, Tank.configs.GAME_HIGHT - 64, 'ground');

    //Thay doi ti le cua ground
    Tank.ground.scale.setTo(2, 2);

    //Dat cho bui co bat dong
    Tank.ground.body.immovable = true;

    //Tao 2 cai go
    Tank.ledge = Tank.platforms.create(400, 400, 'ground');
    Tank.ledge.body.immovable = true;
    Tank.ledge = Tank.platforms.create(-150, 250, 'ground');
    Tank.ledge.body.immovable = true;

    //Tap player
    Tank.player = Tank.game.add.sprite(32, Tank.configs.GAME_HIGHT - 150, 'dude');

    //Thiet lap che do vat li
    Tank.game.physics.arcade.enable(Tank.player);

    //  Player physics properties. Give the little guy a slight bounce.
    Tank.player.body.bounce.y = 0.2;
    Tank.player.body.gravity.y = 300;
    Tank.player.body.collideWorldBounds = true;

    ////  Our two animations, walking left and right.
    Tank.player.animations.add('left', [0, 1, 2, 3], 10, true);
    Tank.player.animations.add('right', [5, 6, 7, 8], 10, true);

    //Tạo sao
    Tank.stars.enableBody = true;
    for (var i = 0; i < 12; i++) {
        var star = Tank.stars.create(i * 70, 0, 'star');
        star.body.gravity.y = 10;
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    scoreText = Tank.game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
}

function update() {
    //  Collide the player and the stars with the platforms
    var hitPlatform = Tank.game.physics.arcade.collide(Tank.player, Tank.platforms);

    // Thiet lap chyen dong cho nguoi choi
    var cursors = Tank.game.input.keyboard.createCursorKeys();

    //duaw van toc nguoi choi ve 0
    Tank.player.body.velocity.x = 0;
    if (cursors.left.isDown) {
        Tank.player.body.velocity.x = -150;
        Tank.player.animations.play('left');
    } else if (cursors.right.isDown) {
        Tank.player.body.velocity.x = 150;
        Tank.player.animations.play('right');
    } else {
        Tank.player.animations.stop();
        Tank.player.frame = 4;
    }
    if (cursors.up.isDown && Tank.player.body.touching.down && hitPlatform) {
        Tank.player.body.velocity.y = -350;
    }
    Tank.game.physics.arcade.collide(Tank.stars, Tank.platforms);
    Tank.game.physics.arcade.overlap(Tank.player, Tank.stars, collectStar, null, this);
}

function collectStar(player, star) {

    // Removes the star from the screen
    star.kill();

    score += 10;
    scoreText.text = 'Score: ' + score;

}
