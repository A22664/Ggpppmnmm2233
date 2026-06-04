// main.js
import * as THREE from 'three';
import { GameState } from './gameLogic.js';
import { initScene, createBoard } from './sceneSetup.js';
import { createPieces } from './pieces.js';
import { setupPostProcessing, createShatterEffect } from './cinematics.js';

// 1. التهيئة الأساسية
const gameState = new GameState();
const { scene, camera, renderer } = initScene();
const composer = setupPostProcessing(scene, camera, renderer);

// 2. بناء العالم
createBoard(scene);
const { attacker, target } = createPieces(scene);

let activeParticles = null;
const clock = new THREE.Clock();

// 3. محاكاة الحركة السينمائية
function executeCinematicCapture() {
    const targetX = target.position.x;
    const targetZ = target.position.z;

    // حركة الكاميرا (تصوير بطيء ودرامي)
    gsap.to(camera.position, {
        x: targetX + 5, y: 5, z: targetZ + 5, duration: 2, ease: "power2.inOut",
        onUpdate: () => camera.lookAt(targetX, 1, targetZ)
    });

    // حركة القطعة
    gsap.to(attacker.position, {
        x: targetX, z: targetZ, duration: 2, ease: "power3.in",
        onComplete: () => {
            // تدمير الهدف
            target.visible = false;
            activeParticles = createShatterEffect(scene, targetX, targetZ);
            
            // تحديث حالة اللعبة (تغيير الدور)
            gameState.switchTurn();

            // إعادة الكاميرا
            gsap.to(camera.position, { 
                x: 0, y: 15, z: 20, duration: 3, delay: 1, ease: "power2.out",
                onUpdate: () => camera.lookAt(0, 0, 0)
            });
        }
    });
}

// ربط الزر بالحدث
document.getElementById('action-btn').addEventListener('click', () => {
    executeCinematicCapture();
});

// 4. حلقة التحديث (Animation Loop)
function animate() {
    requestAnimationFrame(animate);

    // تحديث فيزياء الانفجار إذا كان موجوداً
    if (activeParticles && scene.children.includes(activeParticles)) {
        const positions = activeParticles.geometry.attributes.position.array;
        const vels = activeParticles.userData.velocities;
        const dt = clock.getDelta();

        for (let i = 0; i < vels.length; i++) {
            positions[i * 3] += vels[i].x * dt;
            positions[i * 3 + 1] += vels[i].y * dt;
            positions[i * 3 + 2] += vels[i].z * dt;
            vels[i].y -= 9.8 * dt; // تطبيق الجاذبية
        }
        activeParticles.geometry.attributes.position.needsUpdate = true;
    } else {
        clock.getDelta(); // مزامنة التوقيت
    }

    composer.render();
}
animate();

// 5. تجاوب حجم الشاشة
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});
