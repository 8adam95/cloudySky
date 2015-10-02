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
	
	var prefix = 'plugins/cloudySky/background/';
	

	scene.add( makeSkybox( [
		prefix+'px.jpg',
		prefix+'nx.jpg',
		prefix+'nz.jpg',
		prefix+'pz.jpg',
		prefix+'py.jpg',
		prefix+'ny.jpg'
	
	], 8000 ));

}
