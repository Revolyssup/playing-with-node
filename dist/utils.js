"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfig = exports.p = void 0;
function p(a) {
    console.log(a);
}
exports.p = p;
function createConfig(user, pass, host, port, db) {
    return {
        user: user,
        password: pass,
        host: host,
        database: db,
        port: port
    };
}
exports.createConfig = createConfig;
