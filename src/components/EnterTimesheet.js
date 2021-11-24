// packages
import {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import uuid from 'react-uuid';

// internal
import LoginSignupCSS from '../styles/LoginSignup.css';
import PageTitle from '../components/PageTitle';
import Spinner from '../components/Spinner';
import {UserContext} from "../contexts/UserContext";
import {ENTRY_INIT, LUNCHTIMES} from "../constants/inits";
import {
    getMinutesWorked,
    minutesToText,
    isFutureDay,
    cleanCommas,
    cleanHiddenCharacters
} from "../utils/helpers";

function EnterTimesheet({setPage}) {
    const {user} = useContext(UserContext);
    const [todayDate, setTodayDate] = useState();
    const [winWidth, setWinWidth] = useState(2000);
    const [tasks, setTasks] = useState();
    const [currentJobs, setCurrentJobs] = useState();
    const [entry, setEntry]= useState(ENTRY_INIT);
    
    const handleChange = (evt) => {
        if (evt.target.name==='starttime') {
            setEntry({...entry, starttime: evt.target.value, endtime: `${evt.target.value.split('T')[0]}T00:00`});
        } else {
            setEntry({...entry, [evt.target.name]: evt.target.value});
        }
    }
    const handleSubmit = async () => {
        // Validations
        if (isFutureDay(entry.starttime)) return alert("Timesheet may not be submitted for a future date.")
        if (!entry.starttime||entry.starttime==='Start Time?') return alert('Please enter start time.');
        if (!entry.endtime||entry.endtime==='End Time?') return alert('Please enter end time.');
        if (!entry.lunchtime||entry.lunchtime==='How long for lunch?') return alert('Please enter lunch time (0 minutes if no break taken).');
        if (!entry.jobname||entry.jobname==='Which Job-site?') return alert('Please select a Job-site.');
        if (!entry.task||entry.task==='What type of work?') return alert('Please select type of work.');
        
        // calculate hours
        const minutesWorked = getMinutesWorked(entry.starttime, entry.endtime, entry.lunchtime);
        if (minutesWorked===-1) return alert('End Time must be after Start Time.');
        if (minutesWorked===-2) return alert('Lunch Time is longer than hours worked.');
        
        // for in-app message to user
        const responseText = minutesToText(minutesWorked);
        // confirm submission with user
        if (!window.confirm(`Submit timesheet entry for ${responseText} on ${entry.starttime.split('T')[0]}?`)) return;
        // start spinner
        if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="flex";
        //find job id
        let jobId=entry.jobname.split(' ')[0];
        let jobName=entry.jobname.split(' ')[1];
        if (jobId.toUpperCase().startsWith("OTHER")) {jobId="Other"; jobName="  ";}
        if (entry.task.toUpperCase().startsWith("OTHER")) entry.task="Other";
        
        // create submit object
        let entryObject = {
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
        // clean linebreaks and commas from text fields
        entryObject = cleanCommas(entryObject);
        entryObject = cleanHiddenCharacters(entryObject);

        // submit entry
        try {
            await axios.post(`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/appendtimesheet`, entryObject);
            // stop spinner
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
            // in-app message
            setTimeout(()=>{alert(`Your timesheet has been submitted.`); setPage('ViewTimesheets');},200);
            // set environment
            setEntry(ENTRY_INIT);
        } catch(e) {
            // log error
            console.error(e.response);
            console.error(e.response.data.error);
            // stop spinner
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
            // in-app message
            if (e.response&&e.response.data&&e.response.data.error&&e.response.data.error.includes('overlaps')) {
                setTimeout(()=>{alert('Time overlaps with another timesheet. Please select "View Timesheets" from the menu to see the overlapping timesheet.')}, 200);
            } else {
                setTimeout(()=>{alert('Something went wrong, please check network connection.')}, 200);
            }
            
        }
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
            // tasks
            try {
                const tasksArrays = await axios.get(`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/supportlists/tasks`);
                let incomingTasks = [];
                Array.isArray(Array.from(tasksArrays.data.data))&&Array.from(tasksArrays.data.data).forEach((taskArray, idx)=>idx>0&&incomingTasks.push(taskArray.task))
                setTasks(incomingTasks);
            } catch (e) {
                // log error
                console.log(e.message)
                // stop spinner
                if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
                // in-app message
                alert('There is a problem filling the select boxes on the timesheet. Please check your network connection.');
                setPage('Homepage');
            }
            // current jobs
            try {
                const currentJobsArrays = await axios.get(`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/supportlists/currentjobs`);
                let incomingCurrentJobs = [];
                Array.isArray(Array.from(currentJobsArrays.data.data))&&Array.from(currentJobsArrays.data.data).forEach(currentJobArray=>{if (currentJobArray.current===true&&currentJobArray!==undefined&&currentJobArray.jobname&&currentJobArray.jobname.toUpperCase()!=='JOBNAMEDB') incomingCurrentJobs.push([`${currentJobArray.jobid} ${currentJobArray.jobname}`])})
                setCurrentJobs(incomingCurrentJobs);
            } catch (e) {
                // log error
                console.log(e.message)
                // stop spinner
                if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
                // in-app message
                alert('There is a problem entering timesheet. Please check network connection.');
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
                <form style={{marginTop: `${winWidth<=750?'-50px':''}`}} onSubmit={()=>handleSubmit()}>
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
                            {LUNCHTIMES&&LUNCHTIMES.map(lunchTime=><option key={lunchTime} value={lunchTime}>{lunchTime} minutes</option>)} 
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
                            <option key='notfoundtask' value={'Other (please enter in notes)'}>Other (please enter in notes)</option>
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
