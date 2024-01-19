import * as THREE from "three";

const DIRECTIONS = [
	"arrowup",
	"arrowdown",
	"arrowleft",
	"arrowright",
	"w",
	"a",
	"s",
	"d",
];

export default class CharacterController {
	model;
	mixer;
	animationsMap;
	orbitControls;
	camera;

	//state
	toogleRun = true;
	currentAction;

	//Temporary Data
	walkDirection = new THREE.Vector3();
	rotateAngle = new THREE.Vector3(0, 1, 0);
	rotateQuaternion = new THREE.Quaternion();
	cameraTarget = new THREE.Vector3();

	//Constants
	fadeDuration = 0.3;
	runVelocity = 100;
	walkVelocity = 30;

	constructor(
		model,
		mixer,
		animationsMap,
		orbitControls,
		camera,
		currentAction,
	) {
		this.model = model;
		this.mixer = mixer;
		this.animationsMap = animationsMap;
		this.currentAction = currentAction;
		this.orbitControls = orbitControls;
		this.animationsMap.forEach((value, key) => {
			if (key == currentAction) {
				value.play();
			}
		});
		this.camera = camera;
	}

	switchRunToogle() {
		this.toogleRun = !this.toogleRun;
	}

	getDirectionOffset(keysPressed) {
		let directionOffset = 0;

		if (keysPressed["arrowup"] || keysPressed["w"]) {
			if (keysPressed["arrowleft"] || keysPressed["a"])
				directionOffset = -Math.PI / 4 - Math.PI / 2;
			else if (keysPressed["arrowright"] || keysPressed["d"])
				directionOffset = Math.PI / 4 + Math.PI / 2;
			else directionOffset = Math.PI;
		} else if (keysPressed["arrowdown"] || keysPressed["s"]) {
			if (keysPressed["arrowleft"] || keysPressed["a"])
				directionOffset = Math.PI / 4 - Math.PI / 2;
			else if (keysPressed["arrowright"] || keysPressed["d"])
				directionOffset = -Math.PI / 4 + Math.PI / 2;
			else directionOffset = 0;
		} else if (keysPressed["arrowleft"] || keysPressed["a"])
			directionOffset = -Math.PI / 2;
		else if (keysPressed["arrowright"] || keysPressed["d"])
			directionOffset = Math.PI / 2;

		return directionOffset;
	}

	updateCameraTarget(moveX, moveZ) {
		this.camera.position.x += moveX;
		this.camera.position.z += moveZ;

		this.cameraTarget.x = this.model.position.x;
		this.cameraTarget.y = this.model.position.y + 250;
		this.cameraTarget.z = this.model.position.z;
		this.orbitControls.target = this.cameraTarget;
	}

	update(deltaTime, keysPressed) {
		const directionPressed = DIRECTIONS.some((key) => keysPressed[key] == true);

		var play = "";
		if (directionPressed) {
			if (keysPressed.shift) {
				play = "run";
			} else {
				play = "walk";
			}
		} else {
			play = "idle";
		}

		if (this.currentAction != play) {
			const toPlay = this.animationsMap.get(play);
			const current = this.animationsMap.get(this.currentAction);

			current.fadeOut(this.fadeDuration);
			toPlay.reset().fadeIn(this.fadeDuration).play();
			this.currentAction = play;
		}

		if (this.currentAction == "run" || this.currentAction == "walk") {
			//Calculate towards camera direction
			let angleYCameraDirection = Math.atan2(
				this.camera.position.x - this.model.position.x,
				this.camera.position.z - this.model.position.z,
			);
			// diagonal movement angle offset
			let directionOffset = this.getDirectionOffset(keysPressed);

			// rotate model
			this.rotateQuaternion.setFromAxisAngle(
				this.rotateAngle,
				angleYCameraDirection + directionOffset,
			);
			this.model.quaternion.rotateTowards(this.rotateQuaternion, 0.1);

			//calculate direction
			this.camera.getWorldDirection(this.walkDirection);
			this.walkDirection.y = 0;
			this.walkDirection.normalize();
			this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset);

			// run or walk velocity
			const velocity =
				this.currentAction == "run" ? this.runVelocity : this.walkVelocity;

			//move model & camera

			const moveX = -this.walkDirection.x * velocity * deltaTime * 0.1;
			const moveZ = -this.walkDirection.z * velocity * deltaTime * 0.1;

			this.model.position.x += moveX;
			this.model.position.z += moveZ;
			this.updateCameraTarget(moveX, moveZ);
		}
		this.mixer.update(deltaTime * 0.01);
	}
}
