"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.replaceStdout = exports.execDriveList = void 0;
var child_process_1 = require("child_process");
var execDriveList = function (cb) {
    //Logicaldisk get order the parameters has no effect
    (0, child_process_1.exec)("WMIC LOGICALDISK GET Name, VolumeName, Size, FreeSpace", { windowsHide: true }, function (err, stdout) {
        if (err) {
            return cb(err);
        }
        var lines = (0, exports.replaceStdout)(stdout);
        lines.shift();
        var drives = lines.map(function (line) { return (0, exports.parse)(line); });
        try {
            cb(null, drives);
        }
        catch (e) {
            cb(e);
        }
    });
};
exports.execDriveList = execDriveList;
var replaceStdout = function (stdout) {
    return stdout
        .replace(/\r\r\n/g, "\n")
        .split("\n")
        .filter(function (line) { return line.length; })
        .filter(function (line) { return /^\d+$/.test(line[0]); })
        .map(function (line) { return line.split(" ").filter(function (x) { return x !== ""; }); });
};
exports.replaceStdout = replaceStdout;
var parse = function (line) {
    var available = Number(line[0]);
    var mountpoint = line[1];
    var total = Number(line[2]);
    var name = line[3];
    var used = total - available;
    var percentageUsed = Math.round((used / total) * 100);
    return {
        total: total,
        used: used,
        available: available,
        percentageUsed: percentageUsed,
        mountpoint: mountpoint,
        name: name,
    };
};
exports.parse = parse;
module.exports = {
    execDriveList: exports.execDriveList,
    parse: exports.parse,
    replaceStdout: exports.replaceStdout,
};
