goog.provide('fish_game.Fish'); // manage correct dependencies
goog.require('lime.Sprite'); // base Sprite file

fish_game.Fish = function () {

	goog.base(this); // extend the Sprite object with Fish

	this.setSize(80, 58).setFill('img/fish_transparent_web.png');
	this.isMoving = false;
	this.direction = NORTH;
	this.speed = 0.3;
};

goog.inherits(fish_game.Fish,lime.Sprite);

fish_game.Fish.prototype.startMovement = function(direction) {
	this.isMoving = true;
	this.direction = direction;
};