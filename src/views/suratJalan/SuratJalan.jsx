import React, { useState } from "react";
import TableCustom from "../../custom/Table.jsx";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axios-client.js";
import {Tabs, Tab, Card, CardBody, CardHeader} from "@nextui-org/react";
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

export default function SuratJalan() {

  const [loading, setLoading] = useState(false)
  const [datas, setDatas] = useState([])
  const [activeTab, setActiveTab] = useState('draft');
  const [activeTabData, setActiveTabData] = useState([]);
  let tabs = [
    {
      id: "draft",
      label: "Draft",
      title: "Surat Jalan Proses Draft List",
      apiname: "suratjalan/draft",
      isHidden: false
    },
    {
      id: "onApproval",
      label: "On Approval",
      title: "Surat Jalan Proses On Approval List",
      apiname: "suratjalan/onApproval",
      isHidden: true
    },
    {
      id: "done",
      label: "Done",
      title: "Surat Jalan Proses Done List",
      apiname: "suratjalan/done",
      isHidden: true
    },
    {
      id: "rejected",
      label: "Rejected",
      title: "Surat Jalan Rejected List",
      apiname: "suratjalan/rejected",
      isHidden: true
    }
  ];

  const handleTabChange = (id) => {
    setDatas([])
    console.log(id)
    setActiveTab(id);
    setActiveTabData(tabs.find((tab) => tab.id === id));
  };

  const navigate = useNavigate();

  const columns = [
      {name: "COMPANY", uid: "company", sortable: true},
      {name: "MENYERAHKAN", uid: "menyerahkan", sortable: true},
      {name: "TANGGAL MENYERAHKAN", uid: "menyerahkan_date", sortable: true},
      {name: "STATUS", uid: "status", sortable: true},
      {name: "ACTIONS", uid: "actions", headerClassName:'text-end'},
    ];


  const addBtn =()=>{
    navigate("/suratjalan/new");
  }

  const addButton = () => {
    return (
      <div>
      <Button color="primary" endContent={<PlusIcon />} onClick={addBtn} hidden={activeTabData.isHidden}>
        Add New
      </Button>
      </div>
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
          axiosClient.delete(`/suratjalan/${key}`).then(() => {
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
        .get('/all'+activeTabData.apiname)
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
            <DropdownItem key={"/suratjalan/" + data.id + "/view"}>View</DropdownItem>
            <DropdownItem key={"/suratjalan/" + data.id} hidden={activeTabData.isHidden}>Edit</DropdownItem>
            <DropdownItem key={data.id} hidden={activeTabData.isHidden}>Delete</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  };

  return (
    <div className="flex-col justify-center bg-white p-4 rounded-large animated fadeInDown ">
      <Tabs aria-label="Dynamic tabs" items={tabs} onSelectionChange={handleTabChange}>
      {(item) => (
        <Tab key={item.id} title={item.label}>
          <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid grey' }}>
            <h1>{item.title}</h1>
          </div>
          <TableCustom columns={columns} addButton={addButton} renderCellTable={renderCellTable} getDatas={getDatas} loading={loading} datas={datas}/>
        </Tab>
      )}
    </Tabs>
    </div>
  );
}
