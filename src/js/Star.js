import * as THREE from 'three';

export default class Star {
    constructor (options) {
        this.scene = options.scene;
        this.geometry = new THREE.SphereGeometry(options.radius, 32, 32);
        this.material = new THREE.MeshBasicMaterial({
            color: 0x4793e3,
            transparent: true,
            blending: THREE.AdditiveBlending,
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