import * as THREE from "three";
import * as Cannon from "cannon-es";
import { ShapeType } from "three-to-cannon";
import Experience from "../Experience";
import { getPhysicsBody } from "../Utils/physicsBodyHelper";

export default class City {
	constructor() {
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.setupModel();
		this.setupCityBodies();
	}
	setupModel() {
		this.city = this.experience.resources.items.city.scene;
		this.city.scale.set(0.8, 0.8, 0.8);
		this.scene.add(this.city);
	}

	setupCityBodies() {
		this.city.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				child.castShadow = true;
				child.receiveShadow = true;
				// const body = getPhysicsBody(
				// 	child,
				// 	ShapeType.BOX,
				// 	new Cannon.Material("buildings"),
				// 	0,
				// );
				// this.experience.physicsWorld.addBody(body);
			}
		});
	}

	update() {}
}
