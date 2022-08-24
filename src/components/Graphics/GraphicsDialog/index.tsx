import {Modal, Form, Input, Select, Upload, Button} from 'antd';
import React, {useState} from 'react';
import {PlusOutlined} from '@ant-design/icons';
import type {RcFile, UploadProps} from 'antd/es/upload';
import type {UploadFile} from 'antd/es/upload/interface';
import PubSub from 'pubsub-js';
import Constant from '../../Common/Constant';
import './index.css';

function GraphicDialog(props: GraphicDialogSpace.Props) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [groupList, setGroupList] = useState([]);
    const [graphicsBase64, setGraphicsBase64] = useState<string>('');
    const [formData, setFormData] = useState<any>({});
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const [form] = Form.useForm();
    React.useEffect(() => {

        // 订阅groupList数据
        const groupListToken = PubSub.subscribe(Constant.GROUP_LIST_DATA, (message, data) => {
            setGroupList(data.groupList);
        })

        // 订阅newGraphic被点击事件
        const graphicDialogToken = PubSub.subscribe(Constant.GRAPHIC_DIALOG_VISIBLE, (message, data) => {
            const {isModalVisible, graphics} = data;

            if (graphics) { // 编辑：携带了graphics数据
                // 数据回显
                form.setFieldValue("name", graphics.name);
                form.setFieldValue("group", graphics.groupId);

                // 显示缩略图
                const {id, name, base64Url} = graphics;
                const fileList = [{
                    uid: id,
                    name,
                    status: 'done',
                    url: base64Url
                }]
                setFileList(fileList as UploadFile[]);

                // graphics base64Url
                setGraphicsBase64(base64Url);

                // 填充formData
                setFormData({
                    id,
                    name,
                    groupId: graphics.groupId,
                })
            } else {

                setFormData({});
                setFileList([]);
                setGraphicsBase64("");
                form.setFieldValue("name", "");
                form.setFieldValue("group", null);
            }

            setIsModalVisible(isModalVisible);
        });

        return () => {
            PubSub.unsubscribe(graphicDialogToken);
            PubSub.unsubscribe(groupListToken);
        }
    }, [groupList]);

    const saveName = (event: any) => {
        formData['name'] = event.target.value;
        setFormData(formData);
    }
    const saveGroup = (event: any) => {
        formData['groupId'] = event;
        setFormData(formData);
    }

    const graphicsForm = () => {

        const getBase64 = (file: RcFile): Promise<string> =>
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = error => reject(error);
            });

        const handleChange: UploadProps['onChange'] = ({fileList: newFileList}) => {
            getBase64(fileList[0] as RcFile).then((result) => {
                setGraphicsBase64(result);
            });

            setFileList(newFileList);
            const formData = new FormData();
            fileList.forEach(file => {
                formData.append('files[]', file as RcFile);
            });
        };

        const uploadButton = (
            <div>
                <PlusOutlined/>
                <div style={{marginTop: 1}}>Upload</div>
            </div>
        );

        const props: UploadProps = {
            onRemove: file => {
                const index = fileList.indexOf(file);
                const newFileList = fileList.slice();
                newFileList.splice(index, 1);
                setFileList(newFileList);
            },
            beforeUpload: file => {
                const graphicsList = fileList;
                graphicsList.push(file);
                setFileList(graphicsList);
                return false;
            },
            fileList,
        };

        return (
            <Form
                form={form}
                name="basic"
                labelCol={{span: 4}}
                wrapperCol={{span: 16}}
                autoComplete="off"
                labelAlign={"left"}
            >
                <Form.Item
                    rules={[{required: true}]}
                >
                    <Upload
                        {...props}
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleChange}
                    >
                        {fileList.length > 0 ? null : uploadButton}
                    </Upload>
                </Form.Item>
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{required: true}]}
                >
                    <Input onChange={saveName}
                           placeholder={Constant.NAME_INPUT_PLACEHOLDER}
                    />
                </Form.Item>

                <Form.Item
                    label="Group"
                    name="group"
                >
                    <Select
                        placeholder={Constant.GROUP_INPUT_PLACEHOLDER}
                        onChange={saveGroup}
                        showArrow={true}
                    >
                        {groupList.map((group: any) => (
                            <Select.Option key={group.id} value={group.id}>
                                {group.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Keyword"
                    name="keyword"
                >
                    <Select
                        mode="multiple"
                        placeholder={Constant.KEYWORD_INPUT_PLACEHOLDER}
                        showArrow={true}
                    >
                        {/*{FORMATS.map(item => (*/}
                        {/*    <Select.Option key={item} value={item}>*/}
                        {/*        {item}*/}
                        {/*    </Select.Option>*/}
                        {/*))}*/}
                    </Select>
                </Form.Item>
            </Form>
        );
    };

    const handleOk = () => {
        // 发布保存或更新graphics消息
        PubSub.publish(Constant.SAVE_OR_UPDATE_GRAPHICS, {formData: formData, graphicsBase64: graphicsBase64});
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setGraphicsBase64("");
        setIsModalVisible(false);
    };

    return (
        <div className={"graphic-dialog"}>
            <Modal title="New Graphics" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                {graphicsForm()}
            </Modal>
        </div>
    );

}

export namespace GraphicDialogSpace {
    export interface Props {
    }
}

export default GraphicDialog;