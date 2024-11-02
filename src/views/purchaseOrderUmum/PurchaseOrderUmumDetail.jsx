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

export default function PurchaseOrderUmumDetail() {
  const [user,  setUser] = useState([]); 
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
  const [isModalVerifiedBy, setIsModalOpenVerifiedBy] = useState(false);
  const [isModalApprovedBy, setIsModalOpenApprovedBy] = useState(false);
  const [isModalVendor, setIsModalOpenVendor] = useState(false);
  const [isModalShipTo, setIsModalOpenShipTo] = useState(false);
  const [isModalItems, setIsModalOpenItems] = useState(false);

  const handleOpenModalVerifiedBy = () => setIsModalOpenVerifiedBy(true);
  const handleCloseModalVerifiedBy = () => setIsModalOpenVerifiedBy(false);

  const handleOpenModalApprovedBy = () => setIsModalOpenApprovedBy(true);
  const handleCloseModalApprovedBy = () => setIsModalOpenApprovedBy(false);
  
  const handleOpenModalVendor = () => setIsModalOpenVendor(true);
  const handleCloseModalVendor = () => setIsModalOpenVendor(false);

  const handleOpenModalShipTo = () => setIsModalOpenShipTo(true);
  const handleCloseModalShipTo = () => setIsModalOpenShipTo(false);

  // const handleOpenModalItems = () => setIsModalOpenItems(true);
  // const handleCloseModalItems = () => setIsModalOpenItems(false);

  const handleOpenModalItems = () =>{
    setIsModalOpenItems(true)
    setIndexNow(null)
    getDetails();
  }

  const handleCloseModalItems = () =>{
    setIsModalOpenItems(false)
    setIndexNow(null)
  }

  const [poData, setPoData] = useState({
    tanggal: '',
    no_po: '',
    status: '',
    vendor: '',
    vendor_id: '',
    ship_to: '',
    ship_to_id: '',
    terms: '',
    ship_via: '',
    expected_date: '',
    currency: '',
    sub_total: 0,
    discount: 0,
    freight_cost: 0,
    ppn: 0,
    total_order: 0,
    say: '',
    description: '',
    prepared_by: '',
    prepared_by_id: '',
    prepared_by_date: '',
    verified_by: '',
    verified_by_id: '',
    verified_by_date: '',
    verified_by_status: '',
    approved_by: '',
    approved_by_id: '',
    approved_by_date: '',
    approved_by_status: '',
    remarks: '',
  })

  const [details, setDetails] = useState([
    {
      id: null,
      item: null,
      no_ppb:null,
      ppb_detail_id: null,
      description: null,
      quantity: null,
      unit_price: null,
      discount: null,
      amount: null,
      remarks: null,
      item_unit: null,
      tipe_item: null,
      is_items_created: false
    }
  ]);

  const addData = () => {
    const newData = {
        id: null,
        item: null,
        no_ppb:null,
        ppb_detail_id: null,
        description: null,
        quantity: null,
        unit_price: null,
        discount: null,
        amount: null,
        remarks: null,
        item_unit: null,
    };

    setDetails([...details, newData]);

  };


  const btnBack = () => [
    navigate('/poumum')
  ]


  useEffect(() => {

    getDetails();
    getPo();

    setDisabledView(true)
    

    axiosClient.get('/user')
          .then(({data}) => {
            setUser(data);
            console.log(data)
          })
    
    console.log(user)

  }, [])

  
  const getPo = () => {
    setLoading(true)
    axiosClient
      .get('/po/' + param)
      .then(({ data }) => {
        setPoData({
            tanggal: data.data.tanggal,
            no_po: data.data.no_po,
            status: data.data.status,
            vendor: data.data.vendor,
            vendor_id: data.data.vendor_id,
            ship_to: data.data.ship_to,
            ship_to_id: data.data.ship_to_id,
            terms: data.data.terms,
            ship_via: data.data.ship_via,
            expected_date: data.data.expected_date,
            currency: data.data.currency,
            sub_total: data.data.sub_total,
            discount: data.data.discount,
            freight_cost: data.data.freight_cost,
            ppn: data.data.ppn,
            total_order: data.data.total_order,
            say: data.data.say,
            description: data.data.description,
            prepared_by: data.data.prepared_by,
            prepared_by_id: data.data.prepared_by_id,
            prepared_by_date: data.data.prepared_by_date,
            verified_by: data.data.verified_by,
            verified_by_id: data.data.verified_by_id,
            verified_by_date: data.data.verified_by_date,
            verified_by_status: data.data.verified_by_status,
            approved_by: data.data.approved_by,
            approved_by_id: data.data.approved_by_id,
            approved_by_date: data.data.approved_by_date,
            approved_by_status: data.data.approved_by_status,
            remarks: data.data.remarks,
            arrival_date: data.data.arrival_date,
            receiver: data.data.receiver,
            receiver_id: data.data.receiver_id,
            arrival_status: data.data.arrival_status,
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
      .get('/podetaillist/'+ param)
      .then(({ data }) => {
        setDetails(data.data);
        setLoading2(false);
      })
      .catch(() => {
        setLoading2(false);
      })
  }

  const [rows, setRows] = useState(details);

  useEffect(() => {
      setRows(details);
  }, [details]);


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

    const arrived = () => {
      axiosClient
      .post('/po/arrived/' + param)
      .then(({}) => {
        Toast.fire({
          icon: "success",
          title: "Arrival is successfully"
        }); 
        navigate('/poumum')
      })
      .catch(err => {
        const response = err.response
        if (response && response.status === 400) {
          setMessage(response.data.message);
          setErrors(true);
        }
      })
    }

    const handleArrived = () => {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, post it!"
      }).then((result) => {
        if (result.isConfirmed) {
            handlePost();
          // navigate('/stockiteminitial/' + param)
        }
      });
    };

    const handlePost = () => {
      console.log(rows)

      for (let i = 0; i < rows.length; i++) {
        console.log(rows[i].tipe_item)
        if(rows[i].tipe_item === undefined && rows[i].is_items_created === 0) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Mohon pilih tipe item terlebih dahulu",
            // footer: '<a href="#">Why do I have this issue?</a>'
          })

          return;
        }
      }

      for (let i = 0; i < rows.length; i++) {
        if(rows[i].tipe_item === 'MATERIAL' && rows[i].is_items_created === 0) {
          console.log(rows[i].id, rows[i].tipe_item)
          axiosClient
          .post('/stockmaterialinit/' + rows[i].id)
          .then(({}) => {
            // Toast.fire({
            //   icon: "success",
            //   title: "Arrival is successfully"
            // }); 
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

      navigate('/stockiteminitial/' + param)
    }
    

    const item_units_selects = [
      {key: "unit", label: "unit"},
      {key: "pcs", label: "pcs"},
      {key: "kg", label: "kg"},
      {key: "g", label: "g"},
      {key: "L", label: "L"},
      {key: "box", label: "box"},
      {key: "pack", label: "pack"},
      {key: "pair", label: "pair"},
      {key: "sheet", label: "sheet"},
      {key: "roll", label: "roll"},
    ]
  
    const apiname = "userSelect";

    const handleVerifiedBy = (data) => {

      setPoData({ ...poData, verified_by: data.name, verified_by_id: (data.id).toString() });
      setIsModalOpenVerifiedBy(false)
    }

    const handleApprovedBy = (data) => {
      setPoData({ ...poData, approved_by: data.name, approved_by_id: (data.id).toString()  });
      setIsModalOpenApprovedBy(false)
    }

    const handleVendor = (data) => {
      console.log(data)
      setPoData({ ...poData, vendor: data.name, vendor_id: (data.id).toString() });
      setIsModalOpenVendor(false)
    }

    const handleShipTo = (data) => {

      setPoData({ ...poData, ship_to: data.name, ship_to_id: (data.id).toString() });
      setIsModalOpenShipTo(false)
    }

    const handleItems = (data) => {
      console.log(indexNow)
      setRows(rows.map((row, i) => i === indexNow ? { ...row, item: data.nama_barang, ppb_detail_id: (data.id).toString(), no_ppb: data.no_ppb } : row));
      setIsModalOpenItems(false)
      console.log(rows)
    }

    const handleInputChangeRow = (index, field, value) => {
      setDetails(details.map((row, i) => i === index ? { ...row, [field]: value } : row));
    };

  return (
    <div className="bg-white p-4 rounded-large animated fadeInDown">
      <div className="flex-col items-center">
        <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid grey' }}>
          <h1 hidden={param != 'new'}>Create Purchase Order Barang</h1>
          <h1 hidden={param == 'new' || param2 == 'view'}>Edit Purchase Order Barang</h1>
          <h1 hidden={param2 != 'view'}>View Purchase Order Barang</h1>
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
                      // ref={dateRef}
                      variant="bordered"
                      className="bg-white "
                      type="text"
                      defaultValue={poData.tanggal}
                      label="PO Date"
                      isInvalid={message?.tanggal != null}
                      errorMessage={message?.tanggal}
                      isReadOnly={true}
                    />
                  </div>

                  <div  className=" p-2 xl:w-1/5 w-full">
                    <Input
                      id="no_po"
                      // ref={no_ppbRef}
                      variant="bordered"
                      className="bg-white "
                      type="text"
                      defaultValue={poData.no_po}
                      label="No. PO"
                      isInvalid={message?.no_po != null}
                      errorMessage={message?.no_po}
                      isReadOnly={true}
                    />
                  </div>
                  <div  className="xl:w-2/6 w-full"></div>
                  <div  className="xl:w-2/10 w-full p-4" hidden={poData.arrival_status === ''}>
                    <p id="arrival_status" >
                      Arrival Status : {poData.arrival_status}
                    </p>
                  </div>
                  <div  className="flex p-2 xl:w-1/2 w-full">
                    
                    <Input
                        id="vendor"
                        variant="bordered"
                        className="bg-white w-full"
                        type="text"
                        defaultValue={poData.vendor|| ''}
                        value={poData.vendor|| ''}
                        label="Vendor"
                        isInvalid={message?.vendor != null}
                        errorMessage={message?.vendor}
                        isReadOnly={true}
                      />  
                    
                  </div>
                  <div  className="flex p-2 xl:w-1/2 w-full">
                    
                    <Input
                        // startContent={<SearchIcon onClick={handleOpenModalShipTo} className="cursor-pointer"/>}
                        id="ship_to"
                        variant="bordered"
                        className="bg-white w-full"
                        type="text"
                        defaultValue={poData.ship_to|| ''}
                        value={poData.ship_to|| ''}
                        label="Ship To"
                        isInvalid={message?.ship_to != null}
                        errorMessage={message?.ship_to}
                        isReadOnly={true}
                      /> 
                    
                  </div>
                  <div  className=" p-2 xl:w-1/4 w-full">
                    <Input
                      id="terms"
                      // ref={tanggalRef}
                      variant="bordered"
                      className="bg-white "
                      type="text"
                      value={poData.terms}
                      label="Terms"
                      isInvalid={message?.terms != null}
                      errorMessage={message?.terms}
                      isReadOnly={true}
                    />
                  </div>
                  <div  className=" p-2 xl:w-1/4 w-full">
                    <Input
                      id="ship_via"
                      // ref={ship_viaRef}
                      variant="bordered"
                      className="bg-white "
                      type="text"
                      value={poData.ship_via}
                      label="Ship Via"
                      isInvalid={message?.ship_via != null}
                      errorMessage={message?.ship_via}
                      isReadOnly={true}
                    />
                  </div>
                  <div  className=" p-2 xl:w-1/4 w-full">
                    <Input
                      id="expected_date"
                      // ref={expected_dateRef}
                      variant="bordered"
                      className="bg-white "
                      type="date"
                      value={poData.expected_date}
                      label="Expected Date"
                      isInvalid={message?.expected_date != null}
                      errorMessage={message?.expected_date}
                      isReadOnly={true}
                    />
                  </div>
                  <div  className=" p-2 xl:w-1/4 w-full">
                    <Input
                      id="currency"
                      // ref={currencyRef}
                      variant="bordered"
                      className="bg-white "
                      type="text"
                      value={poData.currency}
                      label="Currency"
                      isInvalid={message?.currency != null}
                      errorMessage={message?.currency}
                      isReadOnly={true}
                    />
                  </div>
                </div>
                <br />
                <Table aria-label="Example static collection table" className='p-2'>
                <TableHeader>
                    <TableColumn className='w-15/100'>ITEM</TableColumn>
                    <TableColumn className='w-15/100'>DESCRIPTION</TableColumn>
                    <TableColumn className='w-1/13'>QTY</TableColumn>
                    <TableColumn className='w-1/10' hidden={user.role == 'WAREHOUSE'}>UNIT PRICE</TableColumn>
                    <TableColumn className='w-1/13' hidden={user.role == 'WAREHOUSE'}>DISCOUNT %</TableColumn>
                    <TableColumn className='w-1/10' hidden={user.role == 'WAREHOUSE'}>AMOUNT</TableColumn>
                    <TableColumn className='w-12/100'>REMARKS</TableColumn>
                    <TableColumn className='w-1/10'>ITEM UNIT</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No Data found"} items={rows} isLoading={loading2} loadingContent={<Spinner label="Loading..." />}>
                    {rows.map((item,index) => (
                        <TableRow key={index}>
                            <TableCell>
                                {item.item}
                            </TableCell>
                            <TableCell>
                                {item.description}
                            </TableCell>
                            <TableCell>
                                {item.quantity}
                            </TableCell>
                            <TableCell hidden={user.role == 'WAREHOUSE'}>
                                {item.unit_price} 
                            </TableCell>
                            <TableCell hidden={user.role == 'WAREHOUSE'}>
                                {item.discount}
                            </TableCell>
                            <TableCell hidden={user.role == 'WAREHOUSE'}>
                                {item.amount}
                            </TableCell>
                            <TableCell>
                                {item.remarks}
                            </TableCell>
                            <TableCell>
                                {item.item_unit}
                            </TableCell>
                            
                        </TableRow>
                    ))}
                </TableBody>
                
                </Table>
                

                <div className='flex justify-between'>
                  <div className='w-3/5'>
                    <div  className=" p-2 w-full" hidden={user.role == 'WAREHOUSE'}>
                      <Input
                      id="say"
                      // ref={sayRef}
                      variant="bordered"
                      className="bg-white "
                      type="text"
                      value={poData.say}
                      label="Say"
                      isInvalid={message?.say != null}
                      errorMessage={message?.say}
                      isReadOnly={true}
                    />
                    </div>
                    <div  className=" p-2 w-full">
                      <Textarea
                      id="description"
                      // ref={descriptionRef}
                      variant="bordered"
                      className="bg-white "
                      type="text"
                      value={poData.description}
                      label="Description"
                      isInvalid={message?.description != null}
                      errorMessage={message?.description}
                      isReadOnly={true}
                    />
                    </div>
                  </div>
                  <div className='w-2/5' hidden={user.role == 'WAREHOUSE'}>
                    <div  className=" p-2 w-full">
                      <Input
                      id="sub_total"
                      // ref={sub_totalRef}
                      variant="bordered"
                      className="bg-white "
                      type="text"
                      value={poData.sub_total}
                      label="Sub Total"
                      isInvalid={message?.sub_total != null}
                      errorMessage={message?.sub_total}
                      isReadOnly={true}
                    />
                    </div>
                    <div  className=" p-2 w-full">
                      <Input
                      id="discount"
                      // ref={discountRef}
                      variant="bordered"
                      className="bg-white "
                      type="text"
                      value={poData.discount}
                      label="Discount"
                      isInvalid={message?.discount != null}
                      errorMessage={message?.discount}
                      isReadOnly = {true}
                    />
                    </div>
                    <div  className=" p-2 w-full">
                      <Input
                      id="freight_cost"
                      // ref={freight_costRef}
                      variant="bordered"
                      className="bg-white "
                      type="text"
                      value={poData.freight_cost}
                      label="Freight Cost"
                      isInvalid={message?.freight_cost != null}
                      errorMessage={message?.freight_cost}
                      isReadOnly = {true}
                    />
                    </div>
                    <div  className=" p-2 w-full">
                      <Input
                      id="ppn"
                      // ref={ppnRef}
                      variant="bordered"
                      className="bg-white "
                      type="text"
                      value={poData.ppn}
                      label="PPN 11%"
                      isInvalid={message?.ppn != null}
                      errorMessage={message?.ppn}
                      isReadOnly={true}
                    />
                    </div>
                    <div  className=" p-2 w-full">
                      <Input
                      id="total_order"
                      // ref={total_orderRef}
                      variant="bordered"
                      className="bg-white "
                      type="text"
                      value={poData.total_order}
                      label="Total Order"
                      isInvalid={message?.total_order != null}
                      errorMessage={message?.total_order}
                      isReadOnly={true}
                    />
                    </div>
                  </div>
                </div>
                <hr />
                <div className=" w-full flex-wrap md:flex-nowrap pt-4 pb-2">
                  <div className='flex'>
                    <div  className=" p-2 xl:w-1/4 w-full">
                      <Input
                      id="prepared_by"
                      // ref={prepared_byRef}
                      variant="bordered"
                      className="bg-white "
                      type="text"
                      defaultValue={poData.prepared_by}
                      label="Prepared By"
                      isInvalid={message?.prepared_by != null}
                      errorMessage={message?.prepared_by}
                      isReadOnly={true}
                    />
                    </div>
                  </div>

                  <div className='flex'>
                    <div  className="flex p-2 xl:w-1/4 w-full">
                      
                      <Input
                        id="verified_by"
                        variant="bordered"
                        className="bg-white w-full"
                        type="text"
                        defaultValue={poData.verified_by|| ''}
                        value={poData.verified_by|| ''}
                        label="Verified By"
                        isInvalid={message?.verified_by != null}
                        errorMessage={message?.verified_by}
                        isReadOnly={true}
                      />    
                    </div>
                    <div className='flex p-4 w-1/4' hidden={poData.status === 'Draft' || poData.status === ''}>
                          <p id="status" >
                            Status : {poData.verified_by_status}
                          </p>
                          <p id="date" hidden={poData.verified_by_date == null}>
                            / Date : {poData.verified_by_date}
                        </p>
                    </div>
                  </div>

                  <div className='flex'>
                    <div  className="flex p-2 xl:w-1/4 w-full">
                      <Input
                        id="approved_by"
                        variant="bordered"
                        className="bg-white w-full"
                        type="text"
                        defaultValue={poData.approved_by|| ''}
                        value={poData.approved_by|| ''}
                        label="Approved By"
                        isInvalid={message?.approved_by != null}
                        errorMessage={message?.approved_by}
                        isReadOnly={true}
                      />
                    </div>
                    <div className='flex p-4 w-1/4' hidden={poData.status === 'Draft' || poData.status === ''}>
                        <p id="status" >
                          Status : {poData.approved_by_status}
                        </p>
                        <p id="date" hidden={poData.approved_by_date == null}>
                            / Date : {poData.approved_by_date}
                        </p>
                    </div>
                  </div>
                  
                  <hr></hr>
                  <div className='flex'>
                    <div className="flex xl:w-11/12 w-full">
                        <div  className=" p-2 xl:w-1/4 w-full">
                            <Input
                            id="arrival_date"
                            // ref={expected_dateRef}
                            variant="bordered"
                            className="bg-white "
                            type="date"
                            value={poData.arrival_date}
                            label="Arrival Date"
                            isInvalid={message?.arrival_date != null}
                            errorMessage={message?.arrival_date}
                            isReadOnly={true}
                            />
                        </div>
                        <div  className=" p-2 xl:w-1/4 w-full">
                            <Input
                            id="receiver"
                            // ref={currencyRef}
                            variant="bordered"
                            className="bg-white "
                            type="text"
                            value={poData.receiver}
                            label="Receiver"
                            isInvalid={message?.receiver != null}
                            errorMessage={message?.receiver}
                            isReadOnly={true}
                            /> 
                        </div>
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
