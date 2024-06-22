import * as THREE from 'three';

class FreightVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);

        this.createFreightContainer();
        this.animate();
    }

    createFreightContainer() {
        const geometry = new THREE.BoxGeometry(2, 2, 4); // Longer to represent a freight container
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x1a75ff, // Blue color for the container
            specular: 0x050505,
            shininess: 100
        });
        this.container3D = new THREE.Mesh(geometry, material);
        this.scene.add(this.container3D);

        // Add some details to make it look more like a freight container
        const doorGeometry = new THREE.PlaneGeometry(1.8, 1.8);
        const doorMaterial = new THREE.MeshBasicMaterial({ color: 0x0a0a0a });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.z = 2.01; // Slightly in front of the container
        this.container3D.add(door);

        // Add lighting
        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(0, 0, 10);
        this.scene.add(light);

        this.camera.position.z = 10;
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.container3D.rotation.x += 0.005;
        this.container3D.rotation.y += 0.01;
        this.renderer.render(this.scene, this.camera);
    }
}

export default FreightVisualizer;
