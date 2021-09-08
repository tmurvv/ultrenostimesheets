import {useState,useEffect} from 'react';
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
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
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
    const [page, setPage] = useState("login"); // ['Homepage', 'Login','Logout', 'Signup', 'EnterTimesheet', 'ViewTimesheets', 'EditTimesheet', 'PasswordReset', 'RefreshView', 'Dashboard', 'Profile']
    const [editEntry, setEditEntry] = useState(USER_INIT);
    const [resetPasswordEmail, setResetPasswordEmail] = useState();
    
    // param check for reset password
    useEffect(()=>{
        // const params = new URLSearchParams(window.location.search) // id=123
        const params = window.location.search.substr(1).split('&').reduce(function (q, query) {
            var chunks = query.split('=');
            var key = chunks[0];
            var value = decodeURIComponent(chunks[1]);
            value = isNaN(Number(value))? value : Number(value);
            return (q[key] = value, q);
        }, {});
        if (!params || !params.reset) return;
        setPage('ResetPassword');
        params.reset&&setResetPasswordEmail(atob(params.reset));
    },[]);
    // check for file upload
    useEffect(() =>{
        if (process.env.NODE_ENV!=='test') {
            async function jParse(user) {
                const ret = await JSON.parse(user);
                console.log(ret);
                setUser(ret);
                setPage('Dashboard');
            }
              
            const params = window.location.search.substr(1).split('&').reduce(function (q, query) {
                var chunks = query.split('=');
                var key = chunks[0];
                var value = decodeURIComponent(chunks[1]);
                value = isNaN(Number(value))? value : Number(value);
                return (q[key] = value, q);
            }, {});
            console.log('params:', params)
            console.log('params.auto')
            if (params&&params.user&&atob(params.user)) {jParse(atob(params.user));
            window.history.replaceState({}, document.title, "/");}
            else if (params&&params.auto) {setPage('Dashboard'); return;}
            else if (!params || !params.success) {return;}
            alert('Your file has been uploaded.');
            setPage('Homepage');
            window.history.replaceState({}, document.title, "/");
        }
    },[setPage]);
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
                                {page.toUpperCase()==='DASHBOARD'&&<Dashboard setPage={setPage}/>}
                                {page.toUpperCase()==='PROFILE'&&<Profile setPage={setPage}/>}
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
