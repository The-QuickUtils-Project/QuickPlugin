/*
    Copyright 2024 The QuickUtils Project

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
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