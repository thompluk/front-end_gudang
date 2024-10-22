import { Link, Navigate, redirect, useParams } from 'react-router-dom'
import axiosClient from '../../axios-client.js'
import { createRef } from 'react'
import { useState, useEffect } from 'react'
import { useStateContext } from '../../contexts/ContextProvider.jsx'
import { useNavigate } from 'react-router-dom'
// import { Input } from 'mdb-react-ui-kit'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import Swal from 'sweetalert2'

export default function PrinsipalDetail() {
  const nameRef = createRef()
  const faxRef = createRef()
  const telephoneRef = createRef()
  const [errors, setErrors] = useState(false);
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()
  const { param,param2 } = useParams()
  const [loading, setLoading] = useState(false)
  const [hidePass, setHidePass] = useState(false)
  const [disabledView, setDisabledView ] = useState(false)
  const [prinsipalData, setPrinsipalData] = useState({
    name: '',
    telephone: '',
    fax: '',
  })
  // const history = useHistory();

  useEffect(() => {
    if (param != 'new') {
      getPrinsipals()
      setHidePass(true)
    }
    if (param2 == 'view') {
      getPrinsipals()
      setDisabledView(true)
    }

  }, [])

  const getPrinsipals = () => {
    setLoading(true)
    axiosClient
      .get('/prinsipal/' + param)
      .then(({ data }) => {
        setPrinsipalData({
          name: data.data.name,
          telephone: data.data.telephone,
          fax: data.data.fax,
        })
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

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

    if (param == 'new') {
      const payload = {
        name: nameRef.current.value,
        telephone: telephoneRef.current.value,
        fax: faxRef.current.value,
      }

      axiosClient
        .post('/prinsipal', payload)
        .then(({}) => {
          Toast.fire({
            icon: "success",
            title: "Create is successfully"
          });
          navigate('/prinsipal')
        })
        .catch(err => {
          const response = err.response
          if (response && response.status === 400) {
            setMessage(response.data.message);
            setErrors(true);
            console.log(errors) ;
          }
        })
    } else {
      const payload = {
        name: nameRef.current.value,
        fax: faxRef.current.value,
        telephone: telephoneRef.current.value,
      }

      axiosClient
        .put('/prinsipal/update/' + param, payload)
        .then(({}) => {
          Toast.fire({
            icon: "success",
            title: "Update is successfully"
          });
          navigate('/prinsipal')
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

  const btnBack = () => [navigate('/prinsipal')]

  return (
    <div className="bg-white p-4 rounded-large animated fadeInDown">
      <div className="flex-col items-center">
        <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid grey' }}>
          <h1 hidden={hidePass || disabledView} >Create Prinsipal</h1>
          <h1 hidden={!hidePass || disabledView}>Edit Prinsipal</h1>
          <h1 hidden={!disabledView}>View Prinsipal</h1>
          <Button className="bg-red-300" onClick={btnBack}>
            Back
          </Button>
        </div>
        <form className='pt-8'>
          <div className="flex w-full flex-wrap md:flex-nowrap p-2">
            <Button className="bg-green-300" hidden={hidePass || disabledView} onClick={onSubmit}>
              Create
            </Button>
            <Button className="bg-yellow-300" hidden={!hidePass || disabledView} onClick={onSubmit}>
              Edit
            </Button>
          </div>
          {loading && (
            <div className="row">
              <div className="col-md-12 mb-12 text-center">Loading...</div>
            </div>
          )}
          {!loading && (
            <div className="flex w-full flex-wrap md:flex-nowrap">
              <div  className=" p-2 xl:w-1/3 w-full">
                <Input
                id="name"
                ref={nameRef}
                variant="bordered"
                className="bg-white "
                type="text"
                defaultValue={prinsipalData.name}
                label="Name"
                isInvalid={message?.name != null}
                errorMessage={message?.name}
                isReadOnly={disabledView}
                
              />
              </div>

              <div  className=" p-2 xl:w-1/3 w-full">
                <Input
                  id="telephone"
                  ref={telephoneRef}
                  variant="bordered"
                  className="bg-white"
                  type="text"
                  defaultValue={prinsipalData.telephone}
                  label="Telephone"
                  isInvalid={message?.telephone != null}
                  errorMessage={message?.telephone}
                  isReadOnly={disabledView}
                />
              </div>

              <div  className=" p-2 xl:w-1/3 w-full">
                <Input
                  id="fax"
                  ref={faxRef}
                  variant="bordered"
                  className="bg-white"
                  type="text"
                  defaultValue={prinsipalData.fax}
                  label="Fax"
                  isInvalid={message?.fax != null}
                  errorMessage={message?.fax}
                  isReadOnly={disabledView}
                />
              </div>

            </div>
          )}
        </form>
      </div>
    </div>
    
  )
}
