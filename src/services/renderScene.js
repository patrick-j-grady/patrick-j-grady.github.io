import * as THREE from 'three';
import { color } from 'three/nodes'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Fire } from './fire'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene objects
let scene
let renderer
let camera
let container
let textureLoader

// Materials
let roomMat
let torchMat

// Objects in scene
let floor
let light
let wallL
let wallR
let wallB
let roof
let columns
let torches
let fires

// Room dimensions
let roomX = 10
let roomY = 10
let roomZ = 20

// Column settings
let columnCount = 9
let columnSize = 0.8

// Camera settings
let cameraSpeed = 0.003
let cameraTarget = new THREE.Euler(0, 0, 0, 'XYZ')

export function CreateScene() {
    container = document.createElement('div')
    document.body.appendChild(container)

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    cameraTarget = camera.rotation
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    // Texture loading
    textureLoader = new THREE.TextureLoader()

    torchMat = LoadMaterial("textures/metal/metal", 1, 1)
    
    // Floor
    roomMat = LoadMaterial("textures/bricks/bricks", roomX, roomZ)
    const floorGeo = new THREE.PlaneGeometry(roomX, roomZ, 10, 10)
    floor = new THREE.Mesh(floorGeo, roomMat)

    floor.rotateX(-Math.PI / 2)
    floor.position.z += roomZ/2

    scene.add(floor)

    // Roof
    roof = new THREE.Mesh(new THREE.PlaneGeometry(roomX, roomZ, 10, 10), LoadMaterial("textures/bricks/bricks", roomX, roomZ))

    roof.rotateX(Math.PI / 2)
    roof.position.y += roomY
    roof.position.z += roomZ/2

    scene.add(roof)

    // Walls
    roomMat = LoadMaterial("textures/bricks/bricks", roomZ, roomY)
    wallL = new THREE.Mesh(new THREE.PlaneGeometry(roomZ, roomY, 10, 10), roomMat)
    wallR = new THREE.Mesh(new THREE.PlaneGeometry(roomZ, roomY, 10, 10), roomMat)
    wallB = new THREE.Mesh(new THREE.PlaneGeometry(roomX, roomY, 10, 10), LoadMaterial("textures/bricks/bricks", roomX, roomY))

    wallL.rotateY(Math.PI / 2)
    wallL.position.y += roomY/2
    wallL.position.x -= roomX/2
    wallL.position.z += roomZ/2
    
    wallR.rotateY(-Math.PI / 2)
    wallR.position.y += roomY/2
    wallR.position.x += roomX/2
    wallR.position.z += roomZ/2

    wallB.position.y += roomY/2

    scene.add(wallL)
    scene.add(wallR)
    scene.add(wallB)

    // Columns
    CreateColumns(roomMat)

    // Directional light (for testing)
    /*const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set( - 1, 1.75, 1 );
    dirLight.position.multiplyScalar( 30 );
    scene.add( dirLight );

    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    const d = 50;

    dirLight.shadow.camera.left = - d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = - d;

    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.bias = - 0.0001;

    const dirLightHelper = new THREE.DirectionalLightHelper( dirLight, 10 );
    scene.add( dirLightHelper );*/
    
    camera.position.y = 2
    camera.position.x = -roomX/8
    camera.position.z = roomZ

    container.appendChild(renderer.domElement)

    window.addEventListener( 'resize', onWindowResize );
    
    // Control
    document.onmousemove = function (e) {
    var centerX = window.innerWidth * 0.5;
    var centerY = window.innerHeight * 0.5;

    let targetX = -Math.PI * (e.clientY - centerY) * 0.00005
    let targetY = -Math.PI * (e.clientX - centerX) * 0.00005
    //camera.rotation.x = targetX
    //camera.rotation.y = targetY
    cameraTarget = new THREE.Euler(targetX, targetY, 0, 'XYZ')
    //console.log(cameraTarget)
    };

    //new OrbitControls(camera, renderer.domElement)

    return renderer.domElement
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

export function InitializeRendering() {
    Animate()
}

function Animate() {
    requestAnimationFrame(Animate)

    // Three doesn't let you set camera.rotation directly, so we have to do it this way
    let newCameraRot = MoveTowards(camera.rotation, cameraTarget, cameraSpeed)
    camera.rotation.x = newCameraRot.x
    camera.rotation.y = newCameraRot.y
    camera.rotation.z = newCameraRot.z
    
	//fire.update(performance.now() / 500);
    fires.forEach(fire => {
        fire.update(performance.now() / 500)
    })

    Render()
}

function Render() {
    renderer.clear()

	renderer.render( scene, camera );
}

// Borrowed from Unity
function MoveTowards(from, to, speed) {
    let a = new THREE.Euler(to.x - from.x, to.y - from.y, to.z - from.z, 'XYZ')

    if(a.x == NaN) a.x = 0
    if(a.y == NaN) a.y = 0
    if(a.z == NaN) a.z = 0

    // Euler doesn't have a way to get length, but Vector3 does and the conversion is easy
    let length = new THREE.Vector3(a.x, a.y, a.z).length()

    // Break out if we're too close to the target
    if(length <= speed || length == 0) {
        return to
    }

    let rot = new THREE.Euler(from.x + a.x / length * speed, from.y + a.y / length * speed, from.z + a.z / length * speed)

    if(rot.x == NaN) rot.x = 0
    if(rot.y == NaN) rot.y = 0
    if(rot.z == NaN) rot.z = 0

    return rot
}

function AddLight(diffuse, normalMap, hexColor, power = 1700, distance = 100) {
    const material = new THREE.MeshPhysicalMaterial( {
        roughness: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        map: diffuse,
        normalMap: normalMap
    })
    material.colorNode = color( hexColor );
    material.lights = false;

    const mesh = new THREE.Mesh( new THREE.SphereGeometry( 0.1, 16, 8 ), material );

    const newLight = new THREE.PointLight( hexColor, 1, distance );
    newLight.power = power;
    newLight.add( mesh );

    scene.add( newLight );

    return newLight;
}

function LoadTexture(path, repeatX = 10, repeatY = 10) {
    const texture = textureLoader.load(path);
    texture.colorSpace = THREE.SRGBColorSpace
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.x = repeatX;
    texture.repeat.y = repeatY;

    return texture
}

function LoadMaterial(path, repeatX, repeatY) {
    const albedo = LoadTexture(path + "_albedo.png", repeatX, repeatY)
    const normal = LoadTexture(path + "_normal.png", repeatX, repeatY)
    const ao = LoadTexture(path + "_occlusion.exr", repeatX, repeatY)
    const displace = LoadTexture(path + "_displace.exr", repeatX, repeatY)
    const rough = LoadTexture(path + "_rough.exr", repeatX, repeatY)
    const metal = LoadTexture(path + "_metal.exr", repeatX, repeatY)
    const emission = LoadTexture(path + "_emission.png", repeatX, repeatY)

    return new THREE.MeshPhysicalMaterial({
        aoMap: ao,
        displacementMap: displace,
        metalnessMap: metal,
        roughnessMap: rough,
        map: albedo,
        normalMap: normal
    })
}

function CreateColumns(mat) {
    columns = []
    torches = []
    fires = []
    let geo = new THREE.BoxGeometry(columnSize, roomY, columnSize)
    let zSpace = roomZ
    let columnMat = LoadMaterial("textures/bricks/bricks", columnSize, roomY)

    for(let i = 0; i < columnCount; i++) {
        let col = new THREE.Mesh(geo, columnMat)

        col.position.y += roomY/2
        col.position.x -= roomX/2
        col.position.x += columnSize/2
        col.position.z += zSpace / columnCount * i

        scene.add(col)

        columns.push(col)

        if(i % 2 == 0) {
            CreateTorch(col.position)
        }
    }
}

function CreateTorch(pos) {
    const gltfLoader = new GLTFLoader();

    gltfLoader.load( 'models/torch.glb', function ( gltf ) {

        let torchModel = gltf.scene
        torchModel.traverse((o) => {
            if(o.isMesh) o.material = torchMat
        })

        torchModel.scale.set(1.9, 1.9, 1.9)
        torchModel.rotateY(Math.PI)
        torchModel.position.x = pos.x + columnSize + 0.1
        torchModel.position.y = 2
        torchModel.position.z = pos.z

        scene.add(torchModel)
    
    }, undefined, function ( error ) {
    
        console.error( error );
    
    } );

    const fireTex = textureLoader.load('textures/Fire2.png')
    let f = new Fire(fireTex)
    f.scale.set(0.38, 1.08, 0.38)

    f.rotateX(-Math.PI / 8)

    const fireLight = new THREE.PointLight( 0xff00f9, 1, Math.PI * 6 );
    fireLight.power = Math.PI * 1.5;

    // Fire mesh is a child of the light so it doesn't need its position set
    fireLight.position.x = pos.x + columnSize + 0.3
    fireLight.position.y = 2.9
    fireLight.position.z = pos.z - 0.11

    fireLight.add( f );

    scene.add( fireLight );

    fires.push(f)
}