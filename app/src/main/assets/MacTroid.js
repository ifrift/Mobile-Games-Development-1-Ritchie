var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;

var canvas;
var canvasContext;
var canvasX;
var canvasY;
var timer = 0;
var keys = [];
var flying = [];
var grunt = [];
var bullet = [];
var floor = [];
var bang = [];
var floorRoom1 = [];
var floorRoom2 = [];
var floorRoom3 = [];
var lava = [];
var wall = [];
var topWall;
var button;
var angle = Math.PI;
var angleTimes = 1;
var divide = 180;
var tiles = new Image();
var screenNo = 0;
var playerHurt = false;
tiles.src = 'tiles.png';
var gameOver = new Image();
gameOver.src = 'gameOver.jpeg';
var friction = 0.8;
var health = new Image();
health.src = 'health.png';
var knockBack = 0;
var cityBackgroundX = 0;
var healthPickUp = [];
var healthPickTest = new Image();
healthPickTest.src = 'healthPickUp.png'
var buttonTest = new Image();
buttonTest.src = 'button.png'
var doorTest = new Image();
doorTest.src = 'door.png'
var bossLaserImg = new Image();
bossLaserImg.src = 'bossLaser3.png'
var win = new Image();
win.src = 'win.png'
//var wall = new Image();
//wall.src = 'wall.png'


var cityBackground = new Image();
cityBackground.src = 'cityBackground.jpg'
var cityBackground2 = new Image();
cityBackground2.src = 'cityBackground.jpg'
//Camera---------------------------
//var cameraTranslation;


//cameraTranslation = {x:0, y:0};
//var laser = new Image();
//laser.src = 'laser.png'

var randomTile = Math.random() *2 +1
var randomPoint;
var randomAtkType;
var macTroid;

var floor;

canvas = document.getElementById('gameCanvas');
canvasContext = canvas.getContext('2d');

var gameOverScreen = false;
var dir = 0.25;
var flyingDirY = 0.75;
var flyingDirX = -1;
var bulletCounter = 0;
var bulletCounterLeft = 10;
var bulletTimer = 0;
var isKeyPressed = false;
var bulletDir = 1;
var gruntDir = 0.25;
//var ang = 0;
var enemyNumber = 0;
var crouched;

//Sound Object-------------------------------

var hurt = new Audio('hurt.wav');
var rocketFire = new Audio('rocketFire.wav');
var enemyHurt = new Audio('enemyHurt.wav');
var enemyDying = new Audio('enemyDead.wav');
var buttonBeep = new Audio('ButtonBeep.wav');
var laserDoor = new Audio('laserDoor.wav');
var speedCharge = new Audio('speedCharge.wav');
var beam = new Audio('beam.FLAC');
var laserAttack = new Audio('laserAttack.OGG');
var bossMusic = new Audio('bossMusic.mp3');

//Objects start------------------------------
function LivingObj()
{
    this.living = true;
}

function InaniObj(width, height)
{
    this.width = 32;
    this.height = 32;
    this.spriteX = 16;
    this.spriteY = 32;
    this.spriteWidth = 32;
    this.spriteHeight = 32;
}

function Platform(name, x, y)
{
    InaniObj.call(this)
    {
        this.name = name;
        this.x = x;
        this.y = y;
    }
}

function Bullet(name, img)
{
    InaniObj.call(this)
    {
        this.timer = 9;
        this.name = name;
        this.img = new Image();
        this.img.src = img;
        this.y = -40;
        this.dir = 8;
        this.vel = 0;
        this.spriteX = 70;
        this.spriteY = 34;
        70, 34
    }
}

function PowerUp(name, img)
{
    InaniObj.call(this)
    {
        this.name = name;
        this.img = new Image();
        this.img.scr = img;
    }
}

function Interactable(name, img, x, y, width, height)
{
    InaniObj.call(this)
    {
        this.name = name;
        this.img = new Image();
        this.img.scr = img;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.doorOpen = false;
    }
}

var crouching;
var standing;

function Player(name, x, y, width, height, hp, ammo, img, currentFrame, frameX, frameY, maxFrame, maxFrameX, maxFrameY, timer, firing, startingFrameX, startingFrameY)
{
    LivingObj.call(this)
    {
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.hp = hp;
        this.ammo = ammo;
        this.img = new Image();
        this.img.src = img;
        this.currentFrame = currentFrame;
        this.frameX = frameX;
        this.frameY = frameY;
        this.startingFrameX = startingFrameX;
        this.startingFrameY = startingFrameY;
        this.maxFrame = maxFrame;
        this.maxFrameX = maxFrameX;
        this.maxFrameY = maxFrameY;
        this.timer = timer;
        this.firing = firing;
        this.velX = 0;
        this.velY = 0;
    }
}
var fire = false;
function Enemy(name, x, y, width, height, hp, img, frameX, maxFrame, timer, startingX, startingY, ang)
{
    LivingObj.call(this);
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.hp = hp;
        this.img = new Image();
        this.img.src = img;
        this.frameX = frameX;
        this.maxFrame = maxFrame;
        this.timer = timer;
        this.startingX = startingX;
        this.startingY = startingY;
        this.ang = ang;
}

Interactable.prototype = Object.create(InaniObj.prototype);
Bullet.prototype = Object.create(InaniObj.prototype);
PowerUp.prototype = Object.create(InaniObj.prototype);
Platform.prototype = Object.create(InaniObj.prototype);
Enemy.prototype = Object.create(LivingObj.prototype);
Player.prototype = Object.create(LivingObj.prototype);

//Object end--------------------------------------------------

window.addEventListener("load", function (){
    start();
    update();
});


function start(){
    init();
}

