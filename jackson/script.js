var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

function random_map(max){
	return Math.floor(Math.random()*Math.floor(max));
}

function Game() {
	var playerScore = 0;
	var g = this;
	
	var iteration;
	
	var a;
	var b;
	var c;
	var d;
	
	var ded = 0;
	var meleeEnemyDed = 0;
	var speedDemonDed = 0;
	var ninjaDed = 0;
	var bomberDed = 0;
	
	var PlayerHasItem = 0;
	
	var tileWidth = 48;
	var tileHeight = tileWidth;
	
	canvas.width = 48*12;
	canvas.height = 48*12;
	
	var field = [
	[1,1,1,1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1,1,1]
	];
	
	var drawWait = 0;

	function Sprite() {

		this.x = 5;
		this.y = 11;

		this.draw = function() {
			if (PlayerHasItem === 0){
				ctx.fillStyle = 'blue';
			}else if (PlayerHasItem===1){
				ctx.fillStyle = 'lightyellow';
			}else if (PlayerHasItem===2){
				ctx.fillStyle = 'blue';
			}
			ctx.fillRect(this.x*tileWidth,this.y*tileHeight,tileWidth,tileHeight);
		};
	}

	function Item(itemNum) {

		this.x = -1;
		this.y = -1;

		this.draw = function() {
			ctx.fillStyle = 'yellow';
			if (PlayerHasItem===2){
				ctx.fillStyle = 'lightgray';
			}
			if (PlayerHasItem===1&&itemNum===1){
				ctx.fillStyle = 'lightgray';
			}
			ctx.fillRect(this.x*tileWidth,this.y*tileHeight,tileWidth,tileHeight);
		};

		this.pickUp = function() {
			PlayerHasItem++;
			if (PlayerHasItem===3){
				PlayerHasItem = 2;
			}
			this.y = -1;
			this.x = -1;
		};

		this.remove = function() {
			this.x = -1;
			this.y = -1;
		};
	}

	var levelData = [
	[0],
	[9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[6,1,0,0,0,4,6,0,7,9,0,10,1,10,1,0,1,0,4,6,0,0,0,0,0,0],
	[8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[13,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[13,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	]
	var currentRoom = 1;

	var ploded = 0;

	function MeleeEnemy(meleeEnemyNum){
		var s = this;

		this.x = -5;
		this.y = -5;

		this.draw = function() {
			if (meleeEnemyNum===1){
				ctx.fillStyle = 'red';
			}else if (meleeEnemyNum===2){
				ctx.fillStyle = 'orange';
			}else if (meleeEnemyNum===3){
				ctx.fillStyle = 'lime';
			}else{
				ctx.fillStyle = '#BB00FF';
			}
			if (bomberDed===1&&meleeEnemyNum===4&&ploded===1){
				ctx.fillRect((this.x-2)*tileWidth,(this.y-2)*tileHeight,tileWidth*5,tileHeight*5);
			}else{
				ctx.fillRect(this.x*tileWidth,this.y*tileHeight,tileWidth,tileHeight);
			}
		};

		this.move = function(x,y) {
			this.x = x;
			this.y = y;
			this.draw();
		}
	}

	var melee_enemy = new MeleeEnemy(1);
	var speed_demon = new MeleeEnemy(2);
	var ninja = new MeleeEnemy(3);
	var bomber = new MeleeEnemy(4);
	var item = new Item(1);
	var item2 = new Item(2);
	var hero = new Sprite();

	var dungeonArray = [
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,12,11,10,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,14,13,9,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,1,8,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,2,3,4,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,5,6,7,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	]

	var currentDungeon = [8,9];
	var roomClose = 1;
	var enemyType = 0;

	function resetMap(roomNum){
	levelData[currentRoom][1] = a;
	levelData[currentRoom][2] = b;
	levelData[currentRoom][3] = c;
	levelData[currentRoom][4] = d;
	levelData[currentRoom][5] = melee_enemy.x;
	levelData[currentRoom][6] = melee_enemy.y;
	levelData[currentRoom][7] = meleeEnemyDed;
	levelData[currentRoom][8] = speed_demon.x;
	levelData[currentRoom][9] = speed_demon.y;
	levelData[currentRoom][10] = speedDemonDed;
	levelData[currentRoom][11] = item.x;
	levelData[currentRoom][12] = item.y;
	levelData[currentRoom][13] = item2.x;
	levelData[currentRoom][14] = item2.y;
	levelData[currentRoom][15] = PlayerHasItem;
	levelData[currentRoom][17] = roomClose;
	levelData[currentRoom][18] = ninja.x;
	levelData[currentRoom][19] = ninja.y;
	levelData[currentRoom][20] = ninjaDed;
	levelData[currentRoom][21] = enemyType;
	levelData[currentRoom][22] = bomber.x;
	levelData[currentRoom][23] = bomber.y;
	levelData[currentRoom][24] = bomberDed;
	levelData[currentRoom][25] = ploded;
	if (levelData[roomNum][16]===0){
		a = random_map(2);
		b = random_map(2);
		c = random_map(2);
		if (a===1&&b===1&&c===1){
			d = 0;
		} else {
			d = random_map(2);
		};
		if (b===0&&c===1){
			c=0;
		};
		if ( d === 0 && a === 1 ) {
			a = 0;
		};
		if (hero.y===0){
			b = 0;
		}
		if (hero.y===11){
			a = 0;
		}
		if (hero.x===0||hero.x===11){
			d = 0;
		}
		if (hero.x===0){
			a = 0;
		}
		if (levelData[roomNum][0]!==5&&levelData[roomNum][0]!==11){
			d=0;
		}
		if (levelData[roomNum][0]!==4&&levelData[roomNum][0]!==6&&levelData[roomNum][0]!==9&&levelData[roomNum][0]!==10&&levelData[roomNum][0]!==12&&levelData[roomNum][0]!==13&&levelData[roomNum][0]!==14){
			b=0;
		}
		if (levelData[roomNum][0]!==3&&levelData[roomNum][0]!==6&&levelData[roomNum][0]!==7&&levelData[roomNum][0]!==8&&levelData[roomNum][0]!==11&&levelData[roomNum][0]!==13&&levelData[roomNum][0]!==14){
			a=0;
		}
		meleeEnemyDed = 0;
		speedDemonDed = 0;
		ninjaDed = 0;
		bomberDed = 0;
		PlayerHasItem = 0;
		roomClose = 1;
		ploded = 0;
		if (a===0){
			item.x = 1;
			item.y = 1;
		}else if (b===0){
			item.x = 8;
			item.y = 7;
		}else if (c===0){
			item.x = 3;
			item.y = 2;
		}else{
			item.x = 10;
			item.y = 10;
		}
		if (a===0){
			melee_enemy.x = 6;
			melee_enemy.y = 6;
		}else if (b===0){
			melee_enemy.x = 8;
			melee_enemy.y = 6;
		}else if (c===0){
			melee_enemy.x = 2;
			melee_enemy.y = 9;
		}else{
			melee_enemy.x = 10;
			melee_enemy.y = 7;
		}
		if (a===0){
			speed_demon.x = 3;
			speed_demon.y = 10;
		}else if (b===0){
			speed_demon.x = 3;
			speed_demon.y = 1;
		}else if (c===0){
			speed_demon.x = 8;
			speed_demon.y = 3;
		}else{
			speed_demon.x = 4;
			speed_demon.y = 6;
		}
		if (a===0){
			ninja.x = 2;
			ninja.y = 1;
		}else if (b===0){
			ninja.x = 3;
			ninja.y = 1;
		}else if (c===0){
			ninja.x = 8;
			ninja.y = 3;
		}else{
			ninja.x = 4;
			ninja.y = 6;
		}
		if (a===0){
			bomber.x = 6;
			bomber.y = 6;
		}else if (b===0){
			bomber.x = 8;
			bomber.y = 6;
		}else if (c===0){
			bomber.x = 2;
			bomber.y = 9;
		}else{
			bomber.x = 10;
			bomber.y = 7;
		}
		enemyType = random_map(6)+1;
		if (enemyType===1){
			speed_demon.x = -1;
			speed_demon.y = -1;
			speedDemonDed = 1;
			melee_enemy.x = -1;
			melee_enemy.y = -1;
			meleeEnemyDed = 1;
		}
		if (enemyType===2){
			ninja.x = -1;
			ninja.y = -1;
			ninjaDed = 1;
			speed_demon.x = -1;
			speed_demon.y = -1;
			speedDemonDed = 1;
		}
		if (enemyType===3){
			melee_enemy.x = -1;
			melee_enemy.y = -1;
			meleeEnemyDed = 1;
			ninja.x = -1;
			ninja.y = -1;
			ninjaDed = 1;
		}
		if (enemyType===4){
			bomber.x = -5;
			bomber.y = -5;
			bomberDed = 1;
			speed_demon.x = -1;
			speed_demon.y = -1;
			speedDemonDed = 1;
		}
		if (enemyType===5){
			bomber.x = -5;
			bomber.y = -5;
			bomberDed = 1;
			melee_enemy.x = -1;
			melee_enemy.y = -1;
			meleeEnemyDed = 1;
		}
		if (enemyType===6){
			bomber.x = -5;
			bomber.y = -5;
			bomberDed = 1;
			ninja.x = -1;
			ninja.y = -1;
			ninjaDed = 1;
		}

		levelData[roomNum][16] = 1;
	}else{
		a = levelData[roomNum][1];
		b = levelData[roomNum][2];
		c = levelData[roomNum][3];
		d = levelData[roomNum][4];
		melee_enemy.x = levelData[roomNum][5];
		melee_enemy.y = levelData[roomNum][6];
		meleeEnemyDed = levelData[roomNum][7];
		speed_demon.x = levelData[roomNum][8];
		speed_demon.y = levelData[roomNum][9];
		speedDemonDed = levelData[roomNum][10];
		item.x = levelData[roomNum][11];
		item.y = levelData[roomNum][12];
		item2.x = levelData[roomNum][13];
		item2.y = levelData[roomNum][14];
		PlayerHasItem = levelData[roomNum][15];
		roomClose = levelData[roomNum][17];
		ninja.x = levelData[roomNum][18];
		ninja.y = levelData[roomNum][19];
		ninjaDed = levelData[roomNum][20];
		enemyType = levelData[roomNum][21];
		bomber.x = levelData[roomNum][22];
		bomber.y = levelData[roomNum][23];
		bomberDed = levelData[roomNum][24];
		ploded = levelData[roomNum][25];
		if (enemyType===0){
			melee_enemy.x = -1;
			melee_enemy.y = -1;
			meleeEnemyDed = 1;
			speed_demon.x = -1;
			speed_demon.y = -1;
			speedDemonDed = 1;
			ninja.x = -1;
			ninja.y = -1;
			ninjaDed = 1;
			bomber.x = -5;
			bomber.y = -5;
			bomberDed = 1;

		}
	}
	}

	function changeRoom(X,Y){
		resetMap(dungeonArray[currentDungeon[0]+Y][currentDungeon[1]+X]);
		currentDungeon[0] = currentDungeon[0]+Y;
		currentDungeon[1] = currentDungeon[1]+X;
		currentRoom = dungeonArray[currentDungeon[0]][currentDungeon[1]];
	};

	resetMap(1);


	function bomberExplode(){
		bomberDed = 1;
		ploded = 1;
		bomber.draw;
	}

	function NPCMove(npc,npcDed,wait1,wait2,wait3,wait4,wait5){
		if 	((drawWait===wait1||drawWait===wait2||drawWait===wait3||drawWait===wait4||drawWait===wait5)&&ded===0&&npcDed===0){
			var NPCDirection;
			if (npc===melee_enemy||npc===speed_demon||npc===ninja||npc===bomber){
				if (npc.x<hero.x&&npc.y<hero.y){
					NPCDirection = random_map(2);
					if (NPCDirection===1){
						NPCDirection = 2;
					}
					if (npc===ninja){
						NPCDirection = 2;
					}
				}else if (npc.x>hero.x&&npc.y>hero.y){
					NPCDirection = random_map(2);
					if (NPCDirection===1){
						NPCDirection = 2;
					}
					NPCDirection++;
					if (npc===ninja){
						NPCDirection = 3;
					}
				}else if (npc.x<hero.x&&npc.y>hero.y){
					NPCDirection = random_map(2);
					if (NPCDirection===1){
						NPCDirection = 3;
					}
					if (npc===ninja){
						NPCDirection = 0;
					}
				}else if (npc.x>hero.x&&npc.y<hero.y){
					NPCDirection = random_map(2)+1;
					if (npc===ninja){
						NPCDirection = 1;
					}
				}else if (npc.x<hero.x&&npc.y===hero.y){
					NPCDirection = 0;
					if (npc===ninja){
						NPCDirection = 0;
					}
				}else if (npc.x>hero.x&&npc.y===hero.y){
					NPCDirection = 1;
					if (npc===ninja){
						NPCDirection = 1;
					}
				}else if (npc.x===hero.x&&npc.y<hero.y){
					NPCDirection = 2;
					if (npc===ninja){
						NPCDirection = 2;
					}
				}else if (npc.x===hero.x&&npc.y>hero.y){
					NPCDirection = 3;
					if (npc===ninja){
						NPCDirection = 3;
					}
				}
				if (PlayerHasItem===1){
					if (NPCDirection===0||NPCDirection===2){
						NPCDirection++;
					}else if (NPCDirection===1||NPCDirection===3){
						NPCDirection = NPCDirection - 1;
					}
				}
			}
			if (npc===bomber&&PlayerHasItem===0&&(hero.x>(bomber.x-3)&&hero.x<(bomber.x+3)&&hero.y>(bomber.y-3)&&hero.y<(bomber.y+3))){
				NPCDirection = -1;
				bomberExplode();
				if ((hero.x>(bomber.x-3)&&hero.x<(bomber.x+3)&&hero.y>(bomber.y-3)&&hero.y<(bomber.y+3))){
					ded = 1;
				}
			}
			if (NPCDirection===0&&npc.x!==11&&field[npc.y][npc.x+1]===0){
				npc.x++;
			}else if (NPCDirection===1&&npc.x!==0&&field[npc.y][npc.x-1]===0){
				npc.x--;
			}else if (NPCDirection===2&&npc.y!==11&&field[npc.y+1][npc.x]===0){
				npc.y++;
			}else if (NPCDirection===3&&npc.y!==0&&field[npc.y-1][npc.x]===0){
				npc.y--;
			};
		}
	}

	var catAsgore = new Audio('Cat Asgore.mp3');
	var milkyWays = new Audio('Milky Ways.mp3');
	var castleTheme = new Audio('Castle Theme.wav');
	castleTheme.muted = false;

	function drawScore(){
		ctx.font = '20px Courier New';
		ctx.fillStyle = "white";
		ctx.textAlign = "right";
		ctx.fillText(playerScore,11.75*tileWidth,0.65*tileHeight);
	}

	function closeRoom(roomId){
		if (PlayerHasItem===1&&roomClose===1){
			field = [
			[1,1,1,1,1,1,1,1,1,1,1,1],
			[1,a,a,b,b,b,b,b,b,b,b,1],
			[1,a,a,c,c,c,c,c,c,c,c,1],
			[1,a,a,c,c,c,c,c,c,c,c,1],
			[1,a,a,a,a,a,a,b,b,d,d,1],
			[1,a,a,a,a,a,a,b,b,d,d,1],
			[1,d,d,d,d,a,a,b,b,d,d,1],
			[1,d,d,a,a,a,a,b,b,d,d,1],
			[1,a,a,a,b,b,b,b,b,d,d,1],
			[1,a,c,c,c,c,c,c,c,d,d,1],
			[1,a,a,a,a,a,a,d,d,d,d,1],
			[1,1,1,1,1,1,1,1,1,1,1,1]
			];
		}else{
			if (roomId===0){
				field = [
				[1,1,1,1,1,b,b,1,1,1,1,1],
				[1,a,a,b,b,b,b,b,b,b,b,1],
				[1,a,a,c,c,c,c,c,c,c,c,1],
				[1,a,a,c,c,c,c,c,c,c,c,1],
				[1,a,a,a,a,a,a,b,b,d,d,1],
				[d,a,a,a,a,a,a,b,b,d,d,d],
				[d,d,d,d,d,a,a,b,b,d,d,d],
				[1,d,d,a,a,a,a,b,b,d,d,1],
				[1,a,a,a,b,b,b,b,b,d,d,1],
				[1,a,c,c,c,c,c,c,c,d,d,1],
				[1,a,a,a,a,a,a,d,d,d,d,1],
				[1,1,1,1,1,a,a,1,1,1,1,1]
				];
			}else if (roomId===1){
				field = [
				[1,1,1,1,1,b,b,1,1,1,1,1],
				[1,a,a,b,b,b,b,b,b,b,b,1],
				[1,a,a,c,c,c,c,c,c,c,c,1],
				[1,a,a,c,c,c,c,c,c,c,c,1],
				[1,a,a,a,a,a,a,b,b,d,d,1],
				[1,a,a,a,a,a,a,b,b,d,d,d],
				[1,d,d,d,d,a,a,b,b,d,d,d],
				[1,d,d,a,a,a,a,b,b,d,d,1],
				[1,a,a,a,b,b,b,b,b,d,d,1],
				[1,a,c,c,c,c,c,c,c,d,d,1],
				[1,a,a,a,a,a,a,d,d,d,d,1],
				[1,1,1,1,1,a,a,1,1,1,1,1]
				];
			}else if (roomId===2){
				field = [
				[1,1,1,1,1,b,b,1,1,1,1,1],
				[1,a,a,b,b,b,b,b,b,b,b,1],
				[1,a,a,c,c,c,c,c,c,c,c,1],
				[1,a,a,c,c,c,c,c,c,c,c,1],
				[1,a,a,a,a,a,a,b,b,d,d,1],
				[d,a,a,a,a,a,a,b,b,d,d,1],
				[d,d,d,d,d,a,a,b,b,d,d,1],
				[1,d,d,a,a,a,a,b,b,d,d,1],
				[1,a,a,a,b,b,b,b,b,d,d,1],
				[1,a,c,c,c,c,c,c,c,d,d,1],
				[1,a,a,a,a,a,a,d,d,d,d,1],
				[1,1,1,1,1,a,a,1,1,1,1,1]
				];
			}else if (roomId===3){
				field = [
				[1,1,1,1,1,b,b,1,1,1,1,1],
				[1,a,a,b,b,b,b,b,b,b,b,1],
				[1,a,a,c,c,c,c,c,c,c,c,1],
				[1,a,a,c,c,c,c,c,c,c,c,1],
				[1,a,a,a,a,a,a,b,b,d,d,1],
				[d,a,a,a,a,a,a,b,b,d,d,d],
				[d,d,d,d,d,a,a,b,b,d,d,d],
				[1,d,d,a,a,a,a,b,b,d,d,1],
				[1,a,a,a,b,b,b,b,b,d,d,1],
				[1,a,c,c,c,c,c,c,c,d,d,1],
				[1,a,a,a,a,a,a,d,d,d,d,1],
				[1,1,1,1,1,1,1,1,1,1,1,1]
				];
			}else if (roomId===4){
				field = [
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,a,a,b,b,b,b,b,b,b,b,1],
				[1,a,a,c,c,c,c,c,c,c,c,1],
				[1,a,a,c,c,c,c,c,c,c,c,1],
				[1,a,a,a,a,a,a,b,b,d,d,1],
				[d,a,a,a,a,a,a,b,b,d,d,d],
				[d,d,d,d,d,a,a,b,b,d,d,d],
				[1,d,d,a,a,a,a,b,b,d,d,1],
				[1,a,a,a,b,b,b,b,b,d,d,1],
				[1,a,c,c,c,c,c,c,c,d,d,1],
				[1,a,a,a,a,a,a,d,d,d,d,1],
				[1,1,1,1,1,a,a,1,1,1,1,1]
				];
			}else if (roomId===5){
				field = [
				[1,1,1,1,1,b,b,1,1,1,1,1],
				[1,a,a,b,b,b,b,b,b,b,b,1],
				[1,a,a,c,c,c,c,c,c,c,c,1],
				[1,a,a,c,c,c,c,c,c,c,c,1],
				[1,a,a,a,a,a,a,b,b,d,d,1],
				[1,a,a,a,a,a,a,b,b,d,d,1],
				[1,d,d,d,d,a,a,b,b,d,d,1],
				[1,d,d,a,a,a,a,b,b,d,d,1],
				[1,a,a,a,b,b,b,b,b,d,d,1],
				[1,a,c,c,c,c,c,c,c,d,d,1],
				[1,a,a,a,a,a,a,d,d,d,d,1],
				[1,1,1,1,1,a,a,1,1,1,1,1]
				];
			}else if (roomId===6){
				field = [
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,a,a,b,b,b,b,b,b,b,b,1],
				[1,a,a,c,c,c,c,c,c,c,c,1],
				[1,a,a,c,c,c,c,c,c,c,c,1],
				[1,a,a,a,a,a,a,b,b,d,d,1],
				[d,a,a,a,a,a,a,b,b,d,d,d],
				[d,d,d,d,d,a,a,b,b,d,d,d],
				[1,d,d,a,a,a,a,b,b,d,d,1],
				[1,a,a,a,b,b,b,b,b,d,d,1],
				[1,a,c,c,c,c,c,c,c,d,d,1],
				[1,a,a,a,a,a,a,d,d,d,d,1],
				[1,1,1,1,1,1,1,1,1,1,1,1]
				];
			}else if (roomId===7){
				field = [
				[1,1,1,1,1,b,b,1,1,1,1,1],
				[1,a,a,b,b,b,b,b,b,b,b,1],
				[1,a,a,c,c,c,c,c,c,c,c,1],
				[1,a,a,c,c,c,c,c,c,c,c,1],
				[1,a,a,a,a,a,a,b,b,d,d,1],
				[1,a,a,a,a,a,a,b,b,d,d,d],
				[1,d,d,d,d,a,a,b,b,d,d,d],
				[1,d,d,a,a,a,a,b,b,d,d,1],
				[1,a,a,a,b,b,b,b,b,d,d,1],
				[1,a,c,c,c,c,c,c,c,d,d,1],
				[1,a,a,a,a,a,a,d,d,d,d,1],
				[1,1,1,1,1,1,1,1,1,1,1,1]
				];
			}else if (roomId===8){
				field = [
				[1,1,1,1,1,b,b,1,1,1,1,1],
				[1,a,a,b,b,b,b,b,b,b,b,1],
				[1,a,a,c,c,c,c,c,c,c,c,1],
				[1,a,a,c,c,c,c,c,c,c,c,1],
				[1,a,a,a,a,a,a,b,b,d,d,1],
				[d,a,a,a,a,a,a,b,b,d,d,1],
				[d,d,d,d,d,a,a,b,b,d,d,1],
				[1,d,d,a,a,a,a,b,b,d,d,1],
				[1,a,a,a,b,b,b,b,b,d,d,1],
				[1,a,c,c,c,c,c,c,c,d,d,1],
				[1,a,a,a,a,a,a,d,d,d,d,1],
				[1,1,1,1,1,1,1,1,1,1,1,1]
				];
			}else if (roomId===9){
				field = [
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,a,a,b,b,b,b,b,b,b,b,1],
				[1,a,a,c,c,c,c,c,c,c,c,1],
				[1,a,a,c,c,c,c,c,c,c,c,1],
				[1,a,a,a,a,a,a,b,b,d,d,1],
				[1,a,a,a,a,a,a,b,b,d,d,d],
				[1,d,d,d,d,a,a,b,b,d,d,d],
				[1,d,d,a,a,a,a,b,b,d,d,1],
				[1,a,a,a,b,b,b,b,b,d,d,1],
				[1,a,c,c,c,c,c,c,c,d,d,1],
				[1,a,a,a,a,a,a,d,d,d,d,1],
				[1,1,1,1,1,a,a,1,1,1,1,1]
				];
			}else if (roomId===10){
				field = [
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,a,a,b,b,b,b,b,b,b,b,1],
				[1,a,a,c,c,c,c,c,c,c,c,1],
				[1,a,a,c,c,c,c,c,c,c,c,1],
				[1,a,a,a,a,a,a,b,b,d,d,1],
				[d,a,a,a,a,a,a,b,b,d,d,1],
				[d,d,d,d,d,a,a,b,b,d,d,1],
				[1,d,d,a,a,a,a,b,b,d,d,1],
				[1,a,a,a,b,b,b,b,b,d,d,1],
				[1,a,c,c,c,c,c,c,c,d,d,1],
				[1,a,a,a,a,a,a,d,d,d,d,1],
				[1,1,1,1,1,a,a,1,1,1,1,1]
				];
			}else if (roomId===11){
				field = [
				[1,1,1,1,1,b,b,1,1,1,1,1],
				[1,a,a,b,b,b,b,b,b,b,b,1],
				[1,a,a,c,c,c,c,c,c,c,c,1],
				[1,a,a,c,c,c,c,c,c,c,c,1],
				[1,a,a,a,a,a,a,b,b,d,d,1],
				[1,a,a,a,a,a,a,b,b,d,d,1],
				[1,d,d,d,d,a,a,b,b,d,d,1],
				[1,d,d,a,a,a,a,b,b,d,d,1],
				[1,a,a,a,b,b,b,b,b,d,d,1],
				[1,a,c,c,c,c,c,c,c,d,d,1],
				[1,a,a,a,a,a,a,d,d,d,d,1],
				[1,1,1,1,1,1,1,1,1,1,1,1]
				];
			}else if (roomId===12){
				field = [
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,a,a,b,b,b,b,b,b,b,b,1],
				[1,a,a,c,c,c,c,c,c,c,c,1],
				[1,a,a,c,c,c,c,c,c,c,c,1],
				[1,a,a,a,a,a,a,b,b,d,d,1],
				[1,a,a,a,a,a,a,b,b,d,d,1],
				[1,d,d,d,d,a,a,b,b,d,d,1],
				[1,d,d,a,a,a,a,b,b,d,d,1],
				[1,a,a,a,b,b,b,b,b,d,d,1],
				[1,a,c,c,c,c,c,c,c,d,d,1],
				[1,a,a,a,a,a,a,d,d,d,d,1],
				[1,1,1,1,1,a,a,1,1,1,1,1]
				];
			}else if (roomId===13){
				field = [
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,a,a,b,b,b,b,b,b,b,b,1],
				[1,a,a,c,c,c,c,c,c,c,c,1],
				[1,a,a,c,c,c,c,c,c,c,c,1],
				[1,a,a,a,a,a,a,b,b,d,d,1],
				[1,a,a,a,a,a,a,b,b,d,d,d],
				[1,d,d,d,d,a,a,b,b,d,d,d],
				[1,d,d,a,a,a,a,b,b,d,d,1],
				[1,a,a,a,b,b,b,b,b,d,d,1],
				[1,a,c,c,c,c,c,c,c,d,d,1],
				[1,a,a,a,a,a,a,d,d,d,d,1],
				[1,1,1,1,1,1,1,1,1,1,1,1]
				];
			}else if (roomId===14){
				field = [
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,a,a,b,b,b,b,b,b,b,b,1],
				[1,a,a,c,c,c,c,c,c,c,c,1],
				[1,a,a,c,c,c,c,c,c,c,c,1],
				[1,a,a,a,a,a,a,b,b,d,d,1],
				[d,a,a,a,a,a,a,b,b,d,d,1],
				[d,d,d,d,d,a,a,b,b,d,d,1],
				[1,d,d,a,a,a,a,b,b,d,d,1],
				[1,a,a,a,b,b,b,b,b,d,d,1],
				[1,a,c,c,c,c,c,c,c,d,d,1],
				[1,a,a,a,a,a,a,d,d,d,d,1],
				[1,1,1,1,1,1,1,1,1,1,1,1]
				];
			}
		}
	}
	var floorTile = document.getElementById('floor_tile');
	var wallTile = document.getElementById('wall_tile');
	var _ = {
		draw: function() {
			for (var y = 0; y < field.length; y++) {
				for (var x = 0; x < field[y].length; x++) {
					switch (field[y][x]) {
						case 1:
							ctx.drawImage(wallTile,x*tileWidth,y*tileHeight,tileWidth,tileHeight);
							break;
						default:
							ctx.drawImage(floorTile,x*tileWidth,y*tileHeight,tileWidth,tileHeight);
							break;
					}
					
				}
			}
		},
		loop: function() {
			_.draw();
			drawWait++;
			drawScore();
			if (castleTheme.muted===true){
				ctx.font = '20px Arial';
				ctx.fillStyle = "white";
				ctx.textAlign = "left";
				ctx.fillText('Muted',0.25*tileWidth,0.65*tileHeight);
			}
			if (hero.x===melee_enemy.x&&hero.y===melee_enemy.y){
				if (PlayerHasItem===0||PlayerHasItem===2){
					ded = 1;
					hero.x = -1;
					hero.y = -1;
				}else if (PlayerHasItem===1){
					playerScore=playerScore+100;
					meleeEnemyDed = 1;
					melee_enemy.x = -1;
					melee_enemy.y = -1;
				};
			};
			if (hero.x===speed_demon.x&&hero.y===speed_demon.y){
				if (PlayerHasItem===0||PlayerHasItem===2){
					ded = 1;
					hero.x = -1;
					hero.y = -1;
				}else if (PlayerHasItem===1){
					playerScore=playerScore+100;
					speedDemonDed = 1;
					speed_demon.x = -1;
					speed_demon.y = -1;
				};
			};
			if (hero.x===ninja.x&&hero.y===ninja.y){
				if (PlayerHasItem===0||PlayerHasItem===2){
					ded = 1;
					hero.x = -1;
					hero.y = -1;
				}else if (PlayerHasItem===1){
					playerScore=playerScore+100;
					ninjaDed = 1;
					ninja.x = -1;
					ninja.y = -1;
				};
			};
			if (hero.x===bomber.x&&hero.y===bomber.y){
				if (PlayerHasItem===0||PlayerHasItem===2){
					ded = 1;
					hero.x = -1;
					hero.y = -1;
					bomberExplode();
					bomberDed = 1;
					ploded = 1;
					bomber.draw();
				}else if (PlayerHasItem===1){
					playerScore=playerScore+100;
					bomberDed = 1;
					bomber.x = -5;
					bomber.y = -5;
				};
			};
			closeRoom(levelData[currentRoom][0]);
			if (meleeEnemyDed===1&&speedDemonDed===1&&ninjaDed===1&&bomberDed===1&&PlayerHasItem===1){
				if (a===0){
					item2.x = 1;
					item2.y = 1;
				}else if (b===0){
					item2.x = 8;
					item2.y = 7;
				}else if (c===0){
					item2.x = 3;
					item2.y = 2;
				}else{
					item2.x = 10;
					item2.y = 10;
				}
			}
			item.draw();
			item2.draw();
			hero.draw();
			bomber.draw();
			if (bomberDed===1||ploded===1){
				bomberExplode();
			}
			NPCMove(melee_enemy,meleeEnemyDed,10,10,10,10,10);
			NPCMove(speed_demon,speedDemonDed,10,20,20,20,20);
			NPCMove(ninja,ninjaDed,10,10,10,10,10);
			NPCMove(bomber,bomberDed,10,10,10,10,10);
			melee_enemy.draw();
			speed_demon.draw();
			ninja.draw();
			if (drawWait===20){
				drawWait = 0;
			}
			_.animate();
		},
		animate: function() {
			iteration = window.requestAnimationFrame(_.loop);
		},
		toggleState: function(msg,x=6,y=6){
			if (iteration) {
				window.cancelAnimationFrame(iteration);
				iteration = 0;
				if(msg){
					ctx.font = '20px Arial';
					ctx.fillStyle = "black";
					ctx.textAlign = "center";
					ctx.fillText('Paused',6*tileWidth,6*tileHeight);
				}
			} else {
				_.animate();
			}
		},
		startState: function(msg,x=6,y=6){
			if (iteration) {
				window.cancelAnimationFrame(iteration);
				iteration = 0;
				if(msg){
					ctx.font = '150px Arial';
					ctx.fillStyle = "black";
					ctx.textAlign = "center";
					ctx.fillText('GAME',canvas.width/2,canvas.height/2);
					ctx.font = '50px Arial';
					ctx.fillStyle = "black";
					ctx.textAlign = "center";
					ctx.fillText('(Press SPACE to Start)',canvas.width/2,canvas.height/2+50);
				}
			} else {
				_.animate();
			}
		},
		listen: function() {
			document.addEventListener('keydown',function(e) {
				if (ded===0){
					e.preventDefault();
					switch (e.keyCode) {
					case 77:
						//mute or unmute
						if (castleTheme.muted===true){
							castleTheme.muted = false;
						} else {
							castleTheme.muted = true;
						};
						break;
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
				}
				function testAndSet(deltaX,deltaY) {
					if (hero.y===11&&deltaY===1){
						hero.y = 0;
						changeRoom(0,1);
					}else if (hero.y===0&&deltaY===-1){
						hero.y = 11;
						changeRoom(0,-1);
					}else if (hero.x===0&&deltaX===-1){
						hero.x = 11;
						changeRoom(-1,0);
					}else if (hero.x===11&&deltaX===1){
						hero.x = 0;
						changeRoom(1,0);
					}else{
						if(iteration && field[hero.y+deltaY][hero.x+deltaX] === 0) {
							hero.x = hero.x+deltaX;
							hero.y = hero.y+deltaY;
						}
						if (hero.x === item.x && hero.y === item.y) {
							playerScore=playerScore+25;
							item.pickUp();
							item.remove();
						}
						if (hero.x === item2.x && hero.y === item2.y&&PlayerHasItem!==2&&meleeEnemyDed===1&&speedDemonDed===1&&ninjaDed===1&&bomberDed===1) {
							playerScore=playerScore+50;
							item2.pickUp();
							item2.remove();
						}
					}
				}
			});

		}
		
	}
	
		g.init = function() {
			_.listen();
			_.animate();
			_.startState('Paused');
			castleTheme.play();
		}
	
}

var game = new Game();
game.init();