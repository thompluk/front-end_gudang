import { Link, Navigate, redirect, useParams } from 'react-router-dom'
import axiosClient from '../../axios-client.js'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Button,
  } from '@nextui-org/react'
import StockItemArrival from './StockItemArrival.jsx'
import { render } from 'react-dom'
// import { Input } from 'mdb-react-ui-kit'

export default function StockItemInitial() {
  const navigate = useNavigate()
  const { param,param2 } = useParams()
  const [loading, setLoading] = useState(false)

  const [details, setDetails] = useState([[]]);

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
                  <div className="relative flex justify-center items-center gap-2">
                    <StockItemArrival details={details}/>
                  </div>
              </div>
          </form>
        </div>
      </div>
    )}
    </div>
    
  )
}
