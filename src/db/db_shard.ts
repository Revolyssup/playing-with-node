import pg from "pg";
import crypto from "crypto";
import ConsistentHash from "./consistent-hash"
const ring=new ConsistentHash();


const FROM_PORT=5432;
const TO_PORT=5434;

type Shard={
    [key: string]: pg.Client
}


function generateShards(port:string):Shard{
    let shard:Shard={};
    shard[port]=new pg.Client({
        "host":"localhost",
        "port":Number(port),
        "user":"postgres",
        "password":"password",
        "database":"postgres"            
    } );
    return shard;
}
let ports:Shard[]=[];

export async function connectToShards(){
    for(let i=FROM_PORT;i<=TO_PORT;i++){
        const shard=generateShards(i.toString());
        console.log("Shard created: ",shard);
        try{
            console.log("Connecting to shard at port "+i+" connec to: "+shard[i.toString()]);
            await shard[i.toString()].connect();
            ports.push(shard)
            console.log("Connected to shard at port "+i);
        }catch(err){
            console.error(err);
        }
        console.log("Adding "+i.toString()+" ")
        ring.add(i.toString());
    }
}

export  function hashit(url:string):string{
   return  crypto.createHash("sha256").update(url).digest("base64");
}

type Server  = string;
export function getServer(urlId:string):Server{
    return ring.get(urlId);
}

export async function insertURL(port:string,url:string,urlID:string){
   await ports[Number(port)-FROM_PORT][port].query("INSERT INTO URL_SHORT(url,url_id) VALUES($1, $2)",[url,urlID]);
}

export async function getShortURL(port:string,urlId:string){
    const res= await ports[Number(port)-FROM_PORT][port].query("SELECT * FROM URL_SHORT WHERE url_id = $1",[urlId]);
    console.log("IN getshort "+res.rowCount)
    return res;
}

