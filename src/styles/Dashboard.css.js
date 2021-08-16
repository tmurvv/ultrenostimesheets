function DashboardCss() {
    return (
        <style jsx="true">{`
            .OuterContainer {
                display: flex;
            }
            @media only screen and (max-width: 650px) {
                .OuterContainer {
                    display: block;
                }
            }
            .MenuContainer ul {
                margin-top: 35px;
            }
            @media only screen and (max-width: 650px) {
                .MenuContainerImg {
                    display: none;
                }
            }
            @media only screen and (max-width: 650px) {
                .MenuContainer ul {
                    margin-top: 0;
                    display: flex;
                    flex-wrap: wrap;
                }
                .MenuContainer>ul>li>button {
                    background-color:#004976;
                    font-size: 14px !important;
                    color: white;
                }
            }
            .lists {
                
            }
            @media only screen and (max-width: 650px) {
                .lists {
                    transform: scale(.75);
                }
                .lists ul {
                    margin-top: -250px
                }
            }
            `}
            </style>
            )
        }
        
        export default DashboardCss;
        