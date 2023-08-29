import { Visual } from "../../src/visual";
import powerbiVisualsApi from "powerbi-visuals-api";
import IVisualPlugin = powerbiVisualsApi.visuals.plugins.IVisualPlugin;
import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions;
import DialogConstructorOptions = powerbiVisualsApi.extensibility.visual.DialogConstructorOptions;
var powerbiKey: any = "powerbi";
var powerbi: any = window[powerbiKey];
var testVisual4C57A0AA310B4FF8BF4FAF51B603BCF0_DEBUG: IVisualPlugin = {
    name: 'testVisual4C57A0AA310B4FF8BF4FAF51B603BCF0_DEBUG',
    displayName: 'testVisual',
    class: 'Visual',
    apiVersion: '3.8.0',
    create: (options: VisualConstructorOptions) => {
        if (Visual) {
            return new Visual(options);
        }
        throw 'Visual instance not found';
    },
    createModalDialog: (dialogId: string, options: DialogConstructorOptions, initialState: object) => {
        const dialogRegistry = globalThis.dialogRegistry;
        if (dialogId in dialogRegistry) {
            new dialogRegistry[dialogId](options, initialState);
        }
    },
    custom: true
};
if (typeof powerbi !== "undefined") {
    powerbi.visuals = powerbi.visuals || {};
    powerbi.visuals.plugins = powerbi.visuals.plugins || {};
    powerbi.visuals.plugins["testVisual4C57A0AA310B4FF8BF4FAF51B603BCF0_DEBUG"] = testVisual4C57A0AA310B4FF8BF4FAF51B603BCF0_DEBUG;
}
export default testVisual4C57A0AA310B4FF8BF4FAF51B603BCF0_DEBUG;