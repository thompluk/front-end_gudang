import React from "react";
import { useEffect, useState} from 'react'
import axiosClient from "../axios-client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Spinner,
} from "@nextui-org/react";
import { PlusIcon } from "../assets/PlusIcon";
import { SearchIcon } from "../assets/SearchIcon";
import { VerticalDotsIcon } from "../assets/VerticalDotIcon";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'

const TableCustom = ( {columns = [], addButton, renderCellTable, getDatas, loading, datas}) => {
    // const [datas, setDatas] = useState([])
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    // const [loading, setLoading] = useState(false)
    const [sortDescriptor, setSortDescriptor] = React.useState({
      column: "id",
      direction: "ascending",
    });
  
    useEffect(() => {
        getDatas()
    }, [])
  
    // const getDatas = () => {
    //   setLoading(true)
    //   axiosClient
    //     .get('/all'+apiname)
    //     .then(({ data }) => {
    //       setLoading(false)
    //       setDatas(data.data)
    //     })
    //     .catch(() => {
    //       setLoading(false)
    //     })
    // }
  
    const [page, setPage] = React.useState(1);
  
    const hasSearchFilter = Boolean(filterValue);
  
    const filteredItems = React.useMemo(() => {
      let filteredDatas = [...datas];
  
      if (hasSearchFilter) {
        filteredDatas = filteredDatas.filter((data) =>
          Object.values(data).some((value) =>
            String(value).toLowerCase().includes(filterValue.toLowerCase())
          )
        );
      }
  
      return filteredDatas;
    }, [datas, filterValue]);
  
    const pages = Math.ceil(filteredItems.length / rowsPerPage);
  
    const items = React.useMemo(() => {
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage;
  
      return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);
  
    const sortedItems = React.useMemo(() => {
      return [...items].sort((a, b) => {
        const first = a[sortDescriptor.column];
        const second = b[sortDescriptor.column];
        const cmp = first < second ? -1 : first > second ? 1 : 0;
  
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      });
    }, [sortDescriptor, items]);
  
    const navigate = useNavigate();
  
    // const handleAction = async (key) => {
    //   if (key.startsWith('/')) {
    //     // Navigasi ke path
    //     navigate(key);
    //   } else{
    //     // Aksi hapus
  
    //     Swal.fire({
    //       title: "Are you sure?",
    //       text: "You won't be able to revert this!",
    //       icon: "warning",
    //       showCancelButton: true,
    //       confirmButtonColor: "#3085d6",
    //       cancelButtonColor: "#d33",
    //       confirmButtonText: "Yes, delete it!"
    //     }).then((result) => {
    //       if (result.isConfirmed) {
    //         axiosClient.delete(`/${apiname}/${key}`).then(() => {
    //           Swal.fire({
    //             title: "Deleted!",
    //             text: "Your file has been deleted.",
    //             icon: "success"
    //           });
    //           getDatas()
    //         });
    //       }
    //     });
    //   }
    // };
  
    // const renderCell = React.useCallback((data, columnKey) => {
    //   const cellValue = data[columnKey];
  
    //   switch (columnKey) {
    //     case "actions":
    //       return (
    //         <div className="relative flex justify-end items-center gap-2">
    //           <Dropdown>
    //             <DropdownTrigger>
    //               <Button isIconOnly size="sm" variant="light">
    //                 <VerticalDotsIcon className="text-default-300" />
    //               </Button>
    //             </DropdownTrigger>
    //             <DropdownMenu onAction={handleAction}>
    //               <DropdownItem key={"/"+pathname+"/"+data.id +"/view"}>View</DropdownItem>
    //               <DropdownItem key={"/"+pathname+"/"+data.id} hidden={isHidden}>Edit</DropdownItem>
    //               <DropdownItem key={data.id} hidden={isHidden}>Delete</DropdownItem>
    //             </DropdownMenu>
    //           </Dropdown>
    //         </div>
    //       );
    //     default:
    //       return cellValue;
    //   }
    // }, []);

    const renderCell = React.useCallback((data, columnKey) => {
      const cellValue = data[columnKey];
  
      switch (columnKey) {
        case 'actions':
          return (
            <div>
              {renderCellTable(data)}
            </div>
          );
        default:
          return cellValue;
      }
    }, [renderCellTable]);
  
    const onNextPage = React.useCallback(() => {
      if (page < pages) {
        setPage(page + 1);
      }
    }, [page, pages]);
  
    const onPreviousPage = React.useCallback(() => {
      if (page > 1) {
        setPage(page - 1);
      }
    }, [page]);
  
    const onRowsPerPageChange = React.useCallback((e) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    }, []);
  
    const onSearchChange = React.useCallback((value) => {
      if (value) {
        setFilterValue(value);
        setPage(1);
      } else {
        setFilterValue("");
      }
    }, []);
  
    const onClear = React.useCallback(()=>{
      setFilterValue("")
      setPage(1)
    },[])

    
    const topContent = React.useMemo(() => {
        // let path = "/"+pathname+"/new"
      return (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between gap-3 items-end">
            <Input
              isClearable
              className="w-full sm:max-w-[44%]"
              placeholder="Search "
              startContent={<SearchIcon />}
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
            />
            <div className="flex gap-3">
              {/* <Link to={path}> */}
                {/* <Button color="primary" endContent={<PlusIcon />} onClick={addBtn}>
                  Add New
                </Button> */}
                {addButton()}
              {/* </Link> */}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-default-400 text-small">Total {datas.length} Data</span>
            <label className="flex items-center text-default-400 text-small">
              Rows per page:
              <select
                className="bg-transparent outline-none text-default-400 text-small"
                onChange={onRowsPerPageChange}
              >
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
            </label>
          </div>
        </div>
      );
    }, [
      filterValue,
      onRowsPerPageChange,
      datas.length,
      onSearchChange,
      hasSearchFilter,
    ]);
  
    const bottomContent = React.useMemo(() => {
      return (
        <div className="py-2 px-2 flex justify-between items-center">
          <span className="w-[30%] text-small text-default-400">
            {selectedKeys === "all"
              ? "All items selected"
              : `${selectedKeys.size} of ${filteredItems.length} selected`}
          </span>
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={pages}
            onChange={setPage}
          />
          <div className="hidden sm:flex w-[30%] justify-end gap-2">
            <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
              Previous
            </Button>
            <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
              Next
            </Button>
          </div>
        </div>
      );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);
  
    return (
        <Table
          aria-label="Table with custom cells, pagination and sorting"
          className="pt-8"
          isHeaderSticky
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          classNames={{
            wrapper: "max-h-screen",
          }}
          selectedKeys={selectedKeys}
          selectionMode="multiple"
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSelectionChange={setSelectedKeys}
          onSortChange={setSortDescriptor}
        >
          
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
                className={column.headerClassName}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent={"No Data found"} items={sortedItems} isLoading={loading} loadingContent={<Spinner label="Loading..." />}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
          {/* )} */}
        </Table>
    );
}

export default TableCustom;

