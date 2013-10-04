var CONFIG = {

	BACKGROUND_COLOR: 0x000000,
	BALL_RADIUS: 0.5,
	BLOCK_SIZE: 1,
	BLOCK_HEIGHT: 0.1,
	BLOCK_TYPES: [   
		{       
			name: "goalBright",
			color: 0xcccccc
		}, {                 
			name: "goalDark",
			color: 0x999999
		}, { 
			name: "normalBright",
			color: 0xc89b6a
		}, {            
			name: "normalDark",
			color: 0xca8842
		}, {
			name: "blocker",
			color: 0xea4dc4,
			blocker: true,
			height: 2
		}
	],
	KEYCODE: {
		
		LEFT: 37,
		RIGHT: 39,
		UP: 38,
		DOWN: 40,
		SPACE: 32
	},
	TRACK: {
		
		BACK_ROWS: 5,
		FRONT_ROWS: 20,
		FOG_NEAR: 15,
		FOG_FAR: 20
	},
	EDITOR: {
		
		BLOCK_SIZE: 30
	},
	ACCELERATION: 0.01,
	GRAVITY: 0.1,
	JUMP_SPEED: 0.15
}