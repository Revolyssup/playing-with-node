import express from 'express'
import {connectToShards,hashit,getServer,insertURL,getShortURL} from "./db/db_shard"
const app=express();
connectToShards();
app.get("/:urlID",async (req,res)=>{
    const urlID=req.params.urlID
    console.log("Got request to decode shortened URL "+urlID)
    if(!urlID) res.json({
        "err:" : "Invalid urlID"
    })
    const server=getServer(urlID);
    console.log("server: "+server)
    const ans=await getShortURL(server,urlID);
    console.log(ans.rows[0])
    if(ans.rowCount!=0){
        res.send({
            "hash":urlID,
            "server":server,
            "url":ans.rows[0]
        })
    }else res.status(404);
});

app.post("/",async (req,res)=>{
    const url=req.query.url;
    console.log("Got request to short and store URL "+url)
    const hash=hashit((url as string));
    const urlID=hash.substr(0,5);
    const server=getServer(urlID);
    await insertURL(server,(url as string),urlID);
    res.send({
        "hash":urlID,
        "server":server,
        "url":url
    })
});

app.listen(3000,()=>{
    console.log("Server started");
})