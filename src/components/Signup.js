// packages
import {useState, useContext} from 'react';
import axios from 'axios';
import uuid from 'react-uuid';

// internal
import LoginSignupCSS from '../styles/LoginSignup.css';
import PageTitle from '../components/PageTitle';
import {USER_INIT} from '../constants/inits';
import {UserContext} from '../contexts/UserContext';

function Signup({setPage}) {
    // declare variables
    const {setUser} = useContext(UserContext);
    const [signupUser, setSignupUser] = useState(USER_INIT);
    const handleChange = (e) => {
        switch (e.target.name) {
            case 'firstname': 
                setSignupUser({...signupUser, firstname: e.target.value, change: true});
                break
            case 'lastname': 
                setSignupUser({...signupUser, lastname: e.target.value, change: true});
                break
            case 'email': 
                setSignupUser({...signupUser, email: e.target.value, change: true});
                break
            case 'confirmemail': 
                setSignupUser({...signupUser, confirmemail: e.target.value, change: true});
                break
            case 'password': 
                setSignupUser({...signupUser, password: e.target.value, change: true});
                break
            case 'confirmpassword': 
                setSignupUser({...signupUser, confirmpassword: e.target.value, change: true});
                break
            default :
        }
    }
    
    const handleSubmit = async () => {
        // validations
        if ((!signupUser.firstname)||signupUser.firstname.length<1) alert('First name is required.');
        if ((!signupUser.lastname)||signupUser.lastname.length<1) alert('Last name is required.');
        if ((!signupUser.password)||signupUser.password.length<8) alert('Passwords must be at least 8 characters.');
        if (signupUser.email !== signupUser.confirmemail) alert('Emails do not match.');
        if (signupUser.password !== signupUser.confirmpassword) alert('Passwords do not match.');
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
        } catch (e) {
            // log error
            console.log('error');
            console.log(e.response)
            // in-app message
            if (e.response&&e.response.data&&e.response.data.message.toUpperCase().includes('EXISTS')) {
                // email in use
                alert("Email already in use.");
            } else {
                // all other errors
                alert(`Something went wrong on signup. Please check your network connection.`)
            }
        }
        
    //     // set loading image
    //     dispatchResultInfo({type:'loadingImage'});        
    //     try {
    //         // login user
    //         const res = await axios.post(`${process.env.backend}/api/v1/users/loginuser`, {email: userLogin.loginemail, password: userLogin.loginpassword});
            
    //         const returnedUser = res.data.user;
    //         const jwt = res.data.token;

    //         // set user context to login user
    //         await setUser({
    //             firstname: returnedUser.firstname, 
    //             lastname: returnedUser.lastname, 
    //             email: returnedUser.email
    //         });
    //         // set JWT cookie
    //             document.cookie = `JWT=${jwt}`
    //         // display result window
    //         resultText.innerText=`Login Successful: Welcome ${returnedUser.firstname}`;
    //         dispatchResultInfo({type: 'OK'});
    //     } catch(e) {
    //         // email not found #1
    //         if (e.response&&e.response.data&&e.response.data.message&&e.response.data.message==="Cannot read property 'emailverified' of null") {
    //             resultText.innerText=`${process.env.next_env==='development'?e.message:'Email not found.'} Login as guest?`;
    //             dispatchResultInfo({type: 'okTryAgain'});
    //         // email not verified
    //         } else if (e.response&&e.response.data&&e.response.data.message&&e.response.data.message.includes('verified')) {
    //             setNeedVerify(true);                
    //             await setUserLogin({...userLogin, loginemail: e.response.data.useremail})
    //             resultText.innerText=`${process.env.next_env==='development'?e.response.data.data.message:'Email not yet verified. Please see your inbox for verification email.'} Resend verification email?`;
    //             dispatchResultInfo({type: 'okTryAgain'});
    //         // passwords don't match
    //         } else if (e.response&&e.response.data&&e.response.data.message&&e.response.data.message.includes('incorrect')) {
    //             resultText.innerText=`${process.env.next_env==='development'?e.message:'Password does not match our records.'} Login as guest?`;
    //             dispatchResultInfo({type: 'okTryAgain'});
    //         // email not found #2
    //         } else if (e.response&&e.response.data&&e.response.data.message&&e.response.data.message.includes('Email')) {
    //             resultText.innerText=`${process.env.next_env==='development'?e.message:'Email not found.'} Login as guest?`;
    //             dispatchResultInfo({type: 'okTryAgain'});
    //         // other error
    //         } else {
    //             resultText.innerText=`${process.env.next_env==='development'?e.message:'Something went wrong on login. Please check your network connection.'} Login as guest?`;
    //             dispatchResultInfo({type: 'okTryAgain'});
    //         }
    //     }
    }
    // // handle forgotPassword click
    // async function handleForgot() {
    //     const resultText = document.querySelector('#loadingLoginText');
    //     // shortcut no email entered
    //     if (!userLogin.loginemail) {
    //         resultText.innerText='Please enter your account email.';
    //         dispatchResultInfo({type: 'tryAgain'});
    //         return;
    //     }
    //     try {
    //         // send forgot password email
    //         const res = await axios.get(`${process.env.backend}/api/v1/users/sendresetemail/${userLogin.loginemail}`);
    //         // display results
    //         if (res.status===200) {
    //             resultText.innerText=`Please check your inbox for an email with instructions to reset your password.`;
    //             dispatchResultInfo({type: 'OK'});
    //         }
    //     } catch (e) {
    //         // display error
    //         resultText.innerText=`${process.env.next_env==='development'?e.message:'Something went wrong with password reset. Please check your netword connection.'} Log in as guest user?`
    //         dispatchResultInfo({type: 'okTryAgain'});
    //     }
    // }
    // async function loginGuest(evt) {
    //     if (needVerify) {
    //         // display loader
    //         const resultText = document.querySelector('#loadingLoginText');
    //         dispatchResultInfo({ type: 'loadingImage' });  
    //         //create user object
    //         const forgotPasswordUser = {
    //             firstname: 'findaharp.com',
    //             lastname: 'user',
    //             email: userLogin.loginemail
    //         }
    //         try {
    //             // this is a hack because program not returning for axios post, needs to be debugged and next three lines put below axios call
    //             // display result
    //             resultText.innerText=`Verify email sent.`;
    //             dispatchResultInfo({type: 'OK'});
    //             setNeedVerify(false);
    //             // send forgot password email
    //             await axios.post(`${process.env.backend}/api/v1/resendverify`, forgotPasswordUser);
    //         } catch (e) {
    //             // display error
    //             resultText.innerText=`${process.env.next_env==='development'?e.message:'Something went wrong sending verification email. Please check your network connection.'} Log in as guest user?`;
    //             dispatchResultInfo({type: 'okTryAgain'});
    //         }
    //     }
    //     resetResults();
    //     // go to main window
    //     Router.push('/');
    // }
    
    return ( 
       <>
       <div className='login-signup-container'>
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
