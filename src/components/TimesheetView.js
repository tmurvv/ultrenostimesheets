import {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import PageTitle from '../components/PageTitle';
import {UserContext} from '../contexts/UserContext';
import TimesheetViewCss from '../styles/TimesheetView.css';

function TimesheetView({ maintitle, subtitle }) {
    const [winWidth, setWinWidth] = useState(2000);
    const [todayDate, setTodayDate] = useState(2000);
    const [entries, setEntries] = useState(2000);
    const {user} = useContext(UserContext);
    
    function checkEntryEditable(date) {
        const nowDate = new Date;
        const entryTime = new Date(date);
        const dayMillies = 24*60*60*1000;
        console.log('nowDate:', nowDate)
        console.log('nowDateMillies:', nowDate.getTime())
        console.log('entryTime:', entryTime)
        return false;
        return nowDate.getTime()-entryTime.getTime()<dayMillies;
    }
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
            // const tasksArrays = await axios.get(`https://take2tech.herokuapp.com/api/v1/ultrenostimesheets/supportlists/tasks`);
            const entriesArrays = await axios.get(`http://localhost:3000/api/v1/ultrenostimesheets/`);
            console.log('entryArrays:', entriesArrays)
            let incomingEntries = [];
            Array.from(entriesArrays.data.data).map((entryArray, idx)=>idx>0&&incomingEntries.push(entryArray))
            console.log(incomingEntries[0][0], user.email)
            const entriesFilter = incomingEntries.filter(entry=>entry[0]===user.email); 
            console.log('entriesFilter:', entriesFilter)
            setEntries(entriesFilter);
            // // tasks
            // // const tasksArrays = await axios.get(`https://take2tech.herokuapp.com/api/v1/ultrenostimesheets/supportlists/tasks`);
            // const tasksArrays = await axios.get(`http://localhost:3000/api/v1/ultrenostimesheets/supportlists/tasks`);
            // let incomingTasks = [];
            // Array.from(tasksArrays.data.data).map((taskArray, idx)=>idx>0&&incomingTasks.push(taskArray[0]))
            // setTasks(incomingTasks);
            // // lunch times
            // // const lunchTimesArrays = await axios.get(`https://take2tech.herokuapp.com/api/v1/ultrenostimesheets/supportlists/lunchtimes`);
            // const lunchTimesArrays = await axios.get(`http://localhost:3000/api/v1/ultrenostimesheets/supportlists/lunchtimes`);
            // let incomingLunchTimes = [];
            // Array.from(lunchTimesArrays.data.data).map(lunchTimeArray=>incomingLunchTimes.push(lunchTimeArray[0]))
            // setLunchTimes(incomingLunchTimes);
            // // current jobs
            // // const currentJobsArrays = await axios.get(`https://take2tech.herokuapp.com/api/v1/ultrenostimesheets/supportlists/currentjobs`);
            // const currentJobsArrays = await axios.get(`http://localhost:3000/api/v1/ultrenostimesheets/supportlists/currentjobs`);
            // let incomingCurrentJobs = [];
            // Array.from(currentJobsArrays.data.data).map(currentJobArray=>incomingCurrentJobs.push(currentJobArray[1]))
            // setCurrentJobs(incomingCurrentJobs);
            // setFullCurrentJobs(currentJobsArrays.data.data);
        }
        try {
            getSupportLists(user.email)
        } catch(e) {
            console.log(e.message)
        }      
    },[]);
    return (
        <div style={{marginTop: '50px'}}>
        {/* <PageTitle maintitle='Timesheet Entry' subtitle={user.email&&`for ${user.firstname} ${user.lastname}`} /> */}
        <PageTitle maintitle='View Timesheets' subtitle= {`For ${user.firstname} ${user.lastname}. Entries may be edited within 24 hours of submission.`}/>
        <h4 style={{textAlign: 'center'}}>Today is {todayDate}</h4>
        {winWidth<750?
        <table className='table'>
            {Array.isArray(entries)?entries.map(entry=>
            <tr className='row'>
                {/* <td className='cell' style={{display: `{${checkEntryEditable(entry[11])}:'flex':;none'}`, justifyContent: 'flex-end'}}> */}
                <td className='cell' style={{display: `${((new Date).getTime()-86400000>(new Date).getTime(entry[11]))&&'none'}`, justifyContent: 'flex-end'}}>
                    <img src='img/editItemIcon.png' style={{height: '15px', margin: '5px'}} onClick={()=>alert('Edit Entry coming soon.')} alt='edit button' />
                    <img src='img/deleteRedX.png' style={{height: '15px', margin: '5px'}} onClick={()=>alert('Delete Entry coming soon.')} alt='delete button' />
                </td>
                <td className='cell'><span className='header'>Date Worked:&nbsp;</span>{entry[2]}</td>
                <td className='cell'><span className='header'>Start Time:&nbsp;</span>{entry[3]}</td>
                <td className='cell'><span className='header'>End Time:&nbsp;</span>{entry[4]}</td>
                <td className='cell'><span className='header'>Hours Worked:&nbsp;</span>{entry[5]}</td>
                <td className='cell'><span className='header'>Job Name:&nbsp;</span>{entry[8]}</td>
                <td className='cell'><span className='header'>Task:&nbsp;</span>{entry[9]}</td>
                <td className='cell'><span className='header'>Notes:&nbsp;</span>{entry[10]}</td>
            </tr>):<p>No entries found.</p>}
        </table>:''
        }
        {winWidth>=750&&
        <table className='table' style={{maxWidth: 'unset'}}>
            <tr className='row'>
                <th className='header'>Date Worked</th>
                <th className='header'>Start Time</th>
                <th className='header'>End Time</th>
                <th className='header'>Hours Worked</th>
                <th className='header'>Task</th>
                <th className='header'>Job Name</th>
                <th className='header'>Notes</th>
            </tr>
            {Array.isArray(entries)?entries.map(entry=>
            <tr className='row'>
                <td className='cell'>{entry[2]}</td>
                <td className='cell'>{entry[3]}</td>
                <td className='cell'>{entry[4]}</td>
                <td className='cell'>{entry[5]}</td>
                <td className='cell'>{entry[8]}</td>
                <td className='cell'>{entry[9]}</td>
                <td className='cell'>{entry[10]}</td>
            </tr>
            ):<tr>No entries found.</tr>} 
        </table>
        }
            
            
        
        <TimesheetViewCss />
        </div>
    )
}

export default TimesheetView;
