import * as THREE from "https://threejs.org/build/three.module.js";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import {GLTFLoader} from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';
import { HDRCubeTextureLoader } from 'https://threejs.org/examples/jsm/loaders/HDRCubeTextureLoader.js';
import { GUI } from 'https://threejs.org/examples/jsm/libs/dat.gui.module.js'

//(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()

var mesh, renderer, scene, camera, controls, backSphere, pointSphere, cube,XAxis, YAxis, ZAxis, phi, theta, origin;
var textureLoader = new THREE.TextureLoader();
var cameraPositions = {
    previous : [0,0,0],
    current : [0,0,0]
}
var coordinates = {
    previous : {
        angle : {
            phi : 0,
            theta : 0
        },
        x:1,y:1,z:1
    },
    current : {
        angle : {
            phi : 0,
            theta : 0
        },
        x:1,y:1,z:1
    }
}
init();
animate();

function init() {

    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.domElement.id = 'CANVAS';
    
    document.body.appendChild( renderer.domElement );

    //const gui = new GUI();

    // scene
    scene = new THREE.Scene();

    XAxis = new THREE.Vector3( 1, 0, 0 );
    YAxis = new THREE.Vector3( 0, 1, 0 );
    ZAxis = new THREE.Vector3( 0, 0, 1 );
    origin = new THREE.Vector3( 0, 0, 0 );

    //scene.add(new THREE.ArrowHelper(XAxis,origin,2,0xffff00))


    //Background
    //scene.background = new THREE.Color(0xdddddd )
    
    // camera
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 10000 );
    camera.position.set( 5,0,0 );
    cameraPositions.current = [5,0,0];

/*     gui.add(camera.position, 'x').min(-10).max(10).step(0.01)
    gui.add(camera.position, 'y').min(-10).max(10).step(0.01)
    gui.add(camera.position, 'z').min(-10).max(10).step(0.01)
    gui.add(camera.rotation, 'x').min(-10).max(10).step(0.01)
    gui.add(camera.rotation, 'y').min(-10).max(10).step(0.01)
    gui.add(camera.rotation, 'z').min(-10).max(10).step(0.01) */

    // controls
    controls = new OrbitControls( camera, renderer.domElement );

    //Background

    let urls = [
        'Texture/BackgroundGalacy.jpg','Texture/BackgroundGalacy.jpg',
        'Texture/BackgroundGalacy.jpg','Texture/BackgroundGalacy.jpg',
        'Texture/BackgroundGalacy.jpg','Texture/BackgroundGalacy.jpg'
    ]

    let loader = new THREE.CubeTextureLoader();
    scene.background = loader.load(urls)  

   //scene.backgroung = new THREE.Color(0xffffff)
   /*  textureLoader.load('Texture/BackgroundGalacy.jpg',txt=>{
        scene.background = txt;
    }) */
    
    // ambient
    scene.add( new THREE.AmbientLight( 0x222222 ) );
    
    // light
    var light = new THREE.DirectionalLight( 0xffffff, 1 );
    var SunPosition = getSunPosition();
    console.log(SunPosition)
    light.position.set( SunPosition[0],0,SunPosition[1] );
    scene.add( light );
    //gui.add(light.position, 'y').min(0).max(3).step(0.01)

    // light2
