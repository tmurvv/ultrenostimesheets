import BannerCss from '../styles/Banner.css';
 
function Banner() {
    return (
        <>
            <div className="mainContainer">
                <img className="logo" src="img/ultimate_renovations-white_logo.png" alt="Ultimate Renovations Timesheets"/>
            </div>
            {/*<div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>{process.env.REACT_APP_DEV_ENV.indexOf('staging')>0&&'STAGING BACKEND'}</div>*/}
            {/*<div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>{process.env.REACT_APP_DEV_ENV.indexOf('local')>0&&'LOCAL BACKEND'}</div>*/}
            <BannerCss />
        </>
    )
}

export default Banner;
