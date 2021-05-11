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
const express_1 = __importDefault(require("express"));
const db_shard_1 = require("./db/db_shard");
const app = express_1.default();
db_shard_1.connectToShards();
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const urlID = req.params.urlID;
    console.log("Got request to decode shortened URL " + urlID);
    const server = db_shard_1.getServer(urlID);
    console.log("server: " + server);
    const ans = yield db_shard_1.getShortURL(server, urlID);
    console.log(ans.rows[0]);
    if (ans.rowCount != 0) {
        res.send({
            "hash": urlID,
            "server": server,
            "url": ans.rows[0]
        });
    }
    else
        res.status(404);
}));
app.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const url = req.query.url;
    console.log("Got request to short and store URL " + url);
    const hash = db_shard_1.hashit(url);
    const urlID = hash.substr(0, 5);
    const server = db_shard_1.getServer(urlID);
    yield db_shard_1.insertURL(server, url, urlID);
    res.send({
        "hash": urlID,
        "server": server,
        "url": url
    });
}));
app.listen(3000, () => {
    console.log("Server started");
});
