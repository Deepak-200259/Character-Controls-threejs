import * as THREE from "three";
import * as Cannon from "cannon-es";
import Experience from "../Experience.js";
import { getPhysicsBody } from "../Utils/physicsBodyHelper.js";
import { ShapeType } from "three-to-cannon";

export default class Floor {
	constructor() {
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;

		this.setGeometry();
		this.setTextures();
		this.setMaterial();
		this.setMesh();
		this.setupPhysicsGround();
	}

	setGeometry() {
		this.geometry = new THREE.BoxGeometry(6400, 6400, 1);
	}

	setTextures() {
		this.textures = {};

		this.textures.color = this.resources.items.grassColorTexture;
		this.textures.color.colorSpace = THREE.SRGBColorSpace;
		this.textures.color.repeat.set(150, 150);
		this.textures.color.wrapS = THREE.RepeatWrapping;
		this.textures.color.wrapT = THREE.RepeatWrapping;

		this.textures.normal = this.resources.items.grassNormalTexture;
		this.textures.normal.repeat.set(150, 150);
		this.textures.normal.wrapS = THREE.RepeatWrapping;
		this.textures.normal.wrapT = THREE.RepeatWrapping;
	}

	setMaterial() {
		this.material = new THREE.MeshStandardMaterial({
			map: this.textures.color,
			normalMap: this.textures.normal,
		});
	}

	setMesh() {
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.rotation.x = -Math.PI * 0.5;
		this.mesh.position.y = -0.5;
		this.mesh.receiveShadow = true;
		this.scene.add(this.mesh);
	}

	setupPhysicsGround() {
		this.groundBody = getPhysicsBody(
			this.mesh,
			ShapeType.BOX,
			new Cannon.Material("GroundMaterial"),
			0,
		);
		this.experience.physicsWorld.addBody(this.groundBody);
	}
}
