/**
 * 欢迎页
 * @flow
 * **/
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    AsyncStorage,Dimensions,
    Platform

} from 'react-native';
// import Dimensions from 'Dimensions';
import welcome from '../images/welcome.png';
export default class WelcomePage extends Component {


    constructor(props) {
        super(props);
    }

    componentWillMount(){
        // this.props.navigation.getParam = (name) => {
        //     let params = this.props.navigation && this.props.navigation.state && this.props.navigation.state.params || {};
        //     if(name) {
        //         return params[name];
        //     }
        //     return params;
        // }
    }

    componentDidMount() {


        const { navigate } = this.props.navigation;
        global.getNavigate = navigate;


        //读取
        storage.load({
            key: 'tokenKey',
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: false
        }).then(ret => {
            console.log(1111111);
            if(ret.tokenKey){
                this.timer = setTimeout(() => {
                    navigate('Home',{ user: '' })
                }, 1000);

            }else {
                this.timer = setTimeout(() => {
                    navigate('Login',{ user: '' })
                }, 1000);
            }



        }).catch(err => {
            //如果没有找到数据且没有sync方法，
            //或者有其他异常，则在catch中返回
            console.log(33333);
            this.timer = setTimeout(() => {
                navigate('Login',{ user: '' })
            }, 1000);
        });



    }

    componentWillMount(){

        let url = {
            url : "https://www.fangapo.cn/api"
        }
        //设置storage
        storage.save({
            key: 'url',  // 注意:请不要在key中使用_下划线符号!
            //data是你想要存储在本地的storage变量，这里的data只是一个示例。如果你想存一个叫item的对象，那么可以data: item，这样使用
            data:url,
            // 如果不指定过期时间，则会使用defaultExpires参数
            // 如果设为null，则永不过期
            expires: null
        });
    }

    componentWillUnmount() {
        this.timer &&  (this.timer);
    }

    render() {
        return (
            <View>

                <View style={styles.container}>
                    {<Image style={{resizeMode:"stretch",width: Dimensions.get('window').width,
                        height: Dimensions.get('window').height}} source={welcome}/>}
                </View>


            </View>
        );
    }

}

const styles = StyleSheet.create({
    container:{
        //flex:1,
    }
})