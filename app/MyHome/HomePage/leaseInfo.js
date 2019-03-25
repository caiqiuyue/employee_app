import React, { Component } from 'react';
import {
    StyleSheet, TextInput, Text, View, Image, ListView, TouchableHighlight, Platform, ScrollView, Dimensions, Modal,
    Linking
} from 'react-native';

import callIcon from './style/60.png'
import axios from "../../axios";
import Contract from "./contract";
import {Toast} from "antd-mobile";
import LinearGradient from 'react-native-linear-gradient';
import {setHotelNo} from "../../components/active/reducer";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
class A extends Component {
    constructor(props) {
        super(props);
        this.state = {
            handelMsg:[
                {
                    value:"详情",
                    flag:true
                },

                {
                    value:"账单",
                    flag:false
                },

                {
                    value:"日志",
                    flag:false
                },

                {
                    value:"合同",
                    flag:false
                },
            ],
            changeMsg:"详情",
            billData:{},
            logData:[],
            data:{},
            details:{},
            aa:false,
            bb:false,
        };

    }



    componentWillMount(){

        const {getParam} = this.props.navigation;
        const data = getParam("user");
        console.log(data);

        this.setState({
            data
        },()=>{

        },
            axios.post(`/checkin/getCheckinInfo`, {
            checkinNo:data.tradeId,
            hotelNo:this.props.reduxData.hotelNo,
            })
                .then((response) =>{
                    console.log(response,'详情');
                    console.log(response.data.data,'详情');

                    if(response.data.code==0&&response.data.data){
                        this.setState({
                            details:response.data.data
                        })
                    }else if(response.data.code==1){
                        Toast.info(response,data.message,1)
                    }



                })
                .catch(function (error) {

                    console.log(12345);
                    console.log(error);
                    console.log(67890);
                }))

        
    }


