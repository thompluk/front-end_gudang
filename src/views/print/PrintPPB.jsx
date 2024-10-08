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
  } from '@nextui-org/react'

import { useRef, useState, useEffect } from 'react';
import React from "react";
import { useReactToPrint } from 'react-to-print';
import { AiFillPrinter } from "react-icons/ai";
import axiosClient from '../../axios-client'
import { useNavigate, useParams } from 'react-router-dom'

function PrintPPB() {
    const contentToPrint = useRef();
    const { param } = useParams()
    const navigate = useNavigate()

    const btnBack = () => [
        navigate('/ppb/'+param+'/view')
      ]

    const [ppbData, setPpbData] = useState({
        tanggal: '',
        no_ppb: '',
        status: '',
        pemohon: '',
        mengetahui: '',
        mengetahui_id: '',
        mengetahui_status: '',
        menyetujui: '',
        menyetujui_id: '',
        menyetujui_status: '',
        purchasing: '',
        remarks: '',
      })
    
      const [details, setDetails] = useState([]);

    const handlePrint = useReactToPrint({
        documentTitle: "Permintaan Pembelian Barang No. " + ppbData.no_ppb,
        onBeforePrint: () => console.log("before printing..."),
        onAfterPrint: () => console.log("after printing..."),
        removeAfterPrint: true,
    });

    useEffect(() => {
        getDetails();
        getPpb();
      }, [])

      const getPpb = () => {
        axiosClient
          .get('/ppb/' + param)
          .then(({ data }) => {
            setPpbData({
              tanggal: data.data.tanggal,
              no_ppb: data.data.no_ppb,
              status: data.data.status,
              pemohon: data.data.pemohon,
              mengetahui: data.data.mengetahui,
              mengetahui_id: data.data.mengetahui_id,
              mengetahui_status: data.data.mengetahui_status,
              menyetujui: data.data.menyetujui,
              menyetujui_id: data.data.menyetujui_id,
              menyetujui_status: data.data.menyetujui_status,
              purchasing: data.data.purchasing,
              purchasing_status: data.data.purchasing_status,
              remarks: data.data.remarks,
            })
          })
          .catch(() => {
          })
      }

    const getDetails = () => {
    
        axiosClient
          .get('/ppbdetaillist/'+ param)
          .then(({ data }) => {
            setDetails(data.data);
          })
          .catch(() => {
          })
    }

    return (
        <div className="bg-white p-4 rounded-large animated fadeInDown mx-auto w-[900px]">
            <div className='flex p-4 w-full justify-end'>
                <div className='pe-2'>
                    <Button className='bg-blue-300' onClick={() => {
                        handlePrint(null, () => contentToPrint.current);
                    }}>
                        PRINT
                        <AiFillPrinter className='size-5'/>
                    </Button>
                </div>
                <div>
                    <Button className="bg-red-300" onClick={btnBack}>
                        Back
                    </Button>
                </div>
            </div>
            <div className="p-4 text-tiny" ref={contentToPrint} id='print'>
                <div className="flex-col items-center">
                    <div> 
                        <div className="pb-4">
                            <img src="https://www.ptgmi.co.id/wp-content/uploads/2021/07/logo-gmi.png" alt="gudang" style={{maxBlockSize: "40px"}} />
                        </div>
                        <div >
                            <p className="p-0">
                                PT. Global Mega Indonesia
                            </p>
                        </div>
                        <div>  
                            <p className="p-0">
                                Tel : 89836825/26 ; Fax : 89836824
                            </p>
                        </div>
                        <div className="text-center">  
                            <h2>
                                Permintaan Pembelian Barang
                            </h2>
                        </div>
                        <div >
                            <p className="p-0">
                                Tanggal : {ppbData.tanggal}
                            </p>
                        </div>
                        <div>  
                            <p className="p-0">
                                No. PPB : {ppbData.no_ppb}
                            </p>
                        </div>
                    </div>

                    <div className="pt-8 w-full">
                        <div>
                           <table>
                                <thead>
                                    <tr>
                                        <th className="w-10 text-center">No.</th>
                                        <th>Nama Barang</th>
                                        <th>Kode</th>
                                        <th>Spesifikasi</th>
                                        <th>Qty</th>
                                        <th>Expected ETA</th>
                                        <th>Project & Customer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {details.length > 0 ? (
                                    details.map((item, index) => (
                                        <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.nama_barang}</td>
                                        <td>{item.kode}</td>
                                        <td>{item.spesifikasi}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.expected_eta}</td>
                                        <td>{item.project_and_customer}</td>
                                        </tr>
                                    ))
                                    ) : (
                                    <tr>
                                        <td colSpan="7">No data available</td>
                                    </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                    <div className="flex pt-8 w-full" >
                        <div className='p-2 w-1/4 '>
                            <div className='p-4 rounded border'>
                                <p className="p-0">
                                    Pemohon : 
                                </p>
                                <p className="p-0 text-center">
                                    {ppbData.pemohon}
                                </p>
                                <hr />
                                <p className="p-0">
                                    Date : 
                                </p>
                            </div>    
                        </div>
                        
                        <div className='p-2 w-1/4 '>
                            <div className='p-4 rounded border'>
                                <p className="p-0">
                                    Mengetahui :
                                </p>
                                <p className="p-0 text-center">
                                    {ppbData.mengetahui}
                                </p>
                                <hr />
                                <p className="p-0">
                                    Date : 
                                </p>
                            </div>    
                        </div>

                        <div className='p-2 w-1/4 '>
                            <div className='p-4 rounded border'>
                                <p className="p-0">
                                    Menyetujui :
                                </p>
                                <p className="p-0 text-center">
                                    {ppbData.menyetujui}
                                </p>
                                <hr />
                                <p className="p-0">
                                    Date : 
                                </p>
                            </div>    
                        </div>

                        <div className='p-2 w-1/4 '>
                            <div className='p-4 rounded border'>
                                <p className="p-0">
                                    Purchasing :
                                </p>
                                <p className="p-0 text-center">
                                    {ppbData.purchasing}
                                </p>
                                <hr />
                                <p className="p-0">
                                    Date : 
                                </p>
                            </div>    
                        </div>
                    </div>
                </div>
            </div>
        </div>

      )
}
export default PrintPPB;