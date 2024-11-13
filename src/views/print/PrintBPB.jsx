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

function PrintBPB() {
    const contentToPrint = useRef();
    const { param } = useParams()
    const navigate = useNavigate()

    const btnBack = () => [
        navigate('/bpb/'+param+'/view')
      ]

    const [bpbData, setBpbData] = useState({
        status: null,
        delivery_status: null,
        salesman: null,
        date: null,
        no_po: null,
        delivery_by: null,
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
    
    const [details, setDetails] = useState([]);

    const handlePrint = useReactToPrint({
        documentTitle: "Bukti Pengeluaran Barang No. " + bpbData.no_bpb,
        onBeforePrint: () => console.log("before printing..."),
        onAfterPrint: () => console.log("after printing..."),
        removeAfterPrint: true,
    });

    useEffect(() => {
        getDetails();
        getPo();
      }, [])

    const getPo = () => {
        axiosClient
          .get('/bpb/' + param)
          .then(({ data }) => {
            setBpbData({
                status: data.data.status,
                salesman: data.data.salesman,
                date: data.data.date,
                no_po: data.data.no_po,
                delivery_by: data.data.delivery_by,
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
          })
          .catch(() => {
          })
    }

    const getDetails = () => {
        axiosClient
          .get('/bpbdetaildetaillist/'+ param)
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
                    <div className='flex w-full'>
                        <div className="pb-4 w-1/6">
                            <img src="https://www.ptgmi.co.id/wp-content/uploads/2021/07/logo-gmi.png" alt="gudang" style={{maxBlockSize: "40px"}} />
                        </div>
                        <div className="w-4/6 text-center">  
                            <h2>
                                Bukti Pengeluaran Barang
                            </h2>
                        </div>
                    </div>
                    <div className='flex'>
                        <div className='w-1/2'>
                            <div className='flex w-full'> 
                                <p className='w-1/3'>
                                    Salesman
                                </p>
                                <p className='w-2/3'>
                                    : {bpbData.salesman}
                                </p>
                            </div>
                            <div className='flex w-full'> 
                                <p className='w-1/3'>
                                    Date
                                </p>
                                <p className='w-2/3'>
                                    : {bpbData.date}
                                </p>
                            </div>
                            <div className='flex w-full'> 
                                <p className='w-1/3'>
                                    No. PO
                                </p>
                                <p className='w-2/3'>
                                    : {bpbData.no_po}
                                </p>
                            </div>
                            <div className='flex w-full'> 
                                <p className='w-1/3'>
                                    Delivery By
                                </p>
                                <p className='w-2/3'>
                                    : {bpbData.delivery_by}
                                </p>
                            </div>
                        </div>
                        <div className='w-1/2'>
                            <div className='flex w-full'> 
                                <p className='w-1/3'>
                                    No. BPB
                                </p>
                                <p className='w-2/3'>
                                    : {bpbData.no_bpb}
                                </p>
                            </div>
                            <div className='flex w-full'> 
                                <p className='w-1/3'>
                                    Customer
                                </p>
                                <p className='w-2/3'>
                                    : {bpbData.customer}
                                </p>
                            </div>
                            <div className='flex w-full'> 
                                <p className='w-1/3'>
                                    Delivery Address
                                </p>
                                <p className='w-2/3'>
                                    : {bpbData.customer_address}
                                </p>
                            </div>
                            <div className='flex w-full'> 
                                <p className='w-1/3'>
                                    PIC Name
                                </p>
                                <p className='w-2/3'>
                                    : {bpbData.customer_pic_name}
                                </p>
                            </div>
                            <div className='flex w-full'> 
                                <p className='w-1/3'>
                                    PIC Phone
                                </p>
                                <p className='w-2/3'>
                                    : {bpbData.customer_pic_phone}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 w-full">
                        <div>
                           <table>
                                <thead>
                                    <tr>
                                        <th className="w-[4%] text-center">No.</th>
                                        <th className='w-[25%]'>Item Name</th> 
                                        <th className='w-[15%]'>EDP</th>
                                        <th className='w-[11%]'>S/N</th>
                                        {/* <th className='w-[5%]'>QTY</th> */}
                                        <th className='w-[25%]'>Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {details.length > 0 ? (
                                    details.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.item_name}</td>
                                            <td>{item.no_edp}</td>
                                            <td>{item.no_sn}</td>
                                            {/* <td>{item.quantity}</td> */}
                                            <td>{item.notes}</td>
                                        </tr>
                                    ))
                                    ) : (
                                    <tr>
                                        <td colSpan="8">No data available</td>
                                    </tr>
                                    )}
                                    {/* <tr>
                                        <td colSpan="4" className="w-[4%] text-center">Total</td>
                                        <td className='w-[5%]'>4</td>
                                    </tr> */}
                                </tbody>
                            </table>
                        </div>

                    </div>
                    <div className="flex pt-8 w-full" >
                        <div className='p-2 w-1/4 '>
                            <div className='p-4 rounded border min-h-44'>
                                <p className="p-0">
                                    Request By : <br />Admin Sales
                                </p>
                                <p className="pt-5 text-center">
                                    {bpbData.request_by}
                                </p>
                                <hr />
                                <p className="p-0">
                                    Date : {bpbData.request_by_date}
                                </p>
                            </div>    
                        </div>
                        
                        <div className='p-2 w-1/4 '>
                            <div className='p-4 rounded border min-h-44'>
                                <p className="p-0">
                                    Approved By : <br />(Sales/Marketing)
                                </p>
                                <p className="pt-5 text-center">
                                    {bpbData.approved_by}
                                </p>
                                <hr />
                                <p className="p-0">
                                    Date : {bpbData.approved_by_date}
                                </p>
                            </div>    
                        </div>

                        <div className='p-2 w-1/4 '>
                            <div className='p-4 rounded border min-h-44'>
                                <p className="p-0">
                                    Packed By : <br /> Warehouse Dept
                                </p>
                                <p className="pt-5 text-center">
                                 _
                                </p>
                                <hr />
                                <p className="p-0">
                                    Date : 
                                </p>
                            </div>    
                        </div>

                        <div className='p-2 w-1/4 '>
                            <div className='p-4 rounded border min-h-44'>
                                <p className="p-0">
                                    Acknowledge By : <br /> Admin Finance
                                </p>
                                <p className="pt-5 text-center">
                                    _
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
export default PrintBPB;