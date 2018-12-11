/**
 * Created by DBRG on 2018/11/19.
 */
// 此函数用来使用createElement的方式引入外部文件
// 旨在解决require时，在require结束前即引入外部文件导致的Cesium未定义的问题
/*
 script_src: 表示引入的外部文件位置的字符串
 script_type: 表示引入的外部文件类型的字符串
 */
function loadExternalFileAPI(script_src, script_type) {
    var script = document.createElement("script");

    // This script has a callback function that will run when the script has
    // finished loading
    script.src = script_src;
    script.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(script);
}