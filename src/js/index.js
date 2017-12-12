import '../css/reset.css';
import '../css/style.css';

import * as THREE from 'three';
import 'three/OrbitControls';

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