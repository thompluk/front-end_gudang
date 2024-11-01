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

export default function PengembalianBarangUmumDetail() {
  const navigate = useNavigate()
  const [indexNow, setIndexNow] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const { param,param2 } = useParams()
  const [message, setMessage] = useState(null)
  const [disabledView, setDisabledView ] = useState(false)
  const [isModalSuratJalan, setIsModalOpenSuratJalan] = useState(false);

  const handleOpenModalSuratJalan = () => setIsModalOpenSuratJalan(true);
  const handleCloseModalSuratJalan = () => setIsModalOpenSuratJalan(false);


  const [pengembalianBarangData, setPengembalianBarangData] = useState({
    status: '',
    surat_jalan_id: '',
    no_surat_jalan: '', 
    penerima: '',
    penerima_id: '',
    penerima_date: '',
  })

  const [details, setDetails] = useState([]);
//   const [defaultdetails, setDefaultDetails] = useState([]);
  const [defaultSuratJalanId, setDefaultSuratJalanId] = useState(null);


  const btnBack = () => [
    navigate('/pengembalianbarangumum')
  ]


  useEffect(() => {

    if (param != 'new') {
      getDetails();
      getPengembalianBarang();
    }
    if (param2 == 'view') {
      setDisabledView(true)
    }

  }, [])

  
  const getPengembalianBarang = () => {
    setLoading(true)
    axiosClient
      .get('/pengembalianbarang/' + param)
      .then(({ data }) => {
        console.log(data.data)
        setPengembalianBarangData({
            status: data.data.status,
            surat_jalan_id: data.data.surat_jalan_id,
            no_surat_jalan: data.data.no_surat_jalan, 
            penerima: data.data.penerima,
            penerima_id: data.data.penerima_id,
            penerima_date: data.data.penerima_date,
        });
        setDefaultSuratJalanId(data.data.surat_jalan_id);
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const getDetails = () => {

    setLoading2(true);

    axiosClient
      .get('/pengembalianbarangdetaillist/'+ param)
      .then(({ data }) => {
        setDetails(data.data);
        // setDefaultDetails(data.data);
        setLoading2(false);
      })
      .catch(() => {
        setLoading2(false);
      })
  }


  const handleInputChangeRow = (index, field, value) => {
    setDetails(details.map((row, i) => i === index ? { ...row, [field]: value } : row));
  };
    
  return (
    <div className="bg-white p-4 rounded-large animated fadeInDown">
      <div className="flex-col items-center">
        <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid grey' }}>
          <h1>View Pengembalian Barang Umum</h1>
          <Button className="bg-red-300" onClick={btnBack}>
            Back
          </Button>
          {/* <Button className="bg-yellow-300" onClick={btnCheckDetails}>
            Check
          </Button> */}
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
                  <div  className=" p-2 xl:w-1/5 w-full"></div>
                  <div  className=" p-2 xl:w-3/5 w-full"></div>
                  <div  className="xl:w-1/5 w-full p-4" hidden={pengembalianBarangData.status === ''}>
                    <p id="status" >    
                      Status : {pengembalianBarangData.status}
                    </p>
                  </div>
                  
                    <div className="flex flex-col p-2 xl:w-full w-full">
                        <div  className="flex xl:w-1/4 w-full">
                            <Input
                                id="no_surat_jalan"
                                variant="bordered"
                                className="bg-white "
                                type="text"
                                value={pengembalianBarangData.no_surat_jalan}
                                label="No. Surat Jalan"
                                isDisabled={disabledView}
                                readOnly
                            />
                        </div>
                    </div>
                  
                </div>
                <br />
                <Table aria-label="Example static collection table" className='p-2'>
                    <TableHeader>
                        <TableColumn className='w-1/5'>PART NO.</TableColumn>
                        <TableColumn className='w-1/5'>NAMA BARANG</TableColumn>
                        <TableColumn className='w-1/5'>QTY DIKIRIM</TableColumn>
                        <TableColumn className='w-1/5'>QTY DIKEMBALIKAN</TableColumn>
                        <TableColumn className='w-1/5'>KETERANGAN</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"No Data found"} items={details} isLoading={loading2} loadingContent={<Spinner label="Loading..." />}>
                        {details.map((item,index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    {item.stock_material_id}
                                </TableCell>
                                <TableCell>
                                    {item.nama_barang}
                                </TableCell>
                                <TableCell>
                                    {item.quantity_dikirim}
                                </TableCell>
                                <TableCell>
                                    <Input
                                        aria-label="Quantity Dikembaliakn"
                                        style={{ fontSize: '12px' }}
                                        isDisabled = {disabledView}
                                        type="text" 
                                        variant='bordered' 
                                        value={item.quantity_dikembalikan} 
                                        onChange={(e) => handleInputChangeRow(index, 'quantity_dikembalikan', e.target.value)}
                                    />
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className='flex'>
                    <div  className=" p-2 xl:w-1/4 w-full">
                      <Input
                      id="penerima"
                      // ref={prepared_byRef}
                      variant="bordered"
                      className="bg-white "
                      type="text"
                      defaultValue={pengembalianBarangData.penerima}
                      label="Penerima"
                      isInvalid={message?.penerima != null}
                      errorMessage={message?.penerima}
                      isDisabled={true}
                    />
                    </div>
                    <div className='flex p-2 w-1/4'>
                        <Input
                        id="penerima_date"
                        // ref={prepared_byRef}
                        variant="bordered"
                        className="bg-white "
                        type="date"
                        defaultValue={pengembalianBarangData.penerima_date}
                        label="Tanggal"
                        isInvalid={message?.penerima_date != null}
                        errorMessage={message?.penerima_date}
                        isDisabled={true}
                        />
                    </div>
                  </div>
              </div>
              )}
          </div>
      </div>
    </div>
  )
}
