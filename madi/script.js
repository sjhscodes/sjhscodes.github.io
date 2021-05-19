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
	[1,1,1,1,1,1,1,1,1,1,1,1],
	[1,0,0,1,0,1,0,0,0,0,0,1],
	[1,0,1,1,0,0,1,0,1,1,0,1],
	[1,0,1,1,1,1,1,1,0,1,0,1],
	[1,0,1,0,0,0,0,0,0,1,0,1],
	[1,1,1,0,1,1,1,1,1,1,0,1],
	[1,0,1,0,1,0,0,0,0,0,0,1],
	[1,0,1,0,0,0,1,1,1,1,1,1],
	[1,0,0,1,1,0,1,0,0,0,0,1],
	[1,1,0,1,1,0,1,0,0,1,0,1],
	[1,0,0,0,0,0,1,1,0,0,0,1],
	[1,1,1,1,1,1,1,1,1,1,1,1]
	];
	
	var panda = document.getElementById("Panda");
	var oceanwater = document.getElementById("oceanwater");
	
	function Sprite() {
		
		this.x = 5;
		this.y = 10;
		
		this.draw = function() {
			ctx.fillStyle = 'blue';
			ctx.fillRect(this.x*tileWidth,this.y*tileHeight,tileWidth,tileHeight);
			ctx.drawImage(orangekitten,this.x*tileWidth,this.y*tileHeight,tileWidth,tileHeight);
			
			
		};
	}
	
	function Item() {
		
		this.x = 10;
		this.y = 1;
		
		this.draw = function() {
			//ctx.fillStyle = 'yellow';
			//ctx.fillRect(this.x*tileWidth,this.y*tileHeight,tileWidth,tileHeight);
			
			ctx.drawImage(panda,this.x*tileWidth,this.y*tileHeight,tileWidth,tileHeight);
			
		}
		
		this.pickUp = function() {
			//"Hello Im A Panda");
			  var conversationOpts=["Great","Good","Wonderful","Amazing"];
			_.toggleState("Hello how are you today?",conversationOpts);
			
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
							ctx.fillStyle = '#05fcc7';
							ctx.fillRect(x*tileWidth,y*tileHeight,tileWidth,tileHeight);
							break;
						default:
							ctx.drawImage(oceanwater,x*tileWidth,y*tileHeight,tileWidth,tileHeight);
							//ctx.fillStyle = '#051afc';
							break;
					}
					//ctx.fillRect(x*tileWidth,y*tileHeight,tileWidth,tileHeight);
					//ctx.drawImage(oceanwater,this.x*tileWidth,this.y*tileHeight,tileWidth,tileHeight);
				}
			}
		},
		loop: function() {
			_.draw();
			hero.draw();
			item.draw();
			_.animate();
		},
		animate: function() {
			iteration = window.requestAnimationFrame(_.loop);
		},
		toggleState: function(msg,opts=false,x=6,y=6) {
			if (iteration) {
				window.cancelAnimationFrame(iteration);
				iteration = 0;
				if (msg) {
					ctx.fillStyle = 'black';
					ctx.fillRect((x-4)*tileWidth,(y-.5)*tileHeight,tileWidth*8,tileHeight);
					ctx.font = '20px  Helvetica';
					ctx.fillStyle = "White";
					ctx.textAlign = "center";
					ctx.fillText(msg,x*tileWidth,y*tileHeight);
					if (opts) {
						ctx.fillStyle = 'black';
						ctx.fillRect((x-4)*tileWidth,(y+1)*tileHeight,tileWidth*8,tileHeight*4.5);
						ctx.font = '20px  Helvetica';
						ctx.fillStyle = "White";
						ctx.textAlign = "center";
						ctx.fillText(opts[0],(x)*tileWidth,(y+1.5)*tileHeight);
						ctx.fillText(opts[1],(x)*tileWidth,(y+2.5)*tileHeight);
						ctx.fillText(opts[2],(x)*tileWidth,(y+3.5)*tileHeight);	
						ctx.fillText(opts[3],(x)*tileWidth,(y+4.5)*tileHeight);
						canvas.addEventListener('click',choose);
						
						function choose(e) {
							if (!iteration) {
							_.animate();
						}
						}
					}	
				}		
			} else {
				_.animate();
			}
		},
		listen: function() {
			document.addEventListener('keydown',function(e) {
				e.preventDefault();
				switch (e.keyCode) {
				case 80:
					//Pause
					_.toggleState('Paused');
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
					// Dwn
					testAndSet(0,1);
					break;
				default:
					break;
				};
				function testAndSet(deltaX,deltaY) {
					if(iteration && field[hero.y+deltaY][hero.x+deltaX] === 0) {
						hero.x = hero.x+deltaX;
						hero.y = hero.y+deltaY;
						if (hero.x === item.x && hero.y === item.y) {
							item.pickUp();
							//item.remove();
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