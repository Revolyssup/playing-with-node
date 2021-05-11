export function p(a:any){
        console.log(a)
}

interface Ipgconfig{
        user:string,
        password:string,
        host:string,
        port:number,
        database?:string
}
export function createConfig(user:string,pass:string,host:string,port:number,db?:string):Ipgconfig{

        return {
                user:user,
                password:pass,
                host:host,
                database:db,
                port:port
        }
}