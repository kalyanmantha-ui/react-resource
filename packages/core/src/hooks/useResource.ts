import {useEffect , useState , useRef} from "react";
import normalizeSource from "../engine/source";
import type { ResourceParams , Source } from "../engine/source";



type Config<T> = {
    source : Source<T>;
    pagination? : ResourceParams;
}


export default function useResource<T>(config : Config<T>){
    const [data , setData] = useState<T[]>([]);
    const [error , setError] = useState<Error | null>(null);
    const [loading , setLoading] = useState(false);
    const pagination = config.pagination;
    const page = pagination?.page
    const pageSize = pagination?.pageSize;
    const source = config.source;
    const requestTracker = useRef<number>(0);
    useEffect(() => {
        const params = {
            page : page,
            pageSize : pageSize,
        }
        
       async function asyncNormalize(){
            setLoading(true)
            requestTracker.current += 1;
        const currentRequestId = requestTracker.current;
        setError(null);
        try{
            const getData = normalizeSource(source);
            const rawData = await getData(params);
            if(currentRequestId === requestTracker.current) {
                setData(rawData);
                setLoading(false);
                
            }
        }catch(err){
            if(currentRequestId === requestTracker.current){
                if(err instanceof Error){
                    setError(err as Error);
                }else{
                    setError(new Error("unknown error"))
                }
            setLoading(false);
            }
        }
       }

       
       asyncNormalize();
    },[page,pageSize,source])

    return {data , loading , error}
}