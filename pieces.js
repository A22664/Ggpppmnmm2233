// أضف هذه الدالة في نهاية ملف pieces.js
export function setupFullBoard(scene) {
    const piecesMap = new Map(); // خريطة لتتبع القطع حسب المربع
    const tileSize = 2;

    const quartzMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.1, transmission: 0.9, thickness: 1.5, emissive: 0x111133 });
    const onyxMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2, metalness: 0.8, emissive: 0x550000, emissiveIntensity: 2 });

    const backRowOrder = [buildRook, buildKnight, buildBishop, buildQueen, buildKing, buildBishop, buildKnight, buildRook];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    for (let col = 0; col < 8; col++) {
        const xPos = col * tileSize - 7;
        const file = files[col];

        // 1. بيادق بيضاء (الصف 2)
        const whitePawn = buildPawn(quartzMaterial);
        whitePawn.position.set(xPos, 0, 1 * tileSize - 7);
        whitePawn.userData = { square: file + '2', color: 'w' };
        scene.add(whitePawn); piecesMap.set(file + '2', whitePawn);

        // 2. بيادق سوداء (الصف 7)
        const blackPawn = buildPawn(onyxMaterial);
        blackPawn.position.set(xPos, 0, 6 * tileSize - 7);
        blackPawn.userData = { square: file + '7', color: 'b' };
        scene.add(blackPawn); piecesMap.set(file + '7', blackPawn);

        // 3. قطع بيضاء رئيسية (الصف 1)
        const whitePiece = backRowOrder[col](quartzMaterial);
        whitePiece.position.set(xPos, 0, 0 * tileSize - 7);
        if(col === 1 || col === 6) whitePiece.rotation.y = Math.PI; 
        whitePiece.userData = { square: file + '1', color: 'w' };
        scene.add(whitePiece); piecesMap.set(file + '1', whitePiece);

        // 4. قطع سوداء رئيسية (الصف 8)
        const blackPiece = backRowOrder[col](onyxMaterial);
        blackPiece.position.set(xPos, 0, 7 * tileSize - 7);
        blackPiece.userData = { square: file + '8', color: 'b' };
        scene.add(blackPiece); piecesMap.set(file + '8', blackPiece);
    }

    return piecesMap; // نرجع الخريطة ليسهل البحث عن القطع
}
