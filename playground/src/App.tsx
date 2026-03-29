
import useResource from "@core/hooks/useResource";
import DataTable from "@core/components/DataTable";
import { useCallback } from "react";
import './App.css'

function App() {
  const {data , loading , error,page , setPage ,setScrollTop ,offsetY , totalHeight ,totalItems , scrollRef} = useResource({
    source: useCallback(async({page =1  , pageSize =10}) => {
      const skip = (page!-1) * pageSize!;
      const res = await fetch( `https://dummyjson.com/todos?limit=${pageSize}&skip=${skip}`);
      const json = await res.json();
      return json.todos;
    },[]),
    pagination: {type : "loadmore"},

  })

  return <div>
  <DataTable
  data={data}
  loading={loading}
  error={error}
  page={page}
  setPage={setPage}
  setScrollTop={setScrollTop}
  type="loadmore"
  virtualization={true}
  offsetY={offsetY}
  totalHeight={totalHeight}
  totalItems={totalItems}
  scrollRef = {scrollRef}
/>
  </div>
}

export default App
