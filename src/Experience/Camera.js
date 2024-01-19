import * as THREE from "three";
import Experience from "./Experience.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class Camera {
	constructor() {
		this.experience = new Experience();
		this.sizes = this.experience.sizes;
		this.scene = this.experience.scene;
		this.canvas = this.experience.canvas;

		this.setInstance();
		this.setControls();
	}

	setInstance() {
		this.instance = new THREE.PerspectiveCamera(
			35,
			this.sizes.width / this.sizes.height,
			10,
			10000000,
		);
		this.instance.position.set(0, 500, 750);
		this.instance.lookAt(new THREE.Vector3(0, 500, 0));
		this.scene.add(this.instance);
	}

	setControls() {
		this.controls = new OrbitControls(this.instance, this.canvas);
		this.controls.enableDamping = true;
		this.controls.enablePan = false;
		this.controls.rotateSpeed = 2;
		this.controls.target = new THREE.Vector3(0, 250, 0);
		this.controls.maxDistance = 1000;
		this.controls.minDistance = 1000;
		this.controls.minPolarAngle = 0;
		this.controls.maxPolarAngle = (Math.PI / 180) * 95;
	}

	resize() {
		this.instance.aspect = this.sizes.width / this.sizes.height;
		this.instance.updateProjectionMatrix();
	}

	update() {
		this.controls.update();
	}
}
