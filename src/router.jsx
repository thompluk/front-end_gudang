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
import PermintaanPembelianBarangDetail from "./views/permintaanPembelianBarang/PermintaanPembelianBarangDetail.jsx"
import Approval from "./views/approval/Approval.jsx"
import ApprovalDetail from "./views/approval/ApprovalDetail.jsx"
import PurchaseOrder from "./views/purchaseOrder/PurchaseOrder.jsx"
import PurchaseOrderDetail from "./views/purchaseOrder/PurchaseOrderDetail.jsx"
import Companies from "./views/companies/Companies.jsx"
import CompaniesDetail from "./views/companies/CompaniesDetail.jsx"
import PurchaseOrderUmum from "./views/purchaseOrderUmum/PurchaseOrderUmum.jsx"
import PurchaseOrderUmumDetail from "./views/purchaseOrderUmum/PurchaseOrderUmumDetail.jsx"
import StockItem from "./views/stockItem/StockItem.jsx"
import StockItemDetail from "./views/stockItem/StockItemDetail.jsx"
import SuratJalan from "./views/suratJalan/SuratJalan.jsx"
import SuratJalanDetail from "./views/suratJalan/SuratJalanDetail.jsx"
import StockItemArrival from "./views/stockItem/StockItemArrival.jsx"
import StockItemInitial from "./views/stockItem/StockItemInitial.jsx"
import StockMaterial from "./views/stockMaterial/StockMaterial.jsx"
import BuktiPengeluaranBarang from "./views/buktiPengeluaranBarang/BuktiPengeluaranBarang.jsx"
import BuktiPengeluaranBarangDetail from "./views/buktiPengeluaranBarang/BuktiPengeluaranBarangDetail.jsx"
import BuktiPengeluaranBarangUmum from "./views/buktiPengeluaranBarangUmum/BuktiPengeluaranBarangUmum.jsx"
import BuktiPengeluaranBarangDetailUmum from "./views/buktiPengeluaranBarangUmum/BuktiPengeluaranBarangUmumDetail.jsx"
import PrintPO from "./views/print/PrintPO.jsx"
import PrintPPB from "./views/print/PrintPPB.jsx"
import PrintBPB from "./views/print/PrintBPB.jsx"
import Profile from "./views/profile/Profile.jsx"
import PermintaanPembelianBarangUmum from "./views/permintaanPembelianBarangUmum/PermintaanPembelianBarangUmum.jsx"
import PermintaanPembelianBarangUmumDetail from "./views/permintaanPembelianBarangUmum/PermintaanPembelianBarangUmumDetail.jsx"
import BpbDelivery from "./views/bpbDelivery/BpbDelivery.jsx"
import BpbDeliveryDetail from "./views/bpbDelivery/BpbDeliveryDetail.jsx"
import PoDelivery from "./views/poDelivery/PoDelivery.jsx"
import PoDeliveryDetail from "./views/poDelivery/PoDeliveryDetail.jsx"
import SuratJalanUmum from "./views/suratJalanUmum/SuratJalanUmum.jsx"
import SuratJalanUmumDetail from "./views/suratJalanUmum/SuratJalanUmumDetail.jsx"
import PengembalianBarang from "./views/pengembalianBarang/PengembalianBarang.jsx"
import PengembalianBarangDetail from "./views/pengembalianBarang/PengembalianBarangDetail.jsx"
import PrintSuratJalan from "./views/print/PrintSuratJalan.jsx"
import Redirect from "./views/Redirect.jsx"


