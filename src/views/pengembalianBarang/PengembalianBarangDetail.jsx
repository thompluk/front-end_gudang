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

export default function PengembalianBarangDetail() {
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
    navigate('/pengembalianBarang')
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

  const getDetailsChange = (surat_jalan_id) => {

    setLoading2(true);

    axiosClient
      .get('/showbyidforpengembalian/'+ surat_jalan_id)
      .then(({ data }) => {
        setDetails(data.data);
        setLoading2(false);
      })
      .catch(() => {
        setLoading2(false);
      })
  }


  const handleInputChangeRow = (index, field, value) => {
    setDetails(details.map((row, i) => i === index ? { ...row, [field]: value } : row));
  };

  const handleInputChange = (field, value) => {
    setPengembalianBarangData((prevData) => ({
      ...prevData, 
      [field]: value  
    }));


  };

  // setDetails({ ...details, item: data.nama_barang, ppb_detail_id: (data.id).toString(), no_ppb: data.no_ppb });

    const handleSaveAll = (pengembalian_barang_id) => {
      axiosClient.post('/pengembalianbarangsaveAll/'+pengembalian_barang_id, details)
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
        no_surat_jalan: pengembalianBarangData.no_surat_jalan,
        surat_jalan_id: pengembalianBarangData.surat_jalan_id,
      }
      if (param == 'new') {
        axiosClient
          .post('/pengembalianbarang', payload)
          .then(({data}) => {
            console.log(data.data.id)
            handleSaveAll(data.data.id)
            Toast.fire({
              icon: "success",
              title: "Create is successfully"
            });  
            navigate('/pengembalianbarang')
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
          .put('/pengembalianbarang/update/' + param, payload)
          .then(({}) => {
            console.log(param)
            handleSaveAll(param)
            Toast.fire({
              icon: "success",
              title: "Update is successfully"
            });  
            navigate('/pengembalianbarang')
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
      .post('/pengembalianbarang/post/' + param)
      .then(({}) => {
        console.log(param)
        handleSaveAll(param)
        Toast.fire({
          icon: "success",
          title: "Post is successfully"
        }); 
        navigate('/pengembalianbarang')
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

    const columnsSuratJalan = [
        {name: "NO SURAT JALAN", uid: "no_surat_jalan", sortable: true},
        {name: "COMPANY", uid: "company", sortable: true},
        {name: "MENYERAHKAN", uid: "menyerahkan", sortable: true},
        {name: "TANGGAL MENYERAHKAN", uid: "menyerahkan_date", sortable: true},
        {name: "STATUS", uid: "status", sortable: true},
        {name: "ACTIONS", uid: "actions", headerClassName:'text-end'},
      ];
      
    const handleSuratJalan = (data) => {
        if(defaultSuratJalanId != data.id){
            setDetails([])
            getDetailsChange(data.id); 
        }else{
            setDetails([])
            getDetails();
        }
        setPengembalianBarangData((prevData) => ({
          ...prevData,
          no_surat_jalan: data.no_surat_jalan,
          surat_jalan_id: data.id
        }))
        setIsModalOpenSuratJalan(false)
    }
    
    // const btnCheckDetails = () => {
    //   console.log(details)
    // }

  return (
    <div className="bg-white p-4 rounded-large animated fadeInDown">
      <div className="flex-col items-center">
        <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid grey' }}>
          <h1 hidden={param != 'new'}>Create Pengembalian Barang</h1>
          <h1 hidden={param == 'new' || param2 == 'view'}>Edit Pengembalian Barang</h1>
          <h1 hidden={param2 != 'view'}>View Pengembalian Barang</h1>
          <Button className="bg-red-300" onClick={btnBack}>
            Back
          </Button>
          {/* <Button className="bg-yellow-300" onClick={btnCheckDetails}>
            Check
          </Button> */}
        </div>
          <div className="pt-8">
              <div className="flex w-full flex-wrap md:flex-nowrap p-2" >
                  <Button className="bg-green-300" onClick={onSubmit} hidden={disabledView}>
                    Save
                  </Button>
                  <Button className="bg-green-300" onClick={handlePost} hidden={!disabledView || pengembalianBarangData.status !== 'Draft' && pengembalianBarangData.status !== 'Returned'}>
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
                  <div  className=" p-2 xl:w-1/5 w-full"></div>
                  <div  className=" p-2 xl:w-3/5 w-full"></div>
                  <div  className="xl:w-1/5 w-full p-4" hidden={pengembalianBarangData.status === ''}>
                    <p id="status" >    
                      Status : {pengembalianBarangData.status}
                    </p>
                  </div>
                  
                    <div className="flex flex-col p-2 xl:w-full w-full">
                        <div  className="flex xl:w-1/4 w-full">
                            <div className='pe-2'hidden={disabledView}>
                                <Button onPress={handleOpenModalSuratJalan} className='border-gray-500 w-full h-14'><SearchIcon/></Button>
                            </div>
                            <Input
                                id="no_surat_jalan"
                                variant="bordered"
                                className="bg-white "
                                type="text"
                                value={pengembalianBarangData.no_surat_jalan}
                                label="No. Surat Jalan"
                                // isInvalid={message?.stock_id != null}
                                // errorMessage={message?.stock_id}
                                isDisabled={disabledView}
                                // onChange={(e) => setPengembalianBarangData({ ...no_surat_jalan, stock_id: e.target.value })}
                                readOnly
                            />
                            <Modal isOpen={isModalSuratJalan} onOpenChange={handleCloseModalSuratJalan} size='4xl'>
                            <ModalContent>
                                {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Select Surat Jalan</ModalHeader>
                                    <ModalBody>
                                    <TableSelect columns={columnsSuratJalan} apiname={'suratjalanselect'} handleAction={handleSuratJalan}>
                                    </TableSelect>
                                    </ModalBody>
                                </>
                                )}
                            </ModalContent>
                            </Modal>
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