function init(){
    //Player
    macTroid = new Player ("macTroid", 70, canvas.height - 75, 47, 50, 6, 10,  'playerSprite.png', 0, 0, 0, 0, 0, 0, 0, false, 0, 0)

    //boss
    boss = new Enemy("boss", canvas.width / 2, (canvas.height / 2) - 300, 96, 90, 200, 'boss.png', 0, 0, 0);

    //Enemies
    for (var enemyNo = 0; enemyNo < 19; enemyNo++)
    {
        bullet[enemyNo] = new Bullet("bullet", 'bullet.png');
        bang[enemyNo] = new Bullet("bullet", 'bullet.png');
        flying[enemyNo] = new Enemy("flying", -100, -100, 20, 20, 5, 'waverSprite.png', 0, 4, 0);
        grunt[enemyNo] = new Enemy("grunt", -100, -100, 54, 38, 10, 'sciserSprite.png', 0, 4, 0, canvas.width/2, canvas.height - 56);
    }

    //health

        healthPickUp[0] = new Interactable("healthPickUp", 'healthPickUp.png', 2000, 60, 15, 15);
        healthPickUp[1] = new Interactable("healthPickUp", 'healthPickUp.png', 5800, 30, 15, 15);

    topWall = new Platform ("topWall", 0, -64);
    topWall.width = 10000;
    topWall.height = 32;

    //button
    button = new Interactable("button", 'button.png', 2285, 90, 50, 20);
    door = new Interactable("door", 'door.png', 3150, -70, 36, 224);
    bossLaser = new Interactable("bossLaser", 'bossLaser.png', boss.x + 5, boss.y + 25, 36, 128);

    //lava
    for (var floorNo = 0; floorNo < 300; floorNo++)
    {
        lava[floorNo] = new Platform ("floor", 32*floorNo, 136);
    }

    //Platforms
    for (var floorNo = 0; floorNo < 48; floorNo++)
    {
        floor[floorNo] = new Platform ("floor", 32*floorNo, 120);
    }
    for (var floorNo = 0; floorNo < 96; floorNo++)
    {
        floorRoom1[floorNo] = new Platform ("floor", 32*floorNo + (1536), 120);
    }
    for (var floorNo = 48; floorNo < 60; floorNo++)
    {
        floorRoom1[floorNo].x -= 1152;
    }
    for (var floorNo = 60; floorNo < 72; floorNo++)
    {
        floorRoom1[floorNo].x -= 1152;
    }


    for (var floorNo = 0; floorNo < 96; floorNo++)
    {
        floorRoom2[floorNo] = new Platform ("floor", 32*floorNo + (3072), 120);
    }
    for (var floorNo = 48; floorNo < 60; floorNo++)
    {
        floorRoom2[floorNo].x -= 1152;
    }
    for (var floorNo = 60; floorNo < 72; floorNo++)
    {
        floorRoom2[floorNo].x -= 2304;
    }
    for (var floorNo = 72; floorNo < 81; floorNo++)
    {
        floorRoom2[floorNo].x -= 1824;
    }


    for (var floorNo = 0; floorNo < 96; floorNo++)
    {
        floorRoom3[floorNo] = new Platform ("floor", 96*floorNo + (4564), 120);
        floorRoom3[floorNo].width = 32;
    }
    for (var floorNo = 48; floorNo < 60; floorNo++)
    {
        floorRoom3[floorNo].x -= 1152;
    }
    for (var floorNo = 60; floorNo < 72; floorNo++)
    {
        floorRoom3[floorNo].x -= 2304;
    }
    for (var floorNo = 72; floorNo < 81; floorNo++)
    {
        floorRoom3[floorNo].x -= 1824;
    }
    for (var floorNo = 81; floorNo < 90; floorNo++)
    {
        floorRoom3[floorNo] = new Platform ("floor", 32*floorNo + (4564), 120);
        floorRoom3[floorNo].x -= 1152;
    }


    wall[0] = new Platform("floor", -600, 0);
    wall[0].width = wall[0].height = 640;
    wall[1] = new Platform("floor", 6300, 0);
    wall[1].width = wall[1].height = 640;
    wall[2] = new Platform("floor", 9000, 60);
    wall[3] = new Platform("floor", 12000, 60);

    //Enemy starting positions
    totalHealth = 9;

    flying[0].y = 50;
    flying[0].x = 1200;
    flying[0].startingX = 1200;
    flying[1].startingX = 2800;
    flying[1].y = 10;
    flying[1].x = 2800;
    flying[2].y = 10;
    flying[2].x = 2600;
    flying[2].startingX = 2600;
    flying[3].startingX = 2800;
    flying[3].x = 1000;
    flying[3].startingX = 1000;
    flying[3].y = 70;
    flying[4].x = 5000;
    flying[4].startingX = 5000;
    flying[4].y = 70;
    flying[5].startingX = 5300;
    flying[5].y = 70;
    flying[5].x = 5300;

    grunt[0].x = startingX = 200;
    grunt[0].y = 102;
    grunt[1].x = startingX = 400;
    grunt[1].y = 102;
    grunt[2].x = startingX = 600;
    grunt[2].y = 102;
    grunt[3].x = startingX = 800;
    grunt[3].y = 102;
    grunt[4].x = startingX = 2600;
    grunt[4].y = 102;
    grunt[5].x = startingX = 1800;
    grunt[5].y = 102;
    grunt[6].x = startingX = 3200;
    grunt[6].y = 102;
    grunt[7].x = startingX = 4200;
    grunt[7].y = 102;
    grunt[8].x = startingX = 4500;
    grunt[8].y = 102;


    randomPoint = 3;
    randomAtk();
    for (var i = 0; i < 19; i++)
    {
        bang[i].spriteY = 320;
        bang[i].spriteX = 0;
        bang[i].x = 0;
        bang[i].y = 0;
    }
}

function update()
{
    switch (screenNo)
    {
        case 0:
        startScreenRender();
        break;
        case 1:
        render();
        gameplay();
        break;
        case 2:
        renderGameOver();
        break;
        case 3:
        renderBoss();
        break;
        case 4:
        winScreen()
        break;
    }
    requestAnimationFrame(update);
}

function startScreenRender(){
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    var startScreen = new Image();
    startScreen.src = 'startBackground.png';
    canvasContext.drawImage(startScreen, 0, 0, canvas.width, canvas.height);

    var mactroidStart = new Image();
    mactroidStart.src = 'mactroidStart.png';
    canvasContext.drawImage(mactroidStart, 0, 0, 100, 150);
    canvasContext.fillStyle = "lightskyblue";
    canvasContext.font = "24px Arial";
    canvasContext.fillText("MacTroid", 95, 40);
    canvasContext.font = "12px Arial";
    canvasContext.fillText("A = Left", 115, 60);
    canvasContext.font = "12px Arial";
    canvasContext.fillText("D = Right", 115, 70);
    canvasContext.font = "12px Arial";
    canvasContext.fillText("W = Jump", 115, 80);
    canvasContext.font = "12px Arial";
    canvasContext.fillText("S = Crouch", 115, 90);
    canvasContext.font = "12px Arial";
    canvasContext.fillText("Space = Fire", 115, 100);

    canvasContext.font = "12px Arial";
    canvasContext.fillText("Press Enter to Start / Interact", 115, 120);

  if (keys[13])
  {
    screenNo = 1;
  }

  if (keys[32])
  {
    screenNo = 3;
  }
}

