var canvas = document.getElementById("renderCanvas");
var meshlist = [];
var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };
var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    var newsphere = createSphere(-2, 0, 0, 1);
    newsphere.material = hexMat('#7FFFD4'); //mesh #1

    var newsphere2 = createSphere(2, 0, 0, 1);
    newsphere2.material = hexMat('#7FFFD4');
    
    var newsphere3 = createSphere(0, 0, 2, 1);
    newsphere3.material = hexMat('#7FFFD4');

    var newsphere4 = createSphere(0, 0, -2, 1);
    newsphere4.material = hexMat('#7FFFD4');

    var newbox = createBox(0,0,0,5,0.5,5);
    newbox.material = hexMat('#F28500'); // mesh #2

    var anim1 = {subj: newsphere.position, prop: 'x', val: 2}; //animation #1
    var anim2 = {subj: newsphere2.position, prop: 'x', val: -2}; //animation #2
    var anim3 = {subj: newsphere3.position, prop: 'z', val: -2};
    var anim4 = {subj: newsphere4.position, prop: 'z', val: 2};    
    var anim5 = {subj: newbox.rotation, prop: 'y', val: Math.PI/2}; //animation #3     
   
    var anims = [anim1,anim2,anim3, anim4, anim5];
    animate(anims, scene, 2, true);
    // Our built-in 'ground' shape.
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

    return scene;
};
window.initFunction = async function () {
    var asyncEngineCreation = async function () {
        try {
            return createDefaultEngine();
        } catch (e) {
            console.log("the available createEngine function failed. Creating the default engine instead");
            return createDefaultEngine();
        }
    }

    window.engine = await asyncEngineCreation();
    if (!engine) throw 'engine should not be null.';
    startRenderLoop(engine, canvas);
    window.scene = createScene();
};
initFunction().then(() => {
    sceneToRender = scene
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});


