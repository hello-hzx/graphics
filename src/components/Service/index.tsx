import Constant from "../Common/Constant";
import {nanoid} from 'nanoid'

export default class Service {
    static {
        // 预先存入group容器
        if (!localStorage.getItem(Constant.GROUP_KEY)) {
            const GROUP: any = [];
            localStorage.setItem(Constant.GROUP_KEY, JSON.stringify(GROUP));
        }

        // 预先存入graphics容器
        if (!localStorage.getItem(Constant.GRAPHICS_KEY)) {
            const GRAPHICS: any = [];
            localStorage.setItem(Constant.GRAPHICS_KEY, JSON.stringify(GRAPHICS));
        }
    }

    findByKey(key: string) {
        const Json = localStorage.getItem(key) || "";
        return JSON.parse(Json);
    }

    findGraphicsByKeyword(keyword: string) {
        const graphicsList = this.findByKey(Constant.GRAPHICS_KEY);
        if (!keyword) {
            return graphicsList;
        }

        const result:any = [];
        graphicsList.forEach((graphics: any) =>{
            if (graphics.name.includes(keyword)) {
                result.push(graphics);
            }
        })

        return result;
    }

    deleteGraphicsById(id: string) {
        const graphicsJson = localStorage.getItem(Constant.GRAPHICS_KEY) || "";
        const graphicsList = JSON.parse(graphicsJson);

        const findIndex = graphicsList.findIndex((graphics: any) => graphics.id === id);
        graphicsList.splice(findIndex, 1);

        localStorage.setItem(Constant.GRAPHICS_KEY, JSON.stringify(graphicsList));
    }

    saveGraphics(formData: any, graphicsBase64: any) {
        const graphicsJson = localStorage.getItem(Constant.GRAPHICS_KEY) || "";

        const graphicsList = JSON.parse(graphicsJson);

        const {name, groupId} = formData;
        const id = nanoid();
        graphicsList.push(
            {
                id: id,
                name: name,
                type: "png",
                base64Url: graphicsBase64,
                groupId: groupId,
            }
        );

        localStorage.setItem(Constant.GRAPHICS_KEY, JSON.stringify(graphicsList));
    }

    updateGraphics(formData: any, graphicsBase64: any) {
        const graphicsJson = localStorage.getItem(Constant.GRAPHICS_KEY) || "";
        const graphicsList = JSON.parse(graphicsJson);

        const {id, name, groupId} = formData;
        graphicsList.forEach((graphics: any) => {
            if (graphics.id === id) {
                graphics.name = name;
                graphics.groupId = groupId;
                graphics.base64Url = graphicsBase64;
            }
        });

        localStorage.setItem(Constant.GRAPHICS_KEY, JSON.stringify(graphicsList));
    }

    saveGroup(name: string) {
        const graphicsJson = localStorage.getItem(Constant.GROUP_KEY) || "";
        let groupList: any[] = JSON.parse(graphicsJson);

        const id = nanoid();
        groupList.push(
            {
                id: id,
                name,
            }
        );
        localStorage.setItem(Constant.GROUP_KEY, JSON.stringify(groupList));
    }

    deleteGroupById(id: string) {
        const groupJson = localStorage.getItem(Constant.GROUP_KEY) || "";
        const groupList = JSON.parse(groupJson);

        const findIndex = groupList.findIndex((group: any) => group.id === id);
        groupList.splice(findIndex, 1);

        // 同时删除group中的graphics
        const graphicsJson = localStorage.getItem(Constant.GRAPHICS_KEY) || "";
        const graphicsList = JSON.parse(graphicsJson);
        graphicsList.forEach((graphics: any) => {
            if (graphics.groupId == id) {
                this.deleteGraphicsById(graphics.id);
            }
        });

        localStorage.setItem(Constant.GROUP_KEY, JSON.stringify(groupList));
    }
}