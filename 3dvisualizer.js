import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';

class FreightVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.camera.position.set(5, 5, 5);
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);

        this.labelRenderer = new CSS2DRenderer();
        this.labelRenderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.labelRenderer.domElement.style.position = 'absolute';
        this.labelRenderer.domElement.style.top = '0px';
        this.container.appendChild(this.labelRenderer.domElement);

        this.controls = new OrbitControls(this.camera, this.labelRenderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.composer = new EffectComposer(this.renderer);
        this.setupPostProcessing();

        this.loadEnvironmentMap();
        this.createFreightContainer();
        this.createLighting();
        this.createEnvironment();

        window.addEventListener('resize', () => this.onWindowResize(), false);
        this.container.addEventListener('mousemove', (event) => this.onMouseMove(event), false);
        this.container.addEventListener('click', (event) => this.onClick(event), false);

        this.animate();
    }

    setupPostProcessing() {
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        this.outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this.scene, this.camera);
        this.composer.addPass(this.outlinePass);
    }

    loadEnvironmentMap() {
        new RGBELoader()
            .setPath('textures/')
            .load('venice_sunset_1k.hdr', (texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                this.scene.environment = texture;
                this.scene.background = texture;
            });
    }

    createFreightContainer() {
        const loader = new GLTFLoader();
        loader.load('models/freight_container.glb', (gltf) => {
            this.container3D = gltf.scene;
            this.scene.add(this.container3D);
            this.container3D.position.set(0, 0, 0);
            this.container3D.scale.set(0.5, 0.5, 0.5);

            this.container3D.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            this.addLabels();
        });
    }

    addLabels() {
        const parts = ['door', 'roof', 'side_panel'];
        parts.forEach(part => {
            const labelDiv = document.createElement('div');
            labelDiv.className = 'label';
            labelDiv.textContent = part.replace('_', ' ');
            const label = new CSS2DObject(labelDiv);
            const object = this.container3D.getObjectByName(part);
            if (object) {
                object.add(label);
            }
        });
    }

    createLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
    }

    createEnvironment() {
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }

    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.labelRenderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.composer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / this.container.clientWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / this.container.clientHeight) * 2 + 1;
    }

    onClick(event) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            this.highlightPart(object);
        } else {
            this.outlinePass.selectedObjects = [];
        }
    }

    highlightPart(part) {
        this.outlinePass.selectedObjects = [part];
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.composer.render();
        this.labelRenderer.render(this.scene, this.camera);
    }
}

export default FreightVisualizer;
