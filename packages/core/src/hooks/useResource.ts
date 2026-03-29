import {useEffect , useState , useRef , useMemo} from "react";
import normalizeSource from "../engine/source";
import type {Source } from "../engine/source";


type PaginationConfig = {
    type : "page" | "loadmore" | "infinite";
    pageSize? : number
}

type virtualizationConfig = {
    enabled : boolean;
    itemHeight : number;
    containerHeight : number;
}
type Config<T> = {
    source : Source<T>;
    pagination? :PaginationConfig;
    virtualization ? : virtualizationConfig;
}





export default function useResource<T>(config : Config<T>){
    const pagination = config.pagination;
    const [data , setData] = useState<T[]>([]);
    const [error , setError] = useState<Error | null>(null);
    const [loading , setLoading] = useState(false);
    const [page , setPage] = useState(1);
    const [scrollTop , setScrollTop] = useState(0);
    const pageSize = pagination?.pageSize ? pagination?.pageSize : 10;
    const source = config.source;
    const requestTracker = useRef<number>(0);
    const cache = useRef<Record<number,T[]>>({});
    const virtualization = config.virtualization?.enabled;
    const getData = useMemo(() => normalizeSource(source), [source]);
    const prevScrollTop = useRef(0);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    const hasMore = useRef(true);

    async function asyncNormalize(localPage: number) {
        const params = {
          page: localPage,
          pageSize: pageSize,
        };
      
        try {
          const rawData = await getData(params);
          return { data: rawData, error: null };
        } catch (err) {
          return {
            data: null,
            error: err instanceof Error ? err : new Error("unknown error"),
          };
        }
      }
   async function orchestrator() {
    const isPageMode = pagination?.type === "page";
    prevScrollTop.current = scrollTop;
  
    const cached = cache.current[page];
    if (isPageMode && cached) {
      setData(cached);
      return;
    }
  
    const localPage = page;
  
    requestTracker.current += 1;
    const currentRequestId = requestTracker.current;
  
    setLoading(true);
    setError(null);
  
    const result = await asyncNormalize(localPage);
  
    if (currentRequestId !== requestTracker.current){
        setLoading(false);
        return;
    };
  
    setLoading(false);
  
    if (result.error) {
      setError(result.error);
      return;
    }
  
    const rawData = result.data;
    if (!rawData || rawData.length < 1) return;
  
    if (rawData.length < pageSize) hasMore.current = false;
  
    setData((prev) => {
      if (isPageMode) return rawData;
  
      const indexStart = (localPage - 1) * pageSize;
      const newData = [...prev];
  
      for (let i = 0; i < rawData.length; i++) {
        newData[indexStart + i] = rawData[i];
      }
  
      return newData;
    });
  
    if (isPageMode) {
      cache.current[localPage] = rawData;
      Object.keys(cache.current).forEach((val: string) => {
        if (Math.abs(localPage - +val) > 1) {
          delete cache.current[+val];
        }
      });
    }
  }
    useEffect(() => {
        if (!hasMore.current) return;
        if (pagination?.type !== "infinite") return;
      
        const el = scrollRef.current;
        if (!el) return;
      
        const remaining =
          el.scrollHeight - scrollTop - el.clientHeight;
      
        if (remaining < 50 && !loading) {
          ((() => {
            setPage((prev) => prev + 1)
          })());
        }
      }, [scrollTop, pagination?.type, loading]);



    useEffect(() => {
        orchestrator();
        
    },[page,pageSize,source,pagination?.type])

    useEffect(() => {
        if(pagination?.type === 'page'){
            ((() => setScrollTop(0))())
        }
    },[page,pagination?.type])

    useEffect(() => {
        if (pagination?.type !== "page") {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = prevScrollTop.current;
          }
        }
      }, [data]);  

    let finalData = data;
    const itemHeight = config.virtualization?.itemHeight ?? 40;
    const containerHeight = config.virtualization?.containerHeight ?? 400;
    const shouldVirtualize = virtualization && data.length * itemHeight > containerHeight;
    let offsetY = 0;
    let totalHeight = 0;
    if (shouldVirtualize) {
        const total = data.length;
        const rawStart = Math.floor(scrollTop / itemHeight);
        const startIndex = Math.max(0, rawStart - 2);
        const visibleCount = Math.ceil(containerHeight / itemHeight);
        const endIndex = Math.min(startIndex + visibleCount + 4, total);

        finalData = data.slice(startIndex, endIndex);
        offsetY = itemHeight * startIndex;
        totalHeight = total * itemHeight;
    }

    return {data : finalData , loading , error , page , setPage,setScrollTop , offsetY , totalHeight , totalItems : data.length , scrollRef }
}