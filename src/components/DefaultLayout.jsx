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

export default function DefaultLayout(){

    const {user, token, setUser, setToken, notification} = useStateContext(); 
    const [approval, setApproval] = useState([])

    

    const onLogout = ev => {
        ev.preventDefault()
    
        axiosClient.post('/logout')
          .then(() => {
            setToken(null);
            setUser({});
          })
      }
    
      useEffect(() => {

        if (!token) {
          return; // Exit useEffect if there is no token
        }

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
        console.log(approval.length)
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
                  <NavLink exact to="/users">
                    <CDBSidebarMenuItem icon="user">Users</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact to="/prinsipal" >
                    <CDBSidebarMenuItem>Prinsipal</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact to="/companies" >
                    <CDBSidebarMenuItem>Companies</CDBSidebarMenuItem>
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
                  <NavLink exact to="/stockitem">
                    <CDBSidebarMenuItem>Stock Item</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact to="/stockmaterial">
                    <CDBSidebarMenuItem>Stock Material</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact to="/suratjalan">
                    <CDBSidebarMenuItem>Surat Jalan</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact to="/bpb">
                    <CDBSidebarMenuItem>Bukti Pengeluaran Barang</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact to="/bpbumum">
                    <CDBSidebarMenuItem>Bukti Pengeluaran Barang Umum</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact to="/approval">
                  <CDBSidebarMenuItem className="flex">
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
                {user.name} &nbsp; &nbsp;
                {/* <a onClick={onLogout} className="btn-logout" href="#">Logout</a> */}
              </div>
            </header>
            <main style={{backgroundColor: "rgb(230, 230, 230)", minHeight: "100vh"}}>
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