import {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import PageTitle from '../components/PageTitle';
import Spinner from '../components/Spinner'
import {UserContext} from '../contexts/UserContext';
import {AdminEditTimesheetsContext} from '../contexts/AdminEditTimesheetsContext';
import {PageContext} from '../contexts/PageContext';
import {EditEntryContext} from '../contexts/EditEntryContext';
import {militaryToAMPM} from '../utils/helpers';
import {entryEditable, getMinutesWorked, minutesToDigital} from '../utils/helpers';
import ViewTimesheetsCss from '../styles/ViewTimesheets.css';

function ViewTimesheets() {
    const [winWidth, setWinWidth] = useState(2000);
    const [todayDate, setTodayDate] = useState(2000);
    const [entries, setEntries] = useState(2000);
    const {user} = useContext(UserContext);
    const {adminEditTimesheets} = useContext(AdminEditTimesheetsContext);
    const {setPage} = useContext(PageContext);
    const {setEditEntry} = useContext(EditEntryContext);
    const [found, setFound] = useState(true);
      
    async function handleDelete(delId) {
        // in-app confirm message
        if (!window.confirm(`Delete this timesheet entry?`)) return;
        // start spinner
        if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="flex";
        try {
            // validation
            if (!delId) throw new Error('Entry Id not found. Entry not updated');
            // Submit Entry
            await axios.post(`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/deletetimesheet`, {delid: delId});
            // set environment
            setPage('RefreshView');
            // stop spinner
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
            // in-app message
            setTimeout(()=>{alert(`Your timesheet entry has been deleted.`)},200);
        } catch(e) {
            // log error
            console.log(e.message);
            // stop spinner
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none"; 
            // in-app message
            setTimeout(()=>{alert(`Something went wrong, please check network connection.`)},200);
        }
        // stop spinner TODO check if necessary
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
        // validation
        if (!user) return;
        async function getEntries() {
            try {
                // get entries
                const res = await axios.post(`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/viewtimesheetsbyuser`, {userid: user.email});
                if (res.data.num_returned===0) setFound(false);
                let entries = res.data.data;
                entries.forEach(entry=>{
                    // adjust entry fields for display object requirements
                    entry.starttime=`${entry.starttime}`;
                    entry.endtime=`${entry.endtime}`;
                    entry.lunchtimeview=`${entry.lunchtime} minutes`;
                    entry.hoursworked=minutesToDigital(getMinutesWorked(entry.starttime, entry.endtime, entry.lunchtime)).toFixed(2);
                    entry.editable=entryEditable(entry, adminEditTimesheets); // BREAKING
                });
                // sort by reverse date of work, please note that editable? depends on date timesheet is entered, not date of work
                entries.sort((a,b) => (a.starttime > b.starttime) ? -1 : ((b.starttime > a.starttime) ? 1 : 0));
                // update state
                setEntries(entries);
            } catch (e) {
                // log error
                console.log(e.message);
                // in-app message
                alert('There was a problem getting timesheet entries. Please check network connection.')
                // reset environment
                setPage('Homepage');
            }
        }
        try {
            getEntries(user.email)
        } catch(e) {
            // log error
            console.log(e.message);
        }      
    },[user, setPage, adminEditTimesheets]);
    // reset window width on window resize
    useEffect(() => {
        setWinWidth(window.innerWidth);
        const handleResize = () => {
            setWinWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);
        return () => { window.removeEventListener('resize', handleResize) }
    }, []);
    return (
        <div style={{marginTop: '50px', marginBottom: '50px'}}>
            <Spinner />
            <PageTitle maintitle='View Timesheets' subtitle= {`for ${user.firstname} ${user.lastname}. Usually entries may be edited within 24 hours of submission.`}/>
            <h4 style={{textAlign: 'center'}}>Today is {todayDate}</h4>
            
            {/* mobile display */}
            {winWidth<950?
            <table className='table' style={{boxShadow: 'none'}}>
                {!found&&<h4 style={{textAlign: 'center'}}>No timesheets entries found.</h4>}
                <tbody>               
                {Array.isArray(entries)?entries.map(entry=>
                <tr key={entry._id} className='row' style={{borderRadius: '7px', backgroundColor: 'rgba(2, 2, 2, 0.07)', marginBottom: '25px'}}>
                    <td className='cell' style={{opacity: `${entry.editable?1:.4}`, display: `flex`, justifyContent: 'flex-end'}} >
                        <img src='img/editItemIcon.png' style={{height: '15px', margin: '5px 10px'}} onClick={()=>{
                            if (entry.editable) { 
                                setPage('EditTimesheet'); 
                                setEditEntry({
                                entryId: entry._id,
                                starttime: entry.starttime,
                                endtime: entry.endtime,
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
                        <img src='img/deleteRedX.png' style={{height: '15px', margin: '5px 10px'}} onClick={()=>entry.editable&&handleDelete(entry._id)} alt='delete button' />
                    </td>
                    <td className='cell'><span className='header'>Date of Work:&nbsp;</span><div style={{width: '165px', overflow: 'hidden'}}><input type='text' defaultValue={`${entry.starttime.substr(0,10)}`} style={{whiteSpace: 'nowrap', backgroundColor: 'transparent', border: 'none', fontFamily: 'Times New Roman, Helvetica, Arial', color: 'black', fontSize: '17px', WebkitTextFillColor: '#000', opacity: '1'}} disabled/></div></td>
                    <td className='cell'><span className='header'>Start Time:&nbsp;</span><div style={{width: '165px', overflow: 'hidden'}}><input type='text' defaultValue={militaryToAMPM((`${entry.starttime.substr(0,16)}`).substr(11))} style={{whiteSpace: 'nowrap', backgroundColor: 'transparent', border: 'none', fontFamily: 'Times New Roman, Helvetica, Arial', color: 'black', fontSize: '17px', WebkitTextFillColor: '#000', opacity: '1'}} disabled/></div></td>
                    <td className='cell'><span className='header'>End Time:&nbsp;</span><div style={{width: '165px', overflow: 'hidden'}}><input type='text' defaultValue={militaryToAMPM((`${entry.endtime.substr(0,16)}`).substr(11))} style={{whiteSpace: 'nowrap', backgroundColor: 'transparent', border: 'none', fontFamily: 'Times New Roman, Helvetica, Arial', color: 'black', fontSize: '17px', WebkitTextFillColor: '#000', opacity: '1'}} disabled/></div></td>
                    <td className='cell'><span className='header'>Lunch Time:&nbsp;</span>{entry.lunchtime} mins</td>
                    <td className='cell'><span className='header'>Hours Worked:&nbsp;</span>{entry.hoursworked}</td>
                    <td className='cell'><span className='header'>Job Worked:&nbsp;</span>{`${entry.jobid} `}{entry.jobname}</td>
                    <td className='cell'><span className='header'>Task:&nbsp;</span>{entry.task}</td>
                    <td className='cell'><div style={{maxHeight: '70px', width: '100%', overflowY: 'auto'}}><span className='header'>Notes:&nbsp;</span>{entry.notes}</div></td>
                </tr>):<p>No entries found.</p>}
                </tbody>
            </table>:''
            }
            
            {/* non-mobile display */}
            {winWidth>=950&&
            <table className='table' style={{maxWidth: 'unset'}}>
                <tbody>
                <tr className='row'>
                    <th className='header'></th>
                    <th className='header'>Date of Work</th>
                    <th className='header'>Start Time</th>
                    <th className='header'>End Time</th>
                    <th className='header'>Lunch Time</th>
                    <th className='header'>Hours Worked</th>
                    <th className='header'>Job Worked</th>
                    <th className='header'>Task</th>
                    <th className='header'>Notes</th>
                </tr>
                {!found&&<h4>No timesheet entries found.</h4>}
                {Array.isArray(entries)?entries.map(entry=>
                <tr key={entry._id} className='row'>
                    <td className='cell' style={{opacity: `${entry.editable?1:.2}`, display: 'flex', justifyContent: 'space-between', minWidth: '60px'}} disable={entry.editable}>
                        <img src='img/editItemIcon.png' style={{height: '15px', margin: '5px'}} 
                        onClick={()=>{if (entry.editable) {setPage('EditTimesheet'); setEditEntry({
                            entryId: entry._id,
                            starttime: entry.starttime,
                            endtime: entry.endtime,
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
                    
                    <td className='cell'><div style={{width: '90px', overflow: 'hidden'}}><input type='text' defaultValue={`${entry.starttime.substr(0,10)}`} style={{whiteSpace: 'nowrap', backgroundColor: 'transparent', border: 'none', fontFamily: 'Times New Roman, Helvetica, Arial', color: 'black', fontSize: '17px', WebkitTextFillColor: '#000', opacity: '1'}} disabled/></div></td>
                    <td className='cell'><div style={{width: '75px', overflow: 'hidden'}}><input type='text' defaultValue={militaryToAMPM((`${entry.starttime.substr(0,16)}`).substr(11))} style={{whiteSpace: 'nowrap', backgroundColor: 'transparent', border: 'none', fontFamily: 'Times New Roman, Helvetica, Arial', color: 'black', fontSize: '17px', WebkitTextFillColor: '#000', opacity: '1'}} disabled/></div></td>
                    <td className='cell'><div style={{width: '75px', overflow: 'hidden'}}><input type='text' defaultValue={militaryToAMPM((`${entry.endtime.substr(0,16)}`).substr(11))} style={{whiteSpace: 'nowrap', backgroundColor: 'transparent', border: 'none', fontFamily: 'Times New Roman, Helvetica, Arial', color: 'black', fontSize: '17px', WebkitTextFillColor: '#000', opacity: '1'}} disabled/></div></td>
                    <td className='cell'>{entry.lunchtime} mins</td>
                    <td className='cell'><div style={{minWidth: '30px', maxHeight: '40px', overflowY:'auto', textAlign: 'center'}}>{entry.hoursworked}</div></td>
                    <td className='cell'><div style={{maxHeight: '40px', overflowY:'auto'}}>{`${entry.jobid} `}{entry.jobname}</div></td>
                    <td className='cell'><div style={{maxHeight: '40px', overflowY:'auto'}}>{entry.task}</div></td>
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
