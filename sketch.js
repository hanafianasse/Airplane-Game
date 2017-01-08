/**
*
*	@Author : Anasse Hanafi
*	@Title  : AirPlane Game
*	@Date   : 07/01/2017
*
**/

var missiles = [];
var enemies = [];

var WIDTH  = 1000;
var HEIGHT = 600;
var RANDOM = 90;

// background
var image1 = {url:'', x:0, y:0};
var image2 = {url:'', x:0, y:0};

var boomsImages = [];
var booms = [];

// the Player
var player = {urlImage:'',score:0,life:5};

// missile
var rocket = {urlImage:''};

// flying saucer
var flyingSaucer = {urlImage:''};

// heart
var heartUrl;

var hearts = [];

var lose;

var btnReplayUrl;
var logoGameUrl;
var GameOverUrl;

var backgroundAudio;

function setup() {
	createCanvas(WIDTH,HEIGHT);
	noCursor();
	image1.url = loadImage("assets/images/space.jpg"); 
	image2.url = loadImage("assets/images/space.jpg");
	player.urlImage = loadImage("assets/images/Plane.png");
	rocket.urlImage = loadImage("assets/images/rocket2.png");
	flyingSaucer.urlImage = loadImage("assets/images/enemy.png");
	heartUrl = loadImage("assets/images/heart.png");
	btnReplayUrl = loadImage("assets/images/replay.png");
	logoGameUrl = loadImage("assets/images/gamelogo.png");
	GameOverUrl = loadImage("assets/images/gameover.png");

	for(var i = 0; i < 10 ; i++){
		var boomImage = loadImage("assets/images/boom/boom"+(++i)+".png");
		boomsImages.push(boomImage);
	}

	backgroundAudio = new Audio('assets/musics/background.mp3');

	backgroundAudio.loop = true;
	backgroundAudio.play();

	lose = false;
	
	for(var i = 0; i < player.life ;i++){
		hearts.push(1);
	}
}

function draw() {
	
	drawBackground();

	if(!lose){
		addMissileToEnemies();
		drawEnemiesMissiles();
		drawEnemies();
		drawMissiles();
		drawHearts();
		drawText();

		detectColision();
		drawBooms();

		detectColisionWithEnemeiesAndEnemisesMissiles();
	}else{
		drawTheLogo();
		drawGameOver();
		drawReplaybtn();
	}
	drawPlayer();
}

function drawBooms(){
	for(var i = 0 ; i < booms.length ; i++ ){
		for(var j = 0 ; j < boomsImages.length ; j++ ){
			booms[i].drawed = true;
			for(var k = 0 ; k < 20 ; k++){
				image(boomsImages[j],booms[i].x,booms[i].y,65,65);
			}
		}
	}
	for(var i = 0 ; i < booms.length ; i++ ){
		if(booms[i].drawed){
			booms.splice(i,1);
		}
	}
}

function drawTheLogo(){
	image(logoGameUrl,380,50);
}

function drawGameOver(){
	image(GameOverUrl,325,300);
}

function drawReplaybtn(){
	image(btnReplayUrl,400,450);
}

function drawText(){
	text("Score = "+player.score, 20,40);
}

function drawEnemiesMissiles(){
	for(var i = 0; i < enemies.length ;i++){
		for(var j=0;j < enemies[i].missiles.length ;j++){
			enemies[i].missiles[j].y += 2.5;
			rect(enemies[i].missiles[j].x+25-3,enemies[i].missiles[j].y,6,15); 
		}		
	}
}

function drawHearts(){
	var index = 810;
	for(var i = 0 ; i < player.life ; i++){
		image(heartUrl,index,20);
		index += 30;
	}
}

function drawEnemies(){
	var i = 0; 
	for(i = 0; i < enemies.length ;i++){
		enemies[i].y += 1.5;
		image(flyingSaucer.urlImage,enemies[i].x,enemies[i].y);
	}
	makeItNice();
}

function drawBackground(){
	image(image1.url,image1.x,++image1.y);
	image(image2.url,image2.x,image1.y-WIDTH);
	if(image1.y >= WIDTH ){
		image1.y = 0;
	}
}

