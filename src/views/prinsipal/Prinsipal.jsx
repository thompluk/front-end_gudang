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
import { useStateContext } from "../../contexts/ContextProvider.jsx";

export default function Prinsipal() {

  const {user} = useStateContext(); 
  const [loading, setLoading] = useState(false)
  const [datas, setDatas] = useState([])
  const navigate = useNavigate();
  const columns = [
    {name: "No.", uid: "no", sortable: false},
    {name: "NAME", uid: "name", sortable: true},
    {name: "TELEPHONE", uid: "telephone", sortable: true},
    {name: "FAX", uid: "fax", sortable: true},
    {name: "ACTIONS", uid: "actions", headerClassName:'text-end'},
  ];

  const addBtn =()=>{
    navigate("/prinsipal/new");
  }

  const addButton = () => {
    return (
      <Button color="primary" endContent={<PlusIcon />} onClick={addBtn} hidden = {user.role !== 'ADMIN'}>
        Add New
      </Button>
    );
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });  

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
          axiosClient.delete(`/prinsipal/${key}`).then(() => {
            Toast.fire({
              icon: "success",
              title: "Delete is successfully"
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
      .get('/allprinsipal')
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
            <DropdownItem key={"/prinsipal/" + data.id + "/view"}>View</DropdownItem>
            <DropdownItem key={"/prinsipal/" + data.id} hidden = {user.role !== 'ADMIN'}>Edit</DropdownItem>
            <DropdownItem key={data.id} hidden = {user.role !== 'ADMIN'}>Delete</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  };

  return (
    <div className="flex-col justify-center bg-white p-4 rounded-large animated fadeInDown ">
      <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid grey' }}>
          <h1>Prinsipal List</h1>
      </div>
      <TableCustom columns={columns} addButton={addButton} renderCellTable={renderCellTable} getDatas={getDatas} loading={loading} datas={datas}/>
    </div>
  );
}
