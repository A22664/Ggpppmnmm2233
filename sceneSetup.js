// sceneSetup.js
import * as THREE from 'three';

export function initScene() {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020202, 0.025);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 20);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    document.getElementById('game-container').appendChild(renderer.domElement);

    // إعداد الإضاءة الملحمية
    const ambientLight = new THREE.AmbientLight(0x111122, 1.5);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 150);
    spotLight.position.set(0, 25, 0);
    spotLight.angle = Math.PI / 5;
    spotLight.penumbra = 0.8;
    spotLight.castShadow = true;
    scene.add(spotLight);

    return { scene, camera, renderer };
}

export function createBoard(scene) {
    const marbleMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.1, emissive: 0x222222 });
    const obsidianMaterial = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.1, metalness: 0.9 });
    
    const boardGroup = new THREE.Group();
    scene.add(boardGroup);
    
    const tileSize = 2;
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const isBlack = (row + col) % 2 === 1;
            const tile = new THREE.Mesh(new THREE.BoxGeometry(tileSize, 0.5, tileSize), isBlack ? obsidianMaterial : marbleMaterial);
            tile.position.set(col * tileSize - 7, -0.25, row * tileSize - 7);
            tile.receiveShadow = true;
            boardGroup.add(tile);
        }
    }
}
