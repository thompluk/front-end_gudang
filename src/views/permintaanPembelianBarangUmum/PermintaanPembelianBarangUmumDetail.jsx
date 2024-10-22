import React, { createRef } from 'react'
import { useEffect, useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Textarea,
  Button,
  Spinner,
  Image,
  DatePicker,
} from '@nextui-org/react'
import axiosClient from '../../axios-client'
import {PlusIcon} from '../../assets/PlusIcon'
import DeleteIcon from '../../assets/delete.png'
import Swal from 'sweetalert2'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";
import TableSelect from '../../custom/TableSelect'
// import { IconButton } from "@material-tailwind/react";

export default function PermintaanPembelianBarangUmumDetail() {
  const navigate = useNavigate()
  const [ppb_id, setPpbid] = useState([])
  // const [details, setDetails] = useState([])
  // const [ppbs, setPpbs] = useState([])
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const { param,param2 } = useParams()
  const [message, setMessage] = useState(null)
  const [disabledView, setDisabledView ] = useState(false)

  const [ppbData, setPpbData] = useState({
    tanggal: '',
    no_ppb: '',
    status: '',
    pemohon: '',
    mengetahui: '',
    mengetahui_id: '',
    mengetahui_status: '',
    menyetujui: '',
    menyetujui_id: '',
    menyetujui_status: '',
    purchasing: '',
    remarks: '',
  })

  const [details, setDetails] = useState([
    {
      id: null,
      nama_barang: "",
      kode: "",
      spesifikasi: "",
      quantity: "",
      expected_eta: "",
      project_and_customer: "",
    }
  ]);

  const btnBack = () => [
    navigate('/ppbumum')
  ]



  useEffect(() => {

    if (param == 'new'){
      // addData();
    }
    if (param != 'new') {
      getDetails();
      getPpb();
    }
    if (param2 == 'view') {
      setDisabledView(true)
    }

  }, [])

  
  const getPpb = () => {
    setLoading(true)
    axiosClient
      .get('/ppb/' + param)
      .then(({ data }) => {
        setPpbData({
          tanggal: data.data.tanggal,
          no_ppb: data.data.no_ppb,
          status: data.data.status,
          pemohon: data.data.pemohon,
          mengetahui: data.data.mengetahui,
          mengetahui_id: data.data.mengetahui_id,
          mengetahui_status: data.data.mengetahui_status,
          menyetujui: data.data.menyetujui,
          menyetujui_id: data.data.menyetujui_id,
          menyetujui_status: data.data.menyetujui_status,
          purchasing: data.data.purchasing,
          purchasing_status: data.data.purchasing_status,
          remarks: data.data.remarks,
        })
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const getDetails = () => {

    setLoading2(true);

    axiosClient
      .get('/ppbdetaillist/'+ param)
      .then(({ data }) => {
        setDetails(data.data);
        setLoading2(false);
      })
      .catch(() => {
        setLoading2(false);
      })
  }


  // const [rows, setRows] = useState(details);

  //   useEffect(() => {
  //       setRows(details);
  //   }, [details]);

    // const handleInputChange = (id, field, value) => {
    //     setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row));
    // };

    const handleInputChange = (index, field, value) => {
      setDetails(details.map((row, i) => i === index ? { ...row, [field]: value } : row));
  };
  const handleDelete = (index) => {

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
        if (details[index].id !== null) {
          // Jika id tidak null, panggil fungsi btnDeleteDetail
            deleteDetail(details[index].id);
          }
      
        const updatedDetails = details.filter((_, i) => i !== index);
        setDetails(updatedDetails);
      }
    });

    
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

    // User Select Table
    const columns = [
      {name: "ID", uid: "id", sortable: true},
      {name: "NAME", uid: "name", sortable: true},
      {name: "EMAIL", uid: "email", sortable: true},
      {name: "PHONE NUMBER", uid: "phone_number", sortable: true},
      {name: "ROLE", uid: "role", sortable: true},
      {name: "ACTIONS", uid: "actions", headerClassName:'text-end'},
    ];
  
    const apiname = "userSelect";

  return (
    <div className="bg-white p-4 rounded-large animated fadeInDown">
      <div className="flex-col items-center">
        <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid grey' }}>
          <h1>Permintaan Pembelian Barang Umum</h1>
          <Button className="bg-red-300" onClick={btnBack}>
            Back
          </Button>
        </div>
          <div className="pt-8">
              {loading && (
                  <div className="row">
                    <div className="col-md-12 mb-12 text-center">Loading...</div>
                  </div>
              )}
              {!loading && (
              <div>
                <div className="flex w-full flex-wrap md:flex-nowrap pt-4 pb-2">
                  <div  className=" p-2 xl:w-1/5 w-full">
                    <Input
                    id="tanggal"
                    // ref={tanggalRef}
                    variant="bordered"
                    className="bg-white "
                    type="text"
                    defaultValue={ppbData.tanggal}
                    label="Tanggal"
                    isInvalid={message?.tanggal != null}
                    errorMessage={message?.tanggal}
                    isReadOnly={true}
                  />
                  </div>

                  <div  className=" p-2 xl:w-1/5 w-full">
                    <Input
                      id="no_ppb"
                      // ref={no_ppbRef}
                      variant="bordered"
                      className="bg-white "
                      type="text"
                      defaultValue={ppbData.no_ppb}
                      label="No. PPB"
                      isInvalid={message?.no_ppb != null}
                      errorMessage={message?.no_ppb}
                      isReadOnly={true}
                    />
                  </div>
                  <div  className="xl:w-2/4 w-full"></div>
                  <div  className="xl:w-1/10 w-full p-4" hidden={ppbData.status === ''}>
                    <p id="status" >
                      Status : {ppbData.status}
                    </p>
                  </div>

                </div>
                <Table aria-label="Example static collection table" className='p-2'>
                <TableHeader>
                    <TableColumn className='w-1/5'>NAMA BARANG</TableColumn>
                    <TableColumn className='w-1/10'>KODE</TableColumn>
                    <TableColumn className='w-1/5'>SPESIFIKASI</TableColumn>
                    <TableColumn className='w-1/10'>QTY</TableColumn>
                    <TableColumn className='w-1/10'>EXPECTED ETA</TableColumn>
                    <TableColumn className='w-1/5'>PROJECT & CUSTOMER</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No Data found"} items={details} isLoading={loading2} loadingContent={<Spinner label="Loading..." />}>
                    {details.map((item,index) => (
                        <TableRow key={index}>
                            <TableCell>
                                {item.nama_barang}
                            </TableCell>
                            <TableCell>
                                {item.kode}
                            </TableCell>
                            <TableCell>
                                {item.spesifikasi}
                            </TableCell>
                            <TableCell>
                                {item.quantity}
                            </TableCell>
                            <TableCell>
                                {item.expected_eta}
                            </TableCell>
                            <TableCell>
                                {item.project_and_customer}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
                
                <div className=" w-full flex-wrap md:flex-nowrap pt-4 pb-2">
                  <div className='flex'>
                    <div  className=" p-2 xl:w-1/4 w-full">
                      <Input
                      id="pemohon"
                      // ref={pemohonRef}
                      variant="bordered"
                      className="bg-white "
                      type="text"
                      defaultValue={ppbData.pemohon}
                      label="Pemohon"
                      isInvalid={message?.pemohon != null}
                      errorMessage={message?.pemohon}
                      isReadOnly={true}
                    />
                    </div>
                  </div>

                  <div className='flex'>
                    <div  className="flex p-2 xl:w-1/4 w-full">
                      <Input
                        id="mengetahui"
                        variant="bordered"
                        className="bg-white w-full"
                        type="text"
                        defaultValue={ppbData.mengetahui|| ''}
                        value={ppbData.mengetahui|| ''}
                        label="Mengetahui"
                        isInvalid={message?.mengetahui != null}
                        errorMessage={message?.mengetahui}
                        isReadOnly={true}
                      /> 
                    </div>
                    <div className='p-4 w-1/4' hidden={ppbData.status === 'Draft' || ppbData.status === ''}>
                          <p id="status" >
                            Status : {ppbData.mengetahui_status}
                          </p>
                    </div>
                  </div>

                  <div className='flex'>
                    <div  className="flex p-2 xl:w-1/4 w-full">
                      <Input
                        id="menyetujui"
                        variant="bordered"
                        className="bg-white w-full"
                        type="text"
                        defaultValue={ppbData.menyetujui|| ''}
                        value={ppbData.menyetujui|| ''}
                        label="Menyetujui"
                        isInvalid={message?.menyetujui != null}
                        errorMessage={message?.menyetujui}
                        isReadOnly={true}
                      />
                    </div>
                    <div className='p-4 w-1/4' hidden={ppbData.status === 'Draft' || ppbData.status === ''}>
                        <p id="status" >
                          Status : {ppbData.menyetujui_status}
                        </p>
                    </div>
                  </div>

                  <div className='flex' hidden={ppbData.status != 'Done'}>
                    <div  className="flex p-2 xl:w-1/4 w-full">
                      <Input
                        id="purchasing"
                        // ref={purchasingRef}
                        variant="bordered"
                        className="bg-white"
                        type="text"
                        defaultValue={ppbData.purchasing}
                        label="Purchasing"
                        isInvalid={message?.purchasing != null}
                        errorMessage={message?.purchasing}
                        isReadOnly={true}
                      />
                    </div>
                    <div className='p-4 w-1/4'>
                        <p id="status" >
                          Status : {ppbData.purchasing_status}
                        </p>
                    </div>
                  </div> 
                  
                  <hr hidden = {ppbData.remarks == null || param =='new'}></hr>
                  <div className='flex' hidden = {ppbData.remarks == null || param =='new'}>
                    <div  className=" p-2 xl:w-2/4 w-full">
                      <Textarea
                      id="remarks"
                      variant="bordered"
                      className="bg-white "
                      type="text"
                      defaultValue={ppbData.remarks}
                      label="Remarks"
                      isReadOnly= {true}
                    />
                    </div>
                  </div>         

                </div>
              </div>
              )}

          </div>
        
      </div>
    </div>
  )
}
