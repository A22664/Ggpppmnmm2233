// pieces.js
import * as THREE from 'three';

export function createPieces(scene) {
    // خامة القطع البيضاء (كوارتز شفاف)
    const quartzMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, metalness: 0.1, roughness: 0.1,
        transmission: 0.9, thickness: 1.5, emissive: 0x111133
    });
    
    // خامة القطع السوداء (أونيكس بعروق متوهجة)
    const onyxMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111, roughness: 0.2, metalness: 0.8, emissive: 0x550000, emissiveIntensity: 2
    });

    // إنشاء قطعة سوداء (مهاجم)
    const blackPiece = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1, 3, 32), onyxMaterial);
    blackPiece.position.set(0, 1.5, 5);
    blackPiece.castShadow = true;
    scene.add(blackPiece);

    // إنشاء قطعة بيضاء (ضحية)
    const whitePiece = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, 2, 32), quartzMaterial);
    whitePiece.position.set(0, 1, -1);
    whitePiece.castShadow = true;
    scene.add(whitePiece);

    return { attacker: blackPiece, target: whitePiece };
}
