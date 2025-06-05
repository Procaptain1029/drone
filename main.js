import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

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
const dirLight = new THREE.DirectionalLight( 0xffffff, 2 );
const ambiantLight = new THREE.AmbientLight(0xffffff, 1);
ambiantLight.position.set(0, -20, 0);
scene.add( ambiantLight )
dirLight.position.set( 0, 50, 10 );
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

const grid = new THREE.GridHelper( 20, 20, 0x00000, 0x00000 );
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
    loader.load( '/models/01.glb', function ( gltf ) {
        const model = gltf.scene;
        console.log(model);
        model.scale.set(1, 1, 1)
        model.position.set(0, 0.2, 0);
        // rotor1 = model.children[0].children[1].children[0].children[4].children[0].children[1].children[0].children[0].children[0];
        // rotor2 = model.children[0].children[1].children[0].children[4].children[0].children[1].children[1].children[0].children[0];
        // rotor3 = model.children[0].children[1].children[0].children[8].children[0].children[1].children[0].children[0].children[0];
        // rotor4 =model.children[0].children[1].children[0].children[8].children[0].children[1].children[1].children[0].children[0];
        scene.add( model );
        loading.style.display = 'none';
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

let rotor1_x = 37 / 2;
let rotor1_y = 49.15 / 2;
let rotor2_x = 36.5 / 2;
let rotor2_y = 49.1 / 2;
let x1, x2, x3, x4;
let y1, y2, y3, y4;

function animate() {
    if (rotor1 && isPlay) {
        const angle = index * 1.7;
        rotor1.rotation.z = angle;
        x1 = calc_pos(rotor1_x, rotor1_y, angle).x2;
        y1 = calc_pos(rotor1_x, rotor1_y, angle).y2;
        rotor1.position.set(-x1, y1, 0);

        rotor2.rotation.z = angle;
        x2 = calc_pos(-rotor2_x, rotor2_y, angle).x2;
        y2 = calc_pos(-rotor2_x, rotor2_y, angle).y2;
        rotor2.position.set(-x2, y2, 0);
        
        rotor3.rotation.z = angle;
        x3 = calc_pos(rotor1_x, -rotor1_y, angle).x2;
        y3 = calc_pos(rotor1_x, -rotor1_y, angle).y2;
        rotor3.position.set(-x3, y3, 0);
        
        rotor4.rotation.z = angle;
        x4 = calc_pos(-rotor2_x, -rotor2_y, angle).x2;
        y4 = calc_pos(-rotor2_x, -rotor2_y, angle).y2;
        rotor4.position.set(-x4, y4, 0);

        index ++;
    }
    renderer.render( scene, camera );
}

function calc_pos(x1, y1, alpha) {
    const r = Math.sqrt(x1 * x1 + y1 * y1);
    const sita = Math.atan2(y1, x1);
    const beta = sita - alpha;
    const x2 = x1 - r * Math.cos(beta);
    const y2 = y1 - r * Math.sin(beta);
    return {x2, y2};
}