import { Link, Navigate } from 'react-router-dom'
import axiosClient from '../axios-client.js'
import { createRef } from 'react'
import { useState } from 'react'
import { useStateContext } from '../contexts/ContextProvider.jsx'
import { Card, CardHeader, CardBody, Input, Button } from '@nextui-org/react'
import Swal from 'sweetalert2'
import BgLogin from '../assets/BG-Custom.jpg'

export default function Login() {
  const emailRef = createRef()
  const passwordRef = createRef()
  const { setUser, setToken } = useStateContext()
  const [message, setMessage] = useState(null)

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


  const handleLogin = ev => {
    ev.preventDefault()

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    }
    axiosClient
      .post('/login', payload)
      .then(({ data }) => {
        setUser(data.user)
        setToken(data.token)
        Toast.fire({
          icon: "success",
          title: "Login is successfully"
        });
      })
      .catch(err => {
        const response = err.response
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data.message,
          // footer: '<a href="#">Why do I have this issue?</a>'
        });
        if (response && response.status === 422) {
          setMessage(response.data.message)
        }
      })
  }

  return (
    <div className="flex justify-center items-center min-h-screen"
      style={{
        backgroundImage:  `url(${BgLogin})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      {/* <Card className="w-full max-w-md mx-auto bg-[#257180] border-4 "> */}
      <Card className="w-full max-w-md mx-auto bg-gray-200 border-4 ">
        <CardHeader className="">
          <h1 className="text-center text-gray-800">Login into your account</h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <Input ref={emailRef} type="text" bordered  label='Email'/>
              
            </div>
            <div className="mb-4">
              <Input ref={passwordRef} type="password" bordered  label='Password'/>
            </div>
            <div className="flex justify-center">
              <Button type="submit" className="w-full btn-login rounded-3xl bg-[#77CDFF]">
                Login
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