function render(){
    //Clear Canvas----------------------------------------
    canvasContext.clearRect(0, 0, canvas.width * 2, canvas.height * 2);
    levelLayout();

    //Health Bar

    for (var i = 0; i < totalHealth; i++)
    {
        canvasContext.drawImage(health, 20 + (5 * i), 20, 6, 15);
    }
    //Health Pick Up
    for (var i = 0; i < 2; i++)
    {
        if (healthPickUp[i] !== null)
        {
            canvasContext.drawImage(healthPickTest, healthPickUp[i].x, healthPickUp[i].y, healthPickUp[i].width, healthPickUp[i].height);
        }
    }


    //Draw Bullets---------------------------------------------
    for (var i = 0; i < 19; i++)
    {
        canvasContext.drawImage(bullet[i].img, bullet[i].spriteX, bullet[i].spriteY, 18, 8, bullet[i].x, bullet[i].y, 18, 8);
    }

    //Draw Player-----------------------------------------------
    canvasContext.drawImage(macTroid.img, macTroid.width * macTroid.frameX, (macTroid.height * macTroid.frameY) + (5 * macTroid.frameY) , macTroid.width, macTroid.height, macTroid.x, macTroid.y, macTroid.width, macTroid.height);
}

    function animationBang()
    {
        for (var i = 0; i < 9; i++)
        {
            timer++;
            if (timer > 10)
            {
                bang[i].spriteX++;
                timer = 0;
                if (bang[i].spriteX >= 7)
                {
                    bang[i].spriteX = 0;
                }
            }
        }
    }

function levelLayout(){
    canvasContext.drawImage(cityBackground, cityBackgroundX, 0, canvas.width * 2, canvas.height)
    canvasContext.drawImage(cityBackground2, cityBackgroundX + (canvas.width * 2), 0, canvas.width * 2, canvas.height)

    for (var i = 0; i < 300; i++)
    {
        canvasContext.drawImage(tiles, lava[i].spriteX*4, lava[i].spriteY*14.5, lava[i].spriteWidth, lava[i].spriteHeight, lava[i].x, lava[i].y, lava[i].width, lava[i].height);
    }

    //Draw Floor-----------------------------------------------
    for (var i = 0; i < 48; i++)
    {
        canvasContext.drawImage(tiles, floor[i].spriteX*3, floor[i].spriteY*3, floor[i].spriteWidth, floor[i].spriteHeight, floor[i].x, floor[i].y, floor[i].width, floor[i].height);
    }
    levelPart1();
    levelPart2();
    levelPart3();
}

function levelPart1(){
    //Platforms
    //canvasContext.fillRect(door.x, door.y, door.width, door.height);
    canvasContext.drawImage(doorTest, door.x + 80, door.y, door.width, door.height);

    for (var floorNo = 0; floorNo < 48; floorNo++)
    {
        floorRoom1[floorNo].y = 120;
        canvasContext.drawImage(tiles, floorRoom1[floorNo].spriteX*4, floorRoom1[floorNo].spriteY*16, floorRoom1[floorNo].spriteWidth, floorRoom1[floorNo].spriteHeight, floorRoom1[floorNo].x, floorRoom1[floorNo].y, floorRoom1[floorNo].width, floorRoom1[floorNo].height);
    }

    for (var floorNo = 48; floorNo <60; floorNo++)
    {
        floorRoom1[floorNo].y = 88;
        canvasContext.drawImage(tiles, floorRoom1[floorNo].spriteX*4, floorRoom1[floorNo].spriteY*16, floorRoom1[floorNo].spriteWidth, floorRoom1[floorNo].spriteHeight, floorRoom1[floorNo].x, floorRoom1[floorNo].y, floorRoom1[floorNo].width, floorRoom1[floorNo].height);
    }

    for (var floorNo = 60; floorNo <72; floorNo++)
    {
        floorRoom1[floorNo].y = 40;
        canvasContext.drawImage(tiles, floorRoom1[floorNo].spriteX*4, floorRoom1[floorNo].spriteY*16, floorRoom1[floorNo].spriteWidth, floorRoom1[floorNo].spriteHeight, floorRoom1[floorNo].x, floorRoom1[floorNo].y, floorRoom1[floorNo].width, floorRoom1[floorNo].height);
    }

    canvasContext.drawImage(buttonTest, button.x, button.y, button.width - 30, button.height);
}

function levelPart2(){
    //Platforms
    for (var floorNo = 0; floorNo < 48; floorNo++)
    {
        floorRoom2[floorNo].y = 120;
        canvasContext.drawImage(tiles, floorRoom2[floorNo].spriteX*16, floorRoom2[floorNo].spriteY*7, floorRoom2[floorNo].spriteWidth, floorRoom2[floorNo].spriteHeight, floorRoom2[floorNo].x, floorRoom2[floorNo].y, floorRoom2[floorNo].width, floorRoom2[floorNo].height);
    }

    for (var floorNo = 48; floorNo < 60; floorNo++)
    {
        floorRoom2[floorNo].y = 88;
        canvasContext.drawImage(tiles, floorRoom2[floorNo].spriteX*16, floorRoom2[floorNo].spriteY*7, floorRoom2[floorNo].spriteWidth, floorRoom2[floorNo].spriteHeight, floorRoom2[floorNo].x, floorRoom2[floorNo].y, floorRoom2[floorNo].width, floorRoom2[floorNo].height);
    }

    for (var floorNo = 60; floorNo < 72; floorNo++)
    {
        floorRoom2[floorNo].y = 40;
        canvasContext.drawImage(tiles, floorRoom2[floorNo].spriteX*16, floorRoom2[floorNo].spriteY*7, floorRoom2[floorNo].spriteWidth, floorRoom2[floorNo].spriteHeight, floorRoom2[floorNo].x, floorRoom2[floorNo].y, floorRoom2[floorNo].width, floorRoom2[floorNo].height);
    }
    for (var floorNo = 72; floorNo < 90; floorNo++)
    {
        floorRoom2[floorNo].y = 56;
        canvasContext.drawImage(tiles, floorRoom2[floorNo].spriteX*16, floorRoom2[floorNo].spriteY*7, floorRoom2[floorNo].spriteWidth, floorRoom2[floorNo].spriteHeight, floorRoom2[floorNo].x, floorRoom2[floorNo].y, floorRoom2[floorNo].width, floorRoom2[floorNo].height);
    }
}

