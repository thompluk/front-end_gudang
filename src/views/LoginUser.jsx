import { Link, Navigate } from 'react-router-dom'
import axiosClient from '../axios-client.js'
import { createRef } from 'react'
import { useState } from 'react'
import { useStateContext } from '../contexts/ContextProvider.jsx'
import { Card, CardHeader, CardBody, Input, Button } from '@nextui-org/react'

export default function Login() {
  const emailRef = createRef()
  const passwordRef = createRef()
  const { setUser, setToken } = useStateContext()
  const [message, setMessage] = useState(null)

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
      })
      .catch(err => {
        const response = err.response
        if (response && response.status === 422) {
          setMessage(response.data.message)
        }
      })
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-400">
      <Card className="w-full max-w-md mx-auto bg-[#5b08a7]">
        <CardHeader className="border-b-1">
          <h1 className="text-center text-gray-200">Login into your account</h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <Input ref={emailRef} type="email" placeholder="Email" bordered  title='Email'  />
              
            </div>
            <div className="mb-4">
              <Input ref={passwordRef} type="password" placeholder="Password" bordered  title='Password' />
            </div>
            <div>
              <Button type="submit" className="w-full btn-login">
                Login
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
