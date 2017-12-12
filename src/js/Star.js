import * as THREE from 'three';

export default class Star {
    constructor (options) {
        this.scene = options.scene;
        this.geometry = new THREE.SphereGeometry(options.radius, 32, 32);
        this.material = new THREE.MeshLambertMaterial({
            color: 0xC238B5
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(options.x, options.y, options.z);
    }

    append () {
        this.scene.add(this.mesh);
    }
}