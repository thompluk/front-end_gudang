import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
  } from '@nextui-org/react'

import { useRef, useState, useEffect, createRef } from 'react';
import React from "react";
import { AiFillPrinter } from "react-icons/ai";
import axiosClient from '../../axios-client'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2';

export default function Profile() {
    const navigate = useNavigate()
    const [profileData, setProfileData] = useState([])
    const [isModalPasswordOpen, setIsModalPasswordOpen] = useState(false);
    const passwordLamaRef = createRef();
    const passwordBaruRef = createRef();
    const passwordKonfirmasiRef = createRef();

    const handleModalPasswordOpen = () => {
        setIsModalPasswordOpen(true);
    };

    const handleModalPasswordClose = () => {  
        setIsModalPasswordOpen(false);
    };

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

    const btnUbahPassword = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Post it!"
          }).then((result) => {
            const payload = {
                password_lama: passwordLamaRef.current.value,
                password_baru: passwordBaruRef.current.value,
                password_konfirmasi: passwordKonfirmasiRef.current.value
            }
            if (result.isConfirmed) {
                axiosClient
                .post('/ubahPassword', payload)
                .then(({}) => {
                    Toast.fire({
                    icon: "success",
                    title: "Ubah Password is successfully"
                    }); 
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
          });
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
                    <div className='flex w-full justify-between'>
                        <h3>
                                {profileData.name}
                        </h3>
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
                    <div className='w-full flex justify-end'>
                        <Button className='bg-yellow-300' onClick={handleModalPasswordOpen}>
                            Ubah Password
                        </Button>
                    </div>
                    <Modal isOpen={isModalPasswordOpen} onOpenChange={handleModalPasswordClose} size='xl'>
                        <ModalContent>
                        {(onClose) => (
                            <>
                            <ModalHeader className="flex flex-col gap-1">Ubah Password</ModalHeader>
                            <ModalBody>
                            <Input ref={passwordLamaRef} type ="password" variant='bordered' label="Password Lama" placeholder="Password Lama" />
                            <Input ref={passwordBaruRef} type ="password" variant='bordered' label="Password Baru" placeholder="Password Baru" />
                            <Input ref={passwordKonfirmasiRef} type ="password" variant='bordered' label="Password Konfirmasi" placeholder="Password Konfirmasi" />
                            <div className='flex justify-end'>
                                <Button className='bg-red-300' onClick={onClose}>Batal</Button>
                                <Button className='bg-green-300' onClick={btnUbahPassword}>Simpan</Button>
                            </div>
                            </ModalBody>
                            </>
                        )}
                        </ModalContent>
                    </Modal>
                </div>
            </div>
        </div>
      )
}