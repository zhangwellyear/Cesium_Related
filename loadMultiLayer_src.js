/**
 * Created by DBRG on 2018/11/20.
 */
function addLayersAndModels(Cesium, mapBounds) {
    Cesium.Camera.DEFAULT_VIEW_RECTANGLE = new Cesium.Rectangle.fromDegrees(90.0, -25.0, 115.0, 85.0);
    var viewer = new Cesium.Viewer('cesiumContainer', {
        animation: false,
        timeline: false,
        navigationHelpButton:false,
        baseLayerPicker : false,
        geocoder:false,
        sceneModePicker:false,
        fullscreenButton:false,
        homeButton:false,
        flatRegion:[]
    });

    if(Cesium.defined(mapBounds)){
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(parseFloat(mapBounds.west + mapBounds.east) / 2, parseFloat(mapBounds.south + mapBounds.north) / 2, ZoomH[mapBounds.zoom]),
            duration: 0
        });
    }

    viewer.bottomContainer.innerHTML="";

    viewer.scene.imageryLayers.removeAll();
    if (URL_CONFIG.GLOBAL_MAP.URL) {
        var baseMap = new Cesium.createOpenStreetMapImageryProvider({
            url: URL_CONFIG.GLOBAL_MAP.URL
        });
        //var TianDiTuMap = new Cesium.createTileMapServiceImageryProvider({
        //    url: '../../Data/worldMapTMS'
        //});
        //var WorldMap1 = new Cesium.createOpenStreetMapImageryProvider({
        //    url: 'http://202.197.18.11/hiart/m/7637_d/'
        //});
        //// 以切分瓦片的方式加载底图
        //var MbTiles1 = new Cesium.UrlTemplateImageryProvider({
        //    url: 'http://202.197.18.11/hiart/m/7635/{tmp}/{x}/{y}.png',
        //    // 自定义获取数据的url
        //    /*
        //     * x：代表第二层级的文件夹编号
        //     * y: 代表第三层级的文件夹编号
        //     * tmp: 代表瓦片的层级，即第一层级的文件夹编号
        //     * */
        //    customTags : {
        //        tmp: function(imageryProvider, x, y, level) {
        //            return level + 1
        //        }
        //    },
        //    tilingScheme: new Cesium.GeographicTilingScheme()
        //});
        //// 以切分瓦片的方式加载底图
        //var MbTiles2 = new Cesium.UrlTemplateImageryProvider({
        //    url: 'http://202.197.18.11/hiart/m/7636/{tmp}/{x}/{y}.png',
        //    // 自定义获取数据的url
        //    /*
        //     * x：代表第二层级的文件夹编号
        //     * y: 代表第三层级的文件夹编号
        //     * tmp: 代表瓦片的层级，即第一层级的文件夹编号
        //     * */
        //    customTags : {
        //        tmp: function(imageryProvider, x, y, level) {
        //            return level + 1
        //        }
        //    },
        //    tilingScheme: new Cesium.GeographicTilingScheme()
        //});

        //viewer.imageryLayers.addImageryProvider(WorldMap1);
        //viewer.imageryLayers.addImageryProvider(MbTiles1);
        //viewer.imageryLayers.addImageryProvider(MbTiles1);
        //viewer.imageryLayers.addImageryProvider(MbTiles1);
        //viewer.imageryLayers.addImageryProvider(MbTiles2);
        //viewer.imageryLayers.addImageryProvider(TianDiTuMap);
        viewer.imageryLayers.addImageryProvider(baseMap);
    } else {
        console.log("请输入三维地球底图参数");
    }

    //if (URL_CONFIG.GLOBAL_TERRAIN.URL) {
    //    var terrainLayer = new Cesium.CesiumTerrainProvider({
    //        url: URL_CONFIG.GLOBAL_TERRAIN.URL,
    //        requestWaterMask: true,
    //        requestVertexNormals: true
    //    });
    //    viewer.terrainProvider = terrainLayer;
    //} else {
    //    console.log("请输入三维地球地形参数");
    //}

    //viewer.terrainProvider = terrainLayer;
    window.earth = viewer;
    viewer.layers = viewer.imageryLayers;

    return viewer;
}