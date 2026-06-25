(function(exports){

// Singleton Class
exports.Grid = {};

// Initialize
Grid.initialize = function(){

	// Grid size
	var WIDTH = Model.data.world.size.width;
	var HEIGHT = Model.data.world.size.height;

	// Make the 2D array
	var agents = [];
	Grid.array = [];
	for(var y=0;y<HEIGHT;y++){
		Grid.array.push([]);
		for(var x=0;x<WIDTH;x++){
			var agent = new Agent(x,y);
			agents.push(agent);
			Grid.array[y].push(agent);
		}
	}

	// Randomly set agent states based on proportion.
	for(var i=0;i<agents.length;i++){
		agents[i].forceState(_getProportionalRandom());
	}

};
var _getProportionalRandom = function(){

	var proportions = Model.data.world.proportions;

	// Get total
	var total = 0;
	for(var i=0;i<proportions.length;i++){
		total += proportions[i].parts;
	}

	// Get a random number from that, like a dart
	var random = Math.random()*total;

	// Return the state that dart hit
	var current = 0;
	for(var i=0;i<proportions.length;i++){

		// Add to current
		var proportion = proportions[i];
		current += proportion.parts;

		// If so, good! return this stateID
		if(random<current){
			return proportion.stateID;
		}

	}

	// Whoops
	console.error("Something messed up in the random state selector");

}

// Simultaneous Step
Grid.step = function(){

	// Update style
	var UPDATE = Model.data.world.update;

	// Shuffle update order, then do 'em all
	var all = _shuffle(Grid.getAllAgents());
	for(var i=0;i<all.length;i++) all[i].markAsNotUpdated();
	for(var i=0;i<all.length;i++) all[i].calculateNextState();
	for(var i=0;i<all.length;i++) all[i].gotoNextState();

};

var _shuffle = function(array){
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

// Remove agents?
subscribe("/ui/updateStateHeaders",function(){
	for(var y=0;y<Grid.array.length;y++){
		for(var x=0;x<Grid.array[0].length;x++){
			var agent = Grid.array[y][x];
			if(!Model.getStateByID(agent.stateID)){
				agent.forceState(0); // state's gone, force delete it.
			}
		}
	}

	publish("/grid/updateAgents");
});

// Resize all DOMs
var grid_container = document.getElementById("grid_container");
var play_container = document.getElementById("play_container");
var editor_container = document.getElementById("editor_container");

// Render the Emoji
Grid.dom = document.getElementById("grid");
Grid.bg = document.getElementById("grid_bg");
Grid.domContainer = document.getElementById("grid_container");
Grid.css = document.getElementById("grid_style");
Grid.tileSize = 1;
Grid.updateSize = function(){

	// RESIZE OTHER DOMs
	// Apparently CSS calc() isn't playing nice in Firefox, WHATEVER
	var calcWidth = (document.body.clientWidth - editor_container.clientWidth)+"px";
	var calcHeight = (document.body.clientHeight - play_container.clientHeight)+"px";
	grid_container.style.width = calcWidth;
	grid_container.style.height = calcHeight;
	play_container.style.width = calcWidth;

	// DIMENSIONS
	var maxWidth = Grid.domContainer.clientWidth;
	var maxHeight = Grid.domContainer.clientHeight;
	var w = Grid.array[0].length;
	var h = Grid.array.length;
	var t = Math.min(Math.floor(maxWidth/w), Math.floor(maxHeight/h));
	Grid.tileSize = t;

	// STYLE
	var css = "";

	// Grid tiles
	css += "#grid{ width:"+(w*t)+"px; height:"+(h*t)+"px; font-size:"+t+"px; }\n";
	css += "#grid>div{ width:"+(w*t)+"px; height:"+t+"px; }\n";
	css += "#grid>div>div{ width:"+t+"px; height:"+t+"px; }\n";

	// Grid BG - absolute
	css += "#grid_bg{ width:"+(w*t)+"px; height:"+(h*t)+"px; font-size:"+t+"px; }\n";
	/*css += "#grid_bg>div{ width:"+(w*t)+"px; height:"+t+"px; }\n";
	css += "#grid_bg>div>div{ width:"+(t-2)+"px; height:"+(t-2)+"px; }\n";*/
	css += "#grid_bg>div{ width:"+(t-2)+"px; height:"+(t-2)+"px; }\n"

	// Apply CSS
	Grid.css.innerHTML = css;

	// HTML JUST FOR THE GRID BACKGROUND
	var html = "";
	for(var y=0;y<Grid.array.length;y++){
		for(var x=0;x<Grid.array[0].length;x++){
			var top = Math.floor(t*y);
			var left = Math.floor(t*x);
			html += "<div style='top:"+top+"px; left:"+left+"px'></div>";
		}
	}
	Grid.bg.innerHTML = html;

	// HTML FOR THE REAL GRID
	var html = "";
	for(var y=0;y<Grid.array.length;y++){
		html += "<div>";
		for(var x=0;x<Grid.array[0].length;x++) html += "<div></div>";
		html += "</div>";
	}
	Grid.dom.innerHTML = html;

};
subscribe("/grid/updateSize",Grid.updateSize,false);
subscribe("ui/resize",Grid.updateSize,false);

Grid.updateAgents = function(){

	// Update ONLY if the emoji is different
	for(var y=0;y<Grid.array.length;y++){
		for(var x=0;x<Grid.array[0].length;x++){

			var agent = Grid.array[y][x];
			var icon = Model.getStateByID(agent.stateID).icon;
			var currentIcon = Grid.dom.children[y].children[x].innerHTML;

			if(icon!=currentIcon){
				Grid.dom.children[y].children[x].innerHTML = icon;
			}
			
		}
	}

};
subscribe("/grid/updateAgents",Grid.updateAgents);

/////////////////////////////
// External Helper Methods //
/////////////////////////////

// Why did Nicky set global variables to always be the same value?? Whatever, it's fine
Grid.NEIGHBORHOOD_MOORE = "moore";
Grid.NEIGHBORHOOD_NEUMANN = "neumann";
Grid.getNeighborCoords = function(agent,all){

	// Oh WOW Polygon's get-neighbor code was O(n^2) what the FU--
    // Honestly no idea what Nicky was talking about here... 

	// First, create all possible neighbor coords
	var x = agent.x;
	var y = agent.y;

	// What kinda neighborhood
	var coords;
	//var hood = Model.data.world.neighborhood;
	if(all == true){
		var hood = Grid.NEIGHBORHOOD_MOORE
	} else {
		var hood = Grid.NEIGHBORHOOD_NEUMANN
	}
	if(hood==Grid.NEIGHBORHOOD_MOORE){
		coords = [
			[x-1,y-1], [x,  y-1], [x+1,y-1],
			[x-1,y  ],            [x+1,y  ],
			[x-1,y+1], [x,  y+1], [x+1,y+1],
		];
	} else if(hood==Grid.NEIGHBORHOOD_NEUMANN){
		coords = [
			[x,y-1], [x-1,y], [x+1,y], [x,y+1],
		];
	}

	// Then, filter out coords that can't work
	// i.e. ones that are off the map
	coords = coords.filter(function(coord){
		var x = coord[0];
		var y = coord[1];
		if(x<0) return false;
		if(x>=Grid.array[0].length) return false;
		if(y<0) return false;
		if(y>=Grid.array.length) return false;
		return true;
	});

	// Return!
	return coords;

};

// Separated getting coords from getting neighbors to allow different sections of neighbors
Grid.getAllNeighbors = function(agent,all){
   var coords = Grid.getNeighborCoords(agent,all);
   var neighbors = [];
   for(var i=0;i<coords.length;i++){
      var x = coords[i][0];
      var y = coords[i][1];
      neighbors.push(Grid.array[y][x]);
   }
   return neighbors;
}

// Filter for coordinates left/right/above/below the current cell and put them into an array.

// Because Grid.getNeighborCoords already filters whether it's Neumann or Moore,
// we don't need anything fancy here.
Grid.getLeftNeighbors = function(agent,all){
    var coords = Grid.getNeighborCoords(agent,all);
	return coords
		.filter(function(coord){
			return coord[0] < agent.x; // get any neighbor to the left
		})
		.map(function(coord){
			return Grid.array[coord[1]][coord[0]]; // find it in the grid array
		});
}

Grid.getRightNeighbors = function(agent,all){
    var coords = Grid.getNeighborCoords(agent,all);
	return coords
		.filter(function(coord){
			return coord[0] > agent.x; // get any neighbor to the right
		})
		.map(function(coord){
			return Grid.array[coord[1]][coord[0]];
		});
}

Grid.getAboveNeighbors = function(agent,all){
    var coords = Grid.getNeighborCoords(agent,all);
	return coords
		.filter(function(coord){
			return coord[1] < agent.y; // etc.
		})
		.map(function(coord){
			return Grid.array[coord[1]][coord[0]];
		});
}

Grid.getBelowNeighbors = function(agent,all){
    var coords = Grid.getNeighborCoords(agent,all);
	return coords
		.filter(function(coord){
			return coord[1] > agent.y;
		})
		.map(function(coord){
			return Grid.array[coord[1]][coord[0]];
		});
}

// Get ALL cells on the board (just collapses to a single array)
Grid.getAllAgents = function(){

	// Then, get all neighbors at those coords
	var agents = [];
	for(var y=0;y<Grid.array.length;y++){
		for(var x=0;x<Grid.array[0].length;x++){
			agents.push(Grid.array[y][x]);
		}
	}

	// Return!
	return agents;
};

// Count neighbors of a certain state
// I... don't think this function is actually used anywhere. Keeping it just in case though
/*Grid.countNeighbors = function(agent,stateID){
	var count = 0;
	var neighbors = Grid.getAllNeighbors(agent);
	for(var i=0;i<neighbors.length;i++){
		if(neighbors[i].stateID==stateID) count++;
	}
	return count;
};*/

// Reset world, update the view, and resize to fit
Grid.reinitialize = function(){
	Grid.initialize();
	publish("/grid/updateSize");
	publish("/grid/updateAgents");
};
subscribe("/grid/reinitialize",Grid.reinitialize,false);

///////////////////////////
// Editor UI Shenanigans //
///////////////////////////

Grid.createUI = function(){

	var config = Model.data.world;

	return EditorHelper()
			.label("This world is a ")
			.number(config.size, "width", {
				integer:true,
				min:3, max:100,
				step:1,
				message:"/grid/reinitialize"
			})
			.label(" by ")
			.number(config.size, "height", {
				integer:true,
				min:3, max:100,
				step:1,
				message:"/grid/reinitialize"
			})
			.label(" grid.")
			.label("<br><br>")
			.label("We start with this ratio of things:<br>")
			.proportions()
			
			// WE DON'T NEED [[Neumann]] OR [[Moore]]
			// WE DON'T NEED [[neighborhoods]]!!!
			// gasp deltarune reference

			// Anyway, the """ADVANCED""" Emoji Sim has selectors for all this neighborhood stuff
			/*.label("<br>")
			.label("And each thing considers ")
			.selector([
				{ name:"the 4 spots to its sides", value:Grid.NEIGHBORHOOD_NEUMANN },
				{ name:"the 8 spots to its sides & corners", value:Grid.NEIGHBORHOOD_MOORE }
			],config,"neighborhood",{
				maxWidth: "none"
			})*/
			.label(" to be its neighboring spots.")
			.dom;
};
})(window);