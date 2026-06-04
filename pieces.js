// pieces.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export async function createPieces(scene) {
    const loader = new GLTFLoader();
    const pieces = { attacker: null, target: null };

    // خامة القطع البيضاء (كوارتز شفاف كريستالي)
    const quartzMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, metalness: 0.1, roughness: 0.1,
        transmission: 0.9, thickness: 1.5, emissive: 0x111133
    });
    
    // خامة القطع السوداء (أونيكس مع عروق حمراء متوهجة)
    const onyxMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111, roughness: 0.2, metalness: 0.8, emissive: 0x550000, emissiveIntensity: 2
    });

    try {
        // 1. محاولة تحميل مجسم القطعة السوداء (knight.glb)
        const gltfBlack = await loader.loadAsync('./assets/knight.glb');
        pieces.attacker = gltfBlack.scene;
        pieces.attacker.traverse((child) => {
            if (child.isMesh) {
                child.material = onyxMaterial;
                child.castShadow = true;
            }
        });
        // ضبط الحجم والمكان
        pieces.attacker.position.set(0, 0, 5);
        pieces.attacker.scale.set(1.5, 1.5, 1.5);
        scene.add(pieces.attacker);

        // 2. محاولة تحميل مجسم القطعة البيضاء (pawn.glb)
        const gltfWhite = await loader.loadAsync('./assets/pawn.glb');
        pieces.target = gltfWhite.scene;
        pieces.target.traverse((child) => {
            if (child.isMesh) {
                child.material = quartzMaterial;
                child.castShadow = true;
            }
        });
        pieces.target.position.set(0, 0, -1);
        pieces.target.scale.set(1.5, 1.5, 1.5);
        scene.add(pieces.target);

    } catch (error) {
        // نظام الحماية: في حال عدم وجود الملفات في مجلد assets، سيتم رسم الأسطوانات
        console.warn("لم يتم العثور على ملفات 3D في مجلد assets. سيتم استخدام الأشكال المؤقتة.", error);
        
        pieces.attacker = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1, 3, 32), onyxMaterial);
        pieces.attacker.position.set(0, 1.5, 5);
        pieces.attacker.castShadow = true;
        scene.add(pieces.attacker);

        pieces.target = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, 2, 32), quartzMaterial);
        pieces.target.position.set(0, 1, -1);
        pieces.target.castShadow = true;
        scene.add(pieces.target);
    }

    return pieces;
}
