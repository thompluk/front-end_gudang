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
  const [arrivalStatus, setArrivalStatus] = useState([])

  const [details, setDetails] = useState([[]]);
//   const [stocks, setStocks] = useState([]);

  // const history = useHistory();
  useEffect(() => {
    
    getStockItem()
    // getStocks()
  }, [])

  useEffect(() => {
    
    ariivalStatusCheck()

  }, [arrivalStatus])



// const getStocks = () => {
//     axiosClient
//         .get('/po/arrivalData/' + param)
//         .then(({ data }) => {
//             // Pastikan data.data adalah array
//             setStocks(data.data);

//             // setLoading(false);
//         })
//         .catch(() => {
//             // setLoading(false);
//         });
// }

const checkLength = () => {
    if(details.length == 0) {
        navigate('/poumum');
    }
}

const arrived = () => {
    axiosClient
    .post('/po/arrived/' + param)
    .then(({}) => {
      navigate('/poumum');
      Toast.fire({
        icon: "success",
        title: "Arrival is successfully"
      }); 
    })
    .catch(err => {
      const response = err.response
      if (response && response.status === 400) {
        setMessage(response.data.message);
        setErrors(true);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data.message,
          // footer: '<a href="#">Why do I have this issue?</a>'
      });
      }
    })
  }

const ariivalStatusCheck = () => {
    if(arrivalStatus.length == details.length) {
        arrived();
    }
}


const arrivalStatusAdd = () => {
    console.log('arrival masuk')
    setArrivalStatus(prevStatus => [...prevStatus, true]);
}

const getStockItem = () => {

    setLoading(true);

    axiosClient
        .get('/po/arrivalData/' + param)
        .then(({ data }) => {
            // Pastikan data.data adalah array
            const rawDetails = data.data; // Ambil data mentah
            if(rawDetails.length == 0) {
              arrived();
              navigate('/poumum');
            }
            // Proses data mentah
            const groupedDetails = rawDetails.map(raw => 
            Array(raw.quantity).fill({
                ...raw,
                id: null, // Pastikan id tetap null
            })
            );

            // Update state dengan array dari array
            setDetails(groupedDetails);
            console.log(groupedDetails);
            setLoading(false);
        })
        .catch(() => {
            setLoading(false);
        });
  }
  
  const renderStockItemArrival = () => {
    // console.log(details[0].detail_length)
    let tabs = []
    for (let i = 0; i < details.length; i++) {
        console.log('masuk')
        tabs[i] = (
            <div className="relative flex justify-center items-center gap-2">
              <StockItemArrival details={details[i]} arrivalStatusAdd={arrivalStatusAdd}/>
            </div>
        );
    }
    return tabs;
  };

  const btnBack = () => [navigate('/poumum/'+ param + '/view')]

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
          <div>
              {/* <button onClick={arrivalStatusAdd}>Add Arrival Status</button> */}
              <ul>
                  {arrivalStatus.map((status, index) => (
                      <li key={index}>Status {index + 1}: {status ? 'Arrived' : 'Pending'}</li>
                  ))}
              </ul>
          </div>
          <form className='pt-8'>
              
              <div className=" w-full flex-wrap md:flex-nowrap">
                  {renderStockItemArrival()}
              </div>
          </form>
        </div>
      </div>
    )}
    </div>
    
  )
}
