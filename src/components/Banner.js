import React from 'react';
import BannerCss from '../styles/Banner.css';
 
function Banner() {
    return (
        <>
            <div className="mainContainer">
                <img className="logo" src="img/logo.png" alt="Ultimate Renovations logo white on black"/>
            </div>
            <BannerCss />
        </>
    )
}

export default Banner;