import React,{Component} from 'react';
import {
    FlatList, View,Alert, DeviceEventEmitter, ScrollView, Text, TouchableHighlight, TextInput, Image, Modal, StyleSheet,
    Platform, Linking
} from 'react-native';
import callIcon from '../HomePage/style/60.png'
import Dimensions from "Dimensions";
import axios from "../../axios";
import {Carousel,Toast,Picker} from 'antd-mobile'
import shaixuan from "../HomePage/style/shaixuan.png";
import s1 from "../HomePage/style/sanjiao.png";
import close from "../HomePage/style/close.png";
import selectIcon from '../HomePage/style/selectIcon.png'
import add from "../GoodSelect/style/add.png";
import moment from "moment/moment";
import AddPic from "./addPic";
import {bindActionCreators} from "redux";
import {setHotelNo} from "../../components/active/reducer";
import {connect} from "react-redux";

import LinearGradient from 'react-native-linear-gradient';
const RoomInfo = props => {
    return (
        <TouchableHighlight style={{}} underlayColor="transparent" onPress={props.onClick}>

            <View style={{width:"100%",flexDirection:"row",borderColor:"#ccc",borderWidth:1,borderRadius:5,overflow:'hidden',padding:10}}>
                <View style={{flex:3,}}><Text style={{color:"grey"}}>{props.extra}</Text></View>
                <View style={{flex:1,alignItems:"center",justifyContent:"center",}}><Image style={{height:10,width:15}} source={s1}/></View>
            </View>
        </TouchableHighlight>
    )
};

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

