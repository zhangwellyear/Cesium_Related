/**
 * Created by DBRG on 2018/9/17.
 */
function getUrl() {
    var baseUrl = 'http://localhost:63342/b3dm/';
    var url = baseUrl + 'tileset.json';
    var urlTxt = readTxtFile(url);
    var urlJSON = JSON.parse(urlTxt);
    var urls = [];

    var tiles = urlJSON.root.children;
    for (var i = 0; i < tiles.length; i++) {
        urls.push(baseUrl + tiles[i].content.url);
    }

    return {
        URL: urls
    }
}

function readTxtFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    var allText = "";
    rawFile.onreadystatechange = function ()
    {
        if (rawFile.readyState === 4)
        {
            if (rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
                // console.log(allText);
            }
        }
    };

    rawFile.send(null);
    return allText;
}


function loadB3dm(viewer) {
    var url_obj = getUrl();

    var cesium3DTileset = undefined;
    if (url_obj.CONFIG !== undefined) {
         cesium3DTileset = loadTiles_With_Height(url_obj, 32);
    } else if (url_obj.MAX_LOAD_TILES) {
        cesium3DTileset = loadTiles_ManualeModel(url_obj, 32);
    } else {
        cesium3DTileset = loadTiles_Plain(url_obj, 1024);
    }

    //var cesium3DTileset = loadTiles_With_Height(url, 32, config_url);
    if (cesium3DTileset instanceof Array) {
        for (var i = 0; i < cesium3DTileset.length; i++) {
            tileset = viewer.scene.primitives.add(cesium3DTileset[i]);
        }
    } else {
        tileset = viewer.scene.primitives.add(cesium3DTileset);
    }

    var scene = viewer.scene;

    Event(scene);

    tileset.readyPromise.then(function(){
        viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.0, -1.57, tileset.boundingSphere.radius * 3));
        //var boundingSphere = tileset.boundingSphere;
        //var boundingCenter = boundingSphere.center;
        //var boundingHeight = boundingSphere.radius;
        //console.log(boundingHeight);
        //viewer.camera.lookAt(boundingCenter, new Cesium.Cartesian3(0, 0, boundingHeight - 3000));
    });

    return viewer;
}

// 最传统的方法加载.b3dm模型
function loadTiles_Plain(url, mSSE) {
    if (url.URL instanceof Array) {
        var cesium3DTilesetArray = [];
        for (var i = 0; i < url.URL.length; i++) {
            cesium3DTilesetArray.push(new Cesium.Cesium3DTileset ({
               url: url.URL[i],
               maximumScreenSpaceError: mSSE
            }));
        }
        
        return cesium3DTilesetArray;
    } else {
        return new Cesium.Cesium3DTileset ({
            url: url.URL,
            maximumScreenSpaceError: mSSE
        });
    }
}

// 在加载模型时，调整高度
function loadTiles_With_Height(url, mSSE) {
    var config_url = url.CONFIG;
    var json_txt = readTxtFile(config_url);
    var jsonData = JSON.parse(json_txt);

    if (jsonData.adjustHeight != undefined && jsonData.adjustHeight != 0) {
        var surface = Cesium.Cartesian3.fromDegrees(jsonData.rtcCenter.longitude, jsonData.rtcCenter.latitude, jsonData.rtcCenter.height);
        var offset = Cesium.Cartesian3.fromDegrees(jsonData.rtcCenter.longitude, jsonData.rtcCenter.latitude, jsonData.rtcCenter.height + jsonData.adjustHeight);
        var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
        modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    }

    return new Cesium.Cesium3DTileset({
        url: url.URL,
        modelMatrix: modelMatrix,
        maximumScreenSpaceError: mSSE
    });
}


// 加载手工模型
function loadTiles_ManualeModel(url, mSSE) {
    viewer.scene.globe.depthTestAgainstTerrain = true;

    return new Cesium.Cesium3DTileset({
        url: url.URL,
        maximumScreenSpaceError: mSSE,
        maximumNumberOfLoadedTiles: url.MAX_LOAD_TILES
    });
}


// 处理事件
function Event(scene) {
    var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

    handler.setInputAction(function(evt) {
        if (scene.mode !== Cesium.SceneMode.MORPHING) {
            var pickedObj = scene.pick(evt.position);
            if (scene.pickPositionSupported && Cesium.defined(pickedObj) && pickedObj.node) {
                var cartesian = viewer.scene.pickPosition(evt.position);
                if (Cesium.defined(cartesian)) {
                    var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                    var lng = Cesium.Math.toDegrees(cartographic.longitude);
                    var lat = Cesium.Math.toDegrees(cartographic.latitude);
                    var height = cartographic.height;

                    mapPositon = {x:lng, y:lat, z:height};
                    console.log(mapPositon);
                }
            }
        }

        var feature = viewer.scene.pick(evt.position);
        if (!Cesium.defined(feature)) {
            return;
        }
        console.log(feature.content.url);

    }, Cesium.ScreenSpaceEventType.MIDDLE_CLICK);
}