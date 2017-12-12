import '../css/reset.css';
import '../css/style.css';

import * as THREE from 'three';
import 'three/OrbitControls';
import dat from 'dat.gui/build/dat.gui.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('scene'),
});
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 5;

/* ---------------------------------------- UTILS */
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

/* --------------------------------------- LIGHTS */
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

/* --------------------- ADD SOME STUFF TO SCREEN */
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshPhongMaterial( {
    color: 0x156289,
});
const cube = new THREE.Mesh( geometry, material );
scene.add(cube);

/* ----------------------------------------- GUI */
let options = {
    rotationX: 0.01,
    rotationY: 0.01,
};
const gui = new dat.GUI();
gui.add(options, 'rotationX', 0, 0.1);
gui.add(options, 'rotationY', 0, 0.1);

/* ------------------------------ ANIMATION LOOP */
function animate () {
    requestAnimationFrame( animate );

    cube.rotation.x += options.rotationX;
    cube.rotation.y += options.rotationY;

    renderer.render(scene, camera);
}
animate();