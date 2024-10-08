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
} from '@nextui-org/react'
import axiosClient from '../../axios-client'
import {PlusIcon} from '../../assets/PlusIcon'
import CheckMark from '../../assets/check-mark.png'

import Swal from 'sweetalert2'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";
import TableSelect from '../../custom/TableSelect'
import { SearchIcon } from '../../assets/SearchIcon'
import numberToWords from 'number-to-words';
// import { IconButton } from "@material-tailwind/react";

export default function BuktiPengeluaranBarangDetailUmum() {
  const navigate = useNavigate()
  const [indexNow, setIndexNow] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const { param,param2 } = useParams()
  const [message, setMessage] = useState(null)
  const [disabledView, setDisabledView ] = useState(false)
  const [isModalApprovedBy, setIsModalOpenApprovedBy] = useState(false);
  const [isModalItems, setIsModalOpenItems] = useState(false);
  const [payloadItems, setPayloadItems] = useState([]);
  const handleOpenModalApprovedBy = () => setIsModalOpenApprovedBy(true);
  const handleCloseModalApprovedBy = () => setIsModalOpenApprovedBy(false);

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
    salesman: null,
    date: null,
    no_po: null,
    delivery_by: null,
    delivery_date: null,
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
        id: null,
        item_id: null,
        item_name: null,
        no_edp: null,
        no_sn: null,
        quantity: null,
        notes: null,
    }
  ]);

  const addData = () => {
    const newData = {
        id: null,
        item_id: null,
        item_name: null,
        no_edp: null,
        no_sn: null,
        quantity: null,
        notes: null,
    };

    setDetails([...details, newData]);

  };


//   const btnBack = () => [
//     navigate('/bpb')
//   ]


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
            delivery_status: data.data.delivery_status,
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
    
    const handleDeliver = (id) => {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Deliver it!"
        }).then((result) => {
          if (result.isConfirmed) {
            axiosClient
            .post('/bpbdetail/deliver/' + id)
            .then(({}) => {
              Toast.fire({
                icon: "success",
                title: "Deliver is successfully"
              }); 
              getDetails();
            })
            .catch(err => {
              const response = err.response
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: response.data.message,
              });
              setMessage(response.data.message);
              setErrors(true);
            //   if (response && response.status === 400) {
            //     Swal.fire({
            //         icon: "error",
            //         title: "Oops...",
            //         text: response.data.message,
            //       });
            //   }
            })
          }
        });
      };

    const btnBack = () => [
        navigate('/bpbumum')
      ]

  return (
    <div className="bg-white p-4 rounded-large animated fadeInDown border">
      <div className="flex-col items-center">
        <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid grey' }}>
          <h1> Bukti Pengeluaran Barang Umum</h1>
          <Button className="bg-red-300" onClick={btnBack}>
            Back
          </Button>
        </div>
          <div className="pt-8">
              <div className="flex w-full flex-wrap md:flex-nowrap p-2 justify-between" >
                    <div></div>
                    <div  className="xl:w-2/10 p-4" hidden={bpbData.delivery_status === null}>
                        <p id="status" >
                        Status : {bpbData.delivery_status}
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
                                    readOnly
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
                                    readOnly
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
                                    readOnly
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
                                    readOnly
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
                                        readOnly
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
                                    readOnly
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
                                    readOnly
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
                                    readOnly
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
                                    readOnly
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
                                    readOnly
                                    />
                                </div>
                            </Card>
                        </div>
                    </div>

                </div>
                    
                <br />
                <Table aria-label="Example static collection table" className='p-2'>
                <TableHeader>
                    <TableColumn className='w-1/20'>PARTIAL?</TableColumn>
                    <TableColumn className='w-2/10'>ITEM NAME</TableColumn>
                    <TableColumn className='w-15/100'>EDP</TableColumn>
                    <TableColumn className='w-15/100'>S/N</TableColumn>
                    <TableColumn className='w-1/20'>QUANTITY</TableColumn>
                    <TableColumn className='w-1/13'>DEL. DATE</TableColumn>
                    <TableColumn className='w-2/10'>NOTE</TableColumn>
                    <TableColumn className='w-1/10'>DEL. ACTION</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No Data found"} items={details} isLoading={loading2} loadingContent={<Spinner label="Loading..." />}>
                    {details.map((item,index) => (
                        <TableRow key={index}>
                            <TableCell>
                                {item.is_partial_delivery == '1' ? "Yes" : "No"}
                            </TableCell>
                            <TableCell>
                                {item.item_name}
                            </TableCell>
                            <TableCell>
                                {item.no_edp} 
                            </TableCell>
                            <TableCell>
                                {item.no_sn} 
                            </TableCell>
                            <TableCell>
                                {item.quantity} 
                            </TableCell>
                            <TableCell>
                                {item.delivery_date} 
                            </TableCell>
                            <TableCell>
                                {item.notes}
                            </TableCell>
                            <TableCell>
                                <div hidden={item.is_delivered == '1'} className='justify-center'>
                                    <Button className='bg-blue-300' onPress={() => handleDeliver(item.id)}>
                                        Deliver
                                    </Button>  
                                </div>
                                <div hidden={item.is_delivered == '0'} className='justify-center'>
                                    <img src={CheckMark} alt="check mark" className="w-12 h-12" />
                                </div>
                                
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                
                </Table>

                <hr />
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
                      isReadOnly={true}
                    />
                    </div>
                  </div>

                  <div className='flex'>
                    <div  className="flex p-2 xl:w-1/4 w-full">
                      <Input
                        id="approved_by"
                        variant="bordered"
                        className="bg-white w-full"
                        type="text"
                        value={bpbData.approved_by|| ''}
                        label="Approved By"
                        isInvalid={message?.approved_by != null}
                        errorMessage={message?.approved_by}
                        readOnly
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
    </div>
  )
}
