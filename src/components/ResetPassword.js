// packages
import {useState, useEffect} from 'react';
import axios from 'axios';
import uuid from 'react-uuid';

// internal
import PageTitle from './PageTitle';
import Spinner from './Spinner';
import LoginSignupCSS from '../styles/LoginSignup.css';
import IndexCss from '../styles/index.css';

function ResetPassword(props) {
    const [userLogin, setUserLogin] = useState({
        newpassword: '',
        confirmpassword: '',
        loginchange: false
    });
    const handleChange = (e) => {
        switch (e.target.name) {
            case 'newpassword': 
                setUserLogin({...userLogin, newpassword: e.target.value, loginchange: true});
                break
            case 'confirmpassword': 
                setUserLogin({...userLogin, confirmpassword: e.target.value, loginchange: true});
                break
            default :
        }
    }
    const handleSubmit = async () => {
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
        // start spinner
        if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="flex";
        try {
            // reset password
            await axios.post(`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/users/resetpassword`, {useremail: props.useremail, newpassword: userLogin.newpassword});
            // stop spinner
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
            // in-app message
            setTimeout(()=>{alert('Your password has been changed.')}, 200);
            // reset environment
            props.setPage('Login');
        } catch(e) {  
            // log error
            console.log(e.message);
            // stop spinner  
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
            // in-app message
            setTimeout(()=>{alert('Something went wrong resetting password.')}, 200);    
        }
        // stop spinner TODO test if necessary
        if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
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
                <form>
                    <div style={{padding: '25px'}}>   
                        <div className="input-name input-margin">
                            <h3>Account</h3>
                        </div>
                        <input 
                            className="field-input"
                            type='email'
                            id={()=>uuid()}
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
                            id={()=>uuid()}
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
                            id={()=>uuid()}
                            value={userLogin.confirmpassword}
                            onChange={handleChange}
                            name='confirmpassword'
                            required={true}
                        />
                    </div>
                    <button type='button' onClick={()=>handleSubmit()} className="submit-btn login-signup-title">
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
