import * as THREE from 'three';
import TweenMax from 'gsap';

export default class Star {
    constructor (options) {
        this.tilesHorizontal = 16;
        this.tilesVertical = 2;

        this.scene = options.scene;

        /*
        this.material = new THREE.SpriteMaterial({
            transparent: true,
            map: options.texture,
            opacity: 1,
            color: 0xffffff,
            blending: THREE.AdditiveBlending
        });
        this.material.map.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical);
        this.mesh = new THREE.Sprite(this.material);
        this.mesh.scale.set(.2, .2, .2);
        */
        this.geometry = new THREE.SphereGeometry(0.025, 32, 32);
        this.material = new THREE.MeshBasicMaterial( {
            color: 0xffffff,
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.set(options.x, options.y, options.z);
        this.originalPosition = this.mesh.position.clone();
        this.explodedPosition = options.explodedPosition;

        this.animationDelay = 0.15;

        this.appendHtml(options.id);
    }

    append () {
        this.scene.add(this.mesh);
    }

    appendHtml (id) {
        var t = document.getElementById("js-template");
        t.content.querySelector('.js-project-id').textContent = id;
        const article = document.createElement("ol");
        article.id = id;
        article.classList.add('timeline-item');
        const clone =  document.importNode(t.content, true);
        article.appendChild(clone);
        document.getElementById('js-timeline').appendChild(article);

        this.html = article;
    }

    show () {
        // N° projet
        console.log(Expo.easeOut);

        TweenMax.to(this.html.getElementsByClassName('timeline-item-director')[0], 0.25, {
            delay: this.animationDelay * 4,
            css: {
                y: 0,
                opacity: 1,
                force3D: true
            },
            ease: Expo.easeOut,
        });

        // Titre
        console.log(this.html.getElementsByClassName('timeline-item-title'));
        TweenMax.to(this.html.getElementsByClassName('timeline-item-title')[0], 0.25, {
            delay: this.animationDelay * 5,
            css: {
                y: 0,
                opacity: 1,
                force3D: true
            },
            ease: Expo.easeOut,
        });

        // Description
        TweenMax.to(this.html.getElementsByClassName('timeline-item-description')[0], 0.25, {
            delay: this.animationDelay * 6,
            css: {
                y: 0,
                opacity: 1,
                force3D: true
            },
            ease: Expo.easeOut,
        });

        // Lien
        TweenMax.to(this.html.getElementsByClassName('timeline-item-link')[0], 0.25, {
            delay: this.animationDelay * 7,
            css: {
                y: 0,
                opacity: 1,
                force3D: true
            },
            ease: Expo.easeOut,
        });
    }

    hide () {
        // N°
        TweenMax.to(this.html.getElementsByClassName('timeline-item-director')[0], 0.25, {
            css: {
                y: -50,
                opacity: 0,
                force3D: true
            },
            ease: Expo.easeIn,
        });

        // Titre
        TweenMax.to(this.html.getElementsByClassName('timeline-item-title')[0], 0.25, {
            delay: this.animationDelay,
            css: {
                y: -50,
                opacity: 0,
                
            },
            ease: Expo.easeIn,
        });

        // Description
        TweenMax.to(this.html.getElementsByClassName('timeline-item-description')[0], 0.25, {
            delay: this.animationDelay * 2,
            css: {
                y: -50,
                opacity: 0,
                force3D: true
            },
            ease: Expo.easeIn,
        });

        // Lien
        TweenMax.to(this.html.getElementsByClassName('timeline-item-link')[0], 0.25, {
            delay: this.animationDelay * 3,
            css: {
                y: -50,
                opacity: 0,
                force3D: true
            },
            ease: Expo.easeIn,
        });
    }
}