function levelPart3(){
    //Platforms
    for (var floorNo = 0; floorNo < 48; floorNo++)
    {
        floorRoom3[floorNo].y = 120;
        canvasContext.drawImage(tiles, floorRoom3[floorNo].spriteX *48, floorRoom3[floorNo].spriteY*12, floorRoom3[floorNo].spriteWidth, floorRoom3[floorNo].spriteHeight, floorRoom3[floorNo].x, floorRoom3[floorNo].y, floorRoom3[floorNo].width, floorRoom3[floorNo].height);
    }

    for (var floorNo = 48; floorNo <60; floorNo++)
    {
        floorRoom3[floorNo].y = 88;
        canvasContext.drawImage(tiles, floorRoom3[floorNo].spriteX*48, floorRoom3[floorNo].spriteY*12, floorRoom3[floorNo].spriteWidth, floorRoom3[floorNo].spriteHeight, floorRoom3[floorNo].x, floorRoom3[floorNo].y, floorRoom3[floorNo].width, floorRoom3[floorNo].height);
    }

    for (var floorNo = 60; floorNo <72; floorNo++)
    {
        floorRoom3[floorNo].y = 300;
        //canvasContext.drawImage(tiles, floorRoom3[floorNo].spriteX*32, floorRoom3[floorNo].spriteY*12, floorRoom3[floorNo].spriteWidth, floorRoom3[floorNo].spriteHeight, floorRoom3[floorNo].x, floorRoom3[floorNo].y, floorRoom3[floorNo].width, floorRoom3[floorNo].height);
    }

    for (var floorNo = 81; floorNo < 90; floorNo++)
    {
        floorRoom3[floorNo].y = 120;
        floorRoom3[floorNo].width = 64;
        canvasContext.drawImage(tiles, floorRoom3[floorNo].spriteX*16, floorRoom3[floorNo].spriteY*19, floorRoom3[floorNo].spriteWidth, floorRoom3[floorNo].spriteHeight, floorRoom3[floorNo].x, floorRoom3[floorNo].y, floorRoom3[floorNo].width, floorRoom3[floorNo].height);
    }
    //wall.x = 3000;
    var my_gradient=canvasContext.createLinearGradient(0, 0, 170, 0);
    my_gradient.addColorStop(0, "black");
    my_gradient.addColorStop(1, "white");
    canvasContext.fillStyle = my_gradient;
    canvasContext.fillRect(wall[0].x, wall[0].y, wall[0].width, wall[0].height);
    canvasContext.fillRect(wall[1].x, wall[1].y, wall[1].width, wall[1].height);
    canvasContext.fillRect(wall[2].x, wall[2].y, 64, 64);
    canvasContext.fillRect(wall[3].x, wall[3].y, 64, 64);
}

function gameplay()
{
    playerMovement();
    flyingMovement();
    gruntMovement();
    flyingDeath();
    animations();
    spawnBullet();
    crouching = macTroid.y + 12;
    standing = macTroid.y - 12;
    colling();

        if (button.doorOpen)
        {
            door.y++;
        }

    for (var i = 0; i < 48; i++)
    {
        floor[i].x -= macTroid.velX + knockBack;
    }

    for (var i = 0; i < 96; i++)
    {
        floorRoom1[i].x -= macTroid.velX + knockBack;
        floorRoom2[i].x -= macTroid.velX + knockBack;
        floorRoom3[i].x -= macTroid.velX + knockBack;
    }

    for (var i = 0; i < 300; i++)
    {
        lava[i].x -= macTroid.velX + knockBack;
    }

    for (var i = 0; i < 9; i++)
    {
        flying[i].x -= macTroid.velX + knockBack;
        flying[i].startingX -= macTroid.velX + knockBack;
        grunt[i].x -= macTroid.velX + knockBack;
    }
    for (var i = 0; i < 2; i++)
    {
        if (healthPickUp[i] !== null)
        {
            healthPickUp[i].x -= macTroid.velX + knockBack;
        }
    }
    //healthPickUp[1].x -= macTroid.velX + knockBack;
    wall[0].x -= macTroid.velX + knockBack;
    wall[1].x -= macTroid.velX + knockBack;
    wall[2].x -= macTroid.velX + knockBack;
    wall[3].x -= macTroid.velX + knockBack;
    button.x -= macTroid.velX + knockBack;
    door.x -= macTroid.velX + knockBack;
    cityBackgroundX -= (macTroid.velX / 10);

    knockBack = 0;
    for (var i = 0; i < 9; i++)
    {
            var dir1 = colCheck(macTroid, grunt[i]);

            if (dir1 ==="l" || dir1 === "r")
            {
                macTroid.velX = 0;
                if (dir1 == "l")
                {
                    knockBack = 30;
                    hurt.volume = 0.1;
                    totalHealth--;
                    macTroid.velX = 0;
                    hurt.play();
                }

                else if (dir1 == "r")
                {
                    totalHealth--;
                    knockBack = -30;
                    macTroid.velX = 0;
                    hurt.volume = 0.1;
                    hurt.play();
                }
            }
            else if (dir1 ==="t" || dir1 ==="b")
            {
                macTroid.velY = 0;
                if (dir1 == "b")
                {
                    totalHealth--;
                    macTroid.y -= 30;
                    hurt.volume = 0.1;
                    hurt.play();
                }
            }
    }
    for (var i = 0; i < 9; i++)
    {
            var dir1 = colCheck(macTroid, flying[i]);

            if (dir1 ==="l" || dir1 === "r")
            {
                macTroid.velX = 0;
                if (dir1 == "l")
                {
                    knockBack = 30;
                    hurt.volume = 0.1;
                    totalHealth--;
                    macTroid.velX = 0;
                    hurt.play();
                }

                else if (dir1 == "r")
                {
                    totalHealth--;
                    knockBack = -30;
                    macTroid.velX = 0;
                    hurt.volume = 0.1;
                    hurt.play();
                }
            }
            else if (dir1 ==="t" || dir1 ==="b")
            {
                macTroid.velY = 0;
                if (dir1 == "b")
                {
                    totalHealth--;
                    macTroid.y -= 30;
                    hurt.volume = 0.1;
                    hurt.play();
                }
            }
    }
    if (totalHealth <= 0)
    {
        screenNo = 2;
    }
}

