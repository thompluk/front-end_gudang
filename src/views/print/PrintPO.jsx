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

function PrintPO() {
    const contentToPrint = useRef();
    const { param } = useParams()
    const navigate = useNavigate()

    const btnBack = () => [
        navigate('/po/'+param+'/view')
      ]

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
    
    const [details, setDetails] = useState([]);

    const handlePrint = useReactToPrint({
        documentTitle: "Purchase Order No. " + poData.no_po,
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
          })
          .catch(() => {
          })
    }

    const getDetails = () => {
        axiosClient
          .get('/podetaillist/'+ param)
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
                        <div className='w-2/6'>
                                <p className="p-0 text-" >
                                    PT. GLOBAL MEGA INDONESIA
                                </p>
                                <p className="p-0 text-" >
                                    Jl.Jababeka III H Blok C 17 ET, Kawasan Industri Cikarang Pasir Gombong, Cikarang Utara, Bekasi
                                </p>
                                <p className="p-0">
                                    Tel : 89836825/26 ; Fax : 89836824
                                </p>
                        </div>
                        <div className='w-1/6'></div>
                        <div className="w-2/6">  
                            <h2>
                                Purcahse Order
                            </h2>
                        
                            <div className='flex pt-10'>
                                <div className='p-2 w-1/2 '>
                                    <div className='p-1  border text-center'>
                                        <p>
                                            PO Date
                                        </p>
                                        <hr />
                                        <p>
                                            {poData.tanggal}
                                        </p>
                                    </div>    
                                </div>
                                
                                <div className='p-2 w-1/2 '>
                                    <div className='p-1 border text-center'>
                                        <p>
                                            PO Number
                                        </p>
                                        <hr/>
                                        <p>
                                            {poData.no_po}
                                        </p>
                                    </div>    
                                </div>
                            </div>
                        </div>
                        
                    </div>

                    <div className="flex items-center pt-2">
                        <div className='flex w-1/2 p-2'>
                            <div className='w-1/6'>
                                <p>Vendor :</p>
                            </div>
                            <div className='w-4/6'>
                                <p className="p-0 text-" >
                                    PT. GLOBAL MEGA INDONESIA
                                </p>
                                <p className="p-0 text-" >
                                    Jl.Jababeka III H Blok C 17 ET, Kawasan Industri Cikarang Pasir Gombong, Cikarang Utara, Bekasi
                                </p>
                                <p className="p-0">
                                    Tel : 89836825/26 ; Fax : 89836824
                                </p>
                            </div>
                            
                        </div>
                        <div className='flex w-1/2 p-2'>
                            <div className='w-1/6'>
                                <p>Ship To :</p>
                            </div>
                            <div className='w-4/6'>
                                <p className="p-0 text-" >
                                    PT. GLOBAL MEGA INDONESIA
                                </p>
                                <p className="p-0 text-" >
                                    Jl.Jababeka III H Blok C 17 ET, Kawasan Industri Cikarang Pasir Gombong, Cikarang Utara, Bekasi
                                </p>
                                <p className="p-0">
                                    Tel : 89836825/26 ; Fax : 89836824
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className='flex w-full pt-4'>
                        <div className='p-2 w-1/5 '>
                            <div className='p-1  border text-center'>
                                <p>
                                    Terms
                                </p>
                                <hr />
                                <p>
                                    {poData.terms}
                                </p>
                            </div>    
                        </div>
                        <div className='p-2 w-1/5 '>
                            <div className='p-1 border text-center'>
                                <p>
                                    Ship Via
                                </p>
                                <hr/>
                                <p>
                                    {poData.ship_via}
                                </p>
                            </div>    
                        </div>
                        <div className='p-2 w-1/5'>
                            <div className='p-1 border text-center'>
                                <p>
                                    Expected Date
                                </p>
                                <hr/>
                                <p>
                                    {poData.expected_date}
                                </p>
                            </div>    
                        </div>
                        <div className='p-2 w-1/5'>
                            <div className='p-1 border text-center'>
                                <p>
                                    Currency
                                </p>
                                <hr/>
                                <p>
                                    {poData.currency}
                                </p>
                            </div>    
                        </div>
                    </div>

                    <div className="pt-2 w-full">
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th className="w-[5%] text-center">No.</th>
                                        <th className='w-[16%]'>Item</th>
                                        <th className='w-[24%]'>Description</th>
                                        <th className='w-[7%]'>QTY</th>
                                        <th className='w-[11%] text-right'>Unit Price</th>
                                        <th className='w-[7%]'>Disc %</th>
                                        <th className='w-[12%] text-right'>Amount</th>
                                        <th className='w-[12%]'>Remarks</th>
                                        <th className='w-[6%]'>Item Unit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {details.length > 0 ? (
                                    details.map((item, index) => (
                                        <tr key={index}>
                                        <td className='text-center' >{index + 1}</td>
                                        <td>{item.item}</td>
                                        <td>{item.description}</td>
                                        <td className='text-right'>{item.quantity}</td>
                                        <td className='text-right'>{item.unit_price}</td>
                                        <td className='text-right'>{item.discount}</td>
                                        <td className='text-right'>{item.amount}</td>
                                        <td>{item.remarks}</td>
                                        <td>{item.item_unit}</td>
                                        </tr>
                                    ))
                                    ) : (
                                    <tr>
                                        <td colSpan="9">No data available</td>
                                    </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex pt-2">
                        <div className='w-3/5 p-2'>
                            <div className='flex w-full'>
                                <div className='w-1/6 p-1'>
                                    <p>Vendor :</p>
                                </div>
                                <div className='w-5/6'>
                                    <div className='p-1 border'>
                                        <p>
                                            {poData.say}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className='pt-4 w-5/6'>
                                <div>
                                    <div className='p-1 border'>
                                        <p>
                                            Description
                                        </p>
                                    </div>
                                </div> 
                                <div>
                                    <div className='p-1 border min-h-32'>
                                        <p>
                                            {poData.description}
                                        </p>
                                    </div>
                                </div> 
                            </div>
                        </div>
                        <div className='flex w-2/5 p-2'>
                            <div className='w-full'>
                                <div className='flex w-full pb-1'>
                                    <div className='p-1 border w-1/3'>
                                        <p>
                                            Sub Total:
                                        </p>
                                    </div>
                                    <div className='p-1 border w-2/3 text-right'>
                                        <p>
                                            {poData.sub_total}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex w-full pb-1'>
                                    <div className='p-1 border w-1/3'>
                                        <p>
                                            Discount:
                                        </p>
                                    </div>
                                    <div className='p-1 border w-2/3 text-right'>
                                        <p>
                                            {poData.discount}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex w-full pb-1'>
                                    <div className='p-1 border w-1/3'>
                                        <p>
                                            Freight Cost:
                                        </p>
                                    </div>
                                    <div className='p-1 border w-2/3 text-right'>
                                        <p>
                                            {poData.freight_cost}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex w-full pb-1'>
                                    <div className='p-1 border w-1/3'>
                                        <p>
                                            PPN 11%:
                                        </p>
                                    </div>
                                    <div className='p-1 border w-2/3 text-right'>
                                        <p>
                                            {poData.ppn}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex w-full pb-1'>
                                    <div className='p-1 border w-1/3'>
                                        <p>
                                            Total Order:
                                        </p>
                                    </div>
                                    <div className='p-1 border w-2/3 text-right'>
                                        <p>
                                            {poData.total_order}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex pt-8 w-full justify-end" >
                        <div className='p-2 w-1/4 '>
                            <div className='p-3 rounded border'>
                                <p >
                                    Prepared By : 
                                </p>
                                <p className="pt-1 text-center">
                                    {poData.prepared_by}
                                </p>
                                <hr />
                                <p >
                                    Date : {poData.prepared_by_date}
                                </p>
                            </div>    
                        </div>
                        
                        <div className='p-2 w-1/4 '>
                            <div className='p-3 rounded border'>
                                <p >
                                    Verified By : 
                                </p>
                                <p className="pt-1 text-center">
                                    {poData.verified_by}
                                </p>
                                <hr />
                                <p >
                                    Date : {poData.verified_by_date}
                                </p>
                            </div>    
                        </div>

                        <div className='p-2 w-1/4 '>
                            <div className='p-3 rounded border'>
                                <p >
                                    Approved By : 
                                </p>
                                <p className="pt-1 text-center">
                                    {poData.approved_by}
                                </p>
                                <hr />
                                <p >
                                    Date : {poData.approved_by_date}
                                </p>
                            </div>    
                        </div>
                    </div>
                </div>
            </div>
        </div>

      )
}
export default PrintPO;