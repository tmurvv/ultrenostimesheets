// packages
import React, { useState, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import uuid from 'react-uuid';

// internal
import LoginSignupCSS from '../styles/LoginSignup.css';
import PageTitle from '../components/PageTitle';
import {USER_INIT} from '../constants/inits';
import {UserContext} from '../contexts/UserContext';
// import Spinner from '../src/main/components/main/Spinner';
// import Results from '../src/main/components/main/Results';
// import { RESULTS_INITIAL_STATE } from '../src/main/constants/constants';
// import { UserContext } from '../src/main/contexts/UserContext';
// import { resultInfoReducer, activeWindowReducer } from '../src/main/reducers/reducers';
// import { parseJwt } from '../src/main/utils/helpers';

function Signup({setPage}) {
    // declare variables
    // const { setUser } = useContext(UserContext);
    // const [resultInfo, dispatchResultInfo] = useReducer(resultInfoReducer, RESULTS_INITIAL_STATE);
    // const [activeWindow, dispatchActiveWindow] = useReducer(activeWindowReducer, activeWindowInitialState);
    // const [needVerify, setNeedVerify] = useState(false);
    const {user, setUser} = useContext(UserContext);
    const [signupUser, setSignupUser] = useState(USER_INIT);
    const handleChange = (evt) => {
        switch (evt.target.name) {
            case 'firstname': 
                setSignupUser({...signupUser, firstname: evt.target.value, change: true});
                break
            case 'lastname': 
                setSignupUser({...signupUser, lastname: evt.target.value, change: true});
                break
            case 'email': 
                setSignupUser({...signupUser, email: evt.target.value, change: true});
                break
            case 'confirmemail': 
                setSignupUser({...signupUser, confirmemail: evt.target.value, change: true});
                break
            case 'password': 
                setSignupUser({...signupUser, password: evt.target.value, change: true});
                break
            case 'confirmpassword': 
                setSignupUser({...signupUser, confirmpassword: evt.target.value, change: true});
                break
            default :
        }
    }
    // function resetResults() {
    //     if (document.querySelector('#loadingLoginText').innerText.includes('records')) resetSignupForm();
    //     document.querySelector('#loadingLoginText').innerText='';
    //     dispatchResultInfo({type: 'initial'});
    // }
    function resetSignupForm() { 
        setSignupUser(USER_INIT);
    }
    // function handleLoginClick(evt) {
    //     dispatchActiveWindow({type: 'login'});
    // }
    const handleSubmit = async (evt) => {
    //     const resultText = document.querySelector('#loadingLoginText');
        // shortcut - password not long enough
        if ((!signupUser.firstname)||signupUser.firstname.length<1) {
            // resultText.innerText=`Passwords must be at least 8 characters long.`;
            // dispatchResultInfo({type: 'tryAgain'});
            alert('First name is required.');
            return
        }
        // shortcut - password not long enough
        if ((!signupUser.lastname)||signupUser.lastname.length<1) {
            // resultText.innerText=`Passwords must be at least 8 characters long.`;
            // dispatchResultInfo({type: 'tryAgain'});
            alert('Last name is required.');
            return
        }
        // shortcut - password not long enough
        if ((!signupUser.password)||signupUser.password.length<8) {
            // resultText.innerText=`Passwords must be at least 8 characters long.`;
            // dispatchResultInfo({type: 'tryAgain'});
            alert('Passwords must be at least 8 characters.');
            return
        }
        // shortcut - emails not matching
        if (signupUser.email !== signupUser.confirmemail) {
            // resultText.innerText=`Passwords do not match.`;
            // dispatchResultInfo({type: 'tryAgain'});
            alert('Emails do not match.');
            return
        } 
        // shortcut - passwords not matching
        if (signupUser.password !== signupUser.confirmpassword) {
            // resultText.innerText=`Passwords do not match.`;
            // dispatchResultInfo({type: 'tryAgain'});
            alert('Passwords do not match.');
            return
        } 
        // create signup user object
        const newUser = {
            firstname: signupUser.firstname,
            lastname: signupUser.lastname,
            email: signupUser.email,
            password: signupUser.password,
        };
        // signup user
        try {
            const res = await axios.post(`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/users/signup`, newUser);
            if (res.status===201 || res.status===200) {                   
                // set userContext to added user
                const addeduser = res.data.newuser;
                setUser({
                    firstname: addeduser.firstname, 
                    lastname: addeduser.lastname, 
                    email: addeduser.email,
            });
            alert('Signup Successful.');
            setPage('EnterTimesheet');
                // resultText.innerText=`Signup Successful. Please check your inbox to verify your email.`;
                // dispatchResultInfo({type: 'OK'});  
        }
        // Error on signup
        } catch (e) {
            console.log('error');
            console.log(e.response)
            // duplicate email
            if (e.response&&e.response.data&&e.response.data.message.toUpperCase().includes('EXISTS')) {
                alert("Email already in use.");
                // resultText.innerText=`${process.env.next_env==='development'?e.response.data.data.message:'We already have that email in our records. Please try to login and/or select "forgot password" in the login box.'}`;
                // dispatchResultInfo({type: 'okTryAgain'});
            // other error
            
            } else {
                alert(`Something went wrong on signup. Please check your network connection.`)
                // resultText.innerText=`${process.env.next_env==='development'?e.message:'Something went wrong on signup. Please check your network connection. Log in as guest user?'}`;
                // dispatchResultInfo({type: 'okTryAgain'});
            }
        }
        
    //     // set loading image
    //     dispatchResultInfo({type:'loadingImage'});        
    //     try {
    //         // login user
    //         const res = await axios.post(`${process.env.backend}/api/v1/users/loginuser`, {email: userLogin.loginemail, password: userLogin.loginpassword});
            
    //         const returnedUser = res.data.user;
    //         const jwt = res.data.token;

    //         // set user context to login user
    //         await setUser({
    //             firstname: returnedUser.firstname, 
    //             lastname: returnedUser.lastname, 
    //             email: returnedUser.email
    //         });
    //         // set JWT cookie
    //             document.cookie = `JWT=${jwt}`
    //         // display result window
    //         resultText.innerText=`Login Successful: Welcome ${returnedUser.firstname}`;
    //         dispatchResultInfo({type: 'OK'});
    //     } catch(e) {
    //         // email not found #1
    //         if (e.response&&e.response.data&&e.response.data.message&&e.response.data.message==="Cannot read property 'emailverified' of null") {
    //             resultText.innerText=`${process.env.next_env==='development'?e.message:'Email not found.'} Login as guest?`;
    //             dispatchResultInfo({type: 'okTryAgain'});
    //         // email not verified
    //         } else if (e.response&&e.response.data&&e.response.data.message&&e.response.data.message.includes('verified')) {
    //             setNeedVerify(true);                
    //             await setUserLogin({...userLogin, loginemail: e.response.data.useremail})
    //             resultText.innerText=`${process.env.next_env==='development'?e.response.data.data.message:'Email not yet verified. Please see your inbox for verification email.'} Resend verification email?`;
    //             dispatchResultInfo({type: 'okTryAgain'});
    //         // passwords don't match
    //         } else if (e.response&&e.response.data&&e.response.data.message&&e.response.data.message.includes('incorrect')) {
    //             resultText.innerText=`${process.env.next_env==='development'?e.message:'Password does not match our records.'} Login as guest?`;
    //             dispatchResultInfo({type: 'okTryAgain'});
    //         // email not found #2
    //         } else if (e.response&&e.response.data&&e.response.data.message&&e.response.data.message.includes('Email')) {
    //             resultText.innerText=`${process.env.next_env==='development'?e.message:'Email not found.'} Login as guest?`;
    //             dispatchResultInfo({type: 'okTryAgain'});
    //         // other error
    //         } else {
    //             resultText.innerText=`${process.env.next_env==='development'?e.message:'Something went wrong on login. Please check your network connection.'} Login as guest?`;
    //             dispatchResultInfo({type: 'okTryAgain'});
    //         }
    //     }
    }
    // // handle forgotPassword click
    // async function handleForgot() {
    //     const resultText = document.querySelector('#loadingLoginText');
    //     // shortcut no email entered
    //     if (!userLogin.loginemail) {
    //         resultText.innerText='Please enter your account email.';
    //         dispatchResultInfo({type: 'tryAgain'});
    //         return;
    //     }
    //     try {
    //         // send forgot password email
    //         const res = await axios.get(`${process.env.backend}/api/v1/users/sendresetemail/${userLogin.loginemail}`);
    //         // display results
    //         if (res.status===200) {
    //             resultText.innerText=`Please check your inbox for an email with instructions to reset your password.`;
    //             dispatchResultInfo({type: 'OK'});
    //         }
    //     } catch (e) {
    //         // display error
    //         resultText.innerText=`${process.env.next_env==='development'?e.message:'Something went wrong with password reset. Please check your netword connection.'} Log in as guest user?`
    //         dispatchResultInfo({type: 'okTryAgain'});
    //     }
    // }
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
            <PageTitle maintitle='Signup' subtitle='' />
            <div style={{cursor: 'pointer', margin: 'auto', width: 'fit-content'}} onClick={()=>{setPage('Login')}}>
                <button type="button" className='link-btn' style={{width: 'fit-content', fontStyle: 'italic', fontSize: '16px',}}>Click Here to Login</button>
            </div>
            {/* <Results 
                resultInfo={resultInfo} 
                loginGuest={loginGuest}
                resetResults={resetResults} 
            /> */}
            <div className='form-container' id="signup" style={{marginTop: '0px'}}>
                <form onSubmit={()=>handleSubmit()}>
                    {/* <div className="login-signup-title">
                        SIGN UP
                    </div> */}
                    <div className='login-form'>
                        <div className="input-name">
                            <h3>First Name<span style={{color: 'orangered'}}>*</span></h3>
                        </div>
                        <input 
                            className="field-input"
                            id={uuid()}
                            value={signupUser.firstname}
                            onChange={handleChange}
                            name='firstname'
                            required
                        />
                        <div className="input-name">
                            <h3>Last Name<span style={{color: 'orangered'}}>*</span></h3>
                        </div>
                        <input 
                            className="field-input"
                            id={uuid()}
                            value={signupUser.lastname}
                            onChange={handleChange}
                            name='lastname'
                            required
                        />
                        <div className="input-name input-margin">
                            <h3>Email<span style={{color: 'orangered'}}>*</span></h3>
                        </div>
                        <input 
                            className="field-input"
                            type='email'
                            id={uuid()}
                            value={signupUser.email}
                            onChange={handleChange}
                            name='email'
                            required
                        />
                        <div className="input-name input-margin">
                            <h3>Confirm Email<span style={{color: 'orangered'}}>*</span></h3>
                        </div>
                        <input 
                            className="field-input"
                            type='email'
                            id={uuid()}
                            value={signupUser.confirmemail}
                            onChange={handleChange}
                            name='confirmemail'
                            required
                        />
                        <div className="input-name input-margin">
                            <h3>Password<span style={{color: 'orangered'}}>*</span></h3>
                        </div>
                        <input 
                            className="field-input"
                            type='password'
                            id={uuid()}
                            value={signupUser.password}
                            onChange={handleChange}
                            name='password'
                            required
                        />
                        <div className="input-name input-margin">
                            <h3>Confirm Password<span style={{color: 'orangered'}}>*</span></h3>
                        </div>
                        <input 
                            className="field-input"
                            type='password'
                            id={uuid()}
                            value={signupUser.confirmpassword}
                            onChange={handleChange}
                            name='confirmpassword'
                            required
                        />   
                    </div>
                    <div style={{width: '100%', display: 'flex', justifyContent: 'space-evenly', marginTop: '20px auto'}}>
                        <button type='button' className="submit-btn login-signup-title" onClick={handleSubmit} style={{width: '120px'}}>
                            Submit
                        </button>
                        <button type='button' className="submit-btn login-signup-title" onClick={()=>setPage('Homepage')} style={{width: '120px', backgroundColor: '#000', color: 'white'}}>
                            Cancel
                        </button>
                    </div>
                </form>
                <LoginSignupCSS />
            </div>
        </div>
        </>
    )
}

export default Signup;
