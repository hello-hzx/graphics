import {Collapse, Image, Dropdown, Menu} from 'antd';
import React, {useState} from 'react';
import PubSub from "pubsub-js";
import DeleteGraphicDialog from "../DeleteGraphicsDialog";
import Service from "../../Service";
import Constant from "../../Common/Constant";
import './index.css'


const Content = () => {
    const {Panel} = Collapse;
    const service = new Service();
    const [groupList, setGroupList] = useState<any[]>([]);
    // 被操作的graphics
    const [operatedGraphics, setOperatedGraphics] = useState<any>(null);
    // 被操作的元素类型，graphics或group
    const [operatedElement, setOperatedElement] = useState<any>("");
    const [keyword, setKeyword] = useState("");


    const addGraphicsToGroup = () => {
        // 获取groupList, graphicsList
        const groupList = service.findByKey(Constant.GROUP_KEY);
        // const graphicsList = service.findByKey(Constant.GRAPHICS_KEY);
        const graphicsList = service.findGraphicsByKeyword(keyword);

        // 发布groupList的信息，用于newGraphics
        PubSub.publish(Constant.GROUP_LIST_DATA, {groupList: groupList});
        // 没有graphics
        if (!graphicsList.length) {
            return groupList;
        }

        // 未分组的graphics存到这组
        const ungroupedGraphics: any = {
            id: Constant.UNGROUPED_GRAPHICS_ID,
            name: Constant.UNGROUPED_GRAPHICS_NAME,
            graphicsList: []
        };
        for (let graphics of graphicsList) {
            const {groupId} = graphics;
            const group = groupList.find((group: any) => group.id === groupId);

            // 未分组
            if (!group) {
                ungroupedGraphics.graphicsList.push(graphics);
                continue;
            }

            if (!group.graphicsList) {
                group.graphicsList = [];
            }
            group.graphicsList.push(graphics);
        }

        return groupList;
    };

    React.useEffect(() => {
        // 填充groupList
        setGroupList(addGraphicsToGroup());

        // 确认删除graphics事件
        const okDeleteToken = PubSub.subscribe(Constant.CONFIRM_DELETE_GRAPHIC, () => {
            if (operatedElement === "group") {
                service.deleteGroupById(operatedGraphics.id);
            } else {
                service.deleteGraphicsById(operatedGraphics.id);
            }
            setGroupList(addGraphicsToGroup());
        });

        // 确认新建或更新graphics
        const okGraphicsToken = PubSub.subscribe(Constant.SAVE_OR_UPDATE_GRAPHICS, (_, data) => {
            const {graphicsBase64, formData} = data;
            const {id} = formData;

            if (id) {  // 更新
                service.updateGraphics(formData, graphicsBase64);
            } else {
                service.saveGraphics(formData, graphicsBase64);
            }
            setGroupList(addGraphicsToGroup());
        });

        // 确认新建或更新group
        const okGroupToken = PubSub.subscribe(Constant.SAVE_OR_UPDATE_GROUP, (_, data) => {
            const {group: {id, name}} = data;

            if (id) {
                // TODO 更新
            } else {
                service.saveGroup(name);
            }

            setGroupList(addGraphicsToGroup());
        });

        // search graphics
        const searchGraphicsToken = PubSub.subscribe(Constant.SEARCH_GRAPHIC, (_, data) => {
            const {keyword} = data;
            setKeyword(keyword);
            setGroupList(addGraphicsToGroup());
        });

        return () => {
            PubSub.unsubscribe(okDeleteToken);
            PubSub.unsubscribe(okGraphicsToken);
            PubSub.unsubscribe(okGroupToken);
            PubSub.unsubscribe(searchGraphicsToken);
        }
    }, [operatedGraphics, keyword]);

    // graphics 被右键后调用，用于收集被点击的graphics
    const onGraphicsContextMenu = (graphics: any, type: string) => {
        return () => {
            setOperatedElement(type);
            setOperatedGraphics(graphics);
        }
    };

    // 右键操作graphics菜单
    const menu = (
        <Menu
            items={[
                {
                    label: '编辑',
                    key: '1',
                    onClick: () => {
                        // 发布编辑graphics消息(弹出对话框)
                        PubSub.publish(Constant.GRAPHIC_DIALOG_VISIBLE, {
                            isModalVisible: true,
                            graphics: operatedGraphics,

                        });
                    },
                },
                {
                    label: '删除',
                    key: '2',
                    onClick: () => {
                        // 发布删除消息(弹出对话框)
                        PubSub.publish(Constant.DELETE_GRAPHIC_DIALOG_VISIBLE,
                            {isModalVisible: true, operatedType: operatedElement});
                    },
                },
            ]}
        />
    );

    return (
        <div className={"content"}>
            <Collapse>
                {
                    groupList.map(group => {
                        return (
                            <Panel
                                // header={group.name}
                                header={(
                                    <Dropdown
                                        overlay={menu}
                                        trigger={['contextMenu']}
                                    >
                                        <div
                                            className={"group-name-area"}
                                            onContextMenu={onGraphicsContextMenu(group, "group")}
                                        >{group.name}</div>
                                    </Dropdown>
                                )}
                                key={group.name}
                                className={"site-collapse-custom-panel"}
                            >
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
                                                            onContextMenu={onGraphicsContextMenu(graphics, "graphics")}
                                                        >
                                                          <Image className={"graphic"}
                                                                 width={170}
                                                                 height={160}
                                                                 preview={false}
                                                                 src={graphics.base64Url}
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

export default Content;