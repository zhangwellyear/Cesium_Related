/**
 * Created by DBRG on 2018/11/21.
 */
function drawSubTiles(Cesium, tilesBounding, viewer) {
    var entities = viewer.entities;

    for (var i = 0; i < tilesBounding.length; i++) {
        for (var key in tilesBounding[i]) {
            var positionsRadians = tilesBounding[i][key].region;

            var positions = [];
            for (var j = 0; j < positionsRadians.length - 2; j ++) {
                var LatiAndLongi = Cesium.Math.toDegrees(positionsRadians[j]);
                positions.push(LatiAndLongi);
            }

            entities.add({
                rectangle : {
                    coordinates : Cesium.Rectangle.fromDegrees(positions[0], positions[1], positions[2], positions[3]),
                    outline : true,
                    outlineColor : Cesium.Color.WHITE,
                    outlineWidth : 4,
                    stRotation : Cesium.Math.toRadians(45),
                    material : Cesium.Color.fromRandom({alpha : 0.5})
                }
            });
        }
    }

    return viewer;
}