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
  Tab,
  Tabs,
} from "@nextui-org/react";
import { VerticalDotsIcon } from "../../assets/VerticalDotIcon";
import { PlusIcon } from "../../assets/PlusIcon";
import Swal from 'sweetalert2'

export default function Approval() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [datas, setDatas] = useState([])

  const [activeTab, setActiveTab] = useState('draft');
  const [activeTabData, setActiveTabData] = useState([]);
  let tabs = [
    {
      id: "approval",
      label: "Approval",
      title: "Approval List",
      apiname: "indexApproval",
      isHidden: false,
      columns: [
        {name: "ID", uid: "id", sortable: true},
        {name: "NO", uid: "no", sortable: true},
        {name: "TANGGAL", uid: "tanggal", sortable: true},
        {name: "PEMOHON", uid: "pemohon", sortable: true},
        {name: "TIPE", uid: "tipe", sortable: true},
        {name: "ACTIONS", uid: "actions", headerClassName:'text-end'},
      ]
    },
    {
      id: "record",
      label: "Record of Approval",
      title: "Record of Approval List",
      apiname: "indexApprovalRecord",
      isHidden: true,
      columns: [
        {name: "NO", uid: "no", sortable: true},
        {name: "DATE", uid: "date", sortable: true},
        {name: "TYPE", uid: "type", sortable: true},
        {name: "REQUESTOR", uid: "requestor", sortable: true},
        {name: "APPROVER", uid: "approver", sortable: true},
        {name: "ACTION", uid: "action", sortable: true},
        {name: "REMARKS", uid: "remarks", sortable: true},
        // {name: "ACTIONS", uid: "actions", headerClassName:'text-end'},
      ]
    }
  ];

  const handleTabChange = (id) => {
    setDatas([])
    console.log(id)
    setActiveTab(id);
    setActiveTabData(tabs.find((tab) => tab.id === id));
  };

  // const columns = [
  //   {name: "ID", uid: "id", sortable: true},
  //   {name: "NO", uid: "no", sortable: true},
  //   {name: "TANGGAL", uid: "tanggal", sortable: true},
  //   {name: "PEMOHON", uid: "pemohon", sortable: true},
  //   {name: "TIPE", uid: "tipe", sortable: true},
  //   {name: "ACTIONS", uid: "actions", headerClassName:'text-end'},
  // ];

  const addBtn =()=>{
    navigate("/approval");
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
          axiosClient.delete(`/approval/${key}`).then(() => {
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
            <DropdownItem key={"/approval/" + data.id + "/"+data.tipe} hidden={activeTabData.isHidden}>View</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  };

  return (
    <div className="flex-col justify-center bg-white p-4 rounded-large animated fadeInDown ">
      {/* <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid grey' }}>
          <h1>Approval List</h1>
      </div>
      <TableCustom columns={columns} addButton={addButton} renderCellTable={renderCellTable} getDatas={getDatas} loading={loading} datas={datas}/> */}
      <Tabs aria-label="Dynamic tabs" items={tabs} onSelectionChange={handleTabChange}>
      {(item) => (
        <Tab key={item.id} title={item.label}>
          <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid grey' }}>
            <h1>{item.title}</h1>
          </div>
          <TableCustom columns={activeTabData.columns} addButton={addButton} renderCellTable={renderCellTable} getDatas={getDatas} loading={loading} datas={datas}/>
        </Tab>
      )}
      </Tabs>
    </div>
  );
}
