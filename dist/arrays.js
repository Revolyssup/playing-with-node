"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _arr;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arrays = void 0;
class Arrays {
    constructor(...arr) {
        _arr.set(this, []);
        __classPrivateFieldSet(this, _arr, this.itrArr(arr));
    }
    forEach(cb) {
        for (let i = 0; i < __classPrivateFieldGet(this, _arr).length; i++) {
            cb(__classPrivateFieldGet(this, _arr)[i]);
        }
    }
    map(cb) {
        let newarr = new Arrays([]);
        for (let i = 0; i < __classPrivateFieldGet(this, _arr).length; i++) {
            newarr.set(i, cb(__classPrivateFieldGet(this, _arr)[i]));
        }
        return newarr;
    }
    reduce(cb, accum) {
        for (let i = 0; i < __classPrivateFieldGet(this, _arr).length; i++) {
            accum = cb(accum, __classPrivateFieldGet(this, _arr)[i]);
        }
        return accum;
    }
    filter(cb) {
        let ans = new Arrays([]);
        for (let i = 0; i < __classPrivateFieldGet(this, _arr).length; i++) {
            if (cb(__classPrivateFieldGet(this, _arr)[i]))
                ans.push(__classPrivateFieldGet(this, _arr)[i]);
        }
        return ans;
    }
    get(i) {
        return __classPrivateFieldGet(this, _arr)[i];
    }
    *getElements() {
        for (let i = 0; i < __classPrivateFieldGet(this, _arr).length; i++)
            yield __classPrivateFieldGet(this, _arr)[i];
    }
    set(i, val) {
        __classPrivateFieldGet(this, _arr)[i] = val;
    }
    print() {
        process.stdout.write("The array is: [ ");
        for (let i = 0; i < __classPrivateFieldGet(this, _arr).length; i++) {
            process.stdout.write(__classPrivateFieldGet(this, _arr)[i] + " ");
        }
        console.log("]");
    }
    push(ele) {
        __classPrivateFieldGet(this, _arr).push(ele);
    }
    get size() {
        return __classPrivateFieldGet(this, _arr).length;
    }
    itrArr(arr) {
        let ans = [];
        for (let i = 0; i < arr.length; i++) {
            if (Array.isArray(arr[i]))
                ans.push(this.itrArr(arr[i]));
            else
                ans.push(arr[i]);
        }
        return ans;
    }
}
exports.Arrays = Arrays;
_arr = new WeakMap();
