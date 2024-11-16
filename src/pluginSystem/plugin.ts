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
import { Plugin, PluginConfig, PluginReg, SpecialPlugins } from './pluginInterface';
import * as fs from 'fs';
import * as path from 'path';

export class PluginLoader {
    public common_plugins: Plugin[] = [];
    private special_plugins: SpecialPlugins = {};

    // 加载插件并调用初始化钩子
    public loadPluginsFromDirectory(directory: string, platform: string): void {
        /*const pluginFiles = fs.readdirSync(directory);

        pluginFiles.forEach(file => {
            const pluginPath = path.resolve(directory, file);
            const pluginModule = require(pluginPath);
            const plugin: Plugin = new pluginModule.default();
            
            this.registerPlugin(plugin);
        });
        */
        const pluginsJsonPath = path.resolve(directory, 'plugins.json');
        if (!fs.existsSync(pluginsJsonPath)) {
            console.error(`未找到插件注册文件: ${pluginsJsonPath}`);
            return;
        }

        const pluginsConfig = JSON.parse(fs.readFileSync(pluginsJsonPath, 'utf-8')) as PluginReg;
        
        Object.entries(pluginsConfig).forEach(([pluginName, reg]) => {
            console.log(`Plugin: ${pluginName}, Enabled: ${reg.enabled}`);
            if (reg.enabled) {
                const pluginDir = path.resolve(directory, pluginName);
                const pluginConfigPath = path.resolve(pluginDir, 'plugin.json');

                if (!fs.existsSync(pluginConfigPath)) {
                    console.error(`未找到插件配置文件: ${pluginConfigPath}`);
                    return;
                }

                // 读取 plugin.json
                const pluginConfig = JSON.parse(fs.readFileSync(pluginConfigPath, 'utf-8')) as PluginConfig;
                if (!pluginConfig.platform.includes(platform)){
                    console.error(`插件不支持指定的平台: ${platform}`);
                    return;
                }
                const pluginEntryPath = path.resolve(pluginDir, 'platform', platform, 'plugin.ts');

                if (!fs.existsSync(pluginEntryPath)) {
                    console.error(`未找到插件入口文件: ${pluginEntryPath}`);
                    return;
                }

                // 动态加载插件
                const pluginModule = require(pluginEntryPath);
                const plugin: Plugin = new pluginModule.default();

                this.registerPlugin(plugin);
            }
        });

        // 遍历插件包名列表
        /*
        pluginsConfig.forEach((pluginName: string) => {
            const pluginDir = path.resolve(directory, pluginName);
            const pluginConfigPath = path.resolve(pluginDir, 'plugin.json');

            if (!fs.existsSync(pluginConfigPath)) {
                console.error(`未找到插件配置文件: ${pluginConfigPath}`);
                return;
            }

            // 读取 plugin.json
            const pluginConfig = JSON.parse(fs.readFileSync(pluginConfigPath, 'utf-8')) as PluginConfig;
            if (!pluginConfig.platform.includes(platform)){
                console.error(`插件不支持指定的平台: ${platform}`);
                return;
            }
            const pluginEntryPath = path.resolve(pluginDir, 'platform', platform, 'plugin.ts');

            if (!fs.existsSync(pluginEntryPath)) {
                console.error(`未找到插件入口文件: ${pluginEntryPath}`);
                return;
            }

            // 动态加载插件
            const pluginModule = require(pluginEntryPath);
            const plugin: Plugin = new pluginModule.default();

            this.registerPlugin(plugin);
        });
        */
    }

    // 注册插件并调用 onInit 钩子
    public registerPlugin(plugin: Plugin): void {
        console.log(`注册插件: ${plugin.name}`);
        this.common_plugins.push(plugin);

        if (plugin.onInit) {
            plugin.onInit(); // 调用初始化钩子
        }
    }

    // 卸载所有插件并调用 onDestroy 钩子
    public unloadPlugins(): void {
        this.common_plugins.forEach(plugin => {
            if (plugin.onDestroy) {
                plugin.onDestroy(); // 调用清理钩子
            }
        });

        this.common_plugins = [];
    }

    // 执行所有插件
    public executePlugins(data: any): void {
        this.common_plugins.forEach(plugin => plugin.execute(data));
    }
}
