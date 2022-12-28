export default class Camera
{
    constructor(scene){
		// reference to the main scene
		this.scene = scene;
		
		// camera world coordinates
		this.x = 0;
		this.y = 1000;
		this.z = 0;
		
		// Z-distance between camera and player
		this.distToPlayer = 500;
		
		// Z-distance between camera and normalized projection plane
		this.distToPlane = null;
	}
	
	/**
	* Initializes camera (must be called when initializing game or changing settings).
	*/	
	init(){
		this.distToPlane = 1 / (this.y / this.distToPlayer);
	}	
	
	/**
	* Updates camera position.
	*/	
	update(){
		// place the camera behind the player at the desired distance
		this.z = -this.distToPlayer;
	}
}
