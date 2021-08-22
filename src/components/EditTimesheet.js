// packages
import {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import uuid from 'react-uuid';

// internal
import LoginSignupCSS from '../styles/LoginSignup.css';
import PageTitle from '../components/PageTitle';
import Spinner from '../components/Spinner';
import {UserContext} from "../contexts/UserContext";
import {PageContext} from "../contexts/PageContext";
import {EditEntryContext} from "../contexts/EditEntryContext";
import {ENTRY_INIT, LUNCHTIMES} from "../constants/inits";
import {
    getMinutesWorked,  
    isFutureDay,
    checkJobsite
} from "../utils/helpers";

function EditTimesheet(props) {
    const { user } = useContext(UserContext);
    const [todayDate, setTodayDate] = useState();
    const [winWidth, setWinWidth] = useState(2000);
    const [tasks, setTasks] = useState();
    const [currentJobs, setCurrentJobs] = useState();
    const {editEntry, setEditEntry} = useContext(EditEntryContext);
    const {setPage} = useContext(PageContext);
    const [entry, setEntry]= useState(editEntry);

    const handleChange = (evt) => {
        setEntry({...entry, [evt.target.name]: evt.target.value});
    }

    const handleSubmit = async (evt) => {
        // in-app message
        if (!window.confirm(`Make changes to this timesheet, are you sure?`)) return;
        // combine editEntry and entry objects into one update object
        const updateObject = {
            starttime: entry.starttime,
            endtime: entry.endtime,
            lunchtime: entry.lunchtime,
            jobname: entry.jobname,
            jobid: entry.jobid,
            task: entry.task,
            notes: entry.notes,
            submitTime: editEntry.timesubmitted,
            entryId: editEntry.entryId,
        }
        // validations
        if (isFutureDay(entry.starttime)) return alert("Timesheet may not be submitted for a future date.")
        if (!updateObject.starttime) return alert('Please enter start time.');
        if (!updateObject.endtime) return alert('Please enter end time.');
        if ((!(updateObject.lunchtime)&&updateObject.lunchtime!==0)||(String(updateObject.lunchtime).toUpperCase()==='LUNCH TIME?')) return alert('Please enter lunch time (0 minutes if no break taken).');
        if (!updateObject.jobname||updateObject.jobname==='Which Job-site?') return alert('Please select a Job-site.');
        if (!updateObject.task||updateObject.task==='What type of work?') return alert('Please select type of work.');
        // calculate hours && validate
        const minutesWorked = getMinutesWorked(updateObject.starttime, updateObject.endtime, updateObject.lunchtime);       
        if (minutesWorked===-1) return alert('End Time must be after Start Time.');
        if (minutesWorked===-2) return alert('Lunch Time is longer that hours worked.');
        //find job id
        let jobId=updateObject.jobname.split(' ')[0];
        let jobName=updateObject.jobname.split(/ (.+)/)[1];
        // create submit object
        const entryObject = {
            starttime: updateObject.starttime, 
            endtime: updateObject.endtime, 
            lunchtime: updateObject.lunchtime, 
            jobid: jobId, 
            jobname: jobName, 
            task: updateObject.task, 
            notes: updateObject.notes, 
            id: editEntry.entryId
        };    
        try {
            // validate entryId
            if (!(editEntry.entryId)) throw new Error('Entry Id not found. Entry not updated');
            // start spinner
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="flex";
            // Submit Entry
            await axios.post(`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/updatetimesheet`, entryObject);
            // set environment
            setEditEntry(ENTRY_INIT);
            setPage('ViewTimesheets');
            // stop spinner
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
            // in-app message
            setTimeout(()=>{alert(`Your timesheet has been updated.`)},200);
        } catch(e) {
            // log error 
            console.log('error from edit timesheet:', e.message);
            // stop spinner
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
            // in-app message
            setTimeout(()=>{alert('Something went wrong, please check network connection.')},200);  
        }        
    }
    // set environment
    useEffect(()=>{
        // format today's date
        const todayDateRaw = new Date();
        const month=todayDateRaw.getMonth()+1<10?`0${todayDateRaw.getMonth()+1}`:todayDateRaw.getMonth()+1;
        const day=todayDateRaw.getDate()<10?`0${todayDateRaw.getDate()}`:todayDateRaw.getDate();
        setTodayDate(`${todayDateRaw.getFullYear()}/${month}/${day}`);
        // get window width
        setWinWidth(window.innerWidth);
        if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
    },[]);
    // get data
    useEffect(()=>{
        console.log('editEntry:', editEntry)
        async function getSupportLists() {
            // start spinner
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="flex";   
            // get tasks
            try {  
                const tasksArrays = await axios.get(`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/supportlists/tasks`);
                let incomingTasks = [];
                Array.from(tasksArrays.data.data).forEach((taskArray, idx)=>idx>0&&incomingTasks.push(taskArray.task));
                setTasks(incomingTasks);
            } catch (e) {
                console.log(e.message)
                if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
                alert('There is a problem editing timesheet. Please check your network connection.');
                setPage('Homepage');
            }
            // get current job-site list
            try {
                const currentJobsArrays = await axios.get(`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/supportlists/currentjobs`);
                let incomingCurrentJobs = [];
                Array.from(currentJobsArrays.data.data).forEach(currentJobArray=>{if (currentJobArray.current===true&&currentJobArray!==undefined&&currentJobArray.jobname&&currentJobArray.jobname.toUpperCase()!=='JOBNAMEDB') incomingCurrentJobs.push([`${currentJobArray.jobname&&currentJobArray.jobid}`, `${currentJobArray.jobname&&currentJobArray.jobname}`])})
                if (incomingCurrentJobs.length<=0) alert('Problem getting job list. Please check network connection.');
                // add choice for other
                incomingCurrentJobs.push(['Other', '(please enter in notes)']);
                // check that job-site on timesheet has not been removed from job-list and add it if necessary
                if (!checkJobsite(incomingCurrentJobs, editEntry)) incomingCurrentJobs.unshift([`${editEntry.jobname.split(' ')[0]}`, `${editEntry.jobname.split(' ')[1]}`]);
                // set environment
                setCurrentJobs(incomingCurrentJobs);
                // stop spinner
                if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
            } catch (e) {
                // log error
                console.log(e.message)
                // stop spinner
                if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
                // in-app message
                alert('There is a problem editing timesheet. Please check your network connection.');
                // set environment
                setPage('Homepage');
            }
        }
        try {
            // call support list function
            getSupportLists();
        } catch (e) {
            // log message
            console.log(e.message);
        }            
    },[setPage, editEntry]);
    return ( 
    <>
    <div className='login-signup-container' style={{backgroundColor: 'palegolderod'}}>
            <Spinner />
            <PageTitle maintitle='Edit Timesheet Entry' subtitle={user.email&&`for ${user.firstname} ${user.lastname}`} />
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
                            value={entry.starttime.substr(0,16)}
                            onChange={handleChange}
                            placeholder={editEntry.starttime.substr(0,16)}
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
                            value={entry.endtime.substr(0,16)}
                            onChange={handleChange}
                            placeholder={editEntry.endtime.substr(0,16)}
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
                            placeholder={editEntry.lunchtime}
                            required
                        >  
                            <option key='whichjobsite'>Lunch Time?</option>  
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
                            value={entry.jobname.replace('undefined', '').trim()}
                            onChange={handleChange}
                            name='jobname'
                            placeholder={editEntry.jobname}
                            required
                        >  
                            <option key='whichjobsite'>Which Job-site?</option>  
                            {currentJobs&&currentJobs.map(currentJob=><option key={currentJob} value={`${currentJob[0]} ${currentJob[1]}`}>{currentJob[0]}&nbsp;{currentJob[1]}</option>)} 
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
                        <div onClick={handleSubmit} style={{marginRight: '5px', width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                            <button type='button' className="submit-btn login-signup-title" style={{width: '120px', margin: 'auto'}}>
                                Submit
                            </button>
                        </div>
                        <div onClick={()=>setPage('ViewTimesheets')} style={{marginLeft: '5px', width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                            <button type='button' className="submit-btn login-signup-title" style={{width: '120px', margin: 'auto', backgroundColor: '#000', color: 'white'}}>
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

export default EditTimesheet;
