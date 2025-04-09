import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { sqrt } from 'three/tsl';

const manager = new THREE.LoadingManager();

let camera, scene, renderer, loader;
let rotor1, rotor2, rotor3, rotor4;
let index = 0;
let isPlay = false;

const container = document.createElement( 'div' );
document.body.appendChild( container );
const loading = document.getElementById( 'loading' );
loading.style.display = 'flex';

camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.01, 20000 );
camera.position.set( -2, 2, 0 );
scene = new THREE.Scene();
scene.background = new THREE.Color( 0xa0a0a0 );
const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444, 1 );
hemiLight.position.set( 0, 20, 0 );
scene.add( hemiLight );
const dirLight = new THREE.DirectionalLight( 0xffffff, 5 );
dirLight.position.set( 0, 20, 10 );
dirLight.castShadow = true;
dirLight.shadow.camera.top = 1.8;
dirLight.shadow.camera.bottom = - 1.0;
dirLight.shadow.camera.left = - 1.2;
dirLight.shadow.camera.right = 1.2;
scene.add( dirLight );

const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 20, 20 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
mesh.rotation.x = - Math.PI / 2;
mesh.receiveShadow = true;
scene.add( mesh );

const grid = new THREE.GridHelper( 20, 20, 0x000000, 0x000000 );
grid.material.opacity = 0.2;
grid.material.transparent = true;
scene.add( grid );

const changePlay = (event) => {
    if (event.target.id === 'play') {
        index = 0;
        isPlay = true;
    } else {
        isPlay = false;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".button");
    buttons.forEach(button => {
        button.addEventListener("click", changePlay);
    })
});

loader = new GLTFLoader( manager );
loadAsset();

renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
renderer.shadowMap.enabled = true;
container.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 0, 0 );
controls.update();
window.addEventListener( 'resize', onWindowResize );

function loadAsset() {
    loader.load( '/models/drone.glb', function ( gltf ) {
        const model = gltf.scene;
        model.scale.set(1, 1, 1)
        model.position.set(0, 0.2, 0);
        // console.log("model = ", model.children[0].children[1].children[0].children[4].children[0].children[1].children[0].children[0].children[0]);

        rotor1 = model.children[0].children[1].children[0].children[4].children[0].children[1].children[0].children[0].children[0];
        rotor2 = model.children[0].children[1].children[0].children[4].children[0].children[1].children[1].children[0].children[0];
        rotor3 = model.children[0].children[1].children[0].children[8].children[0].children[1].children[0].children[0].children[0];
        rotor4 =model.children[0].children[1].children[0].children[8].children[0].children[1].children[1].children[0].children[0];

        console.log("rotor1 = ", rotor1)

        scene.add( model );
        loading.style.display = 'none';
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

let rotor1_x0 = 37 / 2;
let rotor1_y0 = 49.15 / 2;
let x00;
let y00;

function animate() {
    if (rotor1) {
        // rotor1.rotation.z = 0;
        // rotor1.rotation.z = Math.PI;
        // console.log("rotor1 = ", rotor1.rotation.z)
        rotor1.rotation.z = index * 1.7;
        x00 = calc(rotor1_x0, rotor1_y0, rotor1.rotation.z).x1;
        y00 = calc(rotor1_x0, rotor1_y0, rotor1.rotation.z).y1;
        // rotor1.position.set(-9.2, -38.56, 0)
        // rotor1.position.set(rotor1_x0 * 2, -rotor1_y0 * 2, 0);
        // rotor1.position.set(0, 0, 0);
        rotor1.position.set(-x00, y00, 0);
        // rotor1.position.set(36.7, -49.1, 0)
        index ++;
    }
    renderer.render( scene, camera );
}

function calc(x0, y0, alpha) {
    const r = Math.sqrt(x0 * x0 + y0 * y0);
    const sita = Math.atan2(y0, x0);
    const beta = sita - alpha;
    const x1 = x0 - r * Math.cos(beta);
    const y1 = y0 - r * Math.sin(beta);
    return {x1, y1};
}