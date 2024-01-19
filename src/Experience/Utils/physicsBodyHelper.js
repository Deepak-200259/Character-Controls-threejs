import { Body } from "cannon-es";
import { threeToCannon } from "three-to-cannon";

export function getPhysicsBody(object, shapeType, material, mass = 0) {
	const physicsMaterial = material;

	const quaternion1 = object.quaternion.clone();
	object.quaternion.set(0, 0, 0, 1);
	let result;
	if (shapeType) result = threeToCannon(object, { type: shapeType });
	else result = threeToCannon(object);

	const { shape, offset, quaternion } = result;

	const physicsBody = new Body({
		mass: mass,
		allowSleep: false,
		material: physicsMaterial,
	});
	physicsBody.addShape(shape, offset, quaternion);

	object.quaternion.copy(quaternion1);
	physicsBody.position.copy(object.position);
	physicsBody.quaternion.copy(object.quaternion);

	return physicsBody;
}
