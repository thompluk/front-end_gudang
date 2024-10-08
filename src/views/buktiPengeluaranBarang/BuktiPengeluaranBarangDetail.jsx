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
  Card,
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

export default function BuktiPengeluaranBarangDetail() {
  const navigate = useNavigate()
  const [amountnow, setAmount] = useState(null)
  const [quantitynow, setQuantity] = useState(null)
  const [pricenow, setPrice] = useState(null)
  const [discountnow, setDicount] = useState(null)
  const [indexNow, setIndexNow] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const { param,param2 } = useParams()
  const [message, setMessage] = useState(null)
  const [disabledView, setDisabledView ] = useState(false)
//   const [isModalVerifiedBy, setIsModalOpenVerifiedBy] = useState(false);
  const [isModalApprovedBy, setIsModalOpenApprovedBy] = useState(false);
  const [isModalVendor, setIsModalOpenVendor] = useState(false);
  const [isModalShipTo, setIsModalOpenShipTo] = useState(false);
  const [isModalItems, setIsModalOpenItems] = useState(false);
  const [payloadItems, setPayloadItems] = useState([]);

//   const handleOpenModalVerifiedBy = () => setIsModalOpenVerifiedBy(true);
//   const handleCloseModalVerifiedBy = () => setIsModalOpenVerifiedBy(false);

  const handleOpenModalApprovedBy = () => setIsModalOpenApprovedBy(true);
  const handleCloseModalApprovedBy = () => setIsModalOpenApprovedBy(false);
  
  const handleOpenModalVendor = () => setIsModalOpenVendor(true);
  const handleCloseModalVendor = () => setIsModalOpenVendor(false);

  const handleOpenModalShipTo = () => setIsModalOpenShipTo(true);
  const handleCloseModalShipTo = () => setIsModalOpenShipTo(false);

  // const handleOpenModalItems = () => setIsModalOpenItems(true);
  // const handleCloseModalItems = () => setIsModalOpenItems(false);

  const handleOpenModalItems = (index) =>{
    setIsModalOpenItems(true)
    setIndexNow(index)
  }

  const handleCloseModalItems = (index) =>{
    setIsModalOpenItems(false)
    setIndexNow(null)
  }

  const [bpbData, setBpbData] = useState({
    status: null,
    delivery_status: null,
    salesman: null,
    date: null,
    no_po: null,
    delivery_by: null,
    no_bpb: null,
    customer: null,
    customer_address: null,
    customer_pic_name: null,
    customer_pic_phone: null,
    request_by: null,
    request_by_id: null,
    request_by_date: null,
    approved_by: null,
    approved_by_id: null,
    approved_by_date: null,
    approved_by_status: null,
    remarks: null,
  })

  const [details, setDetails] = useState([
    {
        is_partial_delivery: '0',
        id: null,
        item_id: null,
        item_name: null,
        no_edp: null,
        no_sn: null,
        quantity: null,
        delivery_date: null,
        notes: null,
    }
  ]);

  const addData = () => {
    const newData = {
        is_partial_delivery: '0',
        id: null,
        item_id: null,
        item_name: null,
        no_edp: null,
        no_sn: null,
        quantity: null,
        delivery_date: null,
        notes: null,
    };

    setDetails([...details, newData]);

  };


  const btnBack = () => [
    navigate('/bpb')
  ]

  const handlePrint = () => {
    navigate('/printBPB/' + param);
  }

  useEffect(() => {

    if (param == 'new'){
      // addData();
    }
    if (param != 'new') {
      getDetails();
      getBpb();
    }
    if (param2 == 'view') {
      setDisabledView(true)
    }

  }, [])

  
  const getBpb = () => {
    setLoading(true)
    axiosClient
      .get('/bpb/' + param)
      .then(({ data }) => {
        setBpbData({
            status: data.data.status,
            salesman: data.data.salesman,
            date: data.data.date,
            no_po: data.data.no_po,
            delivery_by: data.data.delivery_by,
            no_bpb: data.data.no_bpb,
            customer: data.data.customer,
            customer_address: data.data.customer_address,
            customer_pic_name: data.data.customer_pic_name,
            customer_pic_phone: data.data.customer_pic_phone,
            request_by: data.data.request_by,
            request_by_id: data.data.request_by_id,
            request_by_date: data.data.request_by_date,
            approved_by: data.data.approved_by,
            approved_by_id: data.data.approved_by_id,
            approved_by_date: data.data.approved_by_date,
            approved_by_status: data.data.approved_by_status,
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
      .get('/bpbdetaillist/'+ param)
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
      .delete('/bpbdetail/' + id)
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

  // useEffect(() => {
  //     setRows(details);
  // }, [details]);

  useEffect(() => {
    const newPayloadItems = {
      item_ids: details
        .filter(row => row.item_id != null) // Hanya masukkan yang tidak null
        .map(row => row.item_id) // Ambil nilai ppb_detail_id
    };
    setPayloadItems(newPayloadItems);
  }, [details]);

  const handleInputChangeRow = (index, field, value) => {
    setDetails(details.map((row, i) => i === index ? { ...row, [field]: value } : row));
  };

  const handleInputRadio = (index, field, value) => {
    setDetails(details.map((row, i) => i === index ? { ...row, [field]: value, item_name : '', item_id : null, no_sn : '', no_edp : '', quantity : ''} : row));
  };

  const handleInputChange = (field, value) => {
    setBpbData((prevData) => ({
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

    const handleSaveAll = (bpb_id) => {
      axiosClient.post('/bpbsaveAll/'+bpb_id, details)
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
        salesman: bpbData.salesman,
        no_po: bpbData.no_po,
        delivery_by: bpbData.delivery_by,
        customer: bpbData.customer,
        customer_address: bpbData.customer_address,
        customer_pic_name: bpbData.customer_pic_name,
        customer_pic_phone: bpbData.customer_pic_phone,
        approved_by: bpbData.approved_by,
        approved_by_id: bpbData.approved_by_id,
      }
      if (param == 'new') {
        axiosClient
          .post('/bpb', payload)
          .then(({data}) => {
            console.log(data.data.id)
            handleSaveAll(data.data.id)
            Toast.fire({
              icon: "success",
              title: "Create is successfully"
            });  
            navigate('/bpb')
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
          .put('/bpb/update/' + param, payload)
          .then(({}) => {
            console.log(param)
            handleSaveAll(param)
            Toast.fire({
              icon: "success",
              title: "Update is successfully"
            });  
            navigate('/bpb')
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
      .post('/bpb/post/' + param)
      .then(({}) => {
        console.log(param)
        handleSaveAll(param)
        Toast.fire({
          icon: "success",
          title: "Post is successfully"
        }); 
        navigate('/bpb')
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
      {name: "ID", uid: "id", sortable: true},
      {name: "ITEM NAME", uid: "item_name", sortable: true},
      {name: "No EDP", uid: "no_edp", sortable: true},
      {name: "No S/N", uid: "no_sn", sortable: true},
      {name: "DESKRIPSI", uid: "description", sortable: true},
      {name: "ACTIONS", uid: "actions", headerClassName:'text-end'},
    ];

    const handleApprovedBy = (data) => {
      setBpbData({ ...bpbData, approved_by: data.name, approved_by_id: (data.id).toString()  });
      setIsModalOpenApprovedBy(false)
    }

    // const handleVendor = (data) => {
    //   console.log(data)
    //   setBpbData({ ...bpbData, vendor: data.name, vendor_id: (data.id).toString() });
    //   setIsModalOpenVendor(false)
    // }

    const handleItems = (data) => {
      setDetails(details.map((row, i) => i === indexNow ? { ...row, item_name: data.item_name, item_id : (data.id).toString(), no_edp: data.no_edp, no_sn: data.no_sn, quantity: 1} : row));
      setIsModalOpenItems(false)
    }

  return (
    <div className="bg-white p-4 rounded-large animated fadeInDown">
      <div className="flex-col items-center">
        <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid grey' }}>
          <h1 hidden={param != 'new'}>Create Bukti Pengeluaran Barang</h1>
          <h1 hidden={param == 'new' || param2 == 'view'}>Edit Bukti Pengeluaran Barang</h1>
          <h1 hidden={param2 != 'view'}>View Bukti Pengeluaran Barang</h1>
          <Button className="bg-red-300" onClick={btnBack}>
            Back 
          </Button>
        </div>
          <div className="pt-8">
              <div className="flex w-full flex-wrap md:flex-nowrap p-2 justify-between" >
                    <Button className="bg-green-300" onClick={onSubmit} hidden={disabledView}>
                        Save
                    </Button>
                    <Button className="bg-green-300" onClick={handlePost} hidden={!disabledView || bpbData.status !== 'Draft' && bpbData.status !== 'Returned'}>
                        Post
                    </Button>
                    <Button className="bg-green-300" onClick={handlePrint} hidden={bpbData.status !== 'Done'}>
                      Print
                    </Button>
                    <div></div>
                    <div  className="xl:w-2/10 p-4" hidden={bpbData.status === null}>
                        <p id="status" >
                        Status : {bpbData.status}
                        </p>
                    </div>
              </div>

              {loading && (
                  <div className="row">
                    <div className="col-md-12 mb-12 text-center">Loading...</div>
                  </div>
              )}
              {!loading && (
              <div>
                <div className="flex w-full flex-wrap md:flex-nowrap pt-4 pb-2">
                    <div className='flex w-full'>
                        <div className='w-1/2 p-2'>
                            <Card className='p-4'>
                                <div  className="flex p-2 xl:w-3/4 w-full">
                                    <Input
                                    id="salesman"
                                    // ref={no_ppbRef}
                                    variant="bordered"
                                    className="bg-white "
                                    type="text"
                                    value={bpbData.salesman}
                                    label="Salesman"
                                    isInvalid={message?.salesman != null}
                                    errorMessage={message?.salesman}
                                    onChange={e => setBpbData({ ...bpbData, salesman: e.target.value })}
                                    isDisabled={disabledView}
                                    />
                                </div>
                                <div  className=" p-2 xl:w-3/4 w-full">
                                    <Input
                                    id="Date"
                                    // ref={dateRef}
                                    variant="bordered"
                                    className="bg-white "
                                    type="text"
                                    value={bpbData.date}
                                    label="Date"
                                    isInvalid={message?.date != null}
                                    errorMessage={message?.date}
                                    isDisabled={true}
                                    />
                                </div>
                                <div  className=" p-2 xl:w-3/4 w-full">
                                    <Input
                                    id="no_po"
                                    // ref={no_ppbRef}
                                    variant="bordered"
                                    className="bg-white "
                                    type="text"
                                    value={bpbData.no_po}
                                    label="No. PO"
                                    isInvalid={message?.no_po != null}
                                    errorMessage={message?.no_po}
                                    onChange={e => setBpbData({ ...bpbData, no_po: e.target.value })}
                                    isDisabled={disabledView}
                                    />
                                </div>
                                <div  className=" p-2 xl:w-3/4 w-full">
                                    <Input
                                    id="delivery_by"
                                    // ref={no_ppbRef}
                                    variant="bordered"
                                    className="bg-white "
                                    type="text"
                                    value={bpbData.delivery_by}
                                    label="Delivery By"
                                    isInvalid={message?.delivery_by != null}
                                    errorMessage={message?.delivery_by}
                                    onChange={(e) => setBpbData( {...bpbData, delivery_by: e.target.value} )}
                                    isDisabled={disabledView}
                                    />
                                </div>
                                {/* <div  className=" p-2 xl:w-3/4 w-full">
                                    <Input
                                        id="Delivery Date"
                                        // ref={dateRef}
                                        variant="bordered"
                                        className="bg-white "
                                        type="date"
                                        value={bpbData.delivery_date}
                                        label="Delivery Date"
                                        isInvalid={message?.delivery_date != null}
                                        errorMessage={message?.delivery_date}
                                        onChange={(e) => setBpbData( {...bpbData, delivery_date: e.target.value} )}
                                        isDisabled={disabledView}
                                    />
                                </div> */}
                            </Card>
                        </div>
                        <div className='w-1/2 p-2'>
                            <Card className='p-4'>
                                <div  className=" p-2 xl:w-3/4 w-full">
                                    <Input
                                    id="no_bpb"
                                    // ref={no_ppbRef}
                                    variant="bordered"
                                    className="bg-white "
                                    type="text"
                                    value={bpbData.no_bpb}
                                    label="No. BPB"
                                    isInvalid={message?.no_bpb != null}
                                    errorMessage={message?.no_bpb}
                                    isDisabled={true}
                                    />
                                </div>
                                <div  className=" p-2 xl:w-3/4 w-full">
                                    <Input
                                    id="customer"
                                    // ref={no_ppbRef}
                                    variant="bordered"
                                    className="bg-white "
                                    type="text"
                                    value={bpbData.customer}
                                    label="Customer"
                                    isInvalid={message?.customer != null}
                                    errorMessage={message?.customer}
                                    onChange={(e) => setBpbData( {...bpbData, customer: e.target.value} )}
                                    isDisabled={disabledView}
                                    />
                                </div>
                                <div  className=" p-2 xl:w-3/4 w-full">
                                    <Textarea
                                    id="customer_address"
                                    // ref={no_ppbRef}
                                    variant="bordered"
                                    className="bg-white "
                                    type="text"
                                    value={bpbData.customer_address}
                                    label="Address"
                                    isInvalid={message?.customer_address != null}
                                    errorMessage={message?.customer_address}
                                    onChange={(e) => setBpbData( {...bpbData, customer_address: e.target.value} )}
                                    isDisabled={disabledView}
                                    />
                                </div>
                                <div  className=" p-2 xl:w-3/4 w-full">
                                    <Input
                                    id="customer_pic_name"
                                    // ref={no_ppbRef}
                                    variant="bordered"
                                    className="bg-white "
                                    type="text"
                                    value={bpbData.customer_pic_name}
                                    label="PIC Name"
                                    isInvalid={message?.customer_pic_name != null}
                                    errorMessage={message?.customer_pic_name}
                                    onChange={(e) => setBpbData( {...bpbData, customer_pic_name: e.target.value} )}
                                    isDisabled={disabledView}
                                    />
                                </div>
                                <div  className=" p-2 xl:w-3/4 w-full">
                                    <Input
                                    id="customer_pic_phone"
                                    // ref={no_ppbRef}
                                    variant="bordered"
                                    className="bg-white "
                                    type="text"
                                    value={bpbData.customer_pic_phone}
                                    label="PIC Phone"
                                    isInvalid={message?.customer_pic_phone != null}
                                    errorMessage={message?.customer_pic_phone}
                                    onChange={(e) => setBpbData( {...bpbData, customer_pic_phone: e.target.value} )}
                                    isDisabled={disabledView}
                                    />
                                </div>
                            </Card>
                        </div>
                    </div>

                </div>
{/* 
                <div  className=" p-2 xl:w-full w-full">
                  <RadioGroup
                      label="Apakah Merupakan Pengiriman Partial?"
                      orientation="horizontal"
                      value={bpbData.is_partial_delivery}  // Nilai yang sesuai dengan Radio
                      onChange={(event) => setBpbData({ ...bpbData, is_partial_delivery: event.target.value })} // Update state saat value berubah
                  >
                      <Radio value="ya">Ya</Radio>
                      <Radio value="tidak">Tidak</Radio>
                  </RadioGroup>
                </div> */}
                    
                <br />
                <Table aria-label="Example static collection table" className='p-2'>
                <TableHeader>
                    <TableColumn className='w-1/10'>PARTIAL</TableColumn>
                    <TableColumn className='w-2/10'>ITEM NAME</TableColumn>
                    <TableColumn className='w-15/100'>EDP</TableColumn>
                    <TableColumn className='w-15/100'>S/N</TableColumn>
                    <TableColumn className='w-1/10'>QUANTITY</TableColumn>
                    <TableColumn className='w-1/13'>DEL. DATE</TableColumn>
                    <TableColumn className='w-2/10'>NOTE</TableColumn>
                    <TableColumn className='w-1/20' hideHeader={disabledView}>ACTION</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No Data found"} items={details} isLoading={loading2} loadingContent={<Spinner label="Loading..." />}>
                    {details.map((item,index) => (
                        <TableRow key={index}>
                            <TableCell>
                              <RadioGroup
                                  aria-label="Apakah Merupakan Pengiriman Partial?"
                                  orientation="horizontal"
                                  value={item.is_partial_delivery}  // Nilai yang sesuai dengan Radio
                                  onChange={(e) => handleInputRadio(index, 'is_partial_delivery', e.target.value)} 
                                  isDisabled = {disabledView}                             
                                  >
                                  <Radio value="1">Ya</Radio>
                                  <Radio value="0">Tidak</Radio>
                              </RadioGroup>
                            </TableCell>
                            <TableCell>
                              <div hidden={item.is_partial_delivery === '1'}>
                                <Input
                                    startContent={<SearchIcon onClick={()=>handleOpenModalItems(index)} className="cursor-pointer"/>}
                                    style={{ fontSize: '12px' }}
                                    isDisabled = {disabledView}
                                    type="text" 
                                    variant='bordered' 
                                    value={item.item_name} 
                                    aria-label="Item Name"
                                    readOnly
                                    // onChange={(e) => handleInputChangeRow(index, 'item', e.target.value)}
                                />
                              </div>
                              <div hidden={item.is_partial_delivery === '0'}>
                                <Input
                                    style={{ fontSize: '12px' }}
                                    isDisabled = {disabledView}
                                    type="text" 
                                    variant='bordered' 
                                    value={item.item_name} 
                                    aria-label="Item Name"
                                    onChange={(e) => handleInputChangeRow(index, 'item_name', e.target.value)}
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div hidden={item.is_partial_delivery === '1'}>
                                <Input 
                                    aria-label="No EDP"
                                    style={{ fontSize: '12px' }}
                                    isDisabled = {disabledView}
                                    type="text" 
                                    variant='bordered' 
                                    value={item.no_edp} 
                                    readOnly
                                />
                              </div>
                              <div hidden={item.is_partial_delivery === '0'}>
                                <Input 
                                    aria-label="No EDP"
                                    style={{ fontSize: '12px' }}
                                    isDisabled = {disabledView}
                                    type="text" 
                                    variant='bordered' 
                                    value={item.no_edp} 
                                    onChange={(e) => handleInputChangeRow(index, 'no_edp', e.target.value)}
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div hidden={item.is_partial_delivery === '1'}>
                                <Input
                                    aria-label="No SN"
                                    style={{ fontSize: '12px' }}
                                    isDisabled = {disabledView}
                                    type="text" 
                                    variant='bordered' 
                                    value={item.no_sn} 
                                    readOnly
                                />
                              </div>
                              <div hidden={item.is_partial_delivery === '0'}>
                                <Input
                                    aria-label="No SN"
                                    style={{ fontSize: '12px' }}
                                    isDisabled = {disabledView}
                                    type="text" 
                                    variant='bordered' 
                                    value={item.no_sn} 
                                    onChange={(e) => handleInputChangeRow(index, 'no_sn', e.target.value)}
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div hidden={item.is_partial_delivery === '1'}>
                                <Input
                                    aria-label="Quantity"
                                    style={{ fontSize: '12px' }}
                                    isDisabled = {disabledView}
                                    type="text" 
                                    variant='bordered' 
                                    value={item.quantity} 
                                    readOnly
                                />
                              </div>
                              <div hidden={item.is_partial_delivery === '0'}>
                                <Input
                                    aria-label="Quantity"
                                    style={{ fontSize: '12px' }}
                                    isDisabled = {disabledView}
                                    type="text" 
                                    variant='bordered' 
                                    value={item.quantity} 
                                    onChange={(e) => handleInputChangeRow(index, 'quantity', e.target.value)}
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                                <Input
                                    aria-label="delivery_date"
                                    style={{ fontSize: '12px' }}
                                    isDisabled = {disabledView}
                                    type="date" 
                                    variant='bordered' 
                                    value={item.delivery_date}
                                    onChange={(e) => handleInputChangeRow(index, 'delivery_date', e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <Textarea
                                    aria-label="Note"
                                    style={{ fontSize: '12px' }}
                                    type="text" 
                                    variant='bordered' 
                                    value={item.notes}
                                    onChange={(e) => handleInputChangeRow(index, 'notes', e.target.value)}
                                    isDisabled={disabledView}
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
                {/* <br />
                <div hidden={bpbData.is_partial_delivery !== '1'}>
                <h5>Partial Delivery Item Table</h5>
                <Table aria-label="Example static collection table" className='p-2' >
                <TableHeader>
                    <TableColumn className='w-3/10'>ITEM NAME</TableColumn>
                    <TableColumn className='w-2/10'>EDP</TableColumn>
                    <TableColumn className='w-2/10'>S/N</TableColumn>
                    <TableColumn className='w-1/10'>QUANTITY</TableColumn>
                    <TableColumn className='w-2/10'>NOTE</TableColumn>
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
                                    value={item.item_name} 
                                    aria-label="Item Name"
                                    readOnly
                                    // onChange={(e) => handleInputChangeRow(index, 'item', e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <Input 
                                    aria-label="No EDP"
                                    style={{ fontSize: '12px' }}
                                    isDisabled = {disabledView}
                                    type="text" 
                                    variant='bordered' 
                                    value={item.no_edp} 
                                    readOnly
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    aria-label="No SN"
                                    style={{ fontSize: '12px' }}
                                    isDisabled = {disabledView}
                                    type="text" 
                                    variant='bordered' 
                                    value={item.no_sn} 
                                    readOnly
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
                                    readOnly
                                />
                            </TableCell>
                            <TableCell>
                                <Textarea
                                    aria-label="Note"
                                    style={{ fontSize: '12px' }}
                                    type="text" 
                                    variant='bordered' 
                                    value={item.notes}
                                    onChange={(e) => handleInputChangeRow(index, 'notes', e.target.value)}
                                    isDisabled={disabledView}
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
                  hidden={disabledView || bpbData.is_partial_delivery !== 'ya'}
                  color="primary"
                  endContent={<PlusIcon className="w-5 h-5" />}
                  className="p-2 w-2 h-12 rounded-full flex items-center justify-center bg-blue-500 hover:bg-blue-600"
                  onClick={addData}
                >
                </Button>
                <hr />
                </div> */}
                <div className=" w-full flex-wrap md:flex-nowrap pt-4 pb-2">
                  <div className='flex'>
                    <div  className=" p-2 xl:w-1/4 w-full">
                      <Input
                      id="request_by"
                      // ref={prepared_byRef}
                      variant="bordered"
                      className="bg-white "
                      type="text"
                      value={bpbData.request_by}
                      label="Request By"
                      isInvalid={message?.request_by != null}
                      errorMessage={message?.request_by}
                      isDisabled={true}
                    />
                    </div>
                  </div>

                  <div className='flex'>
                    <div  className="flex p-2 xl:w-1/4 w-full">
                      <div className='pe-2'hidden={disabledView}>
                        <Button onPress={handleOpenModalApprovedBy} className='border-gray-500 w-1/20 h-14'><SearchIcon/></Button>
                      </div>
                      <Input
                        id="approved_by"
                        variant="bordered"
                        className="bg-white w-full"
                        type="text"
                        value={bpbData.approved_by|| ''}
                        label="Approved By"
                        isInvalid={message?.approved_by != null}
                        errorMessage={message?.approved_by}
                        isDisabled={disabledView}
                        isReadOnly={true}
                      />
                    </div>
                    <div className='flex p-4 w-1/4' hidden={bpbData.status === 'Draft' || bpbData.status === null}>
                        <p id="status" >
                          Status : {bpbData.approved_by_status}
                        </p>
                        <p id="date" hidden={bpbData.approved_by_date == null}>
                            / Date : {bpbData.approved_by_date}
                        </p>
                    </div>
                  </div>
                  
                  <hr hidden = {bpbData.remarks == null || param =='new'}></hr>
                  <div className='flex' hidden = {bpbData.remarks == null || param =='new'}>
                    <div  className=" p-2 xl:w-2/4 w-full">
                      <Textarea
                      id="remarks"
                      variant="bordered"
                      className="bg-white "
                      type="text"
                      value={bpbData.remarks}
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
                    <TableSelect columns={columnsItems} apiname={'itemselect'} payload={payloadItems} handleAction={(data) => handleItems(data)}>
                    </TableSelect>
                </ModalBody>
                </>
            )}
            </ModalContent>
        </Modal>
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
  )
}
