
import { Button, Textarea} from '@nextui-org/react'
import { useNavigate, useParams } from 'react-router-dom'
import ApprovalPPBView from './ApprovalPPBView'
import { createRef } from 'react'
import axiosClient from '../../axios-client'


export default function ApprovalDetail() {
    const navigate = useNavigate()
    const { param,param2 } = useParams()
    const remarksRef = createRef()
    
    const btnBack = () => [navigate('/approval')]

    const btnApprove = () => {
      const payload = {
        id: param,
        tipe: param2,
        remarks: remarksRef.current.value
      }
      axiosClient
        .post('/approval/approve', payload)
        .then(({}) => {
          console.log('Success Approve')
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
    const btnReturn = () => {
      const payload = {
        id: param,
        tipe: param2,
        remarks: remarksRef.current.value
      }
      axiosClient
        .post('/approval/return', payload)
        .then(({}) => {
          console.log('Success Return')
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
    const btnReject = () => {
      const payload = {
        id: param,
        tipe: param2,
        remarks: remarksRef.current.value
      }
      axiosClient
        .post('/approval/reject', payload)
        .then(({}) => {
          console.log('Success Reject')
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
        </div>
        <div className='flex justify-between p-4'>
            <div className="flex items-center gap-2 ">
                <Button className="bg-green-300" onClick={btnApprove}>
                    Approve
                </Button>
                <Button className="bg-yellow-300" onClick={btnReturn}>
                    Return
                </Button>
                <Button className="bg-red-300" onClick={btnReject}>
                    Reject
                </Button>
            </div>
            <div className="w-2/4">
                <Textarea
                    id="remarks"
                    ref = {remarksRef}
                    variant="bordered"
                    className="bg-white"
                    type="text"
                    label="Remarks"
                />
            </div>

        </div>
          
      </div>
    </div>
    
  )
}
