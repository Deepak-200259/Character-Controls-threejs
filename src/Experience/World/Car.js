import Experience from "../Experience";
import * as THREE from "three";
import { getPhysicsBody } from "../Utils/physicsBodyHelper";
import { ShapeType } from "three-to-cannon";
import * as Cannon from "cannon-es";

const wheelsPositions = [
	new Cannon.Vec3(-85, 0, -450),
	new Cannon.Vec3(85, 0, -450),
	new Cannon.Vec3(-85, 0, -550),
	new Cannon.Vec3(85, 0, -550),
];
export default class Car {
	constructor() {
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.physicsWorld = this.experience.physicsWorld;
		this.resources = this.experience.resources;

		this.setupCar();
		this.createCar();
		// this.setupCarBody();
	}

	setupCar() {
		this.car = this.resources.items.car.scene;
		// this.car.scale.set(100, 100, 100);
		// this.car.position.set(0, 0, -500);
		this.scene.add(this.car);
	}

	createCar() {
		// Car body
		this.carBody = new Cannon.Body({
			mass: 1500,
			shape: new Cannon.Box(new Cannon.Vec3(2, 0.5, 4)),
		});
		this.carBody.position.set(0, 50, 0);
		this.physicsWorld.addBody(this.carBody);

		// Car wheels
		const wheelOptions = {
			radius: 0.5,
			directionLocal: new Cannon.Vec3(0, -1, 0), // Wheel rotation axis is along the negative y-axis
			suspensionStiffness: 30,
			suspensionRestLength: 0.3,
			frictionSlip: 5,
			dampingRelaxation: 2.3,
			dampingCompression: 4.4,
			maxSuspensionForce: 100000,
			rollInfluence: 0.01,
			axleLocal: new Cannon.Vec3(-1, 0, 0), // Wheel axle is along the negative x-axis
			chassisConnectionPointLocal: new Cannon.Vec3(1, 1, 2), // Where the wheel connects to the chassis
			isFrontWheel: false, // Set to true for front wheels
		};

		const wheel1 = this.createWheel(wheelOptions);
		const wheel2 = this.createWheel(wheelOptions);
		const wheel3 = this.createWheel(wheelOptions);
		const wheel4 = this.createWheel(wheelOptions);

		// Attach wheels to the car
		const wheelBodies = [wheel1, wheel2, wheel3, wheel4];
		wheelBodies.forEach((wheel) => {
			this.physicsWorld.addBody(wheel);
			const constraint = new Cannon.DistanceConstraint(this.carBody, wheel);
			this.physicsWorld.addConstraint(constraint);
		});
	}

	// Helper function to create a wheel
	createWheel(options) {
		const {
			radius,
			directionLocal,
			suspensionStiffness,
			suspensionRestLength,
			frictionSlip,
			dampingRelaxation,
			dampingCompression,
			maxSuspensionForce,
			rollInfluence,
			axleLocal,
			chassisConnectionPointLocal,
			isFrontWheel,
		} = options;

		const wheelShape = new Cannon.Sphere(radius);
		const wheelBody = new Cannon.Body({
			mass: 30, // Adjust the mass as needed
		});
		wheelBody.addShape(wheelShape);
		wheelBody.angularDamping = 0.4;

		// Set wheel options
		wheelBody.position.copy(chassisConnectionPointLocal);
		wheelBody.position.vadd(wheelBody.position, wheelBody.position);
		wheelBody.quaternion.setFromAxisAngle(axleLocal, Math.PI / 2);
		wheelBody.position.vadd(wheelBody.position, chassisConnectionPointLocal);

		options = {
			radius: radius,
			directionLocal: directionLocal,
			suspensionStiffness: suspensionStiffness,
			suspensionRestLength: suspensionRestLength,
			frictionSlip: frictionSlip,
			dampingRelaxation: dampingRelaxation,
			dampingCompression: dampingCompression,
			maxSuspensionForce: maxSuspensionForce,
			rollInfluence: rollInfluence,
			axleLocal: axleLocal,
			chassisConnectionPointLocal: chassisConnectionPointLocal,
			isFrontWheel: isFrontWheel,
		};

		const constraint = new Cannon.DistanceConstraint(
			this.carBody,
			wheelBody,
			options,
		);
		this.physicsWorld.addConstraint(constraint);

		return wheelBody;
	}

	setupCarBody() {
		this.carBody = new Cannon.Body({
			shape: new Cannon.Box(new Cannon.Vec3(2, 0.45, 0.9)),
			position: new Cannon.Vec3(0, 3, 0),
			mass: 1000,
			type: Cannon.Body.DYNAMIC,
		});
		this.vehicle = new Cannon.RigidVehicle({ chassisBody: this.carBody });
		this.vehicle.addToWorld(this.physicsWorld);

		this.setupCarWheels();
	}

	setupCarWheels() {
		const mass = 20;
		const axisWidth = 5;
		const wheelShape = new Cannon.Sphere(1);
		const wheelMaterial = new Cannon.Material("wheel");
		const down = new Cannon.Vec3(0, -1, 0);

		// for (let i = 0; i < wheelsPositions.length; i++) {
		const wheelBody1 = new Cannon.Body({
			mass,
			material: wheelMaterial,
		});
		wheelBody1.addShape(wheelShape);
		wheelBody1.angularDamping = 0.4;

		const wheelBody2 = new Cannon.Body({
			mass,
			material: wheelMaterial,
		});
		wheelBody2.addShape(wheelShape);
		wheelBody2.angularDamping = 0.4;

		const wheelBody3 = new Cannon.Body({
			mass,
			material: wheelMaterial,
		});
		wheelBody3.addShape(wheelShape);
		wheelBody3.angularDamping = 0.4;

		const wheelBody4 = new Cannon.Body({
			mass,
			material: wheelMaterial,
		});
		wheelBody4.addShape(wheelShape);
		wheelBody4.angularDamping = 0.4;

		this.vehicle.addWheel({
			body: wheelBody1,
			position: new Cannon.Vec3(-2, 0, axisWidth / 2),
			axis: new Cannon.Vec3(0, 0, 1),
			direction: down,
		});
		this.vehicle.addWheel({
			body: wheelBody2,
			position: new Cannon.Vec3(-2, 0, -axisWidth / 2),
			axis: new Cannon.Vec3(0, 0, 1),
			direction: down,
		});
		this.vehicle.addWheel({
			body: wheelBody3,
			position: new Cannon.Vec3(2, 0, -axisWidth / 2),
			axis: new Cannon.Vec3(0, 0, 1),
			direction: down,
		});
		this.vehicle.addWheel({
			body: wheelBody4,
			position: new Cannon.Vec3(2, 0, axisWidth / 2),
			axis: new Cannon.Vec3(0, 0, 1),
			direction: down,
		});
		// }
	}

	update() {
		this.car.position.copy(this.carBody.position);
		this.car.position.y = this.carBody.position.y - 0.5;
		this.car.quaternion.copy(this.carBody.quaternion);
	}
}
