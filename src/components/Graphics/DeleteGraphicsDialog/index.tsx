import Constant from "../../Common/Constant";
import {Modal} from "antd";
import PubSub from "pubsub-js";
import {useEffect, useState} from "react";

function DeleteGraphicDialog() {
    const [isModalVisible, setIsModalVisible] = useState(false);


    useEffect(() => {
        // 订阅deleteGraphic击事件
        const token = PubSub.subscribe(Constant.DELETE_GRAPHIC_DIALOG_VISIBLE, (message, data) => {
            setIsModalVisible(data.isModalVisible);

        });

        return () => {
            PubSub.unsubscribe(token);
        }
    });

    const handleOk = () => {
        // 发布确认删除消息
        PubSub.publish(Constant.CONFIRM_DELETE_GRAPHIC);
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div className={"graphic-dialog"}>
            <Modal title="New Graphics" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <p>{Constant.DELETE_GRAPHIC_MESSAGE}</p>
            </Modal>
        </div>
    );
}

export default DeleteGraphicDialog;