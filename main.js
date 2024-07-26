/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var cannon_es__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! cannon-es */ "./node_modules/cannon-es/dist/cannon-es.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");



class ThreeJSContainer {
    scene;
    light;
    world;
    syncMeshes = [];
    vehicle;
    gameOver = false; // ゲームオーバーフラグ
    gameCleared = false; // ゲームクリアフラグ
    planeBoundary = 50; // 平面の境界
    initialCarPosition;
    initialCarQuaternion;
    initialWheelPositions;
    initialWheelQuaternions;
    countdownElement; // カウントダウン表示用の要素
    countdownTime = 60; // カウントダウンの初期時間（秒）
    countdownInterval = null; // カウントダウンのインターバルID
    constructor() {
        this.initialCarPosition = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Vec3();
        this.initialCarQuaternion = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Quaternion();
        this.initialWheelPositions = [];
        this.initialWheelQuaternions = [];
    }
    createRendererDOM = (width, height, cameraPos) => {
        const renderer = new three__WEBPACK_IMPORTED_MODULE_2__.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_2__.Color(0x495ed));
        renderer.shadowMap.enabled = true; //シャドウマップを有効にする
        const camera = new three__WEBPACK_IMPORTED_MODULE_2__.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, 0, 0));
        const orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(camera, renderer.domElement);
        this.createScene();
        const render = (time) => {
            orbitControls.update();
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    };
    createScene = () => {
        this.world = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.World({ gravity: new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Vec3(0, -9.82, 0) });
        this.scene = new three__WEBPACK_IMPORTED_MODULE_2__.Scene();
        this.world.defaultContactMaterial.restitution = 0.8;
        this.world.defaultContactMaterial.friction = 0.03;
        // テクスチャの読み込み
        const textureLoader = new three__WEBPACK_IMPORTED_MODULE_2__.TextureLoader();
        const carTexture = textureLoader.load('car.png'); // 画像のパスを指定
        const carBody = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Body({ mass: 10 });
        const carBodyShape = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Vec3(4, 0.5, 2));
        carBody.addShape(carBodyShape);
        carBody.position.y = 1;
        this.vehicle = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.RigidVehicle({ chassisBody: carBody });
        const wheelShape = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Sphere(1);
        const createWheelBody = (mass) => {
            const wheelBody = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Body({ mass });
            wheelBody.addShape(wheelShape);
            wheelBody.angularDamping = 0.4;
            return wheelBody;
        };
        const frontLeftWheel = createWheelBody(1);
        const frontRightWheel = createWheelBody(1);
        const rearLeftWheel = createWheelBody(1);
        const rearRightWheel = createWheelBody(1);
        this.vehicle.addWheel({ body: frontLeftWheel, position: new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Vec3(-2, 0, 2.5) });
        this.vehicle.addWheel({ body: frontRightWheel, position: new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Vec3(-2, 0, -2.5) });
        this.vehicle.addWheel({ body: rearLeftWheel, position: new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Vec3(2, 0, 2.5) });
        this.vehicle.addWheel({ body: rearRightWheel, position: new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Vec3(2, 0, -2.5) });
        this.vehicle.addToWorld(this.world);
        const boxGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.BoxGeometry(8, 1, 4);
        // 車体のマテリアルを作成
        const boxMaterial = new three__WEBPACK_IMPORTED_MODULE_2__.MeshBasicMaterial({ map: carTexture });
        const boxMesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(boxGeometry, boxMaterial);
        this.scene.add(boxMesh);
        const wheelGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.SphereGeometry(0.5);
        const wheelMaterial = new three__WEBPACK_IMPORTED_MODULE_2__.MeshLambertMaterial({ color: 0x0D0116 });
        const createWheelMesh = () => {
            const wheelMesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(wheelGeometry, wheelMaterial);
            this.scene.add(wheelMesh);
            return wheelMesh;
        };
        const frontLeftMesh = createWheelMesh();
        const frontRightMesh = createWheelMesh();
        const rearLeftMesh = createWheelMesh();
        const rearRightMesh = createWheelMesh();
        const phongMaterial = new three__WEBPACK_IMPORTED_MODULE_2__.MeshPhongMaterial();
        const planeGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.PlaneGeometry(100, 100);
        const planeMesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(planeGeometry, phongMaterial);
        planeMesh.material.side = three__WEBPACK_IMPORTED_MODULE_2__.DoubleSide;
        planeMesh.rotateX(-Math.PI / 2);
        this.scene.add(planeMesh);
        const planeShape = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Plane();
        const planeBody = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Body({ mass: 0 });
        planeBody.addShape(planeShape);
        planeBody.position.copy(this.threeToCannonVec3(planeMesh.position));
        planeBody.quaternion.copy(this.threeToCannonQuat(planeMesh.quaternion));
        this.world.addBody(planeBody);
        this.addRandomObject();
        this.initialCarPosition.copy(carBody.position);
        this.initialCarQuaternion.copy(carBody.quaternion);
        this.initialWheelPositions = [
            new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Vec3(-2, 0, 2.5),
            new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Vec3(-2, 0, -2.5),
            new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Vec3(2, 0, 2.5),
            new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Vec3(2, 0, -2.5)
        ];
        this.initialWheelQuaternions = [
            new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Quaternion(),
            new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Quaternion(),
            new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Quaternion(),
            new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Quaternion()
        ];
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    this.vehicle.setWheelForce(20, 0);
                    this.vehicle.setWheelForce(20, 1);
                    this.vehicle.setWheelForce(20, 2);
                    this.vehicle.setWheelForce(20, 3);
                    break;
                case 'ArrowDown':
                    this.vehicle.setWheelForce(-20, 0);
                    this.vehicle.setWheelForce(-20, 1);
                    this.vehicle.setWheelForce(-20, 2);
                    this.vehicle.setWheelForce(-20, 3);
                    break;
                case 'ArrowLeft':
                    this.vehicle.setWheelForce(-10, 0);
                    this.vehicle.setWheelForce(20, 1);
                    this.vehicle.setWheelForce(-10, 2);
                    this.vehicle.setWheelForce(20, 3);
                    break;
                case 'ArrowRight':
                    this.vehicle.setWheelForce(20, 0);
                    this.vehicle.setWheelForce(-10, 1);
                    this.vehicle.setWheelForce(20, 2);
                    this.vehicle.setWheelForce(-10, 3);
                    break;
                case 'r':
                    this.resetVehicle();
                    break;
                // case 's':
                //     this.resetCar();
                //     break;
            }
        });
        document.addEventListener('keyup', (event) => {
            this.vehicle.setWheelForce(0, 0);
            this.vehicle.setWheelForce(0, 1);
            this.vehicle.setWheelForce(0, 2);
            this.vehicle.setWheelForce(0, 3);
        });
        const gridHelper = new three__WEBPACK_IMPORTED_MODULE_2__.GridHelper(10);
        this.scene.add(gridHelper);
        const axesHelper = new three__WEBPACK_IMPORTED_MODULE_2__.AxesHelper(5);
        this.scene.add(axesHelper);
        this.light = new three__WEBPACK_IMPORTED_MODULE_2__.DirectionalLight(0xffffff);
        const lvec = new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(1, 1, 1).clone().normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
        let update = (time) => {
            if (this.gameOver || this.gameCleared)
                return; // ゲームオーバーかゲームクリアなら処理を停止
            this.world.fixedStep();
            // 車体とホイールの位置と回転を同期
            boxMesh.position.set(carBody.position.x, carBody.position.y, carBody.position.z);
            boxMesh.quaternion.set(carBody.quaternion.x, carBody.quaternion.y, carBody.quaternion.z, carBody.quaternion.w);
            frontLeftMesh.position.set(this.vehicle.wheelBodies[0].position.x, this.vehicle.wheelBodies[0].position.y, this.vehicle.wheelBodies[0].position.z);
            frontLeftMesh.quaternion.set(this.vehicle.wheelBodies[0].quaternion.x, this.vehicle.wheelBodies[0].quaternion.y, this.vehicle.wheelBodies[0].quaternion.z, this.vehicle.wheelBodies[0].quaternion.w);
            frontRightMesh.position.set(this.vehicle.wheelBodies[1].position.x, this.vehicle.wheelBodies[1].position.y, this.vehicle.wheelBodies[1].position.z);
            frontRightMesh.quaternion.set(this.vehicle.wheelBodies[1].quaternion.x, this.vehicle.wheelBodies[1].quaternion.y, this.vehicle.wheelBodies[1].quaternion.z, this.vehicle.wheelBodies[1].quaternion.w);
            rearLeftMesh.position.set(this.vehicle.wheelBodies[2].position.x, this.vehicle.wheelBodies[2].position.y, this.vehicle.wheelBodies[2].position.z);
            rearLeftMesh.quaternion.set(this.vehicle.wheelBodies[2].quaternion.x, this.vehicle.wheelBodies[2].quaternion.y, this.vehicle.wheelBodies[2].quaternion.z, this.vehicle.wheelBodies[2].quaternion.w);
            rearRightMesh.position.set(this.vehicle.wheelBodies[3].position.x, this.vehicle.wheelBodies[3].position.y, this.vehicle.wheelBodies[3].position.z);
            rearRightMesh.quaternion.set(this.vehicle.wheelBodies[3].quaternion.x, this.vehicle.wheelBodies[3].quaternion.y, this.vehicle.wheelBodies[3].quaternion.z, this.vehicle.wheelBodies[3].quaternion.w);
            this.syncMeshes.forEach(({ body, mesh }) => {
                mesh.position.copy(this.cannonVec3ToThree(body.position));
                mesh.quaternion.set(body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w);
            });
            // ゲームクリアまたはゲームオーバーの条件をチェック
            if (Math.abs(carBody.position.x) > this.planeBoundary || Math.abs(carBody.position.z) > this.planeBoundary) {
                if (!this.gameCleared) {
                    this.displayGameClearMessage();
                }
                this.gameOver = true;
            }
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
        // カウントダウンタイマーを開始
        this.startCountdown();
    };
    startCountdown = () => {
        this.countdownElement = document.createElement('div');
        this.countdownElement.style.position = 'absolute';
        this.countdownElement.style.top = '20px';
        this.countdownElement.style.left = '20px';
        this.countdownElement.style.fontSize = '24px';
        this.countdownElement.style.color = 'white';
        document.body.appendChild(this.countdownElement);
        this.countdownTime = 60; // カウントダウンの初期時間を設定
        this.countdownElement.textContent = `Time: ${this.countdownTime}`;
        this.countdownInterval = window.setInterval(() => {
            this.countdownTime--;
            if (this.countdownTime < 0) {
                this.displayGameOver();
                return;
            }
            this.updateCountdownDisplay();
        }, 1000);
    };
    endCountdown = () => {
        if (this.countdownInterval !== null) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
            this.countdownTime = 0;
            this.updateCountdownDisplay();
        }
    };
    updateCountdownDisplay = () => {
        if (this.countdownElement) {
            this.countdownElement.textContent = `Time: ${this.countdownTime}`;
        }
    };
    stopCountdown = () => {
        if (this.countdownInterval !== null) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
    };
    resetVehicle = () => {
        const carBody = this.vehicle.chassisBody;
        carBody.position.copy(this.initialCarPosition);
        carBody.quaternion.copy(this.initialCarQuaternion);
        this.vehicle.wheelBodies.forEach((wheelBody, index) => {
            wheelBody.position.copy(this.initialWheelPositions[index]);
            wheelBody.quaternion.copy(this.initialWheelQuaternions[index]);
        });
    };
    cannonVec3ToThree = (vec) => {
        return new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(vec.x, vec.y, vec.z);
    };
    threeToCannonVec3 = (vec) => {
        return new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Vec3(vec.x, vec.y, vec.z);
    };
    threeToCannonQuat = (quat) => {
        return new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Quaternion(quat.x, quat.y, quat.z, quat.w);
    };
    addRandomObject = () => {
        const objectTypes = ['Cone', 'box', 'cylinder'];
        const objectCount = 55;
        const areaSize = 100;
        const groundHeight = 1.5;
        const restrictedAreaRadius = 10; //表示させないエリア
        for (let i = 0; i < objectCount; i++) {
            let position;
            let validPosition = false;
            const maxAttempts = 100;
            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                position = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Vec3(Math.random() * areaSize - areaSize / 2, groundHeight, Math.random() * areaSize - areaSize / 2);
                const distance = Math.sqrt(Math.pow(position.x - this.vehicle.chassisBody.position.x, 2) +
                    Math.pow(position.z - this.vehicle.chassisBody.position.z, 2));
                if (distance > restrictedAreaRadius) {
                    validPosition = true;
                    break;
                }
            }
            if (!validPosition) {
                console.warn('障害物の有効な位置が見つかりませんでした', i);
                continue;
            }
            const type = objectTypes[Math.floor(Math.random() * objectTypes.length)];
            let shape;
            let geometry;
            switch (type) {
                case 'Cone':
                    shape = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Cylinder(6, 6, 12, 32);
                    geometry = new three__WEBPACK_IMPORTED_MODULE_2__.ConeGeometry(6, 12, 32);
                    break;
                case 'box':
                    shape = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Vec3(4, 4, 4)); // 
                    geometry = new three__WEBPACK_IMPORTED_MODULE_2__.BoxGeometry(8, 8, 8);
                    break;
                case 'cylinder':
                    shape = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Cylinder(3, 3, 12, 32);
                    geometry = new three__WEBPACK_IMPORTED_MODULE_2__.CylinderGeometry(3, 3, 12, 32);
                    break;
                default:
                    continue;
            }
            const body = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Body({ mass: 0 });
            body.addShape(shape);
            body.position.copy(position);
            const material = new three__WEBPACK_IMPORTED_MODULE_2__.MeshNormalMaterial();
            const mesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(geometry, material);
            this.world.addBody(body);
            this.scene.add(mesh);
            this.syncMeshes.push({ body, mesh });
        }
    };
    displayGameClearMessage = () => {
        if (this.gameCleared)
            return; // すでにゲームクリアが表示されている場合は何もしない
        this.stopCountdown(); // カウントダウンタイマーを停止
        // ゲームクリアフラグを設定
        this.gameCleared = true;
        // ゲームクリアメッセージを作成して表示
        const messageDiv = document.createElement('div');
        messageDiv.innerText = 'ゲームクリア';
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '50%';
        messageDiv.style.left = '50%';
        messageDiv.style.transform = 'translate(-50%, -50%)';
        messageDiv.style.padding = '20px';
        messageDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        messageDiv.style.color = 'white';
        messageDiv.style.fontSize = '2em';
        document.body.appendChild(messageDiv);
    };
    // ゲームオーバーを表示するメソッド
    displayGameOver = () => {
        this.gameOver = true;
        const gameOverElement = document.createElement('div');
        gameOverElement.style.position = 'absolute';
        gameOverElement.style.top = '50%';
        gameOverElement.style.left = '50%';
        gameOverElement.style.transform = 'translate(-50%, -50%)';
        gameOverElement.style.fontSize = '48px';
        gameOverElement.style.color = 'red';
        gameOverElement.textContent = 'Game Over';
        document.body.appendChild(gameOverElement);
    };
}
window.addEventListener("DOMContentLoaded", init);
function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(640, 480, new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(13, 13, 13));
    document.body.appendChild(viewport);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_cannon-es_dist_cannon-es_js-node_modules_three_examples_jsm_controls_Orb-e58bd2"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuSixhQUFhLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFck0sY0FBYyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwSixjQUFjLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFdE0sWUFBWSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsSixZQUFZLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFcE0sYUFBYSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuSixhQUFhLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFck0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO2dCQUN2QyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQzFELElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEcsQ0FBQyxDQUFDLENBQUM7WUFFSCwyQkFBMkI7WUFDM0IsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRTtnQkFDeEcsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7b0JBQ25CLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO2lCQUNsQztnQkFDRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQzthQUN4QjtZQUVELHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFDRCxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUc5QixpQkFBaUI7UUFDakIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFDTyxjQUFjLEdBQUcsR0FBRyxFQUFFO1FBQzFCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztRQUNsRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUM7UUFDekMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO1FBQzFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQztRQUM5QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7UUFDNUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFFakQsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUMsQ0FBQyxrQkFBa0I7UUFDM0MsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsR0FBRyxTQUFTLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUVsRSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUU7WUFDN0MsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3JCLElBQUksSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLEVBQUU7Z0JBQ3hCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDdkIsT0FBTzthQUNWO1lBQ0QsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDbEMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2IsQ0FBQyxDQUFDO0lBRUssWUFBWSxHQUFHLEdBQUcsRUFBRTtRQUN2QixJQUFJLElBQUksQ0FBQyxpQkFBaUIsS0FBSyxJQUFJLEVBQUU7WUFDakMsYUFBYSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7WUFDOUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7WUFDdkIsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7U0FDakM7SUFDTCxDQUFDO0lBRU8sc0JBQXNCLEdBQUcsR0FBRyxFQUFFO1FBQ2xDLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQ3ZCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEdBQUcsU0FBUyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDckU7SUFDTCxDQUFDO0lBRU8sYUFBYSxHQUFHLEdBQUcsRUFBRTtRQUN6QixJQUFJLElBQUksQ0FBQyxpQkFBaUIsS0FBSyxJQUFJLEVBQUU7WUFDakMsYUFBYSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7U0FDakM7SUFDTCxDQUFDO0lBQ08sWUFBWSxHQUFHLEdBQUcsRUFBRTtRQUN4QixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztRQUN6QyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUMvQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUVuRCxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDbEQsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDM0QsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDbkUsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ08saUJBQWlCLEdBQUcsQ0FBQyxHQUFnQixFQUFpQixFQUFFO1FBQzVELE9BQU8sSUFBSSwwQ0FBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVPLGlCQUFpQixHQUFHLENBQUMsR0FBa0IsRUFBZSxFQUFFO1FBQzVELE9BQU8sSUFBSSwyQ0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVPLGlCQUFpQixHQUFHLENBQUMsSUFBc0IsRUFBcUIsRUFBRTtRQUN0RSxPQUFPLElBQUksaURBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFHTyxlQUFlLEdBQUcsR0FBRyxFQUFFO1FBQzNCLE1BQU0sV0FBVyxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNoRCxNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFDdkIsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDO1FBRXJCLE1BQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQztRQUN6QixNQUFNLG9CQUFvQixHQUFHLEVBQUUsQ0FBQyxZQUFXO1FBRTNDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbEMsSUFBSSxRQUFxQixDQUFDO1lBQzFCLElBQUksYUFBYSxHQUFHLEtBQUssQ0FBQztZQUMxQixNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUM7WUFFeEIsS0FBSyxJQUFJLE9BQU8sR0FBRyxDQUFDLEVBQUUsT0FBTyxHQUFHLFdBQVcsRUFBRSxPQUFPLEVBQUUsRUFBRTtnQkFDcEQsUUFBUSxHQUFHLElBQUksMkNBQVcsQ0FDdEIsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLFFBQVEsR0FBRyxRQUFRLEdBQUcsQ0FBQyxFQUN2QyxZQUFZLEVBQ1osSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLFFBQVEsR0FBRyxRQUFRLEdBQUcsQ0FBQyxDQUMxQyxDQUFDO2dCQUVGLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQ3RCLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDN0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQ2hFLENBQUM7Z0JBRUYsSUFBSSxRQUFRLEdBQUcsb0JBQW9CLEVBQUU7b0JBQ2pDLGFBQWEsR0FBRyxJQUFJLENBQUM7b0JBQ3JCLE1BQU07aUJBQ1Q7YUFDSjtZQUVELElBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQ2hCLE9BQU8sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLFNBQVM7YUFDWjtZQUVELE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN6RSxJQUFJLEtBQW1CLENBQUM7WUFDeEIsSUFBSSxRQUE4QixDQUFDO1lBRW5DLFFBQVEsSUFBSSxFQUFFO2dCQUNWLEtBQUssTUFBTTtvQkFDUCxLQUFLLEdBQUcsSUFBSSwrQ0FBZSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUMxQyxRQUFRLEdBQUcsSUFBSSwrQ0FBa0IsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUM3QyxNQUFNO2dCQUNWLEtBQUssS0FBSztvQkFDTixLQUFLLEdBQUcsSUFBSSwwQ0FBVSxDQUFDLElBQUksMkNBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHO29CQUNyRCxRQUFRLEdBQUcsSUFBSSw4Q0FBaUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUMxQyxNQUFNO2dCQUNWLEtBQUssVUFBVTtvQkFDWCxLQUFLLEdBQUcsSUFBSSwrQ0FBZSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUMxQyxRQUFRLEdBQUcsSUFBSSxtREFBc0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDcEQsTUFBTTtnQkFDVjtvQkFDSSxTQUFTO2FBQ2hCO1lBRUQsTUFBTSxJQUFJLEdBQUcsSUFBSSwyQ0FBVyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDMUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNyQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUU3QixNQUFNLFFBQVEsR0FBRyxJQUFJLHFEQUF3QixFQUFFLENBQUM7WUFDaEQsTUFBTSxJQUFJLEdBQUcsSUFBSSx1Q0FBVSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUVoRCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVyQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1NBQ3hDO0lBQ0wsQ0FBQztJQUdPLHVCQUF1QixHQUFHLEdBQUcsRUFBRTtRQUNuQyxJQUFJLElBQUksQ0FBQyxXQUFXO1lBQUUsT0FBTyxDQUFDLDRCQUE0QjtRQUUxRCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxpQkFBaUI7UUFFdkMsZUFBZTtRQUNmLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1FBRXhCLHFCQUFxQjtRQUNyQixNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pELFVBQVUsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQ2hDLFVBQVUsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztRQUNwQyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUM7UUFDN0IsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQzlCLFVBQVUsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLHVCQUF1QixDQUFDO1FBQ3JELFVBQVUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUNsQyxVQUFVLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxvQkFBb0IsQ0FBQztRQUN4RCxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7UUFDakMsVUFBVSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ2xDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzFDLENBQUMsQ0FBQztJQUNGLG1CQUFtQjtJQUNYLGVBQWUsR0FBRyxHQUFHLEVBQUU7UUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDckIsTUFBTSxlQUFlLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0RCxlQUFlLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7UUFDNUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDO1FBQ2xDLGVBQWUsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUNuQyxlQUFlLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyx1QkFBdUIsQ0FBQztRQUMxRCxlQUFlLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUM7UUFDeEMsZUFBZSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ3BDLGVBQWUsQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQzFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQy9DLENBQUM7Q0FFSjtBQUVELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUVsRCxTQUFTLElBQUk7SUFDVCxJQUFJLFNBQVMsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7SUFDdkMsSUFBSSxRQUFRLEdBQUcsU0FBUyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSwwQ0FBYSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNwRixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN4QyxDQUFDOzs7Ozs7O1VDdmFEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7Ozs7V0N6QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSwrQkFBK0Isd0NBQXdDO1dBQ3ZFO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUJBQWlCLHFCQUFxQjtXQUN0QztXQUNBO1dBQ0Esa0JBQWtCLHFCQUFxQjtXQUN2QztXQUNBO1dBQ0EsS0FBSztXQUNMO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0MzQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xyXG5pbXBvcnQgKiBhcyBDQU5OT04gZnJvbSAnY2Fubm9uLWVzJztcclxuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9sc1wiO1xyXG5cclxuY2xhc3MgVGhyZWVKU0NvbnRhaW5lciB7XHJcbiAgICBwcml2YXRlIHNjZW5lOiBUSFJFRS5TY2VuZTtcclxuICAgIHByaXZhdGUgbGlnaHQ6IFRIUkVFLkxpZ2h0O1xyXG4gICAgcHJpdmF0ZSB3b3JsZDogQ0FOTk9OLldvcmxkO1xyXG4gICAgcHJpdmF0ZSBzeW5jTWVzaGVzOiB7IGJvZHk6IENBTk5PTi5Cb2R5LCBtZXNoOiBUSFJFRS5NZXNoIH1bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSB2ZWhpY2xlOiBDQU5OT04uUmlnaWRWZWhpY2xlO1xyXG4gICAgcHJpdmF0ZSBnYW1lT3ZlcjogYm9vbGVhbiA9IGZhbHNlOyAvLyDjgrLjg7zjg6Djgqrjg7zjg5Djg7zjg5Xjg6njgrBcclxuICAgIHByaXZhdGUgZ2FtZUNsZWFyZWQ6IGJvb2xlYW4gPSBmYWxzZTsgLy8g44Ky44O844Og44Kv44Oq44Ki44OV44Op44KwXHJcbiAgICBwcml2YXRlIHBsYW5lQm91bmRhcnk6IG51bWJlciA9IDUwOyAvLyDlubPpnaLjga7looPnlYxcclxuICAgIHByaXZhdGUgaW5pdGlhbENhclBvc2l0aW9uOiBDQU5OT04uVmVjMztcclxuICAgIHByaXZhdGUgaW5pdGlhbENhclF1YXRlcm5pb246IENBTk5PTi5RdWF0ZXJuaW9uO1xyXG4gICAgcHJpdmF0ZSBpbml0aWFsV2hlZWxQb3NpdGlvbnM6IENBTk5PTi5WZWMzW107XHJcbiAgICBwcml2YXRlIGluaXRpYWxXaGVlbFF1YXRlcm5pb25zOiBDQU5OT04uUXVhdGVybmlvbltdO1xyXG4gICAgcHJpdmF0ZSBjb3VudGRvd25FbGVtZW50OiBIVE1MRGl2RWxlbWVudDsgLy8g44Kr44Km44Oz44OI44OA44Km44Oz6KGo56S655So44Gu6KaB57SgXHJcbiAgICBwcml2YXRlIGNvdW50ZG93blRpbWU6IG51bWJlciA9IDYwOyAvLyDjgqvjgqbjg7Pjg4jjg4Djgqbjg7Pjga7liJ3mnJ/mmYLplpPvvIjnp5LvvIlcclxuICAgIHByaXZhdGUgY291bnRkb3duSW50ZXJ2YWw6IG51bWJlciB8IG51bGwgPSBudWxsOy8vIOOCq+OCpuODs+ODiOODgOOCpuODs+OBruOCpOODs+OCv+ODvOODkOODq0lEXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsQ2FyUG9zaXRpb24gPSBuZXcgQ0FOTk9OLlZlYzMoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxDYXJRdWF0ZXJuaW9uID0gbmV3IENBTk5PTi5RdWF0ZXJuaW9uKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsV2hlZWxQb3NpdGlvbnMgPSBbXTtcclxuICAgICAgICB0aGlzLmluaXRpYWxXaGVlbFF1YXRlcm5pb25zID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZVJlbmRlcmVyRE9NID0gKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBjYW1lcmFQb3M6IFRIUkVFLlZlY3RvcjMpID0+IHtcclxuICAgICAgICBjb25zdCByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKCk7XHJcbiAgICAgICAgcmVuZGVyZXIuc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICByZW5kZXJlci5zZXRDbGVhckNvbG9yKG5ldyBUSFJFRS5Db2xvcigweDQ5NWVkKSk7XHJcbiAgICAgICAgcmVuZGVyZXIuc2hhZG93TWFwLmVuYWJsZWQgPSB0cnVlOyAvL+OCt+ODo+ODieOCpuODnuODg+ODl+OCkuacieWKueOBq+OBmeOCi1xyXG5cclxuICAgICAgICBjb25zdCBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIHdpZHRoIC8gaGVpZ2h0LCAwLjEsIDEwMDApO1xyXG4gICAgICAgIGNhbWVyYS5wb3NpdGlvbi5jb3B5KGNhbWVyYVBvcyk7XHJcbiAgICAgICAgY2FtZXJhLmxvb2tBdChuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAwKSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG9yYml0Q29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZVNjZW5lKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHJlbmRlcjogRnJhbWVSZXF1ZXN0Q2FsbGJhY2sgPSAodGltZSkgPT4ge1xyXG4gICAgICAgICAgICBvcmJpdENvbnRyb2xzLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICByZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSwgY2FtZXJhKTtcclxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xyXG5cclxuICAgICAgICByZW5kZXJlci5kb21FbGVtZW50LnN0eWxlLmNzc0Zsb2F0ID0gXCJsZWZ0XCI7XHJcbiAgICAgICAgcmVuZGVyZXIuZG9tRWxlbWVudC5zdHlsZS5tYXJnaW4gPSBcIjEwcHhcIjtcclxuICAgICAgICByZXR1cm4gcmVuZGVyZXIuZG9tRWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVNjZW5lID0gKCkgPT4ge1xyXG4gICAgICAgIHRoaXMud29ybGQgPSBuZXcgQ0FOTk9OLldvcmxkKHsgZ3Jhdml0eTogbmV3IENBTk5PTi5WZWMzKDAsIC05LjgyLCAwKSB9KTtcclxuICAgICAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XHJcbiAgICAgICAgdGhpcy53b3JsZC5kZWZhdWx0Q29udGFjdE1hdGVyaWFsLnJlc3RpdHV0aW9uID0gMC44O1xyXG4gICAgICAgIHRoaXMud29ybGQuZGVmYXVsdENvbnRhY3RNYXRlcmlhbC5mcmljdGlvbiA9IDAuMDM7XHJcblxyXG4gICAgICAgIC8vIOODhuOCr+OCueODgeODo+OBruiqreOBv+i+vOOBv1xyXG4gICAgICAgIGNvbnN0IHRleHR1cmVMb2FkZXIgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcigpO1xyXG4gICAgICAgIGNvbnN0IGNhclRleHR1cmUgPSB0ZXh0dXJlTG9hZGVyLmxvYWQoJ2Nhci5wbmcnKTsgLy8g55S75YOP44Gu44OR44K544KS5oyH5a6aXHJcblxyXG5cclxuICAgICAgICBjb25zdCBjYXJCb2R5ID0gbmV3IENBTk5PTi5Cb2R5KHsgbWFzczogMTAgfSk7XHJcbiAgICAgICAgY29uc3QgY2FyQm9keVNoYXBlID0gbmV3IENBTk5PTi5Cb3gobmV3IENBTk5PTi5WZWMzKDQsIDAuNSwgMikpO1xyXG4gICAgICAgIGNhckJvZHkuYWRkU2hhcGUoY2FyQm9keVNoYXBlKTtcclxuICAgICAgICBjYXJCb2R5LnBvc2l0aW9uLnkgPSAxO1xyXG4gICAgICAgIHRoaXMudmVoaWNsZSA9IG5ldyBDQU5OT04uUmlnaWRWZWhpY2xlKHsgY2hhc3Npc0JvZHk6IGNhckJvZHkgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHdoZWVsU2hhcGUgPSBuZXcgQ0FOTk9OLlNwaGVyZSgxKTtcclxuICAgICAgICBjb25zdCBjcmVhdGVXaGVlbEJvZHkgPSAobWFzczogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHdoZWVsQm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3MgfSk7XHJcbiAgICAgICAgICAgIHdoZWVsQm9keS5hZGRTaGFwZSh3aGVlbFNoYXBlKTtcclxuICAgICAgICAgICAgd2hlZWxCb2R5LmFuZ3VsYXJEYW1waW5nID0gMC40O1xyXG4gICAgICAgICAgICByZXR1cm4gd2hlZWxCb2R5O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGZyb250TGVmdFdoZWVsID0gY3JlYXRlV2hlZWxCb2R5KDEpO1xyXG4gICAgICAgIGNvbnN0IGZyb250UmlnaHRXaGVlbCA9IGNyZWF0ZVdoZWVsQm9keSgxKTtcclxuICAgICAgICBjb25zdCByZWFyTGVmdFdoZWVsID0gY3JlYXRlV2hlZWxCb2R5KDEpO1xyXG4gICAgICAgIGNvbnN0IHJlYXJSaWdodFdoZWVsID0gY3JlYXRlV2hlZWxCb2R5KDEpO1xyXG5cclxuICAgICAgICB0aGlzLnZlaGljbGUuYWRkV2hlZWwoeyBib2R5OiBmcm9udExlZnRXaGVlbCwgcG9zaXRpb246IG5ldyBDQU5OT04uVmVjMygtMiwgMCwgMi41KSB9KTtcclxuICAgICAgICB0aGlzLnZlaGljbGUuYWRkV2hlZWwoeyBib2R5OiBmcm9udFJpZ2h0V2hlZWwsIHBvc2l0aW9uOiBuZXcgQ0FOTk9OLlZlYzMoLTIsIDAsIC0yLjUpIH0pO1xyXG4gICAgICAgIHRoaXMudmVoaWNsZS5hZGRXaGVlbCh7IGJvZHk6IHJlYXJMZWZ0V2hlZWwsIHBvc2l0aW9uOiBuZXcgQ0FOTk9OLlZlYzMoMiwgMCwgMi41KSB9KTtcclxuICAgICAgICB0aGlzLnZlaGljbGUuYWRkV2hlZWwoeyBib2R5OiByZWFyUmlnaHRXaGVlbCwgcG9zaXRpb246IG5ldyBDQU5OT04uVmVjMygyLCAwLCAtMi41KSB9KTtcclxuXHJcbiAgICAgICAgdGhpcy52ZWhpY2xlLmFkZFRvV29ybGQodGhpcy53b3JsZCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGJveEdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KDgsIDEsIDQpO1xyXG4gICAgICAgIC8vIOi7iuS9k+OBruODnuODhuODquOCouODq+OCkuS9nOaIkFxyXG4gICAgICAgIGNvbnN0IGJveE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgbWFwOiBjYXJUZXh0dXJlIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBib3hNZXNoID0gbmV3IFRIUkVFLk1lc2goYm94R2VvbWV0cnksIGJveE1hdGVyaWFsKTtcclxuICAgICAgICB0aGlzLnNjZW5lLmFkZChib3hNZXNoKTtcclxuXHJcbiAgICAgICAgY29uc3Qgd2hlZWxHZW9tZXRyeSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgwLjUpO1xyXG4gICAgICAgIGNvbnN0IHdoZWVsTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7IGNvbG9yOiAweDBEMDExNiB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgY3JlYXRlV2hlZWxNZXNoID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB3aGVlbE1lc2ggPSBuZXcgVEhSRUUuTWVzaCh3aGVlbEdlb21ldHJ5LCB3aGVlbE1hdGVyaWFsKTtcclxuICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQod2hlZWxNZXNoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHdoZWVsTWVzaDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBmcm9udExlZnRNZXNoID0gY3JlYXRlV2hlZWxNZXNoKCk7XHJcbiAgICAgICAgY29uc3QgZnJvbnRSaWdodE1lc2ggPSBjcmVhdGVXaGVlbE1lc2goKTtcclxuICAgICAgICBjb25zdCByZWFyTGVmdE1lc2ggPSBjcmVhdGVXaGVlbE1lc2goKTtcclxuICAgICAgICBjb25zdCByZWFyUmlnaHRNZXNoID0gY3JlYXRlV2hlZWxNZXNoKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBob25nTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoKTtcclxuICAgICAgICBjb25zdCBwbGFuZUdlb21ldHJ5ID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoMTAwLCAxMDApO1xyXG4gICAgICAgIGNvbnN0IHBsYW5lTWVzaCA9IG5ldyBUSFJFRS5NZXNoKHBsYW5lR2VvbWV0cnksIHBob25nTWF0ZXJpYWwpO1xyXG4gICAgICAgIHBsYW5lTWVzaC5tYXRlcmlhbC5zaWRlID0gVEhSRUUuRG91YmxlU2lkZTtcclxuICAgICAgICBwbGFuZU1lc2gucm90YXRlWCgtTWF0aC5QSSAvIDIpO1xyXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHBsYW5lTWVzaCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBsYW5lU2hhcGUgPSBuZXcgQ0FOTk9OLlBsYW5lKCk7XHJcbiAgICAgICAgY29uc3QgcGxhbmVCb2R5ID0gbmV3IENBTk5PTi5Cb2R5KHsgbWFzczogMCB9KTtcclxuICAgICAgICBwbGFuZUJvZHkuYWRkU2hhcGUocGxhbmVTaGFwZSk7XHJcbiAgICAgICAgcGxhbmVCb2R5LnBvc2l0aW9uLmNvcHkodGhpcy50aHJlZVRvQ2Fubm9uVmVjMyhwbGFuZU1lc2gucG9zaXRpb24pKTtcclxuICAgICAgICBwbGFuZUJvZHkucXVhdGVybmlvbi5jb3B5KHRoaXMudGhyZWVUb0Nhbm5vblF1YXQocGxhbmVNZXNoLnF1YXRlcm5pb24pKTtcclxuICAgICAgICB0aGlzLndvcmxkLmFkZEJvZHkocGxhbmVCb2R5KTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRSYW5kb21PYmplY3QoKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbENhclBvc2l0aW9uLmNvcHkoY2FyQm9keS5wb3NpdGlvbik7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsQ2FyUXVhdGVybmlvbi5jb3B5KGNhckJvZHkucXVhdGVybmlvbik7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsV2hlZWxQb3NpdGlvbnMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBDQU5OT04uVmVjMygtMiwgMCwgMi41KSxcclxuICAgICAgICAgICAgbmV3IENBTk5PTi5WZWMzKC0yLCAwLCAtMi41KSxcclxuICAgICAgICAgICAgbmV3IENBTk5PTi5WZWMzKDIsIDAsIDIuNSksXHJcbiAgICAgICAgICAgIG5ldyBDQU5OT04uVmVjMygyLCAwLCAtMi41KVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgdGhpcy5pbml0aWFsV2hlZWxRdWF0ZXJuaW9ucyA9IFtcclxuICAgICAgICAgICAgbmV3IENBTk5PTi5RdWF0ZXJuaW9uKCksXHJcbiAgICAgICAgICAgIG5ldyBDQU5OT04uUXVhdGVybmlvbigpLFxyXG4gICAgICAgICAgICBuZXcgQ0FOTk9OLlF1YXRlcm5pb24oKSxcclxuICAgICAgICAgICAgbmV3IENBTk5PTi5RdWF0ZXJuaW9uKClcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoZXZlbnQua2V5KSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd1VwJzpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZlaGljbGUuc2V0V2hlZWxGb3JjZSgyMCwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZWhpY2xlLnNldFdoZWVsRm9yY2UoMjAsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVoaWNsZS5zZXRXaGVlbEZvcmNlKDIwLCAyKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZlaGljbGUuc2V0V2hlZWxGb3JjZSgyMCwgMyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd0Rvd24nOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVoaWNsZS5zZXRXaGVlbEZvcmNlKC0yMCwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZWhpY2xlLnNldFdoZWVsRm9yY2UoLTIwLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZlaGljbGUuc2V0V2hlZWxGb3JjZSgtMjAsIDIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVoaWNsZS5zZXRXaGVlbEZvcmNlKC0yMCwgMyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd0xlZnQnOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVoaWNsZS5zZXRXaGVlbEZvcmNlKC0xMCwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZWhpY2xlLnNldFdoZWVsRm9yY2UoMjAsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVoaWNsZS5zZXRXaGVlbEZvcmNlKC0xMCwgMik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZWhpY2xlLnNldFdoZWVsRm9yY2UoMjAsIDMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dSaWdodCc6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZWhpY2xlLnNldFdoZWVsRm9yY2UoMjAsIDApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVoaWNsZS5zZXRXaGVlbEZvcmNlKC0xMCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZWhpY2xlLnNldFdoZWVsRm9yY2UoMjAsIDIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVoaWNsZS5zZXRXaGVlbEZvcmNlKC0xMCwgMyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdyJzpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc2V0VmVoaWNsZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgLy8gY2FzZSAncyc6XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgdGhpcy5yZXNldENhcigpO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnZlaGljbGUuc2V0V2hlZWxGb3JjZSgwLCAwKTtcclxuICAgICAgICAgICAgdGhpcy52ZWhpY2xlLnNldFdoZWVsRm9yY2UoMCwgMSk7XHJcbiAgICAgICAgICAgIHRoaXMudmVoaWNsZS5zZXRXaGVlbEZvcmNlKDAsIDIpO1xyXG4gICAgICAgICAgICB0aGlzLnZlaGljbGUuc2V0V2hlZWxGb3JjZSgwLCAzKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgZ3JpZEhlbHBlciA9IG5ldyBUSFJFRS5HcmlkSGVscGVyKDEwKTtcclxuICAgICAgICB0aGlzLnNjZW5lLmFkZChncmlkSGVscGVyKTtcclxuXHJcbiAgICAgICAgY29uc3QgYXhlc0hlbHBlciA9IG5ldyBUSFJFRS5BeGVzSGVscGVyKDUpO1xyXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGF4ZXNIZWxwZXIpO1xyXG5cclxuICAgICAgICB0aGlzLmxpZ2h0ID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYpO1xyXG4gICAgICAgIGNvbnN0IGx2ZWMgPSBuZXcgVEhSRUUuVmVjdG9yMygxLCAxLCAxKS5ub3JtYWxpemUoKTtcclxuICAgICAgICB0aGlzLmxpZ2h0LnBvc2l0aW9uLnNldChsdmVjLngsIGx2ZWMueSwgbHZlYy56KTtcclxuICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmxpZ2h0KTtcclxuXHJcblxyXG5cclxuICAgICAgICBsZXQgdXBkYXRlOiBGcmFtZVJlcXVlc3RDYWxsYmFjayA9ICh0aW1lKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdhbWVPdmVyIHx8IHRoaXMuZ2FtZUNsZWFyZWQpIHJldHVybjsgLy8g44Ky44O844Og44Kq44O844OQ44O844GL44Ky44O844Og44Kv44Oq44Ki44Gq44KJ5Yem55CG44KS5YGc5q2iXHJcblxyXG4gICAgICAgICAgICB0aGlzLndvcmxkLmZpeGVkU3RlcCgpO1xyXG5cclxuICAgICAgICAgICAgLy8g6LuK5L2T44Go44Ob44Kk44O844Or44Gu5L2N572u44Go5Zue6Lui44KS5ZCM5pyfXHJcbiAgICAgICAgICAgIGJveE1lc2gucG9zaXRpb24uc2V0KGNhckJvZHkucG9zaXRpb24ueCwgY2FyQm9keS5wb3NpdGlvbi55LCBjYXJCb2R5LnBvc2l0aW9uLnopO1xyXG4gICAgICAgICAgICBib3hNZXNoLnF1YXRlcm5pb24uc2V0KGNhckJvZHkucXVhdGVybmlvbi54LCBjYXJCb2R5LnF1YXRlcm5pb24ueSwgY2FyQm9keS5xdWF0ZXJuaW9uLnosIGNhckJvZHkucXVhdGVybmlvbi53KTtcclxuXHJcbiAgICAgICAgICAgIGZyb250TGVmdE1lc2gucG9zaXRpb24uc2V0KHRoaXMudmVoaWNsZS53aGVlbEJvZGllc1swXS5wb3NpdGlvbi54LCB0aGlzLnZlaGljbGUud2hlZWxCb2RpZXNbMF0ucG9zaXRpb24ueSwgdGhpcy52ZWhpY2xlLndoZWVsQm9kaWVzWzBdLnBvc2l0aW9uLnopO1xyXG4gICAgICAgICAgICBmcm9udExlZnRNZXNoLnF1YXRlcm5pb24uc2V0KHRoaXMudmVoaWNsZS53aGVlbEJvZGllc1swXS5xdWF0ZXJuaW9uLngsIHRoaXMudmVoaWNsZS53aGVlbEJvZGllc1swXS5xdWF0ZXJuaW9uLnksIHRoaXMudmVoaWNsZS53aGVlbEJvZGllc1swXS5xdWF0ZXJuaW9uLnosIHRoaXMudmVoaWNsZS53aGVlbEJvZGllc1swXS5xdWF0ZXJuaW9uLncpO1xyXG5cclxuICAgICAgICAgICAgZnJvbnRSaWdodE1lc2gucG9zaXRpb24uc2V0KHRoaXMudmVoaWNsZS53aGVlbEJvZGllc1sxXS5wb3NpdGlvbi54LCB0aGlzLnZlaGljbGUud2hlZWxCb2RpZXNbMV0ucG9zaXRpb24ueSwgdGhpcy52ZWhpY2xlLndoZWVsQm9kaWVzWzFdLnBvc2l0aW9uLnopO1xyXG4gICAgICAgICAgICBmcm9udFJpZ2h0TWVzaC5xdWF0ZXJuaW9uLnNldCh0aGlzLnZlaGljbGUud2hlZWxCb2RpZXNbMV0ucXVhdGVybmlvbi54LCB0aGlzLnZlaGljbGUud2hlZWxCb2RpZXNbMV0ucXVhdGVybmlvbi55LCB0aGlzLnZlaGljbGUud2hlZWxCb2RpZXNbMV0ucXVhdGVybmlvbi56LCB0aGlzLnZlaGljbGUud2hlZWxCb2RpZXNbMV0ucXVhdGVybmlvbi53KTtcclxuXHJcbiAgICAgICAgICAgIHJlYXJMZWZ0TWVzaC5wb3NpdGlvbi5zZXQodGhpcy52ZWhpY2xlLndoZWVsQm9kaWVzWzJdLnBvc2l0aW9uLngsIHRoaXMudmVoaWNsZS53aGVlbEJvZGllc1syXS5wb3NpdGlvbi55LCB0aGlzLnZlaGljbGUud2hlZWxCb2RpZXNbMl0ucG9zaXRpb24ueik7XHJcbiAgICAgICAgICAgIHJlYXJMZWZ0TWVzaC5xdWF0ZXJuaW9uLnNldCh0aGlzLnZlaGljbGUud2hlZWxCb2RpZXNbMl0ucXVhdGVybmlvbi54LCB0aGlzLnZlaGljbGUud2hlZWxCb2RpZXNbMl0ucXVhdGVybmlvbi55LCB0aGlzLnZlaGljbGUud2hlZWxCb2RpZXNbMl0ucXVhdGVybmlvbi56LCB0aGlzLnZlaGljbGUud2hlZWxCb2RpZXNbMl0ucXVhdGVybmlvbi53KTtcclxuXHJcbiAgICAgICAgICAgIHJlYXJSaWdodE1lc2gucG9zaXRpb24uc2V0KHRoaXMudmVoaWNsZS53aGVlbEJvZGllc1szXS5wb3NpdGlvbi54LCB0aGlzLnZlaGljbGUud2hlZWxCb2RpZXNbM10ucG9zaXRpb24ueSwgdGhpcy52ZWhpY2xlLndoZWVsQm9kaWVzWzNdLnBvc2l0aW9uLnopO1xyXG4gICAgICAgICAgICByZWFyUmlnaHRNZXNoLnF1YXRlcm5pb24uc2V0KHRoaXMudmVoaWNsZS53aGVlbEJvZGllc1szXS5xdWF0ZXJuaW9uLngsIHRoaXMudmVoaWNsZS53aGVlbEJvZGllc1szXS5xdWF0ZXJuaW9uLnksIHRoaXMudmVoaWNsZS53aGVlbEJvZGllc1szXS5xdWF0ZXJuaW9uLnosIHRoaXMudmVoaWNsZS53aGVlbEJvZGllc1szXS5xdWF0ZXJuaW9uLncpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zeW5jTWVzaGVzLmZvckVhY2goKHsgYm9keSwgbWVzaCB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBtZXNoLnBvc2l0aW9uLmNvcHkodGhpcy5jYW5ub25WZWMzVG9UaHJlZShib2R5LnBvc2l0aW9uKSk7XHJcbiAgICAgICAgICAgICAgICBtZXNoLnF1YXRlcm5pb24uc2V0KGJvZHkucXVhdGVybmlvbi54LCBib2R5LnF1YXRlcm5pb24ueSwgYm9keS5xdWF0ZXJuaW9uLnosIGJvZHkucXVhdGVybmlvbi53KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyDjgrLjg7zjg6Djgq/jg6rjgqLjgb7jgZ/jga/jgrLjg7zjg6Djgqrjg7zjg5Djg7zjga7mnaHku7bjgpLjg4Hjgqfjg4Pjgq9cclxuICAgICAgICAgICAgaWYgKE1hdGguYWJzKGNhckJvZHkucG9zaXRpb24ueCkgPiB0aGlzLnBsYW5lQm91bmRhcnkgfHwgTWF0aC5hYnMoY2FyQm9keS5wb3NpdGlvbi56KSA+IHRoaXMucGxhbmVCb3VuZGFyeSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmdhbWVDbGVhcmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5R2FtZUNsZWFyTWVzc2FnZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lT3ZlciA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcclxuXHJcblxyXG4gICAgICAgIC8vIOOCq+OCpuODs+ODiOODgOOCpuODs+OCv+OCpOODnuODvOOCkumWi+Wni1xyXG4gICAgICAgIHRoaXMuc3RhcnRDb3VudGRvd24oKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc3RhcnRDb3VudGRvd24gPSAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5jb3VudGRvd25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdGhpcy5jb3VudGRvd25FbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuICAgICAgICB0aGlzLmNvdW50ZG93bkVsZW1lbnQuc3R5bGUudG9wID0gJzIwcHgnO1xyXG4gICAgICAgIHRoaXMuY291bnRkb3duRWxlbWVudC5zdHlsZS5sZWZ0ID0gJzIwcHgnO1xyXG4gICAgICAgIHRoaXMuY291bnRkb3duRWxlbWVudC5zdHlsZS5mb250U2l6ZSA9ICcyNHB4JztcclxuICAgICAgICB0aGlzLmNvdW50ZG93bkVsZW1lbnQuc3R5bGUuY29sb3IgPSAnd2hpdGUnO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jb3VudGRvd25FbGVtZW50KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb3VudGRvd25UaW1lID0gNjA7IC8vIOOCq+OCpuODs+ODiOODgOOCpuODs+OBruWIneacn+aZgumWk+OCkuioreWumlxyXG4gICAgICAgIHRoaXMuY291bnRkb3duRWxlbWVudC50ZXh0Q29udGVudCA9IGBUaW1lOiAke3RoaXMuY291bnRkb3duVGltZX1gO1xyXG5cclxuICAgICAgICB0aGlzLmNvdW50ZG93bkludGVydmFsID0gd2luZG93LnNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jb3VudGRvd25UaW1lLS07XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvdW50ZG93blRpbWUgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXlHYW1lT3ZlcigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ291bnRkb3duRGlzcGxheSgpO1xyXG4gICAgICAgIH0sIDEwMDApO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgZW5kQ291bnRkb3duID0gKCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmNvdW50ZG93bkludGVydmFsICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5jb3VudGRvd25JbnRlcnZhbCk7XHJcbiAgICAgICAgICAgIHRoaXMuY291bnRkb3duSW50ZXJ2YWwgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLmNvdW50ZG93blRpbWUgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUNvdW50ZG93bkRpc3BsYXkoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVDb3VudGRvd25EaXNwbGF5ID0gKCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmNvdW50ZG93bkVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5jb3VudGRvd25FbGVtZW50LnRleHRDb250ZW50ID0gYFRpbWU6ICR7dGhpcy5jb3VudGRvd25UaW1lfWA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RvcENvdW50ZG93biA9ICgpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5jb3VudGRvd25JbnRlcnZhbCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuY291bnRkb3duSW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICB0aGlzLmNvdW50ZG93bkludGVydmFsID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJlc2V0VmVoaWNsZSA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBjYXJCb2R5ID0gdGhpcy52ZWhpY2xlLmNoYXNzaXNCb2R5O1xyXG4gICAgICAgIGNhckJvZHkucG9zaXRpb24uY29weSh0aGlzLmluaXRpYWxDYXJQb3NpdGlvbik7XHJcbiAgICAgICAgY2FyQm9keS5xdWF0ZXJuaW9uLmNvcHkodGhpcy5pbml0aWFsQ2FyUXVhdGVybmlvbik7XHJcblxyXG4gICAgICAgIHRoaXMudmVoaWNsZS53aGVlbEJvZGllcy5mb3JFYWNoKCh3aGVlbEJvZHksIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIHdoZWVsQm9keS5wb3NpdGlvbi5jb3B5KHRoaXMuaW5pdGlhbFdoZWVsUG9zaXRpb25zW2luZGV4XSk7XHJcbiAgICAgICAgICAgIHdoZWVsQm9keS5xdWF0ZXJuaW9uLmNvcHkodGhpcy5pbml0aWFsV2hlZWxRdWF0ZXJuaW9uc1tpbmRleF0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjYW5ub25WZWMzVG9UaHJlZSA9ICh2ZWM6IENBTk5PTi5WZWMzKTogVEhSRUUuVmVjdG9yMyA9PiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IzKHZlYy54LCB2ZWMueSwgdmVjLnopO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdGhyZWVUb0Nhbm5vblZlYzMgPSAodmVjOiBUSFJFRS5WZWN0b3IzKTogQ0FOTk9OLlZlYzMgPT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgQ0FOTk9OLlZlYzModmVjLngsIHZlYy55LCB2ZWMueik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB0aHJlZVRvQ2Fubm9uUXVhdCA9IChxdWF0OiBUSFJFRS5RdWF0ZXJuaW9uKTogQ0FOTk9OLlF1YXRlcm5pb24gPT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgQ0FOTk9OLlF1YXRlcm5pb24ocXVhdC54LCBxdWF0LnksIHF1YXQueiwgcXVhdC53KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHJpdmF0ZSBhZGRSYW5kb21PYmplY3QgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgb2JqZWN0VHlwZXMgPSBbJ0NvbmUnLCAnYm94JywgJ2N5bGluZGVyJ107XHJcbiAgICAgICAgY29uc3Qgb2JqZWN0Q291bnQgPSA1NTtcclxuICAgICAgICBjb25zdCBhcmVhU2l6ZSA9IDEwMDtcclxuXHJcbiAgICAgICAgY29uc3QgZ3JvdW5kSGVpZ2h0ID0gMS41O1xyXG4gICAgICAgIGNvbnN0IHJlc3RyaWN0ZWRBcmVhUmFkaXVzID0gMTA7Ly/ooajnpLrjgZXjgZvjgarjgYTjgqjjg6rjgqJcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvYmplY3RDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBwb3NpdGlvbjogQ0FOTk9OLlZlYzM7XHJcbiAgICAgICAgICAgIGxldCB2YWxpZFBvc2l0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNvbnN0IG1heEF0dGVtcHRzID0gMTAwO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgYXR0ZW1wdCA9IDA7IGF0dGVtcHQgPCBtYXhBdHRlbXB0czsgYXR0ZW1wdCsrKSB7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IG5ldyBDQU5OT04uVmVjMyhcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLnJhbmRvbSgpICogYXJlYVNpemUgLSBhcmVhU2l6ZSAvIDIsXHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdW5kSGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGgucmFuZG9tKCkgKiBhcmVhU2l6ZSAtIGFyZWFTaXplIC8gMlxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IE1hdGguc3FydChcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLnBvdyhwb3NpdGlvbi54IC0gdGhpcy52ZWhpY2xlLmNoYXNzaXNCb2R5LnBvc2l0aW9uLngsIDIpICtcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLnBvdyhwb3NpdGlvbi56IC0gdGhpcy52ZWhpY2xlLmNoYXNzaXNCb2R5LnBvc2l0aW9uLnosIDIpXHJcbiAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChkaXN0YW5jZSA+IHJlc3RyaWN0ZWRBcmVhUmFkaXVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRQb3NpdGlvbiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghdmFsaWRQb3NpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCfpmpzlrrPnianjga7mnInlirnjgarkvY3nva7jgYzopovjgaTjgYvjgorjgb7jgZvjgpPjgafjgZfjgZ8nLCBpKTtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0eXBlID0gb2JqZWN0VHlwZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogb2JqZWN0VHlwZXMubGVuZ3RoKV07XHJcbiAgICAgICAgICAgIGxldCBzaGFwZTogQ0FOTk9OLlNoYXBlO1xyXG4gICAgICAgICAgICBsZXQgZ2VvbWV0cnk6IFRIUkVFLkJ1ZmZlckdlb21ldHJ5O1xyXG5cclxuICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdDb25lJzpcclxuICAgICAgICAgICAgICAgICAgICBzaGFwZSA9IG5ldyBDQU5OT04uQ3lsaW5kZXIoNiwgNiwgMTIsIDMyKTtcclxuICAgICAgICAgICAgICAgICAgICBnZW9tZXRyeSA9IG5ldyBUSFJFRS5Db25lR2VvbWV0cnkoNiwgMTIsIDMyKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2JveCc6XHJcbiAgICAgICAgICAgICAgICAgICAgc2hhcGUgPSBuZXcgQ0FOTk9OLkJveChuZXcgQ0FOTk9OLlZlYzMoNCwgNCwgNCkpOyAvLyBcclxuICAgICAgICAgICAgICAgICAgICBnZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSg4LCA4LCA4KTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2N5bGluZGVyJzpcclxuICAgICAgICAgICAgICAgICAgICBzaGFwZSA9IG5ldyBDQU5OT04uQ3lsaW5kZXIoMywgMywgMTIsIDMyKTtcclxuICAgICAgICAgICAgICAgICAgICBnZW9tZXRyeSA9IG5ldyBUSFJFRS5DeWxpbmRlckdlb21ldHJ5KDMsIDMsIDEyLCAzMik7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBib2R5ID0gbmV3IENBTk5PTi5Cb2R5KHsgbWFzczogMCB9KTtcclxuICAgICAgICAgICAgYm9keS5hZGRTaGFwZShzaGFwZSk7XHJcbiAgICAgICAgICAgIGJvZHkucG9zaXRpb24uY29weShwb3NpdGlvbik7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTm9ybWFsTWF0ZXJpYWwoKTtcclxuICAgICAgICAgICAgY29uc3QgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZEJvZHkoYm9keSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKG1lc2gpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zeW5jTWVzaGVzLnB1c2goeyBib2R5LCBtZXNoIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgcHJpdmF0ZSBkaXNwbGF5R2FtZUNsZWFyTWVzc2FnZSA9ICgpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5nYW1lQ2xlYXJlZCkgcmV0dXJuOyAvLyDjgZnjgafjgavjgrLjg7zjg6Djgq/jg6rjgqLjgYzooajnpLrjgZXjgozjgabjgYTjgovloLTlkIjjga/kvZXjgoLjgZfjgarjgYRcclxuXHJcbiAgICAgICAgdGhpcy5zdG9wQ291bnRkb3duKCk7IC8vIOOCq+OCpuODs+ODiOODgOOCpuODs+OCv+OCpOODnuODvOOCkuWBnOatolxyXG5cclxuICAgICAgICAvLyDjgrLjg7zjg6Djgq/jg6rjgqLjg5Xjg6njgrDjgpLoqK3lrppcclxuICAgICAgICB0aGlzLmdhbWVDbGVhcmVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgLy8g44Ky44O844Og44Kv44Oq44Ki44Oh44OD44K744O844K444KS5L2c5oiQ44GX44Gm6KGo56S6XHJcbiAgICAgICAgY29uc3QgbWVzc2FnZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIG1lc3NhZ2VEaXYuaW5uZXJUZXh0ID0gJ+OCsuODvOODoOOCr+ODquOCoic7XHJcbiAgICAgICAgbWVzc2FnZURpdi5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCc7XHJcbiAgICAgICAgbWVzc2FnZURpdi5zdHlsZS50b3AgPSAnNTAlJztcclxuICAgICAgICBtZXNzYWdlRGl2LnN0eWxlLmxlZnQgPSAnNTAlJztcclxuICAgICAgICBtZXNzYWdlRGl2LnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGUoLTUwJSwgLTUwJSknO1xyXG4gICAgICAgIG1lc3NhZ2VEaXYuc3R5bGUucGFkZGluZyA9ICcyMHB4JztcclxuICAgICAgICBtZXNzYWdlRGl2LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdyZ2JhKDAsIDAsIDAsIDAuOCknO1xyXG4gICAgICAgIG1lc3NhZ2VEaXYuc3R5bGUuY29sb3IgPSAnd2hpdGUnO1xyXG4gICAgICAgIG1lc3NhZ2VEaXYuc3R5bGUuZm9udFNpemUgPSAnMmVtJztcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG1lc3NhZ2VEaXYpO1xyXG4gICAgfTtcclxuICAgIC8vIOOCsuODvOODoOOCquODvOODkOODvOOCkuihqOekuuOBmeOCi+ODoeOCveODg+ODiVxyXG4gICAgcHJpdmF0ZSBkaXNwbGF5R2FtZU92ZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5nYW1lT3ZlciA9IHRydWU7XHJcbiAgICAgICAgY29uc3QgZ2FtZU92ZXJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZ2FtZU92ZXJFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuICAgICAgICBnYW1lT3ZlckVsZW1lbnQuc3R5bGUudG9wID0gJzUwJSc7XHJcbiAgICAgICAgZ2FtZU92ZXJFbGVtZW50LnN0eWxlLmxlZnQgPSAnNTAlJztcclxuICAgICAgICBnYW1lT3ZlckVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgtNTAlLCAtNTAlKSc7XHJcbiAgICAgICAgZ2FtZU92ZXJFbGVtZW50LnN0eWxlLmZvbnRTaXplID0gJzQ4cHgnO1xyXG4gICAgICAgIGdhbWVPdmVyRWxlbWVudC5zdHlsZS5jb2xvciA9ICdyZWQnO1xyXG4gICAgICAgIGdhbWVPdmVyRWxlbWVudC50ZXh0Q29udGVudCA9ICdHYW1lIE92ZXInO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZ2FtZU92ZXJFbGVtZW50KTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBpbml0KTtcclxuXHJcbmZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICBsZXQgY29udGFpbmVyID0gbmV3IFRocmVlSlNDb250YWluZXIoKTtcclxuICAgIGxldCB2aWV3cG9ydCA9IGNvbnRhaW5lci5jcmVhdGVSZW5kZXJlckRPTSg2NDAsIDQ4MCwgbmV3IFRIUkVFLlZlY3RvcjMoMTMsIDEzLCAxMykpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh2aWV3cG9ydCk7XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjZ3ByZW5kZXJpbmdcIl0gPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JzLW5vZGVfbW9kdWxlc19jYW5ub24tZXNfZGlzdF9jYW5ub24tZXNfanMtbm9kZV9tb2R1bGVzX3RocmVlX2V4YW1wbGVzX2pzbV9jb250cm9sc19PcmItZTU4YmQyXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2FwcC50c1wiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9