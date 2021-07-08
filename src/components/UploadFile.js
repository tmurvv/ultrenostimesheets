// packages
import React, { useState, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// internal
import LoginSignupCSS from '../styles/LoginSignup.css';
import PageTitle from '../components/PageTitle';
import Spinner from '../components/Spinner';
import {UserContext} from '../contexts/UserContext';

function DownloadTimesheets({setPage}) {
    // declare variables
    const [numSheets, setNumSheets] = useState();
    const [userLogin, setUserLogin] = useState({
        loginemail: '',
        loginpassword: '',
        loginchange: false
    });
    
    // set environment
    useEffect(()=>{
        if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
    },[]);
    
    return ( 
       <>
        <div className='login-signup-container'>
            <PageTitle maintitle='Upload Works in Progress List' subtitle={`The listings uploaded here will replace all of the listings in the timesheet "job name" select box.`} />
            <Spinner />
            
            <div className="form-container" style={{marginTop: '50px'}}>
                <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    {/* <form action="http://localhost:3000/api/v1/ultrenostimesheets/admin/uploadwips" encType="multipart/form-data" method="post" style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}> */}
                    <form action="https://take2tech.herokuapp.com/api/v1/ultrenostimesheets/admin/uploadwips" encType="multipart/form-data" method="post" style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                        <input type="file" name="file-to-upload" style={{margin: '0 0 30px 55px', textAlign: 'center'}} required/>
                        <button type='Submit' onClick={()=>window.confirm('This upload will replace all of the selections in the "job name" select box. Continue?')} className="submit-btn login-signup-title" style={{boxShadow: '3px 3px 3px lightgrey', width: '150px', margin: 'auto'}}>
                            Upload WIPs List
                        </button>
                    </form>
                </div>
            </div>
            
            <LoginSignupCSS />
        </div>
        </>
    )
}

export default DownloadTimesheets;
