import {useState,useEffect} from 'react';
import axios from 'axios';
import atob from 'atob';
// components
import Banner from './components/Banner';
import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Signup from './components/Signup';
import EnterTimesheet from './components/EnterTimesheet';
import ViewTimesheets from './components/ViewTimesheets';
import EditTimesheet from './components/EditTimesheet';
import ResetPassword from './components/ResetPassword';
import AdminWarningBox from './components/AdminWarningBox';
import Admin from './components/Admin';
// other internal
import {UserContext} from "./contexts/UserContext";
import {AdminEditTimesheetsContext} from "./contexts/AdminEditTimesheetsContext";
import {PageContext} from "./contexts/PageContext";
import {EditEntryContext} from "./contexts/EditEntryContext";
import AppCss from './styles/app.css';
import {USER_INIT} from './constants/inits';

function App() {
    const [user, setUser] = useState(USER_INIT);
    const [adminEditTimesheets, setAdminEditTimesheets] = useState(false);
    const [page, setPage] = useState("Login"); // BREAKING ['Homepage', 'Login','Logout', 'Signup', 'EnterTimesheet', 'ViewTimesheets', 'EditTimesheet', 'PasswordReset', 'RefreshView', 'Admin']
    const [editEntry, setEditEntry] = useState(USER_INIT);
    const [resetPasswordEmail, setResetPasswordEmail] = useState();
    
    // param check for reset password
    useEffect(()=>{
        const params = new URLSearchParams(window.location.search) // id=123
        if (!params.has('reset')) return;
        setPage('ResetPassword');
        setResetPasswordEmail(atob(params.get('reset')));
    },[]);
    // check for file upload
    useEffect(()=>{
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        if (params.success==='true') {
            alert('Your file has been uploaded.');
            setPage('Homepage')
        }
    },[setPage]);
    // // check for file upload
    // useEffect(()=>{
    //     window.addEventListener("resize", setPage(page));
    // },[setPage, page]);
    return (
        <>
            <header>            
                <PageContext.Provider value={{page, setPage}}>
                    <UserContext.Provider value={{user, setUser}}>
                        <AdminEditTimesheetsContext.Provider value={{adminEditTimesheets, setAdminEditTimesheets}}>
                            <EditEntryContext.Provider value={{editEntry, setEditEntry}}>
                                <Banner />
                                <NavBar />
                                <AdminWarningBox />
                                {page.toUpperCase()==='HOMEPAGE'&&<HomePage setPage={setPage}/>}
                                {page.toUpperCase()==='LOGIN'&&<Login setPage={setPage}/>}
                                {page.toUpperCase()==='SIGNUP'&&<Signup setPage={setPage}/>}
                                {page.toUpperCase()==='EDITTIMESHEET'&&<EditTimesheet />}
                                {page.toUpperCase()==='ENTERTIMESHEET'&&<EnterTimesheet setPage={setPage} />}
                                {page.toUpperCase()==='VIEWTIMESHEETS'&&<ViewTimesheets setPage={setPage}/>}
                                {page.toUpperCase()==='RESETPASSWORD'&&<ResetPassword useremail={resetPasswordEmail} setPage={setPage}/>}
                                {page.toUpperCase()==='REFRESHVIEW'&&<ViewTimesheets setPage={setPage}/>} {/* a hack to get viewtimesheets page to refresh after delete */}
                                {page.toUpperCase()==='ADMIN'&&<Admin setPage={setPage}/>}
                            </EditEntryContext.Provider>
                        </AdminEditTimesheetsContext.Provider>
                    </UserContext.Provider>
                </PageContext.Provider>
            </header>
            <AppCss />
        </>
    );
}

export default App;
