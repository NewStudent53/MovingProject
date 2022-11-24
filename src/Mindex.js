var THREE = require("three");
var OrbitControls_1 = require("three/examples/jsm/controls/OrbitControls");
var OBJLoader_1 = require("three/examples/jsm/loaders/OBJLoader");

//

var camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500);
camera.position.set(-35, 70, 100);
camera.lookAt(new THREE.Vector3(0, 0, 0));


var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
exports.onWindowResize = onWindowResize;
window.addEventListener('resize', onWindowResize);


var scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);


var controls = new OrbitControls_1.OrbitControls(camera, renderer.domElement);
function animate() {
    dragObject();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
exports.animate = animate;

const gui = new dat.GUI()

//AMBIENT
var light = new THREE.AmbientLight(0xffffff, 0.20);
scene.add(light);

const lightColor = {
  color: 0x0
}

const AmbientFolder = gui.addFolder('AmbientLight')
  AmbientFolder.addColor(lightColor, 'color')
    .onChange(() => { light.color.set(lightColor.color)
    })
  AmbientFolder.close()    
//AMBIENT


//DIRECTIONAL
var dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(-30, 50, -30);
scene.add(dirLight);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.left = -70;
dirLight.shadow.camera.right = 70;
dirLight.shadow.camera.top = 70;
dirLight.shadow.camera.bottom = -70;

const DirectFolder = gui.addFolder('DirectionFolder')
    DirectFolder.add(dirLight.position, 'x', -50, 50, 0.01)
    DirectFolder.add(dirLight.position, 'y', -50, 50, 0.01)
    DirectFolder.add(dirLight.position, 'z', -50, 50, 0.01)
    DirectFolder.close()
//DIRECTIONAL


//HEMISPHERE
var hemiLight = new THREE.HemisphereLight();
const data = {
  color: light.color.getHex(),
  groundColor: hemiLight.groundColor.getHex(),
  switch: false,
  mapsEnabled: true,
  shadowMapSizeWidth: 512,
  shadowMapSizeHeight: 512
}  
hemiLight.position.set(-30, 50, -30);
scene.add(hemiLight);
const Hemisphere = gui.addFolder('HemisphereLight')
    Hemisphere.addColor(data, 'groundColor').onChange(() => {
        hemiLight.groundColor.setHex(Number(data.groundColor.toString().replace('#', '0x'))) });

   Hemisphere.add(hemiLight.position, "x", -100, 100, 0.01)
   Hemisphere.add(hemiLight.position, "y", -100, 100, 0.01)
   Hemisphere.add(hemiLight.position, "z", -100, 100, 0.01)
   Hemisphere.close()
//HEMISPHERE

//POINTLIGHT
var pointLight = new THREE.PointLight();
scene.add(pointLight);
const PointLight = gui.addFolder('PointLight')
    PointLight.add(pointLight, 'distance', 0, 100, 0.01)
    PointLight.add(pointLight, 'decay', 0, 4, 0.1)
    PointLight.add(pointLight.position, 'x', -50, 50, 0.01)
    PointLight.add(pointLight.position, 'y', -50, 50, 0.01)
    PointLight.add(pointLight.position, 'z', -50, 50, 0.01)
    
        const lightH = {
            color: 0x0
        }

        PointLight.addColor(lightH, 'color')
            .onChange(() => {
                pointLight.color.set(lightH.color)
            })

    PointLight.close()
//POINTLIGHT

//SPOT
var Slight = new THREE.SpotLight()
scene.add(Slight)
const SpotLightFolder = gui.addFolder('SpotLight')
    
    SpotLightFolder.add(Slight, 'distance', 0, 100, 0.01)
    SpotLightFolder.add(Slight, 'decay', 0, 4, 0.1)
    SpotLightFolder.add(Slight.position, 'x', -50, 50, 0.01)
    SpotLightFolder.add(Slight.position, 'y', -50, 50, 0.01)
    SpotLightFolder.add(Slight.position, 'z', -50, 50, 0.01)
    SpotLightFolder.close()
//SPOT


function FLOORBASE() {
    var pos = { x: 0, y: -1, z: 3 };
    var scale = { x: 100, y: 2, z: 100 };
    var blockPlane = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0xFFFFFF }));
    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.scale.set(scale.x, scale.y, scale.z);
    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;
    scene.add(blockPlane);
    blockPlane.userData.ground = true;
}


function BOX() {
    var scale = { x: 6, y: 6, z: 6 };
    var pos = { x: 15, y: scale.y / 2, z: 15 };
    var box = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0x00FF00 }));
    box.position.set(pos.x, pos.y, pos.z);
    box.scale.set(scale.x, scale.y, scale.z);
    box.castShadow = true;
    box.receiveShadow = true;
    scene.add(box);
    box.userData.draggable = true;
    box.userData.name = 'BOX';
}

function SPHERE() {
    var radius = 4;
    var pos = { x: 15, y: radius, z: -15 };
    var sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(radius, 32, 32), new THREE.MeshPhongMaterial({ color: 0x00FFFF }));
    sphere.position.set(pos.x, pos.y, pos.z);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add(sphere);
    sphere.userData.draggable = true;
    sphere.userData.name = 'SPHERE';
}

function CONE() {
    var radius = 4;
    var height = 6;
    var pos = { x: -15, y: height / 2, z: 15 };
    var cone = new THREE.Mesh(new THREE.ConeBufferGeometry(radius, radius, height, 32), new THREE.MeshPhongMaterial({ color: 0xFF0000 }));
    cone.position.set(pos.x, pos.y, pos.z);
    cone.castShadow = true;
    cone.receiveShadow = true;
    scene.add(cone);
    cone.userData.draggable = true;
    cone.userData.name = 'CONE';
}

var raycaster = new THREE.Raycaster();
var clickMouse = new THREE.Vector2();
var moveMouse = new THREE.Vector2();
var draggable;

function intersect(pos) {
    raycaster.setFromCamera(pos, camera);
    return raycaster.intersectObjects(scene.children);
}

window.addEventListener('click', function (event) {
    if (draggable != null) {
        console.log("dropping draggable ".concat(draggable.userData.name));
        draggable = null;
        return;
    }
    
    
    clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    var found = intersect(clickMouse);
    if (found.length > 0) {
        if (found[0].object.userData.draggable) {
            draggable = found[0].object;
            console.log("found draggable ".concat(draggable.userData.name));
        }
    }
});

window.addEventListener('mousemove', function (event) {
    moveMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    moveMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

function dragObject() {
    if (draggable != null) {
        var found = intersect(moveMouse);
        if (found.length > 0) {
            for (var i = 0; i < found.length; i++) {
                if (!found[i].object.userData.ground)
                    continue;
                var target = found[i].point;
                draggable.position.x = target.x;
                draggable.position.z = target.z;
            }
        }
    }
}

FLOORBASE();
BOX();
SPHERE();
CONE();
animate();

//Reminder to add more objects so that users can see more items