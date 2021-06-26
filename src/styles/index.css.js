import React from 'react';

function IndexCss() {
    return (
        <style jsx="true">{`
            .index {
                // background-image: linear-gradient(to bottom, #fffedf, #ffffff 300px);
                margin: 0;
                padding-top: 70px;
                height: fit-content;
                position: relative;
            }
            .index h2 {
                margin-block-end:0;
                margin-block-start:0;
            }
        `}
    </style>
    )
}

export default IndexCss;
