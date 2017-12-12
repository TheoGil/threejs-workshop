import '../css/reset.css';
import '../css/style.css';

import TweenMax from 'gsap';
import App from './App.js';

let app = new App({
    canvas: document.getElementById('scene'),
});
app.init();

document.getElementById('js-move-points').addEventListener('click', app.disperseParticules.bind(app));

// Those line make sure that we maintain a correct aspect ratio when resizing window
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);