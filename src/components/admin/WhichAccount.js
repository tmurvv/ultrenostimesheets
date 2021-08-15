import {useState, useEffect, useContext, useLayoutEffect} from 'react';
import axios from 'axios';
import uuid from 'react-uuid';

// internal
import LoginSignupCSS from '../../styles/LoginSignup.css';
import PageTitle from '../PageTitle';
import Spinner from '../Spinner';
import {UserContext} from '../../contexts/UserContext';
import {AdminEditTimesheetsContext} from '../../contexts/AdminEditTimesheetsContext';
function WhichAccount({ title, subtitle, accountHeading, setPage}) {
    const [winWidth, setWinWidth] = useState(2000);
    const { setUser } = useContext(UserContext);
    const { setAdminEditTimesheets } = useContext(AdminEditTimesheetsContext);
    const [userLogin, setUserLogin] = useState({
        loginemail: '',
        loginpassword: '',
        loginchange: false
    });
    const handleChange = (evt) => {
        setUserLogin({...userLogin, [evt.target.name]: evt.target.value, loginchange: true});
    }
    const handleSubmit = async (evt) => {
        // show spinner
        if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="flex";         
        try {
            // login user
            const res = await axios.post(`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/users/login`, {email: userLogin.loginemail, password: userLogin.loginpassword});  
            const returnedUser = res.data.data;
            // const jwt = res.data.token; // TODO
            // set user context to login user
            setUser({
                firstname: returnedUser.firstname, 
                lastname: returnedUser.lastname, 
                email: returnedUser.email
            });
            // remove spinner
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
            // reset environment
            setPage('Homepage');
            setAdminEditTimesheets(true);
        } catch(e) {
            // log error
            console.log('error', e.message)
            // in-app message to user
            if (e.response&&e.response.data&&e.response.data.message&&e.response.data.message==="User not found.") {
                if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
                return setTimeout(()=>{alert('Email not found.')}, 200);
            } 
            if (e.response&&e.response.data&&e.response.data.message&&e.response.data.message==="Password does not match our records.") {
                if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
                return setTimeout(()=>{alert('Password does not match our records.')},200);
            }
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
            setTimeout(()=>{alert('Login not successful. Please check network connection.')}, 200);
        }
    }    // set environment
    useEffect(()=>{
        window&&window.scrollTo(0,0);
        if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
    },[]);
    // useEffect(()=>{
    //     // get data
    //     const numSheets = async () => {
    //         // const res = await axios.get(`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/admin/numtimesheets`);
    //         // if (res.data.numsheets&&res.data.numsheets!==0) setNumSheets(res.data.numsheets);
    //         // if (res.data.totsheets&&res.data.totsheets!==0) setTotSheets(res.data.totsheets);
    //         // if (res.data.totusers&&res.data.totusers!==0) setTotUsers(res.data.totusers);
    //         // const jobArray = [];
    //         // res.data.jobs.forEach(job => {if (job.current) jobArray.push(`${job.jobid} ${job.jobname}`)});
    //         // setJobs(jobArray);
    //         // const taskArray = [];
    //         // res.data.tasks.forEach(task => {if (task.current) taskArray.push(task.task)});
    //         // setTasks(taskArray);
    //         // if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
    //     }
    //     // numSheets();
    // },[totSheets]);
    useEffect(()=>{setWinWidth(window.innerWidth)},[]);

    return (
        <>
       <div className='login-signup-container'>
            <PageTitle maintitle={title} subtitle={subtitle} />
            <div className="form-container" style={{marginTop: '0'}}>
                <form>
                    <div style={{padding: '25px'}}>   
                        <div className="input-name" id='loginEmail'>
                            <h3>{accountHeading}</h3>
                        </div>
                        <input
                            className="field-input"
                            type='email'
                            id={uuid()}
                            value={userLogin.loginemail}
                            onChange={handleChange}
                            name='loginemail'
                            required
                        />
                        <div className="input-name input-margin">
                            <h3>Please Re-enter <i>your</i> Admin Password</h3>
                        </div>
                        <input 
                            className="field-input"
                            type='password'
                            id={uuid()}
                            value={userLogin.loginpassword}
                            onChange={handleChange}
                            name='loginpassword'
                            required
                        />
                    </div>
                    <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                        <button type='button' className="submit-btn login-signup-title" onClick={handleSubmit} style={{width: '150px', margin: 'auto'}}>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
            <LoginSignupCSS />
        </div>
        </>
    )
}

export default WhichAccount;
