import React,{Component} from 'react';
import {
    FlatList,
    View,
    Alert,
    ScrollView,
    Text,
    TouchableHighlight,
    TextInput,
    Image,
    ImageBackground,
    StyleSheet,
    Platform,
    Modal
} from 'react-native';

import Dimensions from "Dimensions";
import coupons from "./style/coupons.png";
import select from "./style/select.png";
import axios from "../../axios";
import {DatePicker, Picker, Toast} from "antd-mobile";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setHotelNo} from "../../components/active/reducer";

import LinearGradient from 'react-native-linear-gradient';
import moment from "moment";
import close from "../HomePage/style/close.png";
import selectIcon from "../HomePage/style/selectIcon.png";
import shaixuan from "../HomePage/style/shaixuan.png";
class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            couponsData:[],
            amount:null,
            phone:null,
            confId:null,
            modalName:null,
            phoneNo:'',
            handelMsg:[
                {
                    value:"发放",
                    flag:true
                },

                {
                    value:"发放记录",
                    flag:false
                },




            ],
            changeMsg:"发放",
            couponList:[],
            aa:false,
            bb:false,
            refreshing:false,
            flag:false,
            couponPage:1,
            padd:100,
            verifyData:{},
            policyList:[],
            animationType: 'none',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示
        }

        this.hotelName = ''

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
            if(item.value=='发放'){


                // this.getOrderList()

            }


            if(item.value=='发放记录'){
                // if(!this.state.yudingState){
                //
                // }

                // this.getCheckinList();

            }
        })

    }


    //上拉加载
    onEndReached=()=>{

        let {couponPage,couponList} = this.state

        this.setState({
            couponPage:couponPage+1
        },()=>{


            axios.post(`/coupon/getCouponHistory`, {
                page:this.state.couponPage,
                hotelNo:this.props.reduxData.hotelNo
            })
                .then((response) =>{
                    console.log(response,'优惠券历史上拉加载');
                    if(response.data.code==0&&response.data.data&&response.data.data.length>0){

                        this.setState({
                            couponList:[...couponList,...response.data.data]
                        })


                    }else if(response.data.code==1){
                        Toast.info(response.data.message,1)
                    }



                })
                .catch(function (error) {
                    console.log(error);
                })

        })
    }


    onRefresh=()=>{
        this.getCouponHistory()
    }


    componentWillMount(){

        //读取
        this.getCouponTemplate();
        this.getCouponHistory();
        //读取
        storage.load({
            key: 'username',
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: false
        }).then(ret => {

            console.log(ret);

            let aaa = ret.hotelList.filter(_item=>{
                return _item.hotelNo==this.props.reduxData.hotelNo
            })

            this.hotelName=aaa[0].hotelName

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



    //获取优惠券模板
    getCouponTemplate=()=>{
        axios.post(`/coupon/getCouponTemplate`, {
            hotelNo:this.props.reduxData.hotelNo
        })
            .then((response) =>{
                console.log(response,'优惠券');
                this.setState({
                    aa:true
                },()=>{
                    if(response.data.code==0){

                        let data = [];

                        if(response.data.data&&response.data.data.length>0){
                            data= response.data.data.map(item=>{
                                item.flag=false;
                                return item
                            })
                        }

                        this.setState({
                            couponsData:data
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


    //获取优惠券历史
    getCouponHistory=()=>{
        this.setState({modalVisible:false},()=>{
            Toast.loading('loading')
            axios.post(`/coupon/getCouponHistory`, {
                page:1,
                phoneNo:this.state.phoneNo,
                hotelNo:this.props.reduxData.hotelNo
            })
                .then((response) =>{
                    Toast.hide()
                    console.log(response,'优惠券历史');
                    this.setState({
                        bb:true
                    },()=>{

                        if(response.data.code==0){
                            if(response.data.data&&response.data.data.length>0){
                                this.setState({
                                    couponList:response.data.data
                                })
                            }


                        }else{
                            Toast.info(response.data.message,1)
                        }
                    })



                })
                .catch(function (error) {
                    console.log(error);
                })
        })


    }



    //选择优惠券
    selectCoupons=(item)=>{
        let {couponsData} = this.state;

        couponsData.map(_item=>{
            if(_item.confId==item.confId){
                _item.flag=!item.flag


            }else {
                _item.flag=false
            }
        })

        this.setState({
            couponsData
        },()=>{
            if(item.flag==true){

                this.setState({
                    confId:item.confId

                })


            }else {
                this.setState({
                    confId:null

                })
            }
        })

    };

    cancelSelected = ()=>{}

    walletSelected=(f)=>{

        Toast.loading('loading')

        let {policyList,confId,amount,phone,couponsData} = this.state;
        let data = {
            phoneNo:phone,
            confId:confId,
            couponCount:amount,
            hotelNo:this.props.reduxData.hotelNo

        }
        let ab = policyList.filter(item=>{return item.flag})

        if(!f){
            if(ab.length==0){
               alert('请选择租金方案')
               return
            }

            data.policyId = ab[0].policyId
            data.policyType = ab[0].type

        }

        this.setState({modalVisible:false},()=>{
            axios.post(`/coupon/grantCoupon`, data)
                .then((response) =>{
                    Toast.hide()
                    console.log(response,'确认发放优惠券');


                    this.setState({
                        flag:response.data.code==0?true:false
                    });

                    Toast.info(response.data.code==0?'发放优惠券成功':response.data.message,1);


                })
                .catch((error)=> {
                    console.log(error);
                    this.setState({
                        flag:false
                    })
                })
        })

    }
    //发放优惠券
    submitBtn=()=>{
        let {confId,amount,phone,couponsData} = this.state;
        console.log(confId,'confId');
        console.log(couponsData,'couponsData');

        if(confId==null){
            Toast.info('请选择发放的优惠券',1);
            return
        }


        if(amount==null||amount.trim()==''){
            Toast.info('请填写发放张数',1);
            return
        }



        if(phone==null||phone.trim()==''){
            Toast.info('请填写手机号码',1);
            return
        }

        if(phone.trim().length<11){
            Toast.info('请填写正确的手机号码',1);
            return
        }

        let aa = couponsData.filter(item=>{return item.confId==confId})
        if(aa[0].discount==1){
            axios.post(`/coupon/phonePolicy`, {
                phoneNo:phone,
                hotelNo:this.props.reduxData.hotelNo

            })
                .then((response) =>{

                    console.log(response,'租金方案');

                    if(response.data.code==0){
                        this.setState({policyList:response.data.policyList,modalVisible:true,modalName:'租金方案'})


                    }else {
                        Toast.info(response.data.message,1);

                    }





                })
                .catch((error)=> {
                    console.log(error);
                    this.setState({
                        flag:false
                    })
                })


        }else {
            Alert.alert('确认',`确认发送${amount}张吗`,
                [
                    {text:"取消", onPress:this.cancelSelected},
                    {text:"确认", onPress:()=>{this.walletSelected(true)}}
                ],
                { cancelable: false }
            );
        }




    }



    verifyCoupon=()=>{
        let {phone,} = this.state;


        if(phone==null||phone.trim()==''){
            Toast.info('请填写手机号码',1);
            return
        }

        if(phone.trim().length<11){
            Toast.info('请填写正确的手机号码',1);
            return
        }

        axios.post(`/coupon/verifyCoupon`, {
            phoneNo:phone,
            hotelNo:this.props.reduxData.hotelNo

        })
            .then((response) =>{

                console.log(response,'验证');

                if(response.data.code==0){
                    this.setState({ verifyData:response.data})

                }else {
                    Toast.info(response.data.message,1);
                    this.setState({ verifyData:{}})
                }





            })
            .catch((error)=> {
                console.log(error);
                this.setState({
                    flag:false
                })
            })


    }


    focus = ()=>{
        this.setState({
            padd:400
        })
    }


    noRepeat=()=>{
        Toast.info('已发送，不可重复发送',1);
    }

    screening = ()=>{
        this.setState({
            modalVisible: true,
            modalName:'筛选',
            phoneNo:'',

        })
    }


    deleteCoupons = (item)=>{



        console.log(item)
        Alert.alert('删除','确认删除优惠券吗',
            [
                {text:"取消", onPress:this.cancelSelected},
                {text:"确认", onPress:()=>{
                        Toast.loading('loading')
                        axios.post(`/coupon/delCoupon`, {
                            phoneNo:item.phoneNo,
                            createTime:item.createTime,
                            hotelNo:this.props.reduxData.hotelNo

                        })
                            .then((response) =>{
                                Toast.hide()
                                console.log(response,'确认删除');

                                Toast.info(response.data.code==0?'删除成功':response.data.message,2);

                                this.getCouponHistory()

                            })
                            .catch((error)=> {
                                console.log(error);
                            })
                    }}
            ],
            { cancelable: false }
        );
    }

    _setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    };

    chooseR=(_item)=>{
        let {policyList } = this.state
        policyList.map(item=>{
         if(item.policyId==_item.policyId){
            item.flag = !item.flag
         }else {
             item.flag=false
         }
        })

        this.setState({policyList})


    }




    render(){


        //弹框
        let modalBackgroundStyle = {
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
        };
        let innerContainerTransparentStyle = this.state.transparent
            ? { backgroundColor: '#fff', padding: 10 ,
                // height:"90%",
                overflow:"hidden"}
            : null;

        let {modalName,policyList,verifyData,couponsData,handelMsg,changeMsg,refreshing,couponList} = this.state;

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

                <Modal
                    animationType={this.state.animationType}
                    transparent={this.state.transparent}
                    visible={this.state.modalVisible}

                    onRequestClose={() => { this._setModalVisible(false) } }

                >
                    <View style={[styles.container,modalBackgroundStyle]}>
                        <View style={[styles.innerContainer,innerContainerTransparentStyle]}>

                            <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>

                                <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}>{modalName}</Text></View>

                                <TouchableHighlight underlayColor={"#fff"} onPress={this._setModalVisible.bind(this,false) } style={{}}>
                                    <Image style={{height:30,width:30}} source={close}/>
                                </TouchableHighlight>


                            </View>

                            {
                                modalName=='筛选'?
                                    <View style={{padding:10}}>

                                        <View style={styles.a}>
                                            <Text style={{flex:1}}>手机号:</Text>
                                            <View style={[styles.b,{flex:3}]}>
                                                <TextInput
                                                    placeholder={"手机号"}
                                                    style={{minWidth:'100%',padding:10,borderColor:"#ccc",borderWidth:1,borderRadius:5,}}
                                                    underlineColorAndroid="transparent"
                                                    onChangeText={(phoneNo) => this.setState({phoneNo})}
                                                >
                                                </TextInput>
                                            </View>
                                        </View>
                                        <View style={{alignItems:"center",marginTop:10}}>
                                            <LinearGradient colors={['#00adfb', '#00618e']} style={{width:100,borderRadius:5}}>
                                                <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                                    alignItems:"center"
                                                }} onPress={()=>{this.getCouponHistory()} }>
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

                                                {
                                                    policyList.length>0&& policyList.map((item,index)=>
                                                        <TouchableHighlight key={index} underlayColor="transparent"  onPress={()=>{this.chooseR(item)}}>
                                                            <View style={[styles.a,{backgroundColor:item.flag?"#00adfb":"#fff",padding:5}]}>
                                                                <Text style={{flex:1}}>{item.type==1?"在住":item.type==2?"系统":'预定'}方案:</Text>
                                                                <Text style={{flex:2}}>{item.rentPrice}元/月</Text>
                                                                <View style={{flex:1}}>
                                                                    {
                                                                        !item.flag?
                                                                            <View style={{width:20,height:20,borderColor:"#ccc",backgroundColor:"#fff",borderWidth:1,borderRadius:11}}></View>
                                                                            :

                                                                            <Image style={{width:16,height:16}} source={select}/>}
                                                                </View>
                                                            </View>

                                                        </TouchableHighlight>)
                                                }

                                            </View>
                                        </ScrollView>

                                        <View style={{alignItems:"center",marginTop:10}}>
                                            <LinearGradient colors={['#00adfb', '#00618e']} style={{width:100,borderRadius:5}}>
                                                <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                                    alignItems:"center"
                                                }} onPress={()=>{this.walletSelected(false)} }>
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


                {
                    changeMsg=='发放'?
                        (couponsData.length>0?


                            <ScrollView>
                                <View style={{padding:10,paddingBottom:this.state.padd}}>

                                    <View style={{alignItems:"center",marginTop:10}}>
                                        <Text style={{fontSize:18,fontWeight:"bold",color:"#0074c3"}}>{this.hotelName}</Text>
                                    </View>

                                    <View style={{}}>

                                        {
                                            couponsData.map((item,index)=>
                                                <TouchableHighlight underlayColor="transparent" onPress={()=>{this.selectCoupons(item)}} key={index} style={{marginTop:10,alignItems:'center'}}>


                                                    <View style={{width:Dimensions.get("window").width-50,height:110}}>
                                                        <Image source={coupons} style={{width:'100%',resizeMode:"stretch",height:110}}/>

                                                        <View style={{width:'75%',height:'100%',position:"absolute",alignItems:"center",marginLeft:'25%',justifyContent:"center"}}>
                                                            <Text style={{fontSize:20,fontWeight:"bold",color:'#fff'}}>{item.money}</Text>
                                                            <Text style={{fontWeight:"bold",color:'#fff'}}>{item.name}</Text>
                                                            <Text style={{fontWeight:"bold",color:'#fff'}}>({item.ifOverlay==0?'不可叠加':item.ifOverlay==1?'可叠加':'无限叠加'})</Text>
                                                            <Text style={{color:"#fff"}}>(满{item.condition}可用)</Text>
                                                            <Text style={{color:"#fff"}}>({item.feeType}可用)</Text>
                                                        </View>

                                                        {item.flag?

                                                            <View style={{position:"absolute",right:20,top:10}}><Image style={{width:30,height:30}} source={select}/></View>:null
                                                        }

                                                    </View>



                                                </TouchableHighlight>
                                            )
                                        }


                                    </View>


                                    <View style={{flexDirection:"row",marginTop:10,alignItems:"center"}}>
                                        <Text style={{flex:1}}>发放张数:</Text>

                                        <View style={{flex:3,flexDirection:"row",alignItems:"center"}}>
                                            <View style={{borderColor:"grey",borderWidth:1,padding:5}}>
                                                <TextInput
                                                    placeholder="张数"
                                                    keyboardType="numeric"
                                                    style={{minWidth:180,padding: 0}}
                                                    onFocus={this.focus}
                                                    underlineColorAndroid="transparent"
                                                    onChangeText={(amount) => this.setState({amount})}
                                                >
                                                </TextInput>
                                            </View>

                                        </View>

                                    </View>

                                    <View  style={{flexDirection:"row",marginTop:10,alignItems:"center"}}>
                                        <Text style={{flex:1}}>发送手机号:</Text>

                                        <View style={{flex:3,flexDirection:"row",alignItems:"center"}}>
                                            <View style={{borderColor:"grey",borderWidth:1,padding:5}}>
                                                <TextInput
                                                    placeholder="手机号"
                                                    keyboardType="numeric"
                                                    onFocus={this.focus}
                                                    style={{minWidth:180,padding: 0}}
                                                    underlineColorAndroid="transparent"
                                                    onChangeText={(phone) => this.setState({phone,flag:false,verifyData:{}})}
                                                >
                                                </TextInput>
                                            </View>

                                        </View>



                                    </View>

                                    {
                                        verifyData.roomNo?
                                            <View style={{marginTop:20}}>
                                                <View  style={{flexDirection:"row",marginTop:10,alignItems:"center"}}>
                                                    <Text style={{flex:1}}>房间号:</Text>
                                                    <Text style={{flex:3}}>{verifyData.roomNo}</Text>
                                                </View>
                                                <View  style={{flexDirection:"row",marginTop:10,alignItems:"center"}}>
                                                    <Text style={{flex:1}}>类型:</Text>
                                                    <Text style={{flex:3}}>{verifyData.type}</Text>
                                                </View>
                                                <View  style={{flexDirection:"row",marginTop:10,alignItems:"center"}}>
                                                    <Text style={{flex:1}}>价格:</Text>
                                                    <Text style={{flex:3}}>{verifyData.rentPrice}元/月</Text>
                                                </View>
                                                <View  style={{flexDirection:"row",marginTop:10,alignItems:"center"}}>
                                                    <Text style={{flex:1}}>租期:</Text>
                                                    <Text style={{flex:3}}>{verifyData.rentPeriod}个月</Text>
                                                </View>
                                                <View  style={{flexDirection:"row",marginTop:10,alignItems:"center"}}>
                                                    <Text style={{flex:1}}>起租期:</Text>
                                                    <Text style={{flex:3}}>{verifyData.checkinDate&&moment(verifyData.checkinDate).format("YYYY-MM-DD")}</Text>
                                                </View>

                                            </View>:null
                                    }



                                    <View style={{alignItems:"center",marginTop:30}}>


                                        {
                                            this.state.flag?

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

                                                <View style={{flexDirection:"row",justifyContent:"space-around",width:"100%"}}>
                                                    <LinearGradient colors={['#00adfb', '#00618e']} style={{width:100,borderRadius:5}}>
                                                        <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                                            alignItems:"center"
                                                        }} onPress={this.verifyCoupon }>
                                                            <Text
                                                                style={{fontSize:16,textAlign:"center",color:"#fff"}}>
                                                                验证
                                                            </Text>
                                                        </TouchableHighlight>
                                                    </LinearGradient>
                                                    <LinearGradient colors={['#00adfb', '#00618e']} style={{width:100,borderRadius:5}}>
                                                        <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                                            alignItems:"center"
                                                        }} onPress={this.submitBtn }>
                                                            <Text
                                                                style={{fontSize:16,textAlign:"center",color:"#fff"}}>
                                                                确定
                                                            </Text>
                                                        </TouchableHighlight>
                                                    </LinearGradient>
                                                </View>


                                        }





                                    </View>
                                </View>
                            </ScrollView>

                            :
                            <View style={{alignItems:"center",marginTop:30}}>
                                <Text>{!this.state.aa?'查询优惠券中':"暂无可用优惠券"}</Text>
                            </View>)

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
                                        paddingBottom:215,
                                    },
                                    ios:{
                                        paddingBottom:195,
                                    }
                                }),
                            }}>

                                <FlatList
                                    data={couponList}  //列表的渲染数据源
                                    getItemLayout={(data, index) => ( {length: 80, offset: 80 * index, index} )}
                                    initialNumToRender={10}  //首次渲染的条数
                                    ListEmptyComponent={()=><View style={{marginTop:30,alignItems:"center"}}><Text>{this.state.bb?'暂无发放记录':'查询发放记录中'}</Text></View>}
                                    onEndReached={()=>{this.onEndReached()}}  //列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
                                    onEndReachedThreshold={0.1} //定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                                    onRefresh={()=>{this.onRefresh()}} //下拉刷新
                                    refreshing={refreshing} //下拉刷新时候的正在加载的符号，设置为true显示，false隐藏。加载完成，需要设置为false
                                    keyExtractor={(item,index)=>`${index}`}
                                    renderItem={({item,index})=>(
                                        <View key={index}  style={[styles.d,styles.e,]}>

                                            <View  style={[styles.aaa,{flex:3,alignItems:"center",justifyContent:"center"}]}>
                                                <Text style={{fontSize:18,fontWeight:"bold"}}>{item.couponMoney}元</Text>
                                                <Text style={{marginTop:5,color:"grey"}}>{item.createTime}</Text>
                                            </View>

                                            <View style={[styles.aaa,{flex:3,alignItems:"center",justifyContent:"center"}]}>
                                                <Text>{item.couponName}</Text>
                                                <Text  style={{marginTop:5,}}><Text style={{fontSize:18,fontWeight:"bold"}}>{item.couponCount}</Text>张</Text>
                                            </View>


                                            <View style={[styles.aaa,{flex:3,alignItems:"center",justifyContent:"center"}]}>
                                                <Text  style={{color:"grey"}}>{item.phoneNo}</Text>
                                                <Text  style={{marginTop:5}}> 发放人:<Text  style={{fontWeight:"bold"}}>{item.sendName}</Text></Text>
                                            </View>


                                            <View style={[styles.aaa,{flex:2,alignItems:"center",justifyContent:"center"}]}>
                                                <Text>已使用</Text>
                                                <Text  style={{marginTop:5}}><Text style={{fontSize:18,fontWeight:"bold"}}>{item.useCount}</Text>张</Text>

                                                {!item.useCount&&<Text onPress={()=>{this.deleteCoupons(item)}} style={{marginTop:5,fontWeight:"bold",color:"red"}}>删除</Text>
                                                }
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
    aaa:{
        paddingTop:10,paddingBottom:10,paddingLeft:3,paddingRight:3,borderRightWidth:1,borderRightColor:"#ccc",
    },

    aa:{
        borderColor:"#f0f0f0",
        borderWidth:1,
        flexDirection:"row",
        backgroundColor:"#fff",
        padding:10,paddingTop:15,
        paddingBottom:15,
        // borderRadius:10,
        alignItems:"center"
    }


});
export default connect (
    state => ({reduxData: state.reduxData}),
    dispath => bindActionCreators({setHotelNo},dispath)
)(Mine);
