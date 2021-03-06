import * as THREE from 'three';
import svgMesh3d from 'svg-mesh-3d';
import TweenMax from 'gsap';
import { EffectComposer, RenderPass, BokehPass, FilmPass } from "postprocessing";
import Star from './Star.js';
import TextureAnimator from './TextureAnimator.js';
import Vignette from './Vignette.js';
import texture from '../img/star_spritesheet_12x25.png';
import texture2 from '../img/particles_spritesheet_16x2.png';
import dat from 'dat.gui/build/dat.gui.js';
import throttle from 'throttle-debounce/throttle.js';

export default class App {
    constructor (options) {
        this.canvas = options.canvas;
        this.stars = [];
        this.currentStarIndex = null;
        this.starPositionMaxOffset = 1;
        this.distanceBetweenStars = 3;
        this.cameraDistanceFromTarget = 2;
        this.starSize = 1;
        this.particlesCount = 1000;
        this.particlesDensity = 1000;
        this.isExploded = false;
        this.postprocessing = {};
    }

    init () {
        this.initScene();
        //this.initBackground();
        this.initStars();
        this.initLights();
        this.initAnimatedSprite();
        this.initParticles();
        this.initPostprocessing();
        this.animate();
        this.attachScroll();
    }

    initScene () {
        this.clock = new THREE.Clock();
        this.mouseX = 0;
        this.mouseY = 0;
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;

        // Set up the scene
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);

