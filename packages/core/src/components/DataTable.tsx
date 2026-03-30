import "./DataTable.css";

type DataTableProps<T extends Record<string, unknown>> = {
  data: T[];
  loading?: boolean;
  error?: Error | null;
  page?: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setScrollTop: React.Dispatch<React.SetStateAction<number>>;
  type: "page" | "loadmore" | "infinite";
  virtualization?: boolean;
  offsetY?: number;
  totalHeight?: number;
  totalItems?: number;
  scrollRef?: React.RefObject<HTMLDivElement> | null;
  hasNext: boolean;
};

export default function DataTable<T extends Record<string, unknown>>(
  props: DataTableProps<T>
) {
  const {
    data,
    loading,
    error,
    page,
    setPage,
    setScrollTop,
    type,
    virtualization,
    hasNext,
  } = props;

  const offsetY = props.offsetY ?? 0;
  const totalHeight = props.totalHeight ?? 0;
  const itemHeight = 50;
  const colCount = data[0] ? Object.keys(data[0]).length : 1;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if ((props.totalItems ?? data.length) === 0)
    return <p>No Data to create Table</p>;

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
        {virtualization && (
          <tr style={{ height: offsetY }}>
            <td colSpan={colCount} />
          </tr>
        )}

        {data.map((val, index) => (
          <tr key={index}>
            {Object.keys(val).map((key) => {
              const value = (val as Record<string, unknown>)[key];
              return (
                <td key={key}>
                  <div className="cell">
                    {value != null ? value.toString() : "-"}
                  </div>
                </td>
              );
            })}
          </tr>
        ))}

        {virtualization && (
          <tr
            style={{
              height:
                totalHeight - offsetY - data.length * itemHeight,
            }}
          >
            <td colSpan={colCount} />
          </tr>
        )}
      </tbody>
    </table>
  );

  const finalTable = virtualization ? (
    <div
      ref={props.scrollRef ?? null}
      style={{ height: 400, overflowY: "auto" }}
      onScroll={(e) => {
        setScrollTop(e.currentTarget.scrollTop);
      }}
    >
      {content}
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
          <button
            onClick={() =>
              setPage((prev) => {
                if (hasNext) return prev + 1;
                return prev;
              })
            }
          >
            next
          </button>
        </div>
      )}

      {finalTable}

      {type === "loadmore" && (
        <button
          disabled={!hasNext}
          onClick={() => setPage((prev) => prev + 1)}
        >
          load more
        </button>
      )}
    </div>
  );
}