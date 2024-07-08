import { Outlet, Link, Navigate} from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";
import { useEffect } from "react";
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

export default function DefaultLayout(){

    const {user, token, setUser, setToken, notification} = useStateContext(); 

    if(!token){
        return <Navigate to ='/login'/>
    }

    const onLogout = ev => {
        ev.preventDefault()
    
        axiosClient.post('/logout')
          .then(() => {
            setUser({});
            setToken(null);
          })
      }
    
      useEffect(() => {
        axiosClient.get('/user')
          .then(({data}) => {
            setUser(data);
          })
      }, [])

      return (
        <div id="defaultLayout">
          <div style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}>
            <CDBSidebar textColor="#fff" backgroundColor="#5b08a7">
              <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large pt-3"></i>}>
                <a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
                  <img src={Logo} alt="gudang" style={{ maxBlockSize: "50px"}} />
                </a>
              </CDBSidebarHeader>
      
              <CDBSidebarContent className="sidebar-content">
                <CDBSidebarMenu>
                  <NavLink exact to="/dashboard" activeClassName="activeClicked">
                    <CDBSidebarMenuItem icon="columns">Dashboard</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact to="/users" activeClassName="activeClicked">
                    <CDBSidebarMenuItem icon="user">Users</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact to="/prinsipal" activeClassName="activeClicked">
                    <CDBSidebarMenuItem>Prinsipal</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact to="/permintaanPembelianBarang" activeClassName="activeClicked">
                    <CDBSidebarMenuItem>Permintaan Pembelian <br/> Barang Branson</CDBSidebarMenuItem>
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
        // <div id="defaultLayout">
        //   <aside>
        //     <img src={Logo} alt="gudang" style={{paddingLeft: "40px", maxBlockSize: "70px"}} />
        //     <Link to="/dashboard">Dashboard</Link>
        //     <Link to="/users">Users</Link>
        //   </aside>
        //   <div className="content">
        //     <header>
        //       <div>
        //         <img src="https://www.ptgmi.co.id/wp-content/uploads/2021/07/logo-gmi.png" alt="gudang" style={{maxBlockSize: "50px"}} />
        //       </div>
        //       <div>
        //         {user.name} &nbsp; &nbsp;
        //         <a onClick={onLogout} className="btn-logout" href="#">Logout</a>
        //       </div>
        //     </header>
        //     <main style={{backgroundColor: "whitesmoke", minHeight: "100vh"}}>
        //       <Outlet/>
        //     </main>
        //     {notification &&
        //       <div className="notification">
        //         {notification}
        //       </div>
        //     }
        //   </div>
        // </div>
}