//Player movement------------------------------------------------------------
function playerMovement()
{
    macTroid.velX *= friction;
    macTroid.velY *= friction;
    if(screenNo == 3)
    {
        macTroid.x += macTroid.velX;
    }
    macTroid.y += macTroid.velY;
    macTroid.velY += 0.9;

    var move;
    if (keys[83]) move = "s";
    else if (keys[87]) move = "w";
    else if (keys[65]) move = "a";
    else if (keys[68]) move = "d";
    else {
    macTroid.currentFrame = 0;
    macTroid.frameY = 0;
    macTroid.height = 45;
    stand();
    if (bulletDir == 1) macTroid.frameX = 5;
    if (bulletDir == -1) macTroid.frameX = 4;
    }

    switch (move) {
    case "s":
        if (bulletDir == 1) macTroid.frameX = 5;
        if (bulletDir == -1) macTroid.frameX = 4;
        macTroid.frameY = 5.1;
        macTroid.height = 35;
        macTroid.velY++;
        crouch();
        break;

     case "w":
         if (bulletDir == 1)
         {
             animationPlayer(6, 5, 8, 22, 23);
             if (keys[68])
             {
                macTroid.velX++;
             }
         }
         if (bulletDir == -1)
         {
             animationPlayerLeft(6, 4, 1, 22, 23);
             if (keys[65])
             {
                macTroid.velX--;
             }
         }
         macTroid.velY -= 1.5;
         stand();
         break;

    case "d":
        macTroid.width = 48;
        macTroid.height = 45;
        animationPlayer(7, 5, 7, 13, 15);
        macTroid.velX++;
        bulletDir = 1;
        stand();
        break;

    case "a":
        macTroid.width = 47;
        macTroid.height = 45;
        animationPlayerLeft(7, 4, 1, 13, 15);
        macTroid.velX--;
        bulletDir = -1;
        stand();
        break;
    }

            var dir = colCheck(macTroid, door);
            if (dir === "l")
            {
                macTroid.velX = 0;
                macTroid.velX++;
                laserDoor.volume = 0.1;
                laserDoor.play();
            }
            else if (dir === "r")
            {
                macTroid.velX = 0;
                macTroid.velX--;
                laserDoor.volume = 0.1;
                laserDoor.play();
            }
            else if (dir ==="t" || dir ==="b")
            {
                macTroid.velY = 0;
                laserDoor.volume = 0.1;
                laserDoor.play();
            }
}
 function crouch()
 {
     if (!crouched)
     {
         macTroid.y = crouching;
         crouched = true;
     }
 }

function stand()
{
    if (crouched)
    {
        macTroid.y = standing;
        crouched = false;
    }
}

//Enemy movement--------------------------------------------------------
function gruntMovement()
{
    for (var i = 0; i < 9; i++)
    {
        grunt[i].x += gruntDir;
        if (grunt[i].x > grunt[i].startingX + 50 || grunt[i].x < grunt[i].startingX - 50)
        {
            gruntDir *= -1;
        }
        canvasContext.save();
        canvasContext.translate(grunt[i].x, grunt[i].y);
        canvasContext.rotate(grunt[i].ang);
        canvasContext.drawImage(grunt[i].img, grunt[i].frameX * 48, 47 * 5, 42, 26, grunt[i].width / -2, grunt[i].height / -2, grunt[i].width, grunt[i].height);
        canvasContext.restore();
    }
    deathCheck();
}

function flyingMovement()
{
    //flying[3].y += flyingDirY;
    for (var i = 0; i < 9; i++)
    {
        flying[i].x -= flyingDirX;


        if (flying[i].x > flying[i].startingX + 200 || flying[i].x < flying[i].startingX - 60)
        {
            angleTimes += flyingDirX;
            flyingDirX = flyingDirX * -1;
        }

                    canvasContext.save();
                    canvasContext.translate(flying[i].x, flying[i].y);
                    canvasContext.rotate(angle);
                    //canvasContext.fillRect(flying[i].width / -2, flying[i].height / -2, flying[i].width, flying[i].height)
                    canvasContext.drawImage(flying[i].img, flying[i].frameX * 27, 27, 27, 27, flying[i].width / -2, flying[i].height / -2, flying[i].width, flying[i].height);
                    canvasContext.restore();
    }
    //flyingDeath();
    angle = angleTimes * Math.PI;
    console.log(angleTimes);
}

function death()
{
    angle +=1;
    flying[3].y++;
}
//player col check ----------------------------------------
function colling ()
{
    var buttonDir = overCheck(macTroid, button);
        if (buttonDir !== null)
        {
            console.log("doorOpen");
            //macTroid.velX = 0;
            //macTroid.velX--;
            if (keys[13])
            {
                button.doorOpen = true;
                buttonBeep.volume = 0.1;
                buttonBeep.play();
            }
        }

    for (var i = 0; i < 48; i++)
    {
        var dir = colCheck(macTroid, floor[i]);

        if (dir === "l" || dir === "r")
        {
            macTroid.velX = 0;
        }
        else if (dir ==="t" || dir ==="b")
        {
            macTroid.velY = 0;
        }
    }

    for (var i = 0; i < 96; i++)
    {
        var dir = colCheck(macTroid, floorRoom1[i]);

        if (dir === "l")
        {
            macTroid.velX = 0;
            macTroid.velX++;
        }
        else if (dir === "r")
        {
            macTroid.velX = 0;
            macTroid.velX--;
        }
        else if (dir ==="t" || dir ==="b")
        {
            macTroid.velY = 0;
        }
    }
    for (var i = 0; i < 96; i++)
    {
        var dir = colCheck(macTroid, floorRoom2[i]);

        if (dir === "l")
        {
            macTroid.velX = 0;
            macTroid.velX++;
        }
        else if (dir === "r")
        {
            macTroid.velX = 0;
            macTroid.velX--;
        }
        else if (dir ==="t" || dir ==="b")
        {
            macTroid.velY = 0;
        }
    }

    for (var i = 0; i < 96; i++)
    {
        var dir = colCheck(macTroid, floorRoom3[i]);

        if (dir === "l")
        {
            macTroid.velX = 0;
            macTroid.velX++;
        }
        else if (dir === "r")
        {
            macTroid.velX = 0;
            macTroid.velX--;
        }
        else if (dir ==="t" || dir ==="b")
        {
            macTroid.velY = 0;
        }
    }

    var topWallStop = colCheck(macTroid, topWall);
        if (dir ==="t" || dir ==="b")
        {
            macTroid.velY = 0;
        }

    for (var i = 0; i < 2; i++)
    {
        if (healthPickUp[i] !== null)
        {
            var healthDir = colCheck(macTroid, healthPickUp[i]);
            if (healthDir !== null)
            {
                healthPickUp[i] = null;
                totalHealth = 9;
            }
        }
    }

    for (var i = 0; i < 300; i++)
    {
        var lavaDir1 = overCheck(macTroid, lava[i]);
        {
            if (lavaDir1 !== null && playerHurt === false)
            {
                hurt.volume = 0.1;
                macTroid.velY = -20;
                hurt.play();
                totalHealth--;
                playerHurt = true;
            }
        }
    }
    playerHurt = false;

    var endLevel = overCheck(macTroid, wall[1]);
    {
        if (endLevel !== null)
        {
            screenNo = 3;
        }
    }

    var startWall = colCheck(macTroid, wall[0]);
    {
        if (startWall !== null)
        {
            macTroid.velX++;
        }
    }
}

