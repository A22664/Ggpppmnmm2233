// cinematics.js
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

export function setupPostProcessing(scene, camera, renderer) {
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0.2;
    bloomPass.strength = 1.2;
    bloomPass.radius = 0.5;

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    return composer;
}

export function createShatterEffect(scene, x, z) {
    const particleCount = 300;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = x + (Math.random() - 0.5);
        positions[i * 3 + 1] = 1 + (Math.random() - 0.5);
        positions[i * 3 + 2] = z + (Math.random() - 0.5);

        velocities.push({
            x: (Math.random() - 0.5) * 10,
            y: (Math.random() * 10) + 5,
            z: (Math.random() - 0.5) * 10
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
        color: 0xffffff, size: 0.15, transparent: true, opacity: 1,
        blending: THREE.AdditiveBlending, depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    particles.userData = { velocities: velocities };
    scene.add(particles);

    // إخفاء الجزيئات تدريجياً وإزالتها
    gsap.to(material, { opacity: 0, duration: 2, delay: 0.5, onComplete: () => scene.remove(particles) });
    
    return particles;
}
