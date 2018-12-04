const socket = io();

window.onload = () => {
    document.getElementById('create')
        .addEventListener('click', () => {
            socket.emit('create');
        });

    document.getElementById('start')
        .addEventListener('click', () => {
            socket.emit('start');
        });

    window.addEventListener('keydown', handleKeydown);

    socket.on('update', handleUpdate);
    startScene();

}

let count = 0;

const handleUpdate = data => {
    const {head, body, tail, appleEated} = data.players[0];
    const apple = data.apple;

    objects.head.position.set(head.x * 10, 0, head.y * 10);
    objects.head.rotation.set(0, head.direction * 90 * Math.PI / 180, 0);

    objects.body.position.set(body.x * 10, 0, body.y * 10);
    objects.body.rotation.set(0, body.direction * 90 * Math.PI / 180, 0);

    objects.apple.position.set(apple.x * 10, 0, apple.y * 10);

    if (appleEated) {
        console.log(objects.body);
        let newBody = objects.body.clone();
        newBody.position.set(appleEated.x * 10, 0, appleEated.y * 10);
        scene.add( newBody );
        //bodySnake.push(newBody);
    } else {
        objects.tail.position.set(tail.x * 10, 0, tail.y * 10);
        objects.tail.rotation.set(0, tail.direction * 90 * Math.PI / 180, 0);
    }

    count++;
}

/* const cel = {
    x,
    y,
    direction = 0 | 1 | 2 | 3,
    type = head | body | right | left | tail,
    object: new THREE.Object()
} */

/*const snake = {
    head: {
        0: { x: }//head
        1: //Cuello
    },
    tail: {
        0: //Tail
        1: //PreTail
    }
}*/


/* const snake = [objects.tail.clone(), objects.body.clone(), objects.head.clone()];
const head = snake[snake.length - 1];
const tail = snake[0];
const pretail = snake[1];

scene.add(head);
scene.add(tail);
scene.add(pretail); */

/* 
    tail.position = precola.position
    precola.position = head.position
    head.position = data.head.position
    new body.psotion = apple.position
    apple.position = data.apple
*/

const handleKeydown = event => {
    const keys = [38, 37, 40, 39];
    const key = event.keyCode;

    socket.emit('update', keys.indexOf(key));
}

let objects;
let scene;

const startScene = async () => {
    scene = new THREE.Scene();
    const aspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000);
    const controls = new THREE.OrbitControls(camera);
    const renderer = new THREE.WebGLRenderer({antialias: true});
    const ambientLight = new THREE.HemisphereLight(0xffffbb, 0x080820, .6);
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 1);

    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.keys = {};
    controls.update();
    document.body.appendChild(renderer.domElement);

    scene.background = new THREE.Color(0x2f9490);
    camera.position.set(223, 144, 229)
    directionalLight.position.set(50, 20, 50);

    const {width, height} = {width: 15, height: 15};

    loadObj('models/grass.mtl', 'models/grass.obj')
        .then(object => {
            for (let z = 0; z < height; z++) {
                for (let x = 0; x < width; x++) {
                    const newObject = object.clone();

                    newObject.position.set(x * 10, -8, z * 10);
                    scene.add(newObject);
                }
            }
        });

    objects = {
        head: await loadObj('models/head.mtl', 'models/head.obj'),
        body: await loadObj('models/body.mtl', 'models/body.obj'),
        tail: await loadObj('models/tail.mtl', 'models/tail.obj'),
        right: await loadObj('models/right.mtl', 'models/right.obj'),
        left: await loadObj('models/left.mtl', 'models/left.obj'),
        apple: await loadObj('models/apple.mtl', 'models/apple.obj')
    }

    scene.add(objects.head);
    scene.add(objects.body);
    scene.add(objects.tail);
    scene.add(objects.apple);
    scene.add(ambientLight);
    scene.add(directionalLight);

    const animate = function () {
        requestAnimationFrame(animate);
        controls.update();
        /* console.log(camera.position) */
        renderer.render(scene, camera);
    };
    
    animate();
}

const loadObj = (mtl, obj) => new Promise((resolve, reject) => {
    new THREE.MTLLoader().load(mtl, materials => {
        materials.preload();
        
        new THREE.OBJLoader().setMaterials(materials)
            .load(obj, resolve);
    });
})

/*
Eliminar la penultima por cola
Añadir segunda por curva o recta
Girar la cabeza
*/