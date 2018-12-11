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
