import {useState,useEffect} from 'react';
import axios from 'axios';
// components
import Banner from './components/Banner';
import NavBar from './components/NavBar';
import Login from './components/Login';
import Signup from './components/Signup';
import TimesheetEntry from './components/TimesheetEntry';
import TimesheetView from './components/TimesheetView';
// other internal
import {UserContext} from "./contexts/UserContext";
import {PageContext} from "./contexts/PageContext";
import AppCss from './styles/app.css';
import {USER_INIT} from './constants/inits';

function App() {
    const [user, setUser] = useState(USER_INIT);
    const [page, setPage] = useState("login"); // ['Login','Logout', 'Signup', 'TimesheetEntry', 'TimesheetView', 'AddAnother']
    
    return (
        <>
            <header>            
                <PageContext.Provider value={{page, setPage}}>
                    <UserContext.Provider value={{user, setUser}}>
                        <Banner />
                        <NavBar />
                        {page.toUpperCase()==='LOGIN'&&<Login setPage={setPage}/>}
                        {page.toUpperCase()==='SIGNUP'&&<Signup setPage={setPage}/>}
                        {page.toUpperCase()==='TIMESHEETENTRY'&&<TimesheetEntry />}
                        {page.toUpperCase()==='TIMESHEETVIEW'&&<TimesheetView />}
                    </UserContext.Provider>
                </PageContext.Provider>
            </header>
            <AppCss />
        </>
    );
}

export default App;
