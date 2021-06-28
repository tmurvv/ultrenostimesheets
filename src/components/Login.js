// packages
import React, { useState, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import uuid from 'react-uuid';

// internal
import LoginSignupCSS from '../styles/LoginSignup.css';
import PageTitle from '../components/PageTitle';
import {UserContext} from '../contexts/UserContext';
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
        try {
            // login user
            const res = await axios.post(`http://localhost:3000/api/v1/ultrenostimesheets/users/login`, {email: userLogin.loginemail, password: userLogin.loginpassword});
            
            console.log(res.data);
            const returnedUser = res.data.data;
            // const jwt = res.data.token;

            // set user context to login user
            setUser({
                firstname: returnedUser.firstname, 
                lastname: returnedUser.lastname, 
                email: returnedUser.email
            });
            alert(`Login successful. Welcome ${returnedUser.firstname}`);
            setPage('TimesheetEntry');
            // // set JWT cookie
            //     document.cookie = `JWT=${jwt}`
            // // display result window
            // resultText.innerText=`Login Successful: Welcome ${returnedUser.firstname}`;
            // dispatchResultInfo({type: 'OK'});
        } catch(e) {
            console.log('error', e.message)
            // // email not found #1
            // if (e.response&&e.response.data&&e.response.data.message&&e.response.data.message==="Cannot read property 'emailverified' of null") {
            //     resultText.innerText=`${process.env.next_env==='development'?e.message:'Email not found.'} Login as guest?`;
            //     dispatchResultInfo({type: 'okTryAgain'});
            // // email not verified
            // } else if (e.response&&e.response.data&&e.response.data.message&&e.response.data.message.includes('verified')) {
            //     setNeedVerify(true);                
            //     await setUserLogin({...userLogin, loginemail: e.response.data.useremail})
            //     resultText.innerText=`${process.env.next_env==='development'?e.response.data.data.message:'Email not yet verified. Please see your inbox for verification email.'} Resend verification email?`;
            //     dispatchResultInfo({type: 'okTryAgain'});
            // // passwords don't match
            // } else if (e.response&&e.response.data&&e.response.data.message&&e.response.data.message.includes('incorrect')) {
            //     resultText.innerText=`${process.env.next_env==='development'?e.message:'Password does not match our records.'} Login as guest?`;
            //     dispatchResultInfo({type: 'okTryAgain'});
            // // email not found #2
            // } else if (e.response&&e.response.data&&e.response.data.message&&e.response.data.message.includes('Email')) {
            //     resultText.innerText=`${process.env.next_env==='development'?e.message:'Email not found.'} Login as guest?`;
            //     dispatchResultInfo({type: 'okTryAgain'});
            // // other error
            // } else {
            //     resultText.innerText=`${process.env.next_env==='development'?e.message:'Something went wrong on login. Please check your network connection.'} Login as guest?`;
            //     dispatchResultInfo({type: 'okTryAgain'});
            // }
        }
    }
    // handle forgotPassword click
    async function handleForgot() {
        alert('Forgot Password coming soon!')
        // const resultText = document.querySelector('#loadingLoginText');
        // // shortcut no email entered
        // if (!userLogin.loginemail) {
        //     resultText.innerText='Please enter your account email.';
        //     dispatchResultInfo({type: 'tryAgain'});
        //     return;
        // }
        // try {
        //     // send forgot password email
        //     const res = await axios.get(`${process.env.backend}/api/v1/users/sendresetemail/${userLogin.loginemail}`);
        //     // display results
        //     if (res.status===200) {
        //         resultText.innerText=`Please check your inbox for an email with instructions to reset your password.`;
        //         dispatchResultInfo({type: 'OK'});
        //     }
        // } catch (e) {
        //     // display error
        //     resultText.innerText=`${process.env.next_env==='development'?e.message:'Something went wrong with password reset. Please check your netword connection.'} Log in as guest user?`
        //     dispatchResultInfo({type: 'okTryAgain'});
        // }
    }
    // async function loginGuest(evt) {
    //     if (needVerify) {
    //         // display loader
    //         const resultText = document.querySelector('#loadingLoginText');
    //         dispatchResultInfo({ type: 'loadingImage' });  
    //         //create user object
    //         const forgotPasswordUser = {
    //             firstname: 'findaharp.com',
    //             lastname: 'user',
    //             email: userLogin.loginemail
    //         }
    //         try {
    //             // this is a hack because program not returning for axios post, needs to be debugged and next three lines put below axios call
    //             // display result
    //             resultText.innerText=`Verify email sent.`;
    //             dispatchResultInfo({type: 'OK'});
    //             setNeedVerify(false);
    //             // send forgot password email
    //             await axios.post(`${process.env.backend}/api/v1/resendverify`, forgotPasswordUser);
    //         } catch (e) {
    //             // display error
    //             resultText.innerText=`${process.env.next_env==='development'?e.message:'Something went wrong sending verification email. Please check your network connection.'} Log in as guest user?`;
    //             dispatchResultInfo({type: 'okTryAgain'});
    //         }
    //     }
    //     resetResults();
    //     // go to main window
    //     Router.push('/');
    // }
    
    return ( 
       <>
        <div className='login-signup-container'>
            {/* <Spinner /> */}
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
                            <button className='link-btn' style={{fontStyle: 'italic', fontSize: '16px', marginTop: '15px'}}>Forgot Password?</button>
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
