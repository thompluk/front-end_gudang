import React from "react";
import TableCustom from "../../custom/Table.jsx";
import { useNavigate } from "react-router-dom";
import { 
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem, 
  Button,
} from "@nextui-org/react";
import { VerticalDotsIcon } from "../../assets/VerticalDotIcon";

export default function Approval() {

  const navigate = useNavigate();
  const columns = [
    {name: "ID", uid: "id", sortable: true},
    {name: "NO_PPB", uid: "no_ppb", sortable: true},
    {name: "TANGGAL", uid: "tanggal", sortable: true},
    {name: "PEMOHON", uid: "pemohon", sortable: true},
    {name: "TIPE", uid: "tipe", sortable: true},
    {name: "ACTIONS", uid: "actions", headerClassName:'text-end'},
  ];

  const apiname = "indexApproval";

  const addBtn =()=>{
    navigate("/approval");
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
            <DropdownItem key={"/approval/" + data.id + "/"+data.tipe}>View</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  };

  return (
    <div className="flex-col justify-center bg-white p-4 rounded-large animated fadeInDown ">
      <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid grey' }}>
          <h1>Approval List</h1>
      </div>
      <TableCustom columns={columns} apiname={apiname} addBtn={addBtn} renderCellTable={renderCellTable}>
      </TableCustom>
    </div>
  );
}
