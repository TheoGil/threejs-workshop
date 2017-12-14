import * as THREE from 'three';

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
        this.material = new THREE.MeshPhongMaterial( {
            color: 0xffffff,
            emissive: 0x072534,
            side: THREE.DoubleSide,
            shading: THREE.FlatShading
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.set(options.x, options.y, options.z);
        this.originalPosition = this.mesh.position.clone();
        this.explodedPosition = options.explodedPosition;
    }

    append () {
        this.scene.add(this.mesh);
    }
}