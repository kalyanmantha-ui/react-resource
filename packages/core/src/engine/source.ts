export type ResourceParams= {
    page? : number;
    pageSize? : number
}
export type Source<T> = T[] | string | ((params:ResourceParams) => Promise<T[]>)

export default function normalizeSource<T>(source:Source<T>){
    return async function getData(params:ResourceParams){
        if(Array.isArray(source)){
            return source;
        }else if(typeof source === "string"){
            try{
                const call = await fetch(source);
                if(!call.ok) throw new Error(`Request Failed : ${call.status}`)
            const jsonData = await call.json();
            return jsonData as T[];
            }catch(err){
                throw new Error(`${err}`)
            }
    
        }else{
            return source(params);
        }
    }

    
}