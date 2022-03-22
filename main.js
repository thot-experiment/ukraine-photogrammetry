import * as THREE from './three/three.module.js';
import { GLTFLoader } from './three/GLTFLoader.js';
import { DRACOLoader } from './three/DRACOLoader.js';
import { OrbitControls } from './three/OrbitControls.js';
import { VRButton } from './three/webxr/VRButton.js';

window.THREE = THREE

let camera, scene, renderer, gamepad;
let controls, dummy, controller
let geometry, material, mesh;
let startpos, prepos

init()

function init() {

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 20000 );
  camera.position.z = 1;



  scene = new THREE.Scene();
  scene.add(camera)
  let color = new THREE.Color(0xffffff)
  scene.background = color

  const loader = new GLTFLoader()//.setPath( './' );
  //
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath( './three/draco/' );
  loader.setDRACOLoader( dracoLoader );

  loader.load( settings.mesh, function ( gltf ) {
    //gltf.scene.rotation.y =  -Math.PI/2
    //gltf.scene.position.set(0,-6,-19)

    scene.add( gltf.scene );
    camera.position.x = settings.cx || -5
    camera.position.y = settings.cy || 1.7
    camera.position.z = settings.cz || 6
    let bm2 = new THREE.MeshBasicMaterial()
    bm2.map = scene.children[1].children[0].material.map
    bm2.map.encoding = 3000
    scene.children[1].children[0].material = bm2
    camera.rotateY(-0.7)
    document.body.appendChild( VRButton.createButton( renderer ) );
  })

  //camera.add( gltf.scene );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setAnimationLoop( animation );
  renderer.xr.enabled = true;
  renderer.xr.addEventListener('sessionstart', function () {


    scene.remove(dummy)
    dummy = new THREE.Object3D()
    dummy.position.x = -5
    dummy.position.z = 6
    dummy.add(camera)
    scene.add(dummy)
    function onSelectStart() {
      startpos = {...controller.position}
      prepos = {...dummy.position}

      this.userData.isSelecting = true;

    }

    function onSelectEnd() {

      this.userData.isSelecting = false;

    }



    controller = renderer.xr.getController( 0 );
    controller.addEventListener( 'selectstart', onSelectStart );
    controller.addEventListener( 'selectend', onSelectEnd );
    /*
    controller.addEventListener( 'connected', function ( event ) {

      this.add( buildController( event.data ) );

    } );
    controller.addEventListener( 'disconnected', function () {

      this.remove( this.children[ 0 ] );

    } );
    */
    scene.add( controller );
  });
  renderer.xr.addEventListener('sessionend', function () {
    scene.add(camera)
    scene.remove(dummy)
  });
  document.body.appendChild( renderer.domElement );
  controls = new OrbitControls (camera, renderer.domElement);

  Object.assign(window, {camera, scene,renderer})

}

window.onresize =	function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

function animation( time ) {
  controls.update();
  if ( controller?.userData?.isSelecting === true ) {
    dummy.position.x = prepos.x - (controller.position.x - startpos.x)*2
    dummy.position.z = prepos.z - (controller.position.z - startpos.z)*2
    dummy.position.y = prepos.y - (controller.position.y - startpos.y)*2
    console.log(controller)
  }
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

