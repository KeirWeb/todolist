import React from "react"
import { Button } from "@mui/material"
import { FilterValuesType, todolistsActions } from "features/TodolistsList/model/todolists.slise"
import { useActions } from "common/hooks"

type Props = {
  filters: FilterValuesType[]
  filterState: FilterValuesType
  todolistId: string
}

const FilterTasksButton = ({ filters, todolistId, filterState }: Props) => {
  console.log(filterState === "all")

  const { changeTodolistFilter } = useActions(todolistsActions)

  const handleChangeFilter = (filter: FilterValuesType) =>
    changeTodolistFilter({ filter, id: todolistId })

  return (
    <>
      {filters.map((filter) => (
        <Button
          key={filter}
          variant={filterState === filter ? "outlined" : "text"}
          onClick={() => handleChangeFilter(filter)}
          color={"inherit"}
        >
          {filter}
        </Button>
      ))}
    </>
  )
}

export default FilterTasksButton
