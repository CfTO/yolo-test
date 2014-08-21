//set main namespace
goog.provide('fish_game');
goog.require('lime.Director'); //dependency 
goog.require('lime.Scene');
goog.require('lime.Sprite'); // all objects (fish, badges, walls, etc.)
goog.require('fish_game.Fish'); // include the Fish js

// "constants" for directions
var NORTH = 1;
var EAST = 2;
var SOUTH = 3;
var WEST = 4;

fish_game.start = function(){
	
	//SET MAIN LIME OBJECTS FOR GAME
	//set Director
	this.lime = lime;
	this.director = new this.lime.Director(document.body,1600,780);
	//Director options
	this.director.makeMobileWebAppCapable();
	this.director.setDisplayFPS(false);
	//set scene 
	this.gameScene = new this.lime.Scene();
	//this.gameScene.setRenderer(this.lime.Renderer.CANVAS);

	//set main game objects | background
	var gameBackground = new this.lime.Sprite()
		.setSize(1080,780)
		.setPosition(0,0)
		.setFill("#EEEEEE")
		.setAnchorPoint(0,0); //top left corner
	this.fish = new fish_game.Fish();
	this.walls = [];
	this.tokens = [];
	this.createWalls();
	this.createTokens();
	this.positionTokensAndFish();
	this.tokensEarned = 0;
	// create game buttons
	var analogStick = new this.lime.Sprite().setSize(350,372).setPosition(1150,400).setFill('images/analogStick.png').setAnchorPoint(0,0);
	// make touchable areas
	var buttonUp = new this.lime.Sprite().setSize(120,120).setPosition(1265,400).setAnchorPoint(0,0);
	var buttonRight = new this.lime.Sprite().setSize(115, 114).setPosition(1384, 518).setAnchorPoint(0,0);
	var buttonDown = new this.lime.Sprite().setSize(120, 120).setPosition(1265, 631).setAnchorPoint(0,0);
	var buttonLeft = new this.lime.Sprite().setSize(115, 114).setPosition(1151, 518).setAnchorPoint(0,0);

	//add events to buttons
	goog.events.listen(buttonUp,["mousedown","touchstart"],function(e){
		this.startMovement(NORTH);
	}, null, this.fish);

	goog.events.listen(buttonRight,["mousedown","touchstart"],function(e){
		this.startMovement(EAST);
	}, null, this.fish);
	goog.events.listen(buttonDown,["mousedown","touchstart"],function(e){
		this.startMovement(SOUTH);
	}, null, this.fish);
	goog.events.listen(buttonLeft,["mousedown","touchstart"],function(e){
		this.startMovement(WEST);
	}, null, this.fish);

	this.lime.scheduleManager.schedule(function(dt){ //every frame, every time, check movement of the fish
		this.checkVictory(); //check victory status before movement; will happen right after render
		this.checkMovement(dt);
	}, fish_game);
	//add objects to the main game scene
	this.gameScene.appendChild(gameBackground);
		for (var i=0;i<this.walls.length;i++) {
			this.gameScene.appendChild(this.walls[i]);
		}
		for (i=0;i<this.tokens.length;i++) {
			this.gameScene.appendChild(this.tokens[i]);
		}
	this.gameScene.appendChild(this.fish);
	this.gameScene.appendChild(analogStick);
	this.gameScene.appendChild(buttonUp);
	this.gameScene.appendChild(buttonRight);
	this.gameScene.appendChild(buttonDown);
	this.gameScene.appendChild(buttonLeft);

	//scene has to be loaded last
	this.director.replaceScene(this.gameScene); // take scene we just set up and load it up

};

