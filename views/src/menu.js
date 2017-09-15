var MenuState = function(){};

MenuState.prototype.preload = function(){

	this.load.image("bg","assets/Maps/Map-1.png");

};

MenuState.prototype.create = function(){
	var bg = this.add.image(this.world.centerX,this.world.centerY,'bg');
	bg.anchor.setTo(0.5,0.5);
};

MenuState.prototype.update = function(){};

MenuState.prototype.OnClick = function(){
};