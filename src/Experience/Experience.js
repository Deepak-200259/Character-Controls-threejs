import * as THREE from "three";

import Debug from "./Utils/Debug.js";
import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import Camera from "./Camera.js";
import Renderer from "./Renderer.js";
import SceneWorld from "./World/World.js";
import Resources from "./Utils/Resources.js";
import CannonDebugRenderer from "./Utils/CannonDebugRenderer.js";
import CannonDebugger from "cannon-es-debugger";

import { Vec3, World } from "cannon-es";

import { sources, characterAnimations } from "./Constants.js";

let instance = null;

export default class Experience {
	constructor(_canvas) {
		// Singleton
		if (instance) {
			return instance;
		}
		instance = this;

		// Global access
		window.experience = this;

		// Options
		this.canvas = _canvas;

		// Setup
		this.debug = new Debug();
		this.sizes = new Sizes();
		this.time = new Time();
		this.scene = new THREE.Scene();
		this.resources = new Resources(sources);
		this.characterAnimations = new Resources(characterAnimations);
		this.camera = new Camera();
		this.renderer = new Renderer();
		this.world = new SceneWorld();
		this.physicsWorld = new World({ gravity: new Vec3(0, -9.8, 0) });
		this.cannonDebugger = new CannonDebugger(this.scene, this.physicsWorld);
		this.axesHelper = new THREE.AxesHelper(2000);
		this.scene.add(this.axesHelper);

		// Resize event
		this.sizes.on("resize", () => {
			this.resize();
		});

		// Time tick event
		this.time.on("tick", () => {
			this.update();
		});
	}

	resize() {
		this.camera.resize();
		this.renderer.resize();
	}

	update() {
		this.camera.update();
		this.world.update();
		this.cannonDebugger.update();
		this.physicsWorld.step(1 / 60, this.time.delta, 3);
		this.renderer.update();
	}

	destroy() {
		this.sizes.off("resize");
		this.time.off("tick");

		// Traverse the whole scene
		this.scene.traverse((child) => {
			// Test if it's a mesh
			if (child instanceof THREE.Mesh) {
				child.geometry.dispose();

				// Loop through the material properties
				for (const key in child.material) {
					const value = child.material[key];

					// Test if there is a dispose function
					if (value && typeof value.dispose === "function") {
						value.dispose();
					}
				}
			}
		});

		this.camera.controls.dispose();
		this.renderer.instance.dispose();

		if (this.debug.active) this.debug.ui.destroy();
	}
}
