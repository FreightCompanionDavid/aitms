import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';

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
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        this.labelRenderer = new CSS2DRenderer();
        this.labelRenderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.labelRenderer.domElement.style.position = 'absolute';
        this.labelRenderer.domElement.style.top = '0px';
        this.container.appendChild(this.labelRenderer.domElement);

        this.controls = new OrbitControls(this.camera, this.labelRenderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
        this.scene.add(this.transformControls);
        this.transformControls.addEventListener('dragging-changed', (event) => {
            this.controls.enabled = !event.value;
        });

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

        const effectFXAA = new ShaderPass(FXAAShader);
        effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
        this.composer.addPass(effectFXAA);
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
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('draco/');
        loader.setDRACOLoader(dracoLoader);

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
            this.addInteractivity();
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

    addInteractivity() {
        this.container.addEventListener('click', (event) => {
            this.mouse.x = (event.clientX / this.container.clientWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / this.container.clientHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObject(this.container3D, true);

            if (intersects.length > 0) {
                const clickedPart = intersects[0].object;
                this.highlightPart(clickedPart);
                this.transformControls.attach(clickedPart);
            } else {
                this.transformControls.detach();
                this.outlinePass.selectedObjects = [];
            }
        });
    }

    highlightPart(part) {
        this.outlinePass.selectedObjects = [part];
    }

    createLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
    }

    createEnvironment() {
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8B4513,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1;
        ground.receiveShadow = true;
        this.scene.add(ground);

        this.addDecorations();
    }

    addDecorations() {
        const crateGeometry = new THREE.BoxGeometry(1, 1, 1);
        const crateMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        for (let i = 0; i < 5; i++) {
            const crate = new THREE.Mesh(crateGeometry, crateMaterial);
            crate.position.set(
                Math.random() * 10 - 5,
                0.5,
                Math.random() * 10 - 5
            );
            crate.castShadow = true;
            crate.receiveShadow = true;
            this.scene.add(crate);
        }

        const loader = new GLTFLoader();
        loader.load('models/forklift.glb', (gltf) => {
            const forklift = gltf.scene;
            forklift.position.set(5, 0, 5);
            forklift.scale.set(0.5, 0.5, 0.5);
            forklift.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            this.scene.add(forklift);
        });
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
            this.transformControls.attach(object);
            this.highlightPart(object);
        } else {
            this.transformControls.detach();
            this.outlinePass.selectedObjects = [];
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.composer.render();
        this.labelRenderer.render(this.scene, this.camera);
    }
}

export default FreightVisualizer;
