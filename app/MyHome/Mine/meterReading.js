import React,{Component} from 'react';
import {FlatList,View,DeviceEventEmitter, ScrollView,Text, TouchableHighlight, TextInput,Image, Modal, StyleSheet,Platform} from 'react-native';

import Dimensions from "Dimensions";
import axios from "../../axios";
import {DatePicker,Toast} from 'antd-mobile'
import shaixuan from "../HomePage/style/shaixuan.png";
import s1 from "../HomePage/style/234.png";
import close from "../HomePage/style/close.png";
import moment from "moment/moment";
import {bindActionCreators} from "redux";
import {setHotelNo} from "../../components/active/reducer";
import {connect} from "react-redux";

import LinearGradient from 'react-native-linear-gradient';
const RoomInfo = props => {
    return (
        <TouchableHighlight style={{}} underlayColor="transparent" onPress={props.onClick}>

            <View style={{width:"100%",flexDirection:"row",backgroundColor:"#ccc",borderRadius:5,overflow:'hidden',padding:10}}>
                <View style={{flex:3,}}><Text>{props.extra}</Text></View>
                <View style={{flex:1,alignItems:"center",justifyContent:"center",}}><Image style={{height:10,width:15}} source={s1}/></View>
            </View>
        </TouchableHighlight>
    )
};
class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            hotelNo:'',
            roomNo:'',
            screenRoomNo:'',
            handelMsg:[
                {
                    value:"抄表",
                    flag:true
                },

                {
                    value:"抄表记录",
                    flag:false
                },

            ],
            changeMsg:"抄表",
            lastEle:0,
            electricity:0,
            elePrice:0,
            waterPrice:0,
            lastWater:0,
            menterData:[],
            water:0,
            roomInfo:{},
            hotWaterPrice:0,
            lastHotWater:0,
            modal:'',
            hotWater:0,
            animationType: 'none',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示
            toast:false,
            refreshing:false,
            bb:false,
            toastDate:1,
            date1:new Date(moment(new Date()).subtract(1, 'month')),
            date2:new Date(),
            data:{},
            paddbottom:Dimensions.get('window').height+300,
            flag:false


        }

        this.aa=false;
        this.lastEle=0;
        this.lastWater=0;
        this.lastHotWater=0;
        this.roomNo='';

    }


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

            if(this.state.changeMsg=='抄表记录'){

                this.getMeter()

            }

        })

    }


    getMeter = ()=>{

        axios.post(`/employee/getMeter`, {
            hotelNo:this.props.reduxData.hotelNo,
            roomNo:this.state.screenRoomNo,
            beginDate:moment(this.state.date1).format('YYYY-MM-DD'),
            endDate:moment(this.state.date2).format('YYYY-MM-DD'),

        })
            .then((response) =>{
                console.log(response);

                this.setState({
                    bb:true,
                    refreshing:false
                },()=>{
                    if(response.data.code==0&&response.data.data.length>0){
                        this.setState({
                            menterData:response.data.data
                        })



                    }else  if(response.data.code==1){
                        Toast.info(response.data.message,1)
                    }
                })

            })
            .catch((error)=> {
                console.log(error);
                this.setState({
                    refreshing:false
                })
            })
    }


    onRefresh = ()=>{

        this.setState({
            refreshing:true
        },()=>{
            this.getMeter()
        })




    }


    _setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    };


    componentWillMount(){
        
    }

    screening = ()=>{
        this.setState({
            modalVisible: true,
            modal:'筛选'
        })
    }


    changeDate1=(date)=>{

        let {date1,date2} = this.state

        let flag = moment(date).isBefore(date2);
        if(flag){
            this.setState({date1:date},()=>{this.getAll();this._showLoading()})
        }else {
            this.setState({
                toast:true,
                toastDate:1
            },()=>{
                this.timer = setTimeout(() => {
                    this.setState({
                        toast:false,
                    })
                }, 1000);
            })
        }






    }

    changeDate2=(date)=>{

        let {date1,date2} = this.state;

        let flag = moment(date1).isBefore(date);


        if(flag){
            this.setState({date2:date},()=>{this.getAll();this._showLoading()})
        }else {
            this.setState({
                toast:true,
                toastDate:2
            },()=>{
                this.timer = setTimeout(() => {
                    this.setState({
                        toast:false,
                    })
                }, 1000);
            })
        }



    }


    //查询房间信息
    submitRoomNo = ()=>{

        let {roomNo} = this.state;

        if(!roomNo){
            Toast.info('请输入房间号',1)
            return
        }

        axios.post(`/employee/getSomeByRoomNo`, {
            hotelNo:this.props.reduxData.hotelNo,
            roomNo:this.state.roomNo,
            type:'meter',

        })
            .then((response) =>{
                console.log(response);


                if(response.data.code==0){
                    this.aa = true;
                    if(response.data.data.customerName==undefined){
                        Toast.info('未查到该房间号信息',1)
                        this.setState({
                            data:{}
                        })
                    }else {



                        this.lastEle=response.data.data.lastElectricMoney;
                        this.lastWater=response.data.data.lastWaterMoney;
                        this.lastHotWater=response.data.data.lastHotWaterMoney;
                        this.state.lastEle=response.data.data.lastElectricMoney;
                        this.state.lastWater=response.data.data.lastWaterMoney;
                        this.state.lastHotWater=response.data.data.lastHotWaterMoney;


                        this.setState({
                            data:response.data.data,
                            flag:this.roomNo==this.state.roomNo?true:false,
                            electricity:0,
                            water:0,
                            hotWater:0,
                        })
                    }

                }else  if(response.data.code==1){
                    Toast.info(response.data.message,1)
                }




            })
            .catch(function (error) {
                console.log(error);
            })





    }


    componentWillUnmount() {

        this.timer && clearTimeout(this.timer);
    }



    //本次电费
    setElectricity = (electricity)=>{

        if(!this.aa){
           Toast.info('请确定填写的房间号',1)
            return

        }else {
            this.setState({electricity,elePrice:(electricity-0)-(this.state.lastEle-0)})
        }

    }


    //上次电费
    setLastElectricity = (lastEle)=>{

        if(!this.aa){
            Toast.info('请确定填写的房间号',1)
            return
        }else {
            this.setState({lastEle,elePrice:(this.state.electricity-0)-(lastEle-0)})
        }

    }



    //上次水费
    setLastWater = (lastWater)=>{

        if(!this.aa){
            Toast.info('请确定填写的房间号',1)
            return
        }else {
            this.setState({
                lastWater,
                waterPrice:(this.state.water-0)-(lastWater-0)})
        }

    }


    setWater = (water)=>{

        if(!this.aa){
            Toast.info('请确定填写的房间号',1)
            return
        }else {
            this.setState({
                water,
                waterPrice:(water-0)-(this.state.lastWater-0)})
        }

    }


    //上次水费
    setLastHotWater = (lastHotWater)=>{

        if(!this.aa){
            Toast.info('请确定填写的房间号',1)
            return
        }else {
            this.setState({
                lastHotWater,
                hotWaterPrice:(this.state.hotWater-0)-(lastHotWater-0)})
        }

    }


    sethotWater = (hotWater)=>{

        if(!this.aa){
            Toast.info('请确定填写的房间号',1)
            return
        }else {
            this.setState({
                hotWater,
                hotWaterPrice:(hotWater-0)-(this.state.lastHotWater-0)})
        }

    }


    setPadd = ()=>{
        this.setState({paddbottom:1200,})
    }


    noRepeat=()=>{
        Toast.info('该房间已发送账单 不可重复发送',1);
    }


    submitAll = ()=>{

        let {data,lastEle,electricity,lastWater,water,lastHotWater,hotWater} = this.state;

        if(!this.aa){
            Toast.info('请确定填写的房间号',1);
            return
        }else if(data.customerName==undefined){
            Toast.info('未查到该房间号信息，请重新填写',1);
            return
        }else {

            this.setState({
                flag:this.roomNo==this.state.roomNo?true:false
            },()=>{
                axios.post(`/employee/saveMeter`, {
                    hotelNo:this.props.reduxData.hotelNo,
                    roomNo:this.state.roomNo,
                    electricMoney:electricity-0,
                    lastElectricMoney:lastEle-0,
                    waterMoney:water-0,
                    lastWaterMoney:lastWater-0,
                    hotWaterMoney:hotWater-0,
                    lastHotWaterMoney:lastHotWater-0,


                })
                    .then((response) =>{
                        console.log(response);

                        Toast.info(response.data.code==0?'提交成功':response.data.message,1)

                        this.roomNo=this.state.roomNo;
                        this.setState({
                            flag:response.data.code==0?true:false
                        })




                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            })


        }
    }



    //详情
    seeRoom = (item) => {

        this.setState({
            modalVisible:true,
            roomInfo:item,
            modal:'详情'
        })

    };



    render(){

        let {handelMsg,changeMsg,data,menterData,flag,roomInfo} = this.state;
        //弹框
        let modalBackgroundStyle = {
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
        };
        let innerContainerTransparentStyle = this.state.transparent
            ? { backgroundColor: '#fff', padding: 10 ,
                // height:"90%",
                overflow:"hidden"}
            : null;

        let maxDate2 = new Date();

        return (



            <View style={{height:Dimensions.get("window").height,backgroundColor:"#fff"}}>

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


                <View>

                    <Modal
                        animationType={this.state.animationType}
                        transparent={this.state.transparent}
                        visible={this.state.modalVisible}

                        onRequestClose={() => { this._setModalVisible(false) } }

                    >
                        <View style={[styles.container,modalBackgroundStyle]}>
                            <View style={[styles.innerContainer,innerContainerTransparentStyle]}>


                                {
                                    this.state.modal=='筛选'?
                                        <View>
                                            <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>

                                                <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}>查询抄表</Text></View>



                                                <TouchableHighlight underlayColor={"#fff"} onPress={this._setModalVisible.bind(this,false) } style={{}}>
                                                    <Image style={{height:30,width:30}} source={close}/>
                                                </TouchableHighlight>

                                            </View>

                                            {
                                                this.state.toast&&
                                                <View style={{position:"absolute",top:'40%',left:"30%",backgroundColor:'rgba(0, 0, 0, 0.5)',padding:3,zIndex:999}}>
                                                    <Text style={{color:"#fff"}}>{this.state.toastDate==1?'开始日期不能比结束日期小':'结束日期不能比开始日期小'}</Text>
                                                </View>
                                            }




                                            <View style={{paddingRight:20}}>

                                                <View style={styles.a}>
                                                    <Text style={{flex:1}}>房间号:</Text>
                                                    <View style={[styles.b,{flex:3}]}>
                                                        <TextInput
                                                            placeholder={"房间号"}
                                                            style={{minWidth:'100%',padding:10,backgroundColor:"#ccc",borderRadius:5,}}
                                                            underlineColorAndroid="transparent"
                                                            onChangeText={(screenRoomNo) => this.setState({screenRoomNo})}
                                                        >
                                                        </TextInput>
                                                    </View>
                                                </View>


                                                <View style={styles.a}>
                                                    <Text style={{flex:1}}>开始时间:</Text>
                                                    <View style={[styles.b,{flex:3}]}>

                                                        <DatePicker
                                                            extra="请选择开始日期"
                                                            format={val => moment(val).format("YYYY-MM-DD")}
                                                            value={this.state.date1}
                                                            mode="date"
                                                            maxDate={maxDate2}
                                                            // onChange={date1 => {this.changeDate1(date1)}}
                                                            onOk={date1 => {this.changeDate1(date1)}}
                                                            // onOk={date1 => this.setState({date1},()=>{this.getAll()})}
                                                        >
                                                            <RoomInfo></RoomInfo>
                                                        </DatePicker>



                                                    </View>

                                                </View>


                                                <View style={styles.a}>
                                                    <Text style={{flex:1}}>结束时间:</Text>
                                                    <View style={[styles.b,{flex:3}]}>

                                                        <DatePicker
                                                            extra="请选择结束日期"
                                                            format={val => moment(val).format("YYYY-MM-DD")}
                                                            value={this.state.date2}
                                                            mode="date"
                                                            maxDate={maxDate2}
                                                            // onChange={date2 => {this.changeDate2(date2)}}
                                                            onOk={date2 => {this.changeDate2(date2)}}
                                                            // onOk={date2 => this.setState({date2},()=>{this.getAll()})}
                                                        >
                                                            <RoomInfo></RoomInfo>
                                                        </DatePicker>



                                                    </View>

                                                </View>




                                                <View style={{alignItems:"center",marginTop:10}}>
                                                    <LinearGradient colors={['#00adfb', '#00618e']} style={{width:100,borderRadius:5}}>
                                                        <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                                            alignItems:"center"
                                                        }} onPress={this.getMeter}>
                                                            <Text
                                                                style={{fontSize:16,textAlign:"center",color:"#fff"}}>
                                                                确定
                                                            </Text>
                                                        </TouchableHighlight>
                                                    </LinearGradient>
                                                </View>

                                            </View>
                                        </View>:
                                        <View>
                                            <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>

                                                <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}>查看详情</Text></View>



                                                <TouchableHighlight underlayColor={"#fff"} onPress={this._setModalVisible.bind(this,false) } style={{}}>
                                                    <Image style={{height:30,width:30}} source={close}/>
                                                </TouchableHighlight>

                                            </View>


                                            <ScrollView style={{maxHeight:Dimensions.get('window').height-200}}>
                                                <View style={{padding:10}}>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>房间号:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1}}>{roomInfo.roomNo}</Text>
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>租客姓名:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1}}>{roomInfo.customerName}</Text>
                                                        </View>
                                                    </View>


                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>查房人:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1}}>{roomInfo.userName}</Text>
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>查房时间:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1}}>{moment(roomInfo.createTime).format("YYYY-MM-DD hh:mm:ss")}</Text>
                                                        </View>
                                                    </View>



                                                    <View style={{borderLeftWidth:3,borderLeftColor:'#7ebef9',marginTop:15}}>
                                                        <Text style={{fontSize:20,fontWeight:'bold',paddingLeft:10}}>电费</Text>
                                                    </View>

                                                    <View style={{width:"100%",height:1,backgroundColor:"#f0f0f0",marginTop:10}}></View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>上次电量:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1}}>{roomInfo.lastElectric}度</Text>
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>本次电量:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1}}>{roomInfo.electric}度</Text>
                                                        </View>
                                                    </View>


                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>电费单价:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1}}>{roomInfo.hotelPower}元</Text>
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>电费金额:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1}}>{roomInfo.electricMoney}元</Text>
                                                        </View>
                                                    </View>

                                                    <View style={{borderLeftWidth:3,borderLeftColor:'#7ebef9',marginTop:15}}>
                                                        <Text style={{fontSize:20,fontWeight:'bold',paddingLeft:10}}>水费</Text>
                                                    </View>

                                                    <View style={{width:"100%",height:1,backgroundColor:"#f0f0f0",marginTop:10}}></View>


                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>上次水量:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1}}>{roomInfo.lastWater}吨</Text>
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>本次水量:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1}}>{roomInfo.water}吨</Text>
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>水费单价:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1}}>{roomInfo.hotelWater}元</Text>
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>水费金额:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1}}>{roomInfo.waterMoney}元</Text>
                                                        </View>
                                                    </View>

                                                    <View style={{borderLeftWidth:3,borderLeftColor:'#7ebef9',marginTop:15}}>
                                                        <Text style={{fontSize:20,fontWeight:'bold',paddingLeft:10}}>热水费</Text>
                                                    </View>

                                                    <View style={{width:"100%",height:1,backgroundColor:"#f0f0f0",marginTop:10}}></View>


                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>上次热水:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1}}>{roomInfo.lastHotWater}吨</Text>
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>本次热水:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1}}>{roomInfo.hotWater}吨</Text>
                                                        </View>
                                                    </View>


                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>热水单价:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1}}>{roomInfo.hotelWaterHot}元</Text>
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>热水金额:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1}}>{roomInfo.hotWaterMoney}元</Text>
                                                        </View>
                                                    </View>







                                                </View>
                                            </ScrollView>
                                        </View>
                                }


                            </View>
                        </View>
                    </Modal>



                </View>


                {
                    changeMsg=='抄表'?

                        <ScrollView >
                            <View style={{padding:10,height:this.state.paddbottom}}>

                                <View style={styles.allLine}>
                                    <View style={{flex:1,}}><Text >房间号:</Text></View>
                                    <View style={{flex:3,}}>
                                        <View style={[styles.allInput,{width:"95%"}]}>
                                            <TextInput
                                                placeholder="房间号"
                                                style={{minWidth:180,padding: 8,}}
                                                underlineColorAndroid="transparent"
                                                onChangeText={(roomNo) => this.setState({roomNo})}
                                            >
                                            </TextInput>
                                        </View>


                                    </View>


                                    <LinearGradient colors={['#00adfb', '#00618e']} style={{flex:1,borderRadius:5}}>
                                        <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                            alignItems:"center"
                                        }} onPress={this.submitRoomNo }>
                                            <Text
                                                style={{fontSize:16,textAlign:"center",color:"#fff"}}>
                                                确定
                                            </Text>
                                        </TouchableHighlight>
                                    </LinearGradient>

                                </View>


                                {
                                    data.customerName&&
                                    <View style={styles.allLine}>
                                        <View style={{flex:1,}}><Text >{}</Text></View>
                                        <View style={{flex:3,}}>
                                            <Text style={{color:"#f17e3a"}}>{data.customerName}<Text>{data.phone}</Text></Text>
                                        </View>
                                    </View>
                                }


                                <View style={{borderLeftWidth:3,borderLeftColor:'#7ebef9',marginTop:15}}>
                                    <Text style={{fontSize:20,fontWeight:'bold',paddingLeft:10}}>电费</Text>
                                </View>

                                <View style={{width:"100%",height:1,backgroundColor:"#f0f0f0",marginTop:10}}></View>


                                {
                                    this.lastHotWater?
                                <View style={styles.allLine}>
                                    <View style={{flex:1,}}><Text >上次抄表时间:</Text></View>
                                    <View style={{flex:3}}>
                                        <View>
                                            <Text>{moment(data.electricTime).format('YYYY-MM-DD hh:mm:ss')}</Text>
                                        </View>
                                    </View>

                                </View>:null
                                }

                                <View style={styles.allLine}>
                                    <View style={{flex:1,}}><Text >上期度数:</Text></View>
                                    <View style={{flex:3,}}>
                                        <View style={styles.allInput}>
                                            <TextInput
                                                placeholder={this.lastEle==0?"上期度数":this.lastEle+''}
                                                style={{minWidth:180,padding: 8,}}
                                                value={this.state.lastEle}
                                                keyboardType={'numeric'}
                                                underlineColorAndroid="transparent"
                                                editable={this.lastEle==0?true:false}
                                                onChangeText={(lastEle) => this.setLastElectricity(lastEle)}
                                                onFocus={this.setPadd}
                                            >
                                            </TextInput>
                                        </View>
                                    </View>

                                </View>




                                <View style={styles.allLine}>
                                    <View style={{flex:1,}}><Text >本期度数:</Text></View>
                                    <View style={{flex:3,}}>
                                        <View style={styles.allInput}>
                                            <TextInput
                                                placeholder="本期度数"
                                                style={{minWidth:180,padding: 8,}}
                                                keyboardType={'numeric'}
                                                value={this.state.electricity}
                                                underlineColorAndroid="transparent"
                                                onChangeText={(electricity) => this.setElectricity(electricity)}
                                                onFocus={this.setPadd}
                                            >
                                            </TextInput>
                                        </View>


                                    </View>

                                </View>

                                <View style={styles.allLine}>
                                    <View style={{flex:1,justifyContent:"center"}}><Text >本次单价:</Text></View>
                                    <View style={{flex:3,}}>
                                        <Text>{(this.state.elePrice-0).toFixed(2)}度*{data.hotelPower?data.hotelPower:0}元/度=<Text style={{fontWeight:'bold',fontSize:18,color:"#f17e3a"}}>{(this.state.elePrice*(data.hotelPower?data.hotelPower:0)).toFixed(2)}元</Text></Text>

                                    </View>

                                </View>





                                <View style={{borderLeftWidth:3,borderLeftColor:'#7ebef9',marginTop:15}}>
                                    <Text style={{fontSize:20,fontWeight:'bold',paddingLeft:10}}>水费</Text>
                                </View>

                                <View style={{width:"100%",height:1,backgroundColor:"#f0f0f0",marginTop:10}}></View>


                                {this.lastWater?
                                <View style={styles.allLine}>
                                    <View style={{flex:1,}}><Text >上次抄表时间:</Text></View>
                                    <View style={{flex:3}}>
                                        <View>
                                            <Text>{moment(data.waterTime).format('YYYY-MM-DD hh:mm:ss')}</Text>
                                        </View>
                                    </View>

                                </View>:null}

                                <View style={styles.allLine}>
                                    <View style={{flex:1,}}><Text >上期吨数:</Text></View>
                                    <View style={{flex:3}}>

                                        <View style={styles.allInput}>
                                            <TextInput
                                                placeholder={this.lastWater==0?"上期吨数":this.lastWater+''}
                                                style={{minWidth:180,padding: 8,}}
                                                value={this.state.lastWater}
                                                keyboardType={'numeric'}
                                                underlineColorAndroid="transparent"
                                                editable={this.lastWater==0?true:false}
                                                onFocus={this.setPadd}
                                                onChangeText={(lastWater) => this.setLastWater(lastWater)}
                                            >
                                            </TextInput>
                                        </View>
                                    </View>

                                </View>




                                <View style={styles.allLine}>
                                    <View style={{flex:1,}}><Text >本期吨数:</Text></View>
                                    <View style={{flex:3,}}>
                                        <View style={styles.allInput}>
                                            <TextInput
                                                placeholder="本期吨数"
                                                style={{minWidth:180,padding: 8,}}
                                                keyboardType={'numeric'}
                                                underlineColorAndroid="transparent"
                                                onFocus={this.setPadd}
                                                value={this.state.water}
                                                onChangeText={(water) => this.setWater(water)}
                                            >
                                            </TextInput>
                                        </View>


                                    </View>

                                </View>

                                <View style={styles.allLine}>
                                    <View style={{flex:1,}}><Text >本次单价:</Text></View>
                                    <View style={{flex:3,}}>
                                        <View style={{}}>
                                            <Text>{(this.state.waterPrice-0).toFixed(2)}吨*{data.hotelWater?data.hotelWater:0}元/吨=<Text style={{fontWeight:'bold',fontSize:18,color:"#f17e3a"}}>{(this.state.waterPrice*(data.hotelWater?data.hotelWater:0)).toFixed(2)}元</Text></Text>
                                        </View>


                                    </View>

                                </View>


                                <View style={{borderLeftWidth:3,borderLeftColor:'#7ebef9',marginTop:15}}>
                                    <Text style={{fontSize:20,fontWeight:'bold',paddingLeft:10}}>热水费</Text>
                                </View>

                                <View style={{width:"100%",height:1,backgroundColor:"#f0f0f0",marginTop:10}}></View>


                                {this.lastHotWater?
                                <View style={styles.allLine}>
                                    <View style={{flex:1,}}><Text >上次抄表时间:</Text></View>
                                    <View style={{flex:3}}>
                                        <View>
                                            <Text>{moment(data.hotWaterTime).format('YYYY-MM-DD hh:mm:ss')}</Text>
                                        </View>
                                    </View>

                                </View>:null}

                                <View style={styles.allLine}>
                                    <View style={{flex:1,}}><Text >上期吨数:</Text></View>
                                    <View style={{flex:3,}}>

                                        <View style={styles.allInput}>
                                            <TextInput
                                                placeholder={this.lastHotWater==0?"上期吨数":this.lastHotWater+''}
                                                style={{minWidth:180,padding: 8,}}
                                                value={this.state.lastHotWater}
                                                keyboardType={'numeric'}
                                                underlineColorAndroid="transparent"
                                                onFocus={this.setPadd}
                                                editable={this.lastHotWater==0?true:false}
                                                onChangeText={(lastHotWater) => this.setLastHotWater(lastHotWater)}
                                            >
                                            </TextInput>
                                        </View>
                                    </View>

                                </View>



                                <View style={styles.allLine}>
                                    <View style={{flex:1,}}><Text >本期吨数:</Text></View>
                                    <View style={{flex:3,}}>
                                        <View style={styles.allInput}>
                                            <TextInput
                                                placeholder="本期吨数"
                                                style={{minWidth:180,padding: 8,}}
                                                keyboardType={'numeric'}
                                                value={this.state.hotWater}
                                                underlineColorAndroid="transparent"
                                                onFocus={this.setPadd}
                                                onChangeText={(hotWater) => this.sethotWater(hotWater)}
                                            >
                                            </TextInput>
                                        </View>


                                    </View>

                                </View>

                                <View style={styles.allLine}>
                                    <View style={{flex:1,}}><Text >本次单价:</Text></View>
                                    <View style={{flex:3,}}>
                                        <View style={{}}>
                                            <Text>{(this.state.hotWaterPrice-0).toFixed(2)}吨*{data.hotelWaterHot?data.hotelWaterHot:0}元/吨=<Text style={{fontWeight:'bold',fontSize:18,color:"#f17e3a"}}>{(this.state.hotWaterPrice*(data.hotelWaterHot?data.hotelWaterHot:0)).toFixed(2)}元</Text></Text>
                                        </View>


                                    </View>

                                </View>


                                <View style={{width:"100%",height:1,backgroundColor:"#f0f0f0",marginTop:10}}></View>


                                <View style={{borderLeftWidth:3,borderLeftColor:'#7ebef9',marginTop:10}}>
                                    <Text style={{fontSize:20,fontWeight:'bold',paddingLeft:10}}>合计:
                                        <Text style={{color:"#f17e3a"}}>{((this.state.elePrice*(data.hotelPower?data.hotelPower:0))+(this.state.waterPrice*(data.hotelWater?data.hotelWater:0))+(this.state.hotWaterPrice*(data.hotelWaterHot?data.hotelWaterHot:0))).toFixed(2)}元</Text>
                                        </Text>
                                </View>

                                <View style={{alignItems:'center',marginTop:20}}>

                                    {
                                        flag?

                                            <LinearGradient colors={['#fff', '#fff']} style={{width:100,borderRadius:5,borderColor:"#f0f0f0",borderWidth:1}}>
                                                <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                                    alignItems:"center"
                                                }} onPress={this.noRepeat }>
                                                    <Text
                                                        style={{fontSize:16,textAlign:"center",color:"#000"}}>
                                                        确定
                                                    </Text>
                                                </TouchableHighlight>
                                            </LinearGradient>

                                            :

                                            <LinearGradient colors={['#00adfb', '#00618e']} style={{width:100,borderRadius:5}}>
                                                <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                                        alignItems:"center"
                                                    }} onPress={this.submitAll }>
                                                    <Text
                                                    style={{fontSize:16,textAlign:"center",color:"#fff"}}>
                                                        发送账单
                                                    </Text>
                                                </TouchableHighlight>
                                            </LinearGradient>
                                    }




                                </View>







                            </View>
                        </ScrollView>

                        :
                        <View>


                            <View style={{flexDirection:"row-reverse",margin:10}}>
                                <TouchableHighlight underlayColor="transparent" onPress={this.screening}>
                                    <View><Image style={{height:25,width:25}} source={shaixuan}/></View>
                                </TouchableHighlight>
                            </View>



                            <View style={{
                                ...Platform.select({
                                    android:{
                                        paddingBottom:220,
                                    },
                                    ios:{
                                        paddingBottom:200,
                                    }
                                }),
                            }}>

                                <FlatList
                                    data={menterData}  //列表的渲染数据源
                                    getItemLayout={(data, index) => ( {length: 80, offset: 80 * index, index} )}
                                    initialNumToRender={10}  //首次渲染的条数
                                    ListEmptyComponent={()=><View style={{marginTop:30,alignItems:"center"}}><Text>{this.state.bb?'暂无抄表记录':'查询抄表记录中'}</Text></View>}
                                    onRefresh={()=>{this.onRefresh()}} //下拉刷新
                                    refreshing={this.state.refreshing} //下拉刷新时候的正在加载的符号，设置为true显示，false隐藏。加载完成，需要设置为false
                                    keyExtractor={(item,index)=>`${index}`}
                                    renderItem={({item,index})=>(
                                        <View key={index}  style={[styles.d,styles.e,{borderTopWidth:index==0?1:0,borderTopColor:index==0?"#ccc":'#fff'}]}>

                                            <TouchableHighlight underlayColor="transparent" onPress={()=>{this.seeRoom(item)}} style={[styles.aaa,{flex:2,alignItems:"center",justifyContent:"center"}]}>
                                                <View>
                                                    <Text style={{fontSize:18,fontWeight:"bold"}}>{item.roomNo}</Text>
                                                    <Text style={{color:"red",marginTop:5,}}>详情</Text>

                                                </View>

                                            </TouchableHighlight>



                                            <View style={[styles.aaa,{flex:3,alignItems:"center",justifyContent:"center"}]}>
                                                <Text>{item.userName}</Text>
                                                <Text  style={{marginTop:5,}}>{moment(item.createTime).format('YYYY-MM-DD hh:mm:ss')}</Text>
                                            </View>


                                            <View style={[styles.aaa,{flex:2,alignItems:"center",justifyContent:"center"}]}>
                                                <Text>电费</Text>
                                                <Text  style={{marginTop:5}}>{item.electricMoney}元</Text>
                                            </View>

                                            <View style={[styles.aaa,{flex:2,alignItems:"center",justifyContent:"center"}]}>
                                                <Text>水费</Text>
                                                <Text  style={{marginTop:5}}>{item.waterMoney}元</Text>
                                            </View>

                                            <View style={[styles.aaa,{flex:2,alignItems:"center",justifyContent:"center"}]}>
                                                <Text>热水费</Text>
                                                <Text  style={{marginTop:5}}>{item.hotWaterMoney}元</Text>
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

    allInput:{
        borderWidth:1,borderColor:"#f0f0f0",width:'70%',borderRadius:5
    },

    allLine:{flexDirection:"row",alignItems:"center",justifyContent:"center",marginTop:10},
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
        borderBottomWidth:1,
        borderBottomColor:"#ccc"
    },

    e:{
        backgroundColor:"#fff"
    },
    aaa:{
        paddingTop:10,paddingBottom:10,paddingLeft:3,paddingRight:3,borderRightWidth:1,borderRightColor:"#ccc",
    },
    
    f:{
        flex:1,color:"grey"
    }
});

export default connect (
    state => ({reduxData: state.reduxData}),
    dispath => bindActionCreators({setHotelNo},dispath)
)(Mine);