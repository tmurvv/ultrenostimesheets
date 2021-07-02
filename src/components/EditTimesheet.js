// packages
import React, { useState, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import uuid from 'react-uuid';

// internal
import LoginSignupCSS from '../styles/LoginSignup.css';
import PageTitle from '../components/PageTitle';
import {UserContext} from "../contexts/UserContext";
import {PageContext} from "../contexts/PageContext";
import {EditEntryContext} from "../contexts/EditEntryContext";
import {ENTRY_INIT} from "../constants/inits";
import {getMinutesWorked, minutesToDigital, minutesToText, getNowYYYYMMDDTHHMMSS} from "../utils/helpers";
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
function EditTimesheet(props) {
    const { user } = useContext(UserContext);
    const [todayDate, setTodayDate] = useState();
    const [winWidth, setWinWidth] = useState(2000);
    const [tasks, setTasks] = useState();
    const [currentJobs, setCurrentJobs] = useState();
    const [fullCurrentJobs, setFullCurrentJobs] = useState();
    const [lunchTimes, setLunchTimes] = useState();
    const {editEntry, setEditEntry} = useContext(EditEntryContext);
    const {page, setPage} = useContext(PageContext);
    const [entry, setEntry]= useState(editEntry);
    const handleChange = (evt) => {
        console.log('handlechagne', evt.target.lunchtime)
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
        if (!window.confirm(`Make changes to this timesheet, are you sure?`)) return; 
        // combine editEntry and entry objects into one update object
        const updateObject = {
            dateofwork: entry.dateofwork,
            starttime: entry.starttime,
            endtime: entry.endtime,
            lunchtime: entry.lunchtime,
            jobname: entry.jobname,
            jobid: entry.jobid,
            task: entry.task,
            notes: entry.notes,
            entryId: editEntry.entryId
        }
        console.log('updateObject:', updateObject)
        console.log('editEntryId:', editEntry.entryId)
       // shortcuts
       if (!updateObject.jobname||updateObject.jobname==='Which Job-site?') return alert('Please select a Job-site.');
       if (!updateObject.task||updateObject.task==='What type of work?') return alert('Please select type of work.');

       // calculate hours
       const minutesWorked = getMinutesWorked(updateObject.dateofwork, updateObject.starttime, updateObject.endtime, updateObject.lunchtime);
       const submitHoursWorked = minutesToDigital(minutesWorked);
       const responseText = minutesToText(minutesWorked);
       
       if (minutesWorked===-1) return alert('End Time must be after Start Time.');
       if (minutesWorked===-2) return alert('Lunch Time is longer that hours worked.');
       
       const submitTime=getNowYYYYMMDDTHHMMSS();
       console.log('getNowYYYYMMDDTHHMMSS:', getNowYYYYMMDDTHHMMSS())
       
       //find job id
       let jobId=updateObject.jobname.split(' ')[0];
       let jobName=updateObject.jobname.split(' ')[1];
    //    let jobName=Array.isArray(updateObject.jobname)?updateObject.jobname[1]:updateObject.jobname.split('|!|')[1];
    //    let jobId=Array.isArray(updateObject.jobname)?updateObject.jobname[0]:updateObject.jobname.split('|!|')[0];
    //    let jobName=Array.isArray(updateObject.jobname)?updateObject.jobname[1]:updateObject.jobname.split('|!|')[1];
    //    fullCurrentJobs.map(job=>job[1].toUpperCase()===updateObject.jobname.toUpperCase()?jobId=job[0]:'');
       // create submit object
       const entryArray = [
           user.email, 
           `${user.firstname} ${user.lastname}`, 
           updateObject.dateofwork, 
           updateObject.starttime, 
           updateObject.endtime, 
           updateObject.lunchtime, 
           submitHoursWorked, 
           jobId, 
           jobName, 
           updateObject.task, 
           updateObject.notes, 
           submitTime,
           editEntry.entryId
       ]
       console.log('entryArray:', entryArray)
            
       try {
           // shortcut entryId
           if (!(editEntry.entryId)) throw new Error('Entry Id not found. Entry not updated'); // BREAKING need to test validation not working
           // Submit Entry
        //    const res = await axios.post(`http://localhost:3000/api/v1/ultrenostimesheets/updatetimesheet`, entryArray);
           const res = await axios.post(`https://take2tech.herokuapp.com/api/v1/ultrenostimesheets/updatetimesheet`, entryArray);
           console.log('res.status', res.status);
           setEditEntry(ENTRY_INIT);
           setPage('TimesheetView');
           alert(`Your timesheet has been updated.`);
       } catch(e) {
           console.error(e.message);
           alert('Something went wrong, please try again');  
       }
               
    // 00000000000000000000000000000000000000000000
        
        // place find formula in hidden worksheet

        
        // find row of entry


        // update entry


        // delete hidden sheet







        // // shortcuts
        // if (!entry.jobname||entry.jobname==='Which Job-site?') return alert('Please select a Job-site.');
        // if (!entry.task||entry.task==='What type of work?') return alert('Please select type of work.');

        // // calculate hours
        // const minutesWorked = getMinutesWorked(entry.dateofwork, entry.starttime, entry.endtime, entry.lunchtime);
        // const submitHoursWorked = minutesToDigital(minutesWorked);
        // const responseText = minutesToText(minutesWorked);
        
        // if (minutesWorked===-1) return alert('End Time must be after Start Time.');
        // if (minutesWorked===-2) return alert('Lunch Time is longer that hours worked.');
        
        // const submitTime=getNowYYYYMMDDTHHMM();
        // console.log('getNowYYYYMMDDTHHMM:', getNowYYYYMMDDTHHMM())
        
        // //find job id
        // const jobId=entry.jobname.split(',')[0];
        // const jobName=entry.jobname.split(',')[1];

        // console.log('fullCurrentJobs:', fullCurrentJobs[0])
        // console.log('currentJobs:', currentJobs[0])
        // fullCurrentJobs.map(job=>job[1].toUpperCase()===entry.jobname.toUpperCase()?jobId=job[0]:'');
        // // create submit object
        // const entryArray = [user.email, `${user.firstname} ${user.lastname}`, entry.dateofwork, entry.starttime, entry.endtime, entry.lunchtime, submitHoursWorked, jobId, jobName, entry.task, entry.notes, submitTime]
        // console.log('entryArray:', entryArray);
        // if (!window.confirm(`Submit timesheet entry for ${responseText} on ${entry.dateofwork}?`)) return;

           
        // try {
        //     // Submit Entry
        //     // const res = await axios.post(`http://localhost:3000/api/v1/ultrenostimesheets`, entryArray);
        //     const res = await axios.post(`https://take2tech.herokuapp.com/api/v1/ultrenostimesheets`, entryArray);
        //     console.log('res.status', res.status);
        //     alert(`Your timesheet has been submitted.`);
        //     setEntry(ENTRY_INIT);
            
        // } catch(e) {
        //     console.error(e.message);
        //     alert('Something went wrong, please try again');
           
        // }
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
        console.log('editEntry:', editEntry)
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
            Array.from(currentJobsArrays.data.data).map(currentJobArray=>incomingCurrentJobs.push([`${currentJobArray[0]} ${currentJobArray[1]}`]))
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
       <div className='login-signup-container' style={{backgroundColor: 'palegolderod'}}>
            {/* <Spinner /> */}
            <PageTitle maintitle='Edit Timesheet Entry' subtitle={user.email&&`for ${user.firstname} ${user.lastname}`} />
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
                            placeholder={editEntry.dateofwork}
                            required
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
                            placeholder={editEntry.starttime}
                            name='starttime'
                            required
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
                            placeholder={editEntry.endtime}
                            name='endtime'
                            required
                        />
                        <div className="input-name input-margin">
                            <h3>Lunch Time</h3>
                        </div>
                        <select 
                            className="field-input"
                            style={{width: '100%'}}
                            type='text'
                            id={uuid()}
                            value={entry.lunchtime}
                            onChange={handleChange}
                            name='lunchtime'
                            placeholder={editEntry.lunchtime===''?'0 minutes':editEntry.lunchtime}
                            required
                        >  
                            <option key='whichjobsite'>Lunch Time?</option>  
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
                            placeholder={editEntry.jobname}
                            required
                        >  
                            <option key='whichjobsite'>Which Job-site?</option>  
                            {currentJobs&&currentJobs.map(currentJob=><option key={currentJob} value={currentJob}>{currentJob[0]}&nbsp;&nbsp;{currentJob[1]}</option>)} 
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
                            placeholder={editEntry.task}
                            name='task'
                            required
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
                            placeholder={editEntry.notes}
                        /> 
                    </div>
                    <div hidden>Entry Id: {editEntry.entryId}</div>
                    <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                        <div style={{marginRight: '5px', width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                            <button type='button' className="submit-btn login-signup-title" onClick={handleSubmit} style={{width: '120px', margin: 'auto'}}>
                                Submit
                            </button>
                        </div>
                        <div style={{marginLeft: '5px', width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                            <button type='button' className="submit-btn login-signup-title" onClick={()=>setPage('TimesheetView')} style={{width: '120px', margin: 'auto', backgroundColor: '#000', color: 'white'}}>
                                Cancel
                            </button>
                        </div>
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

export default EditTimesheet;
