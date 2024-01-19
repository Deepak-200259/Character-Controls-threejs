import Experience from "../Experience.js";
import Car from "./Car.js";
import Character from "./Character.js";
import City from "./City.js";
import Environment from "./Environment.js";
import Floor from "./Floor.js";

export default class SceneWorld {
	constructor() {
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;

		// Wait for resources
		this.resources.on("ready", () => {
			// Setup
			// this.floor = new Floor();
			this.city = new City();
			this.character = new Character();
			// this.car = new Car();
			this.environment = new Environment();
		});
	}

	update() {
		if (this.character) this.character.update();
		if (this.car) this.car.update();
		if (this.city) this.city.update();
	}
}
