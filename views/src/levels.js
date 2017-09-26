var LevelOneState = function(){
    this.player; //player token sprite
    this.alien; //alien token sprite
    this.turnOk = true; //manage when players can start rolling die
    this.player_turn = true; //manage whose turn it is
    this.player_skip = false; //manage whether player should skip next turn
    this.player_tween; //tween object to handle moving player token's sprite
    this.alien_tween; //tween object to handle moving alien token's sprite
    this.alien_skip = false; //manage whether alien should skip next turn
    this.game_over = false; //manage whether game is over
    this.winner; //string variable to store who won the game
    this.winner_blind; //game over background sprite image
    this.winner_badge; //sprite image used to show who won the game
    this.roll_btn; //button for player to roll die
    this.exit_btn; //button for user to quit game and return to menu state
    this.turn_icon; //UI icon to show whose turn it is
    this.dice_icon; //UI icon to show die roll result

    //coordinates for grids
    this.grids = [[100,750],[200,750],[300,750],[400,750],[500,750],
        [600,750],[700,750],[800,750],[800,650],[800,550],
        [700,550],[600,550],[500,550],[400,550],[300,550],
        [300,450],[300,350],[400,350],[500,350],[600,350],
        [700,350],[800,350],[800,250],[800,150],[700,150],
        [600,150],[500,150],[400,150],[300,150],[200,150]];

    //create special grids coordinates. we use the array id from the grids array above, and speciy what type of effect it has.
    this.special_grids = [[4,"FORWARD 2"],[9,"BACK 1"],[13,"SKIP 1"],[14,"SKIP 1"],[18,"SKIP 1"],[19,"SKIP 1"],[20,"SKIP 1"],[23,"FORWARD 1"],[27,"BACK 1"]];

    this.player_grid = 0; //player token's current grid
    this.alien_grid = this.grids.length-1; //alien token's current grid
};

LevelOneState.prototype.init = function(){
};

LevelOneState.prototype.preload = function(){
    this.load.image("bg","assets/Maps/Map-1.png");
    this.load.image('atari1', 'assets/sprites/atari130xe.png');
    this.load.image('atari2', 'assets/images/sprite-test.png');
};

LevelOneState.prototype.create = function(){
    var bg = this.add.image(this.world.centerX,this.world.centerY,'bg');
    bg.anchor.setTo(0.5,0.5);

    atari1 = this.add.sprite(128, 128, 'atari1');
    atari2 = this.add.sprite(394, 398, 'atari2');

    //  Input Enable the sprites
    atari1.inputEnabled = true;
    atari2.inputEnabled = true;

    //  Allow dragging
    //  enableDrag parameters = (lockCenter, bringToTop, pixelPerfect, alphaThreshold, boundsRect, boundsSprite)
    atari1.input.enableDrag();
    atari2.input.enableDrag();

    //  Enable snapping. For the atari1 sprite it will snap as its dragged around and on release.
    //  The snap is set to every 32x32 pixels.
    atari1.input.enableSnap(32, 32, true, true);

    //  For the atari2 sprite it will snap only when released, not on drag.
    atari2.input.enableSnap(24, 24, false, true);
};

LevelOneState.prototype.update = function(){
};