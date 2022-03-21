import * as THREE from './three/three.module.js';
import { GLTFLoader } from './three/GLTFLoader.js';
import { DRACOLoader } from './three/DRACOLoader.js';
import { OrbitControls } from './three/OrbitControls.js';

window.THREE = THREE

let camera, scene, renderer, gamepad;
let controls
let geometry, material, mesh;

//buttons
//0  1  2  3  4  5  6  7
//a  b  x  y lb rb lt rt

//axes
// 0  1  2  3
//+x -y +x -y

init()

function init() {

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 20000 );
  camera.position.z = 1;


  scene = new THREE.Scene();
  scene.add(camera)
  let color = new THREE.Color(0xffffff)
  scene.background = color
  /*
  scene.fog = new THREE.FogExp2(color, 0.00015)

  let pointLight = new THREE.PointLight( 0xffffff );
  pointLight.position.set(1,10,2)
  scene.add(pointLight)
  */


  const loader = new GLTFLoader()//.setPath( './' );
  //
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath( './three/draco/' );
  loader.setDRACOLoader( dracoLoader );

  loader.load( 'bmp2.glb', function ( gltf ) {
    //gltf.scene.rotation.y =  -Math.PI/2
    //gltf.scene.position.set(0,-6,-19)

    scene.add( gltf.scene );
  camera.position.x = -5
camera.position.y = 1.7
camera.position.z = 6
let bm = new THREE.MeshBasicMaterial()
bm.map = scene.children[1].children[0].children[1].material.map
    bm.map.encoding = 3000
scene.children[1].children[0].children[1].material = bm
let bm2 = new THREE.MeshBasicMaterial()
bm2.map = scene.children[1].children[0].children[0].material.map
    bm2.map.encoding = 3000
scene.children[1].children[0].children[0].material = bm2
camera.rotateY(-0.7)
  })

    //camera.add( gltf.scene );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animation );
    document.body.appendChild( renderer.domElement );
    controls = new OrbitControls (camera, renderer.domElement);

    Object.assign(window, {camera, scene,renderer})

  }

let speed = 0

function animation( time ) {
  controls.update();
  /*
  let gamepad = navigator.getGamepads()[0]
  if (speed > 0.7) speed = 100.7
  if (gamepad) {

    let yaw = gamepad.axes[0] 
    scene.getObjectByName("Rudder").rotation.y = -yaw/2-Math.PI/2
    let pitch = gamepad.axes[3]  
    let thrust = gamepad.axes[1]  
    let roll = gamepad.axes[2]  
    let rf = 1/200
    let dz = 1/5

    camera.rotateY(Math.abs(yaw) > dz ? -yaw*rf : 0)
    camera.rotateX(Math.abs(pitch) > dz ? pitch*rf*4.5 : 0)
    camera.rotateZ(Math.abs(roll) > dz ? -roll*rf*4 : 0)

    if (Math.abs(thrust) > dz) {
      speed += thrust/200
    }
    camera.position
      .add(new THREE.Vector3(0,0,speed).applyQuaternion(camera.quaternion))
  }
  */

  renderer.render( scene, camera )

}

