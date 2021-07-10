import React, { useContext, useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { PageContext } from '../contexts/PageContext.js';
import { UserContext } from '../contexts/UserContext.js';
import {USER_INIT} from '../constants/inits';

//internal
import NavBarCss from '../styles/NavBar.css.js';
// import { UserContext } from '../../contexts/UserContext';

// function handleSubMenuClick() {
//     const subMenu= document.querySelector('#partnerSubMenu');
//     if (subMenu) {
//         subMenu.style.display=subMenu.style.display==='flex'?'none':'flex';
//     }
// }
export default function NavBar(props) {
    const { page, setPage } = useContext(PageContext);
    const { user, setUser } = useContext(UserContext);
    const [mobile, setMobile] = useState();
    const [open, setOpen] = useState(false);
    // const { user, setUser } = useContext(UserContext);
    // useEffect(()=> {
    //     if (!user.firstname) setUser({
    //         ...user,
    //         firstname: 'login',
    //         lastname: '',
    //         email: '',
    //         newsletter: false,
    //         distanceunit: 'miles',
    //         currency: 'USD',
    //         _id: '',
    //         role: 'not set'
    //     });
    // },[]);
    useEffect(()=>window.innerWidth<550&&setMobile(true),[]);
    // reset window width on window resize
    useEffect(() => {
        const handleResize = () => {
            window.innerWidth<550&&setMobile(true);
            window.innerWidth<550&&setOpen(false);
            window.innerWidth>=550&&setMobile(false);
            window.innerWidth>=550&&setOpen(true);
        }
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
            {(!mobile||open)&&
                <>
                <Router>
                <nav style={{height: '100%'}}>
                    <ul className='navLinks'>
                        <div className='closeIcon' style={{opacity: `${open&&mobile?.6:0}`}} onClick={(e)=>setOpen(false)}>
                            <img src='/img/close.png' alt="close mobile menu icon" style={{height: '15px'}}/>
                        </div>
                        <li>
                            {user.email?`Welcome ${user.firstname}`:<Link to="/login" onClick={()=>{setOpen(false);setPage('Login')}}>Login</Link>}
                        </li>
                        {user.firstname.toUpperCase()==='ADMIN'&&
                            <li>
                                <Link to="/" onClick={()=>{setOpen(false);setPage('Admin');}}>Admin</Link>
                            </li>
                        }
                        <li>
                            <Link to="/" onClick={()=>{if (user.email){setOpen(false);setPage('EnterTimesheet');}else{alert('Please Login to enter Timesheets.');setPage('login');setOpen(false)}}}>Enter Timesheet</Link>
                        </li>
                        <li>
                            <Link to="/" onClick={()=>{if (user.email){setOpen(false);setPage('ViewTimesheets');}else{alert('Please Login to view Timesheets.');setPage('login');setOpen(false)}}}>View Timesheets</Link>
                        </li>
                        <li>
                            {user.email?<Link to="/" onClick={()=>{setUser(USER_INIT);setPage('login'); setOpen(false);}}>Logout</Link>:<Link to="/signup" onClick={()=>{setOpen(false);setPage('signup')}}>Signup</Link>}
                        </li>
                    </ul>
                </nav>
                
            
            </Router>
        </>}
        </div>
            {/* show mobile menu icon */}
            {/* {props.mobile&&(!props.open||props.open===undefined)?
                <div className='hamburgerMenu' onClick={(e) => props.handleNavOpen(e)}>
                    <img id='hamburger' src='/img/hamburger.png' alt="open mobile menu icon"/>
                </div>:''
            } */}
            {/* show menu */}
            {/* <div className='navLinks' id='navLinks'>
                {mobile&&open?
                    <div className='closeIcon' onClick={(e)=>props.handleNavOpen(e)}>
                        <img src='/img/clear_search.png' alt="close mobile menu icon"/>
                    </div>:''
                }
                <Link href='/timesheet'>
                    <a>Timesheet Entry</a>
                </Link>
                <Link href='/login'>
                    <a>Login</a>
                </Link>
                <Link href='/signup'>
                    <a>Signup</a>
                </Link>        
            </div> */}
        {/* </div> */}
        <NavBarCss />    
        </>
    )
}
