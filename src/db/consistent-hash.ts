export default class ConsistentHash{

    arr:string[];
    constructor(){
        this.arr=[]
    }
    add(clockhand:string){
        this.arr.push(clockhand)
    }

    get(val:string):string{
        val=val.substr(0,5);
        let accum=0;
        for(let i=0;i<5;i++){
            accum+=val.charCodeAt(i);
        }

        return this.arr[accum%this.arr.length];
    }
}