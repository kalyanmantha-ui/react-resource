
import useResource from "@core/hooks/useResource";
import DataTable from "@core/components/DataTable";
import { useCallback } from "react";
import './App.css'

function App() {
  const {data , loading , error} = useResource({
    source: useCallback(async({page , pageSize}) => {
      const skip = (page!-1) * pageSize!;
      const res = await fetch( `https://dummyjson.com/todos?limit=${pageSize}&skip=${skip}`);
      const json = await res.json();
      return json.todos;
    },[]),
    pagination: { page: 1, pageSize: 10 }
  })

  return <div>
   <DataTable data={data} loading = {loading} error = {error}/>
  </div>
}

export default App
