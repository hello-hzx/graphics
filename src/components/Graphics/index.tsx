import React, {Fragment} from 'react';
import Header from './Header'
import Option from "./Option";
import Content from "./Content";
// import './index.css'

function Graphics(props: GraphicsSpace.Props) {
    return (
        <Fragment>
            <Header/>
            <Option/>
            <Content/>
        </Fragment>
    );
}

export namespace GraphicsSpace {
    export interface Props {
    }
}

export default Graphics;
