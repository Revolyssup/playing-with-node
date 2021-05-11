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
const axios_1 = __importDefault(require("axios"));
function AxiosWithRetries(limit = 5, sleep = 100) {
    return function unique(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let currentTry = 1;
            return (function _internal(url) {
                return __awaiter(this, void 0, void 0, function* () {
                    return new Promise((resolve, reject) => {
                        console.log("[Current]:" + currentTry);
                        if (currentTry > 5) {
                            axios_1.default.get(url).then(res => {
                                resolve(res);
                            }).catch(err => reject(err));
                        }
                        else {
                            currentTry++;
                            _internal(url).then(res => resolve(res)).catch(err => reject(err));
                        }
                    });
                });
            })(url);
        });
    };
}
exports.default = AxiosWithRetries;
// const axios2=AxiosWithRetries()
// axios2("http://www.google.com").then(res=>console.log(res)).catch(err=>console.log(err))
// axios2("http://www.google.com").then(res=>console.log(res)).catch(err=>console.log(err))
