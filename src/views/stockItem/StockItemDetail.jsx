import { Link, Navigate, redirect, useParams } from 'react-router-dom'
import axiosClient from '../../axios-client.js'
import { createRef } from 'react'
import { useState, useEffect } from 'react'
import { useStateContext } from '../../contexts/ContextProvider.jsx'
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
    ScrollShadow,
  } from '@nextui-org/react'
  import { SearchIcon } from '../../assets/SearchIcon'
  import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";
// import { Input } from 'mdb-react-ui-kit'

export default function StockItemDetail() {
  const nameRef = createRef()
  const faxRef = createRef()
  const telephoneRef = createRef()
  const [errors, setErrors] = useState(false);
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()
  const { param,param2 } = useParams()
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [hidePass, setHidePass] = useState(false)
  const [disabledView, setDisabledView ] = useState(false)
  const [prinsipal_selects, setPrinsipalSelects] = useState([])
  const [stockItemData, setStockItemData] = useState({
    stock_name: null,
    tipe: null,
    prinsipal: null,
    prinsipal_id: null,
    quantity: null,
  })

  const [details, setDetails] = useState([]);

  // const history = useHistory();
  useEffect(() => {
    if (param != 'new') {
        getStockItem()
      setHidePass(true)
    }
    if (param2 == 'view') {
        getStockItem()
      setDisabledView(true)
    }
    getItems();
    getPrinsipalSelect();

  }, [])

  const getStockItem = () => {
    setLoading(true)
    axiosClient
      .get('/stockitem/' + param)
      .then(({ data }) => {
        setStockItemData({
            stock_name: data.data.stock_name,
            tipe: data.data.tipe,
            prinsipal: data.data.prinsipal,
            prinsipal_id: data.data.prinsipal_id,
            quantity: data.data.quantity,
        })
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const getItems = () => {
    setLoading2(true);
    axiosClient
      .get('/itembystock/' + param)
      .then(({ data }) => {
        console.log(data)
        setDetails(data.data);
        setLoading2(false)
      })
      .catch(() => {
        setLoading2(false)
      })
  }

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

  const btnBack = () => [navigate('/stockitem')]

  return (
    <div className="bg-white p-4 rounded-large animated fadeInDown">
      <div className="flex-col items-center">
        <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid grey' }}>
          <h1>View Stock Item</h1>
          <Button className="bg-red-300" onClick={btnBack}>
            Back
          </Button>
        </div>
        <form className='pt-8' >
          {loading && (
            <div className="row">
              <div className="col-md-12 mb-12 text-center">Loading...</div>
            </div>
          )}
          {!loading && (
            <div className="w-full flex-wrap md:flex-nowrap">
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
                          isDisabled={disabledView}
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
                          isDisabled={disabledView}
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

              <div className='flex'>
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
                <div  className=" p-2 xl:w-1/4 w-full">
                    <Input
                    id="quantity"
                    variant="bordered"
                    className="bg-white "
                    type="text"
                    value={stockItemData.quantity}
                    label="Quantity"
                    isInvalid={message?.quantity != null}
                    errorMessage={message?.quantity}
                    isDisabled={disabledView || stockItemData.is_exist === 'ya'}
                    onChange={(e) => setStockItemData({ ...stockItemData, quantity: e.target.value })}
                />
                </div>
              </div>
            

              <br />

                <Table aria-label="Example static collection table" 
                classNames={{
                  // base: "min-w-[100%] max-w-[100%] overflow-x-scroll",
                  table: "min-w-[120%] overflow-x-scroll",
                }}
                >
                  <TableHeader >
                      <TableColumn className='w-15/100'>ITEM NAME</TableColumn>
                      <TableColumn className='w-1/10'>DESCRIPTION</TableColumn>
                      <TableColumn className='w-1/10'>NO EDP</TableColumn>
                      <TableColumn className='w-1/10'>NO S/N</TableColumn>
                      <TableColumn className='w-1/10'>ARRIVAL DATE</TableColumn>
                      <TableColumn className='w-1/20'>IN STOCK?</TableColumn>
                      <TableColumn className='w-1/10'>LEAVING DATE</TableColumn>
                      <TableColumn className='w-1/10'>NO PO</TableColumn>
                      <TableColumn className='w-1/10'>REMARKS</TableColumn>
                      <TableColumn className='w-1/10'>RECEIVER</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent={"No Data found"} items={details} isLoading={loading2} loadingContent={<Spinner label="Loading..." />}>
                      {details.map((item,index) => (
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
                                      // isInvalid={message?.item_name != null}
                                      // errorMessage={message?.item_name}
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
                                      // isInvalid={message?.description != null}
                                      // errorMessage={message?.description}
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
                                      // isInvalid={errorMessages[index]?.no_edp != null} // Validasi dengan cek apakah ada pesan error
                                      // errorMessage={errorMessages[index]?.no_edp} // Tampilkan pesan error jika ada
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
                                      // isInvalid={errorMessages[index]?.no_sn != null} // Validasi dengan cek apakah ada pesan error
                                      // errorMessage={errorMessages[index]?.no_sn} // Tampilkan pesan error jika ada
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
                                      aria-label="In Stock?"
                                      style={{ fontSize: '12px' }}
                                      isDisabled = {disabledView}
                                      type="text" 
                                      variant='bordered' 
                                      value={item.is_in_stock == '1'? 'Yes': item.is_in_stock == '0'? 'No': 'N/A'} 
                                      onChange={(e) => handleInputChangeRow(index, 'is_in_stock', e.target.value)}
                                  />
                              </TableCell>
                              <TableCell>
                                  <Input
                                      aria-label="Leaving Date"
                                      style={{ fontSize: '12px' }}
                                      isDisabled = {disabledView} 
                                      type="date"
                                      variant='bordered' 
                                      value={item.leaving_date} 
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
                              <TableCell>
                                  <Input
                                      aria-label="Receiver"
                                      style={{ fontSize: '12px' }}
                                      isDisabled = {true} 
                                      type="text" 
                                      variant='bordered' 
                                      value={item.receiver}
                                      readOnly
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
    </div>
    
  )
}
