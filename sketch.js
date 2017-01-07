
var missiles = [];
var enemies = [];

var WIDTH  = 1000;
var HEIGHT = 600;
var RANDOM = 90;

var enemiesKiled = 0;

// background
var image1 = {url:'', x:0, y:0};
var image2 = {url:'', x:0, y:0};

// the Player
var player = {urlImage:'',score:0,life:5};

// missile
var rocket = {urlImage:''};

// flying saucer
var flyingSaucer = {urlImage:''};

// heart
var heartUrl;

var hearts = [];


function setup() {
	createCanvas(WIDTH,HEIGHT);
	noCursor();
	image1.url = loadImage("assets/images/space.jpg"); 
	image2.url = loadImage("assets/images/space.jpg");
	player.urlImage = loadImage("assets/images/Plane.png");
	rocket.urlImage = loadImage("assets/images/rocket2.png");
	flyingSaucer.urlImage = loadImage("assets/images/enemy.png");
	heartUrl = loadImage("assets/images/heart.png");

	for(var i = 0; i < player.life ;i++){
		hearts.push(1);
	}
}

function draw() {
	
	addMissileToEnemies();

	drawBackground();
	drawEnemiesMissiles();
	drawEnemies();
	drawMissiles();
	drawPlayer();
	drawHearts();
	drawText();
	detectColision();
	detectColisionWithEnemeiesAndEnemisesMissiles();
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

function detectColision(){
	for(var i = 0; i < missiles.length ;i++){
		for(var j=0; j < enemies.length ;j++){
			if( missiles[i].x+20 > enemies[j].x -20 && missiles[i].x+20 < enemies[j].x + 50 &&
				missiles[i].y > enemies[j].y && missiles[i].y < enemies[j].y + 25){

				missiles.splice(i, 1);
				enemies.splice(j,1);
				player.score++;
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
		if( mouseX > enemies[i].x && mouseX < enemies[i].x+50 && mouseY > enemies[i].y &&
			mouseY < enemies[i].y+30 ){
			enemies.splice(i,1);			
			player.life--;
		}
	}/*
	for(var i = 0; i < enemies.length ;i++){
		for(var j=0; j <enemies[i].missiles.length ;j++){
			if( mouseX > enemies[i].missiles[j].x && mouseX < enemies[i].missiles[j].x &&
				mouseY > enemies[i].missiles[j].y && mouseY < enemies[i].missiles[j].y ){
				enemies[i].missiles.splice(j,1);	
				player.life--;
			}
		}
	}*/
}

function mouseClicked() {
	if(mouseX < WIDTH && mouseY < HEIGHT){
		addMissile(mouseX,mouseY);
	}
}

