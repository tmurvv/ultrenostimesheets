// packages
import React, { useState, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import uuid from 'react-uuid';


// internal
import LoginSignupCSS from '../styles/LoginSignup.css';
import PageTitle from '../components/PageTitle';
import Spinner from '../components/Spinner'
import {UserContext} from '../contexts/UserContext';
import {AdminEditTimesheetsContext} from '../contexts/AdminEditTimesheetsContext';
// import Spinner from '../src/main/components/main/Spinner';
// import Results from '../src/main/components/main/Results';
// import { RESULTS_INITIAL_STATE } from '../src/main/constants/constants';
// import { UserContext } from '../src/main/contexts/UserContext';
// import { resultInfoReducer, activeWindowReducer } from '../src/main/reducers/reducers';
// import { parseJwt } from '../src/main/utils/helpers';

// // initialize reducer object
// const activeWindowInitialState = {
//     activeWindow: 'login',
//     loginClasses: 'login-signup l-attop',
//     signupClasses: 'login-signup s-atbottom'
// }
function Login({setPage}) {
    // declare variables
    const { setUser } = useContext(UserContext);
    const { adminEditTimesheets, setAdminEditTimesheets } = useContext(AdminEditTimesheetsContext);
    // const [resultInfo, dispatchResultInfo] = useReducer(resultInfoReducer, RESULTS_INITIAL_STATE);
    // const [activeWindow, dispatchActiveWindow] = useReducer(activeWindowReducer, activeWindowInitialState);
    // const [needVerify, setNeedVerify] = useState(false);
    const [userLogin, setUserLogin] = useState({
        loginemail: '',
        loginpassword: '',
        loginchange: false
    });
    const handleChange = (evt) => {
        switch (evt.target.name) {
            case 'loginemail': 
                setUserLogin({...userLogin, loginemail: evt.target.value, loginchange: true});
                break
            case 'loginpassword': 
                setUserLogin({...userLogin, loginpassword: evt.target.value, loginchange: true});
                break
            default :
        }
    }
    // function resetResults() {
    //     if (document.querySelector('#loadingLoginText').innerText.includes('records')) resetSignupForm();
    //     document.querySelector('#loadingLoginText').innerText='';
    //     dispatchResultInfo({type: 'initial'});
    // }
    // // function resetLoginForm() { 
    // //     setUserLogin({
    // //         loginemail: '',
    // //         loginpassword: '',
    // //         loginchange: false
    // //     });
    // // }
    // function handleLoginClick(evt) {
    //     dispatchActiveWindow({type: 'login'});
    // }
    const handleSubmit = async (evt) => {
        // const resultText = document.querySelector('#loadingLoginText');
        // if (userLogin.loginpassword.length<8) {
        //     resultText.innerText=`Passwords must be at least 8 characters long.`;
        //     dispatchResultInfo({type: 'tryAgain'});
        //     return
        // }
        // // set loading image
        // dispatchResultInfo({type:'loadingImage'});  
        if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="flex";         
        try {
            // login user
            const res = await axios.post(`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/users/login`, {email: userLogin.loginemail, password: userLogin.loginpassword});
            
            const returnedUser = res.data.data;
            // const jwt = res.data.token;

            // set user context to login user
            setUser({
                firstname: returnedUser.firstname, 
                lastname: returnedUser.lastname, 
                email: returnedUser.email
            });
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
            setTimeout(()=>{alert(`Login successful. Welcome ${returnedUser.firstname}`)},200);
            if (returnedUser.firstname.toUpperCase()==="ADMIN") setPage('Admin');
            if (returnedUser.firstname.toUpperCase()!=="ADMIN") {setPage('EnterTimesheet'); setAdminEditTimesheets(false)}
            // // set JWT cookie
            //     document.cookie = `JWT=${jwt}`
            // // display result window
            // resultText.innerText=`Login Successful: Welcome ${returnedUser.firstname}`;
            // dispatchResultInfo({type: 'OK'});
        } catch(e) {
            console.log('error', e.message)
            console.log(e.response)
            if (e.response&&e.response.data&&e.response.data.message&&e.response.data.message==="User not found.") {
                if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
                return setTimeout(()=>{alert('Email not found.')}, 200);
            } 
            if (e.response&&e.response.data&&e.response.data.message&&e.response.data.message==="Password does not match our records.") {
                if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
                return setTimeout(()=>{alert('Password does not match our records.')},200);
            }
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
            setTimeout(()=>{alert('Login not successful. Please check network connection.')}, 200);
        }
    }
    // handle forgotPassword click
    async function handleForgot() {
        // shortcut no email entered
        if (!userLogin.loginemail) {
            alert('Please enter your account email.');
            return;
        }
        try {
            // send forgot password email
            const res = await axios.post(`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/users/sendresetemail`, {useremail: userLogin.loginemail});
            // display results
            if (res.status===200) {
                alert('Please check your inbox for an email with instructions to reset your password.');
            }
        } catch (e) {
            // display error
            alert('Something went wrong with password reset. Please check your network connection.');
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
            <PageTitle maintitle='Login' subtitle='' />
            <div style={{cursor: 'pointer', margin: 'auto', width: 'fit-content'}} onClick={()=>{setPage('Signup')}}>
                <button type="button" className='link-btn' style={{width: 'fit-content', fontStyle: 'italic', fontSize: '16px',}}>Click Here to Signup</button>
            </div>
            
            {/* <Results 
                resultInfo={resultInfo} 
                loginGuest={loginGuest}
                resetResults={resetResults} 
            /> */}
            
            <div className="form-container" style={{marginTop: '0'}}>
                {/* <div className="login-signup-title">
                    LOG IN
                </div> */}
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
                            {/* <div className="input-r">
                                <div className="check-input">
                                    <input type="checkbox" id="remember-me-2" name="rememberme" value="" className="checkme"/>
                                    <label className="rememberme-blue" htmlFor="remember-me-2"></label>
                                </div>
                                <div className="rememberme">
                                    <label htmlFor="remember-me-2">Remember Me</label>
                                </div>
                            </div> */}
                        </div>
                        {/* <button type='button' onClick={handleSubmit} className="submit-btn login-signup-title">
                            Submit
                        </button> */}
                        <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                            <button type='button' className="submit-btn login-signup-title" onClick={handleSubmit} style={{width: '150px', margin: 'auto'}}>
                                Submit
                            </button>
                        </div>
                        <div className="forgot-pass"
                            style={{cursor: 'pointer'}} 
                            onClick={handleForgot}
                        >
                            <button type='button' className='link-btn' style={{fontStyle: 'italic', fontSize: '16px', marginTop: '15px'}}>Forgot Password?</button>
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
