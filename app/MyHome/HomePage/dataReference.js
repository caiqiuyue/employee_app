import React, { Component } from 'react';
import {
    StyleSheet, TextInput, Text, View, Image, ActivityIndicator, TouchableHighlight, Platform, ScrollView, Dimensions,
    Modal,
    Linking, Alert
} from 'react-native';
import s1 from "./style/sanjiao.png";
import share from "./style/share.png";
import axios from "../../axios";
import moment from "moment";
import {Toast,DatePicker} from "antd-mobile";
import Loading from './loading';
import * as wechat from "react-native-wechat";
import {bindActionCreators} from "redux";
import {setHotelNo} from "../../components/active/reducer";
import {connect} from "react-redux";

import LinearGradient from 'react-native-linear-gradient';
const RoomInfo = props => {
    return (
        <TouchableHighlight style={{}} underlayColor="transparent" onPress={props.onClick}>

            <View style={{width:"100%",flexDirection:"row",borderColor:"#ccc",borderWidth:1,borderRadius:5,overflow:'hidden',padding:5}}>
                <View style={{flex:3,}}><Text>{props.extra}</Text></View>
                <View style={{flex:1,alignItems:"center",justifyContent:"center",}}><Image style={{height:10,width:15}} source={s1}/></View>
            </View>
        </TouchableHighlight>
    )
};

class A extends Component {
    constructor(props) {
        super(props);
        this.state = {
            handelMsg:[
                {
                    value:"收银数据",
                    flag:true
                },

                {
                    value:"经营数据",
                    flag:false
                },

                {
                    value:"销售数据",
                    flag:false
                },

                {
                    value:"可售房源",
                    flag:false
                },
            ],
            changeMsg:"收银数据",
            hotelNo:"",
            incomeData:{},
            manageData:{},
            salesData:{},
            roomData:{},
            modalVisible:false,

            date1:new Date(moment(new Date()).subtract(1, 'days')),
            date2:new Date(moment(new Date()).subtract(1, 'days')),


        };

        this.tokenKey = '';

        

    }



    _showLoading() {

        this.setState({
            modalVisible:true
        },()=>{
            setTimeout(()=>{
                this.setState({
                    modalVisible:false
                })
            },500)

        })

    }



    componentWillMount(){

        this.getAll()

    }



    //收银数据
    incomeData = ()=>{
        let {date1,date2} = this.state;
        axios.post(`/analyze/incomeData`, {
            hotelNo:this.props.reduxData.hotelNo,
            beginDate:moment(date1).format('YYYY-MM-DD'),
            endDate:moment(date2).format('YYYY-MM-DD'),
        })
            .then((response) =>{
                console.log(response,'收银数据');

                this.setState({
                    incomeData:response.data
                })



            })
            .catch(function (error) {
                console.log(error);
            })



    }


    //经营数据
    manageData = ()=>{

        let {date1,date2} = this.state
        axios.post(`/analyze/manageData`, {
            hotelNo:this.props.reduxData.hotelNo,
            beginDate:moment(date1).format('YYYY-MM-DD'),
            endDate:moment(date2).format('YYYY-MM-DD'),

        })
            .then((response) =>{
                console.log(response,'经营数据');
                this.setState({
                    manageData:response.data
                })

            })
            .catch(function (error) {
                console.log(error);
            })
    }


    getAll = ()=>{


        //读取
        storage.load({
            key: 'tokenKey',
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: false
        }).then(ret => {
            this.tokenKey = ret.tokenKey

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

        this.incomeData();
        this.manageData();


    };



    //选择账单状态
    handelMsg=(item)=>{


        let {handelMsg,data} = this.state;

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

        })

    }




    changeDate1=(date)=>{

        let {date1,date2} = this.state

        let flag = moment(date).isBefore(date2);


        console.log(date);
        console.log(date2);

        if(flag){
            this.setState({date1:date},()=>{this.getAll();this._showLoading()})
        }else {
            Toast.info('开始日期不能比结束日期小')
        }


    }

