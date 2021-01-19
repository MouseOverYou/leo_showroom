let Showroom, ShowroomLoaderTask, CloudsTask
let Weather_C_ProductsTask, Weather_X_ProductsTask, Weather_S_ProductsTask, Weather_C_P, Weather_X_P

function LoadAssets(scene, assetsManager) {
    //Weather S
    Weather_S_P = new BABYLON.TransformNode("Weather_S_P");
    Weather_S_ProductsTask = assetsManager.addMeshTask("", "", "./assets/weather_s.glb")

    Weather_S_ProductsTask.onSuccess = function (task) {

        task.loadedMeshes[0].position.x = 0
        task.loadedMeshes[0].position.y = 0
        task.loadedMeshes[0].parent = Weather_S_P
    }

    Weather_S_ProductsTask.onError = function (task, message, exception) {
        console.log(message, exception);
    }

    //Weather C
    Weather_C_P = new BABYLON.TransformNode("Weather_C_P");
    Weather_C_ProductsTask = assetsManager.addMeshTask("", "", "./assets/weather_c.glb")

    Weather_C_ProductsTask.onSuccess = function (task) {

        task.loadedMeshes[0].position.x = 0
        task.loadedMeshes[0].position.y = 0
        task.loadedMeshes[0].parent = Weather_C_P
    }

    Weather_C_ProductsTask.onError = function (task, message, exception) {
        console.log(message, exception);
    }

    //Weather X
    Weather_X_P = new BABYLON.TransformNode("Weather_X_P");
    Weather_X_ProductsTask = assetsManager.addMeshTask("", "", "./assets/60DX.glb")

    Weather_X_ProductsTask.onSuccess = function (task) {

        task.loadedMeshes[0].position.x = 0
        task.loadedMeshes[0].position.y = 0
        task.loadedMeshes[0].parent = Weather_X_P
    }

    Weather_X_ProductsTask.onError = function (task, message, exception) {
        console.log(message, exception);
    }

    //CanyonEnvTask
    CanyonEnvTask = assetsManager.addCubeTextureTask("CanyonEnvTask", "./assets/Studio_Softbox_2Umbrellas_cube_specular (1).dds");

    CanyonEnvTask.onSuccess = function (task) {
        hdrTexture = new BABYLON.CubeTexture.CreateFromPrefilteredData(task.texture.name, scene);
        //hdrTexture = task.texture
        hdrTexture.rotationY = 65 * (Math.PI / 180);
        hdrTexture.level = 0.6

        hdrSkyboxMaterial = new BABYLON.PBRMaterial("hdrSkyBox", scene);
        hdrSkyboxMaterial.backFaceCulling = false;
        hdrSkyboxMaterial.reflectionTexture = hdrTexture.clone();
        hdrSkyboxMaterial.reflectionTexture.level = 0.1
        hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        hdrSkyboxMaterial.microSurface = 1.0;
        hdrSkyboxMaterial.disableLighting = false;

        // Create Skybox from hdri
        hdrSkybox = BABYLON.Mesh.CreateBox("hdrSkyBox", 1000.0, scene);
        hdrSkybox.visibility = 0
        hdrSkybox.material = hdrSkyboxMaterial;
        hdrSkybox.infiniteDistance = false;

    }
    CanyonEnvTask.onError = function (task, message, exception) {
        console.log(message, exception);
    }

    //CLoudsTask
    CloudsTask = assetsManager.addCubeTextureTask("CloudsTask", "./assets/TropicalSunnyDay");

    CloudsTask.onSuccess = function (task) {
        cloudsText = task.texture
        var cloudsBox = BABYLON.MeshBuilder.CreateBox("cloudsBox", { size: 500 }, scene);
        var cloudsMat = new BABYLON.StandardMaterial("cloudsMat", scene);
        cloudsMat.backFaceCulling = false;
        cloudsMat.reflectionTexture = cloudsText
        cloudsMat.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        cloudsMat.disableLighting = true;
        cloudsBox.material = cloudsMat;


    }
    CloudsTask.onError = function (task, message, exception) {
        console.log(message, exception);
    }


    Showroom_P = new BABYLON.TransformNode("Showroom_P");
    ShowroomLoaderTask = assetsManager.addMeshTask("", "", "./assets/Leo Showroom Final.glb")

    ShowroomLoaderTask.onSuccess = function (task) {

        task.loadedMeshes[0].position.x = 0
        task.loadedMeshes[0].position.y = 0
        task.loadedMeshes[0].parent = Showroom_P
        Showroom_P.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1)
    }

    ShowroomLoaderTask.onError = function (task, message, exception) {
        console.log(message, exception);
    }


    //FINISH

    var pbr
    assetsManager.onFinish = function (task) {
        ChangeMaterialProperties()
        CreateCustomMaterials()
        AccessModelsForFunctionality()
        AddGlow()
        HandleWebglSetup()

    }
    //Asset Manager check
    assetsManager.onProgress = function (remainingCount, totalCount, lastFinishedTask) {
        engine.loadingUIText = 'We are loading the scene. ' + remainingCount + ' out of ' + totalCount + ' items still need to be loaded.';
        document.getElementsByClassName("text-progress")[0].innerHTML = (100 - remainingCount / totalCount * 100).toFixed() + "%"
    };

    assetsManager.load();
}

