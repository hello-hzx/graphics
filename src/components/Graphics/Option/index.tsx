import {Button} from 'antd';
import React from 'react';
import PubSub from 'pubsub-js'
import GraphicDialog from "../GraphicsDialog/index";
import Constant from '../../Common/Constant';
import './index.css';
import GroupDialog from "../GroupDialog";

function Option(props: OptionSpace.Props) {

    const newGraphics = () => {
        // 发布 显示GraphicDialog消息
        PubSub.publish(Constant.GRAPHIC_DIALOG_VISIBLE, {isModalVisible: true});
    }

    const newGroup = () => {
        // 发布 显示GroupDialog消息
        PubSub.publish(Constant.GROUP_DIALOG_VISIBLE, {isModalVisible: true});
    }

    return (
        <div className={"options"}>
            <Button type="primary">Expand</Button>
            <Button type="primary">Collapse</Button>
            <Button type="primary" onClick={newGraphics}>New Graphic</Button>
            <Button type="primary" onClick={newGroup}>New Group</Button>
            <Button type="primary" disabled>Import</Button>
            <Button type="primary" disabled>Export</Button>
            <Button type="primary" disabled>Add to the user library</Button>
            <Button type="primary" disabled>Delete</Button>
            <GraphicDialog/>
            <GroupDialog/>
        </div>
    );

}

export namespace OptionSpace {
    export interface Props {
    }
}

export default Option;