    changeDate2=(date)=>{

        let {date1,date2} = this.state

        let flag = moment(date1).isBefore(date);

        if(flag){
            this.setState({date2:date},()=>{this.getAll();this._showLoading()})
        }else {
            Toast.info('结束日期不能比开始日期小')
        }

    }

    wxShare = ()=>{

        //读取
        storage.load({
            key: 'username',
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: false
        }).then(ret => {

            let aaa = ret.hotelList.filter(_item=>{
                return _item.hotelNo==this.props.reduxData.hotelNo
            })


            let a = encodeURI(`http://www.fangapo.cn/data.html?hotelName=${aaa[0].hotelName}&&date=${moment(this.state.date1).format('YYYY-MM-DD')}&&date2=${moment(this.state.date2).format('YYYY-MM-DD')}&&hotelNo=${this.props.reduxData.hotelNo}&&tokenKey=${this.tokenKey}`)



            wechat.shareToSession({
                title:'经营日报',
                description: `${aaa[0].hotelName} ${moment(this.state.date1).format('YYYY-MM-DD')}`,
                // thumbImage: ' http://47.95.116.56:8080/file_upload/images/app/logo.png',
                type: 'news',
                webpageUrl: a
            })
                .catch((error) => {
                    Alert.alert(error.message);
                });


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


    render(){

        let{handelMsg,changeMsg,incomeData,manageData,salesData,roomData} = this.state;
        let maxDate2 = new Date(moment(new Date()).subtract(1, 'days'));

        return (


            <View style={{height: Dimensions.get('window').height,backgroundColor:"#fff",

                ...Platform.select({
                    android:{
                        paddingBottom:85,
                    },
                    ios:{
                        paddingBottom:70
                    }
                }),



            }}>

                {/*<Loading modalVisible={this.state.modalVisible} />*/}

                <View>

                    <View>

                        <View style={{flexDirection:'row',padding:5,justifyContent:"space-between"}}>
                            <View style={{width:'40%'}}>
                                <DatePicker
                                    extra="请选择日期"
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

                            <View style={{width:'40%'}}>
                                <DatePicker
                                    extra="请选择日期"
                                    format={val => moment(val).format("YYYY-MM-DD")}
                                    value={this.state.date2}
                                    mode="date"
                                    maxDate={maxDate2}
                                    // onChange={date1 => {this.changeDate1(date1)}}
                                    onOk={date1 => {this.changeDate2(date1)}}
                                    // onOk={date1 => this.setState({date1},()=>{this.getAll()})}
                                >
                                    <RoomInfo></RoomInfo>
                                </DatePicker>
                            </View>
                            <TouchableHighlight underlayColor="transparent" onPress={this.wxShare} style={{justifyContent:"center"}}>
                                <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                                    <Image style={{width:20,height:20}} source={share}/>
                                    <Text style={{fontWeight:"bold"}}>分享</Text>
                                </View>

                            </TouchableHighlight>

                        </View>



                        <View style={{borderTopColor:"#7ebef9",borderTopWidth:1,flexDirection:"row",justifyContent:"space-around"}}>
                            {
                                handelMsg.map((item,index)=>

                                    <LinearGradient key={index} colors={[!item.flag?'#00adfb':"#fff", !item.flag?'#00618e':"#fff"]} style={{width:"25%",}}>
                                        <TouchableHighlight   onPress={()=>this.handelMsg(item)} style={{padding:10,alignItems:"center",
                                            borderBottomWidth:1,
                                            borderBottomColor:"#7ebef9",
                                        }} underlayColor="transparent" >

                                            <Text style={{color:!item.flag?"#fff":"#00adfb",fontWeight:"bold"}}>{item.value}</Text>
                                        </TouchableHighlight>
                                    </LinearGradient>
                                )
                            }
                        </View>


                    </View>

                </View>


                {this.state.modalVisible?
                    <View style={{ alignItems: 'center', justifyContent: 'center',marginTop:5}}>
                        <ActivityIndicator
                            animating={this.state.modalVisible}
                            color='grey'
                            style={{

                                width: 40,
                                height: 40,
                            }}
                            size="small" />
                    </View>:null}




                <ScrollView>

                    {changeMsg=='收银数据'?
                        (

                            incomeData&&incomeData.code==0?

                            <View style={{padding:10}}>

                                <View style={{marginTop:10,justifyContent:'space-between',flexDirection:"row"}}>
                                    <Text style={{fontSize:20,fontWeight:'bold'}}>实收</Text>
                                    <Text style={{fontSize:20,fontWeight:'bold',color:"#f17e3a"}}>{incomeData.data.received}元</Text>
                                </View>

                                <View style={{marginTop:10,flexDirection:"row",flexWrap:"wrap",justifyContent:'space-between'}}>
                                    <View style={styles.aaa}>
                                        <Text style={styles.bbb}>现金</Text>
                                        <Text style={styles.ccc}>{incomeData.data.cash}元</Text>
                                    </View>

                                    <View style={styles.aaa}>
                                        <Text style={styles.bbb}>银行卡</Text>
                                        <Text style={styles.ccc}>{incomeData.data.bank}元</Text>
                                    </View>

                                    <View style={[styles.aaa,{marginRight:0}]}>
                                        <Text style={styles.bbb}>微信</Text>
                                        <Text style={styles.ccc}>{incomeData.data.wechat}元</Text>
                                    </View>

                                    <View style={styles.aaa}>
                                        <Text style={styles.bbb}>APP</Text>
                                        <Text style={styles.ccc}>{incomeData.data.app}元</Text>
                                    </View>

                                    <View style={styles.aaa}>
                                        <Text style={styles.bbb}>第三方</Text>
                                        <Text style={styles.ccc}>{incomeData.data.mogu}元</Text>
                                    </View>

                                    <View style={[styles.aaa,{marginRight:0}]}>
                                        <Text style={styles.bbb}>支付宝</Text>
                                        <Text style={styles.ccc}>{incomeData.data.alipay}元</Text>
                                    </View>
                                </View>

                                <View style={{marginTop:30,justifyContent:'space-between',flexDirection:"row"}}>
                                    <Text style={{fontSize:20,fontWeight:'bold'}}>应收</Text>
                                    <Text style={{fontSize:20,fontWeight:'bold',color:"#f17e3a"}}>{incomeData.data.receivable}元</Text>
                                </View>

                                <View style={{marginTop:30,justifyContent:'space-between',flexDirection:"row"}}>
                                    <Text style={{fontSize:20,fontWeight:'bold'}}>优惠券</Text>
                                    <Text style={{fontSize:20,fontWeight:'bold',color:"#f17e3a"}}>{incomeData.data.coupon}元</Text>
                                </View>

                            </View>

                                :incomeData&&incomeData.code==1?

                                <View style={{marginTop:30,alignItems:"center"}}>
                                    <Text>{incomeData.message}</Text>
                                </View>:
                                null
                        ):

                        changeMsg=='经营数据'?(

                            manageData&&manageData.code==0?
                            <View style={{padding:10}}>

                                <View style={{marginTop:10,flexDirection:"row",flexWrap:"wrap",justifyContent:'space-between'}}>
                                    <View style={styles.aaa}>
                                        <Text style={styles.bbb}>间夜率</Text>
                                        <Text style={styles.ccc}>{manageData.map.nightRate}%</Text>
                                    </View>

                                    <View style={styles.aaa}>
                                        <Text style={styles.bbb}>入住率</Text>
                                        <Text style={styles.ccc}>{manageData.map.checkinRate}%</Text>
                                    </View>

                                    <View style={[styles.aaa,{marginRight:0}]}>
                                        <Text style={styles.bbb}>平均租期</Text>
                                        <Text style={styles.ccc}>{manageData.map.avgPeriod}</Text>
                                    </View>

                                    <View style={styles.aaa}>
                                        <Text style={styles.bbb}>平均房价</Text>
                                        <Text style={styles.ccc}>{manageData.map.avgRoomPrice}元</Text>
                                    </View>

                                    <View style={styles.aaa}>
                                        <Text style={styles.bbb}>增值房价</Text>
                                        <Text style={styles.ccc}>(含服务费)</Text>
                                        <Text style={styles.ccc}>{manageData.map.addRoomFee}元</Text>
                                    </View>

                                    <View style={[styles.aaa,{marginRight:0}]}>
                                        <Text style={styles.bbb}>增值收入</Text>
                                        <Text style={styles.ccc}>{manageData.map.addIncome}元</Text>
                                    </View>

                                    <View style={[styles.aaa,{marginRight:0}]}>
                                        <Text style={styles.bbb}>续住率</Text>
                                        <Text style={styles.ccc}>{manageData.map.continueRate}%</Text>
                                    </View>

                                    <View style={[styles.aaa,{marginRight:0}]}>
                                        <Text style={styles.bbb}>换房率</Text>
                                        <Text style={styles.ccc}>{manageData.map.changeRate}%</Text>
                                    </View>

                                    <View style={[styles.aaa,{marginRight:0}]}>
                                        <Text style={styles.bbb}>违约率</Text>
                                        <Text style={styles.ccc}>{manageData.map.breachRate}%</Text>
                                    </View>

                                    <View style={[styles.aaa]}>
                                        <Text style={styles.bbb}>REVPAR</Text>
                                        <Text style={styles.ccc}>{manageData.map.revper}元</Text>
                                    </View>

                                    <View style={[styles.aaa]}>
                                        <Text style={styles.bbb}>正常退房数</Text>
                                        <Text style={styles.ccc}>{manageData.map.checkOutNum}</Text>
                                    </View>

                                    <View style={[styles.aaa]}>
                                        <Text style={styles.bbb}>违约退房数</Text>
                                        <Text style={styles.ccc}>{manageData.map.checkoutBreach}</Text>
                                    </View>
                                </View>


                            </View>
                                :manageData&&manageData.code==1?

                                <View style={{marginTop:30,alignItems:"center"}}>
                                    <Text>{manageData.message}</Text>
                                </View>:
                                null



                            ):

                            changeMsg=='销售数据'?(

                                manageData&&manageData.code==0?

                                <View style={{padding:10}}>

                                    <View style={{marginTop:10,flexDirection:"row",flexWrap:"wrap",justifyContent:'space-between'}}>
                                        <View style={styles.aaa}>
                                            <Text style={styles.bbb}>上户数</Text>
                                            <Text style={styles.ccc}>{manageData.map.visitCount}</Text>
                                        </View>

                                        <View style={styles.aaa}>
                                            <Text style={styles.bbb}>预定数</Text>
                                            <Text style={styles.ccc}>{manageData.map.orderCount}</Text>
                                        </View>

                                        <View style={[styles.aaa,{marginRight:0}]}>
                                            <Text style={styles.bbb}>签约数</Text>
                                            <Text style={styles.ccc}>{manageData.map.checkinCount}</Text>
                                        </View>

                                        <View style={styles.aaa}>
                                            <Text style={styles.bbb}>成交率</Text>
                                            <Text style={styles.ccc}>{manageData.map.closeRate}%</Text>
                                        </View>

                                        <View style={styles.aaa}>
                                            <Text style={styles.bbb}>招租率</Text>
                                            <Text style={styles.ccc}>{manageData.map.rentRate}%</Text>
                                        </View>

                                        <View style={[styles.aaa]}>
                                            <Text style={styles.bbb}>取消率</Text>
                                            <Text style={styles.ccc}>{manageData.map.cancelRate}%</Text>
                                        </View>

                                        <View style={[styles.aaa]}>
                                            <Text style={styles.bbb}>累计定金数</Text>
                                            <Text style={styles.ccc}>{manageData.map.totalOrderArrange}</Text>
                                        </View>

                                        <View style={[styles.aaa]}>
                                            <Text style={styles.bbb}>累计意向金数</Text>
                                            <Text style={styles.ccc}>{manageData.map.totalOrderNotArrange}</Text>
                                        </View>


                                    </View>


                                </View>
                                    :manageData&&manageData.code==1?

                                    <View style={{marginTop:30,alignItems:"center"}}>
                                        <Text>{manageData.message}</Text>
                                    </View>:
                                    null


                                ):(

                                manageData&&manageData.code==0?
                                <View style={{padding:10}}>

                                    <View style={{marginTop:10,flexDirection:"row",flexWrap:"wrap",justifyContent:'space-between'}}>
                                        <View style={styles.aaa}>
                                            <Text style={styles.bbb}>在住数</Text>
                                            <Text style={styles.ccc}>{manageData.map.liveCount}</Text>
                                        </View>

                                        <View style={styles.aaa}>
                                            <Text style={styles.bbb}>空置数</Text>
                                            <Text style={styles.ccc}>{manageData.map.emptyCount}</Text>
                                        </View>

                                        <View style={[styles.aaa,{marginRight:0}]}>
                                            <Text style={styles.bbb}>停用数</Text>
                                            <Text style={styles.ccc}>{manageData.map.disableCount}</Text>
                                        </View>

                                        <View style={styles.aaa}>
                                            <Text style={styles.bbb}>占用数</Text>
                                            <Text style={styles.ccc}>{manageData.map.occupyCount}</Text>
                                        </View>

                                        <View style={styles.aaa}>
                                            <Text style={styles.bbb}>可销售数</Text>
                                            <Text style={styles.ccc}>{manageData.map.saleCount}</Text>
                                        </View>

                                        <View style={[styles.aaa,{marginRight:0}]}>
                                            <Text style={styles.bbb}>总房数</Text>
                                            <Text style={styles.ccc}>{manageData.map.totalCount}</Text>
                                        </View>

                                        <View style={[styles.aaa,{marginRight:0}]}>
                                            <Text style={styles.bbb}>预离退房</Text>
                                            <Text style={styles.ccc}>(15天内)</Text>
                                            <Text style={styles.ccc}>{manageData.map.leaveCount}</Text>
                                        </View>

                                        <View style={[styles.aaa,{marginRight:0}]}>
                                            <Text style={styles.bbb}>申请转租</Text>

                                            <Text style={styles.ccc}>{manageData.map.transferCount}</Text>
                                        </View>
                                    </View>


                                </View>
                                    :manageData&&manageData.code==1?

                                    <View style={{marginTop:30,alignItems:"center"}}>
                                        <Text>{manageData.message}</Text>
                                    </View>:
                                    null

                            )
                    }





                </ScrollView>



            </View>

        )

    }
}

const styles = StyleSheet.create({

    a:{
        padding:10,
        flexDirection:"row"
    },

    d:{
        padding:10,
        flexDirection:"row",
        borderBottomWidth:1,
        borderBottomColor:"#f0f0f0"
    },

    e:{
        backgroundColor:"#fff"
    },

    b:{
        flex:1
    },

    c:{
        flex:3
    },

    fontcolor:{
        color:"grey"
    },
    
    aaa:{
        padding:10,marginTop:10,marginRight:10,alignItems:"center",justifyContent:"center",width:'30%',
        backgroundColor:"#0074c3",borderRadius:5
    },
    
    bbb:{
        color:"#fff",fontSize:20,fontWeight:"bold"
    },
    ccc:{
        color:"#fff",marginTop:5
    }

});

export default connect (
    state => ({reduxData: state.reduxData}),
    dispath => bindActionCreators({setHotelNo},dispath)
)(A);