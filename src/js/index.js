import '../css/reset.css';
import '../css/style.css';
import App from './App.js';

let app = new App({
    canvas: document.getElementById('scene'),
});
app.init();

document.getElementById('js-focus-on-prev').addEventListener('click', app.nextStar.bind(app));
document.getElementById('js-focus-on-next').addEventListener('click', app.previousStar.bind(app));

const nav = document.getElementById('js-nav');
const button = document.getElementById('js-button-launch');
button.addEventListener('click', function () {
    app.bigBang();
    TweenMax.to(button, 0.25, {
        css: {
            opacity: 0,
            y: 50,
        },
        ease: Expo.easeIn,
    });

    TweenMax.to(nav, 0.25, {
        css: {
            y: 0,
            opacity: 1,
        },
        ease: Expo.easeOut,
    });
});
