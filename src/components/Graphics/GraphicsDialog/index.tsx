import {Button, Modal, Form, Input, Select, Upload} from 'antd';
import React, {useState} from 'react';
import {PlusOutlined} from '@ant-design/icons';
import type {RcFile, UploadProps} from 'antd/es/upload';
import type {UploadFile} from 'antd/es/upload/interface';
import PubSub from 'pubsub-js';
import Constant from '../../Common/Constant';
import './index.css';

function GraphicDialog(props: GraphicDialogSpace.Props) {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [fileList, setFileList] = useState<UploadFile[]>([
        // {
        //     uid: '-1',
        //     name: 'image.png',
        //     status: 'done',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        // },
    ]);


    React.useEffect(() => {
        // 订阅newGraphic被点击事件
        const token = PubSub.subscribe(Constant.GRAPHIC_DIALOG_VISIBLE, (message, data) => {
            setIsModalVisible(data.isModalVisible);
        })
        return () => {
            PubSub.unsubscribe(token);
        }
    });

    const graphicsFrom = () => {

        const getBase64 = (file: RcFile): Promise<string> =>
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = error => reject(error);
            });

        const handleChange: UploadProps['onChange'] = ({fileList: newFileList}) => {

            getBase64(fileList[0] as RcFile).then((result) =>{
                console.log("result",result);
            });


            setFileList(newFileList);
            const formData = new FormData();
            fileList.forEach(file => {
                formData.append('files[]', file as RcFile);
            });
            const file = newFileList[newFileList.length - 1];
            console.log("file", file);
            const url = file.url;
            console.log("url", url);
            let size = file.size;
            console.log("size", size);
            console.log("size", size);
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
                console.log("beforeUpload", file);
                const graphicsList = fileList;
                graphicsList.push(file);
                setFileList(graphicsList);
                return false;
            },
            fileList,
        };

        const onFinish = (values: any) => {
            console.log('Success:', values);
        };

        const onFinishFailed = (errorInfo: any) => {
            console.log('Failed:', errorInfo);
        };

        return (
            <Form
                name="basic"
                labelCol={{span: 4}}
                wrapperCol={{span: 16}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
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
                    <Input placeholder={"Please input name!"}/>
                </Form.Item>

                <Form.Item
                    label="Group"
                    name="group"
                >
                    <Select
                        mode="multiple"
                        placeholder="Please select the graphics group!"
                        // value={selectedItems}
                        // onChange={setSelectedItems}
                        showArrow={true}
                    >
                        {/*{FORMATS.map(item => (*/}
                        {/*    <Select.Option key={item} value={item}>*/}
                        {/*        {item}*/}
                        {/*    </Select.Option>*/}
                        {/*))}*/}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Keyword"
                    name="keyword"
                >
                    <Select
                        mode="multiple"
                        placeholder="Please select the graphics keyword!"
                        // value={selectedItems}
                        // onChange={setSelectedItems}
                        showArrow={true}
                    >
                        {/*{FORMATS.map(item => (*/}
                        {/*    <Select.Option key={item} value={item}>*/}
                        {/*        {item}*/}
                        {/*    </Select.Option>*/}
                        {/*))}*/}
                    </Select>
                </Form.Item>

                {/*<Form.Item wrapperCol={{offset: 8, span: 16}}>*/}
                {/*    <Button type="primary" htmlType="submit">*/}
                {/*        Submit*/}
                {/*    </Button>*/}
                {/*</Form.Item>*/}
            </Form>
        );
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div className={"graphic-dialog"}>
            <Modal title="New Graphics" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                {graphicsFrom()}
            </Modal>
        </div>
    );

}

export namespace GraphicDialogSpace {
    export interface Props {
    }
}

export default GraphicDialog;