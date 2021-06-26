import React from 'react';

//internal
import NavBarCss from '../styles/NavBar.css.js';

export default function NavBar(props) {
    
    return(
        <>
        <div className='navBarOuter'>
            {/* show mobile menu icon */}
            {props.mobile&&(!props.open||props.open===undefined)?
                <div className='hamburgerMenu' onClick={(e) => props.handleNavOpen(e)}>
                    <img id='hamburger' src='/img/hamburger.png' alt="open mobile menu icon"/>
                </div>:''
            }
            {/* show menu */}
            {!props.mobile || props.mobile&&props.open?
                <div className='navLinks' id='navLinks'>
                    {props.mobile&&props.open?
                        <div className='closeIcon' onClick={(e)=>props.handleNavOpen(e)}>
                            <img src='/img/clear_search.png' alt="close mobile menu icon"/>
                        </div>:''
                    }
                    <Link href='/'>
                        <a onClick={(e)=>props.handleNavOpen(e)}>Find a Used Harp</a>
                    </Link>
                    <Link href='/buildersshowcase'>
                        <a onClick={(e)=>props.handleNavOpen(e)}>Builder Showcase</a>
                    </Link>
                    <div  className='mirrorATagFont aclass' onClick={()=>handleSubMenuClick()} style={{textAlign: 'center', justifyContent: 'center', flex: '2', cursor: 'pointer', position: 'relative'}}>Our Partners
                        <div id='partnerSubMenu' style={{transform: 'translateX(25%)', display: 'none', width: 'fit-content', position: 'absolute', top: '30px', zIndex: '9001', padding: '10px', backgroundColor: '#f9bf1e', boxShadow: '3px 3px 13px #f7dd93', flexDirection: 'column', justifyContent: 'flex-start'}}>
                            <Link href='/builderpartners'>
                                <a style={{whiteSpace: 'nowrap', marginBottom: '7px', textAlign: 'left'}} onClick={(e)=>props.handleNavOpen(e)}>Builder Partners</a>
                            </Link>
                            <Link href='/storepartners'>
                                <a style={{whiteSpace: 'nowrap', textAlign: 'left'}} onClick={(e)=>props.handleNavOpen(e)}>Store/Business Partners</a>
                            </Link>
                        </div>
                    </div>
                    <Link href='ultimaterenovations.com'>
                        <a onClick={(e)=>props.handleNavOpen(e)}>ultimaterenovations</a>
                        {/* <a onClick={(e)=>{if (Router&&Router.route!=='/onlinestore'&&document.querySelector('#spinner')) document.querySelector('#spinner').style.display='block'; props.handleNavOpen(e);}}>Music, Strings & Things</a> */}
                    </Link>        
                    <Link href='/contact' as='contact'>
                        <a onClick={(e)=>props.handleNavOpen(e)}>Contact/About</a>
                    </Link>
                    {/* <Link href={user&&user.firstname&&user.firstname!==undefined&&user.firstname.toUpperCase()!=='LOGIN'?'/userprofile':'/loginsignup'}>
                        <a id='userName' onClick={props.handleNavOpen}>{user&&user.firstname&&user.firstname!==undefined&&user.firstname.substr(0,1).toUpperCase()+user.firstname.substr(1).toLowerCase()}</a>
                    </Link> */}
                    {/* {user.currentHarpname
                        ?<Link href='/userharpprofile' as='/userharpprofile'>
                            <a id='userName' onClick={props.handleNavOpen}>Harp Profile</a>
                        </Link>
                        :<Link href='/harploginsignup' as='/harploginsignup'>
                            <a id='userName' onClick={props.handleNavOpen}>Harp Login</a>
                        </Link>
                    }
                    <Link href='#' onClick={()=>setStringformStatus('profile')}>
                        <button onClick={()=>setStringformStatus('profile')}>
                            Harp Profile
                        </button>
                    </Link> */}
                    <Link href='/ActivateEmail' as='/activateemail'>
                        <a style={{display: 'none'}} onClick={(e)=>props.handleNavOpen(e)}>Activate Email</a>
                    </Link>
                    <Link href='/ResetPassword' as='/resetpassword'>
                        <a style={{display: 'none'}} onClick={(e)=>props.handleNavOpen(e)}>Reset Password</a>
                    </Link>
                    <Link href='/cart' as='/cart'>
                        <a style={{display: 'none'}} onClick={(e)=>props.handleNavOpen(e)}>Cart</a>
                    </Link>
                </div>:''
            }
        </div>
        <NavBarCss />
        </>
        :<><div className='navBarOuter'>
            {/* show mobile menu icon */}
            {props.mobile&&(!props.open||props.open===undefined)?
                <div className='hamburgerMenu' onClick={(e) => props.handleNavOpen(e)}>
                    <img id='hamburger' src='/img/hamburger.png' alt="open mobile menu icon"/>
                </div>:''
            }
            {/* show menu */}
            {!props.mobile || props.mobile&&props.open?
                <div className='navLinks' id='navLinks'>
                    {props.mobile&&props.open?
                        <div className='closeIcon' onClick={(e)=>props.handleNavOpen(e)}>
                            <img src='/img/clear_search.png' alt="close mobile menu icon"/>
                        </div>:''
                    }
                    <Link href='/'>
                        <a onClick={(e)=>{props.handleNavOpen(e);}}>Find a Used Harp</a>
                    </Link>
                    <Link href='/buildersshowcase'>
                        <a onClick={(e)=>props.handleNavOpen(e)}>Builder Showcase</a>
                        {/* <a onClick={props.handleNavOpen}>Harp Builder Showcase</a> */}
                    </Link>
                    <div className='mirrorATagFont aclass' onClick={()=>handleSubMenuClick()} style={{transition: 'transform 1s', textAlign: 'center', justifyContent: 'center', flex: '2', cursor: 'pointer', position: 'relative', fontSize: '16px'}}>Our Partners
                        <div id='partnerSubMenu'>
                            <Link href='/builderpartners'>
                                <a style={{marginBottom: '7px'}} onClick={(e)=>props.handleNavOpen(e)}>Builder Partners</a>
                            </Link>
                            <Link href='/storepartners'>
                                <a onClick={(e)=>props.handleNavOpen(e)}>Store/Business Partners</a>
                            </Link>
                        </div>
                    </div>
                    {/* {!Router.route.includes('builder')
                        ?<Link href='/storepartners' as='/storepartners'>
                            <a onClick={(e)=>props.handleNavOpen(e)}>Our Store Partners</a>
                        </Link>
                        :<Link href='/builderpartners'>
                            <a onClick={(e)=>props.handleNavOpen(e)}>Our Builder Partners</a>
                        </Link>
                    } */}
                    <Link href='/onlinestore' as='/onlinestore'>
                        {/* <a onClick={()=>{if (Router&&Router.route!=='/onlinestore'&&document.querySelector('#spinner')) document.querySelector('#spinner').style.display='block'; props.handleNavOpen;}}>Music, Strings & Things</a> */}
                        <a onClick={(e)=>props.handleNavOpen(e)}>Music, Strings & Things</a>
                    </Link>        
                    <Link href='/contact' as='contact'>
                        <a onClick={(e)=>props.handleNavOpen(e)}>Contact/About</a>
                    </Link>
                    {/* <Link href={user&&user.firstname&&user.firstname.toUpperCase()!=='LOGIN'?'/userprofile':'/loginsignup'}>
                        <a id='userName' onClick={(e)=>props.handleNavOpen(e)}>{user&&user.firstname&&user.firstname!==undefined&&user.firstname.substr(0,1).toUpperCase()+user.firstname.substr(1).toLowerCase()}</a>
                    </Link> */}
                    <Link href='/ActivateEmail' as='/activateemail'>
                        <a style={{display: 'none'}} onClick={(e)=>props.handleNavOpen(e)}>Activate Email</a>
                    </Link>
                    <Link href='/ResetPassword' as='/resetpassword'>
                        <a style={{display: 'none'}} onClick={(e)=>props.handleNavOpen(e)}>Reset Password</a>
                    </Link>
                    <Link href='/cart' as='/cart'>
                        <a style={{display: 'none'}} onClick={(e)=>props.handleNavOpen(e)}>Cart</a>
                    </Link>
                </div>:''
            }
        </div>
        <NavBarCss />
        </>
        }
       </>    
    )
}
