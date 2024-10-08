import {
    Button,
    Input,
  } from '@nextui-org/react'

import { useRef, useState, useEffect } from 'react';
import React from "react";
import { AiFillPrinter } from "react-icons/ai";
import axiosClient from '../../axios-client'
import { useNavigate, useParams } from 'react-router-dom'

export default function Profile() {
    const navigate = useNavigate()
    const [profileData, setProfileData] = useState([])

    const btnBack = () => [
        navigate('/dashboard')
    ]

    useEffect(() => {
        getProfile();
      }, [])

    const getProfile = () => {
        axiosClient
          .get('/user')
          .then(({ data }) => {
            setProfileData(data)
            console.log(data)
          })
          .catch(() => {
          })
    }

      return (
        <div className=" p-4 rounded-large animated fadeInDown mx-auto w-[900px]">
            {/* <div className='flex p-4 w-full justify-end'>
                <h3>
                        {profileData.name}
                </h3>
                <hr />
                <Button className="bg-red-300" onClick={btnBack}>
                    Back
                </Button>
            </div> */}
            <div className='flex p-4 w-full justify-between border rounded-3xl gap-4 bg-sky-50'>
                <div className='flex justify-center items-center pb-2'>
                    <iframe src="https://giphy.com/embed/vR1dPIYzQmkRzLZk2w" width="200" height="200" class="giphy-embed" allowFullScreen></iframe>
                </div>
                <div className='flex-col justify-center items-center w-full'>
                    <div className='flex p-4 w-full justify-between'>
                        <h3>
                                {profileData.name}
                        </h3>
                        <Button className="bg-red-300" onClick={btnBack}>
                            Back
                        </Button>
                    </div>
                    <hr/>
                    <p>
                        {profileData.email}
                    </p>
                    <p>
                        {profileData.phone_number}
                    </p>
                    <p>
                        {profileData.role}
                    </p>
                    {/* <Input 
                        className='pb-2'
                        value={profileData.name} 
                        label='Nama' 
                        variant='bordered'>
                    </Input>
                    <Input 
                        className='pb-2'
                        value={profileData.email} 
                        label='Email' 
                        variant='bordered'>
                    </Input>
                    <Input 
                        className='pb-2'
                        value={profileData.phone_number} 
                        label='Phone Number' 
                        variant='bordered'
                        >
                    </Input>
                    <Input 
                        className='pb-2'
                        value={profileData.role} 
                        label='Role' 
                        variant='bordered'
                        isReadOnly>
                    </Input> */}
                </div>
            </div>
        </div>

      )
}