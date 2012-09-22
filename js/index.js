
// (6,2)
var BLOCK_SIZE = 15
var SQUARE_SIZE = 7
var BORDER_SIZE = (BLOCK_SIZE - SQUARE_SIZE)/2;
var COLOR = "rgb(200,200,200)"
var LEADING_COLOR = "rgb(224,27,100)"
var CANVAS_WIDTH
var CANVAS_HEIGHT

var remainingToVisit
var seenLocations
var orderedList
// var context
var lastNode

var area
var found
var percent

/*
 * Click & other handlers are bound when the page loads
 */
$(document).ready(function(){
	startDrawing()
	$('#resetButton').bind('click', function(event){
		event.preventDefault()
		startDrawing()
		return false
	});

	$('#optionsButton').bind('click', function(event){
		event.preventDefault()
		$('#options').css({
	        position:'absolute',
	        left: ($(window).width() - $('#options').outerWidth())/2,
	        top: ($(window).height() - $('#options').outerHeight())/2
	    });
	    $('#options').toggle()
	});
});


// From http://www.html5canvastutorials.com/advanced/html5-canvas-animation-stage/

window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function(callback) {
	  window.setTimeout(callback, 1000 / 60);
	};
})();

function startDrawing() {
	mazeId = Math.random()
	fixCanvasWidth()
	context.clearRect( 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	remainingToVisit = {}
	seenLocations = {}
	orderedList = []
	lastNode = [-1, 0]
	startWalk()
	percent = $('#percent')
	found = 0
	animate(mazeId);
}

function Node (x, y) {
    this.x = x;
    this.y = y;
}

function fixCanvasWidth(){
	canvas = $('#mainCanvas')
	htmlWidth = $(window).width()
	htmlHeight = $(window).height() - $('#title').outerHeight();
	document.getElementById('mainCanvas').width = htmlWidth - htmlWidth % BLOCK_SIZE
	document.getElementById('mainCanvas').height = htmlHeight - htmlHeight % BLOCK_SIZE
	CANVAS_HEIGHT = canvas.height()
	CANVAS_WIDTH = canvas.width()

	area = (CANVAS_WIDTH/BLOCK_SIZE) * (CANVAS_HEIGHT/BLOCK_SIZE)

	var canvaso = document.getElementById('mainCanvas');
	context = canvaso.getContext('2d');
}

function startWalk(){
	walk([0, 0], [-1, 0])
}


function animate(){

	pair = orderedList.pop()
	node = pair[0]
	parent = pair[1]
	drawNode(lastNode, COLOR)
	drawJoin(node, parent, COLOR)
	drawNode(node, LEADING_COLOR)
	lastNode = node
	found++

	percent.html(Math.round(found/area*100) + "%")

	// request new frame
	requestAnimFrame(function() {
		if(orderedList.length > 0) {
			animate();
		}else{
			finishAnimate()
		}
	});
}

function finishAnimate() {
	drawNode(lastNode, COLOR)
	drawJoin([0, 0], [-1, 0], LEADING_COLOR)
	drawJoin([CANVAS_WIDTH/BLOCK_SIZE-1, CANVAS_HEIGHT/BLOCK_SIZE-1],
			 [CANVAS_WIDTH/BLOCK_SIZE+0, CANVAS_HEIGHT/BLOCK_SIZE-1],
			 LEADING_COLOR)
	percent.html('')
}

function walk(node, parent) {

	seenLocations[getStringKey(node)] = true
	// drawNode(node)
	// drawJoin(node, parent)
	orderedList.unshift([node, parent])
	remainingToVisit[getStringKey(node)] = getNeighbors(node)
	remainingToVisit[getStringKey(node)] = shuffleArray(remainingToVisit[getStringKey(node)])

	while(remainingToVisit[getStringKey(node)].length > 0) {
		newNode = remainingToVisit[getStringKey(node)].pop()
		if (!(getStringKey(newNode) in seenLocations)) {
			walk(newNode, node)
		}
	}
}

function getStringKey(node){
	return node[0] + "-" + node[1]
}

function getNeighbors(node) {
	neighbors = []
	if (node[0] > 0) {
		neighbors.push([node[0]-1, node[1]])
	}
	if (node[1] > 0) {
		neighbors.push([node[0], node[1]-1])
	}
	if (node[0] < CANVAS_WIDTH/BLOCK_SIZE - 1) {
		neighbors.push([node[0]+1, node[1]])
	}
	if (node[1] < CANVAS_HEIGHT/BLOCK_SIZE - 1) {
		neighbors.push([node[0], node[1]+1])
	}
	return neighbors
}

// TODO: Rewrite
// http://www.devcurry.com/2011/07/array-shuffle-in-javascript.html
function shuffleArray(a) {
  var d,
  c,
  b = a.length;
   while (b) {
    c = Math.floor(Math.random() * b);
    d = a[--b];
    a[b] = a[c];
    a[c] = d
   }
   return a;
}

function drawNode(node, colorIn) {
	context.fillStyle = colorIn;
	context.fillRect (node[0]*BLOCK_SIZE+BORDER_SIZE, node[1]*BLOCK_SIZE+BORDER_SIZE,SQUARE_SIZE, SQUARE_SIZE);
}

function drawJoin(node1, node2, colorIn) {
	context.fillStyle = colorIn;
	startX = Math.min(node1[0], node2[0])
	endX = Math.max(node1[0], node2[0])
	startY = Math.min(node1[1], node2[1])
	endY = Math.max(node1[1], node2[1])
	if(endY > startY) {
		context.fillRect (startX*BLOCK_SIZE+BORDER_SIZE, startY*BLOCK_SIZE+BORDER_SIZE+SQUARE_SIZE, SQUARE_SIZE, 2*BORDER_SIZE);
	}
	if(endX > startX) {
		context.fillRect (startX*BLOCK_SIZE+BORDER_SIZE+SQUARE_SIZE, startY*BLOCK_SIZE+BORDER_SIZE,2*BORDER_SIZE, SQUARE_SIZE);
	}
}