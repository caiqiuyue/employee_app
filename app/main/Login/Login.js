
import React, { Component } from 'react';
import {
    DeviceEventEmitter, StyleSheet, Dimensions, Text, View, TouchableHighlight, AsyncStorage, Image, TextInput,
    Platform, Keyboard,ScrollView
} from 'react-native';
import { List, InputItem,  WingBlank, Toast,Button } from 'antd-mobile';
import axios from 'axios'
import initReactFastclick from 'react-fastclick';
// import Dimensions from 'Dimensions';
initReactFastclick();

import JPushModule from 'jpush-react-native'

import loginCss from './style/loginCss'

import lockIcon from './style/lockIcon.png'
import phoneIcon from './style/phoneIcon.png'
import eye_close from './style/eye_close.png'
import eye_open from './style/eye_open.png'
import bg from './style/bg.png'
import {ifIphoneX} from "react-native-iphone-x-helper/index";
import LinearGradient from 'react-native-linear-gradient';


export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            password: '',
            phoneType: false,
            passwordType: false,
            url:"",
            passwordT:true,
            passwordFlag:false,
            registrationId:null,
            hei:Dimensions.get('window').height,
        };
    }


    //密码可见
    changePasswordType=()=>{
        let {passwordFlag} = this.state;
        this.setState({
            passwordFlag:!passwordFlag
        })

        if(!passwordFlag){
            this.setState({
                passwordT:false
            })

        }else {
            this.setState({
                passwordT:true
            })
        }
    };



    focus=()=>{

        this.setState({
            hei:Dimensions.get('window').height+(Dimensions.get('window').height/2),
        })


    }


    componentWillMount(){


        
        console.log(this.props,'this.props');

        JPushModule.getRegistrationID(id =>{
            let registrationId = id;
            this.setState({
                registrationId
            })

        });


        //读取
        storage.load({
            key: 'url',
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: false
        }).then(ret => {
            this.setState({
                url:ret.url
            })
        }).catch(err => {
            //如果没有找到数据且没有sync方法，
            //或者有其他异常，则在catch中返回
            console.warn(err.message);
            switch (err.name) {
                case 'NotFoundError':
                    break;
                case 'ExpiredError':
                    break;
            }
        });
    }




    //账号输入
    handlePhoneChange = (value) => {

        this.setState({
            phone: value,

        });
    }

    

    //密码输入
    handlePasswordChange = (value) => {

        this.setState({
            password: value,

        });
    }

   

    //提交
    handleSubmit = () => {

        const { phone, password,url } = this.state;

        if(phone.trim()==''){
            Toast.info('手机号不能为空',1);
            return
        }else if(password.trim()==''){
            Toast.info('密码不能为空',1);
            return
        }else{
            const { navigate, Reset } = this.props.navigation;

            //这里发送Ajax
            axios.post(`${url}/employee/login`, {
                loginId: this.state.phone,
                password: this.state.password,
                registrationId:this.state.registrationId
            })
                .then(function (response) {
                    console.log(response);

                    if(response.data.code==1){
                        Toast.info(response.data.message, 1);
                    } else {

                        let data = JSON.parse(response.data.data);


                        let tokenKey = {
                            tokenKey:response.data.tokenKey
                        };

                        let username = data;


                        //设置storage
                        storage.save({
                            key: 'tokenKey',  // 注意:请不要在key中使用_下划线符号!
                            //data是你想要存储在本地的storage变量，这里的data只是一个示例。如果你想存一个叫item的对象，那么可以data: item，这样使用
                            data:tokenKey,
                            // 如果不指定过期时间，则会使用defaultExpires参数
                            // 如果设为null，则永不过期
                            expires: null
                        });

                        //设置storage
                        storage.save({
                            key: 'username',  // 注意:请不要在key中使用_下划线符号!
                            //data是你想要存储在本地的storage变量，这里的data只是一个示例。如果你想存一个叫item的对象，那么可以data: item，这样使用
                            data:username,
                            // 如果不指定过期时间，则会使用defaultExpires参数
                            // 如果设为null，则永不过期
                            expires: null
                        });



                        //跳转页面
                        navigate('Home',{ user: "" });

                        Reset();


                    }

                })
                .catch(function (error) {
                    console.log(error);
                });
        }

    };



    render() {
        const {hei,phone, password, phoneType, passwordType ,passwordT,passwordFlag} = this.state;
        return (
            <ScrollView style={{}}>

                <View style={{height: hei,}}>

                    <View style={{}}>
                        <Image
                            source={bg}
                            style={{height:(Dimensions.get('window').height/2-50),width: Dimensions.get('window').width, resizeMode:"stretch"}}
                            alt=""

                        />
                    </View>

                    <View style={{alignItems:"center",width:"100%",zIndex:999,position:"absolute",top:(Dimensions.get('window').height/3)}}>


                        <View style={{width:"90%",backgroundColor:"#fff",padding:30,borderRadius:10,}}>
                            <View style={{marginTop:20}}>

                                <View style={{flexDirection:"row",padding:5,borderColor:"#f0f0f0",borderWidth:1,borderRadius:20,backgroundColor:"#f0f0f0"}}>
                                    <View style={{justifyContent:'center',}}><Image source={phoneIcon} style={styles.iconImg}/></View>
                                    <View style={{justifyContent:'center',alignItems:"center",marginLeft:15}}>
                                        <TextInput

                                            placeholder="账号"
                                            style={{minWidth:300,padding:5}}
                                            onFocus={this.focus}
                                            underlineColorAndroid="transparent"
                                            onChangeText={(phone) => this.handlePhoneChange(phone)}
                                        >
                                        </TextInput>
                                    </View>

                                </View>


                                <View style={{marginTop:10,flexDirection:"row",padding:5,borderColor:"#f0f0f0",borderWidth:1,borderRadius:20,backgroundColor:"#f0f0f0"}}>
                                    <View style={{justifyContent:'center',}}><Image source={lockIcon} style={styles.iconImg}/></View>
                                    <View style={{justifyContent:'center',marginLeft:15,flex:1}}>
                                        <TextInput
                                            placeholder="请输入密码"
                                            style={{minWidth:300,padding:5}}
                                            secureTextEntry={passwordT?true:false}
                                            underlineColorAndroid="transparent"
                                            onFocus={this.focus}
                                            onChangeText={(passwordType) => this.handlePasswordChange(passwordType)}
                                        >
                                        </TextInput>
                                    </View>

                                    <TouchableHighlight underlayColor="transparent" onPress={this.changePasswordType} style={{marginRight:20,justifyContent:"center"}}>
                                        <View>
                                            <Image source={passwordFlag ? eye_open : eye_close} style={styles.iconImg}/>
                                        </View>
                                    </TouchableHighlight>

                                </View>


                            </View>

                            <LinearGradient colors={['#00adfb', '#00618e']} style={{borderRadius:5,marginTop:30,marginBottom:20}}>
                                <TouchableHighlight
                                    style={{padding:10,alignItems:"center"}}
                                    underlayColor="transparent"
                                    onPress={this.handleSubmit}
                                >
                                    <Text style={{color:"#fff",fontSize:16,fontWeight:"bold"}}>登陆</Text>
                                </TouchableHighlight>
                            </LinearGradient>
                        </View>




                    </View>



                </View>


            </ScrollView>

        );
    }
}


const styles = StyleSheet.create(loginCss);