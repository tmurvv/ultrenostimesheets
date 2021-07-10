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
    useEffect(()=>{
        const numSheets = async () => {
            const res = await axios.get('http://localhost:3000/api/v1/ultrenostimesheets/numtimesheets');
            // const res = await axios.get('https://take2tech.herokuapp.com/api/v1/ultrenostimesheets/numtimesheets');
            setNumSheets(res.data.numsheets);
        }
        numSheets();
    },[]);
    return ( 
       <>
        <div className='login-signup-container'>
            <PageTitle maintitle='Download Timesheets' subtitle={`${numSheets} timesheet${numSheets===1?'':'s'} ready for download`} />
            <Spinner />
            
            <div className="form-container" style={{marginTop: '50px'}}>
                <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    <button type='button' className="submit-btn login-signup-title" style={{boxShadow: '3px 3px 3px lightgrey', width: '150px', margin: 'auto'}}>
                        {/* <a href='http://localhost:3000/api/v1/ultrenostimesheets/downloadtimesheets' onClick={()=>setNumSheets('Refresh window for number of ')} style={{textDecoration: 'none', fontFamily: 'sans-serif', letterSpacing: '2px', fontSize: '14px', color: 'white'}}>Download Timesheets</a> */}
                        <a href='https://take2tech.herokuapp.com/api/v1/ultrenostimesheets/downloadtimesheets' onClick={()=>setNumSheets('Refresh window for number of ')} style={{textDecoration: 'none', fontFamily: 'sans-serif', letterSpacing: '2px', fontSize: '14px', color: 'white'}}>Download Timesheets</a>
                    </button>
                </div>
            </div>
            <LoginSignupCSS />
        </div>
        </>
    )
}

export default DownloadTimesheets;
