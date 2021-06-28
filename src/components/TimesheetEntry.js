// packages
import React, { useState, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import uuid from 'react-uuid';

// internal
import LoginSignupCSS from '../styles/LoginSignup.css';
import PageTitle from '../components/PageTitle';
import {UserContext} from "../contexts/UserContext";
import {ENTRY_INIT} from "../constants/inits";
import {calcHoursWorked} from "../utils/helpers";
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
function TimesheetEntry(props) {
    const { user } = useContext(UserContext);
    const [todayDate, setTodayDate] = useState();
    const [winWidth, setWinWidth] = useState(2000);
    const [tasks, setTasks] = useState();
    const [currentJobs, setCurrentJobs] = useState();
    const [fullCurrentJobs, setFullCurrentJobs] = useState();
    const [lunchTimes, setLunchTimes] = useState();
    const [entry, setEntry]= useState(ENTRY_INIT);
    // declare variables
    // const { setUser } = useContext(UserContext);
    // const [resultInfo, dispatchResultInfo] = useReducer(resultInfoReducer, RESULTS_INITIAL_STATE);
    // const [activeWindow, dispatchActiveWindow] = useReducer(activeWindowReducer, activeWindowInitialState);
    // const [needVerify, setNeedVerify] = useState(false);
    // const [userLogin, setUserLogin] = useState({
    //     loginemail: '',
    //     loginpassword: '',
    //     loginchange: false
    // });
    const handleChange = (evt) => {
        switch (evt.target.name) {
            case 'dateofwork': 
                setEntry({...entry, dateofwork: evt.target.value});
                break
            case 'starttime': 
                setEntry({...entry, starttime: evt.target.value});
                break
            case 'endtime': 
                setEntry({...entry, endtime: evt.target.value});
                break
            case 'lunchtime': 
                setEntry({...entry, lunchtime: evt.target.value});
                break
            case 'jobname': 
                setEntry({...entry, jobname: evt.target.value});
                break
            case 'task': 
                setEntry({...entry, task: evt.target.value});
                break
            case 'notes': 
                setEntry({...entry, notes: evt.target.value});
                break
            default :
        }
    }
   
    const handleSubmit = async (evt) => {
        // calculate hours
        const submitHoursWorked = calcHoursWorked(entry.dateofwork, entry.starttime, entry.endtime, entry.lunchtime);
        if (submitHoursWorked.toUpperCase()==='END TIME ERROR') return alert('End Time must be after Start Time.');
        if (submitHoursWorked.toUpperCase()==='LUNCH TIME ERROR') return alert('Lunch Time is longer that hours worked.');
        //get submit time
        const todayDateRaw = new Date();
        console.log('todayDateRaw-minutes:', todayDateRaw.getMinutes())
        const month=todayDateRaw.getMonth()+1<10?`0${todayDateRaw.getMonth()+1}`:todayDateRaw.getMonth()+1;
        const day=todayDateRaw.getDate()<10?`0${todayDateRaw.getDate()}`:todayDateRaw.getDate();
        const hour=todayDateRaw.getHours()<10?`0${todayDateRaw.getHours()}`:todayDateRaw.getHours();
        const minute=todayDateRaw.getMinutes()<10?`0${todayDateRaw.getMinutes()}`:todayDateRaw.getMinutes();
        
        const submitTime=`${todayDateRaw.getFullYear()}/${month}/${day}T${hour}:${minute}`;
        //find job id
        let jobId;
        fullCurrentJobs.map(job=>job[1].toUpperCase()===entry.jobname.toUpperCase()?jobId=job[0]:'');
        // create submit object
        const entryArray = [user.email, `${user.firstname} ${user.lastname}`, entry.dateofwork, entry.starttime, entry.endtime, entry.lunchtime, submitHoursWorked, jobId, entry.jobname, entry.task, entry.notes, submitTime]
        console.log('entryArray:', entryArray);
        if (!window.confirm(`Submit timesheet entry for ${submitHoursWorked} on ${entry.dateofwork}?`)) return;

    //     const resultText = document.querySelector('#loadingLoginText');
    // if end time > starttime
        // if (userLogin.loginpassword.length<8) {
        //     resultText.innerText=`Passwords must be at least 8 characters long.`;
        //     dispatchResultInfo({type: 'tryAgain'});
        //     return
        // }
    //     // set loading image
    //     dispatchResultInfo({type:'loadingImage'});        
        try {
            // Submit Entry
            // const res = await axios.post(`http://localhost:3000/api/v1/ultrenostimesheets`, entryArray);
            const res = await axios.post(`https://take2tech.herokuapp.com/api/v1/ultrenostimesheets`, entryArray);
            console.log('res.status', res.status);
            alert(`Your timesheet has been submitted.`);
            setEntry(ENTRY_INIT);
            // const returnedUser = res.data.user;
            // const jwt = res.data.token;

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
        } catch(e) {
            console.error(e.message);
            alert('Something went wrong, please try again');
            // email not found #1
            // if (e.response&&e.response.data&&e.response.data.message&&e.response.data.message==="Cannot read property 'emailverified' of null") {
                // resultText.innerText=`${process.env.next_env==='development'?e.message:'Email not found.'} Login as guest?`;
                // dispatchResultInfo({type: 'okTryAgain'});
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
        }
    }
    // function resetResults() {
    //     if (document.querySelector('#loadingLoginText').innerText.includes('records')) resetSignupForm();
    //     document.querySelector('#loadingLoginText').innerText='';
    //     dispatchResultInfo({type: 'initial'});
    // }
    // function resetLoginForm() { 
    //     setUserLogin({
    //         loginemail: '',
    //         loginpassword: '',
    //         loginchange: false
    //     });
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
        async function getSupportLists() {
            // tasks
            const tasksArrays = await axios.get(`https://take2tech.herokuapp.com/api/v1/ultrenostimesheets/supportlists/tasks`);
            // const tasksArrays = await axios.get(`http://localhost:3000/api/v1/ultrenostimesheets/supportlists/tasks`);
            let incomingTasks = [];
            Array.from(tasksArrays.data.data).map((taskArray, idx)=>idx>0&&incomingTasks.push(taskArray[0]))
            setTasks(incomingTasks);
            // lunch times
            const lunchTimes = [
                '0 minutes',
                '15 minutes',
                '30 minutes',
                '45 minutes',
                '60 minutes',
                '90 minutes'
            ]
            // // const lunchTimesArrays = await axios.get(`https://take2tech.herokuapp.com/api/v1/ultrenostimesheets/supportlists/lunchtimes`);
            // const lunchTimesArrays = await axios.get(`http://localhost:3000/api/v1/ultrenostimesheets/supportlists/lunchtimes`);
            // let incomingLunchTimes = [];
            // Array.from(lunchTimesArrays.data.data).map(lunchTimeArray=>incomingLunchTimes.push(lunchTimeArray[0]))
            // setLunchTimes(incomingLunchTimes);
            setLunchTimes(lunchTimes);
            // current jobs
            const currentJobsArrays = await axios.get(`https://take2tech.herokuapp.com/api/v1/ultrenostimesheets/supportlists/currentjobs`);
            // const currentJobsArrays = await axios.get(`http://localhost:3000/api/v1/ultrenostimesheets/supportlists/currentjobs`);
            let incomingCurrentJobs = [];
            Array.from(currentJobsArrays.data.data).map(currentJobArray=>incomingCurrentJobs.push(currentJobArray[1]))
            setCurrentJobs(incomingCurrentJobs);
            setFullCurrentJobs(currentJobsArrays.data.data);
        }
        try {
            getSupportLists()
        } catch(e) {
            console.log(e.message)
        }      
    },[]);
    return ( 
       <>
       <div className='login-signup-container'>
            {/* <Spinner /> */}
            <PageTitle maintitle='Timesheet Entry' subtitle={user.email&&`for ${user.firstname} ${user.lastname}`} />
            <h4 style={{textAlign: 'center'}}>Today is {todayDate}</h4>
            {/* <Results 
                resultInfo={resultInfo} 
                loginGuest={loginGuest}
                resetResults={resetResults} 
            /> */}
            <div className='form-container' id="signup" style={{marginTop: '0px'}}>
                <form style={{marginTop: `${winWidth<750?'-50px':''}`}} onSubmit={()=>handleSubmit()}>
                    {/* {winWidth>750&&<div className="login-signup-title">
                        Timesheet Entry
                    </div>} */}
                    <div className='login-form'>
                        <div className="input-name">
                            <h3>Date of Work</h3>
                        </div>
                        <input 
                            className="field-input"
                            type='date'
                            id={uuid()}
                            value={entry.dateofwork}
                            onChange={handleChange}
                            name='dateofwork'
                            // required
                        />
                        <div className="input-name">
                            <h3>Start Time</h3>
                        </div>
                        <input 
                            className="field-input"
                            type='time'
                            id={uuid()}
                            value={entry.starttime}
                            onChange={handleChange}
                            name='starttime'
                            // required
                        />
                        <div className="input-name input-margin">
                            <h3>End Time</h3>
                        </div>
                        <input 
                            className="field-input"
                            type='time'
                            id={uuid()}
                            value={entry.endtime}
                            onChange={handleChange}
                            name='endtime'
                            // required
                        />
                        <div className="input-name input-margin">
                            <h3>Lunch</h3>
                        </div>
                        <select 
                            className="input field-input"
                            style={{width: '100%'}}
                            type='text'
                            id={uuid()}
                            value={entry.lunchtime}
                            onChange={handleChange}
                            name='lunchtime'
                            // required
                        >
                            <option name='15' value='15' key='howlongforlunch'>How long for lunch?</option>
                            {lunchTimes&&lunchTimes.map(lunchTime=><option key={lunchTime} value={lunchTime}>{lunchTime}</option>)} 
                        </select>
                        <div className="input-name input-margin">
                            <h3>Job Name</h3>
                        </div>
                        <select 
                            className="field-input"
                            style={{width: '100%'}}
                            type='text'
                            id={uuid()}
                            value={entry.jobname}
                            onChange={handleChange}
                            name='jobname'
                            // required
                        > 
                            <option key='whichjobsite'>Which Job-site?</option>  
                            {currentJobs&&currentJobs.map(currentJob=><option key={currentJob} value={currentJob}>{currentJob}</option>)} 
                        </select>
                        <div className="input-name input-margin">
                            <h3>Specific Task</h3>
                        </div>
                        <select 
                            className="field-input"
                            style={{width: '100%'}}
                            id={uuid()}
                            value={entry.task}
                            onChange={handleChange}
                            name='task'
                            // required
                        > 
                            <option key='whattypeofwork'>What type of work?</option>
                            {tasks&&tasks.map(task=><option key={task} value={task}>{task}</option>)} 
                            
                        </select>
                        <div className="input-name input-margin">
                            <h3>Notes</h3>
                        </div>
                        <textarea 
                            className="field-input"
                            id={uuid()}
                            value={entry.notes}
                            onChange={handleChange}
                            name='notes'
                        /> 
                    </div>
                    <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                        <button type='button' className="submit-btn login-signup-title" onClick={handleSubmit} style={{width: '150px', margin: 'auto'}}>
                            Submit
                        </button>
                    </div>
                    {/* <button type='button' className="submit-btn login-signup-title" onClick={handleSubmit}>
                        Submit
                    </button> */}
                </form>
                <LoginSignupCSS />
            </div>
        </div>
        </>
    )
}

export default TimesheetEntry;
