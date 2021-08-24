function NavBarCss() {
    return (
        <style>{`
            body {
                box-sizing: border-box;
            }
            .navBarOuter {
                background: #f9bf1e;
                background-image: linear-gradient(340deg, #f9bf1e 50%, #fffbb5 58%, #ffe58a 74%, #f9bf1e 87%);
                height: 40px;
                border-bottom: 1px solid grey;
            }
            .navBarOuter>div {
                height: 100%;
            }
            @media only screen and (max-width: 550px) {
                .navBarOuter {
                    padding-right: 10px;
                    height: 40px;
                    display: flex;
                    justify-content: flex-end;
                }
            }
            .navLinks {
                height: 100%;
                display: flex;
                justify-content: space-evenly;
                align-items: center;
                position: relative;
            }
            ul {
                list-style: none;
                font-size: 14px;
                margin-block:0;
                padding-inline-start:0;
            }
            @media only screen and (max-width: 550px) {
                .navLinks {
                    flex-direction: column;
                    height: 162px;
                    padding: 10px;
                    border-radius: 3px;
                    background: #f9bf1e;
                    background-image: linear-gradient(340deg, #f9bf1e 50%, #fffbb5 58%, #ffe58a 74%, #f9bf1e 87%);
                    z-index: 9500;
                }
                .navLinks a {
                    font-size: 16px;
                }
            }
            a {
                font-family: 'avenir';
                font-size: 16px;
                text-decoration: none;
                color: #000000;
                opacity: 1;
                flex: 2;
                text-align: center;
            }
            a:hover {
                opacity: 1;
            }
            .hamburgerMenu img {
                height: 35px;
            }
            .closeIcon img {
                height: 25px;
                position: absolute;
                top: 0;
                left: 0;
            }
            @media only screen and (max-width: 550px) {
                .closeIcon img {
                    height: 18px;
                    top: 5px;
                    left: 5px;
                }
            }
      `}</style>
    )
}

export default NavBarCss;
