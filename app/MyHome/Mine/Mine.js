import React,{Component} from 'react';
import {View,DeviceEventEmitter, Text, TouchableHighlight, Image, ScrollView, StyleSheet,Platform} from 'react-native';

import Dimensions from "Dimensions";
import man from "./style/man.png";
import right from "./style/right.png";
import preferential from "./style/preferential.png";
import meterReading from "./style/meterReading.png";
import searchRoom from "./style/checkout.png";
import approval from "./style/approval.png";
import mineTop from "./style/mineTop.png";

import LinearGradient from 'react-native-linear-gradient';

export default class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            userInfo:{}
        }

    }

    componentWillMount(){
        storage.load({ //读取tokenKey
            key: 'username',
            autoSync: false
        }).then(ret => {
                console.log(ret);
                this.setState({
                    userInfo:ret
                })

            }
        ).catch(
            (error) => {
                reject(error);
            })
    }




    //退出登陆
    logOut=()=>{

        storage.remove({
            key: 'tokenKey'
        });

        storage.remove({
            key: 'username'
        });

        clearInterval(global.stopMsgTime);

        // storage.clearMapForKey('tokenKey');
        // storage.clearMapForKey('username');

        storage.remove({
            key: 'username'
        });

        const { navigate } = this.props.navigation;

        global.tokenKey='';

        navigate('Login',{ user: '' })



    };

  //优惠券发放
  preferential=()=>{


    const { navigate } = this.props.navigation;

    navigate('Preferential',{ user: '' })



  };

  //审批中心
    approval=()=>{


    const { navigate } = this.props.navigation;

    navigate('Approval',{ user: '' })



    };

    //移动抄表
    meterReading=()=>{

        const { navigate } = this.props.navigation;
        navigate('MeterReading',{ user: '' })

    };

    //退房查房
    searchRoom=()=>{
        const { navigate } = this.props.navigation;
        navigate('SearchRoom',{ user: '' })
    };





    render(){


        return (

            <View style={{height:Dimensions.get("window").height}}>


                <View>

                    <View>
                        <Image source={mineTop} style={{height:120,width:Dimensions.get('window').width,resizeMode:"stretch"}} />
                    </View>


                    <View style={{paddingBottom:5,flexDirection:"row",position:"absolute",zIndex:99,top:30}}>

                        <View style={{marginLeft:10,justifyContent:"center"}}>
                            <View style={{height:70,width:70,borderRadius:35,overflow:"hidden",alignItems:"center"}}>
                                <Image style={{height:70,width:70,}} source={man}/>
                            </View>
                        </View>

                        <View style={{flex:2,marginLeft:10,justifyContent:"center"}}>


                            <View  style={{flexDirection:"row"}}>
                                <Text style={{marginRight:50}}>{this.state.userInfo.realName}</Text>

                            </View>
                            <View style={{marginTop:10}}>
                                <Text style={{}}>{this.state.userInfo.phone}</Text>
                            </View>
                        </View>

                    </View>
                </View>


                <TouchableHighlight onPress={this.preferential} underlayColor="#f0f0f0">
                    <View style={styles.aa}>
                        <View style={styles.imgView}><Image style={styles.img3} source={preferential}/></View>
                        <Text>优惠券发放</Text>
                        <View style={{flex:1}}></View>
                        <View>
                            <Image style={styles.img2} source={right}/>
                        </View>
                    </View>
                </TouchableHighlight>



                <TouchableHighlight onPress={this.meterReading} underlayColor="#f0f0f0">
                    <View style={styles.aa}>
                        <View style={styles.imgView}><Image style={styles.img3} source={meterReading}/></View>
                        <Text>移动抄表</Text>
                        <View style={{flex:1}}></View>
                        <View>
                            <Image style={styles.img2} source={right}/>
                        </View>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight onPress={this.searchRoom} underlayColor="#f0f0f0">
                    <View style={styles.aa}>
                        <View style={styles.imgView}><Image style={styles.img3} source={searchRoom}/></View>
                        <Text>退房查房</Text>
                        <View style={{flex:1}}></View>
                        <View>
                            <Image style={styles.img2} source={right}/>
                        </View>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={this.approval} underlayColor="#f0f0f0">
                    <View style={styles.aa}>
                        <View style={styles.imgView}><Image style={styles.img3} source={approval}/></View>
                        <Text>审批中心</Text>
                        <View style={{flex:1}}></View>
                        <View>
                            <Image style={styles.img2} source={right}/>
                        </View>
                    </View>
                </TouchableHighlight>

                <View style={{alignItems:"center",marginTop:30}}>
                    <LinearGradient colors={['#00adfb', '#00618e']} style={{width:'80%',borderRadius:5}}>
                        <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                            alignItems:"center"
                        }} onPress={this.logOut }>
                            <Text
                                style={{fontSize:16,textAlign:"center",color:"#fff"}}>
                                退出
                            </Text>
                        </TouchableHighlight>
                    </LinearGradient>
                </View>
            </View>

        )

    }
}


const styles = StyleSheet.create({
    img: {
        height:16,
        width:16,
    },

    img2: {
        height:12,
        width:12
    },

    img3: {
        height:20,
        width:20
    },

    imgView:{
        marginRight:10,

        width:21,
        alignItems:'center'

    },

    aa:{
        borderColor:"#a3b9ce",
        borderWidth:1,
        flexDirection:"row",
        backgroundColor:"#fff",
        padding:10,
        // borderRadius:10,
        alignItems:"center"
    }


});
