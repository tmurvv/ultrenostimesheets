// packages
import {useState, useEffect, useContext} from 'react';
import axios from 'axios';
// components
import PageTitle from '../components/PageTitle';
import Spinner from '../components/Spinner';
// contexts
import {UserContext} from '../contexts/UserContext';
import {AdminEditTimesheetsContext} from '../contexts/AdminEditTimesheetsContext';
import {PageContext} from '../contexts/PageContext';
import {EditEntryContext} from '../contexts/EditEntryContext';
// other
import {
    entryEditable, 
    getMinutesWorked, 
    minutesToDigital, 
    militaryToAMPM
} from '../utils/helpers';
import ViewTimesheetsCss from '../styles/ViewTimesheets.css';

function ViewTimesheets() {
    // const [winWidth, setWinWidth] = useState(2000);
    const [todayDate, setTodayDate] = useState(2000);
    const [entries, setEntries] = useState(2000);
    const [found, setFound] = useState(true);
    const {user} = useContext(UserContext);
    const {adminEditTimesheets} = useContext(AdminEditTimesheetsContext);
    const {setPage} = useContext(PageContext);
    const {setEditEntry} = useContext(EditEntryContext);
    const [mobile, setMobile] = useState();
    const handleResize = () => {
        // css media queries rounding is slightly different. Using <= and then >= instead of <= and > (without the=) eliminates the rounding issues
        window.innerWidth<=950&&setMobile(true);
        window.innerWidth>=951&&setMobile(false);
    }
    // set mobile environment
    useEffect(()=>handleResize());
    // reset window width on window resize
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => { window.removeEventListener('resize', handleResize) }
    }, []);
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
                    try {
                        entry.hoursworked=minutesToDigital(getMinutesWorked(entry.starttime, entry.endtime, entry.lunchtime)).toFixed(2);
                    } catch (e) {
                        // BREAKING need error email sent to web master indicating an issue on a timesheet
                        entry.hoursworked="unable to calculate";
                    }
                    entry.editable=entryEditable(entry, adminEditTimesheets);
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
    
    return (
        <div style={{marginTop: '50px', marginBottom: '50px'}}>
            <Spinner />
            <PageTitle maintitle='View Timesheets' subtitle= {`for ${user.firstname} ${user.lastname} - entries may be edited until office prepares payroll`}/>
            <h4 style={{textAlign: 'center'}}>Today is {todayDate}</h4>
            {/* mobile display */}
            {mobile?
            <table className='table' style={{boxShadow: 'none', display: 'block'}}>    
                <tbody>
                {!found&&<tr><td><p style={{width:'100%', textAlign: 'center'}}>No timesheets entries found.</p></td></tr>}    
                {Array.isArray(entries)?entries.map(entry=>
                <tr key={entry._id} className='row' style={{display: 'block', borderRadius: '7px', backgroundColor: 'rgba(2, 2, 2, 0.07)', marginBottom: '25px'}}>
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
                                jobname: (`${entry.jobid&&entry.jobid} ${entry.jobname&&entry.jobname}`).replace('undefined','').trim(),
                                task: entry.task,
                                notes: entry.notes,
                                timesubmitted: entry.timesubmitted,
                        })} else {
                            alert('Please contact office to make changes.');
                        }
                        }} alt='edit button' />
                        <img src='img/deleteRedX.png' style={{height: '15px', margin: '5px 10px'}} onClick={()=>entry.editable&&handleDelete(entry._id)} alt='delete button' />
                    </td>
                    <td className='cell' style={{display: 'flex'}}><span className='header'>Date of Work:&nbsp;</span><div style={{width: '165px', overflow: 'hidden'}}><input type='text' defaultValue={`${entry.starttime.substr(0,10)}`} style={{whiteSpace: 'nowrap', backgroundColor: 'transparent', border: 'none', fontFamily: 'Times New Roman, Helvetica, Arial', color: 'black', fontSize: '17px', WebkitTextFillColor: '#000', opacity: '1'}} disabled/></div></td>
                    <td className='cell' style={{display: 'flex'}}><span className='header'>Start Time:&nbsp;</span><div style={{width: '165px', overflow: 'hidden'}}><input type='text' defaultValue={militaryToAMPM((`${entry.starttime.substr(0,16)}`).substr(11))} style={{whiteSpace: 'nowrap', backgroundColor: 'transparent', border: 'none', fontFamily: 'Times New Roman, Helvetica, Arial', color: 'black', fontSize: '17px', WebkitTextFillColor: '#000', opacity: '1'}} disabled/></div></td>
                    <td className='cell' style={{display: 'flex'}}><span className='header'>End Time:&nbsp;</span><div style={{width: '165px', overflow: 'hidden'}}><input type='text' defaultValue={militaryToAMPM((`${entry.endtime.substr(0,16)}`).substr(11))} style={{whiteSpace: 'nowrap', backgroundColor: 'transparent', border: 'none', fontFamily: 'Times New Roman, Helvetica, Arial', color: 'black', fontSize: '17px', WebkitTextFillColor: '#000', opacity: '1'}} disabled/></div></td>
                    <td className='cell' style={{display: 'flex'}}><span className='header'>Lunch Time:&nbsp;</span>{entry.lunchtime} mins</td>
                    <td className='cell' style={{display: 'flex'}}><span className='header'>Hours Worked:&nbsp;</span>{entry.hoursworked}</td>
                    <td className='cell' style={{display: 'flex'}}><span className='header'>Job Worked:&nbsp;</span>{(`${entry.jobid&&entry.jobid} ${entry.jobname&&entry.jobname}`).replace('undefined','').trim()}</td>
                    <td className='cell' style={{display: 'flex'}}><span className='header'>Task:&nbsp;</span>{entry.task}</td>
                    <td className='cell' style={{display: 'flex'}}><div style={{maxHeight: '120px', width: '100%', overflowY: 'auto'}}><span className='header'>Notes:&nbsp;</span>{entry.notes}</div></td>
                </tr>):<tr><td>No entries found.</td></tr>}
                </tbody>
            </table>:''
            }         
            {/* non-mobile display */}
            {!mobile&&
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
                {!found&&<tr><td><h4>No timesheet entries found.</h4></td></tr>}
                {Array.isArray(entries)?entries.map(entry=>
                <tr key={entry._id} className='row'>
                    <td className='cell' style={{opacity: `${entry.editable?1:.2}`, display: 'flex', justifyContent: 'space-between', minWidth: '60px'}} disabled={entry.editable}>
                        <img src='img/editItemIcon.png' style={{height: '15px', margin: '5px'}} 
                        onClick={()=>{if (entry.editable) {setPage('EditTimesheet'); setEditEntry({
                            entryId: entry._id,
                            starttime: entry.starttime,
                            endtime: entry.endtime,
                            lunchtime: entry.lunchtime,
                            lunchtimeview: entry.lunchtimeview,
                            jobname: (`${entry.jobid&&entry.jobid} ${entry.jobname&&entry.jobname}`).replace('undefined','').trim(),
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
                    <td className='cell'><div style={{maxHeight: '40px', overflowY:'auto'}}>{(`${entry.jobid&&entry.jobid} ${entry.jobname&&entry.jobname}`).replace('undefined','').trim()}</div></td>
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
