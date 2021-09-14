// packages
import {useContext, useEffect, useState} from 'react';
import {BrowserRouter as Router, Link} from "react-router-dom";
//internal
import {PageContext} from '../contexts/PageContext.js';
import {UserContext} from '../contexts/UserContext.js';
import {AdminEditTimesheetsContext} from '../contexts/AdminEditTimesheetsContext.js';
import {USER_INIT} from '../constants/inits';
import NavBarCss from '../styles/NavBar.css.js'

export default function NavBar() {
    const {setPage} = useContext(PageContext);
    const {user, setUser} = useContext(UserContext);
    const {setAdminEditTimesheets} = useContext(AdminEditTimesheetsContext);
    const [mobile, setMobile] = useState();
    const [open, setOpen] = useState(false);
    const handleResize = () => {
        // css media queries rounding is slightly different. 
        //Using <= and then >= instead of <= and > (without the=) eliminates the rounding issues
        window.innerWidth<=550&&setMobile(true);
        window.innerWidth>=551&&setMobile(false);
        window.innerWidth>=551&&setOpen(true);
    }
    // set mobile environment
    useEffect(()=>handleResize());
    // reset window width on window resize
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => { window.removeEventListener('resize', handleResize) }
    }, []);
    return(
        <>
        <div className='navBarOuter'>
             {/* show mobile menu icon */}
            {mobile&&!open?
                <div className='hamburgerMenu' onClick={(e) => setOpen(true)}>
                    <img id='hamburger' src='/img/hamburger.png' alt="open mobile menu icon"/>
                </div>:''
            }
            {/* if not mobile or if mobile menu open. show the menu */}
            {(!mobile||open)&&
                <>
                <Router>
                <nav style={{height: '100%'}}>
                    <ul className='navLinks'>
                        <div className='closeIcon' style={{opacity: `${open&&mobile?.6:0}`, display: `${open&&mobile?'flex':'none'}`}} onClick={(e)=>setOpen(false)}>
                            <img src='/img/close.png' alt="close mobile menu icon" style={{height: '15px'}}/>
                        </div>
                        {user.email&&
                            <li style={{fontSize: '16px'}}>
                                {user.email?<Link to="/" onClick={()=>setPage('Homepage')}>Welcome {user.firstname}</Link>:<Link to="/" onClick={()=>{setOpen(false);setPage('Login')}}>Login</Link>}
                            </li>
                        }
                        {user&&user.role&&user.role.toUpperCase()==='ADMIN'&&
                            <li>
                                <Link to="/" onClick={()=>{setOpen(false);setPage('Dashboard');}}>Admin</Link>
                            </li>
                        }
                        <li>
                            <Link to="/" onClick={()=>{if (user.email){setOpen(false);setPage('EnterTimesheet');}else{alert('Please Login to enter Timesheets.');setPage('login');setOpen(false)}}}>Enter Timesheet</Link>
                        </li>
                        <li>
                            <Link to="/" onClick={()=>{if (user.email){setOpen(false);setPage('ViewTimesheets');}else{alert('Please Login to view Timesheets.');setPage('login');setOpen(false)}}}>View Timesheets</Link>
                        </li>
                        {!user.email&&
                            <li style={{fontSize: '16px'}}>
                                <Link to="/" onClick={()=>{setOpen(false);setPage('Login')}}>Login</Link>
                            </li>                      
                        }
                        {user.email&&
                        <li>
                            <Link to="/" onClick={()=>{setPage('profile'); setOpen(false);}}>Profile</Link>
                        </li>
                        }
                        <li>
                            {user.email?<Link to="/" onClick={()=>{setUser(USER_INIT); setAdminEditTimesheets(false);setPage('login'); setOpen(false);}}>Logout</Link>:<Link to="/" onClick={()=>{setOpen(false);setPage('signup')}}>Signup</Link>}
                        </li>
                    </ul>
                </nav>
            </Router>
        </>}
        </div>
        <NavBarCss />    
        </>
    )
}
