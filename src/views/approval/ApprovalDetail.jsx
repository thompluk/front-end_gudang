
import { Button, Modal, ModalBody, ModalContent, ModalHeader, Textarea} from '@nextui-org/react'
import { useNavigate, useParams } from 'react-router-dom'
import ApprovalPPBView from './ApprovalPPBView'
import { createRef, useState } from 'react'
import axiosClient from '../../axios-client'
import ApprovalPOView from './ApprovalPOView'
import Swal from 'sweetalert2'


export default function ApprovalDetail() {
    const navigate = useNavigate()
    const { param,param2 } = useParams()
    const remarksRef = createRef()
    
    const btnBack = () => [navigate('/approval')]

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
  

    const btnApprove = () => {
      const payload = {
        id: param,
        tipe: param2,
        // remarks: remarksRef.current.value
      }
      axiosClient
        .post('/approval/approve', payload)
        .then(({}) => {
          console.log('Success Approve')
          Toast.fire({
            icon: "success",
            title: "Approve is successfully"
          });

          navigate('/approval')
        })
        .catch(err => {
          const response = err.response
          if (response && response.status === 400) {
            setMessage(response.data.message);
            setErrors(true);
          }
        })
      
    }

    const handleApprove = () => {

      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Approve it!"
      }).then((result) => {
        if (result.isConfirmed) {
          btnApprove();
        }
      });
  
      
    };

    const btnReturn = (remarks) => {
      const payload = {
        id: param,
        tipe: param2,
        remarks: remarks
      }
      axiosClient
        .post('/approval/return', payload)
        .then(({}) => {
          console.log('Success Return')
          Toast.fire({
            icon: "success",
            title: "Return is successfully"
          });

          navigate('/approval')
        })
        .catch(err => {
          const response = err.response
          if (response && response.status === 400) {
            setMessage(response.data.message);
            setErrors(true);
          }
        })
      
    }
    const btnReject = (remarks) => {
      const payload = {
        id: param,
        tipe: param2,
        remarks: remarks
      }
      axiosClient
        .post('/approval/reject', payload)
        .then(({}) => {
          console.log('Success Reject')
          Toast.fire({
            icon: "success",
            title: "Reject is successfully"
          });

          navigate('/approval')
        })
        .catch(err => {
          const response = err.response
          if (response && response.status === 400) {
            setMessage(response.data.message);
            setErrors(true);
          }
        })
      
    }

    const handleClick = async (tipe) => {
      const { value: text } = await Swal.fire({
          title: "Enter your " + tipe + " Remarks",
          input: "textarea",
          inputLabel: "Remarks",
          inputPlaceholder: "Type your remarks message here...",
          inputAttributes: {
              "aria-label": "Type your remarks message here"
          },
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return "You need to write something!";
            }
          }
      });
      if (text) {
        if(tipe === 'Return'){
          btnReturn(text);
        }else if(tipe === 'Reject'){
          btnReject(text);
        }
      }
  };

  return (
    <div className="bg-white p-4 rounded-large animated fadeInDown">
      <div className="flex-col items-center">
        <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid grey' }}>
          <h1>Approval</h1>
          <Button className="bg-red-300" onClick={btnBack}>
            Back
          </Button>
        </div>
        <div className='p-4'>
          {param2 == 'ppb' && (
            <ApprovalPPBView>
            </ApprovalPPBView>
          )}
          {param2 == 'po' && (
            <ApprovalPOView>
            </ApprovalPOView>
          )}
        </div>
        <div className='flex justify-between p-4'>
            <div className="flex items-center gap-2 ">
                <Button className="bg-green-300" onClick={handleApprove}>
                    Approve
                </Button>

                <Button className="bg-yellow-300" onClick={() => handleClick('Return')}>
                    Return
                </Button>
                <Button className="bg-red-300" onClick={() => handleClick('Reject')}>
                    Reject
                </Button>
            </div>
           
        </div>
          
      </div>
    </div>
    
  )
}
