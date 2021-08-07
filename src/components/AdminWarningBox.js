
import {useContext} from 'react';
import {UserContext} from '../contexts/UserContext'
import {AdminEditTimesheetsContext} from '../contexts/AdminEditTimesheetsContext'
 
function AdminWarningBox() {
    const {user} = useContext(UserContext);
    const {adminEditTimesheets} = useContext(AdminEditTimesheetsContext);
    return (
        <>
            {adminEditTimesheets&&
                <>
                    <div style={{padding: '5px', width: '60%', left: '50%', top: '10px', transform: 'translateX(-50%)', backgroundColor: '#fffeee', position: 'fixed', right: '50%'}}>
                        <div style={{border: '2px solid tomato', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px 15px'}}>
                            Admin logged in as {user.email}. Please logout when finished.
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default AdminWarningBox;