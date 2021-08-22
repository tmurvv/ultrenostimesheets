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

function Profile({setPage}) {
    // declare variables
    const {user, setUser} = useContext(UserContext);
    const [signupUser, setSignupUser] = useState(USER_INIT);
    const handleChange = (evt) => {
        setSignupUser({...signupUser, [evt.target.name]: evt.target.value, change: true});
    }
    const handleSubmit = async (evt) => {
        // validations
        if (signupUser.email&&signupUser.email!==signupUser.confirmemail) return alert("Emails do not match.");
        
        // start spinner
        if (document.querySelector('#spinner')) document.querySelector('#spinner').style.display="flex";
        // is it an email change (backend needs to know)
        const emailChange = signupUser.email&&signupUser.confirmemail&&(user.email !== signupUser.email);
        // create signup user object
        const updatedUser = {
            firstname: signupUser.firstname || user.firstname,
            lastname: signupUser.lastname || user.lastname,
            email: signupUser.email || user.email,
            oldemail: user.email,
            id: user.id,
            emailChange
        };     
        try {
            // signup user
            const res = await axios.post(`${process.env.REACT_APP_DEV_ENV}/api/v1/ultrenostimesheets/users/updateuser`, updatedUser);
            if (res.status===201 || res.status===200) {                   
                // set userContext to added user
                const updateduser = res.data.returnObj;
                setUser({
                    firstname: updateduser.firstname, 
                    lastname: updateduser.lastname, 
                    email: updateduser.email,
                    id: updateduser._id
                });
                // in-app message
                alert('Update Successful.');
                // set environment
                setPage('Homepage');
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
                alert(`Something went wrong while changing profile. Please check your network connection.`)
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
            <PageTitle maintitle='User Profile' subtitle='' />
            <div className='form-container' id="signup" style={{marginTop: '0px'}}>
                <form onSubmit={()=>handleSubmit()}>
                    <div className='login-form'>
                        <div className="input-name">
                            <h3>New First Name</h3>
                        </div>
                        <input 
                            className="field-input"
                            id={uuid()}
                            value={signupUser.firstname}
                            onChange={handleChange}
                            name='firstname'
                            placeholder={user&&user.firstname}
                        />
                        <div className="input-name">
                            <h3>New Last Name</h3>
                        </div>
                        <input 
                            className="field-input"
                            id={uuid()}
                            value={signupUser.lastname}
                            onChange={handleChange}
                            name='lastname'
                            placeholder={user&&user.lastname}
                        />
                        <div className="input-name input-margin">
                            <h3>Email</h3>
                            {/* <h3>Email<span style={{color: 'orangered'}}>*</span></h3> */}
                        </div>
                        <input 
                            className="field-input"
                            type='email'
                            id={uuid()}
                            value={signupUser.email}
                            onChange={handleChange}
                            name='email'
                            placeholder={user.email}
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
                        />
                        <div className="input-name input-margin">
                            <h3>Password</h3>
                        </div>
                        <div>"Change Password" is located on the login page.</div>               
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

export default Profile;
