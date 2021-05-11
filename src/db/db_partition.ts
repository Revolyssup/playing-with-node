/**Testing automation of creating partitions on a table given n=number of partitions to create */

import pg from "pg"
import {p,createConfig} from "../utils"
export default async function createPartition(u:string,pass:string,h:string,port:number,n:number,rows:number){
    try{
        let client=new pg.Client(createConfig(u,pass,h,port,"postgres"));
        
        await client.connect();
        p("Dropping database customers");
        await client.query("DROP DATABASE customers");
        p("Creating database customers");
        await  client.query("CREATE DATABASE customers");

        //connecting to customers
        client=new pg.Client(createConfig(u,pass,h,port,"customers"));

        // p("Creating customers table...")
        // await client.query("CREATE TABLE customers(id serial,name text) partition by range(id)");


        p("creating partitions") // Assume the customers table is filled with 10M rows, we are going to create n partitions each holding 10M/n rows.
        let k=Math.floor(rows/n); //number of rows per partition.
        for(let i=0;i<rows;i=i+k){
            const idfrom=i;
            let idTo;
            i+k>=rows ?  idTo=i+k : idTo=rows-1;
            const part_name=`customer_${idfrom}_${idTo}`
            //query to create partition
            const psql1=`CREATE TABLE ${part_name}(like customers including indexes) 
            `;

            //attaching to customers
            const psql2=`ALTER TABLE customers ATTACH PARTITION ${part_name}
            FOR VALUES FROM ${idfrom} TO ${idTo}`

            await client.query(psql1);

            await client.query(psql2);
            await client.end();
        }

    }catch(err){
        console.error(err)
    }
}