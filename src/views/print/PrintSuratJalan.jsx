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

function PrintSuratJalan() {
    const contentToPrint = useRef();
    const { param } = useParams()
    const navigate = useNavigate()

    const btnBack = () => [
        navigate('/suratjalan/'+param+'/view')
      ]

    const [suratJalanData, setSuratJalanData] = useState({
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
        remarks: null,
      })
    
      const [details, setDetails] = useState([]);

    const handlePrint = useReactToPrint({
        documentTitle: "Surat Jalan Proses No. " + suratJalanData.no_surat_jalan,
        onBeforePrint: () => console.log("before printing..."),
        onAfterPrint: () => console.log("after printing..."),
        removeAfterPrint: true,
    });

    useEffect(() => {
        getDetails();
        getSuratJalan();
      }, [])

      const getSuratJalan = () => {
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
            })
          })
          .catch(() => {
          })
      }

    const getDetails = () => {
    
        axiosClient
          .get('/suratjalandetaillist/'+ param)
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
                                Surat Jalan Proses
                            </h2>
                        </div>
                        <div>  
                            <p className="p-0">
                                No. Surat Jalan : {suratJalanData.no_surat_jalan}
                            </p>
                        </div>

                        <div className=' pt-2 w-full'>
                            <p className='w-1/2'>
                                Company : {suratJalanData.company}
                            </p>
                            <p className='w-1/2'>
                                Telp/Fax : {suratJalanData.company_telephone}/{suratJalanData.company_fax}
                            </p>
                            <p>
                                Company Address : {suratJalanData.company_address}
                            </p>
                            <p>
                                Email : {suratJalanData.company_email}
                            </p>
                        </div>

                    </div>

                    <div className="pt-8 w-full">
                        <div>
                           <table>
                                <thead>
                                    <tr>
                                        <th className="w-10 text-center">No.</th>
                                        <th>Part No.</th>
                                        <th>Nama Barang</th>
                                        <th>Qty</th>
                                        <th>Keterangan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {details.length > 0 ? (
                                    details.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.id}</td>
                                            <td>{item.nama_barang}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.keterangan}</td>
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
                                    Menyerahkan : 
                                </p>
                                <p className="p-0 text-center">
                                    {suratJalanData.menyerahkan}
                                </p>
                                <hr />
                                <p className="p-0">
                                    Date : {suratJalanData.menyerahkan_date}
                                </p>
                            </div>    
                        </div>
                        
                        <div className='p-2 w-1/4 '>
                            <div className='p-4 rounded border'>
                                <p className="p-0">
                                    Mengetahui :
                                </p>
                                <p className="p-0 text-center">
                                    {suratJalanData.mengetahui}
                                </p>
                                <hr />
                                <p className="p-0">
                                    Date : {suratJalanData.mengetahui_date}
                                </p>
                            </div>    
                        </div>
                    </div>
                </div>
            </div>
        </div>

      )
}
export default PrintSuratJalan;