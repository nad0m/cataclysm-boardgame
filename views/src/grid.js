var backgroundSprite;
window.onload = function (){
    var blob, game;
    var bgData = "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABHNCSVQICAgIfAhkiAAAAFFJREFUWIXtzjERACAQBDFgMPOKzr8ScADFFlBsFKRX1WqfStLG68SNQcogZZAySBmkDFIGKYOUQcogZZAySBmkDFIGKYOUQcog9X1wJnl9ONrTcwPWLGFOywAAAABJRU5ErkJggg==";

    var preload = function (){
        var iBg = new Image();
        iBg.src = bgData;
        game.cache.addImage('bg', bgData, iBg);
    };
    var create = function (){
        backgroundSprite = game.add.tileSprite(0,0,game.width,game.height,'bg');
    };


    game = new Phaser.Game(480,480,Phaser.AUTO,'blocks-game',{preload:preload, create:create});

};