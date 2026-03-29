import "./DataTable.css";
import { useEffect,useRef } from "react";
type DataTableProps<T extends Record<string,unknown>> = {
    data : T[];
    loading? :boolean;
    error? : Error |null; 
    page? : number;
    setPage: React.Dispatch<React.SetStateAction<number>>
    setScrollTop : React.Dispatch<React.SetStateAction<number>>
    type: "page" | "loadmore" | "infinite";
    virtualization? : boolean;
    offsetY? : number;
    totalHeight? : number;
    totalItems ?: number;
    scrollRef?: React.RefObject<HTMLDivElement> | null;
}
export default function DataTable<T extends Record<string, unknown>>(
    props: DataTableProps<T>
  ) {
    const { data, loading, error, page, setPage, setScrollTop, type, virtualization } = props;
    const isFetchingRef = useRef(false);

    useEffect(() => {
      isFetchingRef.current = false;
    }, [data]);
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;
    if ((props.totalItems ?? data.length) === 0) return <p>No Data to create Table</p>;

    

    const content = (
      <table>
        <thead>
          <tr>
            {Object.keys(data[0]).map((val) => (
              <th key={val}>{val}</th>
            ))}
          </tr>
        </thead>
  
        <tbody>
          {data.map((val, index) => (
            <tr key={index}>
              {Object.keys(val).map((key) => {
                const value = (val as Record<string, unknown>)[key];
                return (
                  <td key={key}>
                    {value != null ? value.toString() : "-"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );

    const offsetY = props.offsetY ?? 0;
const totalHeight = props.totalHeight ?? 0;

const finalTable = virtualization ? (
  <div
  ref={props.scrollRef ?? null}
    style={{ height: 400, overflowY: "auto" }}
    onScroll={(e) => {
      setScrollTop(e.currentTarget.scrollTop);
    }}
  >
    <div style={{ height: totalHeight, position: "relative" }}>
      <div
        style={{
          transform: `translateY(${offsetY}px)`,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0
        }}
      >
        {content}
      </div>
    </div>
  </div>
) : (
  content
);

    
    return (
      <div>

        {type === "page" && (
          <div>
            <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
              prev
            </button>
            <span>{page}</span>
            <button onClick={() => setPage((prev) => prev + 1)}>
              next
            </button>
          </div>
        )}

        {finalTable}
  

        {type === "loadmore" && (
          <button onClick={() => setPage((prev) => prev + 1)}>
            load more
          </button>
        )}
      </div>
    );
  }