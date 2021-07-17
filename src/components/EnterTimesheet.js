// packages
import React, { useState, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import uuid from 'react-uuid';

// internal
import LoginSignupCSS from '../styles/LoginSignup.css';
import PageTitle from '../components/PageTitle';
import Spinner from '../components/Spinner';
import {UserContext} from "../contexts/UserContext";
import {ENTRY_INIT} from "../constants/inits";
import {
    getMinutesWorked, 
    minutesToDigital, 
    minutesToText, 
    getNowYYYYMMDDTHHMMSS, 
    isFutureDay
} from "../utils/helpers";
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
function EnterTimesheet(props) {
    const { user } = useContext(UserContext);
    const [todayDate, setTodayDate] = useState();
    const [winWidth, setWinWidth] = useState(2000);
    const [tasks, setTasks] = useState();
    const [currentJobs, setCurrentJobs] = useState();
    const [lunchTimes, setLunchTimes] = useState();
    const [entry, setEntry]= useState(ENTRY_INIT);
    
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
        // Validations
        if (!entry.dateofwork||entry.dateofwork==='Date of Work?') return alert('Please enter date of work.');
        if (isFutureDay(entry.dateofwork)) return alert("Timesheet may not be submitted for a future date.")
        if (!entry.starttime||entry.starttime==='Start Time?') return alert('Please enter start time.');
        if (!entry.endtime||entry.endtime==='End Time?') return alert('Please enter end time.');
        if (!entry.lunchtime||entry.endtime==='How long for lunch?') return alert('Please enter lunch time (0 minutes if no break taken).');
        if (!entry.jobname||entry.jobname==='Which Job-site?') return alert('Please select a Job-site.');
        if (!entry.task||entry.task==='What type of work?') return alert('Please select type of work.');
        const startTimeDate = `${entry.dateofwork}T${entry.starttime}`;
        console.log('startTimeDate:', startTimeDate)
        const endTimeDate = `${entry.dateofwork}T${entry.endtime}`;
        console.log('endTimeDate:', endTimeDate)
        // calculate hours
        const minutesWorked = getMinutesWorked(startTimeDate, endTimeDate, entry.lunchtime);
        if (minutesWorked===-1) return alert('End Time must be after Start Time.');
        if (minutesWorked===-2) return alert('Lunch Time is longer than hours worked.');
        const responseText = minutesToText(minutesWorked);
        
        //find job id
        let jobId=entry.jobname.split(',')[0];
        const jobName=entry.jobname.split(',')[1];

        // format start and endtime

        const submitStart = `${entry.dateofwork}T${entry.starttime}`;
        const submitEnd = `${entry.dateofwork}T${entry.endtime}`;

        currentJobs.map(job=>job[1].toUpperCase()===entry.jobname.toUpperCase()?jobId=job[0]:'');
        // create submit object
        const entryObject = {
            "userid": user.email,
            "firstname": user.firstname,
            "lastname": user.lastname,
            "starttime": submitStart,
            "endtime": submitEnd,
            "lunchtime": entry.lunchtime,
            "jobid": jobId,
            "jobname": jobName,
            "task": entry.task,
            "notes": entry.notes
        }
        console.log('entryObject:', entryObject)
        if (!window.confirm(`Submit timesheet entry for ${responseText} on ${entry.dateofwork}?`)) return;
        if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="flex";
        try {
            // Submit Entry
            // await axios.post(`http://localhost:3000/api/v1/ultrenostimesheets/appendtimesheet`, entryObject);
            // await axios.post(`https://ultrenostimesheets-testing-api.herokuapp.com/api/v1/ultrenostimesheets/appendtimesheet`, entryObject);
            await axios.post(`https://take2tech.herokuapp.com/api/v1/ultrenostimesheets/appendtimesheet`, entryObject);
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
            setTimeout(()=>{alert(`Your timesheet has been submitted.`); props.setPage('ViewTimesheets');},200);
            setEntry(ENTRY_INIT);
        } catch(e) {
            console.error(e.message);
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
            setTimeout(()=>{alert('Something went wrong, please check network connection.')}, 200);
        }
        if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
    }
    // set environment
    useEffect(()=>{
        const todayDateRaw = new Date();
        const month=todayDateRaw.getMonth()+1<10?`0${todayDateRaw.getMonth()+1}`:todayDateRaw.getMonth()+1;
        const day=todayDateRaw.getDate()<10?`0${todayDateRaw.getDate()}`:todayDateRaw.getDate();
        setTodayDate(`${todayDateRaw.getFullYear()}/${month}/${day}`);
        setWinWidth(window.innerWidth);
        if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
    },[]);
    // get support lists
    useEffect(()=>{
        async function getSupportLists() {
            try {
                // tasks
                const tasksArrays = await axios.get(`https://take2tech.herokuapp.com/api/v1/ultrenostimesheets/supportlists/tasks`);
                // const tasksArrays = await axios.get(`http://localhost:3000/api/v1/ultrenostimesheets/supportlists/tasks`);
                let incomingTasks = [];
                Array.from(tasksArrays.data.data).map((taskArray, idx)=>idx>0&&incomingTasks.push(taskArray[0]))
                setTasks(incomingTasks);
            } catch (e) {
                console.log(e.message)
                if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
                alert('There is a problem entering timesheet. Please check your network connection.');
                props.setPage('Homepage');
            }
            
            // lunch times
            const lunchTimes = [
                '0 minutes',
                '15 minutes',
                '30 minutes',
                '45 minutes',
                '60 minutes',
                '90 minutes'
            ]
            setLunchTimes(lunchTimes);
            try {
                // current jobs
                const currentJobsArrays = await axios.get(`https://take2tech.herokuapp.com/api/v1/ultrenostimesheets/supportlists/currentjobs`);
                // const currentJobsArrays = await axios.get(`http://localhost:3000/api/v1/ultrenostimesheets/supportlists/currentjobs`);
                
                console.log(currentJobsArrays.data)
                let incomingCurrentJobs = [];
                Array.from(currentJobsArrays.data.data).map(currentJobArray=>{if (currentJobArray.current===true&&currentJobArray!==undefined&&currentJobArray.jobname&&currentJobArray.jobname.toUpperCase()!=='JOBNAMEDB') incomingCurrentJobs.push([`${currentJobArray.jobid}`, `${currentJobArray.jobname}`])})
                setCurrentJobs(incomingCurrentJobs);
            } catch (e) {
                console.log(e.message)
                if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
                alert('There is a problem entering timesheet. Please check network connection.');
                props.setPage('Homepage');
            }
            
        }
        try {
            getSupportLists()
        } catch(e) {
            console.log(e.message)
        }      
    },[props.setPage]);
    return ( 
       <>
       <div className='login-signup-container'>
            <Spinner />
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
                            name='starttime'
                            required
                        />
                        <div className="input-name">
                            <h3>testStart Time</h3>
                        </div>
                        <input 
                            className="field-input"
                            type='datetime-local'
                            id={uuid()}
                            value={entry.starttime}
                            onChange={handleChange}
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
                            name='endtime'
                            required
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
                            required
                        >
                            <option name='15' value='15' key='howlongforlunch'>How long for lunch?</option>
                            {lunchTimes&&lunchTimes.map(lunchTime=><option key={lunchTime} value={lunchTime.substr(0,2)}>{lunchTime}</option>)} 
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
                            required
                        > 
                            <option key='whichjobsite'>Which Job-site?</option>
                            {currentJobs&&currentJobs.map(currentJob=><option key={currentJob} value={currentJob}>{currentJob[0]}&nbsp;&nbsp;{currentJob[1]}</option>)} 
                            <option key='notfoundjobsite' value={['Other', '(please enter in notes)']}>Other (please enter in notes)</option>  
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
                        /> 
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div style={{marginRight: '5px', width: '100%', display: 'flex', justifyContent: 'space-evenly', marginTop: '20px'}}>
                            <button type='button' className="submit-btn login-signup-title" onClick={handleSubmit} style={{width: '120px', margin: 'auto'}}>
                                Submit
                            </button>
                        </div>
                        <div style={{marginLeft: '5px', width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                            <button type='reset' onClick={()=>{setEntry(ENTRY_INIT);props.setPage('Homepage');}} className="submit-btn login-signup-title" style={{width: '120px', margin: 'auto', backgroundColor: '#000', color: 'white'}}>
                                Cancel
                            </button>
                        </div>
                    </div>
                   
                </form>
                <LoginSignupCSS />
            </div>
        </div>
        </>
    )
}

export default EnterTimesheet;
