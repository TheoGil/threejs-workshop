import '../css/reset.css';
import '../css/style.css';

import * as THREE from 'three';
import 'three/OrbitControls';
import dat from 'dat.gui/build/dat.gui.js';

const params = {
    sphereX: 0,
    sphereY: 0,
    sphereZ: 0,
    scale:   1,
    cameraX: 0,
    cameraY: 0,
    cameraZ: 5,
};

// Set up the scene
const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('scene'),
});
renderer.setSize(window.innerWidth, window.innerHeight);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
camera.position.z = 5;

// Let's add something to the screen!
const geometry = new THREE.SphereGeometry(4, 32, 32);
const material = new THREE.MeshLambertMaterial({
    color: 0xC238B5
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// And also some lights so we can see something!
let lights = [];
function letThereBeLight () {
    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    lights[2] = new THREE.PointLight(0xffffff, 1, 0);

    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, -100);

    for (var i = 0; i < lights.length; i++) {
        scene.add(lights[i]);
    }
}
letThereBeLight();

// DAT.GUI
const gui = new dat.GUI();
gui.add(params, 'sphereX', -10, 10).onChange((value) => {
    sphere.position.x = value;
});
gui.add(params, 'sphereY', -10, 10).onChange((value) => {
    sphere.position.y = value;
});
gui.add(params, 'sphereZ', -10, 10).onChange((value) => {
    sphere.position.z = value;
});
gui.add(params, 'scale', 0, 10).onChange((value) => {
    sphere.scale.x = value;
    sphere.scale.y = value;
    sphere.scale.z = value;
});
gui.add(params, 'cameraX', -10, 10).onChange((value) => {
    camera.position.x = value;
});
gui.add(params, 'cameraY', -10, 10).onChange((value) => {
    camera.position.y = value;
});
gui.add(params, 'cameraZ', -10, 10).onChange((value) => {
    camera.position.z = value;
});

// Those line make sure that we maintain a correct aspect ratio when resizing window
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

// We need to call renderer.render for anything to happen.
// Since we're gonna move stuff around, it's already wrapped in a RAF
function animate () {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}
animate();