const router = createBrowserRouter([
    {
        path: '/',
        element:<DefaultLayout/>,
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

            // companies
            
            {
                path: '/companies',
                element: <Companies/>
            },
            {
                path: '/companies/:param',
                element: <CompaniesDetail/>
            }, 
            {
                path: '/companies/:param/:param2',
                element: <CompaniesDetail/>
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
                path: '/ppbumum',
                element: <PermintaanPembelianBarangUmum/>
            },
            {
                path: '/ppbumum/:param',
                element: <PermintaanPembelianBarangUmumDetail/>
            }, 
            {
                path: '/ppbumum/:param/:param2',
                element: <PermintaanPembelianBarangUmumDetail/>
            },

            {
                path: '/po',
                element: <PurchaseOrder/>
            },
            {
                path: '/po/:param',
                element: <PurchaseOrderDetail/>
            }, 
            {
                path: '/po/:param/:param2',
                element: <PurchaseOrderDetail/>
            },
            
            {
                path: '/podelivery',
                element: <PoDelivery/>
            },
            {
                path: '/podelivery/:param',
                element: <PoDeliveryDetail/>
            }, 
            {
                path: '/podelivery/:param/:param2',
                element: <PoDeliveryDetail/>
            },

            {
                path: '/poumum',
                element: <PurchaseOrderUmum/>
            },
            {
                path: '/poumum/:param',
                element: <PurchaseOrderUmumDetail/>
            }, 
            {
                path: '/poumum/:param/:param2',
                element: <PurchaseOrderUmumDetail/>
            },

            {
                path: '/stockitem',
                element: <StockItem/>
            },
            {
                path: '/stockitem/:param',
                element: <StockItemDetail/>
            }, 
            {
                path: '/stockitem/:param/:param2',
                element: <StockItemDetail/>
            },
            {
                path: '/stockitemarrival/:param',
                element: <StockItemArrival/>
            },
            {
                path: '/stockiteminitial/:param/:param2',
                element: <StockItemInitial/>
            },

            {
                path: '/stockmaterial',
                element: <StockMaterial/>
            },

            {
                path: '/suratjalan',
                element: <SuratJalan/>
            },
            {
                path: '/suratjalan/:param',
                element: <SuratJalanDetail/>
            }, 
            {
                path: '/suratjalan/:param/:param2',
                element: <SuratJalanDetail/>
            },

            {
                path: '/suratjalanumum',
                element: <SuratJalanUmum/>
            },
            {
                path: '/suratjalanumum/:param',
                element: <SuratJalanUmumDetail/>
            }, 
            {
                path: '/suratjalanumum/:param/:param2',
                element: <SuratJalanUmumDetail/>
            },

            {
                path: '/bpb',
                element: <BuktiPengeluaranBarang/>
            },
            {
                path: '/bpb/:param',
                element: <BuktiPengeluaranBarangDetail/>
            }, 
            {
                path: '/bpb/:param/:param2',
                element: <BuktiPengeluaranBarangDetail/>
            },

            {
                path: '/bpbdelivery',
                element: <BpbDelivery/>
            },
            {
                path: '/bpbdelivery/:param',
                element: <BpbDeliveryDetail/>
            }, 
            {
                path: '/bpbdelivery/:param/:param2',
                element: <BpbDeliveryDetail/>
            },

            {
                path: '/bpbumum',
                element: <BuktiPengeluaranBarangUmum/>
            },
            {
                path: '/bpbumum/:param',
                element: <BuktiPengeluaranBarangDetailUmum/>
            }, 
            {
                path: '/bpbumum/:param/:param2',
                element: <BuktiPengeluaranBarangDetailUmum/>
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

            {
                path: '/pengembalianbarang',
                element: <PengembalianBarang/>
            },
            {
                path: '/pengembalianbarang/:param',
                element: <PengembalianBarangDetail/>
            }, 
            {
                path: '/pengembalianbarang/:param/:param2',
                element: <PengembalianBarangDetail/>
            },

            //print
            {
                path: '/printPPB/:param/',
                element: <PrintPPB/>
            },
            {
                path: '/printPO/:param/',
                element: <PrintPO/>
            },
            {
                path: '/printBPB/:param/',
                element: <PrintBPB/>
            },
            {
                path: '/printSuratJalan/:param/',
                element: <PrintSuratJalan/>
            },
            //

            //profile
            {
                path: '/profile',
                element: <Profile/>
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
        path: '/login',
        element: <Login/>
    },
    {
        path: '/redirect',
        element: <Redirect/>
    },
    {
        path: '*',
        element: <NotFound/>
    }
])

export default router;