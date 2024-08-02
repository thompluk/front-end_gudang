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

export default function PermintaanPembelianBarang() {

  const [activeTab, setActiveTab] = useState('draft');
  const [activeTabData, setActiveTabData] = useState([]);;
  let tabs = [
    {
      id: "draft",
      label: "Draft",
      title: "Permintaan Pembelian Barang Draft List",
      apiname: "ppb/draft",
      isHidden: false
    },
    {
      id: "onApproval",
      label: "On Approval",
      title: "Permintaan Pembelian Barang On Approval List",
      apiname: "ppb/onApproval",
      isHidden: true
    },
    {
      id: "done",
      label: "Done",
      title: "Permintaan Pembelian Barang Done List",
      apiname: "ppb/done",
      isHidden: true
    },
    {
      id: "rejected",
      label: "Rejected",
      title: "Permintaan Pembelian Barang Rejected List",
      apiname: "ppb/rejected",
      isHidden: true
    }
  ];

  const handleTabChange = (id) => {
    console.log(id)
    setActiveTab(id);
    setActiveTabData(tabs.find((tab) => tab.id === id));
  };

  const navigate = useNavigate();
  const [ppb, setPpb] = useState([])

  const columns = [
      {name: "No PPB", uid: "no_ppb", sortable: true},
      {name: "TANGGAL", uid: "tanggal", sortable: true},
      {name: "PEMOHON", uid: "pemohon", sortable: true},
      {name: "STATUS", uid: "status", sortable: true},
      {name: "ACTIONS", uid: "actions", headerClassName:'text-end'},
    ];


  const addBtn =()=>{
    navigate("/ppb/new");
  }

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
          axiosClient.delete(`/${apiname}/${key}`).then(() => {
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
            <DropdownItem key={"/ppb/" + data.id + "/view"}>View</DropdownItem>
            <DropdownItem key={"/ppb/" + data.id} hidden={activeTabData.isHidden}>Edit</DropdownItem>
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
          <TableCustom columns={columns} apiname={item.apiname} addBtn={addBtn} renderCellTable={renderCellTable} />
        </Tab>
      )}
    </Tabs>
    </div>
  );
}
