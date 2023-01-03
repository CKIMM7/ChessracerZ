import Phaser from 'phaser';

import Settings from './helpers/settings'
import Camera from './helpers/camera';
import Circuit from './helpers/circuit'

// screen size
const SCREEN_W = 1920;
const SCREEN_H = 1080;

// coordinates of the screen center
const SCREEN_CX = SCREEN_W/2;
const SCREEN_CY = SCREEN_H/2;

// game states
const STATE_INIT = 1;
const STATE_RESTART = 2;
const STATE_PLAY = 3;
const STATE_GAMEOVER = 4;

// ---------------------------------------------------------------------------------
// Global Variables
// ---------------------------------------------------------------------------------

// current state
let state = STATE_INIT;

// ---------------------------------------------------------------------------------
// Main Scene
// ---------------------------------------------------------------------------------
export default class MainScene extends Phaser.Scene
{
    constructor(){
		super({key: 'SceneMain'});
	}
	
	/**
	* Loads all assets.
	*/
	preload(){
		this.load.image('imgBack', './assets2/img_back.png');
	}

	/**
	* Creates all objects.
	*/
	create(){
		// backgrounds
		this.sprBack = this.add.image(SCREEN_CX, SCREEN_CY, 'imgBack');
		
		// instances
		this.circuit = new Circuit(this);
		this.camera = new Camera(this);
		this.settings = new Settings(this);
		
		// listener to pause game
		this.input.keyboard.on('keydown-P', function(){
			this.settings.txtPause.text = "[P] Resume";
			this.scene.pause();
			this.scene.launch('ScenePause');
		}, this);
		
		// listener on resume event
		this.events.on('resume', function(){
			this.settings.show();
		}, this);
	}

	/**
	* Main Game Loop
	*/
	update(time, delta){
		switch(state){
			case STATE_INIT:
				this.camera.init();
				//console.log(`main scene loaded`)
				state = STATE_RESTART;
				break;
				
			case STATE_RESTART:
				this.circuit.create();
				
				state = STATE_PLAY;
				break;
				
			case STATE_PLAY:
				console.log('STATE_PLAY')
				this.camera.update();				
				this.circuit.render3D();
				
				break;
				
			case STATE_GAMEOVER:
				break;
		}
	}
}
