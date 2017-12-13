import * as THREE from 'three';
import 'three/OrbitControls';
import svgMesh3d from 'svg-mesh-3d';
import TweenMax from 'gsap';
import { EffectComposer, RenderPass, BokehPass } from "postprocessing";
import Star from './Star.js';
import TextureAnimator from './TextureAnimator.js';
import Vignette from './Vignette.js';
import texture from '../img/star_spritesheet_12x25.png';
import texture2 from '../img/particles_spritesheet_16x2.png';
import dat from 'dat.gui/build/dat.gui.js';

export default class App {
    constructor (options) {
        this.canvas = options.canvas;
        this.stars = [];
        this.currentStarIndex = null;
        this.starPositionMaxOffset = 3;
        this.distanceBetweenStars = 3;
        this.cameraDistanceFromTarget = 2;
        this.starSize = 1;
        this.particlesCount = 2000;
        this.particlesDensity = 2000;
        this.isExploded = false;
        this.postprocessing = {};
    }

    init () {
        this.initScene();
        this.initBackground();
        this.initStars();
        this.initLights();
        this.initAnimatedSprite();
        this.initParticles();
        this.initPostprocessing();
        this.animate();
    }

    initScene () {
        this.clock = new THREE.Clock();
        // Set up the scene
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            logarithmicDepthBuffer: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);

        scene.fog = new THREE.FogExp2(0x1f1f86, 0.08);

        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        camera.position.z = 5;

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.controls = controls;
        this.cameraTarget = new THREE.Object3D();

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
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
        });
        let lineGeometry = new THREE.Geometry();

        for (let i = 0; i < starCount; i++) {
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
            blending: THREE.AdditiveBlending
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
            vertex.z = (Math.random() * this.particlesDensity) - this.particlesDensity / 2;
            geometry.vertices.push(vertex);
        }
        const material = new THREE.PointsMaterial({
            size: 15,
            sizeAttenuation: true,
            map: texture,
            opacity: .5,
            color: 0xffffff,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        material.map.repeat.set(1 / 16, 1 / 2);
        material.color.setHSL(1.0, 0.3, 0.7);
        const particles = new THREE.Points(geometry, material);
        this.scene.add( particles );
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
        this.spriteAnimator.update(1000 * this.clock.getDelta());
        //this.renderer.render(this.scene, this.camera);
        this.composer.render();
    }

    focusOn (position, index, speed) {
        this.currentStarIndex = index;

        TweenMax.to(this.camera.position, speed, {
            x: position.x,
            y: position.y,
            z: position.z + this.cameraDistanceFromTarget,
            onUpdate: this.camera.lookAt(this.cameraTarget.position),
        });

        TweenMax.to(this.cameraTarget.position, speed * .5, {
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
            focus: 0.767,
            dof: 0,
            aperture: 0.0145,
            maxBlur: 0.1
        });
        bokehPass.renderToScreen = true;
        this.composer.addPass(bokehPass);




        ////////////////////////////////////////////////////

        const params = {
            "focus": bokehPass.bokehMaterial.uniforms.focus.value,
            "dof": bokehPass.bokehMaterial.uniforms.dof.value,
            "aperture": bokehPass.bokehMaterial.uniforms.aperture.value,
            "blur": bokehPass.bokehMaterial.uniforms.maxBlur.value
        };

        var gui = new dat.GUI();

        gui.add(params, "focus").min(0.0).max(1.0).step(0.001).onChange(function() {
            bokehPass.bokehMaterial.uniforms.focus.value = params.focus;
        });

        gui.add(params, "dof").min(0.0).max(1.0).step(0.001).onChange(function() {
            bokehPass.bokehMaterial.uniforms.dof.value = params.dof;
        });

        gui.add(params, "aperture").min(0.0).max(0.05).step(0.0001).onChange(function() {
            bokehPass.bokehMaterial.uniforms.aperture.value = params.aperture;
        });

        gui.add(params, "blur").min(0.0).max(0.1).step(0.001).onChange(function() {
            bokehPass.bokehMaterial.uniforms.maxBlur.value = params.blur;
        });
    }
}