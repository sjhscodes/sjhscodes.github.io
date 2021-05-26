var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');


function Game() {
	var g = this;
	
	var iteration;
	
	const tileWidth = 48;
	const tileHeight = tileWidth;
	
	canvas.width = 48*12;
	canvas.height = 48*12;
	
	var field = [
	[1,0,1,1,1,1,1,1,1,1,1,1],
	[1,0,1,1,1,0,1,0,0,0,0,1],
	[1,0,0,0,1,0,1,0,1,1,1,1],
	[1,1,1,0,1,0,1,0,0,0,0,1],
	[1,0,0,0,0,0,1,0,0,1,0,1],
	[1,0,0,0,0,0,1,1,1,1,0,1],
	[1,1,1,1,1,0,0,0,0,0,0,1],
	[1,0,0,1,0,1,0,1,0,1,1,1],
	[1,1,0,1,0,1,0,1,0,0,0,1],
	[1,1,0,1,0,1,0,1,0,1,0,1],
	[1,0,0,0,0,0,0,1,0,0,0,1],
	[1,1,1,1,1,1,1,1,1,1,1,1]
	];
	var blueswords = document.getElementById("blueswords");
	var whitecat = document.getElementById("whitecat");
	var whitesword = document.getElementById("whitesword");
	var brownsword = document.getElementById("brownsword");
	var browncat = document.getElementById("browncat");
	var dino = document.getElementById("dino");
	var door = document.getElementById("door");
	var cats = whitecat;
	var weapon = brownsword;
	var evil = dino;
	
	function Sprite() {
		
		this.x = 5;
		this.y = 10;
		
		this.draw = function() {
			ctx.drawImage(cats,this.x*tileWidth,this.y*tileHeight,tileWidth,tileHeight);
			//ctx.fillStyle = 'blue';
			//ctx.fillRect(this.x*tileWidth,this.y*tileHeight,tileWidth,tileHeight);
		};
	}
	
	function bad_guy() {
		
		this.x = 5;
		this.y = 1;
		
		this.draw = function() {
			ctx.drawImage(evil,this.x*tileWidth,this.y*tileHeight,tileWidth,tileHeight);
			//ctx.fillStyle = 'blue';
			//ctx.fillRect(this.x*tileWidth,this.y*tileHeight,tileWidth,tileHeight);
		};
	}
	
	function use_door() {
		
		this.x = 0;
		this.y = 1;
		
		this.draw = function() {
			ctx.drawImage(door,this.x*tileWidth,this.y*tileHeight,tileWidth,tileHeight);
			//ctx.fillStyle = 'blue';
			//ctx.fillRect(this.x*tileWidth,this.y*tileHeight,tileWidth,tileHeight);
		};
	}
	
	function Item() {
		
		this.x = 10;
		this.y = 1;
		
		//this.x = 10;
		//this.y = 1;
		
		this.draw = function() {
			ctx.drawImage(weapon,this.x*tileWidth,this.y*tileHeight,tileWidth,tileHeight);
			//ctx.fillStyle = 'yellow';
			//ctx.fillRect(this.x*tileWidth,this.y*tileHeight,tileWidth,tileHeight);
		};
		
		this.pickUp = function() {
			cats = browncat
		};
		
		this.remove = function() {
			this.x = -1;
			this.y = -1;
		};
	}
	
	var hero = new Sprite();
	var item = new Item();
	
	var _ = {
		draw: function() {
			for (var y = 0; y < field.length; y++) {
				for (var x = 0; x < field[y].length; x++) {
					switch (field[y][x]) {
						case 1:
							ctx.fillStyle = 'tan';
							break;
						case 2:
							ctx.fillStyle = 'tan';
							break;
						default:
							ctx.fillStyle = '#fff0cf';
							break;
					}
					ctx.fillRect(x*tileWidth,y*tileHeight,tileWidth,tileHeight);
				}
			}
		},
		loop: function() {
			_.draw();
			hero.draw();
			item.draw();
			//bad_guy.draw();
			//use_door.draw();
			_.animate();
		},
		animate: function() {
			iteration = window.requestAnimationFrame(_.loop);
		},
		listen: function() {
			document.addEventListener('keydown',function(e) {
				e.preventDefault();
				switch (e.keyCode) {
				case 80:
					//Pause
					if (iteration) {
						window.cancelAnimationFrame(iteration);
						iteration = 0;
						ctx.font = '20px Arial';
						ctx.fillStyle = "black";
						ctx.textAlign = "center";
						ctx.fillText('Paused',6*tileWidth,6*tileHeight);
					} else {
						_.animate();
					}
					break;
				case 32:
					//Resume
					if (!iteration) {
						_.animate();
					}
					break;
				case 37:
					//L
					testAndSet(-1,0);
					break;
				case 38:
					//Up
					testAndSet(0,-1);
					break;
				case 39:
					//R
					testAndSet(1,0);
					break;
				case 40:
					// Down
					testAndSet(0,1);
					break;
				default:
					break;
				};
				function testAndSet(deltaX,deltaY) {
					if(iteration && field[hero.y+deltaY][hero.x+deltaX] === 0 || iteration && field[hero.y+deltaY][hero.x+deltaX] === 2) {
						hero.x = hero.x+deltaX;
						hero.y = hero.y+deltaY;
						if (hero.x === item.x && hero.y === item.y) {
							item.pickUp();
							item.remove();
						}
					}
				}
			});
			
			
		}
 	};
	
	g.init = function() {
		_.listen();
		_.animate();
	}
}

var game = new Game();
game.init();