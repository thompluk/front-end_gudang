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

export default function PurchaseOrderDetail() {
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
  const [payloadItems, setPayloadItems] = useState([]);

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

  const handleOpenModalItems = (index) =>{
    setIsModalOpenItems(true)
    setIndexNow(index)
  }

  const handleCloseModalItems = (index) =>{
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
    navigate('/po')
  ]


  useEffect(() => {

    if (param == 'new'){
      // addData();
    }
    if (param != 'new') {
      getDetails();
      getPo();
    }
    if (param2 == 'view') {
      setDisabledView(true)
    }

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


  const deleteDetail = (id) => {
    axiosClient
      .delete('/podetail/' + id)
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
      ppb_detail_ids: details
        .filter(row => row.ppb_detail_id !== null) // Hanya masukkan yang tidak null
        .map(row => row.ppb_detail_id) // Ambil nilai ppb_detail_id
    };
    setPayloadItems(newPayloadItems);
  }, [details]);


  const handleInputChangeRow = (index, field, value) => {
    setDetails(details.map((row, i) => i === index ? { ...row, [field]: value } : row));
  };

  const handleInputChange = (field, value) => {
    setPoData((prevData) => ({
      ...prevData, 
      [field]: value  
    }));


  };

  const handleOnBlur = (index) => {
    const currentRow = details[index];
    if(currentRow.quantity !== null && currentRow.unit_price !== null && currentRow.discount !== null){
      console.log(details);
      console.log(currentRow.quantity, currentRow.unit_price, currentRow.discount);

      const calculatedAmount = currentRow.quantity * currentRow.unit_price - (currentRow.quantity * currentRow.unit_price * currentRow.discount / 100);
      
      console.log(calculatedAmount);
      
      // Memperbarui rows dengan amount terbaru
      const updatedRows = details.map((row, i) => i === index ? { ...row, amount: calculatedAmount } : row);
      setDetails(updatedRows);

      // Menghitung total dari semua amount
      const totalAmount = updatedRows.reduce((total, row) => {
        return total + (parseFloat(row.amount) || 0);
      }, 0);

      // Update poData dengan sub_total yang baru
      setPoData({ ...poData, sub_total: totalAmount, ppn: totalAmount * 0.11, total_order: totalAmount + (totalAmount * 0.11) - (parseFloat(poData.discount) || 0) + (parseFloat(poData.freight_cost) || 0),
        say : numberToWords.toWords(totalAmount + (totalAmount * 0.11) - (parseFloat(poData.discount) || 0) + (parseFloat(poData.freight_cost) || 0))
       });
    
    }

  };

  const handleOnBlur2 = () => {

      if(poData.discount == ''){
        setPoData((prevData) => ({
        ...prevData,
        ['discount']: '0'
        }));
      }

      if(poData.freight_cost == ''){
        setPoData((prevData) => ({
        ...prevData,
        ['freight_cost']: '0'
        }));
      }
      

      console.log(poData);

      if(poData.total_order !== 0){
        setPoData({ ...poData, total_order: (parseFloat(poData.sub_total) || 0) + (parseFloat(poData.ppn) || 0) - (parseFloat(poData.discount) || 0) + (parseFloat(poData.freight_cost) || 0),
          say : numberToWords.toWords((parseFloat(poData.sub_total) || 0) + (parseFloat(poData.ppn) || 0) - (parseFloat(poData.discount) || 0) + (parseFloat(poData.freight_cost) || 0))
         });
      }
  };


  const updateforDelete = () => {

    const updatedRows = details
    setDetails(updatedRows);

    console.log(updatedRows);

    // Menghitung total dari semua amount
    const totalAmount = updatedRows.reduce((total, row) => {
      return total + (parseFloat(row.amount) || 0);
    }, 0);

    // Update poData dengan sub_total yang baru
    // setPoData({ ...poData, sub_total: totalAmount, ppn: totalAmount * 0.11, total_order: totalAmount + (totalAmount * 0.11) - (parseFloat(poData.discount) || 0) + (parseFloat(poData.freight_cost) || 0),
    //   say : numberToWords.toWords(totalAmount + (totalAmount * 0.11) - (parseFloat(poData.discount) || 0) + (parseFloat(poData.freight_cost) || 0))
    //   });

    // saveforDelete();

    setPoData(prevPoData => {
      const newPoData = {
        ...prevPoData,
        sub_total: totalAmount,
        ppn: totalAmount * 0.11,
        total_order: totalAmount + (totalAmount * 0.11) - (parseFloat(prevPoData.discount) || 0) + (parseFloat(prevPoData.freight_cost) || 0),
        say: numberToWords.toWords(totalAmount + (totalAmount * 0.11) - (parseFloat(prevPoData.discount) || 0) + (parseFloat(prevPoData.freight_cost) || 0))
      };
      
    });
  };

  // setDetails({ ...details, item: data.nama_barang, ppb_detail_id: (data.id).toString(), no_ppb: data.no_ppb });
  const handleDelete = (index) => {
    console.log(index);
    console.log(details[index]);
    console.log (details);
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
            updateforDelete();
            console.log('masuk');
          }
        
        const updatedDetails = details.filter((_, i) => i !== index);
        setDetails(updatedDetails);

        const totalAmount = updatedDetails.reduce((total, row) => {
          return total + (parseFloat(row.amount) || 0);
        }, 0);

        setPoData({ ...poData, sub_total: totalAmount, ppn: totalAmount * 0.11, total_order: totalAmount + (totalAmount * 0.11) - (parseFloat(poData.discount) || 0) + (parseFloat(poData.freight_cost) || 0),
          say : numberToWords.toWords(totalAmount + (totalAmount * 0.11) - (parseFloat(poData.discount) || 0) + (parseFloat(poData.freight_cost) || 0))
          });
      }
    });    
  };

    const handleSaveAll = (po_id) => {
      axiosClient.post('/posaveAll/'+po_id, details)
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
        vendor: poData.vendor,
        vendor_id: poData.vendor_id,
        ship_to: poData.ship_to,
        ship_to_id: poData.ship_to_id,
        terms: poData.terms,
        ship_via: poData.ship_via,
        expected_date: poData.expected_date,
        currency: poData.currency,
        sub_total: poData.sub_total,
        discount: poData.discount,
        freight_cost: poData.freight_cost,
        ppn: poData.ppn,
        total_order: poData.total_order,
        say: poData.say,
        description: poData.description,
        prepared_by: poData.prepared_by,
        prepared_by_id: poData.prepared_by_id,
        prepared_by_date: poData.prepared_by_date,
        verified_by: poData.verified_by,
        verified_by_id: poData.verified_by_id,
        verified_by_date: poData.verified_by_date,
        verified_by_status: poData.verified_by_status,
        approved_by: poData.approved_by,
        approved_by_id: poData.approved_by_id,
        approved_by_date: poData.approved_by_date,
        approved_by_status: poData.approved_by_status,
      }
      if (param == 'new') {
        axiosClient
          .post('/po', payload)
          .then(({data}) => {
            console.log(data.data.id)
            handleSaveAll(data.data.id)
            Toast.fire({
              icon: "success",
              title: "Create is successfully"
            });  
            navigate('/po')
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
          .put('/po/update/' + param, payload)
          .then(({}) => {
            console.log(param)
            handleSaveAll(param)
            Toast.fire({
              icon: "success",
              title: "Update is successfully"
            });  
            navigate('/po')
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
      .post('/po/post/' + param)
      .then(({}) => {
        console.log(param)
        handleSaveAll(param)
        Toast.fire({
          icon: "success",
          title: "Post is successfully"
        }); 
        navigate('/po')
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
      {name: "NAMA BARANG", uid: "nama_barang", sortable: true},
      {name: "NO PPB", uid: "no_ppb", sortable: true},
      {name: "KODE", uid: "kode", sortable: true},
      {name: "SPESIFIKASI", uid: "spesifikasi", sortable: true},
      {name: "PROJECT & CUSTOMER", uid: "project_and_customer", sortable: true},
      {name: "ACTIONS", uid: "actions", headerClassName:'text-end'},
    ];


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

    // const payloadItems = {
    //   ppb_detail_ids: details
    //     .filter(row => row.ppb_detail_id !== null) // Hanya masukkan yang tidak null
    //     .map(row => row.ppb_detail_id)
    // };

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
      setDetails(details.map((row, i) => i === indexNow ? { ...row, item: data.nama_barang, ppb_detail_id: (data.id).toString(), no_ppb: data.no_ppb } : row));
      setIsModalOpenItems(false)
    }

    const handlePrint = () => {
      navigate('/printPO/' + param);
    }

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
              <div className="flex w-full flex-wrap md:flex-nowrap p-2" >
                  <Button className="bg-green-300" onClick={onSubmit} hidden={disabledView}>
                    Save
                  </Button>
                  <Button className="bg-green-300" onClick={handlePost} hidden={!disabledView || poData.status !== 'Draft' && poData.status !== 'Returned'}>
                    Post
                  </Button>
                  <Button className="bg-green-300" onClick={handlePrint} hidden={poData.status !== 'Done'}>
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
                      // ref={dateRef}
                      variant="bordered"
                      className="bg-white "
                      type="text"
                      defaultValue={poData.tanggal}
                      label="PO Date"
                      isInvalid={message?.tanggal != null}
                      errorMessage={message?.tanggal}
                      isDisabled={true}
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
                      isDisabled={true}
                    />
                  </div>
                  <div  className="xl:w-2/4 w-full"></div>
                  <div  className="xl:w-1/10 w-full p-4" hidden={poData.status === ''}>
                    <p id="status" >
                      Status : {poData.status}
                    </p>
                  </div>
                  <div  className="flex p-2 xl:w-1/2 w-full">
                    <div className='pe-2 w-1/6'hidden={disabledView}>
                        <Button onPress={handleOpenModalVendor} className='border-gray-500 w-full h-14'><SearchIcon/></Button>
                    </div>
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
                        isDisabled={disabledView}
                        isReadOnly={true}
                      />  
                    <Modal isOpen={isModalVendor} onOpenChange={handleCloseModalVendor} size='4xl'>
                        <ModalContent>
                          {(onClose) => (
                            <>
                              <ModalHeader className="flex flex-col gap-1">Select Vendor</ModalHeader>
                              <ModalBody>
                                <TableSelect columns={columnsCompanies} apiname={'companiesSelect'} handleAction={handleVendor}>
                                </TableSelect>
                              </ModalBody>
                            </>
                          )}
                        </ModalContent>
                      </Modal>
                  </div>
                  <div  className="flex p-2 xl:w-1/2 w-full">
                    <div className='pe-2 w-1/6'hidden={disabledView}>
                        <Button onPress={handleOpenModalShipTo} className='border-gray-500 w-full h-14'><SearchIcon/></Button>
                    </div>
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
                        isDisabled={disabledView}
                        isReadOnly={true}
                      /> 
                    <Modal isOpen={isModalShipTo} onOpenChange={handleCloseModalShipTo} size='4xl'>
                        <ModalContent>
                          {(onClose) => (
                            <>
                              <ModalHeader className="flex flex-col gap-1">Select Ship To</ModalHeader>
                              <ModalBody>
                                <TableSelect columns={columnsCompanies} apiname={'companiesSelect'} handleAction={handleShipTo}>
                                </TableSelect>
                              </ModalBody>
                            </>
                          )}
                        </ModalContent>
                      </Modal>
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
                      isDisabled={disabledView}
                      onChange={(e) => setPoData({ ...poData, terms: e.target.value })}
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
                      isDisabled={disabledView}
                      onChange={(e) => setPoData({ ...poData, ship_via: e.target.value })}
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
                      isDisabled={disabledView}
                      onChange={(e) => setPoData({ ...poData, expected_date: e.target.value })}
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
                      isDisabled={disabledView}
                      onChange={(e) => setPoData({ ...poData, currency: e.target.value })}
                    />
                  </div>
                </div>
                <br />
                <Table aria-label="Example static collection table" className='p-2'>
                <TableHeader>
                    <TableColumn className='w-15/100'>ITEM</TableColumn>
                    <TableColumn className='w-15/100'>DESCRIPTION</TableColumn>
                    <TableColumn className='w-1/13'>QTY</TableColumn>
                    <TableColumn className='w-1/10'>UNIT PRICE</TableColumn>
                    <TableColumn className='w-1/13'>DISCOUNT %</TableColumn>
                    <TableColumn className='w-1/10'>AMOUNT</TableColumn>
                    <TableColumn className='w-12/100'>REMARKS</TableColumn>
                    <TableColumn className='w-1/10'>ITEM UNIT</TableColumn>
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
                                    value={item.item} 
                                    aria-label="Item Name"
                                    readOnly
                                    // onChange={(e) => handleInputChangeRow(index, 'item', e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <Textarea 
                                    aria-label="Description"
                                    style={{ fontSize: '12px' }}
                                    isDisabled = {disabledView}
                                    type="text" 
                                    variant='bordered' 
                                    value={item.description} 
                                    onChange={(e) => handleInputChangeRow(index, 'description', e.target.value)}
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
                                    onBlur={() => handleOnBlur(index)}
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    aria-label="Unit Price"
                                    style={{ fontSize: '12px' }}
                                    isDisabled = {disabledView}
                                    type="text" 
                                    variant='bordered' 
                                    value={item.unit_price} 
                                    onChange={(e) => handleInputChangeRow(index, 'unit_price', e.target.value)}
                                    onBlur={() => handleOnBlur(index)}
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    aria-label="Discount"
                                    style={{ fontSize: '12px' }}
                                    isDisabled = {disabledView} 
                                    type="text"
                                    variant='bordered' 
                                    value={item.discount} 
                                    onChange={(e) => handleInputChangeRow(index, 'discount', e.target.value)}
                                    onBlur={() => handleOnBlur(index)}
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    aria-label="Amount"
                                    style={{ fontSize: '12px' }}
                                    isDisabled = {true} 
                                    type="text" 
                                    variant='bordered' 
                                    value={item.amount}
                                    onChange={(e) => handleInputChangeRow(index, 'amount', e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <Textarea
                                    aria-label="Remarks"
                                    style={{ fontSize: '12px' }}
                                    isDisabled = {disabledView} 
                                    type="text" 
                                    variant='bordered' 
                                    value={item.remarks} 
                                    onChange={(e) => handleInputChangeRow(index, 'remarks', e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                                {/* <Input
                                    isDisabled = {disabledView} 
                                    type="text" 
                                    variant='bordered' 
                                    value={item.item_unit} 
                                    onChange={(e) => handleInputChangeRow(index, 'item_unit', e.target.value)}
                                /> */}

                                <Select
                                  aria-label="Item Unit"
                                  variant='bordered'
                                  items={item_units_selects}
                                  placeholder="Select"
                                  className="max-w-xs"
                                  value={item.item_unit}
                                  onChange={(e) => handleInputChangeRow(index, 'item_unit', e.target.value)}
                                  isDisabled = {disabledView} 
                                  defaultSelectedKeys={[item.item_unit]}
                                >
                                  {item_units_selects.map((item_units_select) => (
                                    <SelectItem
                                      key={item_units_select.key}
                                      value={item_units_select.key} // Use 'key' as 'value'
                                    >
                                      {item_units_select.label}
                                    </SelectItem>
                                  ))}
                                </Select>
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

                <div className='flex justify-between'>
                  <div className='w-3/5'>
                    <div  className=" p-2 w-full">
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
                      isDisabled={true}
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
                      onChange={(e) => setPoData({ ...poData, description: e.target.value })}
                      isDisabled={disabledView}
                    />
                    </div>
                  </div>
                  <div className='w-2/5'>
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
                      isDisabled={true}
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
                      isDisabled = {disabledView}
                      onChange={(e) => handleInputChange('discount',e.target.value)} 
                      onBlur={() => handleOnBlur2()}
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
                      isDisabled = {disabledView}
                      onChange={(e) => handleInputChange('freight_cost',e.target.value)}
                      onBlur={() => handleOnBlur2()}
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
                      isDisabled={true}
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
                      isDisabled={true}
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
                        defaultValue={poData.verified_by|| ''}
                        value={poData.verified_by|| ''}
                        label="Verified By"
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
                      <div className='pe-2'hidden={disabledView}>
                        <Button onPress={handleOpenModalApprovedBy} className='border-gray-500 w-1/20 h-14'><SearchIcon/></Button>
                      </div>
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
                        isDisabled={disabledView}
                        isReadOnly={true}
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
                    <div className='flex p-4 w-1/4' hidden={poData.status === 'Draft' || poData.status === ''}>
                        <p id="status" >
                          Status : {poData.approved_by_status}
                        </p>
                        <p id="date" hidden={poData.approved_by_date == null}>
                            / Date : {poData.approved_by_date}
                        </p>
                    </div>
                  </div>
                  
                  <hr hidden = {poData.remarks == null || param =='new'}></hr>
                  <div className='flex' hidden = {poData.remarks == null || param =='new'}>
                    <div  className=" p-2 xl:w-2/4 w-full">
                      <Textarea
                      id="remarks"
                      variant="bordered"
                      className="bg-white "
                      type="text"
                      defaultValue={poData.remarks}
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
                <TableSelect columns={columnsItems} apiname={'ppbDetailSelect'} payload={payloadItems} handleAction={(data) => handleItems(data)}>
                </TableSelect>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
