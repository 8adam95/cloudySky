/* ------------------------------------------------- CLOUDY SKY -------------------------------------------------*/
function makeCloudySky(){

	function makeSkybox( urls, size ) {
			var skyboxCubemap = THREE.ImageUtils.loadTextureCube( urls );
			skyboxCubemap.format = THREE.RGBFormat;
			var skyboxShader = THREE.ShaderLib['cube'];
			skyboxShader.uniforms['tCube'].value = skyboxCubemap;
			return new THREE.Mesh(
				new THREE.BoxGeometry( size, size, size ),
				new THREE.ShaderMaterial({
					fragmentShader : skyboxShader.fragmentShader, vertexShader : skyboxShader.vertexShader,
					uniforms : skyboxShader.uniforms, depthWrite : false, side : THREE.BackSide
				})
			);
		}
	renderer.setClearColor(0xffffff);
	
	var prefix = 'environment/skybox/background/textures/cube/skybox/';
	

	scene.add( makeSkybox( [
		prefix+'px.jpg',
		prefix+'nx.jpg',
		prefix+'nz.jpg',
		prefix+'pz.jpg',
		prefix+'py.jpg',
		prefix+'ny.jpg'
	
		/*
		prefix+'4xalt2t1ygtln3b/nx.jpg',
		prefix+'nlupf116bvti4cu/ny.jpg',
		prefix+'0xeiipbmhblmsge/nz.jpg',
		prefix+'xdcgqmavfj73i2k/px.jpg',
		prefix+'1enung9i323b9w8/py.jpg',
		prefix+'zmkr0ocroepvh9g/pz.jpg'
		*/
	], 8000 ));

}
