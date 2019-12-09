import React,{Component} from 'react';
import {
    Linking, DeviceEventEmitter, View, Text, Image, TextInput, Modal, Platform, StyleSheet, FlatList, ScrollView,
    TouchableHighlight, Dimensions, Keyboard, Alert, PermissionsAndroid, ActivityIndicator
} from 'react-native';

import close from "../HomePage/style/close.png";
import s1 from "../HomePage/style/sanjiao.png";
import topBg from "../HomePage/style/topBg.png";
import add from "./style/add.png";

import {Picker,DatePicker,Toast} from 'antd-mobile'
import axios from "../../axios";
import axioss from "axios";

import callIcon from '../HomePage/style/60.png'

import selectIcon from '../HomePage/style/selectIcon.png'
import moment from "moment";
import * as wechat from "react-native-wechat";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setHotelNo} from "../../components/active/reducer";
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from "react-native-image-picker";
let city = {
    11: "北京市",
    12: "天津市",
    13: "河北省",
    14: "山西省",
    15: "内蒙古自治区",
    21: "辽宁省",
    22: "吉林省",
    23: "黑龙江省",
    31: "上海市",
    32: "江苏省",
    33: "浙江省",
    34: "安徽省",
    35: "福建省",
    36: "江西省",
    37: "山东省",
    41: "河南省",
    42: "湖北省",
    43: "湖南省",
    44: "广东省",
    45: "广西自治区",
    46: "海南省",
    50: "重庆市",
    51: "四川省",
    52: "贵州省",
    53: "云南省",
    54: "西藏自治区",
    61: "陕西省",
    62: "甘肃省",
    63: "青海省",
    64: "宁夏自治区",
    65: "新疆自治区",
    71: "台湾省",
    81: "香港特别行政区",
    82: "澳门特别行政区",
    91: "国外 "
};
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


 class GoodSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            handelMsg: [
                {
                    value: "预约单",
                    flag: true
                },

                {
                    value: "预订单",
                    flag: false
                },

                {
                    value: "签约单",
                    flag: false
                },


            ],
            paddingbottom: 0,
            price:0,
            apm: null,
            modal: null,
            uri1:'',
            uri3:'',
            uri2:'',
            uri4:'',
            cardCode:'',
            cardCode2:'',
            cardAddress:'',
            cardAddress2:'',
            cardImg:'',
            cardImg2:'',
            uploadIdCardType: false,
            uploadIdCardType2: false,
            username: '',
            username2: '',
            phone: '',
            phone2: '',
            showLoading:false,
            date: new Date(),
            rentInDate: new Date(),
            rentOutDate: null,
            changeMsg: "预约单",
            customerFrom: [],//客户来源
            customer: [],
            comefromList: [],
            takerList: [],
            saleList: [],
            roomtypeList: [],
            rentPolicyList: [],
            rentPolicyAllData: [],
            rentPolicy: [],
            rentPolicyData: {},
            roomtype: [],
            saleArr: [],
            sale: [],
            yuyueData: {},
            registerList: [],
            yudingData: {},
            orderList: [],

            yudingState: false,
            qianyueData: {},
            chechinList: [],
            yixiang: [],
            roomList: [],
            room: [],
            id: '',
            refreshing: false,
            addMan: false,
            yuyuePage: 1,
            yudingPage: 1,
            qianyuePage: 1,
            yixiangList: [
                {
                    value: '0',
                    label: '一般',
                },

                {
                    value: '1',
                    label: '满意',
                },
                {
                    value: '2',
                    label: '喜欢',
                },
            ],
            amountTypeList: [
                {
                    value: '1',
                    label: '订金',
                },

                {
                    value: '2',
                    label: '意向金',
                },

            ],

            hotelName:'',

            amountType: ['1'],
            leaseList: [
                {
                    value: '12',
                    label: '一年',
                },

                {
                    value: '1',
                    label: '1个月',
                },
                {
                    value: '2',
                    label: '2个月',
                },
                {
                    value: '3',
                    label: '3个月',
                },
                {
                    value: '4',
                    label: '4个月',
                },
                {
                    value: '5',
                    label: '5个月',
                },
                {
                    value: '6',
                    label: '半年',
                },
                {
                    value: '7',
                    label: '7个月',
                },
                {
                    value: '8',
                    label: '8个月',
                }, {
                    value: '9',
                    label: '9个月',
                },
                {
                    value: '10',
                    label: '10个月',
                },
                {
                    value: '11',
                    label: '11个月',
                },

                {
                    value: '24',
                    label: '两年',
                },


            ],
            lease: ['12'],

            dateStatus: [
                {
                    value: "上午",
                    flag: false
                },
                {
                    value: "下午",
                    flag: false
                },


            ],

            daikanren: null,
            note: "",
            deposit: '',
            animationType: 'none',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示
            hotelNo: "",
            aa: false,
            bb: false,
            cc: false,
            realName: '',
            depositData:{}

        };

        this.rentPolicyArr = [];
        this.disabled=false;
    }




    componentWillMount(){
        this.getAll();
        this.getSalesmanList();
        this.getTakerTakermanList();

    }

     componentWillReceiveProps(){

         this.setState({
             refreshing:true
         },()=>{
             this.getAll()
         })


        this.getSalesmanList();
        this.getTakerTakermanList();
    }



     permissions = async(uri)=>{

         const check =  await PermissionsAndroid.check(
             PermissionsAndroid.PERMISSIONS.CAMERA)
         console.log(check,"checkcheck")

         if(check){
             this.uploadPic(uri)
         }else {
             const granted = await PermissionsAndroid.request(
                 PermissionsAndroid.PERMISSIONS.CAMERA,
                 {
                     title: '申请拍照和照片权限',
                     message:
                         'app申请拍照和照片权限，请开通此权限，否则不能上传图片',
                     // buttonNeutral: '等会再问我',
                     buttonNegative: '拒绝',
                     buttonPositive: '允许',
                 },
             )
             if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                 console.log("You can use the camera")
             } else {
                 console.log("Camera permission denied")
             }
         }
     }

     //上传图片
     uploadPic = (item) => {

         const options = {
             title: '选择图片',
             cancelButtonTitle: '取消',
             takePhotoButtonTitle: '拍照',
             chooseFromLibraryButtonTitle: '选择照片',
             cameraType: 'back',
             mediaType: 'photo',
             videoQuality: 'high',
             durationLimit: 10,
             maxWidth: 600,
             maxHeight: 400,
             quality: 1,
             angle: 0,
             allowsEditing: false,
             noData: false,
             storageOptions: {
                 skipBackup: true
             }
         };

         ImagePicker.showImagePicker(options, (response) => {
             console.log('Response = ', response);


             if (response.didCancel) {
                 console.log('User cancelled photo picker');
             }
             else if (response.error) {
                 console.log('ImagePicker Error: ', response.error);
             }
             else if (response.customButton) {
                 console.log('User tapped custom button: ', response.customButton);
             }
             else {

                 console.log(response.data);

                 if(item==1){
                     this.setState({
                         uri1: `data:image/png;base64,${response.data}`
                     });



                 }

                 if(item==2) {
                     this.setState({
                         uri2: `data:image/png;base64,${response.data}`
                     });
                 }

                 if(item==3) {
                     this.setState({
                         uri3: `data:image/png;base64,${response.data}`
                     });
                 }

                 if(item==4) {
                     this.setState({
                         uri4: `data:image/png;base64,${response.data}`
                     });
                 }


             }
         });

     }


     loadingType = (showLoading)=>{
        this.setState({showLoading})
     }


     submitIdCard = (item)=>{
         let {uri1,uri2,uri3,uri4} = this.state;
         console.log(item,'12345')


         if(!item&&!uri1){

             alert('请上传租客身份证正面照')
             return
         }

         if(!item&&!uri2){

             alert('请上传租客身份证反面照')
             return
         }

         if(item&&!uri3){

             alert('请上传租客2身份证正面照')
             return
         }

         if(item&&!uri4){

             alert('请上传租客2身份证反面照')
             return
         }


         let data = !item?{idCard1:uri1,
                 idCard2:uri2,}:{idCard1:uri3,
             idCard2:uri4,}




         this.loadingType(true)

         axioss.post('https://47.95.116.56:8443/file_upload/addCardFiles', data)
             .then( (response)=> {
                 console.log(response);
                 this.loadingType(false)
                 if(response.data.code==0){

                     let a = response.data.idCard.substring(0,2)



                     alert(`验证通过,您已上传成功,该身份证归属省为${city[a-0]}`)
                     this.setState(
                         !item?
                         {username:response.data.cardName,cardCode:response.data.idCard,cardAddress:response.data.addressWords,cardImg:response.data.msg}
                         :
                             {username2:response.data.cardName,cardCode2:response.data.idCard,cardAddress2:response.data.addressWords,cardImg2:response.data.msg}
                     )


                 }else{
                     this.setState(!item?{uri1:'',uri2:''}:{uri3:'',uri4:''})
                     alert(response.data.msg==''?response.data:response.data.msg);
                 }

             })
             .catch(function (error) {
                 console.log(error);
             });
     }


    //获取全部单
    getAll = ()=>{

        this.getRegisterList();
        this.getOrderList();
        this.getCheckinList();
        this.getComefromList();

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



            this.setState({
                realName:ret.realName,
                hotelName:aaa[0].hotelName
            })

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

    //获取预约单
    getRegisterList = ()=>{

        axios.post(`/sales/getRegisterList`, {
            page:1,
            hotelNo:this.props.reduxData.hotelNo
        })
            .then((response) =>{
                console.log(response,'预约');

                this.setState({
                    aa:true,
                    refreshing:false,
                },()=>{
                    if(response.data.code==0){

                        let yuyueData = {};
                        yuyueData.appointCount = response.data.data.appointCount;
                        yuyueData.visitCount = response.data.data.visitCount;

                        this.setState({
                            yuyueData,
                            registerList:response.data.data.registerList,

                        })
                    }else if(response.data.code==1){
                        Toast.info(response.data.message,1)
                    }
                })




            })
            .catch(function (error) {
                console.log(error);
            })
    };

    //获取签约单
    getCheckinList=()=>{

        axios.post(`/sales/getCheckinList`, {
            page:1,
            hotelNo:this.props.reduxData.hotelNo
        })
            .then((response) =>{
                console.log(response,'签约');

                this.setState({
                    cc:true,
                    refreshing:false
                },()=>{
                    if(response.data.code==0){

                        let qianyueData = {};
                        qianyueData.checkinRate = response.data.data.checkinRate;
                        qianyueData.orderRate = response.data.data.orderRate;



                        this.setState({
                            // yudingState:true,
                            qianyueData,
                            chechinList:response.data.data.checkinList,

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

    //获取预订单
    getOrderList=()=>{

        axios.post(`/sales/getOrderList`, {
            page:1,
            hotelNo:this.props.reduxData.hotelNo
        })
            .then((response) =>{
                console.log(response,'预定');

                this.setState({
                    bb:true,
                    refreshing:false
                },()=>{
                    if(response.data.code==0){

                        let yudingData = {};
                        yudingData.orderCount = response.data.data.orderCount;
                        yudingData.signCount = response.data.data.signCount;



                        this.setState({
                            yudingState:true,
                            yudingData,
                            orderList:response.data.data.orderList,

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



    //选择状态
    handelMsg=(item)=>{

        let {handelMsg,yudingState} = this.state;

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
            if(item.value=='预订单'){
                // if(!this.state.yudingState){
                //
                // }

                // this.getOrderList()

            }


            if(item.value=='签约单'){
                // if(!this.state.yudingState){
                //
                // }

                // this.getCheckinList();

            }
        })

    }

    //下拉刷新
    onRefresh=(item)=>{
        this.setState({
            refreshing:true
        },()=>{

            if(item==1){
                this.getRegisterList();
                this.setState({
                    refreshing:false,
                    yuyuePage:1

                });
            }else if(item==2){
                this.getOrderList();
                this.setState({
                    refreshing:false,
                    yudingPage:1

                });
            }else {
                this.getCheckinList();
                this.setState({
                    refreshing:false,
                    qianyuePage:1

                });
            }





        })
    }

    //上拉加载
    onEndReached = (item) => {

        let {chechinList,qianyuePage,registerList,yuyuePage,orderList,yudingPage,hotelNo} = this.state;

        if(item==1){
            this.setState({
                yuyuePage:yuyuePage+1
            },()=>{
                console.log(this.state.yuyuePage);
                axios.post(`/sales/getRegisterList`, {
                    page:this.state.yuyuePage,
                    hotelNo:this.props.reduxData.hotelNo
                })
                    .then((response) =>{
                        console.log(response,'预约');
                        if(response.data.code==0){

                            let yuyueData = {};
                            yuyueData.appointCount = response.data.data.appointCount;
                            yuyueData.visitCount = response.data.data.visitCount;

                            if(response.data.data.registerList.length>0){
                                this.setState({

                                    registerList:[...registerList,...response.data.data.registerList],

                                })
                            }


                            this.setState({
                                yuyueData,


                            })
                        }


                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            })
        }else if(item==2){

            this.setState({
                yudingPage:yudingPage+1
            },()=>{
                axios.post(`/sales/getOrderList`, {
                    page:this.state.yudingPage,
                    hotelNo:this.props.reduxData.hotelNo
                })
                    .then((response) =>{
                        console.log(response,'预定');
                        if(response.data.code==0){

                            let yudingData = {};
                            yudingData.orderCount = response.data.data.orderCount;
                            yudingData.signCount = response.data.data.signCount;

                            if(response.data.data.orderList.length>0){
                                this.setState({

                                    orderList:[...orderList,...response.data.data.orderList],

                                })
                            }

                            this.setState({
                                yudingData,

                            })
                        }


                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            })
        }else {
            this.setState({
                qianyuePage:qianyuePage+1
            },()=>{
                axios.post(`/sales/getCheckinList`, {
                    page:this.state.qianyuePage,
                    hotelNo:this.props.reduxData.hotelNo
                })
                    .then((response) =>{
                        console.log(response,'签约');
                        if(response.data.code==0){

                            let qianyueData = {};
                            qianyueData.checkinRate = response.data.data.checkinRate;
                            qianyueData.orderRate = response.data.data.orderRate;

                            if(response.data.data.checkinList.length>0){
                                this.setState({

                                    chechinList:[...chechinList,...response.data.data.checkinList],

                                })
                            }

                            this.setState({
                                qianyueData,

                            })
                        }


                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            })
        }




    };

    //选择上午下午
    dateStatus=(item)=>{

        let {dateStatus} = this.state;

        dateStatus.map((_item)=>{
            if(_item.value==item.value){
                _item.flag=!item.flag;
            }else {
                _item.flag = false
            }

        })

        this.setState({
            dateStatus
        },()=>{
            if(item.flag){
                this.setState({
                    apm:item.value=='上午'?'am':'pm'
                })
            }else {
                this.setState({
                    apm:null
                })
            }
        })

    }





    //获取客户来源和房型
    getComefromList=(_item={})=>{

        console.log(_item,'_item.id');

        if(!_item.id){

            axios.post(`/roomState/filterInitialization`, {
                hotelNo:this.props.reduxData.hotelNo
            })
                .then((response) =>{
                    console.log(response,'获取客户来源和房型');

                    let data = response.data;

                    //客户来源
                    if(data.comefromList.length>0){

                        let comefromInfo = [];
                        let ccc = [];

                        data.comefromList.map((item)=>{
                            let b = {
                                value:item.comefromNo,
                                label:item.comefromName,
                            }

                            comefromInfo.push(b)


                            if(this.state.modal=='addOrder'||this.state.modal=='addCheckin'){

                                if(item.comefromName=='自来客'){
                                    ccc[0] = item.comefromNo
                                }
                            }



                        })


                        this.setState({
                            customerFrom:comefromInfo,
                            comefromList:data.comefromList,
                            customer:ccc
                        })
                    }

                    //房型
                    if(data.roomtypeList.length>0){

                        let roomtype = [];


                        data.roomtypeList.map((item)=>{
                            let b = {
                                value:item.roomtypeNo,
                                label:item.roomtypeName,
                            }

                            roomtype.push(b)

                        });

                        let ccc = [];

                        ccc[0] = roomtype[0].value;

                        this.setState({
                            roomtypeList:roomtype,
                            roomtype:ccc
                        },()=>{
                            this.getEnableRoom()
                            // this.getRentPolicy()
                        })



                    }

                })
                .catch(function (error) {
                    console.log(error);
                })


        }else {

            let {roomtype,roomtypeList} = this.state;
            let ccc = [];

            console.log(this.state.roomtypeList,'roomtypeList');
            console.log(this.state.roomtype,'roomtype');

            ccc[0] = _item.roomTypeNo?_item.roomTypeNo:roomtypeList[0].value;

            this.setState({
                roomtype:ccc
            },()=>{
                this.getEnableRoom(_item)

            })



        }
    };

    //获取销售人
    getSalesmanList = ()=>{
        axios.post(`/common/getSalesmanList`, {
            saleType:"1"
        })
            .then((response) =>{
                console.log(response,'获取销售');



                if(response.data.code==0){
                    let data = response.data.data;
                    //客户来源
                    if(data.length>0){

                        let saleArr = [];

                        data.map((item)=>{
                            let b = {
                                value:item.saleNo,
                                label:item.saleName,
                            }

                            saleArr.push(b)

                        })





                        this.setState({
                            saleList:saleArr,
                        })
                    }
                }





            })
            .catch(function (error) {
                console.log(error);
            })
    };


    //退租日期加减
    setRentOutDate = (_item={})=>{

        console.log(_item,'setRentOutDate');

        let {rentInDate,lease,rentOutDate} = this.state;

        console.log(rentInDate,lease[0],lease[0]-0,'lease[0],');

        rentOutDate = moment(rentInDate).add(lease[0]-0, 'months').subtract(1, 'days');



        this.setState({
            rentOutDate:rentOutDate._d
        },()=>{
            this.getComefromList(_item)

        })

    };


    //获取可用房

    getEnableRoom = (_item={})=>{

        let {roomtype,rentInDate,rentOutDate} = this.state;

        //获取可用房
        axios.post(`/roomState/getEnableRoom`, {
            hotelNo:this.props.reduxData.hotelNo,
            roomTypeNo:roomtype[0],
            beginDate:moment(rentInDate).format('YYYY-MM-DD'),
            endDate:moment(rentOutDate).format('YYYY-MM-DD'),
        })
            .then((response) =>{
                console.log(response,'获取可用房');

                let data = response.data.data;

                //房型
                if(response.data.code==0){

                    let roomList = [];
                    let ccc = [];

                    if(!_item.roomNo){
                        let noRoom = {
                            value:'',
                            label:'暂不选择房间',
                        }
                        roomList.push(noRoom)
                    }

                    if(data.length>0){
                        data.map((item)=>{
                            let b = {
                                value:item.roomNo,
                                label:item.roomNo,
                            }

                            roomList.push(b)

                        });
                    }


                    if(!_item.roomNo){

                        ccc[0] = roomList.length>0?roomList[0].value:'';

                    }else {

                        ccc[0] = _item.roomNo;
                        let c = {
                            value:_item.roomNo,
                            label:_item.roomNo,
                        }

                        roomList.push(c);

                    }





                    this.setState({
                        roomList,
                        room:ccc
                    },()=>{
                        this.getRentPolicy(_item)


                    })
                }


            })
            .catch(function (error) {
                console.log(error);
            })




    }



    //获取租金方案
    getRentPolicy = (_item={})=>{

        console.log(_item,'123456788765432sdfghj');

        let {room,rentInDate,customer,lease} = this.state;

        let data = {
            hotelNo:this.props.reduxData.hotelNo,
            roomNo:room[0],
            comefrom:customer[0],
            rentPeriod:lease[0]-0,
            checkinDate:moment(rentInDate).format('YYYY-MM-DD'),
        }


        if(this.state.changeMsg=='预订单'){
            if(_item){
                data.policyId = _item.policyId;
                data.orderNo = _item.orderNo;
            }
        }



        axios.post(`/common/getRentPolicy`, data)
            .then((response) =>{
                console.log(response,'获取租金方案');

                let data = response.data.data;

                //房型
                if(data.length>0){

                    let rentPolicyList = [];


                    data.map((item)=>{
                        let b = {
                            value:item.policyId,
                            label:item.policyName,
                        }

                        rentPolicyList.push(b)

                    });


                    let ccc = [];
                    let ddd = {};

                    if(!_item.policyId){
                        ccc[0] = rentPolicyList[0].value;
                        ddd = data[0]
                    }else {

                        data.map((item)=>{
                            if(item.policyId==_item.policyId){
                                ddd = item
                                ccc[0] = _item.policyId;

                            }
                        });


                    }

                    console.log(ddd,'ddd.ddd');

                    this.rentPolicyArr = ddd.fees;

                    console.log(this.rentPolicyArr,'rentPolicyArr');

                    this.setState({
                        rentPolicyList,rentPolicyData:ddd,

                        rentPolicy:ccc,rentPolicyAllData:data,
                    })




                }


            })
            .catch(function (error) {
                console.log(error);
            })




    }


    //租金方案修改
    changeRentPolicy = ()=>{
        let ddd = {};
        this.state.rentPolicyAllData.map((item)=>{
            if(item.policyId==this.state.rentPolicy[0]){
                ddd = item
            }
        });

        this.rentPolicyArr = ddd.fees;

        console.log(this.rentPolicyArr,'rentPolicyArr');

        this.setState({
            rentPolicyData:ddd,
        })
    }

    //添加按钮
    addCustomer=(type, item = {})=>{
        this.disabled=false
        console.log(item)

        let {dateStatus} = this.state;

        dateStatus.map((_item)=>{
            _item.flag = false
        });


        if(item.roomNo){
            this.disabled=true;
        }



        this.setState(
            {
                phone: item.phoneNo || "",
                username:item.bookUser || "",
                uri1:item.cardImg?item.cardImg.split(',')[0]:'',
                uri2:item.cardImg?item.cardImg.split(',')[1]:'',
                uri3:'',
                uri4:'',
                uploadIdCardType2:false,
                uploadIdCardType:false,
                cardCode:item.cardCode ||'',
                cardCode2:'',
                cardAddress:item.cardAddress ||'',
                cardAddress2:'',
                cardImg:item.cardImg ||'',
                cardImg2:'',
                phone2:"",
                username2:"",
                sale: this.state.saleList.filter(_item => _item.label == item.saleName)[0] ? [this.state.saleList.filter(_item => _item.label == item.saleName)[0].value] : [],
                customer: this.state.customerFrom.filter(_item => _item.label == item.comefromName)[0] ? [this.state.customerFrom.filter(_item => _item.label == item.comefromName)[0].value] : [],
                apm:null,
                date:new Date(),
                dateStatus,
                addMan:false,
                lease: item.rentPeriod ? [item.rentPeriod + ''] : ['12'],
                note:'',
                rentInDate:item.checkinDate ? new Date(moment(item.checkinDate)) :new Date(),
                rentOutDate:null,
                roomtype:[],
                room:[],
                rentPolicy:[],
                // rentPolicyData:{},
                daikanren:this.state.takerList.filter(_item => _item.label == item.takerName)[0] ? [this.state.takerList.filter(_item => _item.label == item.takerName)[0].value] : [],
                amountType:['1'],
                deposit:'',


            },()=>{

                this.setRentOutDate(item);

                if(type==1){

                    this.setState(
                        {
                            modalVisible: true,
                            modal:'addCustomer' ,


                        });
                }else if(type==2){
                    // this.getComefromList(item);
                    this.setState(
                        {
                            modalVisible: true,
                            modal:'addOrder' ,
                        });
                }else if(type==3){
                    this.getComefromList(item);

                    if(!item.id) {
                        this.getTakerTakermanList();
                    }

                    this.setState(
                        {
                            modalVisible: true,
                            modal:'addCheckin' ,


                        });
                }
            });



    };


    //确定添加预定
    addOrder=()=>{

        let {cardImg,cardCode,cardAddress,hotelNo,customer,lease,username,phone,rentInDate,rentOutDate,roomtype,room,rentPolicy,sale,daikanren,amountType,note,deposit} = this.state;

        console.log(sale,'sale');

        if(username.trim()==''){
            alert('请输入租客姓名');
            return
        }

        if(phone.trim()==''){
            alert('请输入租客手机号');
            return
        }

        if(cardCode.trim()==''){
            alert('请输入租客身份证号');
            return
        }

        if(sale.length==0){
            alert('请选择上户人');
            return
        }

        if(customer.length==0){
            alert('请选择客户来源');
            return
        }

        if(roomtype.length==0){
            alert('请选择房型');
            return
        }

        // if(room.length==0){
        //     alert('请选择房间');
        //     return
        // }

        if(rentPolicy.length==0){
            alert('请选择租金方案');
            return
        }

        if(daikanren.length==0){
            alert('请选择带看人');
            return
        }



        if(deposit.trim()==''){
            alert('请填写定金金额');
            return
        }



        this.setState({
            modalVisible: false
        },()=>{

            let {handelMsg,changeMsg} = this.state;

            let data = {
                name:username,cardCode,
                phoneNo:phone,
                comefrom:customer[0],
                amountType:amountType[0]-0,
                amount:deposit,
                takerId:daikanren[0],
                salesmanId:sale[0],
                hotelNo:this.props.reduxData.hotelNo,
                rentPeriod:lease[0]-0,
                remark:note,
                policyId:rentPolicy[0],
                roomTypeNo:roomtype[0],
                roomNo:room[0],
                checkinDate:moment(rentInDate).format('YYYY-MM-DD'),
                checkoutDate:moment(rentOutDate).format('YYYY-MM-DD'),
            }

            if(cardAddress){
                data.cardAddress = cardAddress
                data.cardImg = cardImg
            }

            axios.post(`/checkin/saveApaOrder`, data)
                .then((response) =>{
                    console.log(response,'添加预定');
                    if(response.data.code==0){
                        Toast.info('添加预定成功');

                        handelMsg.map((_item)=>{
                            if(_item.value=='预订单'){
                                _item.flag=true;
                            }else {
                                _item.flag = false
                            }

                        })

                        this.setState({
                                handelMsg,
                                changeMsg:'预订单'
                            })


                        this.getOrderList();
                    }else if(response.data.code==1){
                        Toast.info(response.data.message)
                    }

                })
                .catch(function (error) {
                    console.log(error);
                })
        })


    };


    //确定添加签约
    addCheckin=()=>{

        let {cardImg,cardCode,cardAddress,cardImg2,cardCode2,cardAddress2,id,username2,phone2,hotelNo,customer,lease,username,phone,rentInDate,rentOutDate,roomtype,room,rentPolicy,sale,daikanren,amountType,note,deposit} = this.state;

        console.log(sale,'sale');

        if(this.state.rentPolicyList.length==0){
            alert('请联系运营获取租金方案');
            return
        }

        if(username.trim()==''){
            alert('请输入租客姓名');
            return
        }

        if(phone.trim()==''){
            alert('请输入租客手机号');
            return
        }

        if(cardCode.trim()==''){
            alert('请输入租客身份证号');
            return
        }

        if(sale.length==0){
            alert('请选择上户人');
            return
        }

        if(customer.length==0){
            alert('请选择客户来源');
            return
        }

        if(roomtype.length==0){
            alert('请选择房型');
            return
        }

        if(room.length==0||room[0]==''){
            alert('请选择房间');
            return
        }

        if(rentPolicy.length==0){
            alert('请选择租金方案');
            return
        }

        if(daikanren.length==0){
            alert('请选择带看人');
            return
        }


        if(this.state.addMan&&username2.trim()==''){
            alert('请输入租客2姓名');
            return
        }

        if(this.state.addMan&&phone2.trim()==''){
            alert('请输入租客2手机号');
            return
        }
        if(this.state.addMan&&cardCode2.trim()==''){
            alert('请输入租客身份证号');
            return
        }


        let type = false


        if(this.rentPolicyArr){
            this.rentPolicyArr.map((item)=>{
                if(item.amount==''||item.amount==0){
                    alert(`请输入${item.feeName}金额`);
                    type = true
                }
            })

            this.rentPolicyArr = this.rentPolicyArr.filter(item=>{
                return (item.feeCode!="100000"&&item.feeCode!="100101")
            })
        }




        console.log(this.rentPolicyArr,'this.rentPolicyArr111111');



        if(type){
            return
        }


        let aaa = {customerName:username,
            phoneNo:phone,
            idcardNo:cardCode,}

        if(cardAddress){
            aaa.address  = cardAddress
            aaa.interest  = cardImg
        }

        let customerList = [
            aaa
        ]

        if(this.state.addMan){
            let a = {
                customerName:username2,
                phoneNo:phone2,
                idcardNo:cardCode2,
            }

            if(cardAddress2){
                a.address  = cardAddress2
                a.interest  = cardImg2
            }

            customerList.push(a)

        }


        this.setState({
            modalVisible: false,

        },()=>{

            let {handelMsg} = this.state

            axios.post(`/checkin/saveApaCheckin`, {
                name:username,
                comefrom:customer[0],
                salesmanId:sale[0],
                payMonth:this.state.rentPolicyData.payMonth,
                rentPrice:this.state.rentPolicyData.rentPrice,
                deposit:this.state.rentPolicyData.rentPrice,
                takerId:daikanren[0],
                orderId:id,
                hotelNo:this.props.reduxData.hotelNo,
                rentPeriod:lease[0]-0,
                remark:note,
                policyId:rentPolicy[0],
                roomTypeNo:roomtype[0],
                roomNo:room[0],
                checkinDate:moment(rentInDate).format('YYYY-MM-DD'),
                checkoutDate:moment(rentOutDate).format('YYYY-MM-DD'),
                customerList,
                feeList:this.rentPolicyArr,
            })
                .then((response) =>{



                    console.log(response,'添加签约');
                    if(response.data.code==0){
                        Toast.info('添加签约成功');

                        handelMsg.map((_item)=>{
                            if(_item.value=='签约单'){
                                _item.flag=true;
                            }else {
                                _item.flag = false
                            }

                        })

                        this.setState({
                            handelMsg,
                            changeMsg:'签约单'
                        })

                        if(id==''){
                            this.getCheckinList();
                        }else {
                            this.getOrderList();
                            this.getCheckinList();
                        }


                    }else if(response.data.code==1){
                        Toast.info(response.data.message)
                    }


                    this.setState({
                        id:''
                    })

                })
                .catch(function (error) {
                    console.log(error);
                    this.setState({
                        id:''
                    })
                })
        })
    }



    daikan=(item)=>{
        this.setState({
                modalVisible: true,
                modal:'daikan' ,
                id:item.id,
                daikanren:[],
                yixiang:[],
                note:'',



            },
            ()=>{

                this.getTakerTakermanList()
            });
    };

    checkin = (item)=>{

        this.setState({
            id:item.id,
        },()=>{
            this.addCustomer(3,item)
        })
    }


    //预定支付
    payOrder = (item)=>{

        console.log(this.props.reduxData.hotelNo);

        let data = {
            yiPay:{
                price:item.amount,
                orderType:1,
                hotelNo:this.props.reduxData.hotelNo,
                roomNo :item.roomNo,
                orderId:item.id

            }
        }

        data.yiPay.webCallbackUrl='http://www.fangapo.cn/yiPaySuccess.html';
        data.yiPay.payTool='WECHATOFFICIAL';
        data.yiPay.credit=2;


        //读取
        storage.load({
            key: 'username',
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: false
        }).then(ret => {
            if(ret.payOrderId){
                data.yiPay.payOrderId=ret.payOrderId
            }


            axios.post(`/sales/orderConsume`,data.yiPay)
                .then( (response)=> {
                    console.log(response,'微信代付');

                    if(response.data.code==1){
                        Toast.info(response.data.message, 1);
                    }else if(response.data.code==0){

                        let data = response.data.data;

                        //读取
                        storage.load({
                            key: 'username',
                            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                            autoSync: false
                        }).then(ret => {


                            let aaa = ret.hotelList.filter(_item=>{
                                return _item.hotelNo==this.props.reduxData.hotelNo
                            })




                            wechat.shareToSession({
                                title:'预定支付',
                                description: `${aaa[0].hotelName} ${item.roomNo}-${item.bookUser}`,
                                // thumbImage: ' http://47.95.116.56:8080/file_upload/images/app/logo.png',
                                type: 'news',
                                webpageUrl: data
                            })
                                .catch((error) => {
                                    Alert.alert(error.message);
                                });

                            ret.payOrderId = response.data.payOrderId
                            return ret

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






                        // wechat.isWXAppInstalled()
                        //     .then((isInstalled) => {
                        //
                        //         if (isInstalled) {
                        //
                        //         } else {
                        //             Alert.alert('请安装微信');
                        //         }
                        //     });


                    }



                })
                .catch(function (error) {
                    console.log(error);
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


    order = (item)=>{

        this.setState({
            id:item.id,
        },()=>{
            this.addCustomer(2,item)
        })



    }



    //获取带看人
    getTakerTakermanList=()=>{
        axios.post(`/common/getSalesmanList`, {
            saleType:"2"
        })
            .then((response) =>{
                console.log(response,'获取带看人');



                if(response.data.code==0){
                    let data = response.data.data;
                    //客户来源
                    if(data.length>0){

                        let takerArr = [];

                        data.map((item)=>{
                            let b = {
                                value:item.saleNo,
                                label:item.saleName,
                            }

                            takerArr.push(b)

                        })

                        this.setState({
                            takerList:takerArr,
                        },()=>{

                            let aaa = [];
                            data.map((item)=>{
                                if(this.state.realName==item.saleName){

                                    aaa[0] = item.saleNo;
                                }

                            })


                            this.setState({
                                daikanren:aaa
                            })


                        })
                    }
                }





            })
            .catch(function (error) {
                console.log(error);
            })
    };

    //确定添加带看人
    submitTaker=()=>{

        let{daikanren,yixiang,note,id,realName} = this.state;
        console.log('daikanren,yixiang,note',daikanren,yixiang,note);



        if(daikanren.length==0){
            alert('请选择带看人');
            return
        }

        if(yixiang.length==0){
            alert('请选择意向性');
            return
        }

        this.setState({ modalVisible: false },()=>{
            axios.post(`/sales/editRegister`, {
                hotelNo:this.props.reduxData.hotelNo,
                id,
                // takerNo:realName,
                takerNo:daikanren[0],
                interntCode:yixiang[0],
                remark:note
            })
                .then((response) =>{
                    console.log(response,'确定添加带看人');
                    if(response.data.code==0){
                        Toast.info('添加成功');
                        this.getRegisterList();
                    }else {
                        Toast.info('添加失败')
                    }





                })
                .catch(function (error) {
                    console.log(error);
                    Toast.info('添加失败')
                })
        });


    }


     deposit = ()=>{
        if(!this.state.price){
            alert('请填写金额')
            return
        }

         axios.post(`/checkin/updateApaOrder`, {
             orderId:this.state.depositData.id,
             price:this.state.price,
             payTool:'WECHATOFFICIAL',
             hotelNo:this.props.reduxData.hotelNo,

         })
             .then((response) =>{
                 console.log(response,'补定金');
                 if(response.data.code==0){
                     let data = response.data.data;
                     //读取
                     storage.load({
                         key: 'username',
                         // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                         autoSync: false
                     }).then(ret => {


                         let aaa = ret.hotelList.filter(_item=>{
                             return _item.hotelNo==this.props.reduxData.hotelNo
                         })




                         wechat.shareToSession({
                             title:'补定金',
                             description: `${aaa[0].hotelName} ${this.state.depositData.roomNo}-${this.state.depositData.bookUser}`,
                             // thumbImage: ' http://47.95.116.56:8080/file_upload/images/app/logo.png',
                             type: 'news',
                             webpageUrl: data
                         })
                             .catch((error) => {
                                 Alert.alert(error.message);
                             });

                         ret.payOrderId = response.data.payOrderId
                         return ret

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
                 }else if(response.data.code==1){
                     alert(response.data.message);
                 }

             })
             .catch(function (error) {
                 console.log(error);
             })
     }

     setDeposit = (item)=>{
        console.log(item,'itemitemitemitemitem');
         this.setState({
             price:0,
             modal:'补定金',
             depositData:item,
             modalVisible:true

         })

     }

    //确定添加预约客户
    submit=()=>{

        let {username,phone,date,sale,customer,apm,saleArr} = this.state;

        if(username==''){
            alert('请输入姓名');
            return
        }

        if(phone.trim()==''){
            alert('请输入电话号码');
            return
        }

        if(sale.length==0){
            alert('请选择上户人');
            return
        }

        if(customer.length==0){
            alert('请选择客户来源');
            return
        }

        if(apm==null){
            alert('请选择上午下午');
            return




        }

        this.setState({ modalVisible: false },()=>{
            axios.post(`/sales/saveRegister`, {
                hotelNo:this.props.reduxData.hotelNo,
                bookUser:username,
                phoneNo:phone.replace(/\s+/g,""),
                comefrom:customer[0],
                saleNo:sale[0],
                amOrPm:apm,
                appointTime:moment(date).format('YYYY-MM-DD'),
            })
                .then((response) =>{
                    console.log(response,'确定添加预约客户');
                    if(response.data.code==0){
                        Toast.info('添加成功');
                        this.getRegisterList();
                    }else if(response.data.code==1){
                        Toast.info(response.data.message);
                    }





                })
                .catch(function (error) {
                    console.log(error);
                    Toast.info('添加失败')
                })
        })





    };


    _setModalVisible = (visible) => {

        this.setState({ modalVisible: visible })
    };


    //改变签约各项费用
    changeFees=(fees,item)=>{

        let {rentPolicyData} = this.state;

        if(fees!=0){

            rentPolicyData.fees.map((_item)=>{
                if(_item.feeName==item.feeName){
                    _item.amount=fees-0
                }

            })

        }


        this.rentPolicyArr = rentPolicyData.fees


    }




    //打电话
    call = (item)=>{
        Linking.openURL(`tel:${item}`);
    }

    render(){
        let{uploadIdCardType2,uploadIdCardType,rentPolicyList,rentPolicy,roomList,room,roomtype,roomtypeList,rentOutDate,rentInDate,leaseList,lease,realName,yixiangList,yixiang,qianyueData,chechinList,sale,saleList,customer,customerFrom,dateStatus,yudingData,orderList,registerList,takerList,daikanren,handelMsg,changeMsg,yuyueData,logData,refreshing} = this.state;


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
            <View style={styles.select}>
                <View>
                    <Image source={topBg} style={{height:70,width:Dimensions.get('window').width,resizeMode:"stretch"}} />
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



                <View>

                    <Modal
                        animationType={this.state.animationType}
                        transparent={this.state.transparent}
                        visible={this.state.modalVisible}
                        onRequestClose={() => { this._setModalVisible(false) } }

                    >
                        <View style={[styles.container,modalBackgroundStyle]}>
                            <View style={[styles.innerContainer,innerContainerTransparentStyle]}>

                                {this.state.modal=='addCustomer'?
                                    <View>
                                        <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>

                                            <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:16}}>添加预约</Text></View>

                                            <TouchableHighlight underlayColor={"#fff"} onPress={()=>{this._setModalVisible(false)} } style={{}}>
                                                <Image style={{height:30,width:30}} source={close}/>
                                            </TouchableHighlight>


                                        </View>

                                        <View style={{alignItems:"center",marginTop:10}}>
                                            <Text style={{fontSize:18,fontWeight:"bold",color:"#0074c3"}}>{this.state.hotelName}</Text>
                                        </View>

                                        <View style={{paddingRight:20,marginTop:10}}>

                                            <View style={styles.a}>
                                                <Text style={{flex:1}}>租客姓名:</Text>
                                                <View style={[styles.b,{flex:3}]}>
                                                    <TextInput
                                                        placeholder={'姓名'}
                                                        style={{minWidth:'100%',padding:10,borderColor:"#ccc",borderWidth:1,borderRadius:5,}}
                                                        underlineColorAndroid="transparent"
                                                        onChangeText={(name) => this.setState({username:name})}
                                                    >
                                                    </TextInput>
                                                </View>
                                            </View>

                                            <View style={styles.a}>
                                                <Text style={{flex:1}}>租客手机:</Text>
                                                <View style={[styles.b,{flex:3}]}>
                                                    <TextInput
                                                        placeholder={'手机号'}
                                                        style={{minWidth:'100%',padding:10,borderColor:"#ccc",borderWidth:1,borderRadius:5,}}
                                                        underlineColorAndroid="transparent"
                                                        onChangeText={(phone) => this.setState({phone:phone})}
                                                    >
                                                    </TextInput>
                                                </View>
                                            </View>


                                            <View style={styles.a}>
                                                <Text style={{flex:1}}>预约时间:</Text>
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
                                                <Text style={{flex:1}}>{}</Text>
                                                <View style={[styles.b,{flex:3}]}>
                                                    <View style={{flexDirection:"row",justifyContent:"space-around"}}>

                                                        {
                                                            dateStatus.map((item,index)=>
                                                                <TouchableHighlight
                                                                    onPress={()=>{this.dateStatus(item)}} key={index} underlayColor="transparent">
                                                                    <View style={{flexDirection:"row",marginRight:15,alignItems:"center"}}>
                                                                        <View style={{backgroundColor:item.flag ? "#f17e3a" :'#fff',marginRight:5,
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
                                                <Text style={{flex:1}}>销售上户:</Text>
                                                <View style={[styles.b,{flex:3}]}>


                                                    <Picker
                                                        data={saleList}
                                                        cols={1}
                                                        value={sale}
                                                        extra='请选择上户人'
                                                        // onChange={(data) => {this.setCity(data)}}
                                                        onChange={data => {this.setState({sale:data})}}
                                                        onOk={data => {this.setState({sale:data})}}
                                                        className="forss">
                                                        <RoomInfo></RoomInfo>
                                                    </Picker>



                                                </View>

                                            </View>

                                            <View style={styles.a}>
                                                <Text style={{flex:1}}>客户来源:</Text>
                                                <View style={[styles.b,{flex:3}]}>


                                                    <Picker
                                                        data={customerFrom}
                                                        cols={1}
                                                        value={customer}
                                                        extra='请选择客户来源'
                                                        // onChange={(data) => {this.setCity(data)}}
                                                        onChange={data => {this.setState({customer:data})}}
                                                        onOk={data => {this.setState({customer:data})}}
                                                        className="forss">
                                                        <RoomInfo></RoomInfo>
                                                    </Picker>



                                                </View>

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
                                    </View>:
                                    this.state.modal=='daikan'?
                                    <View>
                                        <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>

                                            <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:16}}>添加带看人</Text></View>

                                            <TouchableHighlight underlayColor={"#fff"} onPress={()=>{this._setModalVisible(false)} } style={{}}>
                                                <Image style={{height:30,width:30}} source={close}/>
                                            </TouchableHighlight>


                                        </View>

                                        <View style={{alignItems:"center",marginTop:10}}>
                                            <Text style={{fontSize:18,fontWeight:"bold",color:"#0074c3"}}>{this.state.hotelName}</Text>
                                        </View>

                                        <View style={{paddingRight:20,marginTop:10}}>



                                            <View style={styles.a}>
                                                <Text style={{flex:1}}>带看人:</Text>
                                                <View style={[styles.b,{flex:3}]}>

                                                    <Picker
                                                        data={takerList}
                                                        cols={1}
                                                        value={daikanren}
                                                        extra="请选择带看人"
                                                        // onChange={(data) => {this.setCity(data)}}
                                                        onChange={data => {this.setState({daikanren:data})}}
                                                        onOk={data => {this.setState({daikanren:data})}}
                                                        className="forss">
                                                        <RoomInfo></RoomInfo>
                                                    </Picker>


                                                    {/*<Text>*/}
                                                        {/*{this.state.realName}*/}
                                                    {/*</Text>*/}



                                                </View>

                                            </View>

                                            <View style={styles.a}>
                                                <Text style={{flex:1}}>意向性:</Text>
                                                <View style={[styles.b,{flex:3}]}>

                                                    <Picker
                                                        data={yixiangList}
                                                        cols={1}
                                                        value={yixiang}
                                                        extra="请选择意向性"
                                                        // onChange={(data) => {this.setCity(data)}}
                                                        onChange={data => {this.setState({yixiang:data})}}
                                                        onOk={data => {this.setState({yixiang:data})}}
                                                        className="forss">
                                                        <RoomInfo></RoomInfo>
                                                    </Picker>



                                                </View>

                                            </View>

                                            <View style={styles.a}>
                                                <Text  style={{flex:1}}>备注:</Text>
                                                <View style={[styles.b,{flex:3}]}>
                                                    <TextInput
                                                        placeholder={'备注'}
                                                        style={{minWidth:'100%',padding:10,borderColor:"#ccc",borderWidth:1,borderRadius:5,}}
                                                        underlineColorAndroid="transparent"
                                                        onChangeText={(name) => this.setState({note:name})}
                                                    >
                                                    </TextInput>
                                                </View>
                                            </View>



                                            <View style={{alignItems:"center",marginTop:10}}>

                                                <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                                    borderWidth:1,borderColor:"#fff",width:100,backgroundColor:"#f17e3a",
                                                    borderRadius:5}} onPress={this.submitTaker }>
                                                    <Text
                                                        style={{fontSize:16,textAlign:"center",color:"#fff"}}>
                                                        确定
                                                    </Text>
                                                </TouchableHighlight>


                                            </View>

                                        </View>
                                    </View>:
                                        this.state.modal=='addOrder'?
                                            <View>
                                                <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>

                                                    <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:16}}>添加预定单</Text></View>

                                                    <TouchableHighlight underlayColor={"#fff"} onPress={()=>{this._setModalVisible(false)} } style={{}}>
                                                        <Image style={{height:30,width:30}} source={close}/>
                                                    </TouchableHighlight>


                                                </View>

                                                <View style={{alignItems:"center",marginTop:10}}>
                                                    <Text style={{fontSize:18,fontWeight:"bold",color:"#0074c3"}}>{this.state.hotelName}</Text>
                                                </View>


                                                <ScrollView style={{height:Dimensions.get('window').height-200}}>

                                                    <View style={{paddingRight:20,marginTop:10,paddingBottom:300}}>



                                                        <View style={styles.a}>
                                                            <Text style={{flex:1}}><Text style={{color:"red"}}>*</Text>客户来源:</Text>
                                                            <View style={[styles.b,{flex:3}]}>


                                                                <Picker
                                                                    data={customerFrom}
                                                                    cols={1}
                                                                    value={customer}
                                                                    extra='请选择客户来源'
                                                                    // onChange={(data) => {this.setCity(data)}}
                                                                    onChange={data => {this.setState({customer:data})}}
                                                                    onOk={data => {this.setState({customer:data})}}
                                                                    className="forss">
                                                                    <RoomInfo></RoomInfo>
                                                                </Picker>



                                                            </View>

                                                        </View>


                                                        <View style={styles.a}>
                                                            <Text style={{flex:1}}><Text style={{color:"red"}}>*</Text>租期:</Text>
                                                            <View style={[styles.b,{flex:3}]}>

                                                                <Picker
                                                                    data={leaseList}
                                                                    cols={1}
                                                                    value={lease}
                                                                    extra='请选择租期'
                                                                    // onChange={(data) => {this.setCity(data)}}
                                                                    onChange={(lease) => {this.setState({lease},()=>{this.setRentOutDate()})}}
                                                                    // onOk={(lease) => {this.setState({lease},()=>{this.setRentOutDate()})}}

                                                                    className="forss">
                                                                    <RoomInfo></RoomInfo>
                                                                </Picker>

                                                            </View>

                                                        </View>



                                                        <View style={styles.a}>
                                                            <Text style={{flex:1}}><Text style={{color:"red"}}>*</Text>租客手机:</Text>
                                                            <View style={[styles.b,{flex:3}]}>
                                                                <TextInput
                                                                    placeholder={this.state.phone?this.state.phone:'手机号'}
                                                                    style={{minWidth:'100%',padding:10,borderColor:"#ccc",borderWidth:1,borderRadius:5,}}
                                                                    underlineColorAndroid="transparent"
                                                                    value={this.state.phone}
                                                                    onChangeText={(phone) => this.setState({phone:phone})}
                                                                >
                                                                </TextInput>
                                                            </View>
                                                        </View>



                                                        <View style={styles.a}>
                                                            <Text style={{flex:1}}>身份证:</Text>
                                                            <View style={[styles.b,{flex:3,padding:10}]}>
                                                                <Text onPress={()=>{this.setState({uploadIdCardType:!uploadIdCardType})}} style={{textDecorationLine:"underline"}}>{uploadIdCardType?'收起':'上传身份证并识别?'}</Text>
                                                            </View>
                                                        </View>

                                                        {
                                                            uploadIdCardType?
                                                            <View>

                                                                <View style={{height:210,borderWidth:5,borderColor:"#f0f0f0"}}>
                                                                    <Image style={{height:200,width:"100%",resizeMode:"contain"}}
                                                                           source={{uri:this.state.uri1}}
                                                                    />
                                                                </View>

                                                                <View style={{alignItems:"center"}}>
                                                                    <TouchableHighlight onPress={()=>{
                                                                        // this.uploadPic(1)
                                                                        if(Platform.OS== 'android'){
                                                                            this.permissions(1)
                                                                        }else {
                                                                            this.uploadPic(1)
                                                                        }
                                                                    }} underlayColor="#f0f0f0" style={{marginTop:10,marginBottom:20,width:"50%",padding:5,borderRadius:5,borderWidth:1,borderColor:"#666",alignItems:"center"}}>
                                                                        <Text style={{}}>请上传身份证正面照</Text>
                                                                    </TouchableHighlight>
                                                                </View>

                                                                <View style={{height:210,borderWidth:5,borderColor:"#f0f0f0"}}>
                                                                    <Image style={{height:200,width:"100%",resizeMode:"contain"}}
                                                                           source={{uri:this.state.uri2}}
                                                                    />
                                                                </View>

                                                                <View style={{alignItems:"center"}}>
                                                                    <TouchableHighlight onPress={()=>{
                                                                        // this.uploadPic(1)
                                                                        if(Platform.OS== 'android'){
                                                                            this.permissions(2)
                                                                        }else {
                                                                            this.uploadPic(2)
                                                                        }
                                                                    }} underlayColor="#f0f0f0" style={{marginTop:10,marginBottom:20,width:"50%",padding:5,borderRadius:5,borderWidth:1,borderColor:"#666",alignItems:"center"}}>
                                                                        <Text style={{}}>请上传身份证反面照</Text>
                                                                    </TouchableHighlight>
                                                                </View>

                                                                {this.state.showLoading?
                                                                    <View style={{ alignItems: 'center', justifyContent: 'center',marginTop:5}}>
                                                                        <ActivityIndicator
                                                                            animating={this.state.showLoading}
                                                                            color='grey'
                                                                            style={{

                                                                                width: 40,
                                                                                height: 40,
                                                                            }}
                                                                            size="small" />
                                                                    </View>:null}


                                                                <View style={{alignItems:"center",marginBottom:10}}>

                                                                    <LinearGradient colors={['#00adfb', '#00618e']} style={{width:120,borderRadius:5}}>
                                                                        <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                                                            alignItems:"center"
                                                                        }} onPress={()=>{this.submitIdCard(false)} }>
                                                                            <Text
                                                                                style={{fontSize:16,textAlign:"center",color:"#fff"}}>
                                                                                确定上传
                                                                            </Text>
                                                                        </TouchableHighlight>
                                                                    </LinearGradient>

                                                                </View>

                                                            </View>:null
                                                        }


                                                        <View style={styles.a}>
                                                            <Text style={{flex:1}}><Text style={{color:"red"}}>*</Text>租客姓名:</Text>
                                                            <View style={[styles.b,{flex:3}]}>
                                                                <TextInput
                                                                    placeholder={this.state.username?this.state.username:'姓名'}
                                                                    // value={this.state.username}
                                                                    style={{minWidth:'100%',padding:10,borderColor:"#ccc",borderWidth:1,borderRadius:5,}}
                                                                    underlineColorAndroid="transparent"
                                                                    onChangeText={(name) => this.setState({username:name})}
                                                                >
                                                                </TextInput>
                                                            </View>
                                                        </View>

                                                        <View style={styles.a}>
                                                            <Text style={{flex:1}}><Text style={{color:"red"}}>*</Text>身份证号:</Text>
                                                            <View style={[styles.b,{flex:3}]}>
                                                                <TextInput
                                                                    placeholder={this.state.cardCode?this.state.cardCode:'身份证号'}
                                                                    // value={this.state.username}
                                                                    style={{minWidth:'100%',padding:10,borderColor:"#ccc",borderWidth:1,borderRadius:5,}}
                                                                    underlineColorAndroid="transparent"
                                                                    onChangeText={(name) => this.setState({cardCode:name})}
                                                                >
                                                                </TextInput>
                                                            </View>
                                                        </View>




                                                        <View style={styles.a}>
                                                            <Text style={{flex:1}}><Text style={{color:"red"}}>*</Text>入租日期:</Text>
                                                            <View style={[styles.b,{flex:3}]}>

                                                                <DatePicker
                                                                    extra="请选择入租日期"
                                                                    format={val => formatDate(val)}
                                                                    value={this.state.rentInDate}
                                                                    mode="date"

                                                                    onChange={(rentInDate) => {this.setState({rentInDate},()=>{this.setRentOutDate()})}}
                                                                    // onOk={(rentInDate) => {this.setState({rentInDate},()=>{this.setRentOutDate()})}}



                                                                >
                                                                    <RoomInfo></RoomInfo>
                                                                </DatePicker>

                                                            </View>

                                                        </View>

                                                        <View style={styles.a}>
                                                            <Text style={{flex:1}}><Text style={{color:"red"}}>*</Text>退租日期:</Text>
                                                            <View style={[styles.b,{flex:3}]}>

                                                                <DatePicker
                                                                    extra="请选择退租日期"
                                                                    format={val => formatDate(val)}
                                                                    value={this.state.rentOutDate}
                                                                    mode="date"
                                                                    disabled={true}
                                                                    // onChange={(rentOutDate) => this.setState({rentOutDate:setRentOutDate(this.state.rentInDate,this.state.lease)})}
                                                                    // onOk={rentOutDate => this.setState({rentOutDate:setRentOutDate(this.state.rentInDate,this.state.lease)})}
                                                                >
                                                                    <RoomInfo></RoomInfo>
                                                                </DatePicker>

                                                            </View>

                                                        </View>


                                                        <View style={styles.a}>
                                                            <Text style={{flex:1}}><Text style={{color:"red"}}>*</Text>房型:</Text>
                                                            <View style={[styles.b,{flex:3}]}>


                                                                <Picker
                                                                    data={roomtypeList}
                                                                    cols={1}
                                                                    value={roomtype}
                                                                    disabled={this.disabled}
                                                                    extra='请选择房型'
                                                                    // onChange={(data) => {this.setCity(data)}}
                                                                    onChange={data => {console.log(data);this.setState({roomtype:data},()=>{this.getEnableRoom()})}}
                                                                    onOk={data => {this.setState({roomtype:data},()=>{this.getEnableRoom()})}}
                                                                    className="forss">
                                                                    <RoomInfo></RoomInfo>
                                                                </Picker>



                                                            </View>

                                                        </View>

                                                        <View style={styles.a}>
                                                            <Text style={{flex:1}}>房间:</Text>
                                                            <View style={[styles.b,{flex:3}]}>


                                                                <Picker
                                                                    data={roomList}
                                                                    cols={1}
                                                                    value={room}
                                                                    extra='请选择房间'
                                                                    disabled={this.disabled}
                                                                    // onChange={(data) => {this.setCity(data)}}
                                                                    onChange={data => {this.setState({room:data},()=>{this.getRentPolicy()})}}
                                                                    // onOk={data => {this.setState({room:data},()=>{this.getRentPolicy()})}}
                                                                    className="forss">
                                                                    <RoomInfo></RoomInfo>
                                                                </Picker>



                                                            </View>

                                                        </View>

                                                        <View style={styles.a}>
                                                            <Text style={{flex:1}}><Text style={{color:"red"}}>*</Text>租金方案:</Text>
                                                            <View style={[styles.b,{flex:3}]}>


                                                                <Picker
                                                                    data={this.state.rentPolicyList}
                                                                    cols={1}
                                                                    value={this.state.rentPolicy}
                                                                    extra='请选择租金方案'
                                                                    // onChange={(data) => {this.setCity(data)}}
                                                                    onChange={data => {this.setState({rentPolicy:data},()=>{this.changeRentPolicy()})}}
                                                                    onOk={data => {this.setState({rentPolicy:data}),()=>{this.changeRentPolicy()}}}
                                                                    className="forss">
                                                                    <RoomInfo></RoomInfo>
                                                                </Picker>



                                                            </View>

                                                        </View>


                                                        <View style={styles.a}>
                                                            <Text style={{flex:1}}>租金:</Text>
                                                            <View style={[styles.b,{flex:3}]}>

                                                                <Text style={{color:'#f17e3a'}}>{this.state.rentPolicyData.rentPrice&&this.state.rentPolicyData.rentPrice}元/月</Text>

                                                            </View>

                                                        </View>


                                                        <View style={styles.a}>
                                                            <Text style={{flex:1}}><Text style={{color:"red"}}>*</Text>销售上户:</Text>
                                                            <View style={[styles.b,{flex:3}]}>


                                                                <Picker
                                                                    data={saleList}
                                                                    cols={1}
                                                                    value={sale}
                                                                    extra='请选择上户人'
                                                                    // onChange={(data) => {this.setCity(data)}}
                                                                    onChange={data => {this.setState({sale:data})}}
                                                                    onOk={data => {this.setState({sale:data})}}
                                                                    className="forss">
                                                                    <RoomInfo></RoomInfo>
                                                                </Picker>



                                                            </View>

                                                        </View>


                                                        <View style={styles.a}>
                                                            <Text style={{flex:1}}><Text style={{color:"red"}}>*</Text>带看人:</Text>
                                                            <View style={[styles.b,{flex:3}]}>

                                                                <Picker
                                                                    data={takerList}
                                                                    cols={1}
                                                                    value={daikanren}
                                                                    extra="请选择带看人"
                                                                    // onChange={(data) => {this.setCity(data)}}
                                                                    onChange={data => {this.setState({daikanren:data})}}
                                                                    onOk={data => {this.setState({daikanren:data})}}
                                                                    className="forss">
                                                                    <RoomInfo></RoomInfo>
                                                                </Picker>


                                                                {/*<Text>*/}
                                                                {/*{this.state.realName}*/}
                                                                {/*</Text>*/}

                                                            </View>

                                                        </View>

                                                        <View style={styles.a}>
                                                            <Text style={{flex:1}}><Text style={{color:"red"}}>*</Text>定金类型:</Text>
                                                            <View style={[styles.b,{flex:3}]}>


                                                                <Picker
                                                                    data={this.state.amountTypeList}
                                                                    cols={1}
                                                                    value={this.state.amountType}
                                                                    extra='请选择定金类型'
                                                                    // onChange={(data) => {this.setCity(data)}}
                                                                    onChange={data => {this.setState({amountType:data})}}
                                                                    onOk={data => {this.setState({amountType:data})}}
                                                                    className="forss">
                                                                    <RoomInfo></RoomInfo>
                                                                </Picker>



                                                            </View>

                                                        </View>


                                                        <View style={styles.a}>
                                                            <Text  style={{flex:1}}><Text style={{color:"red"}}>*</Text>定金:</Text>
                                                            <View style={[styles.b,{flex:3}]}>
                                                                <TextInput
                                                                    placeholder={'定金'}
                                                                    style={{minWidth:'100%',padding:10,borderColor:"#ccc",borderWidth:1,borderRadius:5,}}
                                                                    underlineColorAndroid="transparent"
                                                                    onChangeText={(name) => this.setState({deposit:name})}

                                                                >
                                                                </TextInput>
                                                            </View>
                                                        </View>

                                                        <View style={styles.a}>
                                                            <Text  style={{flex:1}}>备注:</Text>
                                                            <View style={[styles.b,{flex:3}]}>
                                                                <TextInput
                                                                    placeholder={'备注'}
                                                                    multiline={true}
                                                                    style={{minWidth:'100%',height:100,padding:10,borderColor:"#ccc",borderWidth:1,borderRadius:5,}}
                                                                    underlineColorAndroid="transparent"
                                                                    onChangeText={(name) => this.setState({note:name})}

                                                                >
                                                                </TextInput>
                                                            </View>
                                                        </View>

                                                        <View style={{alignItems:"center",marginTop:10}}>

                                                            <LinearGradient colors={['#00adfb', '#00618e']} style={{width:100,borderRadius:5}}>
                                                                <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                                                    alignItems:"center"
                                                                }} onPress={this.addOrder }>
                                                                    <Text
                                                                        style={{fontSize:16,textAlign:"center",color:"#fff"}}>
                                                                        确定
                                                                    </Text>
                                                                </TouchableHighlight>
                                                            </LinearGradient>

                                                        </View>



                                                    </View>
                                                </ScrollView>




                                            </View>:
                                            this.state.modal=='addCheckin'?
                                            <View>
                                                <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>

                                                    <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:16}}>添加签约单</Text></View>

                                                    <TouchableHighlight underlayColor={"#fff"} onPress={()=>{this._setModalVisible(false)} } style={{}}>
                                                        <Image style={{height:30,width:30}} source={close}/>
                                                    </TouchableHighlight>


                                                </View>

                                                <View style={{alignItems:"center",marginTop:10}}>
                                                    <Text style={{fontSize:18,fontWeight:"bold",color:"#0074c3"}}>{this.state.hotelName}</Text>
                                                </View>

                                                <ScrollView style={{height:Dimensions.get('window').height-200}}>

                                                    <View style={{paddingRight:20,marginTop:10,paddingBottom:300}}>



                                                        <View style={styles.a}>
                                                            <Text style={{flex:1}}>客户来源:</Text>
                                                            <View style={[styles.b,{flex:3}]}>


                                                                <Picker
                                                                    data={customerFrom}
                                                                    cols={1}
                                                                    value={customer}
                                                                    extra='请选择客户来源'
                                                                    disabled={this.disabled}
                                                                    // onChange={(data) => {this.setCity(data)}}
                                                                    onChange={data => {this.setState({customer:data})}}
                                                                    onOk={data => {this.setState({customer:data})}}
                                                                    className="forss">
                                                                    <RoomInfo></RoomInfo>
                                                                </Picker>



                                                            </View>

                                                        </View>


                                                        <View style={styles.a}>
                                                            <Text style={{flex:1}}>租期:</Text>
                                                            <View style={[styles.b,{flex:3}]}>

                                                                <Picker
                                                                    data={leaseList}
                                                                    cols={1}
                                                                    value={lease}
                                                                    disabled={this.disabled}
                                                                    extra='请选择租期'
                                                                    // onChange={(data) => {this.setCity(data)}}
                                                                    onChange={(lease) => {this.setState({lease},()=>{this.setRentOutDate()})}}
                                                                    // onOk={(lease) => {this.setState({lease},()=>{this.setRentOutDate()})}}

                                                                    className="forss">
                                                                    <RoomInfo></RoomInfo>
                                                                </Picker>

                                                            </View>

                                                        </View>



                                                        <View style={styles.a}>
                                                            <Text style={{flex:1}}>入租日期:</Text>
                                                            <View style={[styles.b,{flex:3}]}>

                                                                <DatePicker
                                                                    extra="请选择入租日期"
                                                                    format={val => formatDate(val)}
                                                                    value={this.state.rentInDate}
                                                                    mode="date"

                                                                    disabled={this.disabled}
                                                                    onChange={(rentInDate) => {this.setState({rentInDate},()=>{this.setRentOutDate()})}}
                                                                    // onOk={(rentInDate) => {this.setState({rentInDate},()=>{this.setRentOutDate()})}}



                                                                >
                                                                    <RoomInfo></RoomInfo>
                                                                </DatePicker>

                                                            </View>

                                                        </View>

                                                        <View style={styles.a}>
                                                            <Text style={{flex:1}}>退租日期:</Text>
                                                            <View style={[styles.b,{flex:3}]}>

                                                                <DatePicker
                                                                    extra="请选择退租日期"
                                                                    format={val => formatDate(val)}
                                                                    value={this.state.rentOutDate}
                                                                    mode="date"
                                                                    disabled={true}
                                                                    // onChange={(rentOutDate) => this.setState({rentOutDate:setRentOutDate(this.state.rentInDate,this.state.lease)})}
                                                                    // onOk={rentOutDate => this.setState({rentOutDate:setRentOutDate(this.state.rentInDate,this.state.lease)})}
                                                                >
                                                                    <RoomInfo></RoomInfo>
                                                                </DatePicker>

                                                            </View>

                                                        </View>


                                                        <View style={styles.a}>
                                                            <Text style={{flex:1}}>房型:</Text>
                                                            <View style={[styles.b,{flex:3}]}>


                                                                <Picker
                                                                    data={roomtypeList}
                                                                    cols={1}
                                                                    value={roomtype}
                                                                    extra='请选择房型'
                                                                    disabled={this.disabled}
                                                                    // onChange={(data) => {this.setCity(data)}}
                                                                    onChange={data => {this.setState({roomtype:data},()=>{this.getEnableRoom()})}}
                                                                    onOk={data => {this.setState({roomtype:data},()=>{this.getEnableRoom()})}}
                                                                    className="forss">
                                                                    <RoomInfo></RoomInfo>
                                                                </Picker>



                                                            </View>

                                                        </View>

                                                        <View style={styles.a}>
                                                            <Text style={{flex:1}}>房间:</Text>
                                                            <View style={[styles.b,{flex:3}]}>

                                                                <Picker
                                                                    data={roomList}
                                                                    cols={1}
                                                                    value={room}
                                                                    extra='请选择房间'
                                                                    disabled={this.disabled}
                                                                    // onChange={(data) => {this.setCity(data)}}
                                                                    onChange={data => {this.setState({room:data},()=>{this.getRentPolicy()})}}
                                                                    // onOk={data => {this.setState({room:data})}}
                                                                    className="forss">
                                                                    <RoomInfo></RoomInfo>
                                                                </Picker>



                                                            </View>

                                                        </View>

                                                        <View style={styles.a}>
                                                            <Text style={{flex:1}}>租金方案:</Text>
                                                            <View style={[styles.b,{flex:3}]}>


                                                                <Picker
                                                                    data={this.state.rentPolicyList}
                                                                    cols={1}
                                                                    value={this.state.rentPolicy}
                                                                    extra='请选择租金方案'

                                                                    // onChange={(data) => {this.setCity(data)}}
                                                                    onChange={data => {this.setState({rentPolicy:data},()=>{this.changeRentPolicy()})}}
                                                                    onOk={data => {this.setState({rentPolicy:data}),()=>{this.changeRentPolicy()}}}
                                                                    className="forss">
                                                                    <RoomInfo></RoomInfo>
                                                                </Picker>



                                                            </View>

                                                        </View>


                                                        <View style={styles.a}>
                                                            <Text style={{flex:1}}>租金:</Text>
                                                            <View style={[styles.b,{flex:3}]}>

                                                                <Text style={{color:'#f17e3a'}}>{this.state.rentPolicyData.rentPrice&&this.state.rentPolicyData.rentPrice}元/月</Text>

                                                            </View>

                                                        </View>


                                                        <View style={styles.a}>
                                                            <Text style={{flex:1}}>连续交租:</Text>
                                                            <View style={[styles.b,{flex:3}]}>

                                                                <Text style={{color:'#f17e3a'}}>押{this.state.rentPolicyData.pledge&&this.state.rentPolicyData.pledge}付{this.state.rentPolicyData.payMonth&&this.state.rentPolicyData.payMonth}</Text>

                                                            </View>

                                                        </View>


                                                        <View style={styles.a}>
                                                            <Text style={{flex:1}}>销售上户:</Text>
                                                            <View style={[styles.b,{flex:3}]}>


                                                                <Picker
                                                                    data={saleList}
                                                                    cols={1}
                                                                    value={sale}
                                                                    extra='请选择上户人'
                                                                    disabled={this.disabled}
                                                                    // onChange={(data) => {this.setCity(data)}}
                                                                    onChange={data => {this.setState({sale:data})}}
                                                                    onOk={data => {this.setState({sale:data})}}
                                                                    className="forss">
                                                                    <RoomInfo></RoomInfo>
                                                                </Picker>



                                                            </View>

                                                        </View>


                                                        <View style={styles.a}>
                                                            <Text style={{flex:1}}>带看人:</Text>
                                                            <View style={[styles.b,{flex:3}]}>

                                                                <Picker
                                                                    data={takerList}
                                                                    cols={1}
                                                                    value={daikanren}
                                                                    extra="请选择带看人"
                                                                    disabled={this.disabled}
                                                                    // onChange={(data) => {this.setCity(data)}}
                                                                    onChange={data => {this.setState({daikanren:data})}}
                                                                    onOk={data => {this.setState({daikanren:data})}}
                                                                    className="forss">
                                                                    <RoomInfo></RoomInfo>
                                                                </Picker>


                                                                {/*<Text>*/}
                                                                {/*{this.state.realName}*/}
                                                                {/*</Text>*/}

                                                            </View>

                                                        </View>



                                                        <View style={styles.a}>
                                                            <Text  style={{flex:1}}>备注:</Text>
                                                            <View style={[styles.b,{flex:3}]}>
                                                                <TextInput
                                                                    placeholder={'备注'}
                                                                    multiline={true}
                                                                    style={{minWidth:'100%',height:100,padding:10,borderColor:"#ccc",borderWidth:1,borderRadius:5,}}
                                                                    underlineColorAndroid="transparent"
                                                                    onChangeText={(name) => this.setState({note:name})}
                                                                    // onFocus={this.focus}
                                                                    // onBlur={this.blur}
                                                                >
                                                                </TextInput>
                                                            </View>
                                                        </View>

                                                        <View style={styles.a}>
                                                            <Text style={{flex:1}}>租客一:</Text>
                                                            <View style={[styles.b,{flex:3}]}>
                                                                <TextInput
                                                                    placeholder={this.state.username?this.state.username:'姓名'}
                                                                    // value={this.state.username}
                                                                    editable={!this.disabled}
                                                                    style={{minWidth:'100%',padding:10,borderColor:"#ccc",borderWidth:1,borderRadius:5,}}
                                                                    underlineColorAndroid="transparent"
                                                                    onChangeText={(name) => this.setState({username:name})}
                                                                >
                                                                </TextInput>
                                                            </View>
                                                        </View>

                                                        <View style={styles.a}>
                                                            <Text style={{flex:1}}><Text style={{color:"red"}}>*</Text>身份证号:</Text>
                                                            <View style={[styles.b,{flex:3}]}>
                                                                <TextInput
                                                                    placeholder={this.state.cardCode?this.state.cardCode:'身份证号'}
                                                                    // value={this.state.username}
                                                                    style={{minWidth:'100%',padding:10,borderColor:"#ccc",borderWidth:1,borderRadius:5,}}
                                                                    underlineColorAndroid="transparent"
                                                                    onChangeText={(name) => this.setState({cardCode:name})}
                                                                >
                                                                </TextInput>
                                                            </View>
                                                        </View>

                                                        <View style={styles.a}>
                                                            <View style={{flex:1,alignItems:"center"}}>
                                                                {}
                                                            </View>
                                                            <View style={[styles.b,{flex:3,flexDirection:"row",justifyContent:'space-between'}]}>

                                                                <View style={{flex:4}}>
                                                                    <TextInput
                                                                        placeholder={this.state.phone?this.state.phone:'手机号'}
                                                                        style={{minWidth:'100%',padding:10,borderColor:"#ccc",borderWidth:1,borderRadius:5}}
                                                                        underlineColorAndroid="transparent"
                                                                        value={this.state.phone}
                                                                        editable={!this.disabled}
                                                                        onChangeText={(phone) => this.setState({phone:phone})}
                                                                    >
                                                                    </TextInput>
                                                                </View>



                                                                <TouchableHighlight underlayColor={"#fff"} onPress={()=>{this.setState({addMan:!this.state.addMan,uploadIdCardType:false})} } style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                                                                    <View><Image source={add} style={{width:30,height:30}}/></View>
                                                                </TouchableHighlight>

                                                            </View>
                                                        </View>


                                                        {
                                                            this.state.uri1.indexOf('http://47.95.116.56:8080/file_upload')!=-1?
                                                                <View>

                                                                    <View style={styles.a}>
                                                                        <Text style={{flex:1}}>{}</Text>
                                                                        <View style={[styles.b,{flex:3,padding:10}]}>
                                                                            <Text onPress={()=>{this.setState({uploadIdCardType:!uploadIdCardType})}} style={{textDecorationLine:"underline"}}>{uploadIdCardType?'收起':'查看身份证?'}</Text>
                                                                        </View>
                                                                    </View>

                                                                    {uploadIdCardType?

                                                                        <View>

                                                                            <View style={{
                                                                                height: 210,
                                                                                borderWidth: 5,
                                                                                borderColor: "#f0f0f0"
                                                                            }}>
                                                                                <Image style={{
                                                                                    height: 200,
                                                                                    width: "100%",
                                                                                    resizeMode: "contain"
                                                                                }}
                                                                                       source={{uri: this.state.uri1}}
                                                                                />
                                                                            </View>


                                                                            <View style={{
                                                                                height: 210,
                                                                                borderWidth: 5,
                                                                                borderColor: "#f0f0f0"
                                                                            }}>
                                                                                <Image style={{
                                                                                    height: 200,
                                                                                    width: "100%",
                                                                                    resizeMode: "contain"
                                                                                }}
                                                                                       source={{uri: this.state.uri2}}
                                                                                />
                                                                            </View>




                                                                        </View>:null
                                                                    }


                                                                </View>:
                                                                <View>
                                                                    <View style={styles.a}>
                                                                        <Text style={{flex:1}}>{}</Text>
                                                                        <View style={[styles.b,{flex:3,padding:10}]}>
                                                                            <Text onPress={()=>{this.setState({uploadIdCardType:!uploadIdCardType})}} style={{textDecorationLine:"underline"}}>{uploadIdCardType?'收起':'上传身份证并识别?'}</Text>
                                                                        </View>
                                                                    </View>

                                                                    {uploadIdCardType?

                                                                        <View>

                                                                            <View style={{
                                                                                height: 210,
                                                                                borderWidth: 5,
                                                                                borderColor: "#f0f0f0"
                                                                            }}>
                                                                                <Image style={{
                                                                                    height: 200,
                                                                                    width: "100%",
                                                                                    resizeMode: "contain"
                                                                                }}
                                                                                       source={{uri: this.state.uri1}}
                                                                                />
                                                                            </View>

                                                                            <View style={{alignItems: "center"}}>
                                                                                <TouchableHighlight onPress={() => {
                                                                                    // this.uploadPic(1)
                                                                                    if (Platform.OS == 'android') {
                                                                                        this.permissions(1)
                                                                                    } else {
                                                                                        this.uploadPic(1)
                                                                                    }
                                                                                }} underlayColor="#f0f0f0" style={{
                                                                                    marginTop: 10,
                                                                                    marginBottom: 20,
                                                                                    width: "50%",
                                                                                    padding: 5,
                                                                                    borderRadius: 5,
                                                                                    borderWidth: 1,
                                                                                    borderColor: "#666",
                                                                                    alignItems: "center"
                                                                                }}>
                                                                                    <Text style={{}}>请上传身份证正面照</Text>
                                                                                </TouchableHighlight>
                                                                            </View>

                                                                            <View style={{
                                                                                height: 210,
                                                                                borderWidth: 5,
                                                                                borderColor: "#f0f0f0"
                                                                            }}>
                                                                                <Image style={{
                                                                                    height: 200,
                                                                                    width: "100%",
                                                                                    resizeMode: "contain"
                                                                                }}
                                                                                       source={{uri: this.state.uri2}}
                                                                                />
                                                                            </View>

                                                                            <View style={{alignItems: "center"}}>
                                                                                <TouchableHighlight onPress={() => {
                                                                                    // this.uploadPic(1)
                                                                                    if (Platform.OS == 'android') {
                                                                                        this.permissions(2)
                                                                                    } else {
                                                                                        this.uploadPic(2)
                                                                                    }
                                                                                }} underlayColor="#f0f0f0" style={{
                                                                                    marginTop: 10,
                                                                                    marginBottom: 20,
                                                                                    width: "50%",
                                                                                    padding: 5,
                                                                                    borderRadius: 5,
                                                                                    borderWidth: 1,
                                                                                    borderColor: "#666",
                                                                                    alignItems: "center"
                                                                                }}>
                                                                                    <Text style={{}}>请上传身份证反面照</Text>
                                                                                </TouchableHighlight>
                                                                            </View>

                                                                            {this.state.showLoading ?
                                                                                <View style={{
                                                                                    alignItems: 'center',
                                                                                    justifyContent: 'center',
                                                                                    marginTop: 5
                                                                                }}>
                                                                                    <ActivityIndicator
                                                                                        animating={this.state.showLoading}
                                                                                        color='grey'
                                                                                        style={{

                                                                                            width: 40,
                                                                                            height: 40,
                                                                                        }}
                                                                                        size="small"/>
                                                                                </View> : null}


                                                                            <View style={{
                                                                                alignItems: "center",
                                                                                marginBottom: 10
                                                                            }}>

                                                                                <LinearGradient
                                                                                    colors={['#00adfb', '#00618e']}
                                                                                    style={{
                                                                                        width: 120,
                                                                                        borderRadius: 5
                                                                                    }}>
                                                                                    <TouchableHighlight
                                                                                        underlayColor={"transparent"}
                                                                                        style={{
                                                                                            padding: 10,
                                                                                            alignItems: "center"
                                                                                        }} onPress={()=>{this.submitIdCard(false)}}>
                                                                                        <Text
                                                                                            style={{
                                                                                                fontSize: 16,
                                                                                                textAlign: "center",
                                                                                                color: "#fff"
                                                                                            }}>
                                                                                            确定上传
                                                                                        </Text>
                                                                                    </TouchableHighlight>
                                                                                </LinearGradient>

                                                                            </View>

                                                                        </View>:null
                                                                    }
                                                                </View>
                                                        }



                                                        {this.state.addMan&&
                                                        <View>
                                                            <View style={styles.a}>
                                                                <Text style={{flex:1}}>租客二:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <TextInput
                                                                        placeholder={'姓名'}
                                                                        style={{minWidth:'100%',padding:10,borderColor:"#ccc",borderWidth:1,borderRadius:5,}}
                                                                        underlineColorAndroid="transparent"
                                                                        onChangeText={(name) => this.setState({username2:name})}
                                                                    >
                                                                    </TextInput>
                                                                </View>
                                                            </View>

                                                            <View style={styles.a}>
                                                                <Text style={{flex:1}}><Text style={{color:"red"}}>*</Text>身份证号:</Text>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <TextInput
                                                                        placeholder={this.state.cardCode2?this.state.cardCode2:'身份证号'}
                                                                        // value={this.state.username}
                                                                        style={{minWidth:'100%',padding:10,borderColor:"#ccc",borderWidth:1,borderRadius:5,}}
                                                                        underlineColorAndroid="transparent"
                                                                        onChangeText={(name) => this.setState({cardCode2:name})}
                                                                    >
                                                                    </TextInput>
                                                                </View>
                                                            </View>

                                                            <View style={styles.a}>
                                                                <View style={{flex:1,alignItems:"center"}}>
                                                                    {}
                                                                </View>
                                                                <View style={[styles.b,{flex:3}]}>
                                                                    <TextInput
                                                                        placeholder={'手机号'}
                                                                        style={{minWidth:'100%',padding:10,borderColor:"#ccc",borderWidth:1,borderRadius:5,}}
                                                                        underlineColorAndroid="transparent"
                                                                        onChangeText={(phone) => this.setState({phone2:phone})}
                                                                    >
                                                                    </TextInput>
                                                                </View>
                                                            </View>

                                                            <View>
                                                                <View style={styles.a}>
                                                                    <Text style={{flex:1}}>{}</Text>
                                                                    <View style={[styles.b,{flex:3,padding:10}]}>
                                                                        <Text onPress={()=>{this.setState({uploadIdCardType2:!uploadIdCardType2})}} style={{textDecorationLine:"underline"}}>{uploadIdCardType2?'收起':'上传身份证?'}</Text>
                                                                    </View>
                                                                </View>

                                                                {uploadIdCardType2?

                                                                    <View>

                                                                        <View style={{height:210,borderWidth:5,borderColor:"#f0f0f0"}}>
                                                                            <Image style={{height:200,width:"100%",resizeMode:"contain"}}
                                                                                   source={{uri:this.state.uri3}}
                                                                            />
                                                                        </View>

                                                                        <View style={{alignItems:"center"}}>
                                                                            <TouchableHighlight onPress={()=>{
                                                                                // this.uploadPic(1)
                                                                                if(Platform.OS== 'android'){
                                                                                    this.permissions(3)
                                                                                }else {
                                                                                    this.uploadPic(3)
                                                                                }
                                                                            }} underlayColor="#f0f0f0" style={{marginTop:10,marginBottom:20,width:"50%",padding:5,borderRadius:5,borderWidth:1,borderColor:"#666",alignItems:"center"}}>
                                                                                <Text style={{}}>请上传身份证正面照</Text>
                                                                            </TouchableHighlight>
                                                                        </View>

                                                                        <View style={{height:210,borderWidth:5,borderColor:"#f0f0f0"}}>
                                                                            <Image style={{height:200,width:"100%",resizeMode:"contain"}}
                                                                                   source={{uri:this.state.uri4}}
                                                                            />
                                                                        </View>

                                                                        <View style={{alignItems:"center"}}>
                                                                            <TouchableHighlight onPress={()=>{
                                                                                // this.uploadPic(1)
                                                                                if(Platform.OS== 'android'){
                                                                                    this.permissions(4)
                                                                                }else {
                                                                                    this.uploadPic(4)
                                                                                }
                                                                            }} underlayColor="#f0f0f0" style={{marginTop:10,marginBottom:20,width:"50%",padding:5,borderRadius:5,borderWidth:1,borderColor:"#666",alignItems:"center"}}>
                                                                                <Text style={{}}>请上传身份证反面照</Text>
                                                                            </TouchableHighlight>
                                                                        </View>

                                                                        {this.state.showLoading?
                                                                            <View style={{ alignItems: 'center', justifyContent: 'center',marginTop:5}}>
                                                                                <ActivityIndicator
                                                                                    animating={this.state.showLoading}
                                                                                    color='grey'
                                                                                    style={{

                                                                                        width: 40,
                                                                                        height: 40,
                                                                                    }}
                                                                                    size="small" />
                                                                            </View>:null}


                                                                        <View style={{alignItems:"center",marginBottom:10}}>

                                                                            <LinearGradient colors={['#00adfb', '#00618e']} style={{width:120,borderRadius:5}}>
                                                                                <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                                                                    alignItems:"center"
                                                                                }} onPress={()=>{this.submitIdCard(true)} }>
                                                                                    <Text
                                                                                        style={{fontSize:16,textAlign:"center",color:"#fff"}}>
                                                                                        确定上传
                                                                                    </Text>
                                                                                </TouchableHighlight>
                                                                            </LinearGradient>

                                                                        </View>

                                                                    </View>:null
                                                                }
                                                            </View>




                                                        </View>}


                                                        {/*<View style={styles.a}>*/}
                                                            {/*<Text style={{color:"grey"}}>身份证信息请租客app上自助上传</Text>*/}
                                                        {/*</View>*/}



                                                        <View style={{flexDirection:"row",alignItems:"center",marginTop:10,justifyContent:"space-between",flexWrap:"wrap"}}>
                                                            {
                                                                this.state.rentPolicyData.fees&&this.state.rentPolicyData.fees.map((item,index)=>

                                                                    <View key={index} style={{width:"50%",alignItems:"center",marginTop:10}}>

                                                                        <View style={{width:"90%",padding:10,backgroundColor:'#ccc',borderRadius:5,alignItems:"center",justifyContent:"center"}} >
                                                                            <Text style={{color:"#fff"}}>{item.feeName}</Text>

                                                                            {
                                                                                item.amount==0?
                                                                                    <View style={{alignItems:"center",marginTop:3}}>
                                                                                        <TextInput
                                                                                            placeholder={'请填写金额'}
                                                                                            style={{minWidth:'100%',padding:5,borderRadius:5,textAlign:'center',color:"#fff"}}
                                                                                            underlineColorAndroid="transparent"
                                                                                            value={item.amount+''}
                                                                                            keyboardType={'numeric'}
                                                                                            onChangeText={(fees) => this.changeFees(fees,item)}
                                                                                        >
                                                                                        </TextInput>
                                                                                    </View>:
                                                                                    <Text style={{marginTop:5,color:"#fff"}}>{item.amount}</Text>
                                                                            }


                                                                        </View>

                                                                    </View>

                                                                )
                                                            }
                                                        </View>


                                                        <View style={{alignItems:"center",marginTop:10}}>


                                                            <LinearGradient colors={['#00adfb', '#00618e']} style={{width:100,borderRadius:5}}>
                                                                <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                                                    alignItems:"center"
                                                                }} onPress={this.addCheckin }>
                                                                    <Text
                                                                        style={{fontSize:16,textAlign:"center",color:"#fff"}}>
                                                                        确定
                                                                    </Text>
                                                                </TouchableHighlight>
                                                            </LinearGradient>


                                                        </View>





                                                    </View>
                                                </ScrollView>
                                            </View>:
                                                this.state.modal=='补定金'?
                                                    <View>
                                                        <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>

                                                            <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:16}}>补定金</Text></View>

                                                            <TouchableHighlight underlayColor={"#fff"} onPress={()=>{this._setModalVisible(false)} } style={{}}>
                                                                <Image style={{height:30,width:30}} source={close}/>
                                                            </TouchableHighlight>


                                                        </View>

                                                        <View style={{alignItems:"center",marginTop:10}}>
                                                            <Text style={{fontSize:18,fontWeight:"bold",color:"#0074c3"}}>{this.state.hotelName}</Text>
                                                        </View>

                                                        <ScrollView style={{height:Dimensions.get('window').height-200}}>

                                                            <View style={{paddingRight:20,marginTop:10,paddingBottom:300}}>

                                                                <View style={styles.a}>
                                                                    <Text  style={{flex:1}}>补定金:</Text>
                                                                    <View style={[styles.b,{flex:3}]}>
                                                                        <TextInput
                                                                            placeholder={'请填写金额'}
                                                                            style={{minWidth:'100%',padding:10,borderColor:"#ccc",borderWidth:1,borderRadius:5,}}
                                                                            underlineColorAndroid="transparent"
                                                                            keyboardType={'numeric'}
                                                                            onChangeText={(price) => this.setState({price})}
                                                                        >
                                                                        </TextInput>
                                                                    </View>
                                                                </View>


                                                                <View style={{alignItems:"center",marginTop:10}}>


                                                                    <LinearGradient colors={['#00adfb', '#00618e']} style={{width:100,borderRadius:5}}>
                                                                        <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                                                            alignItems:"center"
                                                                        }} onPress={this.deposit }>
                                                                            <Text
                                                                                style={{fontSize:16,textAlign:"center",color:"#fff"}}>
                                                                                确定
                                                                            </Text>
                                                                        </TouchableHighlight>
                                                                    </LinearGradient>


                                                                </View>





                                                            </View>
                                                        </ScrollView>
                                                    </View>:null


                                }




                            </View>
                        </View>
                    </Modal>



                </View>


                <View style={{
                    ...Platform.select({
                        android:{
                            paddingBottom:255,
                        },
                        ios:{
                            paddingBottom:225,
                        }
                    }),}}>

                    {changeMsg=='预约单'?
                        (
                            <View>

                                <View style={[styles.d,{justifyContent:"space-between"}]}>
                                    <View style={[{flexDirection:"row"}]}>
                                        <Text>今日预约:<Text style={{color:"#f17e3a"}}>{yuyueData.appointCount}</Text>人</Text>
                                        <Text style={{marginLeft:20}}>今日看房:<Text style={{color:"#f17e3a"}}>{yuyueData.visitCount}</Text>人</Text>
                                    </View>

                                    <TouchableHighlight underlayColor="transparent" onPress={()=>{this.addCustomer(1)}}>
                                        <View><Image source={add} style={{width:20,height:20}}/></View>
                                    </TouchableHighlight>



                                </View>


                                <FlatList
                                    data={registerList}  //列表的渲染数据源
                                    getItemLayout={(data, index) => ( {length: 80, offset: 80 * index, index} )}
                                    initialNumToRender={10}  //首次渲染的条数
                                    ListEmptyComponent={()=><View style={{marginTop:30,alignItems:"center"}}><Text>{this.state.aa?'暂无预约数据':'查询预约数据中'}</Text></View>}
                                    onEndReached={()=>{this.onEndReached(1)}}  //列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
                                    onEndReachedThreshold={0.1} //定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                                    onRefresh={()=>{this.onRefresh(1)}} //下拉刷新
                                    refreshing={refreshing} //下拉刷新时候的正在加载的符号，设置为true显示，false隐藏。加载完成，需要设置为false
                                    keyExtractor={(item,index)=>`${index}`}
                                    renderItem={({item,index})=>(
                                        <View key={index} style={[styles.d,styles.e,]}>

                                            <TouchableHighlight underlayColor="transparent" onPress={()=>{this.call(item.phoneNo)}}  style={[styles.aa,{flex:3}]}>
                                                <View>
                                                    <View style={{flexDirection:"row"}}>
                                                        <Text style={{fontSize:16,fontWeight:'bold'}}>{item.bookUser}</Text>
                                                        <View><Image style={{width:18,height:18}} source={callIcon}/></View>

                                                    </View>

                                                    <Text style={{marginTop:5,fontSize:14}}>{item.comefromName}</Text>
                                                </View>
                                            </TouchableHighlight>



                                            <View style={[styles.aa,{flex:3,alignItems:"center",justifyContent:"center"}]}>
                                                <Text>{item.appointTime}</Text>
                                                <Text  style={{marginTop:5}}>{item.visitTime}</Text>
                                            </View>

                                            <View style={[styles.aa,{flex:4,alignItems:"center",justifyContent:"center"}]}>
                                                <Text><Text style={{fontSize:18,fontWeight:"bold"}}>{item.saleName}</Text>上户</Text>
                                                <Text style={{marginTop:5}}> <Text style={{fontSize:18,fontWeight:"bold"}}>{item.takerName}</Text>带看</Text>
                                            </View>

                                            <View style={[styles.aa,{flex:4,alignItems:"center",justifyContent:"center"}]}>
                                                <Text style={{color:"grey"}}>{item.remark}</Text>
                                            </View>



                                            {item.takerName==null?
                                                <TouchableHighlight  style={[styles.aa,{flex:3,alignItems:"center",justifyContent:"center",borderRightColor:"#fff"}]} underlayColor="transparent" onPress={()=>{this.daikan(item)}}>
                                                    <View style={{alignItems:"center",justifyContent:"center"}}>
                                                        <Text>{item.status}</Text>
                                                        <View style={{marginTop:5}}>
                                                            <Text style={{color:"#f00"}}>带看</Text>
                                                        </View>

                                                    </View>
                                                </TouchableHighlight>
                                                :item.status=='已看房'?
                                                    <TouchableHighlight  style={[styles.aa,{flex:3,alignItems:"center",justifyContent:"center",borderRightColor:"#fff"}]} underlayColor="transparent" onPress={()=>{this.order(item)}}>

                                                        <View style={{alignItems:"center",justifyContent:"center"}}>

                                                            <Text style={{}}>{item.status}</Text>
                                                            <Text style={{color:"red",marginTop:3}}>预定</Text>
                                                        </View>


                                                    </TouchableHighlight>:

                                                    item.status=='已预定'?
                                                        <View  style={[styles.aa,{flex:3,alignItems:"center",justifyContent:"center",borderRightColor:"#fff"}]} >
                                                            <Text style={{}}>{item.status}</Text>
                                                        </View>:

                                                <View style={[styles.aa,{flex:3,alignItems:"center",justifyContent:"center",borderRightColor:"#fff"}]}>
                                                    <Text>{item.status}</Text>

                                                </View>



                                            }




                                        </View>
                                    )}

                                />



                            </View>
                        ):
                        changeMsg=='预订单'?
                            (<View>


                                <View style={[styles.d,{justifyContent:"space-between"}]}>
                                    <View style={[{flexDirection:"row"}]}>
                                        <Text>今日预定:<Text style={{color:"#f17e3a"}}>{yudingData.orderCount}</Text>人</Text>
                                        <Text style={{marginLeft:20}}>今日签约:<Text style={{color:"#f17e3a"}}>{yudingData.signCount}</Text>人</Text>
                                    </View>

                                    <TouchableHighlight underlayColor="transparent" onPress={()=>{this.addCustomer(2)}}>
                                        <View><Image source={add} style={{width:20,height:20}}/></View>
                                    </TouchableHighlight>



                                </View>



                                <FlatList
                                    data={orderList}  //列表的渲染数据源
                                    getItemLayout={(data, index) => ( {length: 80, offset: 80 * index, index} )}
                                    initialNumToRender={10}  //首次渲染的条数
                                    ListEmptyComponent={()=><View style={{marginTop:30,alignItems:"center"}}><Text>{this.state.bb?'暂无预定数据':'查询预定数据中'}</Text></View>}
                                    onEndReached={()=>{this.onEndReached(2)}}  //列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
                                    onEndReachedThreshold={0.1} //定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                                    onRefresh={()=>{this.onRefresh(2)}} //下拉刷新
                                    refreshing={refreshing} //下拉刷新时候的正在加载的符号，设置为true显示，false隐藏。加载完成，需要设置为false
                                    keyExtractor={(item,index)=>`${index}`}
                                    renderItem={({item,index})=>(
                                        <View key={index} style={[styles.d,styles.e,]}>

                                            <TouchableHighlight underlayColor="transparent" onPress={()=>{this.call(item.phoneNo)}}  style={[styles.aa,{flex:3,justifyContent:"center"}]}>
                                                <View>
                                                    <View style={{flexDirection:"row"}}>
                                                        <Text style={{fontSize:16,fontWeight:'bold'}}>{item.bookUser}</Text>
                                                        <View><Image style={{width:18,height:18}} source={callIcon}/></View>

                                                    </View>

                                                    <Text style={{marginTop:5,fontSize:14}}>{item.comefromName}</Text>
                                                </View>
                                            </TouchableHighlight>



                                            <View style={[styles.aa,{flex:3,alignItems:"center",justifyContent:"center"}]}>
                                                <Text>{item.orderTime}</Text>
                                                <Text  style={{marginTop:5}}>{item.visitTime}</Text>
                                            </View>

                                            <View style={[styles.aa,{flex:4,alignItems:"center",justifyContent:"center"}]}>
                                                <Text><Text style={{fontSize:18,fontWeight:"bold"}}>{item.saleName}</Text>上户</Text>
                                                <Text style={{marginTop:5}}> <Text style={{fontSize:18,fontWeight:"bold"}}>{item.takerName}</Text>带看</Text>
                                            </View>

                                            <View style={[styles.aa,{flex:4,alignItems:"center",justifyContent:"center"}]}>
                                                <Text>{item.amountType}:<Text style={{fontSize:16,fontWeight:"bold"}}>{item.amount}</Text></Text>
                                                <Text style={{marginTop:5}}><Text style={{fontSize:16,fontWeight:"bold"}}>{item.roomNo}</Text></Text>
                                            </View>

                                            <View style={[styles.aa,{flex:3,alignItems:"center",justifyContent:"center"}]}>
                                                {item.payState==0&&

                                                <TouchableHighlight  style={[{alignItems:"center",justifyContent:"center",borderRightColor:"#fff"}]} underlayColor="transparent" onPress={()=>{this.payOrder(item)}}>

                                                    <View style={{alignItems:"center",justifyContent:"center"}}>
                                                        <Text style={{}}>未支付</Text>
                                                        <Text style={{color:"red",marginTop:3}}>分享微信支付</Text>
                                                    </View>
                                                </TouchableHighlight>}

                                                {(item.payState==1&&(item.status=='已预定'||item.status=='已排房'))&&

                                                <TouchableHighlight  style={{marginBottom:10}} underlayColor="transparent" onPress={()=>{this.setDeposit(item)}}>

                                                    <View style={{alignItems:"center",justifyContent:"center"}}>
                                                        <Text style={{color:"red"}}>补定金</Text>
                                                    </View>
                                                </TouchableHighlight>}
                                                {
                                                    item.payState==1&&
                                                    (item.status=='已排房'?

                                                        <TouchableHighlight underlayColor="transparent" onPress={()=>{this.checkin(item)}}>

                                                            <View style={{alignItems:"center",justifyContent:"center"}}>
                                                                <Text style={{}}>{item.status}</Text>
                                                                <Text style={{color:"red",marginTop:3}}>签约</Text>
                                                            </View>


                                                        </TouchableHighlight>:
                                                        <View>
                                                            <Text>{item.status}</Text>
                                                        </View>)

                                                }
                                            </View>





                                        </View>
                                    )}

                                />

                            </View>):
                            (<View>

                                <View style={[styles.d,{justifyContent:"space-between"}]}>
                                    <View style={[{flexDirection:"row"}]}>
                                        <Text>签约转化率:<Text style={{color:"#f17e3a"}}>{qianyueData.checkinRate}</Text></Text>
                                        <Text style={{marginLeft:20}}>预定转化率:<Text style={{color:"#f17e3a"}}>{qianyueData.orderRate}</Text></Text>
                                    </View>

                                    <TouchableHighlight underlayColor="transparent" onPress={()=>{this.addCustomer(3)}}>
                                        <View><Image source={add} style={{width:20,height:20}}/></View>
                                    </TouchableHighlight>



                                </View>



                                <FlatList
                                    data={chechinList}  //列表的渲染数据源
                                    getItemLayout={(data, index) => ( {length: 80, offset: 80 * index, index} )}
                                    initialNumToRender={10}  //首次渲染的条数
                                    ListEmptyComponent={()=><View style={{marginTop:30,alignItems:"center"}}><Text>{this.state.cc?'暂无签约数据':'查询签约数据中'}</Text></View>}
                                    onEndReached={()=>{this.onEndReached(3)}}  //列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
                                    onEndReachedThreshold={0.1} //定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                                    onRefresh={()=>{this.onRefresh(3)}} //下拉刷新
                                    refreshing={refreshing} //下拉刷新时候的正在加载的符号，设置为true显示，false隐藏。加载完成，需要设置为false
                                    keyExtractor={(item,index)=>`${index}`}
                                    renderItem={({item,index})=>(
                                        <View key={index} style={[styles.d,styles.e,]}>

                                            <TouchableHighlight underlayColor="transparent" onPress={()=>{this.call(item.phoneNo)}}  style={[styles.aa,{flex:3,justifyContent:"center"}]}>
                                                <View>
                                                    <View style={{flexDirection:"row"}}>
                                                        <Text style={{fontSize:16,fontWeight:'bold'}}>{item.customerName}</Text>
                                                        <View><Image style={{width:18,height:18}} source={callIcon}/></View>

                                                    </View>

                                                    <Text style={{marginTop:5,fontSize:14}}>{item.comefromName}</Text>
                                                </View>
                                            </TouchableHighlight>



                                            <View style={[styles.aa,{flex:3,alignItems:"center",justifyContent:"center"}]}>
                                                <Text><Text  style={{fontWeight:"bold"}}>{item.rentPeriod}</Text>个月</Text>
                                                <Text><Text  style={{fontWeight:"bold"}}>{item.rentPrice}</Text>元/月</Text>
                                            </View>

                                            <View style={[styles.aa,{flex:4,alignItems:"center",justifyContent:"center"}]}>
                                                <Text><Text style={{fontSize:18,fontWeight:"bold"}}>{item.saleName}</Text>上户</Text>
                                                <Text style={{marginTop:5}}> <Text style={{fontSize:18,fontWeight:"bold"}}>{item.takerName}</Text>带看</Text>
                                            </View>

                                            <View style={[styles.aa,{flex:4,alignItems:"center",justifyContent:"center"}]}>
                                                <Text style={{marginTop:5}}><Text style={{fontSize:16,fontWeight:"bold"}}>{item.roomNo}</Text></Text>
                                            </View>

                                            <View style={[styles.aa,{flex:3,alignItems:"center",justifyContent:"center",borderRightColor:"#fff"}]}>
                                                <Text>{item.status}</Text>
                                            </View>




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
        // backgroundColor:"#fff",
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
        flexDirection:"row",alignItems:"center",marginTop:5
    },

    b:{
        marginLeft:10,flex:1,
    },

    d:{

        flexDirection:"row",padding:5
    },

    e:{
        backgroundColor:"#fff",marginTop:5,
    },


    aa:{
        paddingLeft:3,paddingRight:3,borderRightWidth:1,borderRightColor:"#ccc"
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
