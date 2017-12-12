import '../css/reset.css';
import '../css/style.css';

import * as THREE from 'three';
import 'three/OrbitControls';
import svgMesh3d from 'svg-mesh-3d';
import Star from './Star.js';

const svgPath = "M.5 41.4L.6 1.3 28.9 31l-.2-28.6h4.8v40L5.3 13.3v28.2z";
const svgData = svgMesh3d(svgPath);

const stars = [];
const star_size = 0.02;
const star_count = svgData.positions.length;
const camera_distance = 2;

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
        x: svgData.positions[i][0],
        y: svgData.positions[i][1],
        z: svgData.positions[i][2],
        scene: scene,
    });
    stars.push(star);
    star.append();
}

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