import React, { Component } from 'react';
import {StyleSheet,Linking,Alert,Keyboard,FlatList, TextInput,Text, View, Image,ListView,TouchableHighlight, Platform,ScrollView,Dimensions,Modal} from 'react-native';

import axios from "../../axios";
import JPushModule from 'jpush-react-native'

import {Picker,DatePicker,Toast} from 'antd-mobile'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setHotelNo,getData} from '../../components/active/reducer';
import s1 from "./style/234.png";
import s2 from "./style/sanjiao.png";
import close from "./style/close.png";
import zhen from "./style/zhen.png";
import zhen2 from "./style/zhen2.png";
import topBg from "./style/topBg.png";
import shaixuan from "./style/shaixuan.png";
import stop from "./style/stop.png";
import moment from "moment";


import selectIcon from './style/selectIcon.png'
import LinearGradient from 'react-native-linear-gradient';

import DeviceInfo from 'react-native-device-info';


const CustomChildren = props => {
    return (
        <TouchableHighlight style={{}} underlayColor="transparent" onPress={props.onClick}>

            <View style={{backgroundColor:"#fff",flexDirection:"row",width:"100%",borderColor:"#ccc",borderWidth:1,borderRadius:15,overflow:'hidden'}}>
                <View style={{flex:3,padding:8}}><Text>{props.extra}</Text></View>
                <View style={{flex:1,padding:8,backgroundColor:'#0074c3',alignItems:"center",justifyContent:"center",borderColor:"#0074c3",borderWidth:1,}}><Image style={{height:10,width:15}} source={s1}/></View>
            </View>
        </TouchableHighlight>
    )
};



const RoomInfo = props => {
    return (
        <TouchableHighlight style={{}} underlayColor="transparent" onPress={props.onClick}>

            <View style={{width:"100%",flexDirection:"row",borderColor:"#ccc",borderWidth:1,borderRadius:5,overflow:'hidden',padding:10}}>
                <View style={{flex:3,}}><Text>{props.extra}</Text></View>
                <View style={{flex:1,alignItems:"center",justifyContent:"center",}}><Image style={{height:10,width:15}} source={s2}/></View>
            </View>
        </TouchableHighlight>
    )
};



