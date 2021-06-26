// packages
import React, { useState, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import uuid from 'react-uuid';

// internal
import LoginSignupCSS from '../styles/LoginSignup.css';
import PageTitle from '../components/PageTitle';
import {UserContext} from "../contexts/UserContext";
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
function TimesheetEntry({setPage}) {
    const { user } = useContext(UserContext);
    const [todayDate, setTodayDate] = useState();
    const [winWidth, setWinWidth] = useState(2000);
    const [tasks, setTasks] = useState();
    // declare variables
    // const { setUser } = useContext(UserContext);
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
    // const handleSubmit = async (evt) => {
    //     evt.preventDefault();
    //     const resultText = document.querySelector('#loadingLoginText');
    //     if (userLogin.loginpassword.length<8) {
    //         resultText.innerText=`Passwords must be at least 8 characters long.`;
    //         dispatchResultInfo({type: 'tryAgain'});
    //         return
    //     }
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
    // }
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
    // set environment
    useEffect(()=>{
        const todayDateRaw = new Date();
        const month=todayDateRaw.getMonth()+1<10?`0${todayDateRaw.getMonth()+1}`:todayDateRaw.getMonth()+1;
        const day=todayDateRaw.getDate()<10?`0${todayDateRaw.getDate()}`:todayDateRaw.getDate();
        setTodayDate(`${todayDateRaw.getFullYear()}/${month}/${day}`);
        setWinWidth(window.innerWidth);
    },[]);
    // get data
    useEffect(()=>{
        console.log('here')
        async function getSupportLists() {
            const tasks = await axios.get(`https://take2tech.herokuapp.com/api/v1/ultrenostimesheets/supportlists/tasks`);
            console.log(tasks.data)
            setTasks(tasks.data)
        }
      
        getSupportLists()
        
    },[]);

    return ( 
       <>
       <div className='login-signup-container'>
            {/* <Spinner /> */}
            <PageTitle maintitle='Timesheet Entry' subtitle={`for ${user.firstname} ${user.lastname}`} />
            <h4 style={{textAlign: 'center'}}>Today is {todayDate}</h4>
            {/* <Results 
                resultInfo={resultInfo} 
                loginGuest={loginGuest}
                resetResults={resetResults} 
            /> */}
            <div className='form-container' id="signup" 
                // onClick={()=>handleSignupClick()}
            >
                <form style={{marginTop: `${winWidth<750?'-50px':''}`}}
                // onSubmit={()=>handleSubmit()}
                >
                    {winWidth>750&&<div className="login-signup-title">
                        Timesheet Entry
                    </div>}
                    <div className='login-form'>
                        <div className="input-name">
                            <h3>Date of Work</h3>
                        </div>
                        <input 
                            className="field-input"
                            type='date'
                            id={uuid()}
                            // value={userSignup.firstname}
                            onChange={handleChange}
                            name='dateofwork'
                            required
                            // disabled={activeWindow.active==='login'}
                        />
                        <div className="input-name">
                            <h3>Start Time</h3>
                        </div>
                        <input 
                            className="field-input"
                            type='time'
                            id={uuid()}
                            // value={userSignup.lastname}
                            onChange={handleChange}
                            name='starttime'
                            required
                            // disabled={activeWindow.active==='login'}
                        />
                        <div className="input-name input-margin">
                            <h3>End Time</h3>
                        </div>
                        <input 
                            className="field-input"
                            type='time'
                            id={uuid()}
                            // value={userSignup.signupemail}
                            onChange={handleChange}
                            name='endtime'
                            // required={activeWindow.active==='signup'}
                            // disabled={activeWindow.active==='login'}
                        />
                        <div className="input-name input-margin">
                            <h3>Lunch</h3>
                        </div>
                        <select 
                            className="input field-input"
                            style={{width: '100%'}}
                            type='password'
                            id={uuid()}
                            // value={userSignup.signuppassword}
                            onChange={handleChange}
                            name='signuppassword'
                            // required={activeWindow.active==='signup'}
                            // disabled={activeWindow.active==='login'}
                        >
                            <option name='15' value='15'>How long for lunch?</option>
                            <option name='15' value='15'>Will be autopopulated.</option>
                            <option name='15' value='15'>15 Minutes</option>
                            <option name='30' value='30'>30 Minutes</option>
                            <option name='45' value='45'>45 Minutes</option>
                            <option name='60' value='60'>60 Minutes</option>
                            <option name='90' value='90'>90 Minutes</option>
                            <option name='120' value='120'>120 Minutes</option>
                        </select>
                        <div className="input-name input-margin">
                            <h3>Job Name</h3>
                        </div>
                        <select 
                            className="field-input"
                            style={{width: '100%'}}
                            type='password'
                            id={uuid()}
                            // value={userSignup.confirmpassword}
                            onChange={handleChange}
                            name='jobname'
                            // required={activeWindow.active==='signup'}
                            // disabled={activeWindow.active==='login'}
                        > 
                            <option>Which Job-site?</option>  
                            <option>will be auto-populated</option>  
                            <option>option 1</option>  
                            <option>option 2</option>  
                            <option>option 3</option>  
                            <option>option 4</option>
                        </select>
                        <div className="input-name input-margin">
                            <h3>Specific Task</h3>
                        </div>
                        <select 
                            className="field-input"
                            style={{width: '100%'}}
                            type='password'
                            id={uuid()}
                            // value={userSignup.confirmpassword}
                            onChange={handleChange}
                            name='task'
                            // required={activeWindow.active==='signup'}
                            // disabled={activeWindow.active==='login'}
                        > 
                            <option>What type of work?</option>  
                            <option>Will be auto-populated.</option>  
                            <option>option 1</option>  
                            <option>option 2</option>  
                            <option>option 3</option>  
                            <option>option 4</option>
                        </select>
                        <div className="input-name input-margin">
                            <h3>Notes</h3>
                        </div>
                        <textarea 
                            className="field-input"
                            type='password'
                            id={uuid()}
                            // value={userSignup.confirmpassword}
                            onChange={handleChange}
                            name='notes'
                            // required={activeWindow.active==='signup'}
                            // disabled={activeWindow.active==='login'}
                        /> 
                    </div>
                    <button type='submit' className="submit-btn login-signup-title" 
                    // onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </form>
                <LoginSignupCSS />
            </div>
        </div>
        </>
    )
}

export default TimesheetEntry;
