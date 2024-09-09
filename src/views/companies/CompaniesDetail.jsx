import { Link, Navigate, redirect, useParams } from 'react-router-dom'
import axiosClient from '../../axios-client.js'
import { createRef } from 'react'
import { useState, useEffect } from 'react'
import { useStateContext } from '../../contexts/ContextProvider.jsx'
import { useNavigate } from 'react-router-dom'
// import { Input } from 'mdb-react-ui-kit'
import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react'
import Swal from 'sweetalert2'

export default function CompaniesDetail() {
  const nameRef = createRef()
  const addressRef = createRef()
  const faxRef = createRef()
  const telephoneRef = createRef()
  const emailRef = createRef()
  const [errors, setErrors] = useState(false);
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()
  const { param,param2 } = useParams()
  const [loading, setLoading] = useState(false)
  const [hidePass, setHidePass] = useState(false)
  const [disabledView, setDisabledView ] = useState(false)
  const [companiesData, setCompaniesData] = useState({
    name: '',
    address: '',
    telephone: '',
    fax: '',
    email: ''
  })
  // const history = useHistory();

  useEffect(() => {
    if (param != 'new') {
        getCompanies()
        setHidePass(true)
    }
    if (param2 == 'view') {
        getCompanies()
        setDisabledView(true)
    }

  }, [])

  const getCompanies = () => {
    setLoading(true)
    axiosClient
      .get('/companies/' + param)
      .then(({ data }) => {
        setCompaniesData({
          name: data.data.name,
          address: data.data.address,
          telephone: data.data.telephone,
          fax: data.data.fax,
          email: data.data.email,
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
        address: addressRef.current.value,
        telephone: telephoneRef.current.value,
        fax: faxRef.current.value,
        email: emailRef.current.value,
      }

      axiosClient
        .post('/companies', payload)
        .then(({}) => {
          Toast.fire({
            icon: "success",
            title: "Create is successfully"
          });
          navigate('/companies')
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
        address: addressRef.current.value,
        fax: faxRef.current.value,
        telephone: telephoneRef.current.value,
        email: emailRef.current.value,
      }

      axiosClient
        .put('/companies/update/' + param, payload)
        .then(({}) => {
          Toast.fire({
            icon: "success",
            title: "Update is successfully"
          });
          navigate('/companies')
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

  const btnBack = () => [navigate('/companies')]

  return (
    <div className="bg-white p-4 rounded-large animated fadeInDown">
      <div className="flex-col items-center">
        <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid grey' }}>
          <h1 hidden={hidePass || disabledView} >Create Companies</h1>
          <h1 hidden={!hidePass || disabledView}>Edit Companies</h1>
          <h1 hidden={!disabledView}>View Companies</h1>
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
                defaultValue={companiesData.name}
                label="Name"
                isInvalid={message?.name != null}
                errorMessage={message?.name}
                isDisabled={disabledView}
                
              />
              </div>

              <div  className=" p-2 xl:w-1/3 w-full">
                <Textarea
                id="address"
                ref={addressRef}
                variant="bordered"
                className="bg-white "
                type="text"
                defaultValue={companiesData.address}
                label="Address"
                isInvalid={message?.address != null}
                errorMessage={message?.address}
                isDisabled={disabledView}
                
              />
              </div>

              <div  className=" p-2 xl:w-1/3 w-full">
                <Input
                  id="telephone"
                  ref={telephoneRef}
                  variant="bordered"
                  className="bg-white"
                  type="text"
                  defaultValue={companiesData.telephone}
                  label="Telephone"
                  isInvalid={message?.telephone != null}
                  errorMessage={message?.telephone}
                  isDisabled={disabledView}
                />
              </div>

              <div  className=" p-2 xl:w-1/3 w-full">
                <Input
                  id="fax"
                  ref={faxRef}
                  variant="bordered"
                  className="bg-white"
                  type="fax"
                  defaultValue={companiesData.fax}
                  label="Fax"
                  isInvalid={message?.fax != null}
                  errorMessage={message?.fax}
                  isDisabled={disabledView}
                />
              </div>

              <div  className=" p-2 xl:w-1/3 w-full">
                <Input
                  id="email"
                  ref={emailRef}
                  variant="bordered"
                  className="bg-white"
                  type="email"
                  defaultValue={companiesData.email}
                  label="Email"
                  isInvalid={message?.email != null}
                  errorMessage={message?.email}
                  isDisabled={disabledView}
                />
              </div>

            </div>
          )}
        </form>
      </div>
    </div>
    
  )
}
