import BannerCss from '../styles/Banner.css';
 
function Banner() {
    return (
        <>
            <div className="mainContainer">
                <img className="logo" src="img/logo.png" alt="Able Construction logo white and gold on black"/>
            </div>
            <BannerCss />
        </>
    )
}

export default Banner;