/*     var light2 = new THREE.DirectionalLight( 0xffffff, 1 );
    light2.position.set( -5,-5, -5);
    scene.add( light2 ); */
    
    // axes
    //scene.add( new THREE.AxesHelper( 20 ) );        

    var axis = new THREE.Vector3(0.5,0.5,0)
    

    textureLoader.load('https://raw.githubusercontent.com/anand-kamble/Stock-images-server/master/main_images/2k_earth_daymap.jpg', function (txtr) {
        // geometry
        var geometry = new THREE.SphereGeometry( 1, 24, 24 );

        // material
       var material = new THREE.MeshStandardMaterial( { map: txtr} );
        
        // mesh
        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );
        mesh.position.set(0,0,0)
    })

    textureLoader.load('https://raw.githubusercontent.com/anand-kamble/Stock-images-server/master/main_images/BackgroundGalacy.jpg', backtxtr =>{
        // geometry
        var geometry = new THREE.SphereGeometry( .01, 12, 12 );

        var parameters = {
            color : 0x00F0FF,
            emissive : 0x00F0FF
        }
        // material
        var material = new THREE.MeshStandardMaterial(parameters);

        pointSphere = new THREE.Mesh(geometry,material)
        pointSphere.position.set(0.6,0.5,0.5);
        var Pune = getPositionFromCoordinates(18.5204,73.8567)
        
        console.log(coordinates)

        pointSphere.position.set(Pune.x,Pune.y,Pune.z);

        scene.add(pointSphere)
        //gui.add(pointSphere.position, 'x').min(0).max(3).step(0.01)
       // gui.add(pointSphere.position, 'y').min(0).max(3).step(0.01)
       // gui.add(pointSphere.position, 'z').min(0).max(3).step(0.01)
    })


    
    
    
}
/* 
window.addEventListener('keydown',(e)=>{
    
    console.log(e.code);

    if(e.code == 'KeyW'){
        rotateGlobe()
    }
    
}) */

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

    if(window.innerWidth >= 1200){
        Chart (dataforGraph,30,20);
    }
    if(window.innerWidth >= 800 && window.innerWidth <1200){
        Chart (dataforGraph,35,20);
    }
    if(window.innerWidth < 800 ){
        Chart (dataforGraph,80,20);
    }
    console.log(` W : ${window.innerWidth} , H : ${window.innerHeight}`)
}


function animate() {

    requestAnimationFrame( animate );
    //mesh.rotation.y += 0.01
    controls.update();
    renderer.render( scene, camera );

}
//https://en.wikipedia.org/wiki/Spherical_coordinate_system#Coordinate_system_conversions
function getPositionFromCoordinates(latitude,Longitude){
    phi = (90-latitude)*(Math.PI/180);
    theta = (Longitude+180)*(Math.PI/180);

    coordinates.current.angle.phi = phi;
    coordinates.current.angle.theta = theta;

    console.log(`PHI : ${phi} & THETA : ${theta}`)

    let x = -(Math.sin(phi)*Math.cos(theta));
    let y = (Math.cos(phi))
    let z = (Math.sin(phi)*Math.sin(theta))

    return {x,y,z}
}



function rotateGlobe(lon , lat){

    /* coordinates.current.angle.phi
    var rotate = setInterval(()=>{

        mesh.rotation.y += 0.003
    },1/60) */
    var coor = getPositionFromCoordinates(lon,lat);

    pointSphere.position.set(coor.x,coor.y,coor.z);
    
    //generateCurve(camera.position.x,camera.position.y,camera.position.z,coor.x,coor.y,coor.z)
    var cameraPoint = getCollinearPoint(0,0,0,coor.x,coor.y,coor.z,2);
    console.log(cameraPoint)

    var previousCameraPos = cameraPositions.current;
    cameraPositions.previous = previousCameraPos;
    cameraPositions.current = [cameraPoint.x,cameraPoint.y,cameraPoint.z]

    //camera.position.set(cameraPoint.x,cameraPoint.y,cameraPoint.z)
    lon = -lon * (Math.PI/180); // Around Y
    lat = -lat * (Math.PI/180); // Around Z
    animateCamera();
    hideMain()
    //console.log(Math.atan2( ( camera.position.x - pointSphere.position.x ), ( camera.position.z - pointSphere.position.z ) ));
    //var rad = -Math.atan2( ( camera.position.x - pointSphere.position.x ), ( camera.position.z - pointSphere.position.z ) );
    //mesh.rotation.y = lon
    //mesh.rotation.z = lat

    //pointSphere.rotateOnAxis(rad)


}

window.rotateGlobe = rotateGlobe;

