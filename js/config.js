var CONFIG = {

	BACKGROUND_COLOR: 0x000000,
	BALL_RADIUS: 0.5,
	BLOCK_SIZE: 2,
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
			height: 1.5
		}, {
			name: "invertor",
			color: 0x00cccc
		}, {
			name: "speedup",
			color: 0x00cc00
		}, {
			name: "slowdown",
			color: 0xcc0000
		}, {
			name: "jumper",
			color: 0x0000cc
		}, {
			name: "warp",
			color: 0xcccccc
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
	ACCELERATION: 1,
	TRACK_SPEED: 1,
	GRAVITY: 1,
	JUMP_SPEED: 2,
	JUMP_ACCELERATION: 2,
	FALLING_SPEED_TRIGGER: -1
}