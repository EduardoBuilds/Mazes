var c = document.getElementById('myCanvas');
var ctx = c.getContext('2d');
var boxSide = 20;

ctx.strokeStyle='#ffffff';
ctx.translate(0.5,0.5) //This is to make sure lines don't look blurry

var map = [];

var neighbors = []
var parents = {}

function makeMap(){
	map = [];
	let totalX = c.width / boxSide;
	let totalY = c.height / boxSide;
	for (let x = 0; x < totalX; x++){
		map.push([])
		for (let y = 0; y < totalY; y++){
			map[x].push(0)
		}
	}
	buildGrid();
}

function buildGrid(){
	clearCanvas();
	for (let x = 0; x < map.length; x++){
		ctx.moveTo(x*boxSide,0);
		ctx.lineTo(x*boxSide,c.height);
	}
	for (let y = 0; y < map[0].length; y++){
		ctx.moveTo(0,y*boxSide);
		ctx.lineTo(c.width,y*boxSide);
	}
	ctx.stroke();
}

function clearCanvas(){
	ctx.clearRect(0,0,c.width,c.height);
	ctx.fillStyle='#000000';
	ctx.rect(0,0,c.width,c.height);
	ctx.fill();
}

function paintMapSpace(x,y,color='#ffffff'){
	ctx.fillStyle=color;
	ctx.fillRect(x*boxSide,y*boxSide,boxSide,boxSide);
}

function paintCorridor(origin,dir){
	if (dir == 'l'){
		paintMapSpace(origin.x-1,origin.y)
		paintMapSpace(origin.x-2,origin.y)
	}
	if (dir == 'r'){
		paintMapSpace(origin.x+1,origin.y)
		paintMapSpace(origin.x+2,origin.y)	
	}
	if (dir == 'd'){
		paintMapSpace(origin.x,origin.y+1)
		paintMapSpace(origin.x,origin.y+2)
	}
	if (dir == 'u'){
		paintMapSpace(origin.x,origin.y-1)
		paintMapSpace(origin.x,origin.y-2)
	}
}

function pickStartingPosition(){
	let oddLocsX = [];
	for (let i = 1; i < map.length; i += 2){
		oddLocsX.push(i)
	}
	let oddLocsY = [];
	for (let i = 1; i < map[0].length; i += 2){
		oddLocsY.push(i)
	}
	let x = oddLocsX[Math.round(Math.random()*(oddLocsX.length-1))]
	let y = oddLocsY[Math.round(Math.random()*(oddLocsY.length-1))]
	map[x][y] = 1;
	paintMapSpace(x,y,'#22BB55')
	getNeighbors(x,y)
	buildMaze()
}

function pushParent(x,y,origin){
	let key = x.toString()+','+y
	parents[key] = origin
}

function getNeighbors(x,y){
	let localList = []
	if (x-2 > 0){
		if (map[x-2][y] == 0){
			localList.push({'x':x-2,'y':y, 'dir':'l',origin:{'x':x,'y':y}})
		}
	}
	if (x+2 < map.length){
		if (map[x+2][y] == 0){
			localList.push({'x':x+2,'y':y, 'dir':'r',origin:{'x':x,'y':y}})
		}
	}
	if (y-2 > 0){
		if (map[x][y-2] == 0){
			localList.push({'x':x,'y':y-2, 'dir':'u',origin:{'x':x,'y':y}})
		}
	}
	if (y+2 < map[0].length){
		if (map[x][y+2] == 0){
			localList.push({'x':x,'y':y+2, 'dir':'d',origin:{'x':x,'y':y}})
		}
	}

	while (localList.length > 0){
		let randomIndex = Math.round(Math.random()*(localList.length-1))
		neighbors.push(localList[randomIndex])
		localList.splice(randomIndex,1)
	}
}

function buildMaze(){
	var position;
	while (neighbors.length > 0){
		position = neighbors.pop()
		if (map[position.x][position.y] == 1){
			continue;
		} else {
			map[position.x][position.y] = 1
			pushParent(position.x,position.y,position.origin)
			getNeighbors(position.x,position.y)
			paintCorridor(position.origin,position.dir)
		}
	}
	paintMapSpace(position.x,position.y,'#BB2222')
}


makeMap()