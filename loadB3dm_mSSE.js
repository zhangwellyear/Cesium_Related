/**
 * Created by DBRG on 2018/10/25.
 */
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

// 通过终端设备信息，获取SSE
function getScreenSpaceErrorforDevice(viewer, default_mSSE) {
    var context = viewer.frameState.camera;
    var height = context.drawingBufferHeight;

    var distance = 500;

    return (default_mSSE * height) / (distance * tileset.sseDenominator);
}

// 根据不同数据，得到不同的mSSE
function getScreenSpaceErrorforData(default_mSSE, viewer) {
    tileset.readyPromise.then(function() {
        var geometricError = default_mSSE;
        if (geometricError === 0.0) {
            // 叶子节点没有误差，直接返回结果
        }
        console.log(geometricError);

        var height = viewer.camera.positionCartographic.height.toFixed(2);    // 定义相机的高度
        var distance = Math.max(tileset.boundingSphere.radius, CesiumMath.EPSILON7);
        var sseDenominator = viewer.camera.frustum.sseDenominator;

        tileset.maximumScreenSpaceError = (geometricError * height) / (distance * sseDenominator);
        return tileset;
    });
}

function loadB3dm(viewer) {
    var url = '../../Data/nudt_test_b3dm/tileset.json';
    //var url = '../../Data/node_size_test/small/tileset.json';
    var json_txt = readTxtFile(url);
    var json_obj = JSON.parse(json_txt);
    var default_mSSE = json_obj.root.children[0].geometricError;

    var tileset = new Cesium.Cesium3DTileset ({
        url: url,
        //url: '../../Data/pycollada_result/tileset.json',
        //url: '../../Data/test_origin/tileset.json',
        //url: 'http://202.197.18.63/3dtile/dsm/nudt_b3dm/tileset.json',
        //url: '../../Data/test_pro/tileset.json',
        //url: '../../Data/FengHuangTown/tileset.json',
        //url: '../../Data/Production_CStest/tileset.json',
        //url: '../../Data/changsha0920_3dtiletest/tileset.json',
        //url: '../../Data/node_size_test/small/tileset.json',
        maximumScreenSpaceError: default_mSSE
    });
+
    viewer.scene.primitives.add(tileset);
    tileset.readyPromise.then(function(){
        viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.0, -1.57, tileset.boundingSphere.radius));
    });


    tileset.loadProgress.addEventListener(function (numberOfPendingRequests, numberOfTilesProcessing) {
        if ((numberOfPendingRequests === 0) && (numberOfTilesProcessing === 0)) {
            console.log('Stopped loading');
            return;
        }

        // console.log('Loading: requests: ' + numberOfPendingRequests + ', processing: ' + numberOfTilesProcessing);
    });
    // 获取相机的信息
    //var HeightString = viewer.camera.positionCartographic.height.toFixed(2);    // 定义相机的高度
    //var near = viewer.camera.frustum.near;
    //var far = viewer.camera.frustum.far;
    //var fov = viewer.camera.frustum.fov;
    //var position = viewer.camera.positionCartographic;
    //
    //var pitch = viewer.camera.pitch;
    //var positioinWC = viewer.camera.positionWC;

    //console.log(HeightString);
    //console.log(near);
    //console.log(far);
    //console.log(fov);
    //console.log(position);
    //console.log(pitch);
    //console.log(positioinWC);

    var scene = viewer.scene;

    // 处理经纬度及高度信息，随着光标的移动进行显示
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
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    return viewer;
}