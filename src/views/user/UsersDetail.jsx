import { Link, Navigate, redirect, useParams } from 'react-router-dom'
import axiosClient from '../../axios-client.js'
import { createRef } from 'react'
import { useState, useEffect } from 'react'
import { useStateContext } from '../../contexts/ContextProvider.jsx'
import { useNavigate } from 'react-router-dom'
// import { Input } from 'mdb-react-ui-kit'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import Swal from 'sweetalert2'

export default function UsersDetail() {
  const nameRef = createRef()
  const emailRef = createRef()
  const passwordRef = createRef()
  const phonenumberRef = createRef()
  const roleRef = createRef()
  const { setUser, setToken } = useStateContext()
  const [errors, setErrors] = useState(false);
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()
  const { param,param2 } = useParams()
  const [loading, setLoading] = useState(false)
  const [hidePass, setHidePass] = useState(false)
  const [disabledView, setDisabledView ] = useState(false)
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone_number: '',
    role: '',
  })
  // const history = useHistory();

  useEffect(() => {
    if (param != 'new') {
      getUsers()
      setHidePass(true)
    }
    if (param2 == 'view') {
      getUsers()
      setDisabledView(true)
    }

  }, [])

  const getUsers = () => {
    setLoading(true)
    axiosClient
      .get('/user/' + param)
      .then(({ data }) => {
        setUserData({
          name: data.data.name,
          email: data.data.email,
          phone_number: data.data.phone_number,
          role: data.data.role,
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
        email: emailRef.current.value,
        password: passwordRef.current.value,
        phone_number: phonenumberRef.current.value,
        role: roleRef.current.value,
      }

      axiosClient
        .post('/user', payload)
        .then(({}) => {
          Toast.fire({
            icon: "success",
            title: "Create is successfully"
          });
          navigate('/users')
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
        email: emailRef.current.value,
        // password: passwordRef.current.value,
        phone_number: phonenumberRef.current.value,
        role: roleRef.current.value,
      }

      axiosClient
        .put('/user/update/' + param, payload)
        .then(({}) => {
          Toast.fire({
            icon: "success",
            title: "Update is successfully"
          });
          navigate('/users')
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
  }

  const btnBack = () => [navigate('/users')]

  return (
    <div className="bg-white p-4 rounded-large animated fadeInDown">
      <div className="flex-col items-center">
        <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid grey' }}>
          <h1 hidden={hidePass || disabledView} >Create User</h1>
          <h1 hidden={!hidePass || disabledView}>Edit User</h1>
          <h1 hidden={!disabledView}>View User</h1>
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
              <div  className=" p-2 xl:w-1/4 w-full">
                <Input
                id="name"
                ref={nameRef}
                variant="bordered"
                className="bg-white "
                type="text"
                defaultValue={userData.name}
                label="Name"
                isInvalid={message?.name != null}
                errorMessage={message?.name}
                isReadOnly={disabledView}
                
              />
              </div>
              
              <div  className=" p-2 xl:w-1/4 w-full">
                <Input
                  id="email"
                  ref={emailRef}
                  variant="bordered"
                  className="bg-white"
                  type="text"
                  defaultValue={userData.email}
                  label="Email"
                  isInvalid={message?.email != null}
                  errorMessage={message?.email}
                  isReadOnly={disabledView}
                />
              </div>

              <div  className=" p-2 xl:w-1/4 w-full" hidden={hidePass}>
                <Input
                  id="password"
                  ref={passwordRef}
                  variant="bordered"
                  className="bg-white "
                  type="text"
                  label="Password"
                  isInvalid={message?.password != null}
                  errorMessage={message?.password}
                />

              </div>

              <div  className=" p-2 xl:w-1/4 w-full">
                <Input
                  id="phone_number"
                  ref={phonenumberRef}
                  variant="bordered"
                  className="bg-white"
                  type="text"
                  defaultValue={userData.phone_number}
                  label="Phone Number"
                  isInvalid={message?.phone_number != null}
                  errorMessage={message?.phone_number}
                  isReadOnly={disabledView}
                />
              </div>

              <div  className=" p-2 xl:w-1/4 w-full">
                <Select
                  id="role"
                  label="Role"
                  placeholder="Select an role"
                  className="bg-white"
                  variant="bordered"
                  ref={roleRef}
                  value={userData.role}
                  selectedKeys={new Set([userData.role])}
                  onSelectionChange={(keys) => setUserData({ ...userData, role: [...keys][0] })}
                  isInvalid={message?.role != null}
                  errorMessage={message?.role}
                  isDisabled={disabledView}
                >
                  <SelectItem key="ADMIN">ADMIN</SelectItem>
                  <SelectItem key="SALES">SALES</SelectItem>
                  <SelectItem key="PURCHASING">PURCHASING</SelectItem>
                  <SelectItem key="INVENTORY">INVENTORY</SelectItem>
                </Select>
              </div>

            </div>
          )}
        </form>
      </div>
    </div>
    
  )
}