//Bullet Spawn---------------------------------------------------
function spawnBullet ()
{
    bulletTimer++

    if (keys[32] && bulletCounter < 8 && fire == false)
    {
        rocketFire.volume = 0.05;
        rocketFire.currentTime = 0;
        rocketFire.play();
        fire = true;
        if (bulletTimer > 5 && bulletDir == 1)
        {
            bulletCounter++;
            bulletTimer = 0;
            bullet[bulletCounter].spriteX = 70;
            bullet[bulletCounter].spriteY = 34;
            bullet[bulletCounter].x = macTroid.x + 25;
            bullet[bulletCounter].y = macTroid.y + 15;
            bullet[bulletCounter].vel = 8;
        }

        if (bulletTimer > 5 && bulletDir == -1 && bulletCounterLeft < 18)
        {
            bulletCounterLeft++;
            bulletTimer = 0;
            bullet[bulletCounterLeft].spriteX = 11;
            bullet[bulletCounterLeft].spriteY = 34;
            bullet[bulletCounterLeft].x = macTroid.x + 15;
            bullet[bulletCounterLeft].y = macTroid.y + 15;
            bullet[bulletCounterLeft].vel = 8;
        }
    }

    if (bulletTimer >= 5) fire = false;
    if (bulletCounter >= 8)
    {
        bulletCounter = 0;
    }

    if (bulletCounterLeft >= 18)
    {
        bulletCounterLeft = 10;
    }

    for (var i = 0; i < 9; i++)
    {
        bullet[i].x += bullet[i].vel;
    }

    for (var x = 10; x < 19; x++)
    {
        bullet[x].x -= bullet[x].vel;
    }

for (var enemyNumber = 0; enemyNumber < grunt.length; enemyNumber++)
{
    for (var i = 0; i < bullet.length; i++)
    {

        var dirBullet = colCheck(bullet[i], grunt[enemyNumber]);

            if (dirBullet == "r")
            {
                grunt[enemyNumber].hp -= 1;
                bullet[i].y = -300;
                enemyHurt.volume = 0.05;
                enemyHurt.currentTime = 0;
                enemyHurt.play();
            }
            else if (dirBullet =="l")
            {
                grunt[enemyNumber].hp -= 1;
                bullet[i].y = -300;
                enemyHurt.volume = 0.1;
                enemyHurt.currentTime = 0;
                enemyHurt.play();
            }

            var dirBulletFlying = colCheck(bullet[i], flying[enemyNumber]);
            if (dirBulletFlying == "r")
            {
            flying[enemyNumber].hp -= 1;
            bullet[i].y = -100;
            }
            else if (dirBulletFlying =="l")
            {
            flying[enemyNumber].hp -= 1;
            bullet[i].y = -100;
            }
        }
    }
    for (var i = 0; i < bullet.length; i++)
        {

            var dirBullet = colCheck(bullet[i], boss);

                if (dirBullet == "r")
                {
                    boss.hp -= 1;
                    bullet[i].y = -300;
                    enemyHurt.volume = 0.1;
                    enemyHurt.currentTime = 0;
                    enemyHurt.play();
                }
                else if (dirBullet =="l")
                {
                    boss.hp -= 1;
                    bullet[i].y = -300;
                    enemyHurt.volume = 0.1;
                    enemyHurt.currentTime = 0;
                    enemyHurt.play();
                }
                }
}


function deathCheck()
{
    for (var i = 0; i < 9; i++)
    {
        if (grunt[i].hp <= 0)
        {
            grunt[i].ang += 0.5;
            grunt[i].y += 2;
            enemyDying.volume = 0.4;
            //enemyDying.loop = false;
            //enemyDying.play();
        }
        if (flying[i].hp <=0)
        {
            //angle += 1;
            flying[i].y +=2;
            //enemyDead.volume = 0.1;
            //enemyDead.play();
        }
    }
}


 function macTroidLoseHealth() {
 /*
 var currentHealth = 5; ***will need to be set else where***
 if player hits enemy
 {
    totalHealth - 1;
    i - 1;
    play lose health animation {
     health[i] - 1
     health[i].y--;
     health[i].rotate(will be spinning)
     }

     for (var i = 0, i < currentHealth, i++)
        draw health image [i]
 }

 */
 }

function renderGameOver() {
    //Clear Canvas----------------------------------------
    canvasContext.clearRect(0, 0, canvas.width * 2, canvas.height * 2);

    canvasContext.drawImage(gameOver, 0, 0, canvas.width, canvas.height);
    //requestAnimationFrame(renderGameOver);

    for (var enemyNo = 0; enemyNo < 19; enemyNo++)
    {
        bullet[enemyNo] = null;
        flying[enemyNo] = null;
        grunt[enemyNo] = null;
    }

     if (keys[16])
     {
        init();
        screenNo = 0;
     }
}


//Enemy Animations----------------------------------------------------------
function animations()
{
    animationEnemy(flying, 0, flying[0].maxFrame);
    animationEnemy(flying, 3, flying[3].maxFrame);
    animationEnemy(grunt, 0, grunt[0].maxFrame);
    animationEnemy(grunt, 4, grunt[4].maxFrame);
}

function animationEnemy(enemyType, number, maxFrame)
{
    for (var i = 0; i < 9; i++)
    {
        enemyType[i].timer++;

        if (enemyType[i].timer > 10)
        {
            enemyType[i].frameX++;
            enemyType[i].timer = 0;

            if (enemyType[i].frameX >= maxFrame)
            {
                enemyType[i].frameX = 0;
            }
        }
    }
}

//Player Animations------------------------------------------------------------
function animationPlayer(maxFrame, startingFrameX, maxFrameX, startingFrameY, maxFrameY)
{
    macTroid.timer++;

    if (macTroid.currentFrame == 0)
    {
        macTroid.frameX = startingFrameX;
        macTroid.frameY = startingFrameY;
    }

    if (macTroid.timer > 5)
    {
        macTroid.frameX++;
        macTroid.timer = 0;

        if (macTroid.frameX > maxFrameX)
        {
            macTroid.frameY++;
            macTroid.frameX = startingFrameX;
        }

        macTroid.currentFrame++;

        if (macTroid.currentFrame > maxFrame)
        {
            macTroid.currentFrame = 0;
        }
    }
}