class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            handelMsg:[
                {
                    value:"未完成",
                    flag:true
                },

                {
                    value:"已完成",
                    flag:false
                },

            ],
            constractStatus:[
                {
                    value:"固定费用",
                    flag:false,
                    isFix:1,
                },

                {
                    value:"可变费用",
                    flag:false,
                    isFix:0,
                },

            ],
            isFixStatus:[
                {
                    label:"固定金额",
                    value:'1',
                },

                {
                    label:"月租金比例",
                    value:'2',
                },
                {
                    label:"总租金比例",
                    value:'3',
                },
                {
                    label:"固定租期比例",
                    value:'4',
                },

            ],
            feeCycleStatus:[
                {
                    label:"只缴一次，合同签定时缴",
                    value:'begin',
                },

                {
                    label:"按月缴费",
                    value:'month',
                },
                {
                    label:"按季缴费",
                    value:'season',
                },
                {
                    label:"按半年缴费",
                    value:'halfYear',
                },
                {
                    label:"按年缴费",
                    value:'year',
                },
                {
                    label:"任意时间",
                    value:'unlimit',
                },
                {
                    label:"只缴一次，退房时缴",
                    value:'end',
                },

            ],
            deductCycleStatus:[
                {
                    label:"一次性扣除所有费用",
                    value:'begin',
                },

                {
                    label:"按月扣费",
                    value:'month',
                },


            ],
            isBoss:false,
            amountJson:[],
            allFees:[],
            fees:[],
            allApply:[],
            AllAnnal:[],
            sortTradeData:null,
            piker1:[],
            modal:'',
            roomNo:'',
            remark:'',
            piker2:[],
            piker1Val:[''],
            piker2Val:[''],
            changeMsg:"未完成",
            refreshing:false,
            animationType: 'none',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示

        }

        this.approvalStatus = ['申请中' ,'已处理','已驳回' ]
        this.orderStateStatus = ['取消', '预定', '排房', '入住' ,'退房' ,'NO_SHOW']
        this.orderStateStatusColor = ['grey', 'blue', 'green', 'red' ,'purple' ,'orange']
        this.amountTypeStatus = ['定金' ,'意向金']
        this.approvalStatusColor = ['#00adfb' ,'grey','red' ]
        this.appovalSortData = []
        this.approvalId = ''
        this.data = ['','元','%','%','元/月']

    }


    checkRoom = (item)=>{
        let {sortTradeData} = this.state
        sortTradeData.map(_item=>{
            if(_item.id==item.id){
                _item.flag = true
            }else {
                _item.flag = false
            }
        })
        this.setState({
            sortTradeData
        })
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

            if(this.state.changeMsg=='查房记录'){

                this.getMeter()

            }

        })

    }

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
        })

    }


    changeFee=(item)=>{

        let {fees} = this.state;

        fees.map((_item)=>{
            if(_item.feeCode==item.feeCode){
                _item.flag=!item.flag;
            }else {
                _item.flag = false
            }

        })

        this.getStatus(item)

        this.setState({
            fees
        })

    }

    changeAllAmountJson = (data,item,lateFees)=>{
        let {amountJson} = this.state
        if(lateFees){
            amountJson[0].lateFees = data
        }else {
            amountJson[0].payItems.map(_item=>{
                if(_item.pay==item.pay){
                    _item.money = data

                }
            })
        }

        this.setState({
            amountJson
        })
    }

    changeAllAmountPayJson = (data,item,index)=>{
        let {amountJson} = this.state
        amountJson[0].payItems.map((_item,_index)=>{
            if(_index==index){
                _item.pay = data

            }
        })

        this.setState({
            amountJson
        })
    }

    changeAllFees = (data,item,name)=>{
        let {fees} = this.state
        fees.map(_item=>{
            if(_item.feeCode==item.feeCode){

                // if(name=='amount' || name=='feeRate'){
                //     if(item.isFix==1 || item.isFix==4){
                //         _item.amount = data;
                //     }else {
                //         _item.feeRate = data;
                //     }
                // }

                switch (name)
                {
                    case 'amount':
                        _item.amount = data;

                        break;
                    case 'feeRate':
                        _item.feeRate = data;
                        break;
                    case 'isFix':
                        _item.isFix = data[0];
                        if(!_item.amount){
                            _item.amount = ''
                        }
                        if(!_item.feeRate){
                            _item.feeRate = ''
                        }
                        break;
                    case 'feeCycle':
                        _item.feeCycle = data[0];
                        break;
                    case 'deductCycle':
                        _item.deductCycle = data[0];
                        break;
                    case 'remark':
                        _item.deductCycle =data;
                        break;
                    case 'isPerson':
                        _item.isPerson = !data;
                        break;
                    default:
                        return false
                }

            }
        })
        this.setState({
            fees
        })
    }



    onRefresh = ()=>{

        this.setState({
            refreshing:true
        },()=>{
            this.queryAllApply()
            this.queryAllAnnal()
        })




    }

    addAppoval = ()=>{
        this.setState({
            roomNo:'',
            remark:'',
            piker1Val:[''],
            piker2Val:[''],
            modal:'添加审批',
            sortTradeData:null,
            modalVisible:true
        },()=>{
            this.getPickerData(this.appovalSortData)
        })
    }

    submitAll=()=>{
        let {roomNo,piker1Val,piker2Val,remark,sortTradeData} = this.state
        if(!piker2Val[0]){
            alert('请选择审批类')
            return
        }
        if(piker1Val[0]=="approval_check_out"&&!roomNo){
            alert('请填写退房房间号')
            return
        }
        if(!remark){
            alert('请填写备注')
            return
        }
        if(sortTradeData&&sortTradeData.length>0&&!sortTradeData.filter(_item => _item.flag == true)[0]){
            alert('请选择需审批审批的数据')
            return
        }

        if(sortTradeData&&sortTradeData.length==0){
            alert('未查询到数据')
            return
        }

        axios.post(`/approval/addAppoval`, {
            hotelNo:this.props.reduxData.hotelNo,
            approvalType:piker2Val[0],
            remark:remark,
            tradeNo:sortTradeData&&sortTradeData.length>0?sortTradeData.filter(_item => _item.flag == true)[0].orderNo:'',
            roomNo:roomNo,
        })
            .then((response) =>{
                console.log(response,'添加审批');
                if(response.data.code==0){
                    this.setState({
                        modalVisible:false
                    })
                    this.onRefresh()
                }else {
                    alert(response.data.message)
                }

            })
            .catch(function (error) {
                console.log(error);
            })
    }

    queryAllApply = ()=>{
        axios.post(`/approval/queryAllApply`, {
            hotelNo:this.props.reduxData.hotelNo,
        })
            .then((response) =>{
                console.log(response,'进行中');
                if(response.data.code==0){
                    this.setState({
                        isBoss:response.data.isBoss,
                        // allApply:response.data.data,
                        allApply: response.data.data,
                        refreshing:false

                    })
                }else {
                    Toast.info(response.data.message)
                }

            })
            .catch(function (error) {
                console.log(error);
            })
    }

    getPickerData = (data) => {
        let piker1 = []
        data.map(item=>{
            let a = {
                value:item.dicKey,
                label:item.dicValue
            }
            piker1.push(a)
        })
        this.setState({
            piker1,
            piker1Val:[piker1[0].value],

        },()=>{
            this.getPicker2Data(data,this.state.piker1Val)
        })
    }



    getPicker2Data = (data,piker1Val) => {
        let piker2 = []
        let a = {}
        data.map(item=>{
            if(item.dicKey==piker1Val){
                item.item.map(_item=>{
                    a = {
                        value:_item.id+'',
                        label:_item.dicValue
                    }
                    piker2.push(a)
                })


            }

        })
        this.setState({
            piker2,
            piker2Val:[piker2[0].value],
        },()=>{
            this.getSortTrade(this.state.piker2Val)
        })

    }

    //打电话
    call = (item)=>{
        Linking.openURL(`tel:${item}`);
    }

    queryAllAnnal = ()=>{
        axios.post(`/approval/queryAllAnnal`, {
            hotelNo:this.props.reduxData.hotelNo,
            page:1
        })
            .then((response) =>{
                console.log(response,'已完成');
                if(response.data.code==0){
                    this.setState({
                        AllAnnal:response.data.data,
                        })
                }else {
                    Toast.info(response.data.message)
                }

            })
            .catch(function (error) {
                console.log(error);
            })
    }
    getSortTrade = (data)=>{
        if(!data[0]){
            return
        }
        console.log(this.props.reduxData,'this.props.reduxData');
        axios.post(`/approval/getSortTrade`, {
            keySort:data[0],
            hotelNo:this.props.reduxData.hotelNo,
            page:1
        })
            .then((response) =>{
                console.log(response,'根据审批状态获取数据');
                if(response.data.code==0){
                    this.setState({
                        sortTradeData:response.data.data
                    })
                }else {
                    alert(response.data.message)
                }

            })
            .catch(function (error) {
                console.log(error);
            })
    }


    getAppovalSort = ()=>{
        axios.post(`/approval/getAppovalSort`, {
        })
            .then((response) =>{
                console.log(response,'下拉框列表');
                if(response.data.code==0){
                    this.appovalSortData = response.data.data
                    this.getPickerData(this.appovalSortData)
                }else {
                    Toast.info(response.data.message)
                }

            })
            .catch(function (error) {
                console.log(error);
            })
    }


    processApproval = (id,approvalStatus)=>{
        let {fees,amountJson} = this.state
        console.log(fees,'feesfeesfeesfees');
        console.log(amountJson,'amountJsonamountJsonamountJsonamountJson');
        let data = {
            id,
            approvalStatus,
        }
        if(approvalStatus==1&&fees.length>0){
            data.fees = JSON.stringify(fees)
            data.amountJson = JSON.stringify(amountJson)
        }
        this.setState({
            modalVisible:false
        },()=>{
            axios.post(`/approval/processApproval`,
                data
            )
                .then((response) =>{
                    console.log(response,'确定处理');
                    if(response.data.code==0){
                        Toast.info('处理成功')
                        this.onRefresh()
                    }else {
                        Toast.info(response.data.message)
                    }

                })
                .catch(function (error) {
                    console.log(error);
                })
        })

    }

    cancelSelecte = ()=>{}

    getStatus = (item)=>{
        let {constractStatus} = this.state
        console.log(item,'itemitemitem');
        constractStatus.map(_item=>{
            // _item.isFix = item.isFix
            if(item.isFix == 0){
                if(_item.isFix==0){
                    _item.flag=true
                }else {
                    _item.flag=false
                }
            }else {
                if(_item.isFix!=0){
                    _item.flag=true
                }else {
                    _item.flag=false
                }
            }
            // if(item.isFix==_item.isFix){
            //     _item.flag=true
            // }else {
            //     _item.flag=false
            // }
            // if(item.isFix!=0){
            //     _item.isFix = item.isFix
            //
            // }



        })

        this.setState({
            constractStatus
        })
    }

    changeAllFeesStatus = (item)=>{
        console.log(item,'itemitemitem');
        let {allFees,fees} = this.state
        let a = []
        allFees.map(_item=>{
            if(item.feeNo==_item.feeNo){
                _item.flag = !_item.flag
                if(_item.flag==false){
                    fees.map(i=>{
                        if(i.feeCode.indexOf(item.feeNo)==-1){
                            a.push(i)
                        }
                    })
                }else {
                    a = fees
                    let b = {
                        isFix: item.isFix,
                        amount: item.amount,
                        feeRate: item.feeRate,
                        remark: item.remark,
                        feeCode: item.feeNo,
                        feeName: item.feeName,
                        feeCycle: item.feeCycle,
                        isPerson: item.isPerson?item.isPerson:false,
                        lateFees: item.lateFees,
                        deductCycle: item.deductCycle
                    }

                    a.push(b)
                }
            }
        })

        a[0].flag = true
        this.getStatus(a[0])

        this.setState({
            allFees,
            fees:a
        })
    }


    //处理审批
    getApprovalById = (id)=>{
        this.approvalId = id
        this.setState({
            amountJson:[],
            fees:[],
            allFees:[]
        },()=>{
            axios.post(`/approval/getApprovalById`, {
                // hotelNo:this.props.reduxData.hotelNo,
                id
            })
                .then((response) =>{
                    console.log(response,'处理审批数据');
                    if(response.data.code==0){
                        let data = response.data.data
                        if(!data){
                            Alert.alert('处理','确定处理？',
                                [
                                    {text:"取消", onPress:()=>{this.cancelSelecte(id)}},
                                    {text:"驳回", onPress:()=>{this.processApproval(id,2)}},
                                    {text:"确认", onPress:()=>{this.processApproval(id,1)}}
                                ],
                                { cancelable: false }
                            );
                        }else{
                            let fees = data.fees?JSON.parse(data.fees):[]
                            let allFees = data.allFees?data.allFees:[]
                            if (fees) {
                                fees[0].flag=true;
                                this.getStatus(fees[0])
                                if(allFees){
                                    // allFees.map(item => {
                                    //     let flag = false;
                                    //     fees.map(_item => {
                                    //         if(item.feeNo == _item.feeCode) {
                                    //             flag = true;
                                    //         }
                                    //     });
                                    //     if(flag) {
                                    //         item.flag = true;
                                    //     }
                                    // });
                                    allFees.map(item=>{
                                        fees.map(_item=>{
                                            if(item.feeNo.indexOf(_item.feeCode)!=-1){
                                                item.flag = true
                                            }
                                        })
                                    })
                                }
                            }
                            this.setState({
                                modalVisible:true,
                                modal:'',
                                amountJson:data.amountJson?JSON.parse(data.amountJson):[],
                                fees:fees,
                                allFees
                            })
                        }
                    }else {
                        Toast.info(response.data.message)
                    }

                })
                .catch(function (error) {
                    console.log(error);
                })
        })

    }

    componentWillMount(){
        this.queryAllApply()
        this.queryAllAnnal()
        this.getAppovalSort()
    }



    _setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    };


    render(){

        let {allFees,deductCycleStatus,feeCycleStatus,isFixStatus,constractStatus,amountJson,fees,modal,approvalData,sortTradeData,piker1Val,piker2Val,piker1,piker2,AllAnnal,isBoss,refreshing,handelMsg,changeMsg,allApply} = this.state;

        //弹框
        let modalBackgroundStyle = {
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
        };
        let innerContainerTransparentStyle = this.state.transparent
            ? { backgroundColor: '#fff', padding: 10 ,
                // height:"90%",
                overflow:"hidden"}
            : null;




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

                                <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>

                                    <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}></Text></View>



                                    <TouchableHighlight underlayColor={"#fff"} onPress={this._setModalVisible.bind(this,false) } style={{}}>
                                        <Image style={{height:30,width:30}} source={close}/>
                                    </TouchableHighlight>

                                </View>

                                {
                                    modal=='添加审批'?
                                        <View>
                                            <ScrollView style={{maxHeight:Dimensions.get('window').height-200}}>
                                                <View style={{padding:10}}>
                                                    <View style={styles.a}>
                                                        <Text style={{flex:1}}>大类:</Text>
                                                        <View style={[styles.b,{flex:3}]}>


                                                            <Picker
                                                                data={piker1}
                                                                cols={1}
                                                                value={piker1Val}
                                                                extra='大类'
                                                                // onChange={(data) => {this.setCity(data)}}
                                                                // onChange={data => {this.setState({sale:data})}}
                                                                onChange={data => {this.setState({piker1Val:data});this.getPicker2Data(this.appovalSortData,data[0])}}
                                                                onOk={data => {this.setState({piker1Val:data});this.getPicker2Data(this.appovalSortData,data[0])}}
                                                                className="forss">
                                                                <RoomInfo></RoomInfo>
                                                            </Picker>



                                                        </View>

                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={{flex:1}}>小类:</Text>
                                                        <View style={[styles.b,{flex:3}]}>


                                                            <Picker
                                                                data={piker2}
                                                                cols={1}
                                                                value={piker2Val}
                                                                extra='小类'
                                                                // onChange={(data) => {this.setCity(data)}}
                                                                // onChange={data => {this.setState({sale:data})}}
                                                                onOk={data => {console.log('data-data', data);this.setState({piker2Val:data});this.getSortTrade(data)}}
                                                                className="forss">
                                                                <RoomInfo></RoomInfo>
                                                            </Picker>



                                                        </View>

                                                    </View>

                                                    {
                                                        piker1Val[0]=="approval_check_out"?
                                                        <View style={styles.a}>
                                                            <Text style={{flex:1}}>房间号:</Text>
                                                            <View style={[styles.b,{flex:3}]}>
                                                                <TextInput
                                                                    placeholder={'房间号'}
                                                                    style={{minWidth:'100%',padding:10,borderColor:"#ccc",borderWidth:1,borderRadius:5,}}
                                                                    underlineColorAndroid="transparent"
                                                                    onChangeText={(roomNo) => this.setState({roomNo})}
                                                                >
                                                                </TextInput>
                                                            </View>
                                                        </View>:null
                                                    }

                                                    <View style={styles.a}>
                                                        <Text style={{flex:1}}>备注:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <TextInput
                                                                placeholder={'备注'}
                                                                multiline={true}
                                                                style={{minWidth:'100%',height:100,padding:10,borderColor:"#ccc",borderWidth:1,borderRadius:5,}}
                                                                underlineColorAndroid="transparent"
                                                                onChangeText={(remark) => this.setState({remark})}
                                                            >
                                                            </TextInput>
                                                        </View>
                                                    </View>


                                                    {
                                                        (sortTradeData&&sortTradeData.length>0)?sortTradeData.map((item,index)=>
                                                            <TouchableHighlight key={index} underlayColor="transparent" onPress={()=>{this.checkRoom(item)}}>
                                                                <View style={[styles.d,styles.e,{backgroundColor:item.flag?"#f0f0f0":"#fff"}]}>

                                                                    <TouchableHighlight underlayColor="transparent" onPress={()=>{this.call(item.phoneNo)}}  style={[styles.aa,{flex:3,justifyContent:"center",}]}>
                                                                        <View>
                                                                            <View style={{flexDirection:"row"}}>
                                                                                <Text style={{fontSize:16,fontWeight:'bold'}}>{item.name}</Text>
                                                                                <View><Image style={{width:18,height:18}} source={callIcon}/></View>

                                                                            </View>
                                                                        </View>
                                                                    </TouchableHighlight>


                                                                    <View style={[styles.aa,{flex:4,alignItems:"center",justifyContent:"center"}]}>
                                                                        <Text>{moment(item.checkinDate).format("YYYY-MM-DD")}<Text style={{fontSize:16,fontWeight:"bold"}}>入住</Text></Text>
                                                                        <Text style={{marginTop:5}}> {moment(item.checkoutDate).format("YYYY-MM-DD")}<Text style={{fontSize:16,fontWeight:"bold"}}>退房</Text></Text>
                                                                    </View>

                                                                    <View style={[styles.aa,{flex:4,alignItems:"center",justifyContent:"center"}]}>
                                                                        <Text>{this.amountTypeStatus[item.amountType]}:<Text style={{fontSize:16,fontWeight:"bold"}}>{item.amount}</Text></Text>
                                                                        <Text style={{marginTop:5}}><Text style={{fontSize:16,fontWeight:"bold"}}>{item.roomNo}</Text></Text>
                                                                    </View>
                                                                    <View style={[styles.aa,{flex:2,alignItems:"center",justifyContent:"center"}]}>
                                                                        <Text><Text style={{fontSize:16,fontWeight:"bold",color:this.orderStateStatusColor[item.orderState]}}>{this.orderStateStatus[item.orderState]}</Text></Text>
                                                                    </View>

                                                                </View>
                                                            </TouchableHighlight>

                                                        ):null
                                                    }


                                                </View>
                                            </ScrollView>

                                            <View style={{alignItems:"center",marginTop:10}}>

                                                <LinearGradient colors={['#00adfb', '#00618e']} style={{width:100,borderRadius:5}}>
                                                    <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                                        alignItems:"center"
                                                    }} onPress={this.submitAll }>
                                                        <Text
                                                            style={{fontSize:16,textAlign:"center",color:"#fff"}}>
                                                            确定
                                                        </Text>
                                                    </TouchableHighlight>
                                                </LinearGradient>

                                            </View>

                                        </View>:
                                        <View>
                                            <ScrollView style={{maxHeight:Dimensions.get('window').height-200}}>
                                                <View style={{padding:10}}>
                                                    <View style={styles.a}>
                                                        <Text style={{flex:1}}>租期:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            {
                                                                amountJson.length>0&&
                                                                amountJson[0].payItems.map((item,index)=>

                                                                    <View style={styles.a} key={index}>
                                                                        <Text>付:</Text>
                                                                        <View style={[styles.b,{flex:1}]}>
                                                                            <TextInput
                                                                                placeholder={'租期'}
                                                                                style={{minWidth:'100%',padding:10,borderColor:"#ccc",borderWidth:1,borderRadius:5,}}
                                                                                underlineColorAndroid="transparent"
                                                                                value={item.pay+''}
                                                                                onChangeText={(pay) => this.changeAllAmountPayJson(pay,item,index)}
                                                                            >
                                                                            </TextInput>
                                                                        </View>
                                                                        <View style={[styles.b,{flex:3}]}>
                                                                            <TextInput
                                                                                placeholder={'租金'}
                                                                                style={{minWidth:'100%',padding:10,borderColor:"#ccc",borderWidth:1,borderRadius:5,}}
                                                                                underlineColorAndroid="transparent"
                                                                                value={item.money+''}
                                                                                onChangeText={(money) => this.changeAllAmountJson(money,item)}
                                                                            >
                                                                            </TextInput>
                                                                        </View>
                                                                    </View>

                                                                )
                                                            }
                                                        </View>
                                                    </View>



                                                    <View style={styles.a}>
                                                        <Text style={{flex:1}}>逾期费(元/天):</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <TextInput
                                                                placeholder={'逾期费'}
                                                                style={{minWidth:'100%',padding:10,borderColor:"#ccc",borderWidth:1,borderRadius:5,}}
                                                                underlineColorAndroid="transparent"
                                                                value={amountJson[0]&&amountJson[0].lateFees}
                                                                onChangeText={(roomNo) => this.changeAllAmountJson(roomNo,{},'lateFees')}
                                                            >
                                                            </TextInput>
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={{flex:1}}>需缴费用:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <View style={{flexDirection:"row",flexWrap:"wrap"}}>
                                                                {
                                                                    allFees.length>0&&allFees.map((item,index)=>

                                                                        <TouchableHighlight
                                                                            onPress={()=>{this.changeAllFeesStatus(item)}} key={index} underlayColor="transparent" style={{marginTop:5}}>
                                                                            <View style={{flexDirection:"row",marginRight:15,alignItems:"center"}}>
                                                                                <View style={{backgroundColor:item.flag ? "#0074c3" :'#fff',marginRight:5,
                                                                                    width:20,height:20,borderRadius:10,borderColor:"#ccc",borderWidth:1,overflow:"hidden"}} >
                                                                                    <Image style={{width:20,height:20}} source={selectIcon}/>
                                                                                </View>
                                                                                <Text>{item.feeName}</Text>

                                                                            </View>
                                                                        </TouchableHighlight>

                                                                    )
                                                                }
                                                            </View>

                                                        </View>
                                                    </View>

                                                    <View style={{width:"100%",marginTop:10}}>
                                                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                                            {
                                                                fees.length>0&&fees.map((item,index)=>

                                                                    <TouchableHighlight underlayColor="transparent" onPress={()=>{this.changeFee(item)}} key={index} style={{backgroundColor:item.flag?"#fff":"#f0f0f0",padding:10,marginRight:5,borderBottomColor:item.flag?"#7ebef9":"#ccc",borderBottomWidth:4}}>
                                                                        <Text>
                                                                            {item.feeName}
                                                                        </Text>
                                                                    </TouchableHighlight>

                                                                )
                                                            }
                                                        </ScrollView>
                                                    </View>

                                                    <View style={{marginTop:10}}>
                                                        {
                                                            fees.length>0&&fees.map((item,index)=>
                                                                item.flag&&
                                                                <View key={index}>
                                                                    <View style={styles.a}>
                                                                        <Text>费用类型:</Text>
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
                                                                            {
                                                                                (constractStatus.filter(_item => _item.flag == true)[0]&&
                                                                                    constractStatus.filter(_item => _item.flag == true)[0].isFix!=0)?
                                                                                // item.isFix!=0?
                                                                                    <View>
                                                                                        <View style={{marginTop:10}}>
                                                                                            <View style={[styles.b,{flex:3}]}>
                                                                                                <Picker
                                                                                                    data={isFixStatus}
                                                                                                    cols={1}
                                                                                                    value={[item.isFix+'']}
                                                                                                    extra='请选择费用类型'
                                                                                                    // onChange={(data) => {this.setCity(data)}}
                                                                                                    // onChange={data => {this.setState({sale:data})}}
                                                                                                    onOk={data => {this.changeAllFees(data,item,'isFix')}}
                                                                                                    className="forss">
                                                                                                    <RoomInfo></RoomInfo>
                                                                                                </Picker>
                                                                                            </View>

                                                                                        </View>
                                                                                        <View style={{marginTop:10}}>
                                                                                            <View style={[styles.b,{flex:3,flexDirection:"row",}]}>
                                                                                                <TextInput
                                                                                                    placeholder={'请填写金额'}
                                                                                                    style={{minWidth:'80%',padding:10,borderColor:"#ccc",borderWidth:1,borderRadius:5,}}
                                                                                                    underlineColorAndroid="transparent"
                                                                                                    value={(item.isFix==1 || item.isFix==4)?item.amount+'':item.feeRate+''}
                                                                                                    onChangeText={(amount) => this.changeAllFees(amount,item,(item.isFix==1 || item.isFix==4)?'amount':'feeRate')}
                                                                                                >
                                                                                                </TextInput>
                                                                                                <View style={{alignItems:'center',justifyContent:"center"}}>
                                                                                                    <Text>{this.data[item.isFix-0]}</Text>
                                                                                                </View>

                                                                                            </View>

                                                                                        </View>
                                                                                    </View>:null
                                                                            }

                                                                        </View>

                                                                    </View>

                                                                    <View style={styles.a}>
                                                                        <Text style={{flex:1}}>缴费周期:</Text>
                                                                        <View style={[styles.b,{flex:3}]}>
                                                                            <Picker
                                                                                data={feeCycleStatus}
                                                                                cols={1}
                                                                                value={[item.feeCycle+'']}
                                                                                extra='缴费周期'
                                                                                // onChange={(data) => {this.setCity(data)}}
                                                                                // onChange={data => {this.setState({sale:data})}}
                                                                                onOk={data => {this.changeAllFees(data,item,'feeCycle')}}
                                                                                className="forss">
                                                                                <RoomInfo></RoomInfo>
                                                                            </Picker>
                                                                        </View>
                                                                    </View>

                                                                    <View style={styles.a}>
                                                                        <Text style={{flex:1}}>扣费周期:</Text>
                                                                        <View style={[styles.b,{flex:3}]}>
                                                                            <Picker
                                                                                data={deductCycleStatus}
                                                                                cols={1}
                                                                                value={[item.deductCycle+'']}
                                                                                extra='扣费周期'
                                                                                // onChange={(data) => {this.setCity(data)}}
                                                                                // onChange={data => {this.setState({sale:data})}}
                                                                                onOk={data => {this.changeAllFees(data,item,'deductCycle')}}
                                                                                className="forss">
                                                                                <RoomInfo></RoomInfo>
                                                                            </Picker>
                                                                        </View>
                                                                    </View>

                                                                    <View style={styles.a}>
                                                                        <Text style={{flex:1}}>备注:</Text>
                                                                        <View style={[styles.b,{flex:3}]}>
                                                                            <TextInput
                                                                                placeholder={'请填写备注'}
                                                                                style={{minWidth:'100%',padding:10,borderColor:"#ccc",borderWidth:1,borderRadius:5,}}
                                                                                underlineColorAndroid="transparent"
                                                                                // value={item.amount}
                                                                                onChangeText={(amount) => this.changeAllFees(amount,item,'remark')}
                                                                            >
                                                                            </TextInput>
                                                                        </View>
                                                                    </View>
                                                                    <View style={styles.a}>
                                                                        <Text style={{flex:1}}>是否按人头收费:</Text>
                                                                        <View style={[styles.b,{flex:3}]}>
                                                                            <TouchableHighlight
                                                                                onPress={()=>{this.changeAllFees(item.isPerson,item,'isPerson')}} underlayColor="transparent">
                                                                                <View style={{flexDirection:"row",marginRight:15,alignItems:"center"}}>
                                                                                    <View style={{backgroundColor:item.isPerson ? "#0074c3" :'#fff',marginRight:5,
                                                                                        width:20,height:20,borderRadius:10,borderColor:"#ccc",borderWidth:1,overflow:"hidden"}} >
                                                                                        <Image style={{width:20,height:20}} source={selectIcon}/>
                                                                                    </View>

                                                                                </View>
                                                                            </TouchableHighlight>
                                                                        </View>
                                                                    </View>

                                                                </View>

                                                            )
                                                        }
                                                    </View>
                                                </View>
                                            </ScrollView>
                                            <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center",marginTop:10}}>
                                                <LinearGradient colors={['#00adfb', '#00618e']} style={{width:100,borderRadius:5}}>
                                                    <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                                        alignItems:"center"
                                                    }} onPress={()=>{this.processApproval(this.approvalId,2)} }>
                                                        <Text
                                                            style={{fontSize:16,textAlign:"center",color:"#fff"}}>
                                                            驳回
                                                        </Text>
                                                    </TouchableHighlight>
                                                </LinearGradient>

                                                <LinearGradient colors={['#00adfb', '#00618e']} style={{width:100,borderRadius:5}}>
                                                    <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                                        alignItems:"center"
                                                    }} onPress={()=>{this.processApproval(this.approvalId,1)} }>
                                                        <Text
                                                            style={{fontSize:16,textAlign:"center",color:"#fff"}}>
                                                            确定
                                                        </Text>
                                                    </TouchableHighlight>
                                                </LinearGradient>



                                            </View>
                                        </View>
                                }










                            </View>
                        </View>
                    </Modal>



                </View>



                {
                    changeMsg=='未完成'?

                        <View>
                            <View style={{
                                ...Platform.select({
                                    android:{
                                        paddingBottom:!isBoss?210:130,
                                    },
                                    ios:{
                                        // paddingBottom:100,
                                        paddingBottom:!isBoss?180:100,
                                    }
                                }),}}>
                                {
                                    !isBoss&&
                                    <TouchableHighlight style={{flexDirection:"row-reverse",marginTop:5}} underlayColor="transparent" onPress={()=>{this.addAppoval()}}>
                                        <View><Image source={add} style={{width:20,height:20}}/></View>
                                    </TouchableHighlight>
                                }


                                <View>
                                    <FlatList
                                        data={allApply}  //列表的渲染数据源
                                        ListEmptyComponent={()=><View style={{marginTop:30,alignItems:"center"}}><Text></Text></View>} //列表没有数据时展示，箭头函数中可以写一个react组件
                                        getItemLayout={(data, index) => ( {length: 80, offset: 80 * index, index} )}
                                        initialNumToRender={10}  //首次渲染的条数
                                        // onEndReached={()=>{this.onEndReached(1)}} //列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
                                        onEndReachedThreshold={0.1} //定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                                        onRefresh={this.onRefresh} //下拉刷新
                                        refreshing={refreshing} //下拉刷新时候的正在加载的符号，设置为true显示，false隐藏。加载完成，需要设置为false
                                        keyExtractor={(item,index)=>`${index}`}
                                        renderItem={({item}) => (  //渲染列表的方式

                                            <View style={[styles.d,styles.e,]}>

                                                <View style={[{flex:3,justifyContent:"center"}]}>

                                                    <Text style={{color:"grey",marginRight:5}}>{setDate(item.createTime)}---{item.operationName}</Text>
                                                    <Text style={{marginTop:5,fontWeight:"bold"}}>{item.hotelName}--{item.roomNo}</Text>
                                                    <Text style={{marginTop:5,fontWeight:"bold"}}>{item.approvalType}</Text>
                                                    <Text style={{color:"grey",marginTop:5}}>{item.remark}</Text>

                                                </View>


                                                <View style={[{flex:1,alignItems:"center",justifyContent:"center"}]}>
                                                    <Text style={{color:this.approvalStatusColor[item.approvalStatus]}}>{this.approvalStatus[item.approvalStatus]}</Text>
                                                    {isBoss&&<TouchableHighlight onPress={()=>{this.getApprovalById(item.approvalId)}} underlayColor="transparent" style={{marginTop:5}}><Text style={{color:"red"}}>处理</Text></TouchableHighlight>}
                                                </View>

                                            </View>


                                        )}
                                    />
                                </View>
                            </View>
                        </View>

                        :
                        <View>
                            <View style={{
                                ...Platform.select({
                                    android:{
                                        paddingBottom:130,
                                    },
                                    ios:{
                                        paddingBottom:100,
                                    }
                                }),}}>

                                <View>
                                    <FlatList
                                        data={AllAnnal}  //列表的渲染数据源
                                        ListEmptyComponent={()=><View style={{marginTop:30,alignItems:"center"}}><Text></Text></View>} //列表没有数据时展示，箭头函数中可以写一个react组件
                                        getItemLayout={(data, index) => ( {length: 80, offset: 80 * index, index} )}
                                        initialNumToRender={10}  //首次渲染的条数
                                        // onEndReached={()=>{this.onEndReached()}} //列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
                                        onEndReachedThreshold={0.1} //定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                                        onRefresh={this.onRefresh} //下拉刷新
                                        refreshing={refreshing} //下拉刷新时候的正在加载的符号，设置为true显示，false隐藏。加载完成，需要设置为false
                                        keyExtractor={(item,index)=>`${index}`}
                                        renderItem={({item}) => (  //渲染列表的方式
                                            <View style={[styles.d,styles.e,]}>

                                                <View style={[{flex:3,justifyContent:"center"}]}>
                                                    <Text style={{color:"grey",marginRight:5}}>{item.createTime}---{item.operationName}</Text>
                                                    <Text style={{marginTop:5,fontWeight:"bold"}}>{item.hotelName}--{item.roomNo}</Text>
                                                    <Text style={{marginTop:5,fontWeight:"bold"}}>{item.approvalType}</Text>
                                                    <Text style={{color:"grey",marginTop:5}}>{item.remark}</Text>
                                                </View>

                                                <View style={[{flex:1,alignItems:"center",justifyContent:"center"}]}>
                                                    <Text style={{color:"grey"}}>{item.completeTime}</Text>
                                                    <Text style={{color:this.approvalStatusColor[item.approvalStatus],marginTop:5}}><Text style={{color:"grey"}}>{item.completeName}--</Text>{this.approvalStatus[item.approvalStatus]}</Text>
                                                    <Text style={{color:"grey",marginTop:5}}>{item.rejectOpinion}</Text>
                                                </View>

                                            </View>



                                        )}
                                    />
                                </View>
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
        borderBottomColor:"#ccc",
        padding:10
    },

    e:{
        backgroundColor:"#fff"
    },
    aaa:{
        paddingTop:10,paddingBottom:10,paddingLeft:3,paddingRight:3,borderRightWidth:1,borderRightColor:"#ccc",
    },
});

export default connect (
    state => ({reduxData: state.reduxData}),
    dispath => bindActionCreators({setHotelNo},dispath)
)(Mine);
