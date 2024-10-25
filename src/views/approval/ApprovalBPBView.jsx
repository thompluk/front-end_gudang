// import React, { createRef } from 'react'
import React, { forwardRef, useImperativeHandle } from 'react';
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
import CheckMark from '../../assets/check-mark.png'

import Swal from 'sweetalert2'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";
import TableSelect from '../../custom/TableSelect'
import { SearchIcon } from '../../assets/SearchIcon'
import numberToWords from 'number-to-words';
import TableSelectWithFIlter from '../../custom/TableSelectWithFIlter'
// import { IconButton } from "@material-tailwind/react";

const ApprovalBPBView = forwardRef((props, ref) => {
  const navigate = useNavigate()
  const [idNow, setIdNow] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const { param,param2 } = useParams()
  const [message, setMessage] = useState(null)
  const [disabledView, setDisabledView ] = useState(false)
  const [isModalApprovedBy, setIsModalOpenApprovedBy] = useState(false);
  const [isModalItems, setIsModalOpenItems] = useState(false);
  const [payloadItems, setPayloadItems] = useState([]);
  const [filter, setFilter] = useState(null);

  const handleOpenModalItems = (id, filter) =>{
    setIsModalOpenItems(true)
    setIdNow(id)
    setFilter(filter)
  }

  const handleCloseModalItems = (id) =>{
    setIsModalOpenItems(false)
    setIdNow(null)
    setFilter(null)
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
        stock_id: null,
        stock_name: null,
        quantity: null,
        notes: null,
    }
  ]);

  const [details_details, setDetailsDetails] = useState([
    {
        id: null,
        bpb_detail_id:null,
        item_id: null,
        item_name: null,
        no_edp: null,
        no_sn: null,
        quantity: null,
        notes: null,
    }
  ]);

  const columnsItems = [
    {name: "ID", uid: "id", sortable: true},
    {name: "ITEM NAME", uid: "item_name", sortable: true},
    {name: "NO EDP", uid: "no_edp", sortable: true},
    {name: "NO SN", uid: "no_sn", sortable: true},
    {name: "ACTIONS", uid: "actions", headerClassName:'text-end'},
  ];

  useEffect(() => {

    if (param == 'new'){
      // addData();
    }
    if (param != 'new') {
      getDetails();
      getDetailsDetails();
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
            delivery_date: data.data.delivery_date,
            is_partial_delivery: data.data.is_partial_delivery.toString(),
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

  const getDetailsDetails = () => {

    setLoading2(true);

    axiosClient
      .get('/bpbdetaildetaillist/'+ param)
      .then(({ data }) => {
        setDetailsDetails(data.data);
        setLoading2(false);
      })
      .catch(() => {
        setLoading2(false);
      })
  }


  useEffect(() => {
    const newPayloadItems = {
      item_ids: details_details
        .filter(row => row.item_id != null) // Hanya masukkan yang tidak null
        .map(row => row.item_id), // Ambil nilai ppb_detail_id
      bpb_id : param
      
    };
    setPayloadItems(newPayloadItems);
  }, [details_details]);

  const btnCheckPayload = () => {
    console.log(payloadItems)
  }

  const handleInputChangeRow = (data, idNow) => {
    console.log(data, idNow)
    setDetailsDetails(details_details.map((row) => 
      row.id === idNow 
        ? { ...row, notes: data }
        : row
    ));    
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

    const btnBack = () => {
        navigate('/bpbdelivery')
    }

    const handleItems = (data) => {
      console.log(data, idNow)
      setDetailsDetails(details_details.map((row) => 
        row.id === idNow 
          ? { ...row, item_name: data.item_name, item_id: data.id, no_edp: data.no_edp, no_sn: data.no_sn }
          : row
      ));     
      setIsModalOpenItems(false)
    }
    const handleSaveAll = () => {
      axiosClient.post('/bpbdetaildetailsaveAll/'+param, details_details)
            .then(response => {
              // Handle successful save
              console.log('Data saved successfully');
              // Toast.fire({
              //   icon: "success",
              //   title: "Update is successfully"
              // });  
            })
            .catch(error => {
              const response = err.response
              if (response && response.status === 400) {
                setMessage(response.data.message);
                setErrors(true);
              }
                // Handle error
              console.error('There was an error saving the data!', error);
            });
    };

    useImperativeHandle(ref, () => ({
      handleSaveAll
    }));

    const detailTable = () => {
      return (
        <div>
          {details.map((detail,index) => (
            <div key={index} className='pt-4'>
              <div className='p-2 rounded-large border'>
                <div className='flex'>
                  <Input
                    style={{ fontSize: '12px' }}
                    type="text" 
                    value={detail.stock_name} 
                    label="Stock Name"
                    readOnly
                    className='w-1/5 p-2'
                  />
                  <Input
                    style={{ fontSize: '12px' }}
                    type="number" 
                    value={detail.quantity} 
                    label="Quantity"
                    readOnly
                    className='w-1/5 p-2'
                  />
                  <Textarea
                    style={{ fontSize: '12px' }}
                    type="text" 
                    value={detail.notes} 
                    label="Note"
                    readOnly
                    className='w-1/4 p-2'
                  />
                </div>
                <div>
                  <Table aria-label="Example static collection table" className='p-2'>
                    <TableHeader>
                        <TableColumn className='w-2/10'>ITEM NAME</TableColumn>
                        <TableColumn className='w-15/100'>EDP</TableColumn>
                        <TableColumn className='w-15/100'>S/N</TableColumn>
                        <TableColumn className='w-2/10'>NOTE</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"No Data found"} items={details_details} isLoading={loading2} loadingContent={<Spinner label="Loading..." />}>
                        {details_details
                        .filter(item => item.bpb_detail_id === detail.id)
                        .map((item,id) => (
                            <TableRow key={id}>
                                <TableCell>
                                    <Input
                                        startContent={<SearchIcon onClick={()=>handleOpenModalItems(item.id, detail.stock_id)} className="cursor-pointer"/>}
                                        style={{ fontSize: '12px' }}
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
                                        type="text" 
                                        variant='bordered' 
                                        value={item.no_sn} 
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
                                        onChange={(e) => handleInputChangeRow(e.target.value, item.id)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    
                  </Table>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    };

  return (
    <div className="bg-white p-4 rounded-large animated fadeInDown border">
      <div className="flex-col items-center">
        <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid grey' }}>
          <h1> BPB Delivery</h1>
        </div>
          <div className="pt-8">
          <div className="flex w-full flex-wrap md:flex-nowrap p-2 justify-between" >
                    {/* <Button id="save" className="bg-green-300" onClick={btnCheckPayload}>
                        check payload
                    </Button> */}
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
                <div className='flex'>
                  <div  className=" p-2 xl:w-1/4 w-full">
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
                    // isDisabled={!disabledView}
                    isReadOnly={true}
                    />
                  </div>
                  <div  className=" p-2 xl:w-1/4 w-full">
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
                      // isDisabled={!disabledView}
                      isReadOnly={true}
                      />
                  </div>
                </div>
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
                                {/* <div  className=" p-2 xl:w-3/4 w-full">
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
                                </div> */}
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
                                <div  className=" p-2 xl:w-3/4 w-full">
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
                                        isReadOnly={true}
                                    />
                                </div>
                                <div className=" pt-2 pb-2 ps-4 xl:w-3/4 w-full">
                                  <RadioGroup
                                      id="Is Partial Delivery"
                                      variant="bordered"
                                      className='bg-white'
                                      label="Is Partial Delivery?"
                                      aria-label="Apakah Merupakan Pengiriman Partial?"
                                      orientation="horizontal"
                                      value={bpbData.is_partial_delivery}  // Nilai yang sesuai dengan Radio
                                      onChange={(e) => setBpbData({...bpbData, is_partial_delivery: e.target.value})}
                                      isDisabled = {true}                             
                                      >
                                      <Radio value="1">Ya</Radio>
                                      <Radio value="0">Tidak</Radio>
                                  </RadioGroup>
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
                                {/* <div  className=" p-2 xl:w-3/4 w-full">
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
                                </div> */}
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
                
                {detailTable()}

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
      <Modal isOpen={isModalItems} onOpenChange={handleCloseModalItems} size='4xl'>
            <ModalContent>
            {(onClose) => (
                <>
                <ModalHeader className="flex flex-col gap-1">Select Items</ModalHeader>
                <ModalBody>
                    <TableSelectWithFIlter columns={columnsItems} apiname={'itemselect'} payload={payloadItems} filter={filter} handleAction={(data) => handleItems(data)}>
                    </TableSelectWithFIlter>
                </ModalBody>
                </>
            )}
            </ModalContent>
        </Modal>
    </div>
  )
});


export default ApprovalBPBView;

