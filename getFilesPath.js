/**
 * Created by DBRG on 2018/11/27.
 */
const fs = require('fs');
const path = require('path');

/*
 * Explores recursively a directory and returns all the filepaths and folderpaths in the callback
 *
 * @see http://stackoverflow.com/a/5827895/4241030
 * @param {String} dir
 * @param {Function} done
 *
 */
function filewalker(dir, done) {
    let results = [];

    fs.readdir(dir, function(err, list) {
        if (err) return done(err);

        var pending = list.length;

        // 当文件夹为空时
        if (!pending) return done(null, results);

        list.forEach(function(file) {
            file = path.resolve(dir, file);

            fs.stat(file, function(err, stat) {
                // 如果是文件夹，则在文件夹中进行循环，以便对所有数据进行循环
                if (stat && stat.isDirectory()) {
                    // 将文件夹添加到results数组中
                    results.push(file);

                    filewalker(file, function(err, res) {
                        // 将根目录与当前目录连接起来
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push(file);

                    if (!--pending) done(null, results);
                }
            });
        });
    });
};

filewalker("E:/zwy/hellogis/Apps", function(err, data) {
    if (err) {
        throw err;
    }

    console.log(data);
});