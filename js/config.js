var CONFIG = {

	BACKGROUND_COLOR: 0x000000,
	BALL_RADIUS: 0.5,
	BLOCK_SIZE: 2,
	BLOCK_HEIGHT: 0.1,
	BLOCK_TYPES: [   
		{   
			id: 0,    
			name: "goalBright",
			color: 0xcccccc,
			editor: false,
			alternatingId: 1
		}, {                 
			id: 1,    
			name: "goalDark",
			color: 0x999999,
			editor: false,
		}, { 
			id: 2,    
			name: "normalBright",
			color: 0xc89b6a,
			editor: true,
			alternatingId: 3
		}, {            
			id: 3,    
			name: "normalDark",
			color: 0xca8842,
			editor: false,
		}, {
			id: 4,    
			name: "blocker",
			color: 0xea4dc4,
			blocker: true,
			height: 1.5,
			editor: true,
		}, {
			id: 5,    
			name: "invertor",
			color: 0x00cccc,
			editor: true,
		}, {
			id: 6,    
			name: "speedup",
			color: 0x00cc00,
			editor: true,
		}, {
			id: 7,    
			name: "slowdown",
			color: 0xcc0000,
			editor: true,
		}, {
			id: 8,    
			name: "jumper",
			color: 0x0000cc,
			editor: true,
		}, {
			id: 9,    
			name: "warp",
			color: 0xcccccc,
			editor: true,
		}, {
			id: 10,    
			name: "empty",
			color: 0x000000,
			editor: true,
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
		FOG_NEAR: 19,
		FOG_FAR: 30
	},
	EDITOR: {
		
		BLOCK_SIZE: 30
	},
	ACCELERATION: 1.2,
	TRACK_SPEED: 1.2,
	GRAVITY: 1,
	JUMP_SPEED: 2,
	JUMP_ACCELERATION: 2,
	FALLING_SPEED_TRIGGER: -1,
	LIVES: 5
}