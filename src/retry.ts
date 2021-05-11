import axios, { AxiosPromise } from "axios";

export default function AxiosWithRetries(limit: number = 5, sleep: number = 100) {

    return async function unique(url:string):Promise<AxiosPromise<any>>{
        let currentTry = 1;
        return (async function _internal(url:string): Promise<AxiosPromise<any>> {
            return new Promise((resolve, reject) => {
                console.log("[Current]:"+currentTry)
                if(currentTry>5){
                    axios.get(url).then(res=>{
                        resolve(res)
                    }).catch(err=>reject(err))
                }
                else{
                    currentTry++
                    _internal(url).then(res=>resolve(res)).catch(err=>reject(err))
                }
            });
        })(url)
    }


}

// const axios2=AxiosWithRetries()
// axios2("http://www.google.com").then(res=>console.log(res)).catch(err=>console.log(err))
// axios2("http://www.google.com").then(res=>console.log(res)).catch(err=>console.log(err))
