// Initialize Phaser, and creates a 400x490px game
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game_div');
var game_state = {};
var high_score = 0;
var label = "score: ";

// Creates a new 'main' state that will contain the game
game_state.main = function() { };  
game_state.main.prototype = {

    // Function called first to load all the assets
    preload: function() { 
        // Change the background color of the game
        this.game.stage.backgroundColor = '#71c5cf';

        // Load the bird sprite
        this.game.load.image('bird', 'assets/bird.png'); 
			
		// Load the pipe top sprite
        this.game.load.image('bird2', 'assets/bird2.png');
		
        // Load the pipe sprite
        this.game.load.image('pipe', 'assets/pipe.png'); 
		
		// Load the pipe top sprite
        this.game.load.image('pipe_top', 'assets/bird_old.png');

		// Load the pipe top sprite
        this.game.load.image('pipe_bottom', 'assets/bird_old.png'); 		 		
    },

    // Fuction called after 'preload' to setup the game 
    create: function() { 
        // Display the bird on the screen
        this.bird = this.game.add.sprite(100, 145, 'bird');
        
		 // Display the bird on the screen
        this.bird2 = this.game.add.sprite(50, 280, 'bird2');
		
        // Add gravity to the bird to make it fall
        this.bird.body.gravity.y = 500; 
		this.bird2.body.gravity.y = 500; 

        // Call the 'jump' function when the spacekey is hit
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.add(this.jump, this); 
		
		// Call the 'jump' function when the spacekey is hit
        var enter_key = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enter_key.onDown.add(this.jump2, this); 

        // Create a group of 20 pipes
        this.pipes = game.add.group();
        this.pipes.createMultiple(20, 'pipe'); 

		// Create a group of 20 pipes top
        this.tpipes = game.add.group();
        this.tpipes.createMultiple(20, 'pipe_top');  

		// Create a group of 20 pipes top
        this.bpipes = game.add.group();
        this.bpipes.createMultiple(20, 'pipe_bottom');  				

        // Timer that calls 'add_row_of_pipes' ever 1.5 seconds
        this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);           

        // Add a score label on the top left of the screen
        this.score = 0;
        var style = { font: "30px Arial", fill: "#ffffff" };
        this.label_score = this.game.add.text(20, 20, "current: 0", style);  
		
				
		// Add a highest score label on the top left of the screen        
		var style = { font: "30px Arial", fill: "#ffffff" };
		this.label_highest_score = this.game.add.text(20, 60, "record: " + high_score, style);  		
		
    },

    // This function is called 60 times per second
    update: function() {
        // If the bird is out of the world (too high or too low), call the 'restart_game' function
        if (this.bird.inWorld == false && this.bird2.inWorld == false)
            this.restart_game(); 

        // If the bird overlap any pipes, call 'restart_game'
        if(this.bird.inWorld == true ) 
		{			
			this.game.physics.overlap(this.bird, this.pipes, this.remove_bird1, null, this); 
		}
		if(this.bird2.inWorld == true)
		{
			this.game.physics.overlap(this.bird2, this.pipes, this.remove_bird2, null, this);      	
		}

    },
	
	remove_bird1: function()
	{
		if( this.bird2.inWorld == false )
		{
			this.restart_game();
		}
		else
		{
			this.bird.kill();		
			this.bird.inWorld = false;
		}		
	},
	
	remove_bird2: function()
	{
		if( this.bird.inWorld == false )
		{
			this.restart_game();
		}
		else
		{
			this.bird2.kill();		
			this.bird2.inWorld = false;
		}		
	},

    // Make the bird jump 
    jump: function() {
        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -200;
    },
	
	// Make the bird jump 
    jump2: function() {
        // Add a vertical velocity to the bird
        this.bird2.body.velocity.y = -200;
    },
	
	// Make the bird jump 
    bigger: function() {
        // Add a vertical velocity to the bird
        // re Load the bird sprite
        this.game.load.image('bird', 'assets/bird_old.png'); 
		 // Display the bird on the screen
        this.bird = this.game.remove.sprite(100, 245, 'bird');
		
    },

    // Restart the game
    restart_game: function() {        
		// Remove the timer
        this.game.time.events.remove(this.timer);
		
		// Start the 'main' state, which restarts the game
        this.game.state.start('main');
    },

    // Add a pipe on the screen
    add_one_pipe: function(x, y) {
        // Get the first dead pipe of our group
        var pipe = this.pipes.getFirstDead();

        // Set the new position of the pipe
        pipe.reset(x, y);

         // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200; 
               
        // Kill the pipe when it's no longer visible 
        pipe.outOfBoundsKill = true;
    },
	
	// Add a pipe top on the screen
    add_one_top_pipe: function(x, y) {
        // Get the first dead pipe of our group
        var pipe = this.tpipes.getFirstDead();

        // Set the new position of the pipe
        pipe.reset(x, y);

         // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200; 
               
        // Kill the pipe when it's no longer visible 
        pipe.outOfBoundsKill = true;
    },
	
	// Add a pipe bottom on the screen
    add_one_bottom_pipe: function(x, y) {
        // Get the first dead pipe of our group
        var pipe = this.bpipes.getFirstDead();

        // Set the new position of the pipe
        pipe.reset(x, y);

         // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200; 
               
        // Kill the pipe when it's no longer visible 
        pipe.outOfBoundsKill = true;
    },

    // Add a row of 6 pipes with a hole somewhere in the middle
    add_row_of_pipes: function() {
        var hole = Math.floor(Math.random()*5)+1;
        for (var i = 0; i < 8; i++)
		{	
			if (i != hole && i != hole +1 ) 
			{
				this.add_one_pipe(400, i*60+10);   
			}
			if(i == hole - 1 )
			{
				this.add_one_top_pipe(400, i*60+10);
			}
			if(i == hole + 2 )
			{
				this.add_one_bottom_pipe(400, i*60+10);
			}
		}
            
		if (this.bird.inWorld == true && this.bird2.inWorld == true)
		{
			this.score += 2;
			this.label_score.content = label + this.score; 			
		}
		else
		{		
			this.score += 1;
			this.label_score.content = label + this.score; 
		}
		
		if(this.score > high_score)
		{
			this.label_highest_score.content = "record: " + this.score;
			high_score = this.score;
		}
    },
};

// Add and start the 'main' state to start the game
game.state.add('main', game_state.main);  
game.state.start('main'); 