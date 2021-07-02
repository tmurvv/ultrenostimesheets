import {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import PageTitle from '../components/PageTitle';
import {UserContext} from '../contexts/UserContext';
import {PageContext} from '../contexts/PageContext';
import {EditEntryContext} from '../contexts/EditEntryContext';

import TimesheetViewCss from '../styles/TimesheetView.css';

function TimesheetView({ maintitle, subtitle }) {
    const [winWidth, setWinWidth] = useState(2000);
    const [todayDate, setTodayDate] = useState(2000);
    const [entries, setEntries] = useState(2000);
    const {user} = useContext(UserContext);
    const {page, setPage} = useContext(PageContext);
    const {editEntry, setEditEntry} = useContext(EditEntryContext);
    
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
    async function handleDelete(delId) {
        if (!window.confirm(`Delete this timesheet entry?`)) return;

        try {
            // shortcut entryId
            if (!delId) throw new Error('Entry Id not found. Entry not updated');
            // Submit Entry
            // const res = await axios.post('http://localhost:3000/api/v1/ultrenostimesheets/deletetimesheet', {delId});
            const res = await axios.post('https://take2tech.herokuapp.com/api/v1/ultrenostimesheets/deletetimesheet', {delId});
            console.log('res.status', res.status);
            setPage('TimesheetEntry');
            alert(`Your timesheet entry has been deleted.`);
        } catch(e) {
            console.error(e.message);
            alert('Something went wrong, please try again.');  
        }
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
        if (!user) return;
        async function getSupportLists() {
            // tasks
            const entriesArrays = await axios.get(`https://take2tech.herokuapp.com/api/v1/ultrenostimesheets/`);
            // const entriesArrays = await axios.get(`http://localhost:3000/api/v1/ultrenostimesheets/`);
            console.log('entryArrays:', entriesArrays)
            let incomingEntries = [];
            Array.from(entriesArrays.data.data).map((entryArray, idx)=>idx>0&&incomingEntries.push(entryArray))
            // add zeros to time entries
            let entriesFilter = incomingEntries.filter(entry=>entry[0]===user.email);
            entriesFilter.map(entry=>{
                if (entry[3].split(':')[0].length===1) entry[3]=`0${entry[3]}`;
                if (entry[4].split(':')[0].length===1) entry[4]=`0${entry[4]}`;
            });
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
    },[user]);
    return (
        <div style={{marginTop: '50px'}}>
        {/* <PageTitle maintitle='Timesheet Entry' subtitle={user.email&&`for ${user.firstname} ${user.lastname}`} /> */}
        <PageTitle maintitle='View Timesheets' subtitle= {`for ${user.firstname} ${user.lastname}. Entries may be edited within 24 hours of submission.`}/>
        <h4 style={{textAlign: 'center'}}>Today is {todayDate}</h4>
        {winWidth<750?
        <table className='table' style={{boxShadow: 'none'}}>
            {Array.isArray(entries)?entries.map(entry=>
            <tr className='row' style={{borderRadius: '7px', backgroundColor: 'rgba(2, 2, 2, 0.07)', marginBottom: '25px'}}>
                {/* <td className='cell' style={{display: `{${checkEntryEditable(entry[11])}:'flex':;none'}`, justifyContent: 'flex-end'}}> */}
                <td className='cell' style={{display: `${((new Date).getTime()-86400000>(new Date).getTime(entry[11]))&&'none'}`, justifyContent: 'flex-end'}}>
                    <img src='img/editItemIcon.png' style={{height: '15px', margin: '5px'}} onClick={()=>{
                        setPage('EditTimesheet'); 
                            setEditEntry({
                            entryId: entry[12],
                            dateofwork: entry[2],
                            starttime: entry[3],
                            endtime: entry[4],
                            lunchtime: entry[5],
                            jobname: `${entry[7]} ${entry[8]}`,
                            task: entry[9],
                            notes: entry[10],
                    })}} alt='edit button' />
                    <img src='img/deleteRedX.png' style={{height: '15px', margin: '5px'}} onClick={()=>handleDelete(entry[12])} alt='delete button' />
                </td>
                <td className='cell'><span className='header'>Date Worked:&nbsp;</span>{entry[2]}</td>
                <td className='cell'><span className='header'>Start Time:&nbsp;</span>{entry[3]}</td>
                <td className='cell'><span className='header'>End Time:&nbsp;</span>{entry[4]}</td>
                <td className='cell'><span className='header'>Lunch Time:&nbsp;</span>{entry[5]}</td>
                <td className='cell'><span className='header'>Hours Worked:&nbsp;</span>{entry[6]}</td>
                <td className='cell'><span className='header'>Job Worked:&nbsp;</span>{entry[7]}&nbsp;&nbsp;{entry[8]}</td>
                <td className='cell'><span className='header'>Task:&nbsp;</span>{entry[9]}</td>
                <td className='cell'><span className='header'>Notes:&nbsp;</span>{entry[10]}</td>
            </tr>):<p>No entries found.</p>}
        </table>:''
        }
        {winWidth>=750&&
        <table className='table' style={{maxWidth: 'unset'}}>
            <tr className='row'>
                <th className='header'></th>
                <th className='header'>Date Worked</th>
                <th className='header'>Start Time</th>
                <th className='header'>End Time</th>
                <th className='header'>Lunch Time</th>
                <th className='header'>Hours Worked</th>
                <th className='header'>Job Worked</th>
                <th className='header'>Task</th>
                <th className='header'>Notes</th>
            </tr>
            {Array.isArray(entries)?entries.map(entry=>
            <tr className='row'>
                <td className='cell' style={{display: `${((new Date).getTime()-86400000>(new Date).getTime(entry[11]))&&'none'}`, justifyContent: 'flex-end'}}>
                    <img src='img/editItemIcon.png' style={{height: '15px', margin: '5px'}} onClick={()=>{setPage('EditTimesheet'); setEditEntry({
                        entryId: entry[12],
                        dateofwork: entry[2],
                        starttime: entry[3],
                        endtime: entry[4],
                        lunchtime: entry[5],
                        jobname: `${entry[7]} ${entry[8]}`,
                        task: entry[9],
                        notes: entry[10],
                    })}} alt='edit button' />
                    <img src='img/deleteRedX.png' style={{height: '15px', margin: '5px'}} onClick={()=>handleDelete(entry[12])} alt='delete button' />
                </td>
                <td className='cell'>{entry[2]}</td>
                <td className='cell'>{entry[3]}</td>
                <td className='cell'>{entry[4]}</td>
                <td className='cell'>{entry[5]}</td>
                <td className='cell'>{entry[6]}</td>
                <td className='cell'>{entry[7]}  {entry[8]}</td>
                <td className='cell'>{entry[9]}</td>
                <td className='cell'>{entry[10]}</td>
            </tr>
            ):<tr>Loading...</tr>} 
        </table>
        }
            
            
        
        <TimesheetViewCss />
        </div>
    )
}

export default TimesheetView;
