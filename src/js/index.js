import '../css/reset.css';
import '../css/style.css';

import * as THREE from 'three';
import TweenMax from 'gsap';
import 'three/OrbitControls';
import svgMesh3d from 'svg-mesh-3d';
import Star from './Star.js';

const svgPath = "M7 608L9 18l416 437-3-420h71v588L78 195v414z";
const svgData = svgMesh3d(svgPath);

const stars = [];
const star_size = 0.01;
const star_count = svgData.positions.length;
const camera_distance = 2;
const starPositionMaxOffset = 1;
const distanceBetweenStars = 1;
let isExploded = false;

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
        explodedPosition: new THREE.Vector3(
            Math.random() * starPositionMaxOffset,
            Math.random() * starPositionMaxOffset,
            -(i * distanceBetweenStars)
        ),
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

document.getElementById('js-move-points').addEventListener('click', () => {
    for (let i = 0; i < star_count; i++) {
        TweenMax.to(stars[i].mesh.position, .5, {
            x: isExploded ? stars[i].originalPosition.x : stars[i].explodedPosition.x,
            y: isExploded ? stars[i].originalPosition.y : stars[i].explodedPosition.y,
            z: isExploded ? stars[i].originalPosition.z : stars[i].explodedPosition.z,
        });
    }
    isExploded = !isExploded;
}, false);

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