function animationPlayerLeft(maxFrame, startingFrameX, maxFrameX, startingFrameY, maxFrameY)
{
    macTroid.timer++;

    if (macTroid.currentFrame == 0)
    {
        macTroid.frameX = startingFrameX;
        macTroid.frameY = startingFrameY;
    }

    if (macTroid.timer > 5)
    {
        macTroid.frameX--;
        macTroid.timer = 0;

        if (macTroid.frameX < maxFrameX)
        {
            macTroid.frameY++;
            macTroid.frameX = startingFrameX;
        }

        macTroid.currentFrame++;

        if (macTroid.currentFrame > maxFrame)
        {
            macTroid.currentFrame = 0;
        }
    }
}

function flyingDeath()
{

}
//Collision
	function colCheck(shapeA, shapeB)
	{
			var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.height / 2)),
			vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
			// add the half widths and half heights of the objects
			hWidths = (shapeA.width / 2) + (shapeB.width / 2),
			hHeights = (shapeA.height / 2) + (shapeB.height / 2),
			colDir = null;
		// if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
		if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
			// figures out on which side we are colliding (top, bottom, left, or right)
			var oX = hWidths - Math.abs(vX),
				oY = hHeights - Math.abs(vY);
			if (oX >= oY) {
				if (vY > 0) {
					colDir = "t";
					shapeA.y += oY;
				} else {
					colDir = "b";
					shapeA.y -= oY;
				}
			} else {
				if (vX > 0) {
					colDir = "l";
					//shapeA.x += oX;
				} else {
					colDir = "r";
					//shapeA.x -= oX;
				}
			}
		}
		return colDir;
	}
	function overCheck(shapeA, shapeB)
	{
			var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.height / 2)),
			vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
			// add the half widths and half heights of the objects
			hWidths = (shapeA.width / 2) + (shapeB.width / 2),
			hHeights = (shapeA.height / 2) + (shapeB.height / 2),
			colDir = null;
		// if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
		if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
			// figures out on which side we are colliding (top, bottom, left, or right)
			var oX = hWidths - Math.abs(vX),
				oY = hHeights - Math.abs(vY);
			if (oX >= oY) {
				if (vY > 0) {
					colDir = "t";
					//shapeA.y += oY;
				} else {
					colDir = "b";
					//shapeA.y -= oY;
				}
			} else {
				if (vX > 0) {
					colDir = "l";
					//shapeA.x += oX;
				} else {
					colDir = "r";
					//shapeA.x -= oX;
				}
			}
		}
		return colDir;
	}

    	document.body.addEventListener("keydown", function (e) {
		keys[e.keyCode] = true;
		isKeyPressed = true;
	});

	document.body.addEventListener("keyup", function (e) {
		keys[e.keyCode] = false;
		isKeyPressed = false;
	});
