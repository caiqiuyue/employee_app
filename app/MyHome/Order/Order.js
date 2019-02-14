import React,{Component} from 'react';
import {
    View, Text, Image, TextInput, Modal, Platform, StyleSheet, FlatList, ScrollView, TouchableHighlight, Dimensions,
    DeviceEventEmitter, Linking
} from 'react-native';
import axios from "../../axios";
import moment from "moment";
import {Picker,DatePicker,Toast} from 'antd-mobile'
import callIcon from '../HomePage/style/60.png'
import topBg from '../HomePage/style/topBg.png'
import repair from './style/2.png'
import clean from './style/3.png'
import tuizu from './style/9.png'
import xuzu from './style/10.png'
import zhuanzu from './style/11.png'
import huanfang from './style/12.png'
import advice from './style/14.png'
import close from "../HomePage/style/close.png";
import s1 from "../HomePage/style/234.png";
import LinearGradient from 'react-native-linear-gradient';
const RoomInfo = props => {
    return (
        <TouchableHighlight style={{}} underlayColor="transparent" onPress={props.onClick}>

            <View style={{width:"100%",flexDirection:"row",borderColor:"#ccc",borderWidth:1,borderRadius:5,overflow:'hidden',padding:10}}>
                <View style={{flex:3,}}><Text>{props.extra}</Text></View>
                <View style={{flex:1,alignItems:"center",justifyContent:"center",}}><Image style={{height:10,width:15}} source={s1}/></View>
            </View>
        </TouchableHighlight>
    )
};

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setHotelNo} from "../../components/active/reducer";


class GoodSelect extends Component {
    constructor(props) {
        super(props);
        this.state={
            changeMsg:"服务工单",
            hotelNo:"",
            butlerMsg:"",
            handelMsg:[
                {
                    value:"服务工单",
                    flag:true
                },

                {
                    value:"租务工单",
                    flag:false
                },

                {
                    value:"建议回复",
                    flag:false
                },


            ],
            rentList:[],
            repairImgs:[],
            serverList:[],
            adviceList:[],
            refreshing:false,
            serverPage:1,
            rentPage:1,
            advicePage:1,
            date:null,
            modal:"接受",
            serverItem:{},
            aa:false,
            bb:false,
            cc:false,
            content:"",
            animationType: 'none',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示

        };

    }


    _setModalVisible = (visible) => {

        this.setState({ modalVisible: visible })
    };

    componentWillMount(){

        this.getAll()

    }

    componentWillReceiveProps(){

        this.setState({
            refreshing:true
        },()=>{
            this.getAll()
        })


        let {handelMsg} = this.state;

        const {getParam} = this.props.navigation;
        const data = getParam("user");
        console.log(data,'const data = getParam("user");');

        if(data){

            console.log('12345678');

            if(data=='booking_reminder'){
                handelMsg.map(_item=>{

                    if(_item.value=='服务工单'){
                        _item.flag=true
                    }else {
                        _item.flag=false
                    }

                })
            }else if(data=='application_reminder'){
                handelMsg.map(_item=>{
                    if(_item.value=='租务工单'){
                        _item.flag=true
                    }else {
                        _item.flag=false
                    }

                })
            }


            this.setState({
                handelMsg,
                changeMsg:data=='booking_reminder'?'服务工单':data=='application_reminder'?'租务工单':null
            })
        }
    }




    //获取全部
    getAll = ()=>{

        this.getServerWorkOrders();
        this.getRentWorkOrders();
        this.getTenantProposal();
    }


    //获取服务工单
    getServerWorkOrders=()=>{
        axios.post(`/steward/getServerWorkOrders`, {
            page:1,
            hotelNo:this.props.reduxData.hotelNo
        })
            .then((response) =>{
                console.log(response,'服务工单');

                this.setState({
                    aa:true,
                    refreshing:false
                },()=>{
                    if(response.data.code==0){

                        this.setState({
                            serverList:response.data.orders,

                        })
                    }
                })



            })
            .catch(function (error) {
                console.log(error);
            })
    }

