import frag from '../shader.frag';
import vert from '../shader.vert';

export default class Vignette {
    constructor (opt) {
        opt = opt || {};
        this.geometry = opt.geometry || new THREE.PlaneGeometry(2, 2, 1);
        this.material = new THREE.RawShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            side: THREE.DoubleSide,
            uniforms: {
                aspectCorrection: { type: 'i', value: false },
                aspect: { type: 'f', value: 1 },
                grainScale: { type: 'f', value: 0.005 },
                grainTime: { type: 'f', value: 0 },
                noiseAlpha: { type: 'f', value: 0.25 },
                offset: { type: 'v2', value: new THREE.Vector2(0, 0) },
                scale: { type: 'v2', value: new THREE.Vector2(1, 1) },
                smooth: { type: 'v2', value: new THREE.Vector2(0.0, 1.0) },
                color1: { type: 'c', value: new THREE.Color('#fff') },
                color2: { type: 'c', value: new THREE.Color('#283844') }
            },
            depthTest: false
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.frustumCulled = false;
        //this.mesh.style = style;
        //if (opt) mesh.style(opt);
    }

    style (opt) {
        opt = opt || {}
        if (Array.isArray(opt.colors)) {
            var colors = opt.colors.map(function (c) {
                if (typeof c === 'string' || typeof c === 'number') {
                    return new THREE.Color(c)
                }
                return c
            })
            this.material.uniforms.color1.value.copy(colors[0])
            this.material.uniforms.color2.value.copy(colors[1])
        }
        if (typeof opt.aspect === 'number') {
            this.material.uniforms.aspect.value = opt.aspect
        }
        if (typeof opt.grainScale === 'number') {
            this.material.uniforms.grainScale.value = opt.grainScale
        }
        if (typeof opt.grainTime === 'number') {
            this.material.uniforms.grainTime.value = opt.grainTime
        }
        if (opt.smooth) {
            var smooth = this.fromArray(opt.smooth, THREE.Vector2)
            this.material.uniforms.smooth.value.copy(smooth)
        }
        if (opt.offset) {
            var offset = this.fromArray(opt.offset, THREE.Vector2)
            this.material.uniforms.offset.value.copy(offset)
        }
        if (typeof opt.noiseAlpha === 'number') {
            this.material.uniforms.noiseAlpha.value = opt.noiseAlpha
        }
        if (typeof opt.scale !== 'undefined') {
            var scale = opt.scale
            if (typeof scale === 'number') {
                scale = [ scale, scale ]
            }
            scale = this.fromArray(scale, THREE.Vector2)
            this.material.uniforms.scale.value.copy(scale)
        }
        if (typeof opt.aspectCorrection !== 'undefined') {
            this.material.uniforms.aspectCorrection.value = Boolean(opt.aspectCorrection)
        }
    }

    fromArray (array, VectorType) {
        if (Array.isArray(array)) {
            return new VectorType().fromArray(array)
        }
        return array
    }
}