
import useResource from "@core/hooks/useResource";
import DataTable from "@core/components/DataTable";
import { useCallback } from "react";
import type { ResourceParams } from "@core/engine/source";
import './App.css'

function App() {
  const {data , loading , error,page , setPage ,setScrollTop ,offsetY , totalHeight ,totalItems , scrollRef , hasNext} = useResource({
    source: useCallback(async({page =1  , pageSize}:ResourceParams) => {
      const skip = (page!-1) * pageSize!;
      const res = await fetch( `https://dummyjson.com/todos?limit=${pageSize}&skip=${skip}`);
      const json = await res.json();
      return json.todos;
    },[]),
    pagination: {type : "page" , pageSize : 50},
    virtualization : {enabled : true , itemHeight : 200 , containerHeight : 1600}
  })

  return <div>
  <DataTable
  data={data}
  loading={loading}
  error={error}
  page={page}
  setPage={setPage}
  setScrollTop={setScrollTop}
  type="page"
  virtualization={true}
  offsetY={offsetY}
  totalHeight={totalHeight}
  totalItems={totalItems}
  scrollRef = {scrollRef}
  hasNext = {hasNext}
/>
  </div>
}

export default App
