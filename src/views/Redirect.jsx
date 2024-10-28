import { delay } from "framer-motion";
import { useEffect } from "react"

export default function Redirect(){
    useEffect(() => {
        delay(3000)
        window.location.reload();
        window.location.href = '/login';
    })
    return(
        <div className="flex justify-center items-center min-h-screen bg-gray-400">
           <h1>Redirect to Login page, please wait...</h1> 
        </div>
    )
}