import "./DataTable.css";
type DataTableProps<T extends Record<string,unknown>> = {
    data : T[];
    loading? :boolean;
    error? : Error |null; 
}
export default function DataTable<T extends Record<string,unknown>>(props : DataTableProps<T >){
    const data = props.data;
    const loading = props.loading;
    const error = props.error;
    
    return <div>
        {loading ? <div>LOading...</div> : error ? <div>{error.message}</div> : data.length ===0 ? <p>No Data to create Table</p> :<table>
            <thead><tr>{Object.keys(data[0]).map((val) =><th key={val}>{val}</th> )}</tr></thead>
            <tbody>{data.map((val : T,index : number) => {
                const row = [];
                const currKeys = Object.keys(val);
                for(let i=0 ; i<currKeys.length ; i++){
                    const value = (val as Record<string, unknown>)[currKeys[i]];
                    row.push(<td>{value != null ? value.toString() : "-"}</td>);
                }
                return <tr key={index}>{row}</tr>
            })}</tbody>
            </table>}

    </div>
}