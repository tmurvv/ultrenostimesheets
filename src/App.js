import {useState,useEffect} from 'react';
import axios from 'axios';
// components
import Banner from './components/Banner';
import Login from './components/Login';
import Signup from './components/Signup';
import TimesheetEntry from './components/TimesheetEntry';
// other internal
import {UserContext} from "./contexts/UserContext";
import AppCss from './styles/app.css';

function App() {
    const [user, setUser] = useState({firstname: "Carlos", lastname: "Weatherby"});
    const [page, setPage] = useState("TimesheetEntry"); // ['Login','Logout', 'Signup', 'TimesheetEntry', 'AddAnother']
    return (
        <>
            <header>              
                <UserContext.Provider value={{user, setUser}}>
                    <Banner />
                    {page.toUpperCase()==='LOGIN'&&<Login setPage={setPage}/>}
                    {page.toUpperCase()==='SIGNUP'&&<Signup setPage={setPage}/>}
                    {page.toUpperCase()==='TIMESHEETENTRY'&&<TimesheetEntry />}
                </UserContext.Provider>
            </header>
            <AppCss />
        </>
    );
}

export default App;
