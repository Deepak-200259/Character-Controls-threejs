export let sources = [
	{
		name: "environmentMapTexture",
		type: "cubeTexture",
		path: [
			"textures/environmentMap/px.jpg",
			"textures/environmentMap/nx.jpg",
			"textures/environmentMap/py.jpg",
			"textures/environmentMap/ny.jpg",
			"textures/environmentMap/pz.jpg",
			"textures/environmentMap/nz.jpg",
		],
	},
	{
		name: "grassColorTexture",
		type: "texture",
		path: "textures/dirt/color.jpg",
	},
	{
		name: "grassNormalTexture",
		type: "texture",
		path: "textures/dirt/normal.jpg",
	},
	{
		name: "character",
		type: "fbxModel",
		path: "models/Character/MariaJJOng.fbx",
	},
	{
		name: "car",
		type: "gltfModel",
		path: "models/Car/scene.gltf",
	},
	{
		name: "city",
		type: "gltfModel",
		path: "models/City/ccity_building_set_1.glb",
	},
];

export let characterAnimations = [
	{
		name: "walk",
		type: "fbxModel",
		path: "models/Character/Animations/Walk.fbx",
	},
	{
		name: "run",
		type: "fbxModel",
		path: "models/Character/Animations/Run.fbx",
	},
	{
		name: "idle",
		type: "fbxModel",
		path: "models/Character/Animations/Idle.fbx",
	},
	{
		name: "crouch",
		type: "fbxModel",
		path: "models/Character/Animations/CrouchIdle.fbx",
	},
	{
		name: "jump",
		type: "fbxModel",
		path: "models/Character/Animations/Jump.fbx",
	},
	{
		name: "fiest",
		type: "fbxModel",
		path: "models/Character/Animations/Fiest.fbx",
	},
	{
		name: "kick",
		type: "fbxModel",
		path: "models/Character/Animations/Kick.fbx",
	},
];
