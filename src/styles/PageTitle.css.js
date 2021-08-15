function PageTitleCss() {
    return (
        <style jsx="true">{`
            h2 {
                margin-block-end:0;
                margin-block-start:0;
            }
            .mainTitle {
                text-align: center;
                margin: auto;
                letter-spacing: 1.5px;
                font-size: 24px
            }
            .subTitle {
                width: 60%;
                margin: auto;
                text-align: center;
                font-size: 12px;
                font-style: italic;
                color: #868686;
                letter-spacing: 1px;
                font-weight: 500;
                font-size:14px;
                padding-top: 10px;      
            }
            `}
            </style>
            )
        }
        
        export default PageTitleCss;
        