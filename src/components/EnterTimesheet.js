// packages
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import uuid from 'react-uuid';

// internal
import LoginSignupCSS from '../styles/LoginSignup.css';
import PageTitle from '../components/PageTitle';
import Spinner from '../components/Spinner';
import {UserContext} from "../contexts/UserContext";
import {ENTRY_INIT, LUNCH_TIMES_INIT} from "../constants/inits";
import {
    getMinutesWorked,
    minutesToText,
    isFutureDay
} from "../utils/helpers";

function EnterTimesheet({setPage}) {
    const { user } = useContext(UserContext);
    const [todayDate, setTodayDate] = useState();
    const [winWidth, setWinWidth] = useState(2000);
    const [tasks, setTasks] = useState();
    const [currentJobs, setCurrentJobs] = useState();
    const [lunchTimes] = useState(LUNCH_TIMES_INIT);
    const [entry, setEntry]= useState(ENTRY_INIT);
    
    const handleChange = (e) => {
        switch (e.target.name) {
            case 'starttime': 
                setEntry({...entry, starttime: e.target.value, endtime: `${e.target.value.split('T')[0]}T00:00`});
                break
            case 'endtime': 
                setEntry({...entry, endtime: e.target.value});
                break
            case 'lunchtime': 
                setEntry({...entry, lunchtime: e.target.value});
                break
            case 'jobname': 
                setEntry({...entry, jobname: e.target.value});
                break
            case 'task': 
                setEntry({...entry, task: e.target.value});
                break
            case 'notes': 
                setEntry({...entry, notes: e.target.value});
                break
            default :
        }
    }
    const handleSubmit = async () => {
        // Validations
        if (isFutureDay(entry.starttime)) return alert("Timesheet may not be submitted for a future date.")
        if (!entry.starttime||entry.starttime==='Start Time?') return alert('Please enter start time.');
        if (!entry.endtime||entry.endtime==='End Time?') return alert('Please enter end time.');
        if (!entry.lunchtime||entry.endtime==='How long for lunch?') return alert('Please enter lunch time (0 minutes if no break taken).');
        if (!entry.jobname||entry.jobname==='Which Job-site?') return alert('Please select a Job-site.');
        if (!entry.task||entry.task==='What type of work?') return alert('Please select type of work.');
        
        // calculate hours & Validate date and times
        const minutesWorked = getMinutesWorked(entry.starttime, entry.endtime, entry.lunchtime);
        if (minutesWorked===-1) return alert('End Time must be after Start Time.');
        if (minutesWorked===-2) return alert('Lunch Time is longer than hours worked.');
        
        // for in-app message to user
        const responseText = minutesToText(minutesWorked);
        
        //find job id
        let jobId=entry.jobname.split(',')[0];
        const jobName=entry.jobname.split(',')[1];

        // create submit object
        const entryObject = {
            "userid": user.email,
            "firstname": user.firstname,
            "lastname": user.lastname,
            "starttime": entry.starttime, 
            "endtime": entry.endtime,
            "lunchtime": entry.lunchtime,
            "jobid": jobId,
            "jobname": jobName,
            "task": entry.task,
            "notes": entry.notes
        }
        // in-app confirm message
        if (!window.confirm(`Submit timesheet entry for ${responseText} on ${entry.starttime.split('T')[0]}?`)) return;
        // start spinner
        if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="flex";
        try {
            // Submit Entry
            await axios.post(`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/appendtimesheet`, entryObject);
            // stop spinner
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
            // in-app message
            setTimeout(()=>{alert(`Your timesheet has been submitted.`); setPage('ViewTimesheets');},200);
            // reset environment
            setEntry(ENTRY_INIT);
        } catch(e) {
            // log error
            console.error(e.message);
            // stop spinner
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
            // in-app message
            setTimeout(()=>{alert('Something went wrong, please check network connection.')}, 200);
        }
        // stop spinner TODO test if necessary
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
                // *** TASKS
                // For dynamic tasks
                // const tasksArrays = await axios.get(`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/supportlists/tasks`);
                // let incomingTasks = [];
                // Array.from(tasksArrays.data.data).forEach((taskArray, idx)=>idx>0&&incomingTasks.push(taskArray.task));
                // setTasks(incomingTasks);
                // For Static Portfolio Tasks
                const portfolioTasks = [
                    'Framing',
                    'Windows or Doors',
                    'Plumbing',
                    'Electrical',
                    'HVAC',
                    'Exterior',
                    'Cabinetry',
                    'Painting',
                    'Flooring',
                    'Cleaning',
                    'Driving',
                    'Other (please enter in notes)'
                ]
                setTasks(portfolioTasks);
            } catch (e) {
                // log error
                console.log(e.message)
                // stop spinner
                if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
                // in-app message
                alert('There is a problem filling the select boxes on the timesheet. Please check your network connection.');
                // reset environment
                setPage('Homepage');
            }
            try {
                // *** CURRENT JOBS
                // for dynamic jobs
                // const currentJobsArrays = await axios.get(`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/supportlists/currentjobs`);
                // let incomingCurrentJobs = [];
                // Array.from(currentJobsArrays.data.data).forEach(currentJobArray=>{if (currentJobArray.current===true&&currentJobArray!==undefined&&currentJobArray.jobname&&currentJobArray.jobname.toUpperCase()!=='JOBNAMEDB') incomingCurrentJobs.push([`${currentJobArray.jobid}`, `${currentJobArray.jobname}`])})
                // setCurrentJobs(incomingCurrentJobs);
                
                //for static portfolio jobs
                const portfolioJobs = [
                    'C48327 Reid',
                    'C32853 Wong',
                    'C43637 Moore',
                    'C32896 Bouchard',
                    'C38295 Morin',
                    'C32367 Martin',
                    'C43295 Tramblay',
                    'C34523 Landry',
                    'C68329 Chan',
                    'C38296 Johnston',
                    'C32862 Poirier',
                    'C53263 Stayley',
                    'C68926 Brown',
                    'C32863 Stewart',
                    'C32528 Park'
                ]
                setCurrentJobs(portfolioJobs);
            } catch (e) {
                // log error
                console.log(e.message)
                // stop spinner
                if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
                // in-app message
                alert('There is a problem entering timesheet. Please check network connection.');
                // reset environment
                setPage('Homepage');
            }
        }
        try {
            getSupportLists()
        } catch(e) {
            // log error
            console.log(e.message)
        }      
    },[setPage]);
    return ( 
       <>
       <div className='login-signup-container'>
            <Spinner />
            <PageTitle maintitle='Timesheet Entry' subtitle={user.email&&`for ${user.firstname} ${user.lastname}`} />
            <h4 style={{textAlign: 'center'}}>Today is {todayDate}</h4>
            
            <div className='form-container' id="signup" style={{marginTop: '0px'}}>
                <form style={{marginTop: `${winWidth<750?'-50px':''}`}} onSubmit={()=>handleSubmit()}>
                    <div className='login-form'>
                        <div className="input-name">
                            <h3>Start Time</h3>
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
                            type='datetime-local'
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
                            <option name='howlongforlunch' value='howlongforlunch' key='howlongforlunch'>How long for lunch?</option>
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
                            {currentJobs&&currentJobs.map(currentJob=><option key={currentJob} value={currentJob}>{currentJob}</option>)} 
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
                            <button type='reset' onClick={()=>{setEntry(ENTRY_INIT);setPage('Homepage');}} className="submit-btn login-signup-title" style={{width: '120px', margin: 'auto', backgroundColor: '#000', color: 'white'}}>
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
