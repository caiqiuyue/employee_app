/** @format */

import {AppRegistry, AsyncStorage} from 'react-native';
import {name as appName} from './app.json';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from './app/components/store/ConfigureStore';
import Root from './app/route';
// import Root from './app/main/Login/Login';
import Storage from "react-native-storage";
import CodePush from "react-native-code-push";
import * as wechat from 'react-native-wechat'
global.storage = new Storage({
    // 最大容量，默认值1000条数据循环存储
    size: 1000,
    // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
    // 如果不指定则数据只会保存在内存中，重启后即丢失
    storageBackend: AsyncStorage,
    // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
    defaultExpires: null,
    // 读写时在内存中缓存数据。默认启用。
    enableCache: true,
});
import JPushModule from 'jpush-react-native'

const store = configureStore();
class App extends Component {


    componentDidMount (){
        wechat.registerApp('wxb18705864a8c94ad');
        CodePush.sync();
        CodePush.allowRestart();//在加载完了可以允许重启

        JPushModule.initPush();
    }

    render() {
        return (
            <Provider store={store}>
                <Root />
            </Provider>
        )
    }
}

AppRegistry.registerComponent('shanzhu', () => App);