    //获取租务工单
    getRentWorkOrders=()=>{
        axios.post(`/steward/getRentWorkOrders`, {
            page:1,
            hotelNo:this.props.reduxData.hotelNo
        })
            .then((response) =>{
                console.log(response,'租务工单');

                this.setState({
                    bb:true,
                    refreshing:false
                },()=>{
                    if(response.data.code==0){

                        this.setState({
                            rentList:response.data.orders,

                        })
                    }
                })



            })
            .catch(function (error) {
                console.log(error);
            })
    }

    //获取获取建议反馈
    getTenantProposal=()=>{
        axios.post(`/steward/getTenantProposal`, {
            page:1,
            hotelNo:this.props.reduxData.hotelNo
        })
            .then((response) =>{
                console.log(response,'建议反馈');

                this.setState({
                    cc:true,
                    refreshing:false
                },()=>{
                    if(response.data.code==0){

                        this.setState({
                            adviceList:response.data.proposals,

                        })
                    }
                })



            })
            .catch(function (error) {
                console.log(error);
            })
    };


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

            if(item.value=='租务工单'){
                // this.getRentWorkOrders()
            }

            if(item.value=='建议回复'){
                // this.getTenantProposal()

            }
        })

    };

    //打电话
    call = (item)=>{
        Linking.openURL(`tel:${item}`);
    }


    //下拉刷新
    onRefresh=(item)=>{
        this.setState({
            refreshing:true
        },()=>{

            if(item==1){
                this.getServerWorkOrders();
                this.setState({
                    refreshing:false,
                    serverPage:1

                });
            }else if(item==2){
                this.getRentWorkOrders();
                this.setState({
                    refreshing:false,
                    rentPage:1

                });
            }else {
                this.getTenantProposal();
                this.setState({
                    refreshing:false,
                    advicePage:1

                });
            }





        })
    }

    //上拉加载
    onEndReached = (item) => {

        let {rentList,serverList,adviceList,serverPage,rentPage,advicePage,hotelNo} = this.state;

        if(item==1){
            this.setState({
                serverPage:serverPage+1
            },()=>{

                axios.post(`/steward/getServerWorkOrders`, {
                    page:this.state.serverPage,
                    hotelNo:this.props.reduxData.hotelNo
                })
                    .then((response) =>{
                        console.log(response,'服务工单');
                        if(response.data.code==0){

                            if(response.data.orders.length>0){
                                this.setState({
                                    serverList:[...serverList,...response.data.orders],

                                })
                            }

                        }



                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            })
        }else if(item==2){

            this.setState({
                rentPage:rentPage+1
            },()=>{
                axios.post(`/steward/getRentWorkOrders`, {
                    page:this.state.rentPage,
                    hotelNo:this.props.reduxData.hotelNo
                })
                    .then((response) =>{
                        console.log(response,'租务工单');
                        if(response.data.code==0){

                            if(response.data.orders.length>0){
                                this.setState({
                                    rentList:[...rentList,...response.data.orders],

                                })
                            }

                        }


                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            })
        }else {
            this.setState({
                advicePage:advicePage+1
            },()=>{
                axios.post(`/steward/getTenantProposal`, {
                    page:this.state.advicePage,
                    hotelNo:this.props.reduxData.hotelNo
                })
                    .then((response) =>{
                        console.log(response,'建议反馈');
                        if(response.data.code==0){

                            if(response.data.proposals.length>0){
                                this.setState({
                                    adviceList:[...adviceList,...response.data.proposals],

                                })
                            }

                        }


                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            })
        }




    };



    //修改租务工单弹框
    editServerWorkOrder=(item,i)=>{
        // console.log(item);

        this.setState({
            modal:i==1 && item.status=='0' ? '接受' : i==1&&item.status=='1' ? '确定':'回复',
            serverItem:item,
            date:null,
            content:'',
            butlerMsg:'',
        },()=>{
            this._setModalVisible(true);
            console.log(this.state.serverItem,'serverItem');
        });

    };



    //确定接受
    accept=()=>{

        let {date,serverItem} = this.state;

        if(date==null){
            alert('请选择上门日期');
        }else {
            
            console.log(date,'date');
            this.setState({
                modalVisible: false
            },()=>{
                axios.post(`/steward/editServerWorkOrder`, {
                    id:serverItem.id,
                    comeDate:moment(date).format('YYYY-MM-DD hh:mm'),
                    status:'1',
                    type:serverItem.type,
                })
                    .then((response) =>{
                        console.log(response,'确定接受');
                        if(response.data.code==1){
                            Toast.info(response.data.message,1)
                        }else if(response.data.code==0){
                            Toast.info('修改成功',1)
                            this.getServerWorkOrders();
                        }

                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            })
            

        }

    }


    //确定完成

    submit=()=>{
        let {serverItem} = this.state;

        this.setState({
            modalVisible: false
        },()=>{
            axios.post(`/steward/editServerWorkOrder`, {
                id:serverItem.id,
                status:'3',
                type:serverItem.type,
                butlerMsg:this.state.butlerMsg
            })
                .then((response) =>{
                    console.log(response,'确定完成');
                    if(response.data.code==1){
                        Toast.info(response.data.message,1)
                    }else if(response.data.code==0){
                        Toast.info('修改成功',1)
                        this.getServerWorkOrders();
                    }

                })
                .catch(function (error) {
                    console.log(error);
                })
        })



    }


    //回复完成
    reply=()=>{
        let {serverItem,content} = this.state;

        console.log(content,'contentcontent');

        if(content.trim()==''){
            alert('请填写回复内容')
            return
        }

        this.setState({
            modalVisible: false
        },()=>{
            axios.post(`/steward/replyProposal`, {
                id:serverItem.id,
                reply:content,
            })
                .then((response) =>{
                    console.log(response,'回复完成');
                    if(response.data.code==1){
                        Toast.info(response.data.message,1)
                    }else if(response.data.code==0){
                        Toast.info('回复成功',1)
                        this.getTenantProposal();
                    }

                })
                .catch(function (error) {
                    console.log(error);
                })
        })
    }


    repairImg = (item)=>{
        this.setState({
            repairImgs:item.split(','),
            modal:'111',
            modalVisible:true
        })
    }

    render(){


        let {refreshing,rentList,serverList,adviceList,changeMsg,handelMsg} = this.state;

        //弹框
        let modalBackgroundStyle = {
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
        };
        let innerContainerTransparentStyle = this.state.transparent
            ? { backgroundColor: '#fff', padding: 10 ,
                // height:"90%",
                overflow:"hidden"}
            : null;



        //选择日期
        const nowTimeStamp = Date.now();
        const now = new Date(nowTimeStamp);
        const utcNow = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
        let minDate = new Date(nowTimeStamp);
        const maxDate = new Date(nowTimeStamp+1e7);


        if (minDate.getDate() !== maxDate.getDate()) {
            minDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
        }

        function formatDate(date) {
            const pad = n => n < 10 ? `0${n}` : n;
            const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
            const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
            return `${dateStr} ${timeStr}`;
        }


        return (
            <View style={styles.select}>
                <View>
                    <Image source={topBg} style={{height:70,width:Dimensions.get('window').width,resizeMode:"stretch"}} />
                </View>



                <View>

                    <Modal
                        animationType={this.state.animationType}
                        transparent={this.state.transparent}
                        visible={this.state.modalVisible}
                        onRequestClose={() => { this._setModalVisible(false) } }

                    >
                        <View style={[styles.container,modalBackgroundStyle]}>
                            <View style={[styles.innerContainer,innerContainerTransparentStyle]}>


                                {this.state.modal=='接受'?
                                    <View>
                                        <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>

                                            <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}>上门日期</Text></View>

                                            <TouchableHighlight underlayColor={"#fff"} onPress={()=>{this._setModalVisible(false)} } style={{}}>
                                                <Image style={{height:30,width:30}} source={close}/>
                                            </TouchableHighlight>


                                        </View>

                                        <View style={{paddingRight:20,marginTop:10}}>


                                            <Text>请选择上门日期:</Text>
                                            <View style={{marginTop:20}}>

                                                <DatePicker
                                                    minDate={minDate}
                                                    // maxDate={maxDate}
                                                    extra="请选择日期"
                                                    format={val => formatDate(val)}
                                                    value={this.state.date}
                                                    mode="datetime"
                                                    onChange={date => this.setState({date})}
                                                    onOk={date => this.setState({date})}
                                                >
                                                    <RoomInfo></RoomInfo>
                                                </DatePicker>

                                            </View>


                                            <View style={{alignItems:"center",marginTop:10}}>

                                                <LinearGradient colors={['#00adfb', '#00618e']} style={{width:100,borderRadius:5}}>
                                                    <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                                        alignItems:"center"
                                                    }} onPress={this.accept }>
                                                        <Text
                                                            style={{fontSize:16,textAlign:"center",color:"#fff"}}>
                                                            确定
                                                        </Text>
                                                    </TouchableHighlight>
                                                </LinearGradient>

                                            </View>

                                        </View>
                                    </View>
                                :this.state.modal=='确定'?
                                    <View>
                                        <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>

                                            <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}>确定</Text></View>

                                            <TouchableHighlight underlayColor={"#fff"} onPress={()=>{this._setModalVisible(false)} } style={{}}>
                                                <Image style={{height:30,width:30}} source={close}/>
                                            </TouchableHighlight>


                                        </View>

                                        <View style={{paddingRight:20,marginTop:10}}>

                                            <Text>管家留言:</Text>
                                            <View style={{marginTop:20}}>
                                                <TextInput
                                                    placeholder={'管家留言'}
                                                    multiline={true}
                                                    style={{minWidth:'100%',height:80,padding:10,borderColor:"#ccc",borderWidth:1,borderRadius:5,}}
                                                    underlineColorAndroid="transparent"
                                                    onChangeText={(butlerMsg) => this.setState({butlerMsg})}

                                                >
                                                </TextInput>


                                            </View>



                                            <View style={{alignItems:"center",marginTop:10}}>


                                                <LinearGradient colors={['#00adfb', '#00618e']} style={{width:100,borderRadius:5}}>
                                                    <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                                        alignItems:"center"
                                                    }} onPress={this.submit }>
                                                        <Text
                                                            style={{fontSize:16,textAlign:"center",color:"#fff"}}>
                                                            确定
                                                        </Text>
                                                    </TouchableHighlight>
                                                </LinearGradient>

                                            </View>

                                        </View>
                                    </View>
                                :this.state.modal=='回复'?
                                    <View>
                                            <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>

                                                <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}>回复</Text></View>

                                                <TouchableHighlight underlayColor={"#fff"} onPress={()=>{this._setModalVisible(false)} } style={{}}>
                                                    <Image style={{height:30,width:30}} source={close}/>
                                                </TouchableHighlight>


                                            </View>

                                            <View style={{paddingRight:20,marginTop:10}}>

                                                <Text>请填写回复内容:</Text>
                                                <View style={{marginTop:20}}>

                                                    <TextInput
                                                        multiline={true}
                                                        underlineColorAndroid="transparent"
                                                        style={{height: 100,
                                                            borderColor:"grey",borderWidth:1,padding:0,
                                                            borderRadius:5}}

                                                        placeholder="请填写回复内容"
                                                        onChangeText={(content) => this.setState({content})}
                                                    />

                                                </View>

                                                <View style={{alignItems:"center",marginTop:10}}>

                                                    <LinearGradient colors={['#00adfb', '#00618e']} style={{width:100,borderRadius:5}}>
                                                        <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                                            alignItems:"center"
                                                        }} onPress={this.reply }>
                                                            <Text
                                                                style={{fontSize:16,textAlign:"center",color:"#fff"}}>
                                                                确定
                                                            </Text>
                                                        </TouchableHighlight>
                                                    </LinearGradient>

                                                </View>

                                            </View>
                                        </View>
                                :   <View>
                                        <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>

                                            <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}>问题图片</Text></View>

                                            <TouchableHighlight underlayColor={"#fff"} onPress={()=>{this._setModalVisible(false)} } style={{}}>
                                                <Image style={{height:30,width:30}} source={close}/>
                                            </TouchableHighlight>


                                        </View>

                                        <ScrollView style={{maxHeight:Dimensions.get('window').height-200}}>

                                            {
                                                this.state.repairImgs.map((item,index)=>
                                                    <View key={index} style={{alignItems:"center",justifyContent:"center"}} >
                                                        <Image style={{height:Dimensions.get('window').height-200,width:"100%",resizeMode:"stretch"}}
                                                               source={{uri:item}}
                                                        />
                                                    </View>
                                                )
                                            }

                                        </ScrollView>
                                    </View>

                                }









                            </View>
                        </View>
                    </Modal>



                </View>



                <View style={{borderTopColor:"#7ebef9",borderTopWidth:1,flexDirection:"row",justifyContent:"space-around"}}>
                    {
                        handelMsg.map((item,index)=>

                            <LinearGradient key={index} colors={[!item.flag?'#00adfb':"#fff", !item.flag?'#00618e':"#fff"]} style={{width:"33.33%",}}>
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


                <View style={{
                    ...Platform.select({
                        android:{
                            paddingBottom:190,
                        },
                        ios:{
                            paddingBottom:160,
                        }
                    }),}}>



                    {changeMsg=='服务工单'?
                        (
                            <View>


                                <View style={{height:"100%"}}>


                                    <FlatList
                                        data={serverList}  //列表的渲染数据源
                                        getItemLayout={(data, index) => ( {length: 80, offset: 80 * index, index} )}
                                        initialNumToRender={10}  //首次渲染的条数
                                        ListEmptyComponent={()=><View style={{marginTop:30,alignItems:"center"}}><Text>{this.state.aa?'暂无服务工单数据':'查询服务工单数据中'}</Text></View>}
                                        onEndReached={()=>{this.onEndReached(1)}}  //列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
                                        onEndReachedThreshold={0.1} //定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                                        onRefresh={()=>{this.onRefresh(1)}} //下拉刷新
                                        refreshing={refreshing} //下拉刷新时候的正在加载的符号，设置为true显示，false隐藏。加载完成，需要设置为false
                                        keyExtractor={(item,index)=>`${index}`}
                                        renderItem={({item,index})=>(
                                            <View key={index} style={[styles.d,styles.e,]}>

                                                <View style={{paddingLeft:3,paddingRight:3,borderRightWidth:1,borderRightColor:"#ccc",flex:3,alignItems:"center",justifyContent:"center"}}>
                                                    <Image style={{height:18,width:18}} source={item.type==1?clean:repair}/>
                                                    <Text  style={{marginTop:5,color:"grey"}}>{item.createTime}</Text>
                                                </View>


                                                <TouchableHighlight underlayColor="transparent" onPress={()=>{this.call(item.phoneNo)}}  style={{alignItems:"center",justifyContent:"center",paddingLeft:3,paddingRight:3,borderRightWidth:1,borderRightColor:"#ccc",flex:3}}>
                                                    <View>
                                                        <View style={{flexDirection:"row"}}>
                                                            <Text style={{fontWeight:'bold',fontSize:16}}>{item.name}</Text>
                                                            <View><Image style={{width:18,height:18}} source={callIcon}/></View>

                                                        </View>

                                                        <Text style={{marginTop:5}}>{item.roomNo}</Text>
                                                    </View>
                                                </TouchableHighlight>


                                                <View style={{paddingLeft:3,paddingRight:3,borderRightWidth:1,borderRightColor:"#ccc",flex:3,alignItems:"center",justifyContent:"center"}}>
                                                    <Text  style={{color:"grey"}}>{item.aboutDate}</Text>
                                                    <Text  style={{color:"grey",marginTop:8}}>{item.noPerson==0?'无人可进':'无人不可进'}</Text>
                                                </View>


                                                <View style={{paddingLeft:3,paddingRight:3,borderRightWidth:1,borderRightColor:"#ccc",flex:3,alignItems:"center",justifyContent:"center"}}>
                                                    <Text  style={{fontWeight:"bold"}}>{item.content}</Text>
                                                    {item.evaluate?(<Text style={{color:"red"}}>评价内容:{item.evaluate}</Text>):null}
                                                    {item.userComplete?(<Text style={{color:"blue"}}>{item.userComplete}管家留言:{item.butlerMsg}</Text>):null}
                                                    {(item.type!=1 &&item.repairImg)?(<TouchableHighlight onPress={()=>{this.repairImg(item.repairImg)}}><Text style={{color:"green",textDecorationLine:"underline"}}>查看问题图片</Text></TouchableHighlight>):null}

                                                </View>

                                                {
                                                    item.status=='0'||item.status=='1'?
                                                        <TouchableHighlight onPress={()=>{this.editServerWorkOrder(item,1)}} underlayColor="transparent" style={{paddingLeft:3,paddingRight:3,flex:2,alignItems:"center",justifyContent:"center"}}>
                                                            <Text style={{color:"red"}}>{item.status=='0'?'接受':item.status=='1'?'完成':item.status=='2'?'已撤销':item.status=='3'?'已完成':'已评价'}</Text>

                                                        </TouchableHighlight>
                                                        :
                                                        <View style={{paddingLeft:3,paddingRight:3,flex:2,alignItems:"center",justifyContent:"center"}}>
                                                            <Text>{item.status=='2'?'已撤销':item.status=='3'?'已完成':'已评价'}</Text>
                                                            {item.star!='null'&&<Text  style={{color:"red"}}>{item.star}星</Text>}
                                                        </View>
                                                }






                                            </View>
                                        )}

                                    />


                                </View>



                            </View>
                        ):
                        changeMsg=='租务工单'?
                            (<View>

                                <FlatList
                                    data={rentList}  //列表的渲染数据源
                                    getItemLayout={(data, index) => ( {length: 80, offset: 80 * index, index} )}
                                    initialNumToRender={10}  //首次渲染的条数
                                    ListEmptyComponent={()=><View style={{marginTop:30,alignItems:"center"}}><Text>{this.state.bb?'暂无租务工单数据':'查询租务工单数据中'}</Text></View>}
                                    onEndReached={()=>this.onEndReached(2)}  //列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
                                    onEndReachedThreshold={0.1} //定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                                    onRefresh={()=>this.onRefresh(2)} //下拉刷新
                                    refreshing={refreshing} //下拉刷新时候的正在加载的符号，设置为true显示，false隐藏。加载完成，需要设置为false
                                    keyExtractor={(item,index)=>`${index}`}
                                    renderItem={({item,index})=>(
                                        <View key={index} style={[styles.d,styles.e,]}>

                                            <View style={{paddingLeft:3,paddingRight:3,borderRightWidth:1,borderRightColor:"#ccc",flex:3,alignItems:"center",justifyContent:"center"}}>
                                                <Image style={{height:18,width:18}} source={item.type==0?tuizu:item.type==1?xuzu:item.type==2?zhuanzu:huanfang}/>
                                                <Text  style={{marginTop:5,color:"grey"}}>{item.type==0?'退租':item.type==1?'续租':item.type==2?'转租':'换房'}</Text>
                                                <Text  style={{marginTop:5,color:"grey"}}>{item.createTime}</Text>
                                            </View>


                                            <TouchableHighlight underlayColor="transparent" onPress={()=>{this.call(item.phoneNo)}}  style={{alignItems:"center",justifyContent:"center",paddingLeft:3,paddingRight:3,borderRightWidth:1,borderRightColor:"#ccc",flex:3}}>
                                                <View>
                                                    <View style={{flexDirection:"row"}}>
                                                        <Text style={{fontWeight:'bold',fontSize:16}}>{item.name}</Text>
                                                        <View><Image style={{width:18,height:18}} source={callIcon}/></View>

                                                    </View>

                                                    <Text style={{marginTop:5}}>{item.roomNo}</Text>
                                                </View>
                                            </TouchableHighlight>


                                            <View style={{paddingLeft:3,paddingRight:3,borderRightWidth:1,borderRightColor:"#ccc",flex:3,alignItems:"center",justifyContent:"center"}}>
                                                <Text  style={{color:"grey"}}>{item.aboutDate}</Text>
                                            </View>


                                            <View style={{paddingLeft:3,paddingRight:3,borderRightWidth:1,borderRightColor:"#ccc",flex:3,alignItems:"center",justifyContent:"center"}}>
                                                <Text  style={{fontWeight:"bold"}}>{item.content}</Text>
                                            </View>


                                            <View style={{paddingLeft:3,paddingRight:3,flex:2,alignItems:"center",justifyContent:"center"}}>
                                                <Text>{item.status=='0'?'已申请':item.status=='1'?'已确认':item.status=='2'?'已生成账单':item.status=='3'?'已完成':'已拒绝'}</Text>
                                            </View>

                                        </View>
                                    )}

                                />

                            </View>):
                            (<View>

                                <FlatList
                                    data={adviceList}  //列表的渲染数据源
                                    getItemLayout={(data, index) => ( {length: 80, offset: 80 * index, index} )}
                                    initialNumToRender={10}  //首次渲染的条数
                                    ListEmptyComponent={()=><View style={{marginTop:30,alignItems:"center"}}><Text>{this.state.cc?'暂无建议回复数据':'查询建议回复数据中'}</Text></View>}
                                    onEndReached={()=>{this.onEndReached(3)}}  //列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
                                    onEndReachedThreshold={0.1} //定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                                    onRefresh={()=>{this.onRefresh(3)}} //下拉刷新
                                    refreshing={refreshing} //下拉刷新时候的正在加载的符号，设置为true显示，false隐藏。加载完成，需要设置为false
                                    keyExtractor={(item,index)=>`${index}`}
                                    renderItem={({item,index})=>(
                                        <View key={index} style={[styles.d,styles.e,]}>

                                            <View style={{paddingLeft:3,paddingRight:3,borderRightWidth:1,borderRightColor:"#ccc",flex:3,alignItems:"center",justifyContent:"center"}}>
                                                <Image style={{height:18,width:18}} source={advice}/>
                                                <Text  style={{marginTop:5,color:"grey"}}>{moment(item.createTime).format('YYYY-MM-DD')}</Text>
                                            </View>


                                            <TouchableHighlight underlayColor="transparent" onPress={()=>{this.call(item.phone)}}  style={{alignItems:"center",justifyContent:"center",paddingTop:10,paddingBottom:10,paddingLeft:3,paddingRight:3,borderRightWidth:1,borderRightColor:"#ccc",flex:3}}>
                                                <View>
                                                    <View style={{flexDirection:"row"}}>
                                                        <Text style={{fontWeight:'bold',fontSize:16}}>{item.name}</Text>
                                                        <View><Image style={{width:18,height:18}} source={callIcon}/></View>

                                                    </View>

                                                    <Text style={{marginTop:5}}>
                                                        {item.roomNo}
                                                    </Text>


                                                </View>
                                            </TouchableHighlight>




                                            <View style={{paddingLeft:3,paddingRight:3,borderRightWidth:1,borderRightColor:"#ccc",flex:3,alignItems:"center",justifyContent:"center"}}>
                                                <Text style={{color:"grey"}}>建议内容:</Text>
                                                <Text  style={{fontWeight:"bold"}}>{item.content}</Text>
                                            </View>



                                            {
                                                item.reply==null?
                                                    <TouchableHighlight onPress={()=>{this.editServerWorkOrder(item,2)}}  underlayColor="transparent" style={{paddingTop:10,paddingBottom:10,paddingLeft:3,paddingRight:3,borderRightWidth:1,borderRightColor:"#ccc",flex:3,alignItems:"center",justifyContent:"center"}}>
                                                        <Text style={{color:"red"}}>回复</Text>
                                                    </TouchableHighlight>
                                                    :
                                                    <View style={{paddingLeft:3,paddingRight:3,borderRightWidth:1,borderRightColor:"#ccc",flex:3,alignItems:"center",justifyContent:"center"}}>
                                                        <Text style={{color:"grey"}}>回复内容:</Text>
                                                        <Text  style={{fontWeight:"bold"}}>{item.reply}</Text>
                                                    </View>
                                            }






                                        </View>
                                    )}

                                />

                            </View>)

                    }





                </View>


            </View>
        )

    }
}

const styles = StyleSheet.create({
    select:{
        height:Dimensions.get("window").height


    },


    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,

    },
    innerContainer: {
        borderRadius: 10,
    },

    a:{
        flexDirection:"row",alignItems:"center",marginTop:10
    },

    b:{
        marginLeft:10,flex:1,
    },

    d:{

        flexDirection:"row",
        marginTop:5,padding:5
    },

    e:{
        backgroundColor:"#fff"
    },



    c:{
        flex:3
    },

    fontcolor:{
        color:"grey"
    }


});

export default connect (
    state => ({reduxData: state.reduxData}),
    dispath => bindActionCreators({setHotelNo},dispath)
)(GoodSelect);