const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class A extends Component {
    constructor(props) {
        super(props);
        this.state = {

            userData:{},
            userInfo:"",
            modal:"查看报价",
            district:[],//选择不同门店
            roomInfo:[],//选择房型信息
            buildingInfo:[],//选择楼栋信息
            layerInfo:[],//选择楼层信息
            room:null,//选中的房型
            build:null,//选中的楼栋
            layer:null,//选中的楼层
            value:null,//选中的门店
            roomInfoList:'',
            buildingInfoList:'',
            layerInfoList:'',
            roomTypeNo:'',
            floorNo:'',
            buildingNo:'',

            customerFrom:[

            ],//客户来源

            comefromList:'',

            leaseData:[
                {
                    label:'1个月',
                    value: '1个月'
                },

                {
                    label:'3个月',
                    value: '3个月'
                },
                {
                    label:'半年',
                    value: '半年'
                },
                {
                    label:'一年',
                    value: '一年'
                }
            ],//租期选择
            customer:[],
            lease:['一年'],

            tedian:[
                {
                    value:"wifi",
                    flag:false
                },
                {
                    value:"电视",
                    flag:false
                },
                {
                    value:"电脑",
                    flag:false
                },
                {
                    value:"空调",
                    flag:false
                },
                {
                    value:"有窗户",
                    flag:false
                },

                {
                    value:"无烟房",
                    flag:false
                },

            ],//房间特征

            roomTedian:"",//选中的房间特点
            constractStr:null,//选中的合同状态
            billStr:null,//选中的账单状态

            constractStatus:[
                {
                    value:"新签",
                    flag:false
                },
                {
                    value:"到期",
                    flag:false
                },


            ],//合同状态

            billStatus:[
                {
                    value:"逾期",
                    flag:false
                },
                {
                    value:"待收",
                    flag:false
                },
                {
                    value:"已收",
                    flag:false
                },


            ],//账单状态
            date:new Date(),
            animationType: 'none',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示

            refreshing:false,
            flag:false,
            aa:false,

            hotelList:[],
            roomData:[],
            price:{},



        };

        this.defaultValue = '';
        this.hotelNo = '';



    }


    getMyMsg = () => {
        axios.post(`/empMsg/getMyMsg`, {

        })
            .then( (response)=> {
                console.log(response,'消息定时');

                let unread = [];

                unread = response.data.unreadList && response.data.unreadList;
                this.props.getData(unread);
            })
            .catch(function (error) {
                console.log(error);
            });
    };







    componentWillMount(){
        console.log(DeviceInfo.getVersion());

        // alert('1234qw');

        storage.load({ //读取tokenKey
            key: 'username',
            autoSync: false
        }).then(ret => {
            console.log(ret);

            let a = [];
            let hotelList = ret.hotelList;

            hotelList.map((item)=>{
                let b = {
                    value:item.hotelNo,
                    label:item.hotelName,

                }
                
                a.push(b)
                
            })
            
            console.log(a[0].value);

            this.defaultValue = a[0].value;
            this.hotelNo = a[0].value;


            let b = [];
            b[0] = a[0].value

            this.getRoomState();

            this.setState({
                district:a,
                value:b
            })

            // ret.hotelNo=this.hotelNo;
            this.props.setHotelNo(this.hotelNo);
            // return ret

                }
            ).catch(
                (error) => {
                    reject(error);
                })



        //长链接实时获取消息
        this.getMyMsg();
        global.stopMsgTime = setInterval(this.getMyMsg, 300000);


    }

    //获取房态

    getRoomState = ()=>{
        axios.post(`/roomState/getRoomStateByParam`, {
            hotelNo:this.hotelNo,
        })
            .then((response) =>{
                console.log(response,'获取房态');

                this.setState({
                    aa:true
                },()=>{
                    if(response.data.code==0){
                        console.log(response.data.data);
                        this.setState({
                            roomData:response.data.data
                        })

                    }else if(response.data.code==1){
                        Toast.info(response.data.message,1)
                    }
                })



            })
            .catch(function (error) {
                console.log(error);
            })
    }
    //刷新
    onRefresh=()=>{
        this.setState({
            refreshing:true
        },()=>{
            axios.post(`/roomState/getRoomStateByParam`, {
                hotelNo:this.hotelNo,
            })
                .then((response) =>{
                    console.log(response,'获取房态');
                    this.setState({
                        refreshing:false
                    })

                    if(response.data.code==0){
                        console.log(response.data.data);
                        this.setState({
                            roomData:response.data.data
                        })

                    }

                })
                .catch(function (error) {
                    console.log(error);
                })


        })



    }


    componentDidMount() {


        const { navigate } = this.props.navigation;

        if(Platform.OS === 'android'){
            JPushModule.notifyJSDidLoad(resultCode=>console.log(resultCode))//报错
        }


        JPushModule.addReceiveCustomMsgListener((message) => {
            console.log(message);
        });
        JPushModule.addReceiveNotificationListener((message) => {
            console.log("receive notification: " + JSON.stringify(message));
        });

        JPushModule.addReceiveOpenNotificationListener((map) => {
            navigate('Message',{ user:"" })

        })
    }


    componentWillUnmount() {

        JPushModule.removeReceiveCustomMsgListener();

        JPushModule.removeReceiveNotificationListener();



    }


    //获取房型编号
    getRoomNo = (data)=>{
        this.setState({room:data})
    };

    //获取楼栋编号
    getBuildingNo = (data)=>{

        this.setState({build:data})
    };

    //获取楼层编号
    getLayerNo = (data)=>{

        let {layerInfoList} = this.state;


        this.setState({layer:data}

            ,()=>{
                layerInfoList.map((item)=>{
                    if(item.floorName==data[0]){
                        this.setState({
                            floorNo:item.floorNo
                        })
                    }
                })}

        )
    };

    //点击每个房间
    allHomeGrid=(data)=>{
        
        console.log(data);

        if(data.tradeType!=2){
            this.setState({
                userData:data,
                modal:"",
            },()=>{
                this._setModalVisible(true);
            })
        }







    }


    //选择门店
    setCity=(data)=>{
        
        console.log(data);

        this.state.district.map((item)=>{
            if(item.value==data[0]){
                this.hotelNo = data[0]
            }
        })
        
        console.log(this.hotelNo);


        this.onRefresh();

        
        
        this.setState({value:data},()=>{

            this.props.setHotelNo(this.hotelNo);
        })
    }

    _setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    };


    //查看合约
    seeContract=()=>{
        const { navigate } = this.props.navigation;

        let data = this.state.userData;
        data.hotelName = this.state.value;



        navigate('LeaseInfo',{ user: data });
        this.setState({ modalVisible: false });
    };

    //数据参谋
    dataReference=()=>{
        const { navigate } = this.props.navigation;

        navigate('DataReference',{ user: '' });

    };


    //点击查看报价
    seePrice=()=>{


        this.setState(
            {
                modal:"查看报价",
                flag:false,
                price:{}
            },

            ()=>{
            axios.post(`/roomState/filterInitialization`, {
                hotelNo:this.hotelNo
            })
                .then((response) =>{
                    console.log(response);

                    let data = response.data;


                    //客户来源
                    if(data.comefromList.length>0){

                        let comefromInfo = [];

                        data.comefromList.map((item)=>{
                            let b = {
                                value:item.comefromName,
                                label:item.comefromName,
                            }

                            comefromInfo.push(b)

                        })

                        let customer = [];
                        customer[0] = comefromInfo[0].value;



                        this.setState({
                            customerFrom:comefromInfo,
                            customer,
                            comefromList:data.comefromList
                        })
                    }



                })
                .catch(function (error) {
                    console.log(error);
                })
        });


    };


    //筛选确定
    submitScreening=()=>{

        let a = [];
        this.state.tedian.map((item)=>{
            item.flag && a.push(item.value);
        })

        axios.post(`/roomState/getRoomStateByParam`, {
            hotelNo:this.hotelNo,
            roomtypeNo:this.state.room?this.state.room[0]:null,
            // floorNo:this.state.floorNo,
            buildingNo:this.state.build?this.state.build[0]:null,
            nameRoom:this.state.userInfo,
            moneyExpired:this.state.billStr,
            contractExpired:this.state.constractStr,
            label:a.join(','),

        })
            .then((response) =>{
                console.log(response,'筛选获取房态');


                if(response.data.code==0){
                    console.log(response.data.data);
                    this.setState({
                        roomData:response.data.data
                    })

                }

            })
            .catch(function (error) {
                console.log(error);
            })

        this.setState({ modalVisible: false });


    };


    //选择房间特点
    tedian=(item)=>{

        let {tedian} = this.state;

        tedian.map((_item)=>{
            if(_item.value==item.value){
                _item.flag=!item.flag;
            }

        })

        this.setState({
            tedian
        })

    };


    //选择合同状态
    constractStatus=(item)=>{

        let {constractStatus} = this.state;

        constractStatus.map((_item)=>{
            if(_item.value==item.value){
                _item.flag=!item.flag;
            }else {
                _item.flag = false
            }

        })

        this.setState({
            constractStatus
        },()=>{
            if(item.flag){
                this.setState({
                    constractStr:item.value=='新签'?-7:7
                })
            }else {
                this.setState({
                    constractStr:null
                })
            }
        })

    }


    //选择账单状态
    billStatus=(item)=>{

        let {billStatus} = this.state;

        billStatus.map((_item)=>{
            if(_item.value==item.value){
                _item.flag=!item.flag;
            }else {
                _item.flag = false
            }

        })

        this.setState({
            billStatus
        },()=>{
            if(item.flag){
                this.setState({
                    billStr:item.value=='逾期'?0:item.value=='代收'?3:7
                })
            }else {
                this.setState({
                    billStr:null
                })
            }
        })

    }


    //点击筛选

    screening=()=>{

        let {tedian,constractStatus,billStatus} = this.state

        this.setState({
            modal:"screening",
            userInfo:"",
            // room:null,
            // build:null,
            // constractStr:null,
            // billStr:null,

        },()=>{



            this._setModalVisible(true);

            let data = {};



            axios.post(`/roomState/filterInitialization`, {
                hotelNo:this.hotelNo
            })
                .then((response) =>{
                    console.log(response);

                    let data = response.data;


                    //楼栋
                    if(data.buildingList.length>0){

                        let buildingInfo = [];
                        let bb = {
                            value:'',
                            label:'全部楼栋',
                        }

                        buildingInfo.push(bb)

                        data.buildingList.map((item)=>{
                            let b = {
                                value:item.buildingNo,
                                label:item.buildingName,
                            }

                            buildingInfo.push(b)

                        })




                        this.setState({
                            buildingInfo,
                            buildingInfoList:data.buildingList
                        })
                    }

                    //房型
                    if(data.roomtypeList.length>0){

                        let roomInfo = [];

                        let bb = {
                            value:'',
                            label:'全部房型',
                        }

                        roomInfo.push(bb)

                        data.roomtypeList.map((item)=>{
                            let b = {
                                value:item.roomtypeNo,
                                label:item.roomtypeName,
                            }

                            roomInfo.push(b)

                        })

                        this.setState({
                            roomInfo,
                            roomInfoList:data.roomtypeList
                        })
                    }





                })
                .catch(function (error) {
                    console.log(error);
                })

        })
    }


    //查看报价
    baojia=()=>{


        let a = ''
        this.state.comefromList.map((item)=>{
            if(item.comefromName==this.state.customer[0]){
                a = item.comeformNo
            }
        })

        axios.post(`/roomState/getRoomPrice`, {
            hotelNo:this.hotelNo,
            roomNo:this.state.userData.roomNo,
            comefrom:a,
            rentPeriod:this.state.lease[0]=='1个月'?1:this.state.lease[0]=='3个月'?3:this.state.lease[0]=='半年'?6:12,
            checkinDate:moment(this.state.date).format('YYYY-MM-DD'),
        })
            .then((response) =>{
                console.log(response);

                if(response.data.code==0&&response.data.data){
                    this.setState({
                        price:response.data.data,
                        flag:true
                    })
                }




            })
            .catch(function (error) {
                console.log(error);
            })


    }



    render(){



        let {price,roomData,refreshing,leaseData,lease,customerFrom,customer,billStatus,constractStatus,tedian,district,value,userData,modal,roomInfo,room,buildingInfo,layerInfo,layer,build} = this.state;

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
        let minDate = new Date(nowTimeStamp-1e7);
        const maxDate = new Date(nowTimeStamp+1e7);


        if (minDate.getDate() !== maxDate.getDate()) {
            minDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
        }

        function formatDate(date) {
            const pad = n => n < 10 ? `0${n}` : n;
            const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
            const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
            return `${dateStr}`;
        }


        return (


            <View style={{height: Dimensions.get('window').height,

                ...Platform.select({
                    android:{
                        paddingBottom:85,
                    },
                    ios:{
                        paddingBottom:60,
                    }
                }),

            }}>

                <View>

                    <Modal
                        animationType={this.state.animationType}
                        transparent={this.state.transparent}
                        visible={this.state.modalVisible}

                        onRequestClose={() => { this._setModalVisible(false) } }

                    >
                        <View style={[styles.container,modalBackgroundStyle]}>
                            <View style={[styles.innerContainer,innerContainerTransparentStyle]}>

                                <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>

                                    <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}>{modal=='screening'?"房间筛选":modal=='查看报价'?"查看报价":""}</Text></View>

                                    <TouchableHighlight underlayColor={"#fff"} onPress={this._setModalVisible.bind(this,false) } style={{}}>
                                        <Image style={{height:30,width:30}} source={close}/>
                                    </TouchableHighlight>


                                </View>


                                {
                                    modal=='screening'
                                        ?(
                                            // 筛选
                                            <View style={{paddingRight:20}}>

                                                <View style={styles.a}>
                                                    <Text>客户信息</Text>
                                                    <View style={styles.b}>
                                                        <TextInput
                                                            placeholder={this.state.userInfo==''?"客户姓名/房间号/手机号":this.state.userInfo}
                                                            style={{minWidth:'100%',padding:10,borderColor:"#ccc",borderWidth:1,borderRadius:5,}}
                                                            underlineColorAndroid="transparent"
                                                            onChangeText={(name) => this.setState({userInfo:name})}
                                                        >
                                                        </TextInput>
                                                    </View>
                                                </View>

                                                {roomInfo.length>0&&
                                                <View style={styles.a}>
                                                    <Text>房型信息</Text>
                                                    <View style={[styles.b,]}>

                                                        <Picker
                                                            data={roomInfo}
                                                            cols={1}
                                                            value={room}
                                                            extra="全部房型"
                                                            // onChange={(data) => {this.setCity(data)}}
                                                            onChange={data => {this.getRoomNo(data)}}
                                                            onOk={data => {this.setState({room:data})}}
                                                            className="forss">
                                                            <RoomInfo></RoomInfo>
                                                        </Picker>

                                                    </View>

                                                </View>}



                                                {buildingInfo.length>0&&
                                                <View style={styles.a}>
                                                    <Text>楼栋信息</Text>
                                                    <View style={[styles.b,]}>
                                                        <Picker
                                                            data={buildingInfo}
                                                            cols={1}
                                                            value={build}
                                                            extra="全部楼栋"

                                                            // onChange={(data) => {this.setCity(data)}}
                                                            onChange={data => {this.getBuildingNo(data)}}
                                                            onOk={data => {this.setState({build:data})}}
                                                            className="forss">
                                                            <RoomInfo></RoomInfo>
                                                        </Picker>
                                                    </View>

                                                </View>}


                                                <View style={styles.a}>
                                                    <Text>合同状态</Text>
                                                    <View style={[styles.b,]}>
                                                        <View style={{flexDirection:"row",flexWrap:"wrap"}}>

                                                            {
                                                                constractStatus.map((item,index)=>
                                                                    <TouchableHighlight
                                                                        onPress={()=>{this.constractStatus(item)}} key={index} underlayColor="transparent">
                                                                        <View style={{flexDirection:"row",marginRight:15,alignItems:"center"}}>
                                                                            <View style={{backgroundColor:item.flag ? "#0074c3" :'#fff',marginRight:5,
                                                                                width:20,height:20,borderRadius:10,borderColor:"#ccc",borderWidth:1,overflow:"hidden"}} >
                                                                                <Image style={{width:20,height:20}} source={selectIcon}/>
                                                                            </View>
                                                                            <Text>{item.value}</Text>

                                                                        </View>
                                                                    </TouchableHighlight>
                                                                )
                                                            }



                                                        </View>
                                                    </View>

                                                </View>



                                                <View style={styles.a}>
                                                    <Text>账单状态</Text>
                                                    <View style={[styles.b,]}>
                                                        <View style={{flexDirection:"row",flexWrap:"wrap"}}>

                                                            {
                                                                billStatus.map((item,index)=>
                                                                    <TouchableHighlight
                                                                        onPress={()=>{this.billStatus(item)}} key={index} underlayColor="transparent">
                                                                        <View style={{flexDirection:"row",marginRight:15,alignItems:"center"}}>
                                                                            <View style={{backgroundColor:item.flag ? "#0074c3" :'#fff',marginRight:5,
                                                                                width:20,height:20,borderRadius:10,borderColor:"#ccc",borderWidth:1,overflow:"hidden"}} >
                                                                                <Image style={{width:20,height:20}} source={selectIcon}/>
                                                                            </View>
                                                                            <Text>{item.value}</Text>

                                                                        </View>
                                                                    </TouchableHighlight>
                                                                )
                                                            }



                                                        </View>
                                                    </View>

                                                </View>


                                                <View style={{alignItems:"center",marginTop:10}}>
                                                    <LinearGradient colors={['#00adfb', '#00618e']} style={{width:100,borderRadius:5}}>
                                                        <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                                            alignItems:"center"
                                                        }} onPress={this.submitScreening }>
                                                            <Text
                                                                style={{fontSize:16,textAlign:"center",color:"#fff"}}>
                                                                确定
                                                            </Text>
                                                        </TouchableHighlight>
                                                    </LinearGradient>
                                                </View>





                                            </View>
                                        )
                                        :modal=='查看报价'?(
                                            <View style={{paddingRight:20}}>
                                                <View style={styles.a}>
                                                    <Text style={{flex:1}}>客户来源:</Text>
                                                    <View style={[styles.b,{flex:3}]}>


                                                        <Picker
                                                            data={customerFrom}
                                                            cols={1}
                                                            value={customer}
                                                            extra={customer}
                                                            // onChange={(data) => {this.setCity(data)}}
                                                            onChange={data => {this.setState({customer:data})}}
                                                            onOk={data => {this.setState({customer:data})}}
                                                            className="forss">
                                                            <RoomInfo></RoomInfo>
                                                        </Picker>



                                                    </View>

                                                </View>

                                                <View style={styles.a}>
                                                    <Text style={{flex:1}}>入住日期:</Text>
                                                    <View style={[styles.b,{flex:3}]}>

                                                        <DatePicker
                                                            extra="请选择日期"
                                                            format={val => formatDate(val)}
                                                            value={this.state.date}
                                                            mode="date"
                                                            onChange={date => this.setState({date})}
                                                            onOk={date => this.setState({date})}
                                                        >
                                                            <RoomInfo></RoomInfo>
                                                        </DatePicker>



                                                    </View>

                                                </View>


                                                <View style={styles.a}>
                                                    <Text style={{flex:1}}>租期:</Text>
                                                    <View style={[styles.b,{flex:3}]}>

                                                        <Picker
                                                            data={leaseData}
                                                            cols={1}
                                                            value={lease}
                                                            extra={lease}
                                                            // onChange={(data) => {this.setCity(data)}}
                                                            onChange={data => {this.setState({lease:data})}}
                                                            onOk={data => {this.setState({lease:data})}}
                                                            className="forss">
                                                            <RoomInfo></RoomInfo>
                                                        </Picker>



                                                    </View>

                                                </View>


                                                <View style={{alignItems:"center",marginTop:10}}>
                                                    <LinearGradient colors={['#00adfb', '#00618e']} style={{width:100,borderRadius:5}}>
                                                        <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                                            alignItems:"center"
                                                        }} onPress={this.baojia }>
                                                            <Text
                                                                style={{fontSize:16,textAlign:"center",color:"#fff"}}>
                                                                确定
                                                            </Text>
                                                        </TouchableHighlight>
                                                    </LinearGradient>
                                                </View>



                                                {this.state.flag&&
                                                <View style={{alignItems:"center",marginTop:10}}>
                                                    <Text>押{price.pledge}付{price.payMonth}   <Text style={{color:"#0074c3"}}>{price.rentPrice}元/月</Text></Text>
                                                </View>}




                                            </View>
                                        ):
                                        (

                                            // 点击查看每个房间
                                            <View>
                                                <View>

                                                    <View style={{flexDirection:"row"}}>
                                                        <Text>{userData.roomNo}</Text>
                                                        <Text style={{marginLeft:20}}>{userData.customerName}</Text>
                                                    </View>

                                                    <View style={{flexDirection:"row",marginTop:20,marginBottom:20}}>
                                                        <Text style={{fontSize:20}}>精装单间</Text>
                                                        <Text  style={{marginLeft:30}}>{userData.checkinState==1?`已入住${userData.actDays}天`:`已空置${userData.actDays}天`}</Text>
                                                    </View>

                                                </View>

                                                <View style={{alignItems:"center",flexDirection:"row",justifyContent:"space-around"}}>


                                                    <View>
                                                        <LinearGradient colors={['#00adfb', '#00618e']} style={{width:100,borderRadius:5}}>
                                                            <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                                                alignItems:"center"
                                                            }} onPress={this.seePrice }>
                                                                <Text
                                                                    style={{fontSize:16,textAlign:"center",color:"#fff"}}>
                                                                    查看报价
                                                                </Text>
                                                            </TouchableHighlight>
                                                        </LinearGradient>
                                                    </View>





                                                    {userData.checkinState==1&&
                                                    <View>
                                                        <LinearGradient colors={['#00adfb', '#00618e']} style={{width:100,borderRadius:5}}>
                                                            <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                                                alignItems:"center"
                                                            }} onPress={this.seeContract }>
                                                                <Text
                                                                    style={{fontSize:16,textAlign:"center",color:"#fff"}}>
                                                                    查看合约
                                                                </Text>
                                                            </TouchableHighlight>
                                                        </LinearGradient>
                                                    </View>}






                                                </View>
                                            </View>
                                        )
                                }



                            </View>
                        </View>
                    </Modal>



                </View>


                <View>
                    <Image source={topBg} style={{height:70,width:Dimensions.get('window').width,resizeMode:"stretch"}} />
                </View>

                <View  style={{flexDirection:'row',justifyContent:'space-between',alignItems:"center",padding:10,paddingBottom:0}}>

                    <View style={{width:"60%"}}>
                        <Picker
                            data={district}
                            cols={1}
                            value={value}
                            extra={this.defaultValue}
                            // onChange={data => {this.setState({value:data})}}
                            onChange={(data) => {this.setState({data})}}
                            onOk={data => {this.setCity(data)}}
                            className="forss">
                            <CustomChildren></CustomChildren>
                        </Picker>
                    </View>

                    <TouchableHighlight underlayColor="transparent" onPress={this.dataReference} style={{backgroundColor:"#fff",borderColor:"#0074c3",borderWidth:1,borderRadius:18,padding:6}}>
                        <Text style={{color:"#0074c3"}}>数据参谋</Text>
                    </TouchableHighlight>


                    <TouchableHighlight underlayColor="transparent" onPress={this.screening}>
                        <View><Image style={{height:25,width:25}} source={shaixuan}/></View>
                    </TouchableHighlight>

                </View>


                <View style={{paddingBottom:100}}>

                    <FlatList
                        data={roomData}  //列表的渲染数据源
                        getItemLayout={(data, index) => ( {length: 80, offset: 80 * index, index} )}
                        initialNumToRender={10}  //首次渲染的条数
                        numColumns={3}
                        ListEmptyComponent={()=><View style={{marginTop:30,alignItems:"center"}}><Text>{this.state.aa?'暂无数据':'查询房态中'}</Text></View>}
                        columnWrapperStyle={{}}
                        onEndReached={this.onEndReached}  //列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
                        onEndReachedThreshold={0.1} //定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                        onRefresh={this.onRefresh} //下拉刷新
                        refreshing={refreshing} //下拉刷新时候的正在加载的符号，设置为true显示，false隐藏。加载完成，需要设置为false
                        keyExtractor={(item,index)=>`${index}`}
                        renderItem={({item})=>(
                                        <View>
                                            <View>
                                                <View style={{}} >

                                                    <View style={{width:Dimensions.get('window').width/3,padding:5}}>

                                                        <TouchableHighlight underlayColor="transparent" onPress={() => this.allHomeGrid(item)}>

                                                            <View  style={{backgroundColor:(item.checkinState==1&&item.tradeType==1)?"#0074c3":(item.checkinState==1&&item.tradeType==2)?'#8080c0':"#fff",height:60,borderColor:"transparent",borderWidth:1,borderRadius:5}}>

                                                                {(item.orderState==1&&item.tradeType==3)&&<View style={{position:"absolute",zIndex:999,top:3,right:3}}><Image source={zhen} style={{height:20,width:20}}/></View>}
                                                                {(item.orderState==1&&item.tradeType==4)&&<View style={{position:"absolute",zIndex:999,top:3,right:3}}><Image source={zhen2} style={{height:20,width:20}}/></View>}
                                                                {item.repairState==0&&<View style={{position:"absolute",zIndex:999,top:16,right:3}}><Text style={{color:"red"}}>维修</Text></View>}



                                                                <View style={{
                                                                    paddingTop: 5, paddingBottom: 5,
                                                                    alignItems: 'center', justifyContent: 'center' ,
                                                                }}>
                                                                    {item.customerName&&<Text style={{color:item.checkinState==1?"#fff":"#0074c3",marginTop:5,fontWeight:"bold"}}>{item.customerName}</Text>}
                                                                    {item.enableState==0&&<View style={{}}><Image style={{width:25,height:25}} source={stop}/></View>}
                                                                    <Text  style={{color:item.checkinState==1?"#fff":"#0074c3",paddingTop:5,fontWeight:"bold"}} >{item.roomNo}</Text>



                                                                </View>



                                                            </View>

                                                        </TouchableHighlight>

                                                    </View>


                                                </View>
                                            </View>
                                        </View>
                                    )


                        }





                    />

                </View>






            </View>



        )

    }
}


const styles = StyleSheet.create({
    grid:{
        backgroundColor:"#f0f0f0"
    },

    userItem:{
        backgroundColor:"rgba(0, 0, 0, 0.3)",
        flexDirection:"row",
        position:"absolute",
        width:Dimensions.get('window').width,
        height:50,
        alignItems:'center',
        justifyContent:'center',
        zIndex:999,
        top:60

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
    }

});

export default connect (
    state => ({reduxData: state.reduxData}),
    dispath => bindActionCreators({setHotelNo,getData},dispath)
)(A);
