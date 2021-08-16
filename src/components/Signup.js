// packages
import {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import uuid from 'react-uuid';

// internal
import LoginSignupCSS from '../styles/LoginSignup.css';
import PageTitle from '../components/PageTitle';
import {USER_INIT} from '../constants/inits';
import {UserContext} from '../contexts/UserContext';
import Spinner from './Spinner';

function Signup({setPage}) {
    // declare variables
    const {setUser} = useContext(UserContext);
    const [signupUser, setSignupUser] = useState(USER_INIT);
    const handleChange = (evt) => {
        setSignupUser({...signupUser, [evt.target.name]: evt.target.value, change: true});
    }
    const handleSubmit = async (evt) => {
        // validations
        if ((!signupUser.firstname)||signupUser.firstname.length<1) {return alert('First name is required.');}
        if ((!signupUser.lastname)||signupUser.lastname.length<1) {return alert('Last name is required.');}
        if ((!signupUser.password)||signupUser.password.length<8) {return alert('Passwords must be at least 8 characters.');}
        if (signupUser.email !== signupUser.confirmemail) {return alert('Emails do not match.');}
        if (signupUser.password !== signupUser.confirmpassword) {return alert('Passwords do not match.');}
        // start spinner
        if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="flex";
        // create signup user object
        const newUser = {
            firstname: signupUser.firstname,
            lastname: signupUser.lastname,
            email: signupUser.email,
            password: signupUser.password,
        };     
        try {
            // signup user
            const res = await axios.post(`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/users/signup`, newUser);
            if (res.status===201 || res.status===200) {                   
                // set userContext to added user
                const addeduser = res.data.newuser;
                setUser({
                    firstname: addeduser.firstname, 
                    lastname: addeduser.lastname, 
                    email: addeduser.email,
                });
                // in-app message
                alert('Signup Successful.');
                // set environment
                setPage('EnterTimesheet');
            }
            // stop spinner
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
        } catch (e) {
            // log error
            console.log('Error on signup', e.response)
            // in-app message
            if (e.response&&e.response.data&&e.response.data.message.toUpperCase().includes('EXISTS')) {
                // email in use
                alert("Email already in use.");
            } else {
                // all other errors
                alert(`Something went wrong on signup. Please check your network connection.`)
            }
            // stop spinner
            if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";
        }
    }
    // set environment
    useEffect(()=>{
        if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="none";   
    },[]);
    return ( 
       <>
       <div className='login-signup-container'>
            <Spinner />
            <PageTitle maintitle='Signup' subtitle='' />
            <div style={{cursor: 'pointer', margin: 'auto', width: 'fit-content'}} onClick={()=>{setPage('Login')}}>
                <button type="button" className='link-btn' style={{width: 'fit-content', fontStyle: 'italic', fontSize: '16px',}}>Click Here to Login</button>
            </div>
            <div className='form-container' id="signup" style={{marginTop: '0px'}}>
                <form onSubmit={()=>handleSubmit()}>
                    <div className='login-form'>
                        <div className="input-name">
                            <h3>First Name<span style={{color: 'orangered'}}>*</span></h3>
                        </div>
                        <input 
                            className="field-input"
                            id={uuid()}
                            value={signupUser.firstname}
                            onChange={handleChange}
                            name='firstname'
                            required
                        />
                        <div className="input-name">
                            <h3>Last Name<span style={{color: 'orangered'}}>*</span></h3>
                        </div>
                        <input 
                            className="field-input"
                            id={uuid()}
                            value={signupUser.lastname}
                            onChange={handleChange}
                            name='lastname'
                            required
                        />
                        <div className="input-name input-margin">
                            <h3>Email<span style={{color: 'orangered'}}>*</span></h3>
                        </div>
                        <input 
                            className="field-input"
                            type='email'
                            id={uuid()}
                            value={signupUser.email}
                            onChange={handleChange}
                            name='email'
                            required
                        />
                        <div className="input-name input-margin">
                            <h3>Confirm Email<span style={{color: 'orangered'}}>*</span></h3>
                        </div>
                        <input 
                            className="field-input"
                            type='email'
                            id={uuid()}
                            value={signupUser.confirmemail}
                            onChange={handleChange}
                            name='confirmemail'
                            required
                        />
                        <div className="input-name input-margin">
                            <h3>Password<span style={{color: 'orangered'}}>*</span></h3>
                        </div>
                        <input 
                            className="field-input"
                            type='password'
                            id={uuid()}
                            value={signupUser.password}
                            onChange={handleChange}
                            name='password'
                            required
                        />
                        <div className="input-name input-margin">
                            <h3>Confirm Password<span style={{color: 'orangered'}}>*</span></h3>
                        </div>
                        <input 
                            className="field-input"
                            type='password'
                            id={uuid()}
                            value={signupUser.confirmpassword}
                            onChange={handleChange}
                            name='confirmpassword'
                            required
                        />   
                    </div>
                    <div style={{width: '100%', display: 'flex', justifyContent: 'space-evenly', marginTop: '20px auto'}}>
                        <button type='button' className="submit-btn login-signup-title" onClick={handleSubmit} style={{width: '120px'}}>
                            Submit
                        </button>
                        <button type='button' className="submit-btn login-signup-title" onClick={()=>setPage('Homepage')} style={{width: '120px', backgroundColor: '#000', color: 'white'}}>
                            Cancel
                        </button>
                    </div>
                </form>
                <LoginSignupCSS />
            </div>
        </div>
        </>
    )
}

export default Signup;
