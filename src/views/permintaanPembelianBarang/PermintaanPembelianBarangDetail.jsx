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

export default function PermintaanPembelianBarangDetail() {
  const navigate = useNavigate()
  const [ppb_id, setPpbid] = useState([])
  // const [details, setDetails] = useState([])
  // const [ppbs, setPpbs] = useState([])
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const { param,param2 } = useParams()
  const [message, setMessage] = useState(null)
  const [disabledView, setDisabledView ] = useState(false)
  const [isModalMengetahui, setIsModalOpenMengetahui] = useState(false);
  const [isModalMenyetujui, setIsModalOpenMenyetujui] = useState(false);

  const handleOpenModalMengetahui = () => setIsModalOpenMengetahui(true);
  const handleCloseModalMengetahui = () => setIsModalOpenMengetahui(false);

  const handleOpenModalMenyetujui = () => setIsModalOpenMenyetujui(true);
  const handleCloseModalMenyetujui = () => setIsModalOpenMenyetujui(false);

  // const tanggalRef = createRef()
  // const no_ppbRef = createRef()
  // const pemohonRef = createRef()
  // const mengetahuiRef = createRef()
  // const menyetujuiRef = createRef() 
  // const purchasingRef = createRef()
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

  const addData = () => {
    const newData = {
      id: null,
      nama_barang: "",
      kode: "",
      spesifikasi: "",
      quantity: "",
      expected_eta: "",
      project_and_customer: "",
    };

    setDetails([...details, newData]);

  };


  const btnBack = () => [
    navigate('/ppb')
  ]

  const handlePrint = () => {
    navigate('/printPPB/' + param);
  }


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


  const deleteDetail = (id) => {
    axiosClient
      .delete('/ppbdetail/' + id)
      .then(({}) => {
        // getDetails();
      })
      .catch(err => {
        const response = err.response
        if (response && response.status === 400) {
          setMessage(response.data.message);
          setErrors(true);
          console.log(errors) ;
        }
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

    const handleSaveAll = (ppb_id) => {
      axiosClient.post('/ppbsaveAll/'+ppb_id, details)
            .then(response => {
                // Handle successful save
                console.log('Data saved successfully');
            })
            .catch(error => {
                // Handle error
                console.error('There was an error saving the data!', error);
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

    const onSubmit = ev => {
      ev.preventDefault()

      const payload = {
        mengetahui: ppbData.mengetahui,
        mengetahui_id: ppbData.mengetahui_id,
        menyetujui: ppbData.menyetujui,
        menyetujui_id: ppbData.menyetujui_id,
      }
      if (param == 'new') {
        axiosClient
          .post('/ppb', payload)
          .then(({data}) => {
            // setPpbid(data.ppb_id);
            console.log(data.data.id)
            handleSaveAll(data.data.id)
            Toast.fire({
              icon: "success",
              title: "Create is successfully"
            });  
            navigate('/ppb')
          })
          .catch(err => {
            const response = err.response
            if (response && response.status === 400) {
              setMessage(response.data.message);
              setErrors(true);
            }
          })
      }
      else{
        axiosClient
          .put('/ppb/update/' + param, payload)
          .then(({}) => {
            console.log(param)
            handleSaveAll(param)
            Toast.fire({
              icon: "success",
              title: "Update is successfully"
            });
  
            navigate('/ppb')
          })
          .catch(err => {
            const response = err.response
            if (response && response.status === 400) {
              setMessage(response.data.message);
              setErrors(true);
            }
          })
      }
      
    }

    const post = () => {

      axiosClient
      .post('/ppb/post/' + param)
      .then(({}) => {
        console.log(param)
        handleSaveAll(param)
        Toast.fire({
          icon: "success",
          title: "Post is successfully"
        }); 
        navigate('/ppb')
      })
      .catch(err => {
        const response = err.response
        if (response && response.status === 400) {

          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: response.data.message,
            // footer: '<a href="#">Why do I have this issue?</a>'
          });
        }
      })
    }

    const handlePost = () => {

      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Post it!"
      }).then((result) => {
        if (result.isConfirmed) {
          post();
        }
      });
    };

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

    const handleMengetahui = (data) => {

      setPpbData({ ...ppbData, mengetahui: data.name, mengetahui_id: (data.id).toString() });
      setIsModalOpenMengetahui(false)
    }

    const handleMenyetujui = (data) => {
      setPpbData({ ...ppbData, menyetujui: data.name, menyetujui_id: (data.id).toString()  });
      setIsModalOpenMenyetujui(false)
    }

  return (
    <div className="bg-white p-4 rounded-large animated fadeInDown">
      <div className="flex-col items-center">
        <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid grey' }}>
          <h1 hidden={param != 'new'}>Create Permintaan Pembelian Barang</h1>
          <h1 hidden={param == 'new' || param2 == 'view'}>Edit Permintaan Pembelian Barang</h1>
          <h1 hidden={param2 != 'view'}>View Permintaan Pembelian Barang</h1>
          <Button className="bg-red-300" onClick={btnBack}>
            Back
          </Button>
        </div>
          <div className="pt-8">
              <div className="flex w-full flex-wrap md:flex-nowrap p-2" >
                  <Button className="bg-green-300" onClick={onSubmit} hidden={disabledView}>
                    Save
                  </Button>
                  <Button className="bg-green-300" onClick={handlePost} hidden={!disabledView || ppbData.status !== 'Draft' && ppbData.status !== 'Returned'}>
                    Post
                  </Button>
                  <Button className="bg-green-300" onClick={handlePrint} hidden={ppbData.status !== 'Done'}>
                    Print
                  </Button>
              </div>

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
                    isDisabled={true}
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
                      isDisabled={true}
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
                    <TableColumn className='w-1/20' hideHeader={disabledView}>ACTION</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No Data found"} items={details} isLoading={loading2} loadingContent={<Spinner label="Loading..." />}>
                    {details.map((item,index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Input 
                                    isDisabled = {disabledView}
                                    type="text" 
                                    variant='bordered' 
                                    value={item.nama_barang} 
                                    onChange={(e) => handleInputChange(index, 'nama_barang', e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <Input 
                                    isDisabled = {disabledView}
                                    type="text" 
                                    variant='bordered' 
                                    value={item.kode} 
                                    onChange={(e) => handleInputChange(index, 'kode', e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    isDisabled = {disabledView}
                                    type="text" 
                                    variant='bordered' 
                                    value={item.spesifikasi} 
                                    onChange={(e) => handleInputChange(index, 'spesifikasi', e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    isDisabled = {disabledView}
                                    type="number" 
                                    variant='bordered' 
                                    value={item.quantity} 
                                    onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    isDisabled = {disabledView} 
                                    type="date"
                                    variant='bordered' 
                                    value={item.expected_eta} 
                                    onChange={(e) => handleInputChange(index, 'expected_eta', e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <Textarea
                                    isDisabled = {disabledView} 
                                    type="text" 
                                    variant='bordered' 
                                    value={item.project_and_customer} 
                                    onChange={(e) => handleInputChange(index, 'project_and_customer', e.target.value)}
                                />
                            </TableCell>
                            <TableCell hidden={disabledView}>
                                <Button className='bg-red-300' isIconOnly>
                                    <img
                                        src={DeleteIcon}
                                        alt="Delete Icon"
                                        className="w-6 h-6 hover:cursor-pointer"
                                        onClick={() => handleDelete(index)}
                                    />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                {/* <TableBody emptyContent={"No Data found"} items={details} isLoading={loading2} loadingContent={<Spinner label="Loading..." />}>
                  {(item) => (
                    <TableRow key={item.id}>                      
                      <TableCell>
                        <Input variant='bordered' defaultValue={item.nama_barang}></Input>
                    </TableCell>
                    <TableCell>
                        <Input variant='bordered' defaultValue={item.kode}></Input>
                    </TableCell>
                    <TableCell>
                        <Input variant='bordered' defaultValue={item.spesifikasi}></Input>
                    </TableCell>
                    <TableCell>
                        <Input variant='bordered' defaultValue={item.quantity}></Input>
                    </TableCell>
                    <TableCell>
                        <Input variant='bordered' defaultValue={item.expected_eta}></Input>
                    </TableCell>
                    <TableCell>
                        <Textarea variant='bordered' defaultValue={item.project_and_customer}></Textarea>
                    </TableCell>
                    <TableCell>
                      <Button className='bg-red-300' onClick={() => btnDeleteDetail(item.id)}>
                        <img
                          src={DeleteIcon}
                          alt="Delete Icon"
                          className="w-6 h-6"
                        />
                      </Button>
                    </TableCell>
                      
                    </TableRow>
                  )}
                </TableBody> */}
                </Table>
                <Button
                  hidden={disabledView}
                  color="primary"
                  endContent={<PlusIcon className="w-5 h-5" />}
                  className="p-2 w-2 h-12 rounded-full flex items-center justify-center bg-blue-500 hover:bg-blue-600"
                  onClick={addData}
                >
                </Button>
                
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
                      isDisabled={true}
                    />
                    </div>
                  </div>

                  <div className='flex'>
                    <div  className="flex p-2 xl:w-1/4 w-full">
                      <div className='pe-2'hidden={disabledView}>
                        <Button onPress={handleOpenModalMengetahui} className='border-gray-500 w-1/20 h-14'>Select</Button>
                      </div>
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
                        isDisabled={disabledView}
                        isReadOnly={true}
                      />                    
                      <Modal isOpen={isModalMengetahui} onOpenChange={handleCloseModalMengetahui} size='4xl'>
                        <ModalContent>
                          {(onClose) => (
                            <>
                              <ModalHeader className="flex flex-col gap-1">Select Mengetahui</ModalHeader>
                              <ModalBody>
                                <TableSelect columns={columns} apiname={apiname} handleAction={handleMengetahui}>
                                </TableSelect>
                              </ModalBody>
                            </>
                          )}
                        </ModalContent>
                      </Modal>
                    </div>
                    <div className='p-4 w-1/4' hidden={ppbData.status === 'Draft' || ppbData.status === ''}>
                          <p id="status" >
                            Status : {ppbData.mengetahui_status}
                          </p>
                    </div>
                  </div>

                  <div className='flex'>
                    <div  className="flex p-2 xl:w-1/4 w-full">
                      <div className='pe-2'hidden={disabledView}>
                        <Button onPress={handleOpenModalMenyetujui} className='border-gray-500 w-1/20 h-14'>Select</Button>
                      </div>
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
                        isDisabled={disabledView}
                        isReadOnly={true}
                      />
                      <Modal isOpen={isModalMenyetujui} onOpenChange={handleCloseModalMenyetujui} size='4xl'>
                        <ModalContent>
                          {(onClose) => (
                            <>
                              <ModalHeader className="flex flex-col gap-1">Select Menyetujui</ModalHeader>
                              <ModalBody>
                                <TableSelect columns={columns} apiname={apiname} handleAction={handleMenyetujui}>
                                </TableSelect>
                              </ModalBody>
                            </>
                          )}
                        </ModalContent>
                      </Modal>
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
                        isDisabled={true}
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
                      isDisabled= {true}
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