function drawPlayer(){
	image(player.urlImage,mouseX,mouseY);
}

// player's missiles
function drawMissiles(){
	var i = 0;
	fill(255,0,0);
	for(i = 0; i < missiles.length ;i++){
		missiles[i].y -= 5;

		image(rocket.urlImage,missiles[i].x+30-10,missiles[i].y);
	}
	makeItNice();
}

function makeItNice(){
	var i = 0; 
	for(i = 0; i < missiles.length ;i++){
		if( missiles[i].y < 0 ){
			missiles.splice(i, 1);
		}
	}
	for(i = 0; i < enemies.length ;i++){
		if( enemies[i].y > HEIGHT ){
			enemies.splice(i, 1);
		}
	}
}



function addMissileToEnemies(){
	if(AddEnemie()){
		var index = Math.floor( Math.random() * enemies.length + 0 );
		var missile = {x:enemies[index].x,y:enemies[index].y};
		enemies[index].missiles.push(missile);
	}

}

function addMissile(x,y){
	var missile = {x,y}
	missiles.push(missile);
}

function AddEnemie(){
	var yesNo = Math.floor( Math.random() * RANDOM + 0 );

	if(yesNo == 1){
		var _x = Math.floor( Math.random() * (WIDTH-4) + (1+4) );
		var _y = -10;
		var enemie = {x:_x,y:_y,missiles:[]};
		enemies.push(enemie);
		return true;
	}
	return false;
}

function addBoom(_x,_y){
	var boom = {x:_x, y:_y, drawed:false };
	booms.push(boom);
}

//colision entre une missile lancer par le joueur et un enemie
function detectColision(){
	for(var i = 0; i < missiles.length ;i++){
		for(var j=0; j < enemies.length ;j++){
			if( missiles[i].x+20 > enemies[j].x -20 && missiles[i].x+20 < enemies[j].x + 50 &&
				missiles[i].y > enemies[j].y && missiles[i].y < enemies[j].y + 25){
				var explosionAudio = new Audio('assets/musics/explosion.mp3');
				explosionAudio.play();
				player.score++;
				addBoom(enemies[j].x,enemies[j].y);
				missiles.splice(i, 1);
				enemies.splice(j,1);
				if(player.score > 10){
					RANDOM = 20;
				}
				break;
			}
		}
	}
}

function detectColisionWithEnemeiesAndEnemisesMissiles(){
	for(var i = 0; i < enemies.length ;i++){
		if (mouseX < enemies[i].x+50 && mouseX+60 > enemies[i].x &&
			mouseY < enemies[i].y+30 && 128+mouseY > enemies[i].y) {
    		enemies.splice(i,1);			
			player.life--;
			break;
		}
	}
	for(var i = 0; i < enemies.length ;i++){
		for(var j=0; j <enemies[i].missiles.length ;j++){
			if (mouseX < enemies[i].missiles[j].x+6 && mouseX+60 > enemies[i].missiles[j].x &&
				mouseY< enemies[i].missiles[j].y+15 && 128+mouseY > enemies[i].missiles[j].y) {
				enemies[i].missiles.splice(j,1);	
				player.life--;
				var enemiesShotedMeAudio = new Audio("assets/musics/enemieShotMe.wav");
				enemiesShotedMeAudio.play();
				break;
			}
		}
	}
	if(player.life == 0){
		lose = true;
	}
}

function initTheGameVariables(){
	missiles = [];
	enemies = [];

	player.score = 0;
	player.life = 5;

	for(var i = 0; i < player.life ;i++){
		hearts.push(1);
	}
	lose = false;
}

function mouseClicked() {
	if(mouseX < WIDTH && mouseY < HEIGHT){
		addMissile(mouseX,mouseY);
		var shotAudio = new Audio('assets/musics/shot.wav');
		shotAudio.play();
	}
	if(lose && mouseX > 400 && mouseX < 627 && mouseY > 450 && mouseY < 496 ){
		initTheGameVariables();
	}
}


