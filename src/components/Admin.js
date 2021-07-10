// packages
import React, { useState, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// internal
import LoginSignupCSS from '../styles/LoginSignup.css';
import PageTitle from '../components/PageTitle';
import Spinner from '../components/Spinner';
import {UserContext} from '../contexts/UserContext';

function Admin({setPage}) {
    // declare variables
    const [numSheets, setNumSheets] = useState();
    const [userLogin, setUserLogin] = useState({
        loginemail: '',
        loginpassword: '',
        loginchange: false
    });
    
    // set environment
    useEffect(()=>{
        window&&window.scrollTo(0,0);
        if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
    },[]);
    useEffect(()=>{
        const numSheets = async () => {
            // const res = await axios.get('http://localhost:3000/api/v1/ultrenostimesheets/admin/numtimesheets');
            const res = await axios.get('https://take2tech.herokuapp.com/api/v1/ultrenostimesheets/admin/numtimesheets');
            console.log('numsheets',res.data)
            setNumSheets(res.data.numsheets);
        }
        numSheets();
    },[]);
    return ( 
       <>
       <Spinner />
       <div className='login-signup-container' style={{minHeight: 'unset', paddingBottom: '0px'}}>
            <PageTitle maintitle='Download Timesheets' subtitle={`${numSheets} timesheet${numSheets===1?'':'s'} ready for download`} />          
            <div className="form-container" style={{marginTop: '50px'}}>
                <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    <button type='button' className="submit-btn login-signup-title" style={{boxShadow: '3px 3px 3px lightgrey', width: '150px', margin: 'auto'}} onClick={()=>{if (!window.navigator.onLine) {window.alert('No network connection.')}}}>
                        <a href='http://localhost:3000/api/v1/ultrenostimesheets/admin/downloadtimesheets' onClick={()=>setPage('Homepage')} style={{textDecoration: 'none', fontFamily: 'sans-serif', letterSpacing: '2px', fontSize: '14px', color: 'white'}}>Download Timesheets</a>
                        <a href='https://take2tech.herokuapp.com/api/v1/ultrenostimesheets/admin/downloadtimesheets' onClick={()=>setPage('Homepage')} style={{textDecoration: 'none', fontFamily: 'sans-serif', letterSpacing: '2px', fontSize: '14px', color: 'white'}}>Download Timesheets</a>
                    </button>
                </div>
            </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
            <img src="/img/tapered_line_blue.png" alt='tapered blue dividing line' style={{minWidth: '80%', height: '50px'}}/>
        </div>
        <div className='login-signup-container'>
            <PageTitle maintitle='Upload Works in Progress List' subtitle={`The listings uploaded here will replace all of the listings in the timesheet "job name" select box.`} />

            <div className="form-container" style={{marginTop: '50px'}}>
                <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    {/* <form action="http://localhost:3000/api/v1/ultrenostimesheets/admin/uploadjoblist" encType="multipart/form-data" method="post" style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}> */}
                    <form action="https://take2tech.herokuapp.com/api/v1/ultrenostimesheets/admin/uploadjoblist" encType="multipart/form-data" method="post" style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                        <input type="file" name="file-to-upload" style={{margin: '0 0 30px 55px', textAlign: 'center'}} required/>
                        <button type='Submit' onClick={(e)=>{if (window.navigator.onLine) {alert('This upload replaces all of the selections in the "job name" select box.')}else{e.preventDefault(); alert('No network connection.'); return false;}}} className="submit-btn login-signup-title" style={{boxShadow: '3px 3px 3px lightgrey', width: '150px', margin: 'auto'}}>
                            Upload WIPs List
                        </button>
                    </form>
                </div>
            </div>
            <h3 style={{textAlign: 'center'}}>Sample</h3>
            <p style={{textAlign: 'center'}}>Your file should look like this with as many rows as required:</p>
            <div style={{display: 'flex', justifyContent:'center', width: '100%'}}>   
                <img src="/img/joblistexample.png" alt="job list example file" style={{border: '1px solid lightgrey', padding: '15px', margin: 'auto', width: '80%', maxWidth: '400px'}}/>
            </div>
            
            <LoginSignupCSS />
        </div>
        <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
            <img src="/img/tapered_line_blue.png" alt='tapered blue dividing line' style={{minWidth: '80%', height: '50px'}}/>
        </div>
        <div className='login-signup-container'>
            <PageTitle maintitle='Upload Tasks List' subtitle={`The tasks uploaded here will replace all of the tasks in the timesheet "task" select box.`} />

            <div className="form-container" style={{marginTop: '50px'}}>
                <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    {/* <form action="http://localhost:3000/api/v1/ultrenostimesheets/admin/uploadjoblist" encType="multipart/form-data" method="post" style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}> */}
                    <form action="https://take2tech.herokuapp.com/api/v1/ultrenostimesheets/admin/uploadjoblist" encType="multipart/form-data" method="post" style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                        <input type="file" name="file-to-upload" style={{margin: '0 0 30px 55px', textAlign: 'center'}} required/>
                        {/* <button type='Submit' onClick={()=>window.confirm('This upload will replace all of the selections in the "task" select box. Continue?')} className="submit-btn login-signup-title" style={{boxShadow: '3px 3px 3px lightgrey', width: '150px', margin: 'auto'}}> */}
                        <button type='Submit' onClick={(e)=>{e.preventDefault(); window.alert('This feature coming soon.');}} className="submit-btn login-signup-title" style={{boxShadow: '3px 3px 3px lightgrey', width: '150px', margin: 'auto'}}>
                            Upload Tasks List
                        </button>
                    </form>
                </div>
                
            </div>
            <h3 style={{textAlign: 'center'}}>Sample</h3>
            <p style={{textAlign: 'center'}}>Your file should look like this with as many rows as required:</p>
            <div style={{display: 'flex', justifyContent:'center', width: '100%'}}>   
                <img src="/img/tasklistexample.png" alt="job list example file" style={{border: '1px solid lightgrey', padding: '15px', margin: 'auto', width: '80%', maxWidth: '400px'}}/>
            </div>
            
            <LoginSignupCSS />
        </div>
        
        </>
    )
}

export default Admin;
