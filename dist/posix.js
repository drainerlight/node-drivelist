"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.execDriveList = void 0;
var child_process_1 = require("child_process");
var execDriveList = function (cb) {
    (0, child_process_1.execFile)("df", ["-P", "-k"], function (err, stdout) {
        if (err) {
            return err;
        }
        var lines = stdout.split("\n").filter(function (line) { return line.length; });
        lines.shift();
        var drives = lines.map(function (line) { return (0, exports.parse)(line.trim()); });
        try {
            cb(null, drives);
        }
        catch (e) {
            cb(e);
        }
    });
};
exports.execDriveList = execDriveList;
var parse = function (driveLine) {
    var matches = driveLine.match(/^(.+?)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+%)\s+(.+)$/);
    if (!matches || matches.length !== 7) {
        throw new Error("Unexpected df output: [" + driveLine + "]");
    }
    // matches[1] is the filesystem name, e.g., /dev/disk1s1 or //server/share
    var total = Number(matches[2]);
    var used = Number(matches[3]);
    var available = Number(matches[4]);
    var percentageUsed = Number(matches[5].replace("%", ""));
    var mountpoint = matches[6].trim(); // Trim potential trailing spaces from mountpoint
    var name = mountpoint.split("/").pop();
    return {
        total: total * 1024,
        used: used * 1024,
        available: available * 1024,
        percentageUsed: percentageUsed,
        mountpoint: mountpoint,
        name: name,
    };
};
exports.parse = parse;
module.exports = {
    execDriveList: exports.execDriveList,
    parse: exports.parse,
};
