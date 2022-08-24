import {Modal, Input, Form,} from 'antd';
import React, {useState} from 'react';
import PubSub, {name} from 'pubsub-js';
import Constant from '../../Common/Constant';

function GroupDialog() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [group, setGroup] = useState<any>({});

    React.useEffect(() => {

        // 订阅newGroup被点击事件
        const graphicDialogToken = PubSub.subscribe(Constant.GROUP_DIALOG_VISIBLE, (_, data) => {
            const {isModalVisible} = data;
            setIsModalVisible(isModalVisible);
        });

        return () => {
            PubSub.unsubscribe(graphicDialogToken);
        }
    }, []);


    const handleOk = () => {
        // 发布 save or update group 消息
        PubSub.publish(Constant.SAVE_OR_UPDATE_GROUP, {group: group});
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const saveName = (event: any) => {
        group["name"] = event.target.value;
        setGroup(group);
    }

    return (
        <div className={"graphic-dialog"}>
            <Modal title="New Group" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    name="basic"
                    labelCol={{span: 5}}
                    wrapperCol={{span: 16}}
                    autoComplete="off"
                    labelAlign={"left"}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{required: true}]}
                    >
                        <Input onChange={saveName}
                               placeholder={"Please input name!"}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );

}

export default GroupDialog;