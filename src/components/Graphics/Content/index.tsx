import {Collapse, Image, Checkbox, Dropdown, Menu} from 'antd';
import type {CheckboxChangeEvent} from 'antd/es/checkbox';
import React, {useState} from 'react';
import Service from "../../Service";
import Constant from "../../Common/Constant";
import PubSub from "pubsub-js";
import './index.css'
import DeleteGraphicDialog from "../DeleteGraphicsDialog";


function Content(props: ContentSpace.Props) {
    const {Panel} = Collapse;
    const service = new Service();
    const [groupList, setGroupList] = useState<any[]>([]);
    // 被操作的graphics的id
    const [operatedGraphicsId, setOperatedGraphicsId] = useState<number>(0);
    // let operatedGraphicsId: number = 0;
    // 操作类型
    // let isUpdate: boolean = true;

    // 右键操作graphics菜单
    const menu = (
        <Menu
            items={[
                {
                    label: '编辑',
                    key: '1',
                    onClick: () => {
                    },
                },
                {
                    label: '删除',
                    key: '2',
                    onClick: () => {
                        // 发布删除消息(弹出对话框)
                        PubSub.publish(Constant.DELETE_GRAPHIC_DIALOG_VISIBLE,
                            {isModalVisible: true});
                    },
                },
            ]}
        />
    );


    const populateContentData = () => {
        // 获取group
        const groupsJson = service.findByKey(Constant.GROUP_KEY);
        const groupList = JSON.parse(groupsJson);
        // 获取graphics
        const graphicsJson = service.findByKey(Constant.GRAPHICS_KEY);
        const graphicsList = JSON.parse(graphicsJson);

        const populatedGroupList = [];
        const ungroupedGraphics = {id: 0, name: "ungrouped", graphicsList: []}; // 未分组的graphics存到这组
        for (let graphics of graphicsList) {
            const {groupId} = graphics;

            if (groupId <= 0) {
                continue;
            }

            for (let group of groupList) {
                if (group.id === groupId) {
                    if (!group.graphicsList) {
                        group.graphicsList = [];
                    }
                    group.graphicsList.push(graphics);
                    break;
                }
            }

            // const group = groupList.find((group: any) => group.id === groupId);
            // if (!group.graphicsList) {
            //     group.graphicsList = [];
            // }
            // group.graphicsList.push(graphics);


        }
        return groupList;
    }

    React.useEffect(() => {
        // 填充groupList
        setGroupList(populateContentData());

        // 确认删除graphics事件
        const okDeleteToken = PubSub.subscribe(Constant.CONFIRM_DELETE_GRAPHIC, () => {
            console.log("operatedGraphicsId", operatedGraphicsId);
            service.deleteGraphicsById(operatedGraphicsId);
            setGroupList(populateContentData());
        });

        return () => {
            PubSub.unsubscribe(okDeleteToken);
        }
    }, [operatedGraphicsId]);


    // graphics 被选中后回调
    const graphicsSelected = (e: CheckboxChangeEvent) => {
        // console.log(`checked = ${e.target.checked}`);
    };

    // graphics 被右键后调用，用于收集被点击的graphics的id
    const onGraphicsContextMenu = (graphicsId: number) => {
        return () => {
            setOperatedGraphicsId(graphicsId);
        }
    };

    // 切换面板的调用
    const onChangePanel = (key: string | string[]) => {
        // console.log(key);
    };

    return (
        <div className={"content"}>
            <Collapse onChange={onChangePanel}>
                {
                    groupList.map(group => {
                        return (
                            <Panel header={group.name} key={group.name}>
                                {
                                    !group.graphicsList
                                        ? null
                                        : group.graphicsList.map((graphics: any) => {
                                            return (
                                                <span
                                                    className={"graphics-item"}
                                                    key={graphics.id}
                                                >
                                                    {/*<Checkbox onChange={graphicsSelected}></Checkbox>*/}
                                                    <Dropdown
                                                        overlay={menu}
                                                        trigger={['contextMenu']}
                                                    >
                                                        <div
                                                            className="site-dropdown-context-menu"
                                                            onContextMenu={onGraphicsContextMenu(graphics.id)}
                                                        >
                                                          <Image className={"graphic"}
                                                                 width={170}
                                                                 preview={false}
                                                                 src={graphics.url}
                                                          />
                                                        </div>
                                                      </Dropdown>

                                                    <p className={"graphic-name"}>
                                                        {graphics.name}
                                                    </p>
                                                </span>
                                            );
                                        })
                                }
                            </Panel>
                        )
                    })
                }
            </Collapse>
            <DeleteGraphicDialog/>
        </div>
    );

}

export namespace ContentSpace {
    export interface Props {
    }
}

export default Content;