/* ------------------------------------------------- CLOUDY SKY -------------------------------------------------*/
//See skydome.js for more information on format of a plugin.

var CloudySky = function()
{
};

CloudySky.prototype = Object.create(AtmospherPlugin.prototype);
CloudySky.prototype.constructor = CloudySky;


CloudySky.initLoadtime = function (){
    //initStatic
    availablePlugins.push("CloudySky");
};

CloudySky.prototype.init = function (SHADOW_MAP_WIDTH, SHADOW_MAP_HEIGHT){
    this.shown=false;
    assert(SHADOW_MAP_WIDTH);
    assert(SHADOW_MAP_HEIGHT);
    this.SHADOW_MAP_WIDTH = SHADOW_MAP_WIDTH;
    this.SHADOW_MAP_HEIGHT = SHADOW_MAP_HEIGHT;
};

CloudySky.prototype.initMainLight = function (x,y,z, color, intensity, SHADOW_MAP_WIDTH, SHADOW_MAP_HEIGHT)
{
    assert(SHADOW_MAP_WIDTH);
    assert(SHADOW_MAP_HEIGHT);
    // LIGHTS
    //THREE.DirectionalLight (ray are parallel, source seems very far => sun) or THREE.SpotLight (ray seems coming from a unique source) can handle shadows
    light = new THREE.SpotLight(color, intensity);
    light.position.set(x,y,z);
    light.visible= true;
    light.castShadow = true; //Enable shadow casting
    console.warn("light.shadowDarkness")
    light.shadowDarkness = 0.5; //0 means no shadows,1 means pure black shadow
    //light.shadowCameraVisible = true; //Show the shadow camera (debugging)
    light.shadow.mapSize.width = SHADOW_MAP_WIDTH; //2048; // default is 512
    light.shadow.mapSize.height = SHADOW_MAP_HEIGHT; //2048; // default is 512
    light.name="mainlight";
    if(!light)
        Logger.info("light not initialized");
    else
        scene.add(light);
};

CloudySky.prototype.show = function (){
    assert(!this.shown);
    this.shown = true;
	function _makeSkybox(cskyobj, urls, size ) {
            //note: this is not accessible here. Using cskyobj instead.

            var hemiLight = new THREE.HemisphereLight(0xffbbaa, 0x040404, 1);
        	hemiLight.name = "hemiLight";
           	hemiLight.position.z = 500;
            if(!hemiLight)
                Logger.info("hemiLight not initialized");
            else
                scene.add(hemiLight);

			cskyobj.skyboxCubemap = THREE.ImageUtils.loadTextureCube( urls );
			cskyobj.skyboxCubemap.format = THREE.RGBFormat;
			cskyobj.skyboxShader = THREE.ShaderLib.cube;
			cskyobj.skyboxShader.uniforms.tCube.value = cskyobj.skyboxCubemap;
			cskyobj.skymesh = new THREE.Mesh(
				new THREE.BoxGeometry( size, size, size ),
				new THREE.ShaderMaterial({
					fragmentShader : cskyobj.skyboxShader.fragmentShader, vertexShader : cskyobj.skyboxShader.vertexShader,
					uniforms : cskyobj.skyboxShader.uniforms, depthWrite : false, side : THREE.BackSide
				})
			);
            return cskyobj.skymesh;
		}

        console.warn("get_default_shadowmap_size() is called inside atmosphere.show()")
        var shmz = this.get_default_shadowmap_size();
        var SHADOW_MAP_WIDTH = shmz[0];
        var SHADOW_MAP_HEIGHT = shmz[1];
        var mainlight = scene.getObjectByName( "mainlight" );
        if(!mainlight) //nevere true
            this.initMainLight(-110*5, -90*5, 126*5, 0xff4444, 1.5, this.SHADOW_MAP_WIDTH, this.SHADOW_MAP_HEIGHT);
        else{
            //mainlight.position.set(x,y,z);
            scene.remove(mainlight);
            this.initMainLight(-110*5, -90*5, 126*5, 0xff4444, 1.5, this.SHADOW_MAP_WIDTH, this.SHADOW_MAP_HEIGHT);
        }

	var prefix = 'plugins/cloudySky/background/';


	scene.add( _makeSkybox(this, [
		prefix+'px.jpg',
		prefix+'nx.jpg',
		prefix+'nz.jpg',
		prefix+'pz.jpg',
		prefix+'py.jpg',
		prefix+'ny.jpg'

	], 8000 ));

    //Customising the bed grid
    var g=scene.getObjectByName("grid");
    if(g){
        g.material.color.setRGB(0,0,1);
        //scene.remove(g)
    }

    //Customising the bed surface
    var bed=scene.getObjectByName("bed");
    if(bed){
        //bed.material.color.setRGB(0.3,0.3,0.3)
    }

    renderer.setClearColor(0xffffff);
    this.status = "Up and running";
};

CloudySky.prototype.hide = function(){
    assert(this.shown);
    this.shown=false;
    var hl = scene.getObjectByName( "hemiLight" );
    if(hl) scene.remove(hl); //never tested

    var ml = scene.getObjectByName( "mainlight" );
    _expect(ml);
    if(ml) scene.remove(ml); //never tested

    /*
                fixme:
                DOES NOT REMOVE THE PLUGIN
    */

    scene.remove(this.skymesh);
    //this.skymesh.dispose();
    this.skymesh = null;
    this.skyboxCubemap=null;
    this.skyboxShader=null;
    renderer.setClearColor(0x999999);

};

CloudySky.prototype.goPerspective = function(){
};
CloudySky.prototype.goOrthographic = function(){
};

CloudySky.prototype.setShadowQuality = function(shadowMapWidth, shadowMapHeight){
    if(!CONFIG.performance.useShadow) return;
    //this.light is ambient ==> irrelevant
    this.light.shadow.mapSize.width = shadowMapWidth; // default is 512
    this.light.shadow.mapSize.hight = shadowMapHeight; // default is 512
    this.light.shadowMap.dispose(); // important
    this.light.shadowMap = null;
};

CloudySky.prototype.getInfo = function(){ return "CloudySky plugin. (c) 2015. " + this.status;}; //Download or clone from github.com/8adam95/cloudySky.git into DesignSoftware/plugins.

CloudySky.initLoadtime();



//todo: Plugin (Unit) Tests by mp5

var __a = PatternMatchClass(CloudySky, Patterns.classMethods.atmospher_plugin);
assert(__a);

