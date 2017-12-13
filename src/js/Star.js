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
        const geometry = new THREE.SphereGeometry(0.025, 32, 32);
        const material = new THREE.MeshBasicMaterial( {
            color: 0xffffff,
        });
        this.mesh = new THREE.Mesh( geometry, material );

        this.mesh.position.set(options.x, options.y, options.z);
        this.originalPosition = this.mesh.position.clone();
        this.explodedPosition = options.explodedPosition;
    }

    append () {
        this.scene.add(this.mesh);
    }
}