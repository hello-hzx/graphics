import Constant from "../../Common/Constant";
import {Modal} from "antd";
import PubSub from "pubsub-js";
import {useEffect, useState} from "react";

const DeleteGraphicDialog = (props: DeleteGraphicDialogSpace.Props) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [operatedType, setOperatedType] = useState("");


    useEffect(() => {
        // 订阅deleteGraphic击事件
        const token = PubSub.subscribe(Constant.DELETE_GRAPHIC_DIALOG_VISIBLE, (message, data) => {
            const {isModalVisible, operatedType} = data;
            setIsModalVisible(isModalVisible);
            setOperatedType(operatedType);
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
            <Modal
                title={operatedType === "group" ? Constant.DELETE_GROUP_DIALOG_TITLE : Constant.DELETE_GRAPHICS_DIALOG_TITLE}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p>{operatedType === "group" ? Constant.DELETE_GROUP_MESSAGE : Constant.DELETE_GRAPHIC_MESSAGE}</p>
            </Modal>
        </div>
    );
}

export namespace DeleteGraphicDialogSpace {
    export interface Props {

    }
}

export default DeleteGraphicDialog;