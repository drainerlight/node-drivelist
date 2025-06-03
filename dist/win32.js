"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.replaceStdout = exports.execDriveList = void 0;
var child_process_1 = require("child_process");
var execDriveList = function (cb) {
    (0, child_process_1.exec)('powershell -Command "Get-CimInstance Win32_LogicalDisk | Select-Object DeviceID, VolumeName, Size, FreeSpace | Format-Table -HideTableHeaders"', { windowsHide: true }, function (err, stdout) {
        if (err) {
            return cb(err);
        }
        var lines = (0, exports.replaceStdout)(stdout);
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
        .replace(/\r\n/g, "\n")
        .split("\n")
        .filter(function (line) { return line.trim().length; })
        .map(function (line) {
        var match = line.match(/^(\w:)\s+(\S*)\s+(\d+)\s+(\d+)$/);
        if (match) {
            return [match[1], match[2], match[3], match[4]];
        }
        return [];
    })
        .filter(function (parts) { return parts.length > 0; });
};
exports.replaceStdout = replaceStdout;
var parse = function (line) {
    var mountpoint = line[0];
    var name = line[1];
    var total = Number(line[2]);
    var available = Number(line[3]);
    var used = total - available;
    var percentageUsed = total > 0 ? Math.round((used / total) * 100) : 0;
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
