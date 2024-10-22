import React, { createRef } from 'react'
import { useEffect, useState} from 'react'
import { useNavigate,useParams } from 'react-router-dom'
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
// import { IconButton } from "@material-tailwind/react";

export default function SuratJalanUmumDetail() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const { param,param2 } = useParams()
  const [message, setMessage] = useState(null)
  const [disabledView, setDisabledView ] = useState(false)

  const [suratjalanData, setSuratJalanData] = useState({
    status: '',
    no_surat_jalan: '',
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
    remarks: '',
  })

  const [details, setDetails] = useState([
    {
      id: null,
      surat_jalan_id: null,
      stock_material_id: null,
      nama_barang:null,
      quantity:null,
      keterangan:null,
    }
  ]);


  useEffect(() => {

    getDetails();
    getSuratJalan();
    setDisabledView(true)

  }, [])

  
  const getSuratJalan = () => {
    setLoading(true)
    axiosClient
      .get('/suratjalan/' + param)
      .then(({ data }) => {
        setSuratJalanData({
            status: data.data.status,
            no_surat_jalan: data.data.no_surat_jalan,
            company_id: data.data.company_id,
            company: data.data.company,
            company_address: data.data.company_address,
            company_telephone: data.data.company_telephone,
            company_fax: data.data.company_fax,
            company_email: data.data.company_email,
            menyerahkan_id: data.data.menyerahkan_id,
            menyerahkan: data.data.menyerahkan,
            menyerahkan_date: data.data.menyerahkan_date,
            mengetahui_id: data.data.mengetahui_id,
            mengetahui: data.data.mengetahui,
            mengetahui_status: data.data.mengetahui_status,
            mengetahui_date: data.data.mengetahui_date,
            remarks: data.data.remarks,
        });
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

  const btnBack = () => [
    navigate('/suratjalanumum')
  ]

  return (
    <div className="bg-white p-4 rounded-large animated fadeInDown">
      <div className="flex-col items-center">
        <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid grey' }}>
          <h1>View Surat Jalan Barang</h1>
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
                      id="no_surat_jalan"
                      // ref={no_ppbRef}
                      variant="bordered"
                      className="bg-white "
                      type="text"
                      defaultValue={suratjalanData.no_surat_jalan}
                      label="No. Surat Jalan"
                      isInvalid={message?.no_surat_jalan != null}
                      errorMessage={message?.no_surat_jalan}
                      isDisabled={!disabledView}
                      isReadOnly={true} 
                    />
                  </div>
                  <div  className="xl:w-3/5 w-full"></div>
                  <div  className="xl:w-1/5 w-full p-4" hidden={suratjalanData.status === ''}>
                    <p id="status" >
                      Status : {suratjalanData.status}
                    </p>
                  </div>
                  
                  <div className="flex flex-col p-4 xl:w-full w-full bg-white shadow-lg rounded-lg">
                    
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
                </div>
                  
                </div>
                <br />
                <Table aria-label="Example static collection table" className='p-2'>
                <TableHeader>
                    <TableColumn className='w-1/5'>PART NO.</TableColumn>
                    <TableColumn className='w-1/5'>NAMA BARANG</TableColumn>
                    <TableColumn className='w-1/5'>QTY</TableColumn>
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
                                {item.quantity}
                            </TableCell>
                            <TableCell>
                                {item.keterangan}
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
                      id="menyerahkan"
                      // ref={prepared_byRef}
                      variant="bordered"
                      className="bg-white "
                      type="text"
                      defaultValue={suratjalanData.menyerahkan}
                      label="Yang Menyerahkan"
                      isInvalid={message?.menyerahkan != null}
                      errorMessage={message?.menyerahkan}
                      isReadOnly={true}
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
                        isReadOnly={true}
                        />
                    </div>
                  </div>

                  <div className='flex'>
                    <div  className="flex p-2 xl:w-1/4 w-full">
                      <Input
                        id="mengetahui"
                        variant="bordered"
                        className="bg-white w-full"
                        type="text"
                        defaultValue={suratjalanData.mengetahui|| ''}
                        value={suratjalanData.mengetahui|| ''}
                        label="Mengetahui (Purchasing)"
                        isInvalid={message?.mengetahui != null}
                        errorMessage={message?.mengetahui}
                        isReadOnly={true}
                      />                    
                    </div>
                    <div className='flex p-4 w-1/4' hidden={suratjalanData.status === 'Draft' || suratjalanData.status === ''}>
                          <p id="status" >
                            Status : {suratjalanData.mengetahui_status}
                          </p>
                          <p id="date" hidden={suratjalanData.mengetahui_date == null}>
                            / Date : {suratjalanData.mengetahui_date}
                          </p>
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
                      isReadOnly= {true}
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
