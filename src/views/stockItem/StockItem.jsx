import React, { useState } from "react";
import TableCustom from "../../custom/Table.jsx";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axios-client.js";
import { 
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem, 
  Button,
} from "@nextui-org/react";
import { VerticalDotsIcon } from "../../assets/VerticalDotIcon";
import { PlusIcon } from "../../assets/PlusIcon";
import Swal from 'sweetalert2'

export default function StockItem() {

  const [loading, setLoading] = useState(false)
  const [datas, setDatas] = useState([])
  const navigate = useNavigate();
  const columns = [
    {name: "STOCK NAME", uid: "stock_name", sortable: true},
    {name: "TIPE", uid: "tipe", sortable: true},
    {name: "PRINSIPAL", uid: "prinsipal", sortable: true},
    {name: "QUANTITY", uid: "quantity", sortable: true},
    {name: "ACTIONS", uid: "actions", headerClassName:'text-end'},
  ];

  const addBtn =()=>{
    navigate("/stockitem/new");
  }

  const addButton = () => {
    return (
      <Button color="primary" endContent={<PlusIcon />} onClick={addBtn} hidden>
        Add New
      </Button>
    );
  };

  const handleAction = async (key) => {
    if (key.startsWith('/')) {
      // Navigasi ke path
      navigate(key);
    } else{
      // Aksi hapus

      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          axiosClient.delete(`/stockitem/${key}`).then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
            getDatas()
          });
        }
      });
    }
  };

  const getDatas = () => {
    setLoading(true)
    axiosClient
      .get('/allstockitem')
      .then(({ data }) => {
        setLoading(false)
        setDatas(data.data)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const renderCellTable = (data) => {

    return (
      <div className="relative flex justify-end items-center gap-2">
        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="light">
              <VerticalDotsIcon className="text-default-300" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu onAction={handleAction}>
            <DropdownItem key={"/stockitem/" + data.id + "/view"}>View</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  };

  return (
    <div className="flex-col justify-center bg-white p-4 rounded-large animated fadeInDown ">
      <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid grey' }}>
          <h1>Stock Item List</h1>
      </div>
      <TableCustom columns={columns} addButton={addButton} renderCellTable={renderCellTable} getDatas={getDatas} loading={loading} datas={datas}/>
    </div>
  );
}