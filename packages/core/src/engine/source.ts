export type ResourceParams = {
    page?: number;
    pageSize?: number;
  };
  
  export type Source<T> =
    | T[]
    | string
    | ((params: ResourceParams) => Promise<T[] | {data : T[] , total : number}>);
  
  export default function normalizeSource<T>(source: Source<T>) {
    return async function getData(params: ResourceParams) {
      const { page = 1, pageSize = 10 } = params;
  
      // Array source
      if (Array.isArray(source)) {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        return source.slice(start, end);
      }
  
      //  URL source
      if (typeof source === "string") {
        try {
          const url = new URL(source);
          url.searchParams.set("page", String(page));
          url.searchParams.set("pageSize", String(pageSize));
  
          const call = await fetch(url.toString());
          if (!call.ok) {
            throw new Error(`Request Failed: ${call.status}`);
          }
  
          const jsonData = await call.json();
          return jsonData;
        } catch (err) {
          if (err instanceof Error) throw err;
          throw new Error("Unknown error");
        }
      }
  
      //  Function source
      return source(params);
    };
  }