    call = ()=>{
        Linking.openURL(`tel:${this.state.details.phoneNo}`);
    }

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
            if(item.value=='详情'){


                axios.post(`/checkin/getCheckinInfo`, {
                    checkinNo:data.tradeId,
                    hotelNo:this.props.reduxData.hotelNo
                })
                    .then((response) =>{
                        console.log(response,'详情');
                        console.log(response.data.data,'详情');

                        if(response.data.code==0){

                            this.setState({
                                details:response.data.data
                            })
                        }



                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            }else if(item.value=='账单'){
                axios.post(`/checkin/getCheckinBill`, {
                    checkinNo:data.tradeId,
                    hotelNo:data.hotelNo,
                })
                    .then((response) =>{
                        console.log(response,'账单');

                        this.setState({
                            aa:true
                        },()=>{
                            if(response.data.code==0){
                                this.setState({
                                    billData:response.data.data,

                                })
                            }
                        })





                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            }else if(item.value=='日志'){
                axios.post(`/checkin/getCheckinOperate`, {
                    checkinNo:data.tradeId,
                    hotelNo:this.props.reduxData.hotelNo,

                })
                    .then((response) =>{
                        console.log(response,'日志');


                        this.setState({
                            bb:true
                        },()=>{
                            if(response.data.code==0){
                                this.setState({
                                    logData:response.data.data,

                                })
                            }
                        })



                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            }
        })

    }


    render(){

        let{details,handelMsg,changeMsg,billData,logData,data} = this.state;

        return (


            <View style={{height: Dimensions.get('window').height,

                ...Platform.select({
                    android:{
                        paddingBottom:85,
                    },
                    ios:{
                        paddingBottom:70
                    }
                }),



            }}>

                <View style={{backgroundColor:"#fff"}}>

                    <View>
                        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                            <View  style={{padding:10}}>
                                <Text>{`${data.hotelName[0]}${data.roomNo}(${data.roomTypeName})`}</Text>
                                <View style={{marginTop:10}}><Text>承租人:{data.customerName}</Text></View>
                            </View>
                            <TouchableHighlight underlayColor="transparent" onPress={this.call}  style={{marginRight:20}}>
                                <Image style={{height:30,width:30,paddingRight:30}} source={callIcon}/>
                            </TouchableHighlight>
                        </View>

                        {details.remark&&details.remark!=''?<View style={{padding:10}}><Text>({details.remark})</Text></View>:null}
                        {/*<View style={{padding:10}}><Text>({details.remark})</Text></View>*/}

                        <View style={{borderTopColor:"#7ebef9",borderTopWidth:1,flexDirection:"row",justifyContent:"space-around"}}>
                            {
                                handelMsg.map((item,index)=>

                                    <LinearGradient key={index} colors={[!item.flag?'#00adfb':"#fff", !item.flag?'#00618e':"#fff"]} style={{width:"25%",}}>
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
                    </View>

                </View>


                <ScrollView>

                    {changeMsg=='详情'?
                        (
                            <View>


                                <View style={{marginTop:10}}>
                                    <View style={[styles.a,styles.e]}>
                                        <Text style={[styles.b]}>合同编号:</Text>
                                        <Text style={[styles.c]}>{details.checkinNo}</Text>
                                    </View>
                                </View>

                                <View>
                                    <View style={[styles.a]}>
                                        <Text style={[styles.b,styles.fontcolor]}>租约信息:</Text>
                                        <Text style={[styles.c]}>{details.rentPeriod}个月</Text>
                                    </View>
                                </View>

                                <View>
                                    <View style={[styles.d,styles.e]}>
                                        <Text style={[styles.b]}>起租日期:</Text>
                                        <Text style={[styles.c,styles.fontcolor]}>{details.checkinDate}</Text>
                                    </View>
                                </View>

                                <View>
                                    <View style={[styles.d,styles.e]}>
                                        <Text style={[styles.b]}>结束日期:</Text>
                                        <Text style={[styles.c,styles.fontcolor]}>{details.checkoutDate}</Text>
                                    </View>
                                </View>

                                <View>
                                    <View style={[styles.d,styles.e]}>
                                        <Text style={[styles.b]}>押金方式:</Text>
                                        <Text style={[styles.c,styles.fontcolor]}>押{details.pledge}付{details.payMonth}</Text>
                                    </View>
                                </View>

                                <View>
                                    <View style={[styles.d,styles.e]}>
                                        <Text style={[styles.b]}>押金:</Text>
                                        <Text style={[styles.c,styles.fontcolor]}>{details.deposit}</Text>
                                    </View>
                                </View>

                                <View>
                                    <View style={[styles.d,styles.e]}>
                                        <Text style={[styles.b]}>房租:</Text>
                                        <Text style={[styles.c,styles.fontcolor]}>{details.rentPrice}</Text>
                                    </View>
                                </View>

                                <View>
                                    <View style={[styles.d,styles.e]}>
                                        <Text style={[styles.b]}>下一交租日:</Text>
                                        <Text style={[styles.c,styles.fontcolor]}>{details.nextDate}</Text>
                                    </View>
                                </View>

                                <View>
                                    <View style={[styles.d,styles.e]}>
                                        <Text style={[styles.b]}>已完成合约:</Text>
                                        <Text style={[styles.c,styles.fontcolor]}>{details.fulfillPeriod}</Text>
                                    </View>
                                </View>

                                <View>
                                    <View style={[styles.a]}>
                                        <Text style={[styles.fontcolor]}>费用信息:</Text>
                                    </View>
                                </View>



                                {details.feeList&&details.feeList.map((item,index)=>

                                    <View key={index}>
                                        <View style={[styles.d,styles.e]}>
                                            <Text style={[styles.b]}>{item.feeName}:</Text>
                                            <Text style={[styles.c,styles.fontcolor]}>{item.amount}</Text>
                                        </View>
                                    </View>

                                )}

                            </View>
                        ):
                        changeMsg=='账单'?
                            (<View>
                                <View style={[styles.a]}>
                                    <Text>余额:</Text>
                                    <Text style={{color:"#f17e3a",marginLeft:10}}>{billData.balance&&billData.balance}元</Text>
                                </View>

                                <View style={[styles.d,styles.e,{backgroundColor:"#ccc"}]}>
                                    <View style={{flex:2,alignItems:"center",justifyContent:"center"}}><Text style={{color:"#fff"}}>支付项</Text></View>
                                    <View style={{flex:2,alignItems:"center",justifyContent:"center"}}><Text style={{color:"#fff"}}>支付方式</Text></View>
                                    <View style={{flex:3,alignItems:"center",justifyContent:"center"}}><Text style={{color:"#fff"}}>金额</Text></View>
                                    <View style={{flex:4,alignItems:"center",justifyContent:"center"}}><Text style={{color:"#fff"}}>时间</Text></View>
                                </View>

                                {billData.bills?billData.bills.map((item,index)=>
                                    <View key={index} style={[styles.d,styles.e,{backgroundColor:index%2!=0?"#ccc":"#fff"}]}>
                                        <View style={{flex:2,alignItems:"center",justifyContent:"center"}}><Text>{item.billName}</Text></View>
                                        <View style={{flex:2,alignItems:"center",justifyContent:"center"}}><Text>{item.payType}</Text></View>
                                        <View style={{flex:3,alignItems:"center",justifyContent:"center"}}><Text>{item.money}元</Text></View>
                                        <View style={{flex:4,alignItems:"center",justifyContent:"center"}}><Text>{item.payTime}</Text></View>
                                    </View>):<View style={{marginTop:30,alignItems:"center"}}><Text>{this.state.aa?'暂无账单记录':'查询账单中'}</Text></View>}

                            </View>):
                            changeMsg=='日志'?
                                (<View style={{marginTop:10}}>

                                    <View style={[styles.d,styles.e,{backgroundColor:"#ccc"}]}>
                                        <View style={{flex:2,alignItems:"center",justifyContent:"center"}}><Text  style={{color:"#fff"}}>操作项</Text></View>
                                        <View style={{flex:2,alignItems:"center",justifyContent:"center"}}><Text  style={{color:"#fff"}}>操作人</Text></View>
                                        <View style={{flex:3,alignItems:"center",justifyContent:"center"}}><Text  style={{color:"#fff"}}>时间</Text></View>
                                    </View>

                                    {logData.length>0?logData.map((item,index)=>
                                        <View key={index} style={[styles.d,styles.e,{backgroundColor:index%2!=0?"#ccc":"#fff"}]}>
                                            <View style={{flex:2,alignItems:"center",justifyContent:"center"}}><Text>{item.remark}</Text></View>
                                            <View style={{flex:2,alignItems:"center",justifyContent:"center"}}><Text>{item.userName}</Text></View>
                                            <View style={{flex:3,alignItems:"center",justifyContent:"center"}}><Text>{item.operateTime}</Text></View>
                                        </View>):<View style={{marginTop:30,alignItems:"center"}}><Text>{this.state.bb?'暂无日志记录':'查询日志中'}</Text></View>}
                                </View>):
                                (<Contract data={this.state.data}/>)
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
    }

});
export default connect (
    state => ({reduxData: state.reduxData}),
    dispath => bindActionCreators({setHotelNo},dispath)
)(A);