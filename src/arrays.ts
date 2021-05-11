interface IArrays{
    [index: number]:any;
}
export class Arrays implements IArrays{
    #arr:Array<any>=[];

    constructor(...arr:any ){
        this.#arr=this.itrArr(arr);
    }
    forEach(cb:Function){
        for(let i=0;i<this.#arr.length;i++){
            cb(this.#arr[i])
        }
    }

    map(cb:Function){
        let newarr=new Arrays([]);
        for(let i=0;i<this.#arr.length;i++){
            newarr.set(i,cb(this.#arr[i]));
        }
        return newarr;
    }

    reduce(cb:Function,accum:any){
        for(let i=0;i<this.#arr.length;i++){
            accum=cb(accum,this.#arr[i]);
        }
        return accum;
    }

    filter(cb:Function){
        let ans=new Arrays([]);
        for(let i=0;i<this.#arr.length;i++){
            if(cb(this.#arr[i])) ans.push(this.#arr[i]);
        }
        return ans;
    }
    get(i:number){
        return this.#arr[i];
    }

    *getElements(){
        for(let i=0;i<this.#arr.length;i++) yield this.#arr[i]
    }
    set(i:number,val:any){
        this.#arr[i]=val;
    }

    print(){
        process.stdout.write("The array is: [ ")
        for(let i=0;i<this.#arr.length;i++){
            process.stdout.write(this.#arr[i]+" ");
        }
       console.log("]")
    }

    push(ele:any){
        this.#arr.push(ele);
    }

    get size(){
        return this.#arr.length;
    }
    itrArr(arr:Array<any>):Array<any>{
        let ans:Array<any> = [];
        for(let i=0;i<arr.length;i++){
            if(Array.isArray(arr[i])) ans.push(this.itrArr(arr[i]))
            else ans.push(arr[i]);
        }
        return ans;
    }
}
