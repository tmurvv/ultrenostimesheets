import {useState, useEffect} from 'react';
import PageTitleCss from '../styles/PageTitle.css';

function PageTitle({ maintitle, subtitle }) {
    const [winWidth, setWinWidth] = useState(2000);
    useEffect(()=>{setWinWidth(window.innerWidth)},[]);

    return (
        <>
        <div className='mainTitle'>
            <h2 style={{fontSize: `${winWidth<550?'30px':''}`}}>{maintitle}</h2>
            <h3 className="subTitle">{subtitle}</h3>
        </div>
        <PageTitleCss />
        </>
    )
}

export default PageTitle;
