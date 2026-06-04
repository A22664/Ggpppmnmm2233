// main.js
import * as THREE from 'three';
import { GameState } from './gameLogic.js';
import { initScene, createBoard } from './sceneSetup.js';
import { setupFullBoard } from './pieces.js';
import { setupPostProcessing, createShatterEffect } from './cinematics.js';

// --- 1. التهيئة الأساسية والمؤثرات الصوتية ---
const gameState = new GameState();
const { scene, camera, renderer } = initScene();
const composer = setupPostProcessing(scene, camera, renderer);

// إضافة أصوات الشطرنج
const moveSound = new Audio('https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-self.mp3');
const captureSound = new Audio('https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/capture.mp3');

// إعداد الرقعة والقطع
createBoard(scene);
const piecesMap = setupFullBoard(scene); 

// تعديل الكاميرا لنظرة اللاعب
camera.position.set(0, 15, -15);
camera.lookAt(0, 0, 0);

// --- 2. نظام التفاعل (النقر بالماوس) ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedSquare = null;

// تحويل إحداثيات الشطرنج (مثل e2) إلى موقع 3D (x, z)
function getSquarePosition(square) {
    const file = square.charCodeAt(0) - 97; // a=0, h=7
    const rank = parseInt(square[1]) - 1;   // 1=0, 8=7
    return { x: file * 2 - 7, z: rank * 2 - 7 };
}

window.addEventListener('pointerdown', (event) => {
    // تحويل إحداثيات الشاشة إلى إحداثيات Three.js
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    
    // فحص ما إذا نقرنا على الرقعة (لحساب المربع)
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersectPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersectPoint);

    if (intersectPoint) {
        // تحديد المربع الذي تم النقر عليه
        let col = Math.round((intersectPoint.x + 7) / 2);
        let row = Math.round((intersectPoint.z + 7) / 2);
        
        if (col >= 0 && col <= 7 && row >= 0 && row <= 7) {
            const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
            const clickedSquare = files[col] + (row + 1);
            handleSquareClick(clickedSquare);
        }
    }
});

let activeParticles = null;

function handleSquareClick(square) {
    // إذا لم نكن قد حددنا قطعة بعد
    if (!selectedSquare) {
        const piece = piecesMap.get(square);
        if (piece && piece.userData.color === gameState.chess.turn()) {
            selectedSquare = square;
            // رفع القطعة قليلاً لتبدو "محددة"
            gsap.to(piece.position, { y: 1.5, duration: 0.2 });
        }
    } else {
        // إذا كنا قد حددنا قطعة ونقرنا على مربع جديد للتحرك
        const source = selectedSquare;
        const target = square;
        
        // التحقق من صحة الحركة برمجياً
        const move = gameState.attemptMove(source, target);

        const piece = piecesMap.get(source);
        
        if (move) {
            // --- الحركة قانونية وصحيحة ---
            const targetPos = getSquarePosition(target);
            const isCapture = move.flags.includes('c') || move.flags.includes('e');

            // تحريك القطعة
            gsap.to(piece.position, {
                x: targetPos.x, y: 0, z: targetPos.z, duration: 0.6, ease: "power2.out",
                onComplete: () => {
                    if (isCapture) {
                        captureSound.play();
                        const capturedPiece = piecesMap.get(target);
                        if (capturedPiece) {
                            capturedPiece.visible = false;
                            activeParticles = createShatterEffect(scene, targetPos.x, targetPos.z);
                            piecesMap.delete(target);
                        }
                    } else {
                        moveSound.play();
                    }
                }
            });

            // تحديث بيانات القطعة
            piece.userData.square = target;
            piecesMap.delete(source);
            piecesMap.set(target, piece);
            
            // (ملاحظة: لمعالجة التبييت Castling يجب تحريك القلعة برمجياً أيضاً، أزلناها هنا للتبسيط البصري)
            
        } else {
            // --- الحركة خاطئة ---
            // إعادة القطعة إلى الأرض
            gsap.to(piece.position, { y: 0, duration: 0.2 });
        }

        selectedSquare = null;
    }
}

// --- 3. حلقة التحديث (Animation Loop) ---
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);

    if (activeParticles && scene.children.includes(activeParticles)) {
        const positions = activeParticles.geometry.attributes.position.array;
        const vels = activeParticles.userData.velocities;
        const dt = clock.getDelta();

        for (let i = 0; i < vels.length; i++) {
            positions[i * 3] += vels[i].x * dt;
            positions[i * 3 + 1] += vels[i].y * dt;
            positions[i * 3 + 2] += vels[i].z * dt;
            vels[i].y -= 9.8 * dt;
        }
        activeParticles.geometry.attributes.position.needsUpdate = true;
    } else {
        clock.getDelta();
    }

    composer.render();
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});
