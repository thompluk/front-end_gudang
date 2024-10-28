import { Outlet, Link, Navigate} from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";
import { useEffect, useState } from "react";
import Logo from "../assets/image.png"
import React from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';
import NotificationIcon from '../assets/notification.png'
import RedDot from '../assets/record-button.png'
import { AiFillCaretRight } from "react-icons/ai";
import { AiFillCaretDown } from "react-icons/ai";
import { AiFillAppstore } from "react-icons/ai";
import router from "../router";

export default function DefaultLayout(){

    const {user, token, setUser, setToken, notification} = useStateContext(); 
    const [approval, setApproval] = useState([])
    const [po, setPo] = useState([])
    const [bpb, setBpb] = useState([])

    const [isExpanded, setIsExpanded] = useState(false);
    const [isExpanded1, setIsExpanded1] = useState(false);
    const [isExpanded2, setIsExpanded2] = useState(false);
    const [isExpanded3, setIsExpanded3] = useState(false);
    const [isExpanded4, setIsExpanded4] = useState(false);
    const [isExpanded5, setIsExpanded5] = useState(false);

    const toggleExpand = () => {
      setIsExpanded(!isExpanded);
    };
    const toggleExpand1 = () => {
      setIsExpanded1(!isExpanded1);
    };

    const toggleExpand2 = () => {
      setIsExpanded2(!isExpanded2);
    };
    const toggleExpand3 = () => {
      setIsExpanded3(!isExpanded3);
    };
    const toggleExpand4 = () => {
      setIsExpanded4(!isExpanded4);
    };
    const toggleExpand5 = () => {
      setIsExpanded5(!isExpanded5);
    };

    const onLogout = ev => {
        ev.preventDefault()
    
        axiosClient.post('/logout')
          .then(() => {
            setToken(null);
            setUser({});
          })
      }

    const initializeApp = () => {
      axiosClient.get('/user')
        .then(({data}) => {
          setUser(data);
        })
      axiosClient.get('/allindexApproval')
        .then(response => {
          if (response.data.data) {
            setApproval(response.data.data);
          } else {
            setApproval([]);
          }
          console.log(response.data.data)
      })
      axiosClient.get('/allpodelivery')
        .then(response => {
          if (response.data.data) {
            setPo(response.data.data);
          } else {
            setPo([]);
          }
          console.log(response.data.data)
      })
      // axiosClient.get('/allbpbdelivery')
      //   .then(response => {
      //     if (response.data.data) {
      //       setBpb(response.data.data);
      //     } else {
      //       setBpb([]);
      //     }
      //     console.log(response.data.data)
      // })
    }
      
    useEffect(() => {

      if (!token) {
        return; // Exit useEffect if there is no token
      }
      initializeApp();
    }, [])

    if(!token){
      return <Navigate to ='/login'/>
    }

      return (
        <div id="defaultLayout">
          <div style={{ display: 'flex', height: 'full', overflow: 'scroll initial' }}>
            <CDBSidebar textColor="#fff" backgroundColor="#5b08a7">
              <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large pt-3"></i>}>
                <a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
                  <img src={Logo} alt="gudang" style={{ maxBlockSize: "50px"}} />
                </a>
              </CDBSidebarHeader>
      
              <CDBSidebarContent className="sidebar-content">
                <CDBSidebarMenu>
                  <NavLink exact to="/dashboard">
                    <CDBSidebarMenuItem icon="columns">Dashboard</CDBSidebarMenuItem>
                  </NavLink>

                  {/* <NavLink exact to="/users">
                    <CDBSidebarMenuItem >Users</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact to="/prinsipal">
                    <CDBSidebarMenuItem >Prinsipal</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact to="/companies">
                    <CDBSidebarMenuItem >Companies</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact to="/ppb">
                    <CDBSidebarMenuItem>Permintaan Pembelian Barang</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact to="/po">
                    <CDBSidebarMenuItem>Purchase Order</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact to="/poumum">
                    <CDBSidebarMenuItem>Purchase Order Umum</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact to="/bpb">
                    <CDBSidebarMenuItem>Bukti Pengeluaran Barang</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact to="/bpbumum">
                    <CDBSidebarMenuItem>Bukti Pengeluaran Barang Umum</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact to="/suratjalan">
                    <CDBSidebarMenuItem>Surat Jalan</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact to="/stockitem">
                    <CDBSidebarMenuItem>Stock Item</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact to="/stockmaterial">
                    <CDBSidebarMenuItem>Stock Material</CDBSidebarMenuItem>
                  </NavLink> */}

                  <CDBSidebarMenuItem icon="folder-open" onClick={toggleExpand}>
                    <div className="flex">
                      <div>Umum</div> <div className="pl-2 pt-1">{isExpanded ? <AiFillCaretDown /> : <AiFillCaretRight />}</div>
                    </div>
                  </CDBSidebarMenuItem>    
                  <div className="pl-4 animated fadeInDown" style={{ display: isExpanded ? "block" : "none"}} >
                    <NavLink exact to="/ppbumum">
                      <CDBSidebarMenuItem>Permintaan Pembelian Barang Umum</CDBSidebarMenuItem>
                    </NavLink>
                    <NavLink exact to="/poumum">
                      <CDBSidebarMenuItem>Purchase Order Umum</CDBSidebarMenuItem>
                    </NavLink>
                    <NavLink exact to="/bpbumum">
                      <CDBSidebarMenuItem>Bukti Pengeluaran Barang Umum</CDBSidebarMenuItem>
                    </NavLink>
                    <NavLink exact to="/suratjalanumum">
                      <CDBSidebarMenuItem>Surat Jalan Umum</CDBSidebarMenuItem>
                    </NavLink>
                  </div>

                  <CDBSidebarMenuItem icon="database" onClick={toggleExpand1}>
                    <div className="flex">
                      <div>Master Data</div> <div className="pl-2 pt-1">{isExpanded1 ? <AiFillCaretDown /> : <AiFillCaretRight />}</div>
                    </div>
                  </CDBSidebarMenuItem>    
                  <div className="pl-4 animated fadeInDown" style={{ display: isExpanded1 ? "block" : "none"}} >
                    <NavLink exact to="/users">
                      <CDBSidebarMenuItem >Users</CDBSidebarMenuItem>
                    </NavLink>
                    <NavLink exact to="/prinsipal">
                      <CDBSidebarMenuItem >Prinsipal</CDBSidebarMenuItem>
                    </NavLink>
                    <NavLink exact to="/companies">
                      <CDBSidebarMenuItem >Companies</CDBSidebarMenuItem>
                    </NavLink>
                  </div>

                  <CDBSidebarMenuItem icon="file" onClick={toggleExpand2}>
                    <div className="flex">
                      <div>Pengadaan</div> <div className="pl-2 pt-1">{isExpanded2 ? <AiFillCaretDown /> : <AiFillCaretRight />}</div>
                    </div>
                  </CDBSidebarMenuItem>
                  <div className="pl-4 animated fadeInDown" style={{ display: isExpanded2 ? "block" : "none"}} >
                    <NavLink exact to="/ppb">
                      <CDBSidebarMenuItem>Permintaan Pembelian Barang</CDBSidebarMenuItem>
                    </NavLink>
                    <NavLink exact to="/po">
                      <CDBSidebarMenuItem>Purchase Order</CDBSidebarMenuItem>
                    </NavLink>
                  </div>

                  <CDBSidebarMenuItem icon="file" onClick={toggleExpand3}>
                    <div className="flex">
                      <div>Pengeluaran Barang</div> <div className="pl-2 pt-1">{isExpanded3 ? <AiFillCaretDown /> : <AiFillCaretRight />}</div>
                    </div>
                  </CDBSidebarMenuItem>
                  <div className="pl-4 animated fadeInDown" style={{ display: isExpanded3 ? "block" : "none"}} >
                    <NavLink exact to="/bpb">
                      <CDBSidebarMenuItem>Bukti Pengeluaran Barang</CDBSidebarMenuItem>
                    </NavLink>
                    <NavLink exact to="/suratjalan">
                      <CDBSidebarMenuItem>Surat Jalan Proses</CDBSidebarMenuItem>
                    </NavLink>
                  </div>

                  <CDBSidebarMenuItem icon="box" onClick={toggleExpand4}>
                    <div className="flex">
                      <div className="flex gap-2">Warehouse 
                        <img 
                          src={RedDot}
                          alt="RedDot"
                          className="w-4 h-4"
                          hidden={po.length === 0}
                        />
                      </div> 
                      <div className="pl-2 pt-1">{isExpanded4 ? <AiFillCaretDown /> : <AiFillCaretRight />}</div>
                    </div>
                  </CDBSidebarMenuItem>
                  <div className="pl-4 animated fadeInDown" style={{ display: isExpanded4 ? "block" : "none"}} >
                    <NavLink exact to="/podelivery">
                      <CDBSidebarMenuItem>
                        <div className="flex gap-2">Outstanding PO 
                          <img 
                            src={RedDot}
                            alt="RedDot"
                            className="w-4 h-4"
                            hidden={po.length === 0}
                          />
                        </div> 
                      </CDBSidebarMenuItem>
                    </NavLink>
                    {/* <NavLink exact to="/bpbdelivery">
                      <CDBSidebarMenuItem>
                        <div className="flex gap-2">Outstanding BPB 
                          <img 
                            src={RedDot}
                            alt="RedDot"
                            className="w-4 h-4"
                            hidden={bpb.length === 0}
                          />
                        </div> 
                      </CDBSidebarMenuItem>
                    </NavLink> */}
                    <NavLink exact to="/pengembalianBarang">
                      <CDBSidebarMenuItem>Pengembalian Barang</CDBSidebarMenuItem>
                    </NavLink>

                  </div>

                  <CDBSidebarMenuItem icon="warehouse" onClick={toggleExpand5}>
                    <div className="flex">
                      <div>Stock</div> <div className="pl-2 pt-1">{isExpanded5 ? <AiFillCaretDown /> : <AiFillCaretRight />}</div>
                    </div>
                  </CDBSidebarMenuItem>
                  <div className="pl-4 animated fadeInDown" style={{ display: isExpanded5 ? "block" : "none"}} >
                    <NavLink exact to="/stockitem">
                      <CDBSidebarMenuItem>Stock Item</CDBSidebarMenuItem>
                    </NavLink>
                    <NavLink exact to="/stockmaterial">
                      <CDBSidebarMenuItem>Stock Material</CDBSidebarMenuItem>
                    </NavLink>
                  </div>
                  
                  <NavLink exact to="/approval">
                    <CDBSidebarMenuItem className="flex" icon="clipboard">
                      <div className="flex gap-2">
                        Approval
                        <img 
                          src={RedDot}
                          alt="RedDot"
                          className="w-4 h-4"
                          hidden={approval.length === 0}
                        />
                      </div>
                      
                    </CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact to="/profile">
                    <CDBSidebarMenuItem className="flex" icon="user">
                      Profile
                    </CDBSidebarMenuItem>
                  </NavLink>
                </CDBSidebarMenu>
              </CDBSidebarContent>
      
              <CDBSidebarFooter style={{ textAlign: 'center' }}>
                <div
                  style={{
                    padding: '20px 5px',
                  }}
                >
                    <div>
                      {/* {user.name} &nbsp; &nbsp; */}
                      <CDBSidebarMenuItem onClick={onLogout} href="#" >Logout</CDBSidebarMenuItem>
                      {/* <a className="btn-logout" >Logout</a> */}
                    </div>
                </div>
              </CDBSidebarFooter>
            </CDBSidebar>
          </div>
          <div className="content">
            <header>
              <div>
                <img src="https://www.ptgmi.co.id/wp-content/uploads/2021/07/logo-gmi.png" alt="gudang" style={{maxBlockSize: "50px"}} />
              </div>
              <div>
                {/* <NavLink exact to="/profile"> */}
                  {user.name} &nbsp; &nbsp;
                  {/* <a onClick={onLogout} className="btn-logout" href="#">Logout</a> */}
                {/* </NavLink> */}
              </div>
            </header>
            <main style={{backgroundColor: "rgb(230, 230, 230)", minHeight: "100vh", }}>
              <Outlet/>
            </main>
            {notification &&
              <div className="notification">
                {notification}
              </div>
            }
          </div>
        </div>
        
      );
}