        scene.fog = new THREE.FogExp2(0x1f1f86, 0.08);

        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
        camera.position.z = 5;

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.cameraTarget = new THREE.Object3D();

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.windowHalfX = window.innerWidth / 2;
            this.windowHalfY = window.innerHeight / 2;
        }, false);

        window.addEventListener('mousemove', () => {
            this.mouseX = event.clientX - this.windowHalfX;
            this.mouseY = event.clientY - this.windowHalfY;
        }, false);
    }

    initBackground () {
        const vignette = new Vignette();
        const width = window.innerWidth;
        const height = window.innerHeight;
        vignette.style({
            aspect: width / height,
            aspectCorrection: true,
            //scale: 1.5,
            //offset: [-0.2, 0.25],
            // ensure even grain scale based on width/height
            grainScale: 1.5 / Math.min(width, height),
            colors: [0x1f1f86, 0x20203e]
        });
        this.scene.add(vignette.mesh);
    }

    initStars () {
        const svgPath = "M7 608L9 18l416 437-3-420h71v588L78 195v414z";
        const svgData = svgMesh3d(svgPath);
        const starCount = svgData.positions.length;

        const texture = new THREE.TextureLoader().load(texture2);

        let lineMaterial = new THREE.LineBasicMaterial({
            color: 0x4793e3,
            transparent: true,
            opacity: 0,
            //blending: THREE.AdditiveBlending,
        });
        let lineGeometry = new THREE.Geometry();

        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
        });
        const geometry = new THREE.SphereGeometry(0.025, 32, 32);

        for (let i = 0; i < svgData.positions.length; i++) {
            const explodedPosition = new THREE.Vector3(
                Math.random() * this.starPositionMaxOffset,
                Math.random() * this.starPositionMaxOffset,
                -(i * this.distanceBetweenStars)
            );

            let star = new Star({
                radius: this.starSize,
                x: svgData.positions[i][0],
                y: svgData.positions[i][1],
                z: svgData.positions[i][2],
                scene: this.scene,
                explodedPosition: explodedPosition,
                texture: texture,
                id: i,
                material: material,
                geometry: geometry,
            });

            lineGeometry.vertices.push(explodedPosition);

            this.stars.push(star);
            star.append();
        }

        this.line = new THREE.Line(lineGeometry, lineMaterial);
        this.scene.add(this.line);
    }

    initAnimatedSprite () {
        const spritesheet = new THREE.TextureLoader().load(texture);
        const material = new THREE.SpriteMaterial({
            size: 0.1,
            map: spritesheet,
            transparent: true,
            opacity: 0,
            //blending: THREE.AdditiveBlending
        });
        this.animatedSprite = new THREE.Sprite(material);
        this.animatedSprite.scale.set(.5, .5, .5);
        this.spriteAnimator = new TextureAnimator(spritesheet, 25, 12, 300, 120, this.animatedSprite); // texture, #horiz, #vert, #total, duration
        this.scene.add(this.animatedSprite);
    }

    initParticles () {
        const geometry = new THREE.Geometry();
        const texture = new THREE.TextureLoader().load(texture2);
        for (let i = 0; i < this.particlesCount; i ++ ) {
            const vertex = new THREE.Vector3();
            vertex.x = (Math.random() * this.particlesDensity) - this.particlesDensity / 2;
            vertex.y = (Math.random() * this.particlesDensity) - this.particlesDensity / 2;
            vertex.z = -(Math.random() * this.particlesDensity);
            geometry.vertices.push(vertex);
        }
        const material = new THREE.PointsMaterial({
            size: 15,
            sizeAttenuation: true,
            map: texture,
            opacity: .5,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        material.map.repeat.set(1 / 16, 1 / 2);
        material.color.setHSL(1.0, 0.3, 0.7);
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
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

        //this.spriteAnimator.update(1000 * this.clock.getDelta());
        //this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.00001;
        //this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.00001;
        //this.camera.lookAt(this.cameraTarget.position);

        // this.renderer.render(this.scene, this.camera);
        this.composer.render(1000 * this.clock.getDelta());
    }

    focusOn (position, index, speed) {
        // Unfocus previous
        const previous = this.stars[this.currentStarIndex];
        if (previous) {
            previous.hide();
        }

        this.currentStarIndex = index;


        this.stars[this.currentStarIndex].show();

        TweenMax.to(this.camera.position, speed, {
            x: position.x,
            y: position.y,
            z: position.z + this.cameraDistanceFromTarget,
            //onUpdate: this.camera.lookAt(this.cameraTarget.position),
        });

        TweenMax.to(this.cameraTarget.position, speed, {
            x: position.x,
            y: position.y,
            z: position.z
        });

        TweenMax.to(this.animatedSprite.material, .25, {
            opacity: 0,
            onComplete: function () {
                this.animatedSprite.position.set(position.x, position.y, position.z + 0.01);

                TweenMax.to(this.animatedSprite.material, .25, {
                    opacity: 1,
                });
            }.bind(this)
        });
    }

    nextStar () {
        if (this.currentStarIndex < this.stars.length - 1) {
            const newIndex = this.currentStarIndex + 1;
            const newStar = this.stars[newIndex];
            this.focusOn(newStar.mesh.position, newIndex, 1);
        }
    }

    previousStar () {
        if (this.currentStarIndex > 0) {
            const newIndex = this.currentStarIndex - 1;
            const newStar = this.stars[newIndex];
            this.focusOn(newStar.mesh.position, newIndex, 1);
        }
    }

    bigBang () {
        const index = this.stars.length - 1;
        const lastStar = this.stars[index];
        this.animatedSprite.position.set(lastStar.explodedPosition.x, lastStar.explodedPosition.y, lastStar.explodedPosition.z + 0.01);
        this.focusOn(lastStar.explodedPosition, index, 2);

        for (let i = 0; i < this.stars.length; i++) {
            TweenMax.to(this.stars[i].mesh.position, .5, {
                x: this.isExploded ? this.stars[i].originalPosition.x : this.stars[i].explodedPosition.x,
                y: this.isExploded ? this.stars[i].originalPosition.y : this.stars[i].explodedPosition.y,
                z: this.isExploded ? this.stars[i].originalPosition.z : this.stars[i].explodedPosition.z,
            });
        }

        TweenMax.to(this.line.material, .5, {
            opacity: 1,
        });

        this.isExploded = !this.isExploded;
    }

    initPostprocessing() {
        this.composer = new EffectComposer(this.renderer, {
            stencilBuffer: true,
            depthTexture: true
        });
        this.composer.addPass(new RenderPass(this.scene, this.camera));

        const bokehPass = new BokehPass(this.camera, {
            focus: 0.32,
            dof: 0.6,
            aperture: 0.0394,
            maxBlur: 0.025
        });
        bokehPass.renderToScreen = false;
        this.composer.addPass(bokehPass);

        const filmPass = new FilmPass({
            grayscale: false,
            sepia: false,
            vignette: true,
            eskil: true,
            scanlines: false,
            noise: true,
            noiseIntensity: 0.5,
            scanlineIntensity: 0.5,
            scanlineDensity: 1.5,
            greyscaleIntensity: 1.0,
            sepiaIntensity: 0.5,
            vignetteOffset: 1.0,
            vignetteDarkness: 1.0
        });
        filmPass.renderToScreen = true;
        this.composer.addPass(filmPass);

        const gui = new dat.GUI();

        const params = {
            "focus": bokehPass.bokehMaterial.uniforms.focus.value,
            "dof": bokehPass.bokehMaterial.uniforms.dof.value,
            "aperture": bokehPass.bokehMaterial.uniforms.aperture.value,
            "blur": bokehPass.bokehMaterial.uniforms.maxBlur.value,
            "noise intensity": filmPass.material.uniforms.noiseIntensity.value,
        };

        let doFolder = gui.addFolder("DOF");
        doFolder.add(params, "focus").min(0.0).max(1.0).step(0.001).onChange(function() {
            bokehPass.bokehMaterial.uniforms.focus.value = params.focus;
        });
        doFolder.add(params, "dof").min(0.0).max(1.0).step(0.001).onChange(function() {
            bokehPass.bokehMaterial.uniforms.dof.value = params.dof;
        });
        doFolder.add(params, "aperture").min(0.0).max(0.05).step(0.0001).onChange(function() {
            bokehPass.bokehMaterial.uniforms.aperture.value = params.aperture;
        });
        doFolder.add(params, "blur").min(0.0).max(0.1).step(0.001).onChange(function() {
            bokehPass.bokehMaterial.uniforms.maxBlur.value = params.blur;
        });
        doFolder.open();

        let noiseFolder = gui.addFolder("Noise");
        noiseFolder.add(params, "noise intensity").min(0.0).max(1.0).step(0.01).onChange(function() {
            filmPass.material.uniforms.noiseIntensity.value = params["noise intensity"];
        });
        noiseFolder.open();

        gui.closed = true;
    }

    attachScroll () {
        window.addEventListener('wheel', throttle(150, function (e) {
            if (Math.abs(e.deltaY) > 100) {
                if (e.deltaY > 0) {
                    if (this.isExploded) {
                        this.previousStar();
                    } else {
                        this.bigBang();
                    }
                } else {
                    if (this.isExploded) {
                        this.nextStar();
                    }
                }
            }
        }.bind(this)));
    }
}