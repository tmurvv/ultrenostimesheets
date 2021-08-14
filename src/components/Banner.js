import BannerCss from '../styles/Banner.css';
 
function Banner() {
    return (
        <>
            <div className="mainContainer">
                <img className="logo" src="img/ultimate_renovations-white_logo.png" alt="Ultimate Renovations logo white on black"/>
            </div>
            <BannerCss />
        </>
    )
}

export default Banner;
