import React,{Component} from 'react';
import {
    View, Text, TouchableHighlight, Image, StyleSheet, Platform, FlatList, Dimensions,
    DeviceEventEmitter
} from 'react-native';

import axios from "../../axios";
import moment from "moment/moment";
import JPushModule from 'jpush-react-native'
import {Toast} from 'antd-mobile'
import topBg from "../HomePage/style/topBg.png";

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getData} from "../../components/active/reducer";

import read from './style/read.png'
import unread from './style/unread.png'
import Order from "../Order/Order";
import LinearGradient from 'react-native-linear-gradient';

const setDate = (date) => {

    let a = 1000*60;//分钟
    let b = 1000*60*60;//小时

    let newDate = new Date();
    let num = moment(newDate).valueOf() - moment(date).valueOf();

    if(num / a < 60){

        return(`${Math.round(num/a)}分钟前`)

    }else if(num / b < 24){

        return(`${Math.round(num/b)}小时前`)

    }else if(moment(num).dayOfYear() < 10){

        return(`${moment(num).dayOfYear()}天前`)

    }else {

        return moment(date).format('YYYY-MM-DD');
    }


};


class ReadMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            refreshing: false,
            handelMsg:[
                {
                    value:"未读消息",
                    flag:true
                },

                {
                    value:"已读消息",
                    flag:false
                },

            ],
            changeMsg:"未读消息",
            unreadData:[],
            readData:[],
            aa:false
        };

        this.type = 1

    }

    componentWillMount(){
        if(Platform.OS === 'ios'){
            JPushModule.setBadge(0, (badgeNumber) => {
                console.log(badgeNumber)
            });
        }

        axios.post(`/empMsg/getMyMsg`, {
        })
            .then( (response)=> {
                console.log(response,'componentWillMount获取消息');

                this.setState({
                    aa:true
                },()=>{
                    if(response.data.code==0){
                        this.setState({
                            unreadData:response.data.unreadList&&response.data.unreadList,
                            readData:response.data.readList&&response.data.readList
                        })
                    }
                })



            })
            .catch(function (error) {
                console.log(error);
            });
    }




    // componentWillReceiveProps(newProps){
    //     console.log(newProps, '222313123123123123123123123');
    //     const reduxData = newProps.reduxData;
    //     this.setState({
    //         dataSource:reduxData.unread,
    //         readData:reduxData.read,
    //         unreadData:reduxData.unread
    //     })
    // }



    //选择状态
    handelMsg=(item)=>{

        let {handelMsg} = this.state;

        handelMsg.map((_item)=>{
            if(_item.value==item.value){
                _item.flag=true;
            }else {
                _item.flag = false
            }

        })

        this.setState({
            handelMsg,
            changeMsg:item.value
        },()=>{
            if(item.value=='未读消息'){


                // this.getOrderList()

            }


            if(item.value=='已读消息'){
                // if(!this.state.yudingState){
                //
                // }

                // this.getCheckinList();

            }
        })

    }

    //点击标为已读
    messageBtn = (item)=>{

        axios.post(`/empMsg/updateMyMsg`, {
            id:item.id
        })
            .then( (response)=> {
                console.log(response);
                this.getMyMsg()
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    getMyMsg=()=>{


        this.setState({
            refreshing:false
        })

        axios.post(`/empMsg/getMyMsg`, {
        })
            .then( (response)=> {
                console.log(response,'获取消息');

                if(response.data.code==0){

                    let unread = response.data.unreadList;

                    this.props.getData(unread);

                    this.setState({
                        unreadData:response.data.unreadList&&response.data.unreadList,
                        readData:response.data.readList&&response.data.readList
                    })
                }else if(response.data.code==1){
                    Toast.info(response.data.message,1)
                }

            })
            .catch(function (error) {
                console.log(error);
            });
    }

    //下拉刷新
    onRefresh = () => {

        this.setState({
            refreshing: true
        },()=>{
           this.getMyMsg()
        });


        

    };



    jumptoBtn = (item) => {

        const { navigate } = this.props.navigation;

        if(item.sendParam== "booking_reminder"){
            navigate('Order',{ user: item.sendParam });
        }




        

    };




    render(){

        let {handelMsg,changeMsg,unreadData,readData,refreshing,} = this.state;


        return (

            <View style={{height: Dimensions.get("window").height,backgroundColor:"#fff"}}>

                <View>
                    <Image source={topBg} style={{height:70,width:Dimensions.get('window').width,resizeMode:"stretch"}} />
                </View>

                <View style={{borderTopColor:"#7ebef9",borderTopWidth:1,flexDirection:"row",justifyContent:"space-around"}}>
                    {
                        handelMsg.map((item,index)=>

                            <LinearGradient key={index} colors={[!item.flag?'#00adfb':"#fff", !item.flag?'#00618e':"#fff"]} style={{width:"50%",}}>
                                <TouchableHighlight   onPress={()=>this.handelMsg(item)} style={{padding:10,alignItems:"center",
                                    // backgroundColor:!item.flag?"#f6f8fa":"#fff",
                                    borderBottomWidth:1,
                                    borderBottomColor:"#7ebef9",
                                }} underlayColor="transparent" >

                                    <Text style={{color:!item.flag?"#fff":"#00adfb",fontWeight:"bold"}}>{item.value}</Text>
                                </TouchableHighlight>
                            </LinearGradient>
                        )
                    }
                </View>


                {
                    changeMsg=='未读消息'?
                        <View>
                            <View style={{height: Dimensions.get("window").height-130,padding:10}}>
                                <FlatList
                                    data={unreadData}  //列表的渲染数据源
                                    ListEmptyComponent={()=><View style={{marginTop:30,alignItems:"center"}}><Text>{this.state.aa?'暂无未读消息':'获取消息数据中'}</Text></View>} //列表没有数据时展示，箭头函数中可以写一个react组件
                                    getItemLayout={(data, index) => ( {length: 80, offset: 80 * index, index} )}
                                    initialNumToRender={10}  //首次渲染的条数
                                    // onEndReached={this.onEndReached}  //列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
                                    onEndReachedThreshold={0.1} //定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                                    onRefresh={this.onRefresh} //下拉刷新
                                    refreshing={refreshing} //下拉刷新时候的正在加载的符号，设置为true显示，false隐藏。加载完成，需要设置为false
                                    keyExtractor={(item,index)=>`${index}`}
                                    renderItem={({item}) => (  //渲染列表的方式

                                        <View>
                                            <View style={{flexDirection:"row",backgroundColor:"#f6f8fa",marginBottom:5}}>

                                                <View style={{flex:1,alignItems:"center",justifyContent:"center",paddingLeft:10,paddingRight:10,marginTop:10,marginBottom:10,borderRightColor:"#e7e9ea",borderRightWidth:1}}>
                                                    <View  style={{alignItems:"center",flexDirection:"row",marginLeft:0}}>
                                                        <Image style={{height:20,width:20,marginRight:5}}
                                                               source={unread}/>
                                                        <Text style={{fontSize:14}}>{item.sendTitle}</Text>
                                                    </View>

                                                    <Text style={{marginTop:5,color:"grey"}}>{setDate(item.createTime)}</Text>

                                                </View>



                                                <View style={{flex:2,marginLeft:15,justifyContent:"center",padding:10}}>

                                                    <TouchableHighlight
                                                        underlayColor="#f0f0f0" onPress={()=>this.jumptoBtn(item)}
                                                    >
                                                        <Text style={{color:"grey"}}>{item.sendContent}
                                                        <Text style={{textDecorationLine:'underline',color:"#f17e3a"}}>点击查看详情</Text>
                                                        </Text>
                                                    </TouchableHighlight>

                                                    <TouchableHighlight  underlayColor={item.sendStatus==1 ? "#f0f0f0":'#fff'} onPress={()=>this.messageBtn(item)}><Text  style={{color:"#ef7f92",textAlign:"right"}}>标为已读</Text></TouchableHighlight>

                                                </View>
                                            </View>
                                        </View>


                                    )}
                                />
                            </View>
                        </View>
                        :
                        <View>
                            <View style={{height: Dimensions.get("window").height-130,padding:10}}>
                                <FlatList
                                    data={readData}  //列表的渲染数据源
                                    ListEmptyComponent={()=><View style={{marginTop:30,alignItems:"center"}}><Text>{this.state.aa?'暂无已读消息':'获取消息数据中'}</Text></View>} //列表没有数据时展示，箭头函数中可以写一个react组件
                                    getItemLayout={(data, index) => ( {length: 80, offset: 80 * index, index} )}
                                    initialNumToRender={10}  //首次渲染的条数
                                    // onEndReached={this.onEndReached}  //列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
                                    onEndReachedThreshold={0.1} //定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                                    onRefresh={this.onRefresh} //下拉刷新
                                    refreshing={refreshing} //下拉刷新时候的正在加载的符号，设置为true显示，false隐藏。加载完成，需要设置为false
                                    keyExtractor={(item,index)=>`${index}`}
                                    renderItem={({item}) => (  //渲染列表的方式

                                        <View>
                                            <View style={{flexDirection:"row",backgroundColor:"#f6f8fa",marginBottom:5}}>

                                                <View style={{flex:1,alignItems:"center",justifyContent:"center",paddingLeft:10,paddingRight:10,marginTop:10,marginBottom:10,borderRightColor:"#e7e9ea",borderRightWidth:1}}>
                                                    <View  style={{alignItems:"center",flexDirection:"row",marginLeft:0}}>
                                                        <Image style={{height:20,width:20,marginRight:5}}
                                                               source={read}/>
                                                        <Text style={{fontSize:14}}>{item.sendTitle}</Text>
                                                    </View>

                                                    <Text style={{marginTop:5,color:"grey"}}>{setDate(item.createTime)}</Text>

                                                </View>



                                                <View style={{flex:2,marginLeft:15,justifyContent:"center",padding:10}}>

                                                    <TouchableHighlight
                                                        underlayColor="#f0f0f0" onPress={()=>this.jumptoBtn(item)}
                                                    >
                                                        <Text style={{color:"grey"}}>{item.sendContent}
                                                        <Text style={{textDecorationLine:'underline',color:"#f17e3a"}}>点击查看详情</Text>
                                                        </Text>
                                                    </TouchableHighlight>

                                                </View>
                                            </View>
                                        </View>


                                    )}
                                />
                            </View>
                        </View>
                }


            </View>


        )

    }
}


const styles = StyleSheet.create({
    message:{
        flexDirection:"row",
    }
});

export default connect (
    state => ({reduxData: state.reduxData}),
    dispath => bindActionCreators({getData},dispath)
)(ReadMessage)