/* var loader = new GLTFLoader();
loader.crossOrigin = true;
loader.load( '/file/model1.gltf', function ( data ) {


    var object = data.scene;
    object.position.set(0, 0, 0);
//     object.rotation.set(Math.PI / -2, 0, 0);

//     TweenLite.from( object.rotation, 1.3, {
//       y: Math.PI * 2,
//       ease: 'Power3.easeOut'
//     });

    /* TweenMax.from( object.position, 3, {
    y: -8,
    yoyo: true,
    repeat: -1,
    ease: 'Power2.easeInOut'
    }); 
    //object.position.y = - 95;
    scene.add( object );

//, onProgress, onError );
}); */

function getCollinearPoint(x1,y1,z1,x2,y2,z2,distance){
    var vbar = [x2-x1,y2-y1,z2-z1];
    var lengthV = Math.sqrt(vbar[0]**2 + vbar[1]**2 + vbar[2]**2);
    var vectorInSameDirecion = [vbar[0]/lengthV , vbar[1]/lengthV , vbar[2]/lengthV];
    var vectorofLengthL = [vectorInSameDirecion[0]*distance,vectorInSameDirecion[1]*distance,vectorInSameDirecion[2]*distance];
    var newPoint = [x2+vectorofLengthL[0],y2+vectorofLengthL[1],z2+vectorofLengthL[2]];
    return { x : newPoint[0], y : newPoint[1], z : newPoint[2] }
}

function getSunPosition(){
    var d = new Date()
    var hours = 24 - d.getUTCHours();
    // Point(0,r) at x= rsin0, y = rcos0
    var baseAngle = 15;
    var angle = (hours*baseAngle)*(Math.PI/180);
    var radius = 5;
    var location = [radius*Math.cos(angle),radius*Math.sin(angle)]
    return location;
}

var speed = 0.01;
function animateCamera(){
    var loop = setInterval(()=>{
        if(camera.position.x !== cameraPositions.current[0]){
            if(camera.position.x > cameraPositions.current[0]){
                camera.position.x -= speed;
            }
            if(camera.position.x < cameraPositions.current[0]){
                camera.position.x += speed;
            }
        }

        if(camera.position.y !== cameraPositions.current[1]){
            if(camera.position.y > cameraPositions.current[1]){
                camera.position.y -= speed;
            }        
            if(camera.position.y < cameraPositions.current[1]){
                camera.position.y += speed;
            }
        }
        if(camera.position.z !== cameraPositions.current[2]){
            if(camera.position.z < cameraPositions.current[2]){
                camera.position.z += speed;
            }
            if(camera.position.z > cameraPositions.current[2]){
                camera.position.z -= speed;
            }
        }
/* 
        if(camera.position.z == cameraPositions.current[2] && camera.position.y == cameraPositions.current[1] && camera.position.x == cameraPositions.current[0]){
            console.log('EQUAL')
            clearInterval(loop)
        } */

        if(camera.position.z >= cameraPositions.current[2]-speed && camera.position.z <= cameraPositions.current[2]+speed && 
            camera.position.y >= cameraPositions.current[1]-speed && camera.position.y <= cameraPositions.current[1]+speed &&
            camera.position.x >= cameraPositions.current[0]-speed && camera.position.x <= cameraPositions.current[0]+speed ){
                console.log('EQUAL');
                showMain();
                clearInterval(loop)
                
        }
    },1/60)
}

/* function generateCurve(x1,y1,z1,x2,y2,z2){
    let v1 = new THREE.Vector3(x1,y1,z1);
    let v2 = new THREE.Vector3(x2,y2,z2);
    let points = []
    for(var i=0;i<=20;i++){
        let p = new THREE.Vector3().lerpVectors(v1,v2, i/20);
        p.normalize()
        p.multiplyScalar(1 + 0.1*Math.sin(Math.PI*i/20));
        points.push(p)
    }

    console.log(points)
    let path = new THREE.CatmullRomCurve3(points)
} */

