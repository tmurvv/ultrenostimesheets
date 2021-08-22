import {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import uuid from 'react-uuid';

// internal
import LoginSignupCSS from '../styles/LoginSignup.css';
import DashboardCss from '../styles/Dashboard.css';
import PageTitle from './PageTitle';
import WhichAccount from './admin/WhichAccount';
import Spinner from '../components/Spinner';
import {UserContext} from '../contexts/UserContext';

function Dashboard({setPage}) {
    const [numSheets, setNumSheets] = useState(0);
    const [totSheets, setTotSheets] = useState(0);
    const [totUsers, setTotUsers] = useState(0);
    const [jobs, setJobs] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [dashboardPage, setDashboardPage] = useState('home');
    const {user} = useContext(UserContext);
    const [userLogin, setUserLogin] = useState({
        loginemail: '',
        loginpassword: '',
        loginchange: false,
        role: 'select privileges'
    });
    const handleChange = (evt) => {
        setUserLogin({...userLogin, [evt.target.name]: evt.target.value, loginchange: true});
    }
    const handleSubmitPrivileges = async (e) => {
        const updateObject = {
            email: document.querySelector('#updateroleemail').value, 
            role: userLogin.role,
            adminemail: user.email,
            password: userLogin.loginpassword
        };
        try {
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="flex";
            await axios.post(`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/users/updateuser`, updateObject)
            alert(`Privileges updated for user ${updateObject.email}.`);
            setUserLogin({
                loginemail: '',
                loginpassword: '',
                loginchange: false,
                role: 'select privileges'
            });
            if (document.querySelector('#selectuserrole')) document.querySelector('#selectuserrole').value='select privileges';
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
        } catch(e) {
            // log error
            console.log('error', e.message);
            // in-app message to user
            if (e.response&&e.response.data&&e.response.data.message&&e.response.data.message==="User not found.") {
                if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
                return setTimeout(()=>{alert('User email not found.')}, 200);
            } 
            if (e.response&&e.response.data&&e.response.data.message&&e.response.data.message==="Admin not found.") {
                if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
                return setTimeout(()=>{alert('Admin email not found.')}, 200);
            } 
            if (e.response&&e.response.data&&e.response.data.message&&e.response.data.message==="Admin password does not match our records.") {
                if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
                return setTimeout(()=>{alert('Admin password does not match our records.')},200);
            }
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
            setTimeout(()=>{alert('Update not successful. Please check network connection.')}, 200);
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
        }
    }
    const handleSubmitDelete = async (e) => {
        const validate= prompt(`Are you sure you want to delete user ${document.querySelector('#updateroleemail').value}? Please re-enter user email to delete.`);
        if (validate!==document.querySelector('#updateroleemail').value) return alert('Email does not matech.');
        const deleteObject = {
            email: document.querySelector('#updateroleemail').value, 
            role: userLogin.role,
            adminemail: user.email,
            password: userLogin.loginpassword
        };
        try {
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="flex";
            await axios.post(`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/users/deleteuser`, deleteObject)
            alert(`User ${deleteObject.email} deleted.`);
            setUserLogin({
                loginemail: '',
                loginpassword: '',
                loginchange: false,
                role: 'select privileges'
            });
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
        } catch(e) {
            // log error
            console.log('error', e.message)
            // in-app message to user
            if (e.response&&e.response.data&&e.response.data.message&&e.response.data.message==="User not found.") {
                if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
                return setTimeout(()=>{alert('User email not found.')}, 200);
            } 
            if (e.response&&e.response.data&&e.response.data.message&&e.response.data.message==="Admin not found.") {
                if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
                return setTimeout(()=>{alert('Admin email not found.')}, 200);
            } 
            if (e.response&&e.response.data&&e.response.data.message&&e.response.data.message==="Admin password does not match our records.") {
                if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
                return setTimeout(()=>{alert('Admin password does not match our records.')},200);
            }
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
            setTimeout(()=>{alert('Delete not successful. Please check network connection.')}, 200);
        }
    }
    // set environment
    useEffect(()=>{
        window&&window.scrollTo(0,0);
        if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
    },[]);
    useEffect(()=>{
        // get data
        const numSheets = async () => {
            const res = await axios.get(`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/admin/numtimesheets`);
            if (res.data.numsheets&&res.data.numsheets!==0) setNumSheets(res.data.numsheets);
            if (res.data.totsheets&&res.data.totsheets!==0) setTotSheets(res.data.totsheets);
            if (res.data.totusers&&res.data.totusers!==0) setTotUsers(res.data.totusers);
            const jobArray = [];
            Array.isArray(res.data.jobs)&&res.data.jobs.forEach(job => {if (job.current) jobArray.push(`${job.jobid} ${job.jobname}`)});
            setJobs(jobArray);
            const taskArray = [];
            Array.isArray(res.data.jobs)&&res.data.tasks.forEach(task => {if (task.current) taskArray.push(task.task)});
            setTasks(taskArray);
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
        }
        numSheets();
    },[totSheets]);
    return (
        <>  
            <Spinner />
            <div className='OuterContainer' style={{fontFamily: 'avenir, sans-serif', letterSpacing: '1.6px', lineSpacing: '1.5', width: '100%'}}>
                <div className='MenuContainer' style={{flex: '2', backgroundColor: '#004976', color: 'white'}}> 
                    <div className='MenuContainerImg' style={{width: '100%'}}>
                        <img src='img/ultimate_renovations-white_logo.png' alt='Ultimate Renovations logo' style={{width: '100%'}}/>
                    </div> 
                    <ul>
                        <li><button style={{fontSize: '16px', width: '100%', cursor: 'pointer'}} onClick={()=>setDashboardPage('home')}>Dashboard Home</button></li>
                        <li><button style={{fontSize: '16px', width: '100%', cursor: 'pointer'}} onClick={()=>setDashboardPage('download')}>Download Timesheets</button></li>
                        <li><button style={{fontSize: '16px', width: '100%', cursor: 'pointer'}} onClick={()=>setDashboardPage('upload')}>Upload Lists</button></li>
                        <li><button style={{fontSize: '16px', width: '100%', cursor: 'pointer'}} onClick={()=>setDashboardPage('timesheets')}>Change Timesheets</button></li>
                        <li><button style={{fontSize: '16px', width: '100%', cursor: 'pointer'}} onClick={()=>setDashboardPage('admin')}>Admin Privileges</button></li>
                        <li><button style={{fontSize: '16px', width: '100%', cursor: 'pointer'}} onClick={()=>setDashboardPage('manageusers')}>Delete User Account</button></li>
                    </ul>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', width: '100%', flex: '8', backgroundColor: 'white',}}>
                    <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                    {dashboardPage==='home'
                    &&<>
                        <div style={{marginTop: '70px'}}>
                            <PageTitle maintitle='Admin Dashboard' subtitle=''>Admin Dashboard</PageTitle>
                        </div>
                        <div style={{padding: '50px 0px 30px', display: 'flex',  justifyContent: 'space-evenly', width: '100%'}}>
                            <div style={{display: 'flex', flexDirection: 'column', flex: '3', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', width: '100px', borderRadius: '50%', backgroundImage: 'linear-gradient(340deg, #f9bf1e 50%, #fffbb5 58%, #ffe58a 74%, #f9bf1e 87%)'}}>
                                    <div style={{display: 'flex', backgroundColor: 'white', borderRadius: '50%', height: '70px', width: '70px', justifyContent: 'center', alignItems: 'center', color: 'black'}}>
                                        <div>{numSheets}</div>
                                    </div>
                                </div>
                                <div className='label' style={{maxWidth: '150px', marginTop: '7px'}}>
                                    New Timesheets
                                </div>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: '3'}}>
                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', width: '100px', borderRadius: '50%', backgroundImage: 'linear-gradient(210deg, #f9bf1e 50%, #fffbb5 58%, #ffe58a 74%, #f9bf1e 87%)'}}>
                                    <div style={{display: 'flex', backgroundColor: 'white', borderRadius: '50%', height: '70px', width: '70px', justifyContent: 'center', alignItems: 'center', color: 'black'}}>
                                        <div>{jobs.length}</div>
                                    </div>
                                </div>
                                <div className='label' style={{maxWidth: '150px', marginTop: '7px'}}>
                                    WIPs
                                </div>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: '3'}}>
                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', width: '100px', borderRadius: '50%', backgroundImage: 'linear-gradient(60deg, #f9bf1e 50%, #fffbb5 58%, #ffe58a 74%, #f9bf1e 87%)'}}>
                                    <div style={{display: 'flex', backgroundColor: 'white', borderRadius: '50%', height: '70px', width: '70px', justifyContent: 'center', alignItems: 'center', color: 'black'}}>
                                        <div>{totUsers}</div>
                                    </div>
                                </div>
                                <div className='label' style={{maxWidth: '150px', marginTop: '7px'}}>
                                    Users
                                </div>
                            </div>    
                        </div>
                        <div style={{margin: '50px auto', display: 'flex', justifyContent: 'center', width: '100%', backgroundColor: 'transparent'}}>
                            <img src="/img/tapered_line_blue.png" alt='tapered blue dividing line' style={{minWidth: '80%', height: '50px'}}/>
                        </div>
                        <h2 style={{textAlign: 'center', marginBottom: '50px'}}>Current Lists</h2>
                        <div className= 'lists' style={{backgroundColor: 'transparent', boxSizing: 'border-box', display: 'flex', width: '80%', margin: 'auto', flex: '8', justifyContent: 'space-evenly', textAlign: 'left'}}>
                            <ul style={{marginRight: '17px', flex: '1', boxSizing: 'border-box', textAlign: 'center'}}>
                                <li style={{padding: '10px 10px 7px', fontWeight: 'bold', backgroundColor: 'lightgrey', width: '100%'}}>Works in Progress</li>
                                {jobs&&jobs.map(job => <li style={{textAlign: 'left', borderBottom: '1px solid lightgrey', padding: '5px 10px', backgroundColor: 'white', width: '100%'}}>{job}</li>)}
                            </ul>
                            <ul style={{marginLeft: '17px', flex: '1', boxSizing: 'border-box', textAlign: 'center'}}>
                                <li style={{padding: '10px 10px 7px', fontWeight: 'bold', backgroundColor: 'lightgrey', width: '100%'}}>Tasks</li>
                                {tasks&&tasks.map(task => <li style={{textAlign: 'left', borderBottom: '1px solid lightgrey', padding: '5px 10px', backgroundColor: 'white', width: '100%'}}>{task}</li>)}
                            </ul>
                        </div>
                    </>
                    }
                    {dashboardPage&&dashboardPage==='download'&&
                        <div className='login-signup-container' style={{minHeight: 'unset', paddingBottom: '25px', marginTop: '70px'}}>
                        <PageTitle maintitle='Download Timesheets' />          
                        <div style={{display: 'flex',  justifyContent: 'space-evenly', width: '100%'}}>
                            <div style={{padding: '30px', display: 'flex', flexDirection: 'column', flex: '3', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', width: '100px', borderRadius: '50%', backgroundImage: 'linear-gradient(340deg, #f9bf1e 50%, #fffbb5 58%, #ffe58a 74%, #f9bf1e 87%)'}}>
                                    <div style={{display: 'flex', backgroundColor: 'white', borderRadius: '50%', height: '70px', width: '70px', justifyContent: 'center', alignItems: 'center', color: 'black'}}>
                                        <div>{numSheets}</div>
                                    </div>
                                </div>
                                <div className='label' style={{maxWidth: '150px', marginTop: '7px'}}>
                                    New Timesheets
                                </div>
                                <div style={{marginTop: '25px', width: '100%', display: 'flex', justifyContent: 'center'}}>
                                    <button type='button' className="submit-btn login-signup-title" style={{boxShadow: '3px 3px 3px lightgrey', width: '150px', margin: 'auto', backgroundColor: '#004976'}} onClick={()=>{if (!window.navigator.onLine) {window.alert('No network connection.')}}}>
                                        <a href={`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/admin/downloadnewtimesheets`} onClick={()=>setPage('admin')} style={{textDecoration: 'none', fontFamily: 'sans-serif', letterSpacing: '2px', fontSize: '14px', color: 'white'}}>Download</a>
                                    </button>
                                </div>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: '3'}}>
                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', width: '100px', borderRadius: '50%', backgroundImage: 'linear-gradient(210deg, #f9bf1e 50%, #fffbb5 58%, #ffe58a 74%, #f9bf1e 87%)'}}>
                                    <div style={{display: 'flex', backgroundColor: 'white', borderRadius: '50%', height: '70px', width: '70px', justifyContent: 'center', alignItems: 'center', color: 'black'}}>
                                        <div>{totSheets}</div>
                                    </div>
                                </div>
                                <div className='label' style={{maxWidth: '150px', marginTop: '7px'}}>
                                    All Timesheets
                                </div>
                                <div style={{width: '100%', marginTop: '25px', display: 'flex', justifyContent: 'center'}}>
                                    <button type='button' className="submit-btn login-signup-title" style={{boxShadow: '3px 3px 3px lightgrey', width: '150px', margin: 'auto', backgroundColor: '#004976'}} onClick={()=>{if (!window.navigator.onLine) {window.alert('No network connection.')}}}>
                                        <a href={`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/admin/downloadalltimesheets`} onClick={()=>setPage('Homepage')} style={{textDecoration: 'none', fontFamily: 'sans-serif', letterSpacing: '2px', fontSize: '14px', color: 'white'}}>Download</a>
                                    </button>
                                </div>
                            </div>  
                        </div>
                        
                    </div>
                    }
                    {dashboardPage&&dashboardPage==='upload'
                    &&
                    <>
                    <div className='login-signup-container'>
                        <PageTitle maintitle='Upload Works in Progress List' subtitle={`The listings uploaded here will replace all of the listings in the timesheet "job name" select box.`} />
                        <div className="form-container" style={{marginTop: '50px'}}>
                            <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                                <form action={`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/admin/uploadjoblist`} encType="multipart/form-data" method="post" style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                    <input type="file" name="file-to-upload" style={{margin: '0 0 30px 55px', textAlign: 'center'}} required/>
                                    <button type='Submit' onClick={(e)=>{if (window.navigator.onLine) {alert('This upload replaces all of the selections in the "job name" select box.')}else{e.preventDefault(); alert('No network connection.'); return false;}}} className="submit-btn login-signup-title" style={{boxShadow: '3px 3px 3px lightgrey', width: '150px', margin: 'auto'}}>
                                        Upload WIPs List
                                    </button>
                                </form>
                            </div>
                        </div>
                        <h3 style={{textAlign: 'center'}}>Sample</h3>
                        <p style={{textAlign: 'center'}}>Your file should look like this with as many rows as required:</p>
                        <div style={{display: 'flex', justifyContent:'center', width: '100%'}}>   
                            <img src="/img/joblistexample.png" alt="job list example file" style={{border: '1px solid lightgrey', padding: '15px', margin: 'auto', width: '80%', maxWidth: '400px'}}/>
                        </div>
                        
                        <LoginSignupCSS />
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                        <img src="/img/tapered_line_blue.png" alt='tapered blue dividing line' style={{minWidth: '80%', height: '50px'}}/>
                    </div>
                    <div className='login-signup-container'>
                        <PageTitle maintitle='Upload Tasks List' subtitle={`The tasks uploaded here will replace all of the tasks in the timesheet "task" select box.`} />
                        <div className="form-container" style={{marginTop: '50px'}}>
                            <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                                <form action={`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/admin/uploadtasklist`} encType="multipart/form-data" method="post" style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                    <input type="file" name="file-to-upload" style={{margin: '0 0 30px 55px', textAlign: 'center'}} required/>
                                    <button type='Submit' onClick={(e)=>{if (window.navigator.onLine) {alert('This upload replaces all of the selections in the "specific task" select box.')}else{e.preventDefault(); alert('No network connection.'); return false;}}} className="submit-btn login-signup-title" style={{boxShadow: '3px 3px 3px lightgrey', width: '150px', margin: 'auto'}}>
                                        Upload Task List
                                    </button>
                                </form>
                            </div>
                        </div>
                        <h3 style={{textAlign: 'center'}}>Sample</h3>
                        <p style={{textAlign: 'center'}}>Your file should look like this with as many rows as required:</p>
                        <div style={{display: 'flex', justifyContent:'center', width: '100%'}}>   
                            <img src="/img/tasklistexample.png" alt="job list example file" style={{border: '1px solid lightgrey', padding: '15px', margin: 'auto', width: '80%', maxWidth: '400px'}}/>
                        </div>
                        <LoginSignupCSS />
                    </div>
                    </>
                    }
                    {dashboardPage&&dashboardPage==='timesheets'
                    &&
                    <>
                        <WhichAccount title='Change User Timesheets' subtitle="Logs you into the user's account with permissions to make changes" accountHeading="Email on Timesheet" setPage={setPage}/>
                    </>         
                    }
                    {dashboardPage&&dashboardPage==='manageusers'
                    &&
                    <>
                        <div className='login-signup-container'>
                            <div className="form-container" style={{marginTop: '0px'}}>
                                <PageTitle maintitle='Delete User Account' />
                                <form>
                                    <div style={{display: 'flex', flexDirection: 'column', padding: '25px', maxWidth: '250px', margin: 'auto'}}>   
                                        <div>
                                            <h4>Which User Account?</h4>
                                        </div>
                                        <input
                                            style={{padding: '5px 7px', backgroundColor: 'rgb(232, 240, 254)'}}
                                            className="field-input"
                                            type='email'
                                            id='updateroleemail'
                                            value={userLogin.loginemail}
                                            onChange={handleChange}
                                            placeholder='Enter email'
                                            name='loginemail'
                                            required
                                        />
                                        <h4>Please Re-enter <i>your</i> Admin Password</h4>
                                        <input
                                            style={{padding: '5px 7px', backgroundColor: 'rgb(232, 240, 254)'}}
                                            className="field-input"
                                            type='password'
                                            id={uuid()}
                                            value={userLogin.loginpassword}
                                            onChange={handleChange}
                                            name='loginpassword'
                                            required
                                        />
                                        <div style={{display: 'flex', width: '100%', justifyContent: 'center', marginTop: '50px'}}>
                                            <button type='button' className="btn submit-btn login-signup-title" style={{textAlign: 'center', backgroundColor: 'tomato', color: 'white'}} onClick={()=>{handleSubmitDelete()}}>Delete Account</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <LoginSignupCSS />
                    </>         
                    }
                    {dashboardPage&&dashboardPage==='admin'
                    &&
                    <>
                        {/* <WhichAccount title='Admin Privileges' accountHeading="Email of admin account to change" setDashboardPage={setDashboardPage}/> */}
                        <div className='login-signup-container'>
                            <div className="form-container" style={{marginTop: '0px'}}>
                                <PageTitle maintitle='Change Admin Privileges' />
                                <form>
                                    <div style={{display: 'flex', flexDirection: 'column', padding: '25px', maxWidth: '250px', margin: 'auto'}}>   
                                        <div>
                                            <h4>Whose privileges are being changed?</h4>
                                        </div>
                                        <input
                                            style={{padding: '5px 7px', backgroundColor: 'rgb(232, 240, 254)'}}
                                            className="field-input"
                                            type='email'
                                            id='updateroleemail'
                                            value={userLogin.loginemail}
                                            onChange={handleChange}
                                            placeholder='Enter email'
                                            name='loginemail'
                                            required
                                        />
                                        <select style={{marginTop: '20px', padding: '5px 7px'}}id='selectuserrole' onChange={(e)=>handleChange(e)} name='role'>
                                            <option value='select privileges'>Select Privileges</option>
                                            <option value='user'>User</option>
                                            <option value='admin'>Admin</option>
                                        </select>
                                        <h4>Please Re-enter <i>your</i> Admin Password</h4>
                                        <input
                                            style={{padding: '5px 7px', backgroundColor: 'rgb(232, 240, 254)'}}
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
                                        <button type='button' className="btn submit-btn login-signup-title" onClick={handleSubmitPrivileges} style={{width: '150px', margin: 'auto'}}>
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <LoginSignupCSS />
                    </>         
                    }
                    </div>
                </div>
                <DashboardCss />
            </div>
        </>
    )
}

export default Dashboard;
