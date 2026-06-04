import * as THREE from 'three';

// دوال النحت
function buildPawn(material) {
    const group = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.8, 0.3, 32), material);
    base.position.y = 0.15; base.castShadow = true; group.add(base);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.6, 1.2, 32), material);
    body.position.y = 0.9; body.castShadow = true; group.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), material);
    head.position.y = 1.7; head.castShadow = true; group.add(head);
    return group;
}

function buildRook(material) {
    const group = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.9, 0.4, 32), material);
    base.position.y = 0.2; base.castShadow = true; group.add(base);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.7, 1.5, 32), material);
    body.position.y = 1.15; body.castShadow = true; group.add(body);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.6, 0.4, 8), material);
    top.position.y = 2.1; top.castShadow = true; group.add(top);
    return group;
}

function buildKnight(material) {
    const group = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.8, 0.3, 32), material);
    base.position.y = 0.15; base.castShadow = true; group.add(base);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 1.5, 32), material);
    body.position.set(0, 1.0, -0.1); body.rotation.x = -0.1; body.castShadow = true; group.add(body);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 1.2), material);
    head.position.set(0, 1.8, 0.2); head.rotation.x = -Math.PI / 6; head.castShadow = true; group.add(head);
    return group;
}

function buildBishop(material) {
    const group = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.8, 0.3, 32), material);
    base.position.y = 0.15; base.castShadow = true; group.add(base);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.6, 1.8, 32), material);
    body.position.y = 1.2; body.castShadow = true; group.add(body);
    const head = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.8, 32), material);
    head.position.y = 2.4; head.castShadow = true; group.add(head);
    return group;
}

function buildQueen(material) {
    const group = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.9, 0.3, 32), material);
    base.position.y = 0.15; base.castShadow = true; group.add(base);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.7, 2.2, 32), material);
    body.position.y = 1.4; body.castShadow = true; group.add(body);
    const crown = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.1, 16, 32), material);
    crown.position.y = 2.6; crown.rotation.x = Math.PI / 2; crown.castShadow = true; group.add(crown);
    const topSphere = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), material);
    topSphere.position.y = 2.8; topSphere.castShadow = true; group.add(topSphere);
    return group;
}

function buildKing(material) {
    const group = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.9, 0.3, 32), material);
    base.position.y = 0.15; base.castShadow = true; group.add(base);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.7, 2.4, 32), material);
    body.position.y = 1.5; body.castShadow = true; group.add(body);
    const crossVert = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.6, 0.1), material);
    crossVert.position.y = 3.0; crossVert.castShadow = true; group.add(crossVert);
    const crossHoriz = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.1), material);
    crossHoriz.position.y = 3.0; crossHoriz.castShadow = true; group.add(crossHoriz);
    return group;
}

export function setupFullBoard(scene) {
    const piecesMap = new Map();
    const tileSize = 2;

    const quartzMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.1, transmission: 0.9, thickness: 1.5, emissive: 0x111133 });
    const onyxMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2, metalness: 0.8, emissive: 0x550000, emissiveIntensity: 2 });

    const backRowOrder = [buildRook, buildKnight, buildBishop, buildQueen, buildKing, buildBishop, buildKnight, buildRook];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    for (let col = 0; col < 8; col++) {
        const xPos = col * tileSize - 7;
        const file = files[col];

        const whitePawn = buildPawn(quartzMaterial);
        whitePawn.position.set(xPos, 0, 1 * tileSize - 7);
        whitePawn.userData = { square: file + '2', color: 'w' };
        scene.add(whitePawn); piecesMap.set(file + '2', whitePawn);

        const blackPawn = buildPawn(onyxMaterial);
        blackPawn.position.set(xPos, 0, 6 * tileSize - 7);
        blackPawn.userData = { square: file + '7', color: 'b' };
        scene.add(blackPawn); piecesMap.set(file + '7', blackPawn);

        const whitePiece = backRowOrder[col](quartzMaterial);
        whitePiece.position.set(xPos, 0, 0 * tileSize - 7);
        if(col === 1 || col === 6) whitePiece.rotation.y = Math.PI; 
        whitePiece.userData = { square: file + '1', color: 'w' };
        scene.add(whitePiece); piecesMap.set(file + '1', whitePiece);

        const blackPiece = backRowOrder[col](onyxMaterial);
        blackPiece.position.set(xPos, 0, 7 * tileSize - 7);
        blackPiece.userData = { square: file + '8', color: 'b' };
        scene.add(blackPiece); piecesMap.set(file + '8', blackPiece);
    }
    return piecesMap;
}
