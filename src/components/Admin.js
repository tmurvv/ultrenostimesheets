// packages
import {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import uuid from 'react-uuid';

// internal
import LoginSignupCSS from '../styles/LoginSignup.css';
import PageTitle from '../components/PageTitle';
import Spinner from '../components/Spinner';
import {UserContext} from '../contexts/UserContext';
import {AdminEditTimesheetsContext} from '../contexts/AdminEditTimesheetsContext';

function Admin({setPage}) {
    // declare variables
    const [numSheets, setNumSheets] = useState();
    const [newAllTimesheets, setNewAllTimesheets] = useState('new');
    const {setUser} = useContext(UserContext);
    const {setAdminEditTimesheets} = useContext(AdminEditTimesheetsContext);
    const [userLogin, setUserLogin] = useState({
        loginemail: 'portfolio@take2tech.ca',
        loginpassword: 'adminpassword',
        loginchange: false
    });
    const handleChange = (e) => {
        switch (e.target.name) {
            case 'loginemail': 
                setUserLogin({...userLogin, loginemail: e.target.value, loginchange: true});
                break
            case 'loginpassword': 
                setUserLogin({...userLogin, loginpassword: e.target.value, loginchange: true});
                break
            default :
        }
    }
    const handleSubmit = async (e) => {
        // start spinner
        if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="flex";         
        try {
            // login user
            const res = await axios.post(`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/users/login`, {email: userLogin.loginemail, password: userLogin.loginpassword});
            const returnedUser = res.data.data;
            // set user context to login user
            setUser({
                firstname: returnedUser.firstname, 
                lastname: returnedUser.lastname, 
                email: returnedUser.email
            });
            // stop spinner
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
            // set new environment
            setPage('Homepage');
            setAdminEditTimesheets(true);
        } catch(e) {
            // log error
            console.log('error', e.message)
            console.log(e.response)
            // email not found
            if (e.response&&e.response.data&&e.response.data.message&&e.response.data.message==="User not found.") {
                if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
                return setTimeout(()=>{alert('Email not found.')}, 200);
            } 
            // password does not match
            if (e.response&&e.response.data&&e.response.data.message&&e.response.data.message==="Password does not match our records.") {
                if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
                return setTimeout(()=>{alert('Password does not match our records.')},200);
            }
            // stop spinner
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none"; 
            // in-app message to user  
            setTimeout(()=>{alert('Login not successful. Please check network connection.')}, 200);
        }
    }
    // set environment
    useEffect(()=>{
        window&&window.scrollTo(0,0);
        if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
    },[]);
    // get number of timesheets ready for download
    useEffect(()=>{
        const numSheets = async () => {
            const res = await axios.get(`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/admin/numtimesheets`);
            setNumSheets(res.data.numsheets);
        }
        numSheets();
    },[]);
    return ( 
    <>
        <Spinner />

        {/* Download Timesheets */}
        <div className='login-signup-container' style={{minHeight: 'unset', paddingBottom: '25pxpx'}}>
            <PageTitle maintitle='Download Timesheets' subtitle={`${numSheets} new timesheet${numSheets===1?'':'s'} ready for download`} />          
            <form onClick={e => setNewAllTimesheets(e.target.value)} className="form-container" style={{marginTop: '50px', display: 'flex', justifyContent: 'space-evenly'}}>
                <input type="radio" id="new" name="whichtimesheets" value="new" defaultChecked />
                <label for="html">New Timesheets</label><br></br>
                <input type="radio" id="all" name="whichtimesheets" value="all"/>
                <label for="html">All Timesheets</label><br></br>
            </form>
            <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                <button type='button' className="submit-btn login-signup-title" style={{boxShadow: '3px 3px 3px lightgrey', width: '150px', margin: 'auto'}} onClick={()=>{if (!window.navigator.onLine) {window.alert('No network connection.')}}}>
                    <a href={`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/admin/download${newAllTimesheets}timesheets`} onClick={()=>setPage('Homepage')} style={{textDecoration: 'none', fontFamily: 'sans-serif', letterSpacing: '2px', fontSize: '14px', color: 'white'}}>Download Timesheets</a>
                </button>
            </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
            <img src="/img/tapered_line_blue.png" alt='tapered blue dividing line' style={{minWidth: '80%', height: '50px'}}/>
        </div>

        {/* Upload current jobs list */}
        <div className='login-signup-container'>
            <PageTitle maintitle='Upload Works in Progress List' subtitle={`The listings uploaded here will replace all of the listings in the timesheet "job name" select box.`} />
            <div className="form-container" style={{marginTop: '50px'}}>
                <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    <form action={`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/admin/uploadjoblist`} encType="multipart/form-data" method="post" style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                        <input type="file" name="file-to-upload" style={{margin: '0 0 30px 55px', textAlign: 'center'}} required/>
                        <button type='Submit' onClick={(e)=>{if (window.navigator.onLine) {alert('This featured disabled in portfolio version of this app.')}else{e.preventDefault(); alert('No network connection.'); return false;}}} className="submit-btn login-signup-title" style={{boxShadow: '3px 3px 3px lightgrey', width: '150px', margin: 'auto'}}>
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

        {/* Upload tasks list */}
        <div className='login-signup-container'>
            <PageTitle maintitle='Upload Tasks List' subtitle={`The tasks uploaded here will replace all of the tasks in the timesheet "task" select box.`} />
            <div className="form-container" style={{marginTop: '50px'}}>
                <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    <form action={`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/admin/uploadtasklist`} encType="multipart/form-data" method="post" style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                        <input type="file" name="file-to-upload" style={{margin: '0 0 30px 55px', textAlign: 'center'}} required/>
                        <button type='Submit' onClick={(e)=>{if (window.navigator.onLine) {alert('This featured disabled in portfolio version of this app.')}else{e.preventDefault(); alert('No network connection.'); return false;}}} className="submit-btn login-signup-title" style={{boxShadow: '3px 3px 3px lightgrey', width: '150px', margin: 'auto'}}>
                            Upload Task List
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
        <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
            <img src="/img/tapered_line_blue.png" alt='tapered blue dividing line' style={{minWidth: '80%', height: '50px'}}/>
        </div>

        {/* Update user timesheet */}
        <div className='login-signup-container'>
            <PageTitle maintitle='Change User Timesheet' subtitle={`Logs you into the user's account with permissions to make changes.`} />
            <div className="form-container" style={{marginTop: '0'}}>
                <form>
                    <div style={{padding: '25px'}}>   
                        <div className="input-name" id='loginEmail'>
                            <h3>Email on Timesheet</h3>
                        </div>
                        <input
                            className="field-input"
                            type='email'
                            id={uuid()}
                            value={userLogin.loginemail}
                            onChange={handleChange}
                            name='loginemail'
                            required
                        />
                        <div className="input-name input-margin">
                            <h3>Please Re-enter Admin Password</h3>
                        </div>
                        <input 
                            className="field-input"
                            type='password'
                            id={uuid()}
                            value={userLogin.loginpassword}
                            onChange={handleChange}
                            name='loginpassword'
                            required
                        />
                    </div>
                    <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                        <button type='button' className="submit-btn login-signup-title" onClick={handleSubmit} style={{width: '150px', margin: 'auto'}}>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
            <LoginSignupCSS />
        </div>
        </>
    )
}

export default Admin;
