import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const manager = new THREE.LoadingManager();

let camera, scene, renderer, loader;
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
        model.position.set(0, 0.2, 0)
        console.log("model = ", model);
        scene.add( model );
        loading.style.display = 'none';
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    if (isPlay) {
        index ++;
    }
    renderer.render( scene, camera );
}