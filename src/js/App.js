import * as THREE from 'three';
import 'three/OrbitControls';
import svgMesh3d from 'svg-mesh-3d';
import TweenMax from 'gsap';
import Star from './Star.js';

export default class App {
    constructor (options) {
        this.canvas = options.canvas;
        this.stars = [];
        this.currentStarIndex = null;
        this.starPositionMaxOffset = 1;
        this.distanceBetweenStars = 1;
        this.cameraDistanceFromTarget = 2;
        this.starSize = 0.01;
        this.isExploded = false;
    }

    init () {
        this.initScene();
        this.initStars();
        this.initLights();
        this.animate();
    }

    initScene () {
        // Set up the scene
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
        });
        renderer.setSize(window.innerWidth, window.innerHeight);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        //const controls = new THREE.OrbitControls(camera, renderer.domElement);
        camera.position.z = this.cameraDistanceFromTarget;

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        //this.controls = controls;
        this.cameraTarget = new THREE.Object3D();

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }, false);
    }

    initStars () {
        const svgPath = "M7 608L9 18l416 437-3-420h71v588L78 195v414z";
        const svgData = svgMesh3d(svgPath);
        const starCount = svgData.positions.length;

        for (let i = 0; i < starCount; i++) {
            let star = new Star({
                radius: this.starSize,
                x: svgData.positions[i][0],
                y: svgData.positions[i][1],
                z: svgData.positions[i][2],
                scene: this.scene,
                explodedPosition: new THREE.Vector3(
                    Math.random() * this.starPositionMaxOffset,
                    Math.random() * this.starPositionMaxOffset,
                    -(i * this.distanceBetweenStars)
                ),
            });
            this.stars.push(star);
            star.append();
        }

        this.stars[this.stars.length - 1].material.color.setHex(0xff0000);
    }

    initLights () {
        const lights = [];
        lights[0] = new THREE.PointLight(0xffffff, 1, 0);
        lights[1] = new THREE.PointLight(0xffffff, 1, 0);
        lights[2] = new THREE.PointLight(0xffffff, 1, 0);

        lights[0].position.set(0, 200, 0);
        lights[1].position.set(100, 200, 100);
        lights[2].position.set(-100, -200, -100);

        for (let i = 0; i < lights.length; i++) {
            this.scene.add(lights[i]);
        }
    }

    animate () {
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }

    focusOn (position, index, speed) {
        console.log(position);
        this.currentStarIndex = index;

        TweenMax.to(this.camera.position, speed, {
            x: position.x,
            y: position.y,
            z: position.z + .5,
            onUpdate: this.camera.lookAt(this.cameraTarget.position),
        });

        TweenMax.to(this.cameraTarget.position, speed * .5, {
            x: position.x,
            y: position.y,
            z: position.z
        });
    }

    nextStar () {
        if (this.currentStarIndex < this.stars.length - 1) {
            const newIndex = this.currentStarIndex + 1;
            const newStar = this.stars[newIndex];
            this.focusOn(newStar.mesh.position, newIndex, .5);
        }
    }

    previousStar () {
        if (this.currentStarIndex > 0) {
            const newIndex = this.currentStarIndex - 1;
            const newStar = this.stars[newIndex];
            this.focusOn(newStar.mesh.position, newIndex, .5);
        }
    }

    bigBang () {
        const index = this.stars.length - 1;
        const lastStar = this.stars[index];
        this.focusOn(lastStar.explodedPosition, index, 2);

        for (let i = 0; i < this.stars.length; i++) {
            TweenMax.to(this.stars[i].mesh.position, .5, {
                x: this.isExploded ? this.stars[i].originalPosition.x : this.stars[i].explodedPosition.x,
                y: this.isExploded ? this.stars[i].originalPosition.y : this.stars[i].explodedPosition.y,
                z: this.isExploded ? this.stars[i].originalPosition.z : this.stars[i].explodedPosition.z,
            });
        }

        this.isExploded = !this.isExploded;
    }
}