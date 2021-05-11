"use strict";
/**Testing automation of creating partitions on a table given n=number of partitions to create */
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
const pg_1 = __importDefault(require("pg"));
const utils_1 = require("./utils");
function createPartition(u, pass, h, port, n, rows) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let client = new pg_1.default.Client(utils_1.createConfig(u, pass, h, port, "postgres"));
            yield client.connect();
            utils_1.p("Dropping database customers");
            yield client.query("DROP DATABASE customers");
            utils_1.p("Creating database customers");
            yield client.query("CREATE DATABASE customers");
            //connecting to customers
            client = new pg_1.default.Client(utils_1.createConfig(u, pass, h, port, "customers"));
            // p("Creating customers table...")
            // await client.query("CREATE TABLE customers(id serial,name text) partition by range(id)");
            utils_1.p("creating partitions"); // Assume the customers table is filled with 10M rows, we are going to create n partitions each holding 10M/n rows.
            let k = Math.floor(rows / n); //number of rows per partition.
            for (let i = 0; i < rows; i = i + k) {
                const idfrom = i;
                let idTo;
                i + k >= rows ? idTo = i + k : idTo = rows - 1;
                const part_name = `customer_${idfrom}_${idTo}`;
                //query to create partition
                const psql1 = `CREATE TABLE ${part_name}(like customers including indexes) 
            `;
                //attaching to customers
                const psql2 = `ALTER TABLE customers ATTACH PARTITION ${part_name}
            FOR VALUES FROM ${idfrom} TO ${idTo}`;
                yield client.query(psql1);
                yield client.query(psql2);
                yield client.end();
            }
        }
        catch (err) {
            console.error(err);
        }
    });
}
exports.default = createPartition;
