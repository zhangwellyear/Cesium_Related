/**
 * Created by DBRG on 2018/11/13.
 */
// 调用该函数可以自动下载日志文件（可以是console出来的任意文本内容）
var recordLogToText = function(Log, filename) {
    var textFile = null,
        makeTextFile = function (text) {
            var data = new Blob([text], {type: 'text/plain'});

            // 如果我们替换的是之前生成的文件，我们需要手动取消对象的URL，防止内存泄漏
            if (textFile !== null) {
                window.URL.revokeObjectURL(textFile);
            }

            textFile = window.URL.createObjectURL(data);

            return textFile;
        };

    var create = document.getElementById('create'),
        textbox = document.getElementById('textbox');

    var link = document.createElement('a');
    link.setAttribute('download', filename + '.txt');
    link.href = makeTextFile(Log);
    document.body.appendChild(link);

    // 等待链接被添加到document中
    window.requestAnimationFrame(function() {
        var event = new MouseEvent('click');
        link.dispatchEvent(event);
        document.body.removeChild(link);
    });
};