var bossReady = false;
var attackEx = false;
var reset = false;
var bossPos = 1;
	function renderBoss()
	{
	    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
	    bossLayout();
        canvasContext.drawImage(boss.img, boss.spriteX, boss.spriteY, 130, 100, boss.x, boss.y, boss.width, boss.height);
        bossMusic.volume = 0.4;
        playerBoss();
        crouching = macTroid.y + 12;
        standing = macTroid.y - 12;
        playerMovement();
        spawnBullet();

        console.log(macTroid.hp);

            for (var enemyNo = 0; enemyNo < 19; enemyNo++)
            {
                flying[enemyNo].y = 500;
                grunt[enemyNo].y = 500;
            }
            wall[0].height = 0;

        colling();
        if (boss.hp > 0)
        {
	        bossMoving();
	        bossCollision();
	        bossMusic.play();
	        boss.spriteX = 100;
	        boss.spriteY = 5;
	    }
	    else
	    {
	            for (var i = 0; i < 19; i++)
                {
                    canvasContext.drawImage(bang[i].img, bang[i].spriteX * 51, bang[i].spriteY, 48, 48, bang[i].x, bang[i].y, 36, 36);
                    bang[i].x = boss.x + 40;
                    bang[i].y = boss.y + 60;
                    console.log(bang[0].spriteX);
                }
                bang[0].x = boss.x + 20;
                bang[0].y = boss.y + 10;
                bang[1].x = boss.x + 20;
                bang[1].y = boss.y + 20;
                bang[2].x = boss.x + 30;
                bang[2].y = boss.y;
                bang[3].x = boss.x + 40;
                bang[3].y = boss.y;
                bang[4].x = boss.x + 30;
                bang[4].y = boss.y + 10;
                bang[5].x = boss.x + 40;
                bang[5].y = boss.y + 20;
                bang[6].x = boss.x  + 30;
                bang[6].y = boss.y + 30;
                bang[7].x = boss.x + 40;
                bang[7].y = boss.y + 40;
                animationBang();
	        bossMusic.pause();
	        boss.spriteX = 240;
	        if(boss.x < canvas.width / 2)
	        {
	            boss.x++;
                boss.timer++;
                if(boss.timer > 5)
                {
                    bossPos = bossPos * -1;
                    boss.y += bossPos;
                    boss.timer = 0;
                }
	        }
	        else if (boss.x > canvas.width / 2)
	        {
	            boss.x--;
                boss.timer++;
                if(boss.timer > 5)
                {
                    bossPos = bossPos * -1;
                    boss.y += bossPos;
                    boss.timer = 0;
                }
	        }
	        else
	        {
                boss.y++;
                if (boss.y > 200)
                {
                    screenNo = 4;
                }
	        }
	    }
	        if (totalHealth <= 0)
            {
                screenNo = 2;
            }
	}

	function playerBoss()
	{
	    //Draw Bullets---------------------------------------------
        for (var i = 0; i < 19; i++)
        {
            canvasContext.drawImage(bullet[i].img, bullet[i].spriteX, bullet[i].spriteY, 18, 8, bullet[i].x, bullet[i].y, 18, 8);
        }

        //Draw Player-----------------------------------------------
        //canvasContext.fillRect(macTroid.x, macTroid.y, macTroid.width, macTroid.height)
        canvasContext.drawImage(macTroid.img, macTroid.width * macTroid.frameX, (macTroid.height * macTroid.frameY) + (5 * macTroid.frameY) , macTroid.width, macTroid.height, macTroid.x, macTroid.y, macTroid.width, macTroid.height);
        //totalHealth = macTroid.hp;
        for (var i = 0; i < totalHealth; i++)
        {
            canvasContext.drawImage(health, 20 + (5 * i), 20, 6, 15);
        }
	}

	function bossAttack1()
	{
	    switch(bossReady)
	    {
	        case false:
	            if (boss.y < 100)
	            {
	                boss.y++;
                    speedCharge.volume = 0.3;
                    speedCharge.play();
	            }
	            else if(boss.x < canvas.width - 40)
	            {
                    boss.x++;

	            }
	            else { bossReady = true}
	            break;
	        case true:
	            boss.x-= 10;
	            if(boss.x <= -120)
	            {
	                //reset = false;
	                boss.x = canvas.width;
	                //bossReset();
	                attackEx = true;
	                bossReady = false;
	                randomNo();
	                //randomAtk();
	            }
	            break;
	    }
	}

	function bossAttack2()
	{
	    switch(bossReady)
	    {
	        case false:
	            if (boss.y > -10)
	            {
                    beam.volume = 0.3;
                    beam.play();
	                boss.y--;
	            }
	            else if(boss.x > (canvas.width / 2) - 40)
	            {
                    boss.x--;

	            }
	            else { bossReady = true}
	            break;
	        case true:
	            boss.x-= 2;
	            laserAttack.volume = 0.2;
	            laserAttack.play();
	            beam.pause();
	            beam.currentTime = 0;
	            bossLaser.x = boss.x + 5;
	            bossLaser.y = boss.y + 25;
	            //canvasContext.fillRect(bossLaser.x , bossLaser.y, bossLaser.width, bossLaser.height);
                canvasContext.drawImage(bossLaserImg, 0, 0, 32, 64, bossLaser.x , bossLaser.y, bossLaser.width, bossLaser.height);
                if(boss.x <= -120)
	            {
	                laserAttack.pause();
	                laserAttack.currentTime = 0;
	                //reset = false;
	                boss.x = canvas.width;
	                //bossReset();
	                attackEx = true;
	                bossReady = false;
                    randomNo();
                    //randomAtk();
	            }
	            break;
	    }
	}

	function bossReset()
	{
	    if (reset = false)
	    {
	        boss.x = canvas.width;
	        boss.y = 20;
	    }
	    reset = true;
	    /*boss.x--;
	    if (boss.x < canvas.width * 0.75)
	    {
            randomNo();
            randomAtk();
        }*/
	}

	function bossMoving()
	{
        switch (randomPoint)
        {
            case 0:
                if (boss.x >= canvas.width / 2 && boss.y >= 20)
                {
                    boss.x--;
                    boss.y--;
                    attackEx = false;
                }
                else
                {
                    randomNo();
                    randomAtk();
                }
                break;
            case 1:
                if (boss.x <= canvas.width - 10 && boss.y >= 20)
                {
                    boss.x++;
                    boss.y--;
                    attackEx = false;
                }
                else
                {
                    randomNo();
                    randomAtk();
                }
                break;
            case 2:
                if (boss.x >= canvas.width / 2 && boss.y <= canvas.height / 2)
                {
                    boss.x--;
                    boss.y++;
                    attackEx = false;
                }
                else
                {
                    randomNo();
                    randomAtk();
                }
                break;
            case 3:
                if (boss.x <= canvas.width -10 && boss.y <= canvas.height / 2)
                {
                    boss.x++;
                    boss.y++;
                    attackEx = false;
                }
                else
                {
                    randomNo();
                    randomAtk();
                }
                break;
            case 4:
               if (attackEx === false)
                {
                    if(randomAtkType === 0)
                    {
                        bossAttack1();
                    }
                    else
                    {
                        bossAttack2();
                    }
                }
                else
                {
                attackEx = false;
                randomNo;
                }
                break;
        }
	}

	function bossLayout(){
        canvasContext.drawImage(cityBackground, cityBackgroundX, 0, canvas.width * 2, canvas.height)
        canvasContext.drawImage(cityBackground2, cityBackgroundX + (canvas.width * 2), 0, canvas.width * 2, canvas.height)

        /*for (var i = 0; i < 300; i++)
        {
            canvasContext.drawImage(tiles, lava[i].spriteX*4, lava[i].spriteY*14.5, lava[i].spriteWidth, lava[i].spriteHeight, lava[i].x, lava[i].y, lava[i].width, lava[i].height);
        }*/

        //Draw Floor-----------------------------------------------
        for (var i = 0; i < 48; i++)
        {
            floor[i].x = i * 32;
            canvasContext.drawImage(tiles, floor[i].spriteX*3, floor[i].spriteY*3, floor[i].spriteWidth, floor[i].spriteHeight, floor[i].x, floor[i].y, floor[i].width, floor[i].height);
            floorRoom1[i].y = 32 * i;
            floorRoom1[i].x = -32;
            canvasContext.drawImage(tiles, floorRoom1[i].spriteX*3, floorRoom1[i].spriteY*3, floorRoom1[i].spriteWidth, floorRoom1[i].spriteHeight, floorRoom1[i].x, floorRoom1[i].y, floorRoom1[i].width, floorRoom1[i].height);
            floorRoom2[i].y = 32 * i;
            floorRoom2[i].x = canvas.width;
            canvasContext.drawImage(tiles, floorRoom2[i].spriteX*3, floorRoom2[i].spriteY*3, floorRoom2[i].spriteWidth, floorRoom2[i].spriteHeight, floorRoom2[i].x, floorRoom2[i].y, floorRoom2[i].width, floorRoom2[i].height);
        }
    }

    function bossCollision()
    {
        macTroid.timer++;
        var bossCol = overCheck(macTroid, boss);
        if (macTroid.timer > 20 && bossCol !== null)
        {
            //if (bossCol === "b")
            {
                macTroid.velY = -10;
            }
            totalHealth--;
            hurt.volume = 0.05;
            hurt.play();
            macTroid.timer = 0;
        }

        var laserCol = colCheck(macTroid, bossLaser);
        if (macTroid.timer > 20 && (laserCol === "r"))
        {
            totalHealth--;
            macTroid.velX = 20;
            hurt.volume = 0.05;
            hurt.play();
            macTroid.timer = 0;
        }
    }

    function winScreen()
    {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        canvasContext.drawImage(win, 0, 0, canvas.width, canvas.height);
    }

	function randomNo()
	{
	    randomPoint = Math.floor(Math.random() * 5);
	}
	function randomAtk()
	{
	    randomAtkType = Math.floor(Math.random() * 2);
	}