const RadarPositions = []
let DiscoverMeshes = []
let ClickableObjects = [];
const AnchorPosition = []
const AnchorLookAt = []
let Ref_Middle_P, MiddleProduct

function AccessModelsForFunctionality() {
    // By  Mesh
    scene.meshes.forEach(elem => {
        //Walker Nav Collisions
        if (elem.name.startsWith("c_")) {
            elem.checkCollisions = true;
            elem.isVisible = false;
        }
        // models seing be raycast
        else if (elem.name.startsWith("p_")) {
            if (elem.name == "p_cubeMain") {
                feedWithCollider(elem, 20, 20, 15, 17)
            }
            else
                feedWithCollider(elem, 80, 40, 80, 0)
        }
        //disable original non baked objects
        else if (elem.name.startsWith("or_")) {
            elem.isVisible = false
        }
        else if (elem.name.startsWith("P_1")) {
            elem.isVisible = false
        }
        //weather c
        else if (elem.name.startsWith("P_2")) {
            
            elem.isVisible = false
            Weather_C_P.position = elem.getAbsolutePosition()
            Weather_C_P.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1)
            Weather_C_P.position.y = 12
            Weather_C_P.rotation.y = 230 * (Math.PI / 180)
            feedWithCollider(Weather_C_P, 200, 75, 100, 0, 25, 0)
            RadarPositions[0] = new BABYLON.Vector3(Weather_C_P.position.x, 12, Weather_C_P.position.z)
        }
        //weather x
        else if (elem.name.startsWith("P_3")) {
            
            elem.isVisible = false
            Weather_X_P.position = elem.getAbsolutePosition()
            Weather_X_P.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1)
            Weather_X_P.position.y = 12
            Weather_X_P.rotation.y = -45 * (Math.PI / 180)
            feedWithCollider(Weather_X_P, 200, 75, 100, 0, 25, 0)
            RadarPositions[1] = new BABYLON.Vector3(Weather_X_P.position.x, 12, Weather_X_P.position.z)
        }
        //weather s
        else if (elem.name.startsWith("P_4")) {
            
            elem.isVisible = false
            Weather_S_P.position = elem.getAbsolutePosition()
            Weather_S_P.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1)
            Weather_S_P.position.y = 12
            Weather_S_P.rotation.y = 230 * (Math.PI / 180)
            feedWithCollider(Weather_S_P, 200, 75, 100, 0, 25, 0)
            RadarPositions[2] = new BABYLON.Vector3(Weather_S_P.position.x, 12, Weather_S_P.position.z)
        }

        // radar discover
        else if (elem.name.startsWith("Discover_")){
            elem.rotationQuaternion = null
            elem.rotation.x = 0 * (Math.PI / 180)
            elem.rotation.y = 0 * (Math.PI / 180)
            elem.rotation.z = 0 * (Math.PI / 180)
            DiscoverMeshes.push(elem)
        }
        else if(elem.name == "Letter o"){
            //feedWithCollider(elem, 10, 15, 12, -2, 0, 4)
        }


    })

    //By Null Node
    scene.transformNodes.forEach(elem => {
        if (elem.name == "New Product") {
            //elem.setEnabled(false)
        }
        else if (elem.name == "Middle New Product") {
            elem.rotationQuaternion = null
            elem.rotation.y = 90 * (Math.PI / 180)
            elem.rotation.z = 90 * (Math.PI / 180)
            MiddleProduct = elem

        }
        else if (elem.name == "Pdf Cloner") {
            elem.getChildren().forEach(mesh => {
                feedWithCollider(mesh, 6, 0.1, 20, 0, 0, 0)
            })
        }
        else if (elem.name == "Station Anchors") {
            elem.getChildren().forEach(mesh => {
                mesh.isVisible = false
                AnchorPosition.push(mesh.getAbsolutePosition())
            })
        }
        else if (elem.name == "Station LookAt") {
            elem.getChildren().forEach(mesh => {
                mesh.isVisible = false
                AnchorLookAt.push(mesh.getAbsolutePosition())
            })
        }
        else if (elem.name == "Area Colliders") {
            elem.getChildren().forEach(mesh => {
                mesh.isVisible = false
                mesh.collisionResponse = true
                //feedWithAreaCollider(mesh, 100, 500, 750, 0, 20, 0)
                scene.registerBeforeRender(function () {
                    if (mesh.intersectsMesh(camcoll, true)) {
                        document.getElementById('debugger-camera-area').innerHTML = mesh.name
                        let n = mesh.name.charAt(0)
                        if(CheckIn(n) && !isAnimatingCam){
                            let indexElem = parseInt(n)
                            let elemID = "go-" + indexElem
                            console.log(indexElem)
                            handleUISelection(document.getElementById(elemID), parseInt(n))
                            //Handle Weather Controls automatically
                            showMenuControl(indexElem)
                        } 
                    }
                });
            })
        }
    })
}

function feedWithCollider(elem, h, w, d, xOffset, yOffset, zOffset) {
    let elemColl = new BABYLON.MeshBuilder.CreateBox("Collider " + elem.name, { height: h, width: w, depth: d }, scene)
    elemColl.position = new BABYLON.Vector3(xOffset, yOffset, zOffset)
    elemColl.parent = elem;
    elemColl.material = colMat;
    elemColl.isPickable = true;
    ClickableObjects.push(elemColl)
}






