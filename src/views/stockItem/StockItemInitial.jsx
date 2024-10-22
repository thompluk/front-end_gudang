// import { Link, Navigate, redirect, useParams } from 'react-router-dom'
// import axiosClient from '../../axios-client.js'
// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import {
//     Button,
//   } from '@nextui-org/react'
// import StockItemArrival from './StockItemArrival.jsx'
// import { render } from 'react-dom'
// import { Input } from 'mdb-react-ui-kit'

import { Link, Navigate, redirect, useParams } from 'react-router-dom'
import axiosClient from '../../axios-client.js'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  import { SearchIcon } from '../../assets/SearchIcon'
  import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";
import TableSelect from '../../custom/TableSelect.jsx'
import Swal from 'sweetalert2'

export default function StockItemInitial() {
  const navigate = useNavigate()
  const { param,param2 } = useParams()
  const [loading, setLoading] = useState(false)

  const [detail, setDetails] = useState([[]]);

  useEffect(() => {
    
    getStockItem()
    // getStocks()
  }, [])


const getStockItem = () => {

    setLoading(true);

    axiosClient
        .get('/po/arrivalData/' + param2)
        .then(({ data }) => {
            // Pastikan data.data adalah array
            const rawDetails = data.data; // Ambil data mentah
            console.log(rawDetails);
            setDetails(rawDetails);
            setLoading(false);
        })
        .catch(() => {
            setLoading(false);
        });
  }

  const btnBack = () => [navigate('/podelivery/'+ param + '/view')]


  //-------------------------------------------------------------------------------

  const [message, setMessage] = useState(null)
  const [errorMessages, setErrorMessages] = useState([]);
  const [errors, setErrors] = useState(false);
  // const navigate = useNavigate()
  // const { param,param2 } = useParams()
  // const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [hidePass, setHidePass] = useState(false)
  const [disabledView, setDisabledView ] = useState(false)
  const [prinsipal_selects, setPrinsipalSelects] = useState([])
  const [isModalStock, setIsModalOpenStock] = useState(false);

  const handleOpenModalStock = () => setIsModalOpenStock(true);
  const handleCloseModalStock = () => setIsModalOpenStock(false);

  const [stockItemData, setStockItemData] = useState({
    is_exist: 'ya',
    stock_id: null,
    stock_name: null,
    tipe: null,
    prinsipal: null,
    prinsipal_id: null,
    quantity: null,
  })

  useEffect(() => {
    
    // getStockItem()
    // setDetails(details);
    getPrinsipalSelect()
    
  }, [])

  const getPrinsipalSelect = () => {
    // setLoading(true)
    axiosClient
      .get('/allprinsipal')
      .then(({ data }) => {
        // setLoading(false)
        setPrinsipalSelects(data.data)
      })
      .catch(() => {
        // setLoading(false)
      })
  }

  const handleInputChangeRow = (index, field, value) => {
    setDetails(detail.map((row, i) => i === index ? { ...row, [field]: value } : row));
  };

  const handleStock = (data) => {
    console.log(data)
    if (data.tipe === 'LOKAL') {
      setStockItemData({ ...stockItemData, stock_id: (data.id).toString(), tipe: data.tipe, prinsipal: data.prinsipal, stock_name: data.stock_name });
    }else{
      setStockItemData({ ...stockItemData, stock_id: (data.id).toString(), tipe: data.tipe, prinsipal_id: (data.prinsipal_id).toString(), prinsipal: data.prinsipal, stock_name: data.stock_name });
    }
    setIsModalOpenStock(false)
  }

  const columnsStock = [
    {name: "STOCK NAME", uid: "stock_name", sortable: true},
    {name: "TIPE", uid: "tipe", sortable: true},
    {name: "PRINSIPAL", uid: "prinsipal", sortable: true},
    {name: "QUANTITY", uid: "quantity", sortable: true},
    {name: "ACTIONS", uid: "actions", headerClassName:'text-end'},
  ];

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

  const parseErrors = (errors) => {
    return Object.keys(errors).reduce((acc, key) => {
      const [detail, index, field] = key.split('.'); // Ambil indeks dan field dari kunci
      if (!acc[index]) acc[index] = {}; // Jika belum ada, buat objek kosong
      acc[index][field] = errors[key][0]; // Set pesan kesalahan sesuai field
      return acc;
    }, []);
  };

  const parseErrors2 = (errors) => {
    return Object.keys(errors).reduce((acc, key) => {
      const index = parseInt(key.split('.')[0], 10); // Ambil indeks dari kunci
      if (!acc[index]) acc[index] = {}; // Jika belum ada, buat objek kosong
      acc[index][key.split('.')[1]] = errors[key][0]; // Set pesan kesalahan
      return acc;
    }, []);
  }

  const handleSaveAll = (stock_id) => {
    axiosClient.post('/itemsaveAll/'+stock_id+'/'+detail[0].po_detail_id, detail)
          .then(response => {
              // Handle successful save
              Toast.fire({
                icon: "success",
                title: "Create is successfully"
                }); 
              arrived()
              navigate('/podelivery/'+ param + '/view')
          })
          .catch(err => {
              // Handle error
                const response = err.response
                const errors = parseErrors2(response.data.errors);
                setErrorMessages(errors); 
                if (response && response.status === 422) {
                    console.log(message) ;

                    // Swal.fire({
                    //     icon: "error",
                    //     title: "Oops...",
                    //     text: response.data.message,
                    // });
                }

          });
  };

  const post = () => {
    const payload = {
      stock_name: stockItemData.stock_name,
      tipe: stockItemData.tipe,
      prinsipal: stockItemData.prinsipal,
      prinsipal_id: stockItemData.prinsipal_id,
      quantity: detail.length,
      detail: detail
    }
    console.log(payload)
    if (stockItemData.stock_id === null) {
        axiosClient
        .post('/stockiteminit/'+ detail[0].po_detail_id, payload)
        .then(({data}) => {
            console.log(data.data.id)
            Toast.fire({
              icon: "success",
              title: "Create is successfully"
              }); 
            arrived()
            navigate('/podelivery/'+ param + '/view')
        })
        .catch(err => {
            const response = err.response
            setMessage(response.data.message);
            setErrors(true);
            const errors = parseErrors(response.data.message);
            setErrorMessages(errors);
            if (response && response.status === 400) {
            // Swal.fire({
            //     icon: "error",
            //     title: "Oops...",
            //     text: response.data.message,
            //     // footer: '<a href="#">Why do I have this issue?</a>'
            // });
            }
        })   
    }else{
        handleSaveAll(stockItemData.stock_id)
    }
    
  }

  const arrived = () => {
    axiosClient
    .post('/po/arrived/' + param)
    .then(({}) => {
    })
    .catch(err => {
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
      confirmButtonText: "Yes, Save it!"
    }).then((result) => {
      if (result.isConfirmed) {
        post();
      }
    });
  };

  //-------------------------------------------------------------------------------

  return (
    <div>
    {loading && (
      <div className="row">
        <div className="col-md-12 mb-12 text-center">Loading...</div>
      </div>
    )}
    {!loading && (
      <div className="bg-white p-4 rounded-large animated fadeInDown">
        <div className="flex-col items-center">
          <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid grey' }}>
            <h1>Stock Item Arrival</h1>
            <Button className="bg-red-300" onClick={btnBack}>
              Back
            </Button>
          </div>
          <form className='pt-8'>
              <div className=" w-full flex-wrap md:flex-nowrap">
                {/* <div className="relative flex justify-center items-center"> */}
                    <div className="flex-col items-center">
                      <div className="flex items-center">
                        <Button className="bg-green-300" onClick={handlePost}>
                          Post
                        </Button>
                      </div>
                      <form className='pt-8'>
                        {loading && (
                          <div className="row">
                          <div className="col-md-12 mb-12 text-center">Loading...</div>
                          </div>
                        )}
                        {!loading && (
                          
                          <div className=" w-full flex-wrap md:flex-nowrap">
                            <div  className=" p-2 xl:w-full w-full">
                              <RadioGroup
                                  label="Apakah Stock Item sudah ada?"
                                  orientation="horizontal"
                                  value={stockItemData.is_exist}  // Nilai yang sesuai dengan Radio
                                  onChange={(event) => setStockItemData({ ...stockItemData, is_exist: event.target.value, tipe: null, prinsipal: null, prinsipal_id: null, stock_name: '', stock_id: null })} // Update state saat value berubah
                              >
                                  <Radio value="ya">Ya</Radio>
                                  <Radio value="tidak">Tidak</Radio>
                              </RadioGroup>
                            </div>
                            
                            <div  className="flex p-2 xl:w-1/4 w-full" hidden={stockItemData.is_exist === 'tidak'}>
                                <div className='pe-2'hidden={disabledView}>
                                    <Button onPress={handleOpenModalStock} className='border-gray-500 w-full h-14'><SearchIcon/></Button>
                                </div>
                                <Input
                                    id="stock_id"
                                    variant="bordered"
                                    className="bg-white "
                                    type="text"
                                    value={stockItemData.stock_id}
                                    label="Stock ID"
                                    isInvalid={message?.stock_id != null}
                                    errorMessage={message?.stock_id}
                                    isDisabled={disabledView}
                                    onChange={(e) => setStockItemData({ ...stockItemData, stock_id: e.target.value })}
                                    hidden={stockItemData.is_exist === 'tidak'}
                                    readOnly
                                />
                                    <Modal isOpen={isModalStock} onOpenChange={handleCloseModalStock} size='4xl'>
                                    <ModalContent>
                                      {(onClose) => (
                                        <>
                                          <ModalHeader className="flex flex-col gap-1">Select Stock Item</ModalHeader>
                                          <ModalBody>
                                            <TableSelect columns={columnsStock} apiname={'stockitemselect'} handleAction={handleStock}>
                                            </TableSelect>
                                          </ModalBody>
                                        </>
                                      )}
                                    </ModalContent>
                                  </Modal>
                            </div>

                            <div  className="flex w-full">
                                <div  className=" p-2 xl:w-1/4 w-full">
                                    <Select
                                        label="Tipe"
                                        placeholder="Select an tipe"
                                        className="bg-white"
                                        variant="bordered"
                                        value={stockItemData.tipe}
                                        selectedKeys={new Set([stockItemData.tipe])}
                                        onSelectionChange={(keys) => setStockItemData({ ...stockItemData, tipe: [...keys][0] })}
                                        isInvalid={message?.tipe != null}
                                        errorMessage={message?.tipe}
                                        isDisabled={disabledView || stockItemData.is_exist === 'ya'}
                                    >
                                        <SelectItem key="PRINSIPAL">PRINSIPAL</SelectItem>
                                        <SelectItem key="LOKAL">LOKAL</SelectItem>
                                    </Select>
                                </div>

                                <div  className=" p-2 xl:w-1/4 w-full">
                                    <Select
                                        label="Prinsipal"
                                        placeholder="Select an tipe"
                                        className="bg-white"
                                        variant="bordered"
                                        value={stockItemData.prinsipal}
                                        selectedKeys={new Set([stockItemData.prinsipal])}
                                        onSelectionChange={(keys) => setStockItemData({ ...stockItemData, prinsipal: [...keys][0], prinsipal_id: prinsipal_selects.find((prinsipal) => prinsipal.name === [...keys][0]).id })}
                                        isInvalid={message?.prinsipal != null}
                                        errorMessage={message?.prinsipal}
                                        isDisabled={disabledView || stockItemData.is_exist === 'ya'}
                                        items={prinsipal_selects}
                                        hidden={stockItemData.tipe !== 'PRINSIPAL'}
                                    >
                                        {prinsipal_selects.map((prinsipal_select) => (
                                                <SelectItem
                                                  key={prinsipal_select.name}
                                                  value={prinsipal_select.name} // Use 'key' as 'value'
                                                >
                                                  {prinsipal_select.name}
                                                </SelectItem>
                                              ))}
                                    </Select>
                                </div>
                            </div>
                          
                            <div  className=" p-2 xl:w-1/4 w-full">
                                <Input
                                id="stock_name"
                                variant="bordered"
                                className="bg-white "
                                type="text"
                                value={stockItemData.stock_name}
                                label="Stock Name"
                                isInvalid={message?.stock_name != null}
                                errorMessage={message?.stock_name}
                                isDisabled={disabledView || stockItemData.is_exist === 'ya'}
                                onChange={(e) => setStockItemData({ ...stockItemData, stock_name: e.target.value })}
                            />
                            </div>

                            <br />
                              <Table aria-label="Example static collection table" className='p-2'>
                              <TableHeader>
                                  <TableColumn className='w-2/10'>ITEM NAME</TableColumn>
                                  <TableColumn className='w-1/10'>DESCRIPTION</TableColumn>
                                  <TableColumn className='w-1/10'>NO EDP</TableColumn>
                                  <TableColumn className='w-1/10'>NO S/N</TableColumn>
                                  <TableColumn className='w-1/10'>ARRIVAL DATE</TableColumn>
                                  <TableColumn className='w-1/10'>NO PO</TableColumn>
                                  <TableColumn className='w-1/10'>REMARKS</TableColumn>
                              </TableHeader>
                              <TableBody emptyContent={"No Data found"} items={detail} isLoading={loading2} loadingContent={<Spinner label="Loading..." />}>
                                  {detail.map((item,index) => (
                                      <TableRow key={index}>
                                          <TableCell>
                                              <Input
                                                  style={{ fontSize: '12px' }}
                                                  isDisabled = {disabledView}
                                                  type="text" 
                                                  variant='bordered' 
                                                  value={item.item_name} 
                                                  aria-label="Item Name"
                                                  readOnly
                                                  onChange={(e) => handleInputChangeRow(index, 'item', e.target.value)}
                                                  isInvalid={message?.item_name != null}
                                                  errorMessage={message?.item_name}
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
                                                  isInvalid={message?.description != null}
                                                  errorMessage={message?.description}
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
                                                  onChange={(e) => handleInputChangeRow(index, 'no_edp', e.target.value)}
                                                  // isInvalid={message?.[`${index}.no_edp`] != null}
                                                  // errorMessage={message?.[`${index}.no_edp`]}
                                                  // isInvalid={errorMessages[index] && errorMessages[index].no_edp != null}
                                                  // errorMessage={errorMessages[index] && errorMessages[index].no_edp}
                                                  isInvalid={errorMessages[index]?.no_edp != null} // Validasi dengan cek apakah ada pesan error
                                                  errorMessage={errorMessages[index]?.no_edp} // Tampilkan pesan error jika ada
                                              />
                                          </TableCell>
                                          <TableCell>
                                              <Input
                                                  aria-label="No S/N"
                                                  style={{ fontSize: '12px' }}
                                                  isDisabled = {disabledView}
                                                  type="text" 
                                                  variant='bordered' 
                                                  value={item.no_sn} 
                                                  onChange={(e) => handleInputChangeRow(index, 'no_sn', e.target.value)}
                                                  // isInvalid={errorMessages[index] && errorMessages[index].no_sn != null}
                                                  // errorMessage={errorMessages[index] && errorMessages[index].no_sn}
                                                  isInvalid={errorMessages[index]?.no_sn != null} // Validasi dengan cek apakah ada pesan error
                                                  errorMessage={errorMessages[index]?.no_sn} // Tampilkan pesan error jika ada
                                              />
                                          </TableCell>
                                          <TableCell>
                                              <Input
                                                  aria-label="Arrival Date"
                                                  style={{ fontSize: '12px' }}
                                                  isDisabled = {disabledView} 
                                                  type="date"
                                                  variant='bordered' 
                                                  value={item.arrival_date} 
                                                  readOnly
                                              />
                                          </TableCell>
                                          <TableCell>
                                              <Input
                                                  aria-label="No PO"
                                                  style={{ fontSize: '12px' }}
                                                  isDisabled = {true} 
                                                  type="text" 
                                                  variant='bordered' 
                                                  value={item.no_po}
                                                  readOnly
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
                                                  isInvalid={message?.remarks != null}
                                                  errorMessage={message?.remarks}
                                              />
                                          </TableCell>
                                      </TableRow>
                                  ))}
                              </TableBody>
                              
                              </Table>
                          </div>
                        )}
                      </form>
                    </div>
                {/* </div> */}
              </div>
          </form>
        </div>
      </div>
    )}
    </div>
    
  )
}
