/**
 * Created by DBRG on 2018/11/27.
 */
const fs = require('fs');
const path = require('path');

/*
 * Explores recursively a directory and returns all the filepaths and folderpaths in the callback
 *
 * @see http://stackoverflow.com/questions/18112204/get-all-directories-within-directory-nodejs/35759360
 * @param {String} dir
 * @param {Function} getDirs
 *
 */
function dirwalker(dir) {
    return fs.readdirSync(dir);
}

//// test function
//var dirs = dirwalker('E:/zwy/hellogis/Apps');
//console.log(dirs);