fish_game.createWalls = function () {
	t = 30; //make walls easily scalable. set basic thickness of walls.
	var walls = [];
	var wallCoordinates = [
	[0,0,35*t,t], // coordinates then height width
    [0,0,t,26*t],
    [35*t,0,36*t,26*t],
    [0,25*t,36*t,35*t],
    [0,25*t,36*t,35*t],
    [0,10*t,5*t,11*t],
    [5*t,5*t,16*t,6*t],
    [15*t,5*t,16*t,11*t],
    [15*t,5*t,16*t,11*t],
    [15*t,10*t,21*t,11*t],
    [20*t,10*t,21*t,16*t],
    [5*t,15*t,21*t,16*t],
    [10*t,10*t,11*t,16*t],
    [5*t,20*t,11*t,21*t],
    [5*t,20*t,6*t,26*t],
    [15*t,15*t,16*t,26*t],
    [20*t,0*t,21*t,6*t],
    [25*t,5*t,36*t,6*t],
    [25*t,5*t,26*t,11*t],
    [30*t,10*t,36*t,11*t],
    [30*t,10*t,31*t,16*t],
    [25*t,15*t,30*t,16*t],
    [25*t,15*t,26*t,20*t],
    [20*t,20*t,26*t,21*t],
    [30*t,20*t,31*t,26*t]
    ];

	for (var i=0;i<wallCoordinates.length;i++) {
		var current = wallCoordinates[i];
		var wall = new this.lime.Sprite().setAnchorPoint(0,0).setPosition(current[0],current[1]).setSize(current[2]-current[0],current[3]-current[1]).setFill('#222222');
		this.walls.push(wall); //append to array of walls
	}
};

fish_game.createTokens = function() {
    var tokens = [];
    var tokenNames = [
        ["kelp"],
        ["urchin"],
        ["treasure"]
    ];
    var i;
    for (i=0;i<tokenNames.length;i++) {
        var current = tokenNames[i];
        var tokens = new this.lime.Sprite().setSize(80,87).setFill('images/token-' + current[0] + '.png');
        this.tokens.push(token);
    }
};

fish_game.positionTokensAndFish = function() {
  var tokenCoordinates = [
        [390,390],
        [840,240],
        [990,390]
  ];
  for (var i=0;i<this.tokens.length;i++) {
        this.tokens[i].setPosition(tokenCoordinates[i][0],tokenCoordinates[i][1]);
  }
  this.fish.setPosition(90,690);
};

fish_game.checkMovement = function(dt) {
	if (this.fish.isMoving) {

		//determine future position
		var futureX = this.fish.getPosition().x;
		var futureY = this.fish.getPosition().y;
		switch(this.fish.direction) {
			case NORTH:
				futureY = futureY - this.fish.speed*dt;
				break;
			case EAST:
				futureX = futureX + this.fish.speed*dt;
				break;
			case SOUTH:
				futureY = futureY + this.fish.speed*dt;
				break;
			case WEST;
				futureX = futureX - this.fish.speed*dt;
				break;
		}
		//define fish box
		futureTopY = futureY - (this.fish.getSize().height/2);
    	futureBottomY = futureTopY + this.fish.getSize().height;
    	futureLeftX = futureX - (this.fish.getSize().width/2);
    	futureRightX = futureLeftX + this.fish.getSize().width;
    	//define walls locations
    	var i;
    	for(i in this.walls) {
      	wall = this.walls[i];
      	wallTopY = wall.getPosition().y;
      	wallBottomY = wallTopY+wall.getSize().height;
      	wallLeftX = wall.getPosition().x;
      	wallRightX = wallLeftX+wall.getSize().width;
      	//compare fish and walls - if the fish overlaps any of the walls' bounding boxes, then he's out of bounds
      	if (futureRightX > wallLeftX && futureLeftX < wallRightX && futureBottomY > wallTopY && futureTopY < wallBottomY) {
         this.fish.isMoving = false; //if the above statement is true, then we stop the fish from moving
         return false;
		}
	}
//if no obstacles are hit, move fish
this.fish.setPosition(futureX,futureY);

//check if the fish hits a collectible token. does the fish and token box overlap?
for(i in this.tokens) {
      token = this.tokens[i];
      tokenTopY = token.getPosition().y-(token.getSize().height/2);
      tokenBottomY = tokenTopY+token.getSize().height;
      tokenLeftX = token.getPosition().x-(token.getSize().width/2);
      tokenRightX = tokenLeftX+token.getSize().width;
      if (futureRightX > tokenLeftX && futureLeftX < tokenRightX && futureBottomY > tokenTopY && futureTopY < tokenBottomY) {
        this.tokensEarned++; // if they overlap, increase tokens earned
        this.tokens[i].setPosition(1200+50*this.tokensEarned,100); //pull the token off-maze to screen where controller is
      }
    }
  }
};

fish_game.checkVictory = function() {
	if (this.tokensEarned == this.tokens.length) {
		alert('Hooray!'); // could change scene here upon victory
		// immediately reset game:
		this.tokensEarned = 0;
    	this.fish.isMoving = false;
    	this.positionTokensAndFish();
	}
};


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('fish_game.start', fish_game.start);
