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
  Input,
} from "@nextui-org/react";
import { VerticalDotsIcon } from "../../assets/VerticalDotIcon";
import { PlusIcon } from "../../assets/PlusIcon";
import Swal from 'sweetalert2'
import * as XLSX from "xlsx";
import { FaFileUpload } from "react-icons/fa";
import { LuDownload } from "react-icons/lu";
import { useStateContext } from "../../contexts/ContextProvider.jsx";

export default function Users() {
 
  const {user} = useStateContext(); 
  const [loadingUpload, setLoadingUpload] = useState(false)
  const [loading, setLoading] = useState(false)
  const [datas, setDatas] = useState([])
  const navigate = useNavigate();
  const columns = [
    {name: "No.", uid: "no", sortable: false},
    {name: "ID", uid: "id", sortable: true},
    {name: "NAME", uid: "name", sortable: true},
    {name: "EMAIL", uid: "email", sortable: true},
    {name: "PHONE NUMBER", uid: "phone_number", sortable: true},
    {name: "ROLE", uid: "role", sortable: true},
    {name: "ACTIONS", uid: "actions", headerClassName:'text-end'},
  ];

  const addBtn =()=>{
    navigate("/users/new");
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
      console.log(key);
      if (key.includes('delete')) {
        const apiKey = key.split('delete')[1];
        // console.log(apiKey);
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
            axiosClient.delete(`/user/${apiKey}`).then(() => {
              Toast.fire({
                icon: "success",
                title: "Delete is successfully"
              });
              getDatas()
            });
          }
        });
      }else{
        const apiKey = key.split('reset')[1];
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this! Password will be reset to default (Password: 12345).",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        }).then((result) => {
          if (result.isConfirmed) {
            axiosClient.post(`/resetPassword/${apiKey}`).then(() => {
              Toast.fire({
                icon: "success",
                title: "Delete is successfully"
              });
              getDatas()
            });
          }
        });
      }
    }
  };

  const getDatas = () => {
    setLoading(true)
    axiosClient
      .get('/alluser')
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
            <DropdownItem key={"/users/" + data.id + "/view"}>View</DropdownItem>
            <DropdownItem key={"/users/" + data.id} hidden = {user.role !== 'ADMIN'}>Edit</DropdownItem>
            <DropdownItem key={'delete'+data.id} hidden = {user.role !== 'ADMIN'}>Delete</DropdownItem>
            <DropdownItem key={'reset'+data.id} hidden = {user.role !== 'ADMIN'}>Reset Password</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  };

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
      setFile(event.target.files[0]); // Ambil file dari input
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
        setMessage('Please select a file to upload.');
        return;
    }
    
    const formData = new FormData();
    formData.append('file', file); // Menambahkan file ke FormData

    setLoadingUpload(true);
    axiosClient
      .post('/user/upload-excel', formData , {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
      .then(({}) => {
        Toast.fire({
          icon: "success",
          title: "Create is successfully"
        });
        setLoadingUpload(false);
        getDatas();
      })
      .catch(err => {
        setLoadingUpload(false);
        const response = err.response
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data.message,
          // footer: '<a href="#">Why do I have this issue?</a>'
        });
        if (response && response.status === 404) {
          setMessage(response.data.message);
          setErrors(true);
          console.log(errors) ;
        }
      })
  };

  const handleUpload = async () => {
    const { value: file } = await Swal.fire({
      title: "Select file excel",
      input: "file",
      inputAttributes: {
        "accept": ".xlsx,.xls,.csv",
        // accept=".xlsx,.xls,.csv"
        "aria-label": "Upload your excel file"
      }
    });
    if (file) {
      const formData = new FormData();
      formData.append('file', file); // Menambahkan file ke FormData
      setLoadingUpload(true);
      axiosClient
      .post('/user/upload-excel', formData , {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
      .then(({}) => {
        Toast.fire({
          icon: "success",
          title: "Create is successfully"
        });
        setLoadingUpload(false);
        getDatas();
      })
      .catch(err => {
        setLoadingUpload(false);
        const response = err.response
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data.message,
          // footer: '<a href="#">Why do I have this issue?</a>'
        });
        if (response && response.status === 404) {
          setMessage(response.data.message);
          setErrors(true);
          console.log(errors) ;
        }
      })
    };
  };


  const downloadExcel = () => {
    // Tambahkan header di baris pertama
    const header = [["Name", "Email", "Phone Number", "Password", "Role"]];
  
    // Data yang akan di-download ke dalam Excel
    const data = [
      [],
    ];
  
    // Gabungkan header dan data
    const sheetData = [...header, ...data];
  
    // Buat worksheet dari data
    const ws = XLSX.utils.aoa_to_sheet(sheetData); // AOA stands for Array of Arrays
  
    // Terapkan gaya untuk kolom yang wajib diisi (A1, B1, dan C1)
    // ws["A1"].c = [{ t: "Kolom ini wajib diisi"}];
    // ws["A1"].c.hidden = true;
    // ws["B1"].c = [{ t: "Kolom ini wajib diisi" }];
    // ws["B1"].c.hidden = true;
    ws["C1"].c = [{ t: "Gunakan ( ' ) sebelum angka 0 contoh: '08123912381 " }];
    ws["C1"].c.hidden = true;
    ws["E1"].c = [{ t: "Opsi yang tersedia: ADMIN, SALES, PURCHASING, WAREHOUSE" }];
    ws["E1"].c.hidden = true;

    // Buat workbook baru dan tambahkan worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  
    // Generate dan download file Excel
    XLSX.writeFile(wb, "templateUser.xlsx");
  };

  return (
    <div className="flex-col justify-center bg-white p-4 rounded-large animated fadeInDown ">
      {loadingUpload && (
            <div className="row">
              <div className="col-md-12 mb-12 text-center">Loading...</div>
            </div>
          )}
      {!loadingUpload && (
        <div>
          <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid grey' }}>
              <h1>User List</h1>
          </div>
          <div className="pt-2" hidden = {user.role !== 'ADMIN'}>
            <div className="flex gap-2">
              <Button className="bg-blue-300" onClick={handleUpload}>Upload <FaFileUpload size={'20px'} color="black"/> </Button>
              <Button className="bg-orange-300" onClick={downloadExcel}>Download Template <LuDownload size={'20px'} color="black"/></Button>
            </div>
          </div>
          <TableCustom columns={columns} addButton={addButton} renderCellTable={renderCellTable} getDatas={getDatas} loading={loading} datas={datas}/>
        </div>)}
    </div>
  );
}
