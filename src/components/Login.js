// packages
import {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import uuid from 'react-uuid';

// internal
import LoginSignupCSS from '../styles/LoginSignup.css';
import PageTitle from '../components/PageTitle';
import Spinner from '../components/Spinner'
import {UserContext} from '../contexts/UserContext';
import {AdminEditTimesheetsContext} from '../contexts/AdminEditTimesheetsContext';

function Login({setPage}) {
    // declare variables
    const {setUser} = useContext(UserContext);
    const {setAdminEditTimesheets} = useContext(AdminEditTimesheetsContext);
    const [userLogin, setUserLogin] = useState({
        loginemail: '',
        loginpassword: '',
        loginchange: false
    });
    // handle change
    const handleChange = (evt) => {
        setUserLogin({...userLogin, [evt.target.name]: evt.target.value, loginchange: true});
    }
    // handle submit
    const handleSubmit = async (evt) => {
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
                email: returnedUser.email,
                role: returnedUser.role,
                id: returnedUser._id
            });
            // stop spinner
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
            // in-app message
            
            // set admin or user environment
            if (returnedUser&&returnedUser.role&&returnedUser.role.toUpperCase()==="ADMIN") {
                setPage('Dashboard'); 
                setAdminEditTimesheets(false);
            } else {
                setTimeout(()=>{alert(`Login successful. Welcome ${returnedUser.firstname}`)},200);
                setPage('EnterTimesheet'); 
                setAdminEditTimesheets(false);
            }
        } catch(e) {
            // log error
            console.log('error', e.message)
            if (e.response&&e.response.data&&e.response.data.message&&e.response.data.message==="User not found.") {
                if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
                return setTimeout(()=>{alert('Email not found.')}, 200);
            } 
            // Password does not match
            if (e.response&&e.response.data&&e.response.data.message&&e.response.data.message==="Password does not match our records.") {
                if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
                return setTimeout(()=>{alert('Password does not match our records.')},200);
            }
            // All other errors
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
            setTimeout(()=>{alert('Login not successful. Please check network connection.')}, 200);
        }
    }
    // handle forgotPassword
    async function handleForgot() {
        // validate email entered
        if (!userLogin.loginemail) {
            alert('Please enter your account email.');
            return;
        }
        // start spinner
        if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="flex";   
        try {
            // send forgot password email
            await axios.post(`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/users/sendresetemail`, {useremail: userLogin.loginemail});
            // in-app message
            setTimeout(()=>{alert('Please check your inbox for an email with instructions to reset your password..')}, 200);
            // stop spinner
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
        } catch (e) {
            // log error
            console.log('error from reset password:', e.message);
            // in-app message
            setTimeout(()=>{alert('Something went wrong with password reset. Please check your network connection.')}, 200);
            // stop spinner
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
        }
    }
    // set environment
    useEffect(()=>{
        if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
    },[]);
    return ( 
       <>
        <div className='login-signup-container'>
            <Spinner />
            <PageTitle maintitle='Timesheet Login' subtitle='' />
            <div style={{cursor: 'pointer', margin: 'auto', width: 'fit-content'}} onClick={()=>{setPage('Signup')}}>
                <button type="button" className='link-btn' style={{width: 'fit-content', fontStyle: 'italic', fontSize: '16px',}}>Click Here to Signup</button>
            </div>
            <div className="form-container" style={{marginTop: '0'}}>
                <form>
                    <>
                        <div style={{padding: '25px'}}>   
                            <div className="input-name" id='loginEmail'>
                                <h3>Email</h3>
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
                                <h3>Password</h3>
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
                        <div className="forgot-pass"
                            style={{cursor: 'pointer'}} 
                            onClick={handleForgot}
                        >
                            <button type='button' className='link-btn' style={{cursor: 'pointer', fontStyle: 'italic', fontSize: '16px', marginTop: '15px'}}>Change/Forgot Password</button>
                        </div>
                    </>
                </form>     
            </div>
            <LoginSignupCSS />
        </div>
        </>
    )
}

export default Login;
