"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShortURL = exports.insertURL = exports.getServer = exports.hashit = exports.connectToShards = void 0;
const pg_1 = __importDefault(require("pg"));
const crypto_1 = __importDefault(require("crypto"));
const consistent_hash_1 = __importDefault(require("./consistent-hash"));
const ring = new consistent_hash_1.default();
const FROM_PORT = 5432;
const TO_PORT = 5434;
function generateShards(port) {
    let shard = {};
    shard[port] = new pg_1.default.Client({
        "host": "localhost",
        "port": Number(port),
        "user": "postgres",
        "password": "password",
        "database": "postgres"
    });
    return shard;
}
let ports = [];
function connectToShards() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = FROM_PORT; i <= TO_PORT; i++) {
            const shard = generateShards(i.toString());
            console.log("Shard created: ", shard);
            try {
                console.log("Connecting to shard at port " + i + " connec to: " + shard[i.toString()]);
                yield shard[i.toString()].connect();
                ports.push(shard);
                console.log("Connected to shard at port " + i);
            }
            catch (err) {
                console.error(err);
            }
            console.log("Adding " + i.toString() + " ");
            ring.add(i.toString());
        }
    });
}
exports.connectToShards = connectToShards;
function hashit(url) {
    return crypto_1.default.createHash("sha256").update(url).digest("base64");
}
exports.hashit = hashit;
function getServer(urlId) {
    return ring.get(urlId);
}
exports.getServer = getServer;
function insertURL(port, url, urlID) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ports[Number(port) - FROM_PORT][port].query("INSERT INTO URL_SHORT(url,url_id) VALUES($1, $2)", [url, urlID]);
    });
}
exports.insertURL = insertURL;
function getShortURL(port, urlId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield ports[Number(port) - FROM_PORT][port].query("SELECT * FROM URL_SHORT WHERE url_id = $1", [urlId]);
        console.log("IN getshort " + res.rowCount);
        return res;
    });
}
exports.getShortURL = getShortURL;
