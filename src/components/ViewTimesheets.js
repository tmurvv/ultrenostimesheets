import {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import uuid from 'react-uuid';
import PageTitle from '../components/PageTitle';
import Spinner from '../components/Spinner'
import {UserContext} from '../contexts/UserContext';
import {PageContext} from '../contexts/PageContext';
import {EditEntryContext} from '../contexts/EditEntryContext';

import {getDateWorked, entryEditable, getMinutesWorked, minutesToDigital, minutesToText} from '../utils/helpers';
import ViewTimesheetsCss from '../styles/ViewTimesheets.css';

function ViewTimesheets({ maintitle, subtitle }) {
    const [winWidth, setWinWidth] = useState(2000);
    const [todayDate, setTodayDate] = useState(2000);
    const [entries, setEntries] = useState(2000);
    const {user} = useContext(UserContext);
    const {page, setPage} = useContext(PageContext);
    const {editEntry, setEditEntry} = useContext(EditEntryContext);
    const [found, setFound] = useState(true);
    
    async function handleDelete(delId) {
        if (!window.confirm(`Delete this timesheet entry?`)) return;
        if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="flex";
        try {
            // shortcut entryId
            if (!delId) throw new Error('Entry Id not found. Entry not updated');
            // Submit Entry
            // const res = await axios.post(`https://ultrenostimesheets-testing-api.herokuapp.com/api/v1/ultrenostimesheets/deletetimesheet`, {delid: delId});
            // const res = await axios.post('http://localhost:3000/api/v1/ultrenostimesheets/deletetimesheet', {delid: delId});
            const res = await axios.post('https://take2tech.herokuapp.com/api/v1/ultrenostimesheets/deletetimesheet', {delid: delId});
            setPage('RefreshView');
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
            setTimeout(()=>{alert(`Your timesheet entry has been deleted.`)},200);
        } catch(e) {
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none"; 
            setTimeout(()=>{alert(`Something went wrong, please check network connection.`)},200);
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
    // get data
    useEffect(()=>{
        if (!user) return;
        async function getEntries() {
            let res;
            try {
                res = await axios.post(`https://take2tech.herokuapp.com/api/v1/ultrenostimesheets/viewtimesheetsbyuser`, {userid: user.email});
            
                // get entries
                
                // const res = await axios.post(`https://ultrenostimesheets-testing-api.herokuapp.com/api/v1/ultrenostimesheets/viewtimesheetsbyuser`, {userid: user.email});
                // const res = await axios.post(`http://localhost:3000/api/v1/ultrenostimesheets/viewtimesheetsbyuser`, {userid: user.email});
                if (res.data.num_returned===0) setFound(false);
                let entries = res.data.data;
                
                entries.map(entry=>{
                    let startHours= (new Date(entry.starttime)).getHours();
                    if (startHours<10) startHours=`0${startHours}`;
                    let endHours= (new Date(entry.endtime)).getHours();
                    if (endHours<10) endHours=`0${endHours}`;
                    let startMinutes= (new Date(entry.starttime)).getMinutes();
                    if (startMinutes<10) startMinutes=`0${startMinutes}`;
                    let endMinutes= (new Date(entry.endtime)).getMinutes();
                    if (endMinutes<10) endMinutes=`0${endMinutes}`;
                    entry.dateofwork=getDateWorked(entry.starttime);
                    entry.starttimeview=`${startHours}:${startMinutes}`;
                    entry.endtimeview=`${endHours}:${endMinutes}`;
                    entry.lunchtimeview=`${entry.lunchtime} minutes`;
                    entry.hoursworked= minutesToText(getMinutesWorked(entry.starttime, entry.endtime, entry.lunchtime));
                    entry.editable=entryEditable(entry.timesubmitted); // BREAKING
                });
                // sort by reverse date of work, please note that editable? depends on date timesheet is entered, not date of work
                entries.sort((a,b) => (a.starttime > b.starttime) ? 1 : ((b.starttime > a.starttime) ? -1 : 0));
                // update state
                setEntries(entries);
            } catch (e) {
                console.log(e.message)
                alert('There was a problem getting timesheet entries. Please check network connection.')
                setPage('Homepage');
            }
        }
        try {
            getEntries(user.email)
        } catch(e) {
            console.log(e.message);
        }      
    },[user, setPage]);
    
    return (
        <div style={{marginTop: '50px', marginBottom: '50px'}}>
        <Spinner />
        {/* <PageTitle maintitle='Timesheet Entry' subtitle={user.email&&`for ${user.firstname} ${user.lastname}`} /> */}
        <PageTitle maintitle='View Timesheets' subtitle= {`for ${user.firstname} ${user.lastname}. Entries may be edited within 24 hours of submission.`}/>
        <h4 style={{textAlign: 'center'}}>Today is {todayDate}</h4>
        {winWidth<950?
        <table className='table' style={{boxShadow: 'none'}}>
            {!found&&<h4 style={{textAlign: 'center'}}>No timesheets entries found.</h4>}
            <tbody>
            
            {Array.isArray(entries)?entries.map(entry=>
            <tr key={entry._id} className='row' style={{borderRadius: '7px', backgroundColor: 'rgba(2, 2, 2, 0.07)', marginBottom: '25px'}}>
                <td className='cell' style={{opacity: `${entry.editable?1:.4}`, display: `flex`, justifyContent: 'flex-end'}} >
                    <img src='img/editItemIcon.png' style={{height: '15px', margin: '5px'}} onClick={()=>{
                        if (entry.editable) { 
                            setPage('EditTimesheet'); 
                            setEditEntry({
                            entryId: entry._id,
                            dateofwork: entry.dateofwork,
                            starttime: entry.starttime,
                            starttimeview: entry.starttimeview,
                            endtime: entry.endtime,
                            endtimeview: entry.endtimeview,
                            lunchtime: entry.lunchtime,
                            lunchtimeview: entry.lunchtimeview,
                            jobname: `${entry.jobid} ${entry.jobname}`,
                            task: entry.task,
                            notes: entry.notes,
                            timesubmitted: entry.timesubmitted,
                    })} else {
                        alert('Please contact office to make changes.');
                    }
                    }} alt='edit button' />
                    <img src='img/deleteRedX.png' style={{height: '15px', margin: '5px'}} onClick={()=>entry.editable&&handleDelete(entry._id)} alt='delete button' />
                </td>
                <td className='cell'><span className='header'>Date Worked:&nbsp;</span>{entry.dateofwork}</td>
                <td className='cell'><span className='header'>Start Time:&nbsp;</span>{entry.starttimeview}</td>
                <td className='cell'><span className='header'>End Time:&nbsp;</span>{entry.endtimeview}</td>
                <td className='cell'><span className='header'>Lunch Time:&nbsp;</span>{entry.lunchtimeview}</td>
                <td className='cell'><span className='header'>Hours Worked:&nbsp;</span>{entry.hoursworked}</td>
                <td className='cell'><span className='header'>Job Worked:&nbsp;</span>{`${entry.jobid} `}{entry.jobname}</td>
                <td className='cell'><span className='header'>Task:&nbsp;</span>{entry.task}</td>
                <td className='cell'><div style={{maxHeight: '70px', width: '100%', overflowY: 'auto'}}><span className='header'>Notes:&nbsp;</span>{entry.notes}</div></td>
            </tr>):<p>No entries found.</p>}
            </tbody>
        </table>:''
        }
        {winWidth>=950&&
        <table className='table' style={{maxWidth: 'unset'}}>
            <tbody>
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
            {!found&&<h4>No timesheets entries found.</h4>}
            {Array.isArray(entries)?entries.map(entry=>
            <tr key={entry._id} className='row'>
                <td className='cell' style={{opacity: `${entry.editable?1:.2}`, display: 'flex', justifyContent: 'flex-end', minWidth: '259px'}} disable={entry.editable}>
                    <img src='img/editItemIcon.png' style={{height: '15px', margin: '5px'}} 
                    onClick={()=>{if (entry.editable) {setPage('EditTimesheet'); setEditEntry({
                        entryId: entry._id,
                        dateofwork: entry.dateofwork,
                        starttime: entry.starttime,
                        starttimeview: entry.starttimeview,
                        endtime: entry.endtime,
                        endtimeview: entry.endtimeview,
                        lunchtime: entry.lunchtime,
                        lunchtimeview: entry.lunchtimeview,
                        jobname: `${entry.jobid} ${entry.jobname}`,
                        task: entry.task,
                        notes: entry.notes,
                        timesubmitted: entry.timesubmitted
                    })} else {
                        alert('Please contact office to make changes.');
                    }}} 
                    alt='edit button' 
                    />
                    <img src='img/deleteRedX.png' style={{height: '15px', margin: '5px'}} onClick={()=>{
                        if (entry.editable) {
                            handleDelete(entry._id)
                        } else {
                            alert('Please contact office to make changes.')
                        }
                    }} alt='delete button'/>
                </td>
                <td className='cell'><span style={{whiteSpace: 'nowrap'}}>{entry.dateofwork}</span></td>
                <td className='cell'>{entry.starttimeview}</td>
                <td className='cell'>{entry.endtimeview}</td>
                <td className='cell'>{entry.lunchtimeview}</td>
                <td className='cell'>{entry.hoursworked}</td>
                <td className='cell'>{`${entry.jobid} `}{entry.jobname}</td>
                <td className='cell'>{entry.task}</td>
                <td className='cell'><div style={{maxHeight: '40px', maxWidth: '200px', overflowY: 'auto'}}>{entry.notes}</div></td>
            </tr>
            ):<tr>Loading...</tr>} 
            </tbody>
        </table>
        }
        <ViewTimesheetsCss />
        </div>
    )
}

export default ViewTimesheets;
