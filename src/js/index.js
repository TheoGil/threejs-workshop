import '../css/reset.css';
import '../css/style.css';

import * as THREE from 'three';
import 'three/OrbitControls';
import dat from 'dat.gui/build/dat.gui.js';
import Star from './Star.js';

const stars = [];
const star_size = 1;
const star_count = 20;
const distanceBetweenStars = 100;
const randomStarPositionOffset = 200;
const camera_distance = 20;

// Set up the scene
const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('scene'),
});
renderer.setSize(window.innerWidth, window.innerHeight);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const controls = new THREE.OrbitControls(camera, renderer.domElement);
camera.position.z = camera_distance;

// Create all stars
for (let i = 0; i < star_count; i++) {
    let star = new Star({
        radius: star_size,
        x: Math.random() * randomStarPositionOffset,
        y: Math.random() * randomStarPositionOffset,
        z: -(i * distanceBetweenStars),
        scene: scene,
    });
    stars.push(star);
    star.append();
}

camera.lookAt(stars[0].mesh.position);
controls.update();

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