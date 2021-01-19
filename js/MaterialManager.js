let woodMat, LeuchteMat, wheelMatIn, wheelMatOut
let wheelAlbedo = []
var wheelMetal = []
let coatMat, PostersMat;
let MainSceneMats=[]
let Led_Radar_Mats = []
let Led_Pdf_Mats = []
let Radar_Mats = []
let Radar_C_Mats = []
let Radar_X_Mats = []
let Radar_S_Mats = []
function ChangeMaterialProperties() {

    Radar_Mats.push(Radar_C_Mats,Radar_X_Mats, Radar_S_Mats)
    //name references to check
    Radar_C_Mats.push("CGroup")
    Radar_X_Mats.push("XGroup")
    Radar_S_Mats.push("SGroup")
    
    var redLeo = new BABYLON.Color3.FromHexString("#E52323");
    var blueBay = new BABYLON.Color3.FromHexString("#063c9d");
    var lightGrayBay = new BABYLON.Color3.FromHexString("#eeeeee");
    var darkGrayBay = new BABYLON.Color3.FromHexString("#323334");
    var blackBay = new BABYLON.Color3.FromHexString("#000000");

    var GrayLight = new BABYLON.Color3.FromHexString("#FFFFFF");
    var GrayDark = new BABYLON.Color3.FromHexString("#EDEDED");

    var yellow = new BABYLON.Color3.FromHexString("#E19A00");

    let sceneMats = scene.materials;
    for (let mat of sceneMats) {
        // console.log(mat.name)
        if (mat.name == "hdrSkyBox" || mat.name == "cloudsMat") {
            continue;
        }

        mat.reflectionTexture = hdrTexture;
        mat.transparencyMode = 2
        if (mat.name.startsWith("60dx")) {
            Radar_X_Mats.push(mat)
            continue
        }

        if (mat.name.startsWith("wc") ) {
            Radar_C_Mats.push(mat)
            continue
        }
        if (mat.name.startsWith("ws") ) {
            Radar_S_Mats.push(mat)
            continue
        }
        
        
        MainSceneMats.push(mat)
        if(mat.name == "Gray Wall A"){
            mat.albedoColor = GrayLight
            mat.roughness = 0.3
        }

        else if(mat.name == "Gray Wall B" || mat.name == "or_Ecken" || mat.name == "or_Dach down"){
            mat.albedoColor = GrayDark
            mat.roughness = 0.2
        }

        else if(mat.name.startsWith("Led R") ) {
            Led_Radar_Mats[BandToIndex(mat.name.charAt(6))] = mat
        }

        else if(mat.name.startsWith("pdf") ) {
            Led_Pdf_Mats[parseInt(mat.name.charAt(3))] = mat
        }

        else if(mat.name == "White Wall" || mat.name == "Boden up"){
            mat.albedoColor = GrayLight
            mat.roughness = 0.3
        }
        else if(mat.name == "Led Names"){
            mat.emissiveColor = new BABYLON.Color3.FromHexString("#616161")
        }
        else if(mat.name == "Led New P"){
            mat.albedoColor = redLeo
            mat.emissiveColor = new BABYLON.Color3.FromHexString("#ff0000")
            mat.roughness = 0.25
        }

        else if(mat.name == "White Led plus"){
            mat.emissiveColor = new BABYLON.Color3.FromHexString("#FFFFFF")
        }

        else if(mat.name == "White Metal"){
            mat.albedoColor = GrayLight
            mat.metallic = 1
            mat.roughness = 0.8
        }
        
        else if(mat.name == "Touch Glass"){
            mat.albedoColor = GrayLight
            mat.metallic = 0.2
            mat.roughness =0.25
        }

        else if(mat.name == "Red Logo" || mat.name == "Red WAll"){
            mat.albedoColor = redLeo
            mat.metallic = 0.4
            mat.roughness =0.33
        }

        else if(mat.name == "coll Mat"){
            mat.alpha = 0
            mat.transparencyMode = 2
        }
        else if(mat.name =="60dx boden"){
            mat.unlit = true
        }
        else if (mat.name.startsWith("discover")){
            mat.albedoColor = redLeo
            mat.metallic = .15
            mat.roughness = 0.25
        }

    }


}

function UpdateEnvReflections(hdr){
    let sceneMats = scene.materials;
    for (let mat of sceneMats) {
        if (mat.name == "hdrSkyBox" ) {
            continue;
        }
        mat.reflectionTexture = hdr;
    }

}

var colMat
function CreateCustomMaterials() {
    colMat = new BABYLON.StandardMaterial("colMat", scene)
    colMat.wireframe = true
    colMat.alpha = 0;
}

function createVideoMat() {

    var videoMat = new BABYLON.PBRMaterial("videoMat", scene);
    videoMats.push(videoMat)
    var dotsText = new BABYLON.Texture("./assets/videoDots2.jpg", scene, true, false)
    var ambientScreen = new BABYLON.Texture("./assets/screenAmbient.jpg", scene, true, false)
    videoMat.ambientTexture = ambientScreen
    videoMat.bumpTexture = dotsText
    videoMat.bumpTexture.level = 0
    videoMat.bumpTexture.uScale = 1
    videoMat.bumpTexture.vScale = 1
    videoMat.emissiveColor = new BABYLON.Color3.FromHexString("#313131")
    videoMat.metallic = 0
    videoMat.roughness = 0

    return videoMat;
}

