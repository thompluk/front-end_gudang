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
    const [isSave, setIsSave] = useState(false);

    const [formData, setFormData] = useState({
        password_lama: '',
        password_baru: '',
        password_konfirmasi: '',
      })

    const handleModalPasswordOpen = () => {
        setIsModalPasswordOpen(true);
        setIsSave(false);
        setFormData({password_lama: '', password_baru: '', password_konfirmasi: ''})
    };

    const handleModalPasswordClose = () => {  
        setIsModalPasswordOpen(false);
        setIsSave(false);
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
        if(formData.password_lama === '' || formData.password_baru === '' || formData.password_konfirmasi === '') {
            setIsSave(true);
            console.log(isSave)
        }else{
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
                    password_lama: formData.password_lama,
                    password_baru: formData.password_baru,
                    password_konfirmasi: formData.password_konfirmasi
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
                } else{
                    setIsModalPasswordOpen(true);
                }
              });
        }
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
                {/* <div className='flex justify-center items-center pb-2'>
                    <iframe src="https://giphy.com/embed/vR1dPIYzQmkRzLZk2w" width="200" height="200" class="giphy-embed" allowFullScreen></iframe>
                </div> */}
                <div className='flex-col justify-center items-center w-full'>
                    <div className='flex w-full justify-between'>
                        <h3>
                                {profileData.name}
                        </h3>
                    </div>
                    <hr/>
                    <div className='flex w-full'>
                        <p className='w-1/5'>
                            Email
                        </p>
                        <p>
                            : {profileData.email}
                        </p>
                    </div>
                    <div className='flex w-full'>
                        <p className='w-1/5'>
                            Phone Number 
                        </p>
                        <p>
                            : {profileData.phone_number}
                        </p>
                    </div>
                    <div className='flex w-full'>
                        <p className='w-1/5'>
                            Role  
                        </p>
                        <p>
                            : {profileData.role}
                        </p>
                    </div>
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
                            <Input 
                                value={formData.password_lama} 
                                onChange={(e) => setFormData({ ...formData, password_lama: e.target.value })}
                                type ="password" 
                                variant='bordered' 
                                label="Password Lama" 
                                placeholder="Password Lama" 
                                isInvalid={formData.password_lama === "" && isSave == true} 
                                errorMessage={"Password Lama Tidak Boleh Kosong"}
                                />
                            <Input 
                                value={formData.password_baru} 
                                onChange={(e) => setFormData({ ...formData, password_baru: e.target.value })}
                                type ="password" 
                                variant='bordered' 
                                label="Password Baru" 
                                placeholder="Password Baru" 
                                isInvalid={formData.password_baru === "" && isSave == true} 
                                errorMessage={"Password Baru Tidak Boleh Kosong"}
                                />
                            <Input 
                                value={formData.password_konfirmasi} 
                                onChange={(e) => setFormData({ ...formData, password_konfirmasi: e.target.value })}
                                type ="password" 
                                variant='bordered' 
                                label="Password Konfirmasi" 
                                placeholder="Password Konfirmasi" 
                                isInvalid={formData.password_konfirmasi === "" && isSave == true} 
                                errorMessage={"Password Konfirmasi Tidak Boleh Kosong"}
                                />
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