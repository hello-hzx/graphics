import Constant from "../Common/Constant";

export default class Service {
    static {
        // 预先存入group
        if (!localStorage.getItem(Constant.GROUP_KEY)) {
            const GROUP = [{id: 1, name: "group1"}, {id: 2, name: "group2"}];
            localStorage.setItem(Constant.GROUP_KEY, JSON.stringify(GROUP));
        }

        // 预先存入graphics
        if (!localStorage.getItem(Constant.GRAPHICS_KEY)) {
            const GRAPHICS = [
                {
                    id: 1, name: "graphics1", type: "png",
                    url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
                    groupId: 1
                },
                {
                    id: 2, name: "graphics1", type: "png",
                    url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
                    groupId: 1
                }
            ];
            localStorage.setItem(Constant.GRAPHICS_KEY, JSON.stringify(GRAPHICS));
        }
    }

    public findByKey(key: string) {
        return localStorage.getItem(key) || "";
    }

    public deleteGraphicsById(id: number) {
        const graphicsJson = localStorage.getItem(Constant.GRAPHICS_KEY) || "";
        const graphicsList = JSON.parse(graphicsJson);

        for (let i in graphicsList) {
            if (graphicsList[i].id === id) {
                graphicsList.splice(i, 1);
                break;
            }
        }
        console.log("deleteGraphicsById graphicsList", graphicsList);
        localStorage.setItem(Constant.GRAPHICS_KEY, JSON.stringify(graphicsList));
    }
}