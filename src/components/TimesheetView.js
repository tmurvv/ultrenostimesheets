import {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import uuid from 'react-uuid';
import PageTitle from '../components/PageTitle';
import Spinner from '../components/Spinner'
import {UserContext} from '../contexts/UserContext';
import {PageContext} from '../contexts/PageContext';
import {EditEntryContext} from '../contexts/EditEntryContext';

import {entryEditable} from '../utils/helpers';
import TimesheetViewCss from '../styles/TimesheetView.css';

function TimesheetView({ maintitle, subtitle }) {
    const [winWidth, setWinWidth] = useState(2000);
    const [todayDate, setTodayDate] = useState(2000);
    const [entries, setEntries] = useState(2000);
    const {user} = useContext(UserContext);
    const {page, setPage} = useContext(PageContext);
    const {editEntry, setEditEntry} = useContext(EditEntryContext);
    
    async function handleDelete(delId) {
        if (!window.confirm(`Delete this timesheet entry?`)) return;
        if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="flex";
        console.log(delId);
        try {
            // shortcut entryId
            if (!delId) throw new Error('Entry Id not found. Entry not updated');
            // Submit Entry
            // const res = await axios.post('http://localhost:3000/api/v1/ultrenostimesheets/deletetimesheet', {delId});
            const res = await axios.post('https://take2tech.herokuapp.com/api/v1/ultrenostimesheets/deletetimesheet', {delId});
            console.log('res.status', res.status);
            setPage('TimesheetView');
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
            setTimeout(()=>{alert(`Your timesheet entry has been deleted.`)},200);
        } catch(e) {
            console.error(e.message);
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none"; 
            setTimeout(()=>{alert(`Something went wrong, please try again.`)},200);
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
            // get entries
            const entriesArrays = await axios.get(`https://take2tech.herokuapp.com/api/v1/ultrenostimesheets/`);
            // const entriesArrays = await axios.get(`http://localhost:3000/api/v1/ultrenostimesheets/`);
            console.log('entryArrays:', entriesArrays)
            // split up array of entry arrays into entries
            let incomingEntries = [];
            Array.from(entriesArrays.data.data).map((entryArray, idx)=>idx>0&&incomingEntries.push(entryArray))
            // add zeros to single digit hour times
            let entriesFilter = incomingEntries.filter(entry=>entry[0]===user.email);
            entriesFilter.map(entry=>{
                if (entry[3].split(':')[0].length===1) entry[3]=`0${entry[3]}`;
                if (entry[4].split(':')[0].length===1) entry[4]=`0${entry[4]}`;
            });
            // sort by reverse date of work, please note that editable? depends on date timesheet is entered, not date of work
            entriesFilter.sort((a,b) => (
                new Date(a[2].replaceAll('/','-').replace('T',',')) < new Date(b[2].replaceAll('/','-').replace('T',','))) 
                ? 1 : ((new Date(b[2].replaceAll('/','-').replace('T',',')) < new Date(a[2].replaceAll('/','-').replace('T',','))) ? -1 : 0));
            // update state
            setEntries(entriesFilter);
        }
        try {
            getEntries(user.email)
        } catch(e) {
            console.log(e.message)
        }      
    },[user]);
    return (
        <div style={{marginTop: '50px', marginBottom: '50px'}}>
        <Spinner />
        {/* <PageTitle maintitle='Timesheet Entry' subtitle={user.email&&`for ${user.firstname} ${user.lastname}`} /> */}
        <PageTitle maintitle='View Timesheets' subtitle= {`for ${user.firstname} ${user.lastname}. Entries may be edited within 24 hours of submission.`}/>
        <h4 style={{textAlign: 'center'}}>Today is {todayDate}</h4>
        {winWidth<950?
        <table className='table' style={{boxShadow: 'none'}}>
            <tbody>
            {Array.isArray(entries)?entries.map(entry=>
            <tr key={entry[12]} className='row' style={{borderRadius: '7px', backgroundColor: 'rgba(2, 2, 2, 0.07)', marginBottom: '25px'}}>
                {/* <td className='cell' style={{display: `{${checkEntryEditable(entry[11])}:'flex':;none'}`, justifyContent: 'flex-end'}}> */}
                <td className='cell' style={{opacity: `${entryEditable(entry[11])?1:.4}`, display: `flex`, justifyContent: 'flex-end'}} >
                    <img src='img/editItemIcon.png' style={{height: '15px', margin: '5px'}} onClick={()=>{
                        if (entryEditable(entry[11])) {    
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
                            timesubmitted: entry[11],
                    })} else {
                        alert('Please contact office to make changes.');
                    }
                    }} alt='edit button' />
                    <img src='img/deleteRedX.png' style={{height: '15px', margin: '5px'}} onClick={()=>entryEditable(entry[11])&&handleDelete(entry[12])} alt='delete button' />
                </td>
                {/* <td className='cell' style={{display: `${!entryEditable(entry[11])?'flex':'none'}`, justifyContent: 'flex-end', fontSize: '14px', opacity: '.8', fontStyle: 'italic'}} >
                    contact office to change
                </td> */}
                <td className='cell'><span className='header'>Date Worked:&nbsp;</span>{entry[2]}</td>
                <td className='cell'><span className='header'>Start Time:&nbsp;</span>{entry[3]}</td>
                <td className='cell'><span className='header'>End Time:&nbsp;</span>{entry[4]}</td>
                <td className='cell'><span className='header'>Lunch Time:&nbsp;</span>{entry[5]}</td>
                <td className='cell'><span className='header'>Hours Worked:&nbsp;</span>{entry[6]}</td>
                <td className='cell'><span className='header'>Job Worked:&nbsp;</span>{entry[7]}&nbsp;&nbsp;{entry[8]}</td>
                <td className='cell'><span className='header'>Task:&nbsp;</span>{entry[9]}</td>
                <td className='cell'><div style={{maxHeight: '50px', overflowY: 'auto'}}><span className='header'>Notes:&nbsp;</span>{entry[10]}</div></td>
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
            {Array.isArray(entries)?entries.map(entry=>
            <tr key={entry[12]} className='row'>
                <td className='cell' style={{opacity: `${entryEditable(entry[11])?1:.2}`, display: 'flex', justifyContent: 'flex-end'}} disable={!entryEditable(entry[11])}>
                    <img src='img/editItemIcon.png' style={{height: '15px', margin: '5px'}} onClick={()=>{if (entryEditable(entry[11])) {setPage('EditTimesheet'); setEditEntry({
                        entryId: entry[12],
                        dateofwork: entry[2],
                        starttime: entry[3],
                        endtime: entry[4],
                        lunchtime: entry[5],
                        jobname: `${entry[7]} ${entry[8]}`,
                        task: entry[9],
                        notes: entry[10],
                        timesubmitted: entry[11]
                    })} else {
                        alert('Please contact office to make changes.');
                    }}} alt='edit button' />
                    <img src='img/deleteRedX.png' style={{height: '15px', margin: '5px'}} onClick={()=>{
                        if (entryEditable(entry[11])) {
                            handleDelete(entry[12])
                        } else {
                            alert('Please contact office to make changes.')
                        }
                    }} alt='delete button'/>
                </td>
                
                <td className='cell'><span style={{whiteSpace: 'nowrap'}}>{entry[2]}</span></td>
                <td className='cell'>{entry[3]}</td>
                <td className='cell'>{entry[4]}</td>
                <td className='cell'>{entry[5]}</td>
                <td className='cell'>{entry[6]}</td>
                <td className='cell'>{entry[7]}  {entry[8]}</td>
                <td className='cell'>{entry[9]}</td>
                <td className='cell'><div style={{maxHeight: '40px', maxWidth: '200px', overflowY: 'auto'}}>{entry[10]}</div></td>
            </tr>
            ):<tr>Loading...</tr>} 
            </tbody>
        </table>
        }
        <TimesheetViewCss />
        </div>
    )
}

export default TimesheetView;
