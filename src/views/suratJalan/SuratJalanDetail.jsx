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
  Select,
  SelectItem,
  RadioGroup,
  Radio,
} from '@nextui-org/react'
import axiosClient from '../../axios-client'
import {PlusIcon} from '../../assets/PlusIcon'
import DeleteIcon from '../../assets/delete.png'
import Swal from 'sweetalert2'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";
import TableSelect from '../../custom/TableSelect'
import { SearchIcon } from '../../assets/SearchIcon'
import numberToWords from 'number-to-words';
// import { IconButton } from "@material-tailwind/react";

export default function SuratJalanDetail() {
  const navigate = useNavigate()
  const [indexNow, setIndexNow] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const { param,param2 } = useParams()
  const [message, setMessage] = useState(null)
  const [disabledView, setDisabledView ] = useState(false)
  const [isModalVerifiedBy, setIsModalOpenVerifiedBy] = useState(false);
  const [isModalApprovedBy, setIsModalOpenApprovedBy] = useState(false);
  const [isModalCompany, setIsModalOpenCompany] = useState(false);
  const [isModalItems, setIsModalOpenItems] = useState(false);
  const [payloadItems, setPayloadItems] = useState([]);

  const handleOpenModalVerifiedBy = () => setIsModalOpenVerifiedBy(true);
  const handleCloseModalVerifiedBy = () => setIsModalOpenVerifiedBy(false);

  const handleOpenModalApprovedBy = () => setIsModalOpenApprovedBy(true);
  const handleCloseModalApprovedBy = () => setIsModalOpenApprovedBy(false);
  
  const handleOpenModalCompany = () => setIsModalOpenCompany(true);
  const handleCloseModalCompany = () => setIsModalOpenCompany(false);

  const handleOpenModalShipTo = () => setIsModalOpenShipTo(true);
  const handleCloseModalShipTo = () => setIsModalOpenShipTo(false);

  const handleOpenModalItems = (index) =>{
    setIsModalOpenItems(true)
    setIndexNow(index)
  }

  const handleCloseModalItems = (index) =>{
    setIsModalOpenItems(false)
    setIndexNow(null)
  }

  const [suratjalanData, setSuratJalanData] = useState({
    status: '',
    status_pengiriman: '',
    company_id: '',
    company: '',
    company_address: '',
    company_telephone: '',
    company_fax: '',
    company_email: '',
    menyerahkan_id: '',
    menyerahkan: '',
    menyerahkan_date: '',
    mengetahui_id: '',
    mengetahui: '',
    mengetahui_status: '',
    mengetahui_date: '',
    menerima: '',
    menerima_date: '',
    remarks: '',
  })

  const [details, setDetails] = useState([
    {
      id: null,
      surat_jalan_id: null,
      stock_item_id: null,
      // no_edp:null,
      // no_sn:null,
      nama_barang:null,
      quantity:null,
      is_dikembalikan:null,
      keterangan:null,
    }
  ]);

  const addData = () => {
    const newData = {
      id: null,
      surat_jalan_id: null,
      stock_item_id: null,
      // no_edp:null,
      // no_sn:null,
      nama_barang:null,
      quantity:null,
      is_dikembalikan:null,
      keterangan:null,
    };

    setDetails([...details, newData]);

  };


  const btnBack = () => [
    navigate('/suratjalan')
  ]


  useEffect(() => {

    if (param != 'new') {
      getDetails();
      getSuratJalan();
    }
    if (param2 == 'view') {
      setDisabledView(true)
    }

  }, [])

  
  const getSuratJalan = () => {
    setLoading(true)
    axiosClient
      .get('/suratjalan/' + param)
      .then(({ data }) => {
        setSuratJalanData({
            status: data.data.status,
            status_pengiriman: data.data.status_pengiriman,
            company_id: data.data.company_id,
            company: data.data.company,
            company_address: data.data2.address,
            company_telephone: data.data2.telephone,
            company_fax: data.data2.fax,
            company_email: data.data2.email,
            menyerahkan_id: data.data.menyerahkan_id,
            menyerahkan: data.data.menyerahkan,
            menyerahkan_date: data.data.menyerahkan_date,
            mengetahui_id: data.data.mengetahui_id,
            mengetahui: data.data.mengetahui,
            mengetahui_status: data.data.mengetahui_status,
            mengetahui_date: data.data.mengetahui_date,
            menerima: data.data.menerima,
            menerima_date: data.data.menerima_date,
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
      .get('/suratjalandetaillist/'+ param)
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
      .delete('/suratjalandetail/' + id)
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

  useEffect(() => {
    const newPayloadItems = {
      stock_item_ids: details
        .filter(row => row.stock_item_id !== null) // Hanya masukkan yang tidak null
        .map(row => row.stock_item_id) // Ambil nilai ppb_detail_id
    };
    setPayloadItems(newPayloadItems);
  }, [details]);


  const handleInputChangeRow = (index, field, value) => {
    setDetails(details.map((row, i) => i === index ? { ...row, [field]: value } : row));
  };

  const handleInputChange = (field, value) => {
    setSuratJalanData((prevData) => ({
      ...prevData, 
      [field]: value  
    }));


  };

  // setDetails({ ...details, item: data.nama_barang, ppb_detail_id: (data.id).toString(), no_ppb: data.no_ppb });
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

    const handleSaveAll = (surat_jalan_id) => {
      axiosClient.post('/suratjalansaveAll/'+surat_jalan_id, details)
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
        company_id: suratjalanData.company_id,
        company: suratjalanData.company,
        mengetahui_id: suratjalanData.mengetahui_id,
        mengetahui: suratjalanData.mengetahui,
      }
      if (param == 'new') {
        axiosClient
          .post('/suratjalan', payload)
          .then(({data}) => {
            console.log(data.data.id)
            handleSaveAll(data.data.id)
            Toast.fire({
              icon: "success",
              title: "Create is successfully"
            });  
            navigate('/suratjalan')
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
          .put('/suratjalan/update/' + param, payload)
          .then(({}) => {
            console.log(param)
            handleSaveAll(param)
            Toast.fire({
              icon: "success",
              title: "Update is successfully"
            });  
            navigate('/suratjalan')
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
      .post('/suratjalan/post/' + param)
      .then(({}) => {
        console.log(param)
        handleSaveAll(param)
        Toast.fire({
          icon: "success",
          title: "Post is successfully"
        }); 
        navigate('/suratjalan')
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
    const columnsUsers = [
      {name: "ID", uid: "id", sortable: true},
      {name: "NAME", uid: "name", sortable: true},
      {name: "EMAIL", uid: "email", sortable: true},
      {name: "PHONE NUMBER", uid: "phone_number", sortable: true},
      {name: "ROLE", uid: "role", sortable: true},
      {name: "ACTIONS", uid: "actions", headerClassName:'text-end'},
    ];

    const columnsCompanies = [
      {name: "ID", uid: "id", sortable: true},
      {name: "NAME", uid: "name", sortable: true},
      {name: "ADDRESS", uid: "address", sortable: true},
      {name: "TELEPHONE", uid: "telephone", sortable: true},
      {name: "FAX", uid: "fax", sortable: true},
      {name: "EMAIL", uid: "email", sortable: true},
      {name: "ACTIONS", uid: "actions", headerClassName:'text-end'},
    ];

    const columnsItems = [
      {name: "STOCK NAME", uid: "stock_name", sortable: true},
      {name: "DESCRIPTION", uid: "description", sortable: true},
      {name: "QTY", uid: "quantity", sortable: true},
      {name: "ITEM UNIT", uid: "item_unit", sortable: true},
      {name: "ACTIONS", uid: "actions", headerClassName:'text-end'},
    ];

    const handleVerifiedBy = (data) => {

      setSuratJalanData({ ...suratjalanData, verified_by: data.name, verified_by_id: (data.id).toString() });
      setIsModalOpenVerifiedBy(false)
    }

    const handleApprovedBy = (data) => {
      setSuratJalanData({ ...suratjalanData, approved_by: data.name, approved_by_id: (data.id).toString()  });
      setIsModalOpenApprovedBy(false)
    }

    const handleCompany = (data) => {
      console.log(data)
      setSuratJalanData({ ...suratjalanData, company: data.name, company_id: (data.id).toString(), company_address: data.address, company_telephone: data.telephone, company_fax: data.fax, company_email: data.email });
      setIsModalOpenCompany(false)
    }

    const handleShipTo = (data) => {

      setSuratJalanData({ ...suratjalanData, ship_to: data.name, ship_to_id: (data.id).toString() });
      setIsModalOpenShipTo(false)
    }

    const handleItems = (data) => {
      setDetails(details.map((row, i) => i === indexNow ? { ...row, nama_barang: data.stock_name, stock_item_id: (data.id).toString() } : row));
      setIsModalOpenItems(false)
    }

    const onCheck = () => {
      console.log(details)
    }
  return (
    <div className="bg-white p-4 rounded-large animated fadeInDown">
      <div className="flex-col items-center">
        <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid grey' }}>
          <h1 hidden={param != 'new'}>Create Surat Jalan Barang</h1>
          <h1 hidden={param == 'new' || param2 == 'view'}>Edit Surat Jalan Barang</h1>
          <h1 hidden={param2 != 'view'}>View Surat Jalan Barang</h1>
          <Button className="bg-red-300" onClick={btnBack}>
            Back
          </Button>
        </div>
          <div className="pt-8">
              <div className="flex w-full flex-wrap md:flex-nowrap p-2" >
                  <Button className="bg-green-300" onClick={onSubmit} hidden={disabledView}>
                    Save
                  </Button>
                  <Button className="bg-green-300" onClick={handlePost} hidden={!disabledView || suratjalanData.status !== 'Draft' && suratjalanData.status !== 'Returned'}>
                    Post
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
                  <div  className=" p-2 xl:w-2/5 w-full"></div>
                  <div  className="xl:w-2/4 w-full"></div>
                  <div  className="xl:w-1/10 w-full p-4" hidden={suratjalanData.status === ''}>
                    <p id="status" >
                      Status : {suratjalanData.status}
                    </p>
                  </div>
                  {/* <div  className="flex p-2 xl:w-1/2 w-full">
                    <div className='pe-2 w-1/6'hidden={disabledView}>
                        <Button onPress={handleOpenModalCompany} className='border-gray-500 w-full h-14'><SearchIcon/></Button>
                    </div>
                    Company : {suratjalanData.company}
                    <br></br>
                    Address : {suratjalanData.company_address}
                    <br></br>
                    Telephone : {suratjalanData.company_telephone}
                    <br></br>
                    Fax : {suratjalanData.company_fax}
                    <br></br>
                    Email : {suratjalanData.company_email}
                    <Modal isOpen={isModalCompany} onOpenChange={handleCloseModalCompany} size='4xl'>
                        <ModalContent>
                          {(onClose) => (
                            <>
                              <ModalHeader className="flex flex-col gap-1">Select Vendor</ModalHeader>
                              <ModalBody>
                                <TableSelect columns={columnsCompanies} apiname={'companiesSelect'} handleAction={handleCompany}>
                                </TableSelect>
                              </ModalBody>
                            </>
                          )}
                        </ModalContent>
                      </Modal>
                  </div> */}
                  <div className="flex flex-col p-4 xl:w-full w-full bg-white shadow-lg rounded-lg">
                    <div className="flex items-center mb-4">
                        {!disabledView && (
                            <div className="mr-4 w-auto">
                                <Button onPress={handleOpenModalCompany} className="flex items-center justify-center border border-gray-300 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                                    <SearchIcon className="mr-2" />
                                    <span>Select Company</span>
                                </Button>
                            </div>
                        )}
                    </div>
                        {/* <div className="text-lg font-semibold w-full text-center">Company Information</div> */}

                    <div className="text-gray-700">
                        <div className="mb-2">
                            <span className="font-bold">Company:</span> {suratjalanData.company}
                        </div>
                        <div className="mb-2">
                            <span className="font-bold">Address:</span> {suratjalanData.company_address}
                        </div>
                        <div className="mb-2">
                            <span className="font-bold">Telephone:</span> {suratjalanData.company_telephone}
                        </div>
                        <div className="mb-2">
                            <span className="font-bold">Fax:</span> {suratjalanData.company_fax}
                        </div>
                        <div className="mb-2">
                            <span className="font-bold">Email:</span> {suratjalanData.company_email}
                        </div>
                    </div>

                    <Modal isOpen={isModalCompany} onOpenChange={handleCloseModalCompany} size="4xl">
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Select Company</ModalHeader>
                                    <ModalBody>
                                        <TableSelect columns={columnsCompanies} apiname={'companiesSelect'} handleAction={handleCompany} />
                                    </ModalBody>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </div>
                  
                </div>
                <br />
                <Table aria-label="Example static collection table" className='p-2'>
                <TableHeader>
                    <TableColumn className='w-1/5'>PART NO.</TableColumn>
                    <TableColumn className='w-1/5'>NAMA BARANG</TableColumn>
                    <TableColumn className='w-1/5'>QTY</TableColumn>
                    <TableColumn className='w-1/5'>DIKEMBALIKAN?</TableColumn>
                    <TableColumn className='w-1/5'>KETERANGAN</TableColumn>
                    <TableColumn className='w-1/20' hideHeader={disabledView}>ACTION</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No Data found"} items={details} isLoading={loading2} loadingContent={<Spinner label="Loading..." />}>
                    {details.map((item,index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Input
                                    startContent={<SearchIcon onClick={()=>handleOpenModalItems(index)} className="cursor-pointer"/>}
                                    style={{ fontSize: '12px' }}
                                    isDisabled = {disabledView}
                                    type="text" 
                                    variant='bordered' 
                                    value={item.stock_item_id} 
                                    aria-label="Stock Item ID"
                                    // onChange={(e) => handleInputChangeRow(index, 'item', e.target.value)}
                                />
                                {/* <Modal isOpen={isModalItems} onOpenChange={handleCloseModalItems} size='4xl'>
                                  <ModalContent>
                                    {(onClose) => (
                                      <>
                                        <ModalHeader className="flex flex-col gap-1">Select Items</ModalHeader>
                                        <ModalBody>
                                          <TableSelect columns={columnsItems} apiname={'stockmaterialSelect'} payload={payloadItems} handleAction={(data) => handleItems(data)}>
                                          </TableSelect>
                                        </ModalBody>
                                      </>
                                    )}
                                  </ModalContent>
                                </Modal> */}
                            </TableCell>
                            <TableCell>
                                <Input 
                                    aria-label="Description"
                                    style={{ fontSize: '12px' }}
                                    isDisabled = {disabledView}
                                    type="text" 
                                    variant='bordered' 
                                    value={item.nama_barang}
                                    isReadOnly 
                                    onChange={(e) => handleInputChangeRow(index, 'nama_barang', e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    aria-label="Quantity"
                                    style={{ fontSize: '12px' }}
                                    isDisabled = {disabledView}
                                    type="text" 
                                    variant='bordered' 
                                    value={item.quantity} 
                                    onChange={(e) => handleInputChangeRow(index, 'quantity', e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <RadioGroup
                                    aria-label="apakah dikembalikan"
                                    orientation="horizontal"
                                    value={item.is_dikembalikan}
                                    onChange={(e) => handleInputChangeRow(index, 'is_dikembalikan', e.target.value)}
                                    >
                                    <Radio value="1">Ya</Radio>
                                    <Radio value="0">Tidak</Radio>
                                </RadioGroup>
                            </TableCell>
                            <TableCell>
                                <Textarea
                                    aria-label="Keterangan"
                                    style={{ fontSize: '12px' }}
                                    isDisabled = {disabledView} 
                                    type="text"
                                    variant='bordered' 
                                    value={item.keterangan} 
                                    onChange={(e) => handleInputChangeRow(index, 'keterangan', e.target.value)}
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
                
                </Table>
                <Button
                  hidden={disabledView}
                  color="primary"
                  endContent={<PlusIcon className="w-5 h-5" />}
                  className="p-2 w-2 h-12 rounded-full flex items-center justify-center bg-blue-500 hover:bg-blue-600"
                  onClick={addData}
                >
                </Button>
                <hr />
                <div className=" w-full flex-wrap md:flex-nowrap pt-4 pb-2">
                  <div className='flex'>
                    <div  className=" p-2 xl:w-1/4 w-full">
                      <Input
                      id="menyerahkan"
                      // ref={prepared_byRef}
                      variant="bordered"
                      className="bg-white "
                      type="text"
                      defaultValue={suratjalanData.menyerahkan}
                      label="Yang Menyerahkan"
                      isInvalid={message?.menyerahkan != null}
                      errorMessage={message?.menyerahkan}
                      isDisabled={true}
                    />
                    </div>
                    <div className='flex p-2 w-1/4'>
                        <Input
                        id="menyerahkan_date"
                        // ref={prepared_byRef}
                        variant="bordered"
                        className="bg-white "
                        type="date"
                        defaultValue={suratjalanData.menyerahkan_date}
                        label="Tanggal"
                        isInvalid={message?.menyerahkan_date != null}
                        errorMessage={message?.menyerahkan_date}
                        isDisabled={true}
                        />
                    </div>
                  </div>

                  <div className='flex'>
                    <div  className="flex p-2 xl:w-1/4 w-full">
                      <div className='pe-2'hidden={disabledView}>
                        <Button onPress={handleOpenModalVerifiedBy} className='border-gray-500 w-1/20 h-14'><SearchIcon/></Button>
                      </div>
                      <Input
                        id="verified_by"
                        variant="bordered"
                        className="bg-white w-full"
                        type="text"
                        defaultValue={suratjalanData.verified_by|| ''}
                        value={suratjalanData.verified_by|| ''}
                        label="Mengetahui (Purchasing)"
                        isInvalid={message?.verified_by != null}
                        errorMessage={message?.verified_by}
                        isDisabled={disabledView}
                        isReadOnly={true}
                      />                    
                      <Modal isOpen={isModalVerifiedBy} onOpenChange={handleCloseModalVerifiedBy} size='4xl'>
                        <ModalContent>
                          {(onClose) => (
                            <>
                              <ModalHeader className="flex flex-col gap-1">Select Verified By</ModalHeader>
                              <ModalBody>
                                <TableSelect columns={columnsUsers} apiname={'userSelect'} handleAction={handleVerifiedBy}>
                                </TableSelect>
                              </ModalBody>
                            </>
                          )}
                        </ModalContent>
                      </Modal>
                    </div>
                    <div className='flex p-4 w-1/4' hidden={suratjalanData.status === 'Draft' || suratjalanData.status === ''}>
                          <p id="status" >
                            Status : {suratjalanData.verified_by_status}
                          </p>
                          <p id="date" hidden={suratjalanData.verified_by_date == null}>
                            / Date : {suratjalanData.verified_by_date}
                          </p>
                    </div>
                  </div>

                  <div className='flex'>
                    <div  className="flex p-2 xl:w-1/4 w-full">
                      {/* <div className='pe-2'hidden={disabledView}>
                        <Button onPress={handleOpenModalApprovedBy} className='border-gray-500 w-1/20 h-14'><SearchIcon/></Button>
                      </div> */}
                      <Input
                        id="approved_by"
                        variant="bordered"
                        className="bg-white w-full"
                        type="text"
                        defaultValue={suratjalanData.approved_by|| ''}
                        value={suratjalanData.approved_by|| ''}
                        label="Yang Menerima (Subcont/Vendor)"
                        isInvalid={message?.approved_by != null}
                        errorMessage={message?.approved_by}
                        isDisabled={disabledView}
                        // isReadOnly={true}
                      />
                      <Modal isOpen={isModalApprovedBy} onOpenChange={handleCloseModalApprovedBy} size='4xl'>
                        <ModalContent>
                          {(onClose) => (
                            <>
                              <ModalHeader className="flex flex-col gap-1">Select Approved By</ModalHeader>
                              <ModalBody>
                                <TableSelect columns={columnsUsers} apiname={'userSelect'} handleAction={handleApprovedBy}>
                                </TableSelect>
                              </ModalBody>
                            </>
                          )}
                        </ModalContent>
                      </Modal>
                    </div>
                    <div className='flex p-2 w-1/4'>
                        <Input
                            id="approved_by"
                            variant="bordered"
                            className="bg-white w-full"
                            type="date"
                            defaultValue={suratjalanData.approved_by|| ''}
                            value={suratjalanData.approved_by|| ''}
                            label="Tanggal"
                            isInvalid={message?.approved_by != null}
                            errorMessage={message?.approved_by}
                            isDisabled={disabledView}
                            // isReadOnly={true}
                        />
                    </div>
                  </div>
                  
                  <hr hidden = {suratjalanData.remarks == null || param =='new'}></hr>
                  <div className='flex' hidden = {suratjalanData.remarks == null || param =='new'}>
                    <div  className=" p-2 xl:w-2/4 w-full">
                      <Textarea
                      id="remarks"
                      variant="bordered"
                      className="bg-white "
                      type="text"
                      defaultValue={suratjalanData.remarks}
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
      <Modal isOpen={isModalItems} onOpenChange={handleCloseModalItems} size='4xl'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Select Items</ModalHeader>
              <ModalBody>
                <TableSelect columns={columnsItems} apiname={'stockmaterialSelect'} payload={payloadItems} handleAction={(data) => handleItems(data)}>
                </TableSelect>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
