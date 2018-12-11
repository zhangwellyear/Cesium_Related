/**
 * Created by DBRG on 2018/11/21.
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

function getBounding(Cesium, JSON_file) {
    var JSON_txt = readTxtFile(JSON_file);
    var JSON_data = JSON.parse(JSON_txt);

    var rootRegion = JSON_data.root.boundingVolume;

    var children = JSON_data.root.children;
    var childrenLength = JSON_data.root.children.length;
    var Region = [];

    // 将根瓦片的范围入栈
    var tmp_obj = {};
    tmp_obj[JSON_file] = rootRegion;
    Region.push(tmp_obj);

    for (var i = 0; i < childrenLength; i++) {
        var tile_name = children[i].content.url;
        var boundingVolume = children[i].boundingVolume;

        tmp_obj = {};
        tmp_obj[tile_name] = boundingVolume;

        Region.push(tmp_obj);
    }

    return Region;
}