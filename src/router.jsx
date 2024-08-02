import {createBrowserRouter} from "react-router-dom"

// import Login from "./views/login.jsx"
import Users from "./views/user/Users.jsx"
import UsersDetail from "./views/user/UsersDetail.jsx"
import NotFound from "./views/NotFound.jsx"
import Login from "./views/LoginUser.jsx"
import DefaultLayout from "./components/DefaultLayout.jsx"
import UserLayout from "./components/UserLayout.jsx"
import Dashboard from "./views/Dashboard.jsx"
import { Navigate } from "react-router-dom"
import Prinsipal from "./views/prinsipal/Prinsipal.jsx"
import PrinsipalDetail from "./views/prinsipal/PrinsipalDetail.jsx"
import PermintaanPembelianBarang from "./views/permintaanPembelianBarang/PermintaanPembelianBarang.jsx"
import PrinsipalTest from "./views/prinsipal copy/Prinsipal.jsx"
import PermintaanPembelianBarangDetail from "./views/permintaanPembelianBarang/PermintaanPembelianBarangDetail.jsx"
import Approval from "./views/approval/Approval.jsx"
import ApprovalDetail from "./views/approval/ApprovalDetail.jsx"

const router = createBrowserRouter( [
    {
        path: '/',
        element: <DefaultLayout/>, 
        children: [
            {
                path: '/',
                element: <Navigate to="/dashboard" />
            }, 
            {
                path: '/dashboard',
                element: <Dashboard/>
            }, 

            // users
            {
                path: '/users',
                element: <Users/>
            },
            {
                path: '/users/:param',
                element: <UsersDetail/>
            }, 
            {
                path: '/users/:param/:param2',
                element: <UsersDetail/>
            },

            // prinsipal
            
            {
                path: '/prinsipal',
                element: <Prinsipal/>
            },
            {
                path: '/prinsipal/:param',
                element: <PrinsipalDetail/>
            }, 
            {
                path: '/prinsipal/:param/:param2',
                element: <PrinsipalDetail/>
            },

            // permintaan pembelian barang
            
            {
                path: '/ppb',
                element: <PermintaanPembelianBarang/>
            },
            {
                path: '/ppb/:param',
                element: <PermintaanPembelianBarangDetail/>
            }, 
            {
                path: '/ppb/:param/:param2',
                element: <PermintaanPembelianBarangDetail/>
            },

            {
                path: '/approval',
                element: <Approval/>
            },
            {
                path: '/approval/:param',
                element: <ApprovalDetail/>
            }, 
            {
                path: '/approval/:param/:param2',
                element: <ApprovalDetail/>
            },
        ]
    },
    {
        path: '/',
        element: <UserLayout/>,
        children: [
            {
                path: '/login',
                element: <Login/>
            },
        ]
    },
    
    {
        path: '*',
        element: <NotFound/>
    }
])

export default router;