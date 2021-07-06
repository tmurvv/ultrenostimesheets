// packages
import React, {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import uuid from 'react-uuid';

// internal
import PageTitle from './PageTitle';
import Spinner from './Spinner';
import { UserContext } from '../contexts/UserContext';
import LoginSignupCSS from '../styles/LoginSignup.css';
import IndexCss from '../styles/index.css';

function ResetPassword(props) {
    const { user, setUser} = useContext(UserContext);
    const [userSignup, setUserSignup] = useState({
        firstname: '',
        lastname: '',
        signupemail: '',
        signuppassword: '',
        confirmpassword: '',
        distanceunit: '',
        signupchange: false
    });
    const [userLogin, setUserLogin] = useState({
        oldpassword: '',
        newpassword: '',
        confirmpassword: '',
        loginchange: false
    });
    const handleChange = (evt) => {
        switch (evt.target.name) {
            case 'newpassword': 
                setUserLogin({...userLogin, newpassword: evt.target.value, loginchange: true});
                break
            case 'confirmpassword': 
                setUserLogin({...userLogin, confirmpassword: evt.target.value, loginchange: true});
                break
            default :
        }
    }
    function resetSignupForm() {
        setUserSignup({
            firstname: '',
            lastname: '',
            signupemail: '',
            signuppassword: '',
            confirmpassword: '',
            distanceUnit: 'miles',
            signupchange: false
        });
    }
    function resetLoginForm() { 
        setUserLogin({
            oldpassword: '',
            newpassword: '',
            confirmpassword: '',
            loginchange: false
        });
    }
    function resetResults() {
        // document.querySelector('#loadingloginReset').style.display='none';
        // document.querySelector('#loadingloginResetText').innerText='';
        // document.querySelector('#loadingloginResetOk').style.display='none';
        // document.querySelector('#loadingloginResetTryAgain').style.display='none';
        // document.querySelector('#loadingloginResetImg').style.display='none';
    }
    
    const handleSubmit = async (evt) => {
        // check password length
        if (userLogin.newpassword.length<8) {
            alert(`Passwords must be at least 8 characters long.`);
            return;
        }
        // check password match 
        if (userLogin.newpassword !== userLogin.confirmpassword) {
            alert(`Passwords do not match.`);
            return
        }
        if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="flex";
        try {
            /* LOCAL */
            await axios.post(`http://localhost:3000/api/v1/ultrenostimesheets/users/resetpassword`, {useremail: props.useremail, newpassword: userLogin.newpassword});
            // await axios.post(`https://take2tech.herokuapp.com/api/v1/ultrenostimesheets/users/resetpassword`, {useremail: props.useremail, newpassword: userLogin.newpassword});
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
            setTimeout(()=>{alert('Your password has been changed.')}, 200);
            props.setPage('Login');
        } catch(e) {    
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
            setTimeout(()=>{alert('Something went wrong resetting password.')}, 200);    
        }
        if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
    }
    function loginGuest() {
        resetResults();
        // Router.push('/LoginSignup');
    }
    useEffect(() => {
        if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
    })
    
    return (
       <>
        <div style={{padding: '70px'}} className='loginReset-signupReset-container'>
            <PageTitle maintitle='Reset Password' subtitle='Passwords must be at least 8 characters' />
            <Spinner />
            
            <div style={{transform: 'none', marginTop: '50px'}} className="login-signup l-attop" id="login">
                <div className="login-signup-title">
                    Reset Password
                </div>
                <form onSubmit={handleSubmit}>
                    <div style={{padding: '25px'}}>   
                        <div className="input-name input-margin">
                            <h3>Account</h3>
                        </div>
                        <input 
                            className="field-input"
                            type='email'
                            id={uuid()}
                            placeholder={props.useremail}
                            value={props.useremail}
                            name='email'
                            disabled={true}
                        />
                        <div className="input-name input-margin">
                            <h3>New Password</h3>
                        </div>
                        <input 
                            className="field-input"
                            type='password'
                            id={uuid()}
                            value={userLogin.newpassword}
                            onChange={handleChange}
                            name='newpassword'
                            required={true}
                        />
                        <div className="input-name input-margin">
                            <h3>Confirm New Password</h3>
                        </div>
                        <input 
                            className="field-input"
                            type='password'
                            id={uuid()}
                            value={userLogin.confirmpassword}
                            onChange={handleChange}
                            name='confirmpassword'
                            required={true}
                        />
                    </div>
                    <button type='button' onClick={handleSubmit} className="submit-btn login-signup-title">
                        Submit
                    </button>
                </form>
            </div>
            <LoginSignupCSS />
            <IndexCss />
        </div>
        </>
    )
}

export default ResetPassword;
