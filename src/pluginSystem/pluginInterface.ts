export interface Plugin {
    name: string;
    execute(data: any): void;
    onInit?(): void;
    onDestroy?(): void;
    onBeforeCreateTodo?(): void|JSON|undefined;
    onAfterCreateTodo?(): void|JSON|undefined;
};
export interface PluginConfig {
    name: {
        [language: string]: string;
    };
    package: string;
    author: string;
    version: string;
    platform: string[];
    main: string;
};
export interface PluginReg {
    [packagename: string]: {
        enabled: boolean
    }
};
export interface SpecialPlugin {
    permissions: string[]
}
export interface SpecialPlugins {
    [packagename: string]: SpecialPlugin
}