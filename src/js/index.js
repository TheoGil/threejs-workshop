import '../css/reset.css';
import '../css/style.css';
import App from './App.js';

let app = new App({
    canvas: document.getElementById('scene'),
});
app.init();

document.getElementById('js-focus-on-prev').addEventListener('click', app.nextStar.bind(app));
document.getElementById('js-focus-on-next').addEventListener('click', app.previousStar.bind(app));