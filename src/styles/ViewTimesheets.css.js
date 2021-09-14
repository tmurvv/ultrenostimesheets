function ViewTimesheetsCss() {
    return (
        <style jsx="true">{`
            body {
                font-family: 'Times New Roman', Helvetica, Arial;
                font-size: 18px;
                line-height: 20px;
                font-weight: 400;
                color: #3b3b3b;
                -webkit-font-smoothing: antialiased;
                font-smoothing: antialiased;
            }
            .title {
                font-weight: 900;
                color: #ffffff;
                font-size: 20px;
                margin-top: 20px;
                text-align: center;
            }
            .wrapper {
                margin: 0 auto;
                padding: 20px;
                max-width: 800px;
            }
            .table {
                margin: auto;
                width: 90%;
                max-width: 350px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                display: table;
            }
            @media screen and (max-width: 950px) {
                // .table {
                //     display: block;
                // }
            }
            .row {
                display: table-row;
                background: #f6f6f6;
            }
            .row:nth-of-type(odd) { 
                background: #e9e9e9; 
            }
            .header { 
                font-weight: 900;
            }
            @media screen and (max-width: 950px) {
                .header {
                    padding: 8px 0;
                    display: block;
                }
            }
            @media screen and (max-width: 950px) {
                .row {
                    padding: 8px 0;
                    display: block;
                }
            }
            .row>span {
                white-space: nowrap;
            }
            .cell {
                padding: 6px 12px;
                max-height: 40px;
            }
            @media screen and (max-width: 950px) {
                .cell {
                    padding: 2px 12px;
                    display: flex;
                    align-items: center;
                    max-height: unset;
                }
            }
        `}</style>
    );
}
    
export default ViewTimesheetsCss;
