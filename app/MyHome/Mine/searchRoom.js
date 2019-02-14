import React,{Component} from 'react';
import {FlatList,View,DeviceEventEmitter, ScrollView,Text, TouchableHighlight, TextInput,Image, Modal, StyleSheet,Platform} from 'react-native';

import Dimensions from "Dimensions";
import axios from "../../axios";
import {DatePicker,Toast} from 'antd-mobile'
import shaixuan from "../HomePage/style/shaixuan.png";
import s1 from "../HomePage/style/234.png";
import close from "../HomePage/style/close.png";
import selectIcon from '../HomePage/style/selectIcon.png'

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
            note:'',
            roomImg:'',
            handelMsg:[
                {
                    value:"查房",
                    flag:true
                },

                {
                    value:"查房记录",
                    flag:false
                },

            ],
            changeMsg:"查房",
            animationType: 'none',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示
            electricity:null,
            water:null,
            hotWater:null,
            padd:100,
            electricityMoney:0,
            waterMoney:0,
            hotWaterMoney:0,
            damages:null,
            refreshing:false,
            flag:false,
            roomInfo:{},
            bb:false,
            toastDate:1,
            data:{},
            paddbottom:Dimensions.get('window').height+50,
            roomStatus:[
                {
                    value:"ok房",
                    flag:true,
                    statu:0
                },
                {
                    value:"物品丢失",
                    flag:false,
                    statu:1
                },
                {
                    value:"物品损坏",
                    flag:false,
                    statu:2
                },


            ],
            roomStatu:0


        }

        this.aa=false;
        this.roomNo='';


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
            type:'checkRoom',

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

                        this.setState({
                            data:response.data.data,
                            electricityMoney:0,
                            waterMoney:0,
                            hotWaterMoney:0,
                            damages:null,
                            note:'',
                            roomImg:'',
                            flag:this.roomNo==this.state.roomNo?true:false
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

    //选择房间状态
    roomStatus=(item)=>{

        let {roomStatus} = this.state;

        roomStatus.map((_item)=>{
            if(_item.value==item.value){
                _item.flag=!item.flag;
            }else {
                _item.flag = false
            }

        })

        this.setState({
            roomStatus,
            roomStatu:item.statu
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


    getMeter = ()=>{

        axios.post(`/employee/getCheckRoom`, {
            hotelNo:this.props.reduxData.hotelNo,

        })
            .then((response) =>{
                console.log(response);

                this.setState({
                    bb:true,
                    refreshing:false
                },()=>{
                    if(response.data.code==0&&response.data.data.length>0){

                        response.data.data.map(item=>{
                            if(item.images!=''){
                                item.images = item.images.split(',')
                            }else {
                                item.images = []
                            }
                        })

                        console.log(response.data.data);

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


    componentWillMount(){

        

    }


    toastInput=()=>{
        this.setState({
            padd:400
        })

        if(!this.aa){
            Toast.info('请确定填写的房间号',1);
        }
    }

    submitAll = ()=>{

        let {data} = this.state;

        if(!this.aa){
            Toast.info('请确定填写的房间号',1);
            return
        }else if(data.customerName==undefined){
            Toast.info('未查到该房间号信息，请重新填写',1);
            return
        }else {

            this.setState({
                flag:true
            },()=>{
                axios.post(`/employee/saveCheckRoom`, {
                    hotelNo:this.props.reduxData.hotelNo,
                    roomNo:this.state.roomNo,
                    electricMoney:this.state.electricityMoney-0,
                    damageFee:this.state.damages-0,
                    waterMoney:this.state.waterMoney-0,
                    state:this.state.roomStatu,
                    hotWaterMoney:this.state.hotWaterMoney-0,
                    images:this.state.roomImg,
                    remark:this.state.note,




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


    noRepeat=()=>{
        Toast.info('该房间已提交 不可重复提交',1);
    }


    addPic = (item)=>{

        console.log(item);
        let a = []
        if(item.length>0){
            item.map(_item=>{
                a.push(_item.imgName)
            })

        }


        this.setState({

            roomImg:a.join(',')
        })

    }


    seeRoom = (item) => {

        this.setState({
            modalVisible:true,
            roomInfo:item
        })

    }

    _setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    };




    render(){

        let {flag,electricityMoney,waterMoney,hotWaterMoney,handelMsg,changeMsg,data,menterData,roomInfo} = this.state;

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

                                    <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}>查看查房</Text></View>



                                    <TouchableHighlight underlayColor={"#fff"} onPress={this._setModalVisible.bind(this,false) } style={{}}>
                                        <Image style={{height:30,width:30}} source={close}/>
                                    </TouchableHighlight>

                                </View>


                                <ScrollView style={{maxHeight:Dimensions.get('window').height-200}}>
                                    <View style={{padding:10}}>

                                        <View style={styles.a}>
                                            <Text style={{flex:1}}>房间号:</Text>
                                            <View style={[styles.b,{flex:3}]}>
                                                <Text style={{flex:1}}>{roomInfo.roomNo}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.a}>
                                            <Text style={{flex:1}}>房间状态:</Text>
                                            <View style={[styles.b,{flex:3}]}>
                                                <Text style={{flex:1}}>{roomInfo.stateName}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.a}>
                                            <Text style={{flex:1}}>查房人:</Text>
                                            <View style={[styles.b,{flex:3}]}>
                                                <Text style={{flex:1}}>{roomInfo.userName}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.a}>
                                            <Text style={{flex:1}}>查房时间:</Text>
                                            <View style={[styles.b,{flex:3}]}>
                                                <Text style={{flex:1}}>{moment(roomInfo.createTime).format("YYYY-MM-DD HH:mm:ss")}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.a}>
                                            <Text style={{flex:1}}>剩余电费:</Text>
                                            <View style={[styles.b,{flex:3}]}>
                                                <Text style={{flex:1}}>{roomInfo.electricMoney}元</Text>
                                            </View>
                                        </View>

                                        <View style={styles.a}>
                                            <Text style={{flex:1}}>剩余水费:</Text>
                                            <View style={[styles.b,{flex:3}]}>
                                                <Text style={{flex:1}}>{roomInfo.waterMoney}元</Text>
                                            </View>
                                        </View>

                                        <View style={styles.a}>
                                            <Text style={{flex:1}}>剩余热水费:</Text>
                                            <View style={[styles.b,{flex:3}]}>
                                                <Text style={{flex:1}}>{roomInfo.hotWaterMoney}元</Text>
                                            </View>
                                        </View>

                                        <View style={styles.a}>
                                            <Text style={{flex:1}}>赔偿费:</Text>
                                            <View style={[styles.b,{flex:3}]}>
                                                <Text style={{flex:1}}>{roomInfo.damageFee}元</Text>
                                            </View>
                                        </View>

                                        <View style={styles.a}>
                                            <Text style={{flex:1}}>备注:</Text>
                                            <View style={[styles.b,{flex:3}]}>
                                                <Text style={{flex:1}}>{roomInfo.remark}</Text>
                                            </View>
                                        </View>

                                        {
                                            (roomInfo.images)&&
                                            <View style={styles.allLine}>
                                                <View style={{flex:1,}}><Text >{}</Text></View>
                                                <View style={{flex:3,}}>


                                                    {
                                                        roomInfo.images.map((item,index)=>
                                                            <View key={index} style={{height:110,marginTop:10}} >
                                                                <Image style={{height:100,width:"80%",resizeMode:"stretch"}}
                                                                       source={{uri:item}}
                                                                />
                                                            </View>
                                                        )
                                                    }


                                                </View>

                                            </View>
                                        }

                                    </View>
                                </ScrollView>



                            </View>
                        </View>
                    </Modal>



                </View>



                {
                    changeMsg=='查房'?

                        <ScrollView >
                            <View style={{padding:10,paddingBottom:this.state.padd}}>




                                <View style={styles.allLine}>
                                    <View style={{flex:1,}}><Text >房间号:</Text></View>
                                    <View style={{flex:3}}>
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

                                <View style={styles.allLine}>
                                    <View style={{flex:1,}}><Text >房间状态:</Text></View>
                                    <View style={{flex:3,}}>
                                        <View style={{flexDirection:"row",flexWrap:"wrap"}}>

                                            {
                                                this.state.roomStatus.map((item,index)=>
                                                    <TouchableHighlight
                                                        onPress={()=>{this.roomStatus(item)}} key={index} underlayColor="transparent">
                                                        <View style={{flexDirection:"row",marginRight:15,alignItems:"center"}}>
                                                            <View style={{backgroundColor:item.flag ? "#00adfb" :'#fff',marginRight:5,
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



                                <View style={styles.allLine}>
                                    <View style={{flex:1,}}><Text >剩余电量(度):</Text></View>
                                    <View style={{flex:3,}}>
                                        <View style={[styles.allInput]}>
                                            <TextInput
                                                placeholder="剩余电量"
                                                style={{minWidth:180,padding: 8,}}
                                                keyboardType={'numeric'}
                                                onFocus={this.toastInput}
                                                underlineColorAndroid="transparent"
                                                onChangeText={(electricity) => this.setState({electricity,electricityMoney:(electricity-0)*(data.hotelPower?data.hotelPower:0)})}
                                            >
                                            </TextInput>
                                        </View>
                                    </View>

                                </View>

                                <View style={styles.allLine}>
                                    <View style={{flex:1,}}><Text >电费:</Text></View>
                                    <View style={{flex:3,}}><Text style={{color:"#f17e3a"}}>共计:{`${(this.state.electricity?this.state.electricity:0)}x${(data.hotelPower?data.hotelPower:0)}=${electricityMoney.toFixed(2)}元`}</Text></View>

                                </View>



                                <View style={styles.allLine}>
                                    <View style={{flex:1,}}><Text >剩余水量(吨):</Text></View>
                                    <View style={{flex:3,}}>
                                        <View style={styles.allInput}>
                                            <TextInput
                                                placeholder="剩余水量"
                                                style={{minWidth:180,padding: 8,}}
                                                keyboardType={'numeric'}
                                                underlineColorAndroid="transparent"
                                                onFocus={this.toastInput}
                                                onChangeText={(water) => this.setState({water,waterMoney:(water-0)*(data.hotelWater?data.hotelWater:0)})}
                                            >
                                            </TextInput>
                                        </View>
                                    </View>



                                </View>

                                <View style={styles.allLine}>
                                    <View style={{flex:1,}}><Text >水费:</Text></View>
                                    <View style={{flex:3,}}><Text style={{color:"#f17e3a"}}>共计:{`${(this.state.water?this.state.water:0)}x${(data.hotelWater?data.hotelWater:0)}=${waterMoney.toFixed(2)}元`}</Text></View>

                                </View>

                                <View style={styles.allLine}>
                                    <View style={{flex:1,}}><Text >剩余热水量(吨):</Text></View>
                                    <View style={{flex:3,}}>
                                        <View style={styles.allInput}>
                                            <TextInput
                                                placeholder="剩余热水量"
                                                style={{minWidth:180,padding: 8,}}
                                                onFocus={this.toastInput}
                                                keyboardType={'numeric'}
                                                underlineColorAndroid="transparent"
                                                onChangeText={(hotWater) => this.setState({hotWater,hotWaterMoney:(hotWater-0)*(data.hotelWaterHot?data.hotelWaterHot:0)})}
                                            >
                                            </TextInput>
                                        </View>

                                    </View>



                                </View>

                                <View style={styles.allLine}>
                                    <View style={{flex:1,}}><Text >热水费:</Text></View>
                                    <View style={{flex:3,}}><Text style={{color:"#f17e3a"}}>共计:{`${(this.state.hotWater?this.state.hotWater:0)}x${(data.hotelWaterHot?data.hotelWaterHot:0)}=${hotWaterMoney.toFixed(2)}元`}</Text></View>

                                </View>

                                <View style={styles.allLine}>
                                    <View style={{flex:1,}}><Text >赔偿费:</Text></View>
                                    <View style={{flex:3,}}>
                                        <View style={styles.allInput}>
                                            <TextInput
                                                placeholder="赔偿费"
                                                style={{minWidth:180,padding: 8,}}
                                                onFocus={this.toastInput}
                                                keyboardType={'numeric'}
                                                underlineColorAndroid="transparent"
                                                onChangeText={(damages) => this.setState({damages})}
                                            >
                                            </TextInput>
                                        </View>


                                    </View>

                                </View>

                                <View style={styles.allLine}>
                                    <View style={{flex:1,}}><Text >备注:</Text></View>
                                    <View style={{flex:3,}}>
                                        <View style={styles.allInput}>
                                            <TextInput
                                                placeholder={'备注'}
                                                multiline={true}
                                                style={{minWidth:'100%',height:100,padding:10,borderColor:"#ccc",borderWidth:1,borderRadius:5,}}
                                                underlineColorAndroid="transparent"
                                                onFocus={this.toastInput}
                                                onChangeText={(note) => this.setState({note})}

                                            >
                                            </TextInput>
                                        </View>


                                    </View>

                                </View>


                                <AddPic aa={this.aa} customerName={this.state.data.customerName} hotelNo={this.props.reduxData.hotelNo} roomNo={this.state.roomNo} addPic={this.addPic}/>



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
                                                        保存
                                                    </Text>
                                                </TouchableHighlight>
                                            </LinearGradient>
                                    }

                                </View>





                            </View>
                        </ScrollView>

                        :
                        <View>


                            <View style={{
                                ...Platform.select({
                                    android:{
                                        paddingBottom:120,
                                    },
                                    ios:{
                                        paddingBottom:100,
                                    }
                                }),
                            }}>

                                <FlatList
                                    data={menterData}  //列表的渲染数据源
                                    getItemLayout={(data, index) => ( {length: 80, offset: 80 * index, index} )}
                                    initialNumToRender={10}  //首次渲染的条数
                                    ListEmptyComponent={()=><View style={{marginTop:30,alignItems:"center"}}><Text>{this.state.bb?'暂无查房记录':'查询查房记录中'}</Text></View>}
                                    onRefresh={()=>{this.onRefresh()}} //下拉刷新
                                    refreshing={this.state.refreshing} //下拉刷新时候的正在加载的符号，设置为true显示，false隐藏。加载完成，需要设置为false
                                    keyExtractor={(item,index)=>`${index}`}
                                    renderItem={({item,index})=>(
                                        <View key={index}  style={[styles.d,styles.e,]}>

                                            <View  style={[styles.aaa,{flex:2,alignItems:"center",justifyContent:"center"}]}>
                                                <Text style={{fontSize:18,fontWeight:"bold"}}>{item.roomNo}</Text>

                                            </View>

                                            <View style={[styles.aaa,{flex:3,alignItems:"center",justifyContent:"center"}]}>
                                                <Text>{item.userName}</Text>
                                                <Text  style={{marginTop:5,}}>{moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}</Text>
                                            </View>



                                            <View style={[styles.aaa,{flex:2,alignItems:"center",justifyContent:"center"}]}>
                                                <Text>{item.stateName}</Text>
                                            </View>

                                            <TouchableHighlight underlayColor="transparent" onPress={()=>{this.seeRoom(item)}} style={[styles.aaa,{flex:2,alignItems:"center",justifyContent:"center"}]}>
                                                <Text style={{color:"red"}}>查看详情</Text>
                                            </TouchableHighlight>


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
});

export default connect (
    state => ({reduxData: state.reduxData}),
    dispath => bindActionCreators({setHotelNo},dispath)
)(Mine);