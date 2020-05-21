import React,{Component} from 'react';
import {Alert,View,DeviceEventEmitter, ScrollView,Text, TouchableHighlight, TextInput,Image, Modal, StyleSheet,Platform} from 'react-native';

import Dimensions from "Dimensions";
import axios from "axios";
import add from "../GoodSelect/style/add.png";
import {Toast} from 'antd-mobile'

import ImagePicker from "react-native-image-picker";

export default class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            imgStr:'12345667',
            imgArr:[]
        }

        this.aa=false;

    }

    //上传图片
    uploadPic = () => {

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

                let img = response.data

                let {imgArr} = this.state

                axios.post('https://47.95.116.56:8443/file_upload/addCheckRoomImage', {
                    hotelNo:this.props.hotelNo,
                    roomNo:this.props.roomNo,
                    image:`data:image/png;base64,${img}`,

                })
                    .then((res) =>{
                        console.log(res);
                        if(res.data.code==0){

                            let b = []

                            let a = {
                                imgData:`data:image/png;base64,${img}`,
                                imgName:res.data.msg
                            }

                            b.push(a)

                            this.setState({
                                imgArr:[...imgArr,...b]
                            },()=>{
                                this.props.addPic(this.state.imgArr)
                            })


                        }else if(res.data.code==1){
                            Toast.info(res.data.msg,1)
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    })




            }
        });

    }

    componentWillMount(){

    }



    addPic = ()=>{


        if(!this.props.aa){
            Toast.info('请确定填写的房间号',1);
            return
        }else {
            this.uploadPic()
        }




    }


    // 保存图片
    download=(uri)=> {
        if (!uri) return null;
        return new Promise((resolve, reject) => {
            let dirs = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath : RNFS.ExternalDirectoryPath; //外部文件，共享目录的绝对路径（仅限android）
            const downloadDest = `${dirs}/${((Math.random() * 10000000) | 0)}.jpg`;
            const url = uri;
            const options = {
                fromUrl: url,
                toFile: downloadDest,
                background: true,
                begin: (res) => {
                    console.log('begin', res);
                    console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
                },
            };
            try {
                const ret = RNFS.downloadFile(options);
                ret.promise.then(res => {
                    console.log('success', res);
                    console.log('file://' + downloadDest);
                    let promise = CameraRoll.saveToCameraRoll(downloadDest);
                    promise.then(function(result) {
                        //alert('保存成功');
                        Toast.info('保存成功',1)

                    }).catch(function(error) {
                        Toast.info('保存失败',1)
                    });
                    resolve(res);
                }).catch(err => {
                    reject(new Error(err))
                });
            } catch (e) {
                reject(new Error(e))
            }

        })

    }


    comfirmSelected=(item)=>{
        let {imgArr} = this.state;

        axios.post('https://47.95.116.56:8443/file_upload/delCheckRoomImage', {
            hotelNo:this.props.hotelNo,
            roomNo:this.props.roomNo,
            image:item.imgName,

        })
            .then((res) =>{
                console.log(res);
                if(res.data.code==0){

                    let a = []

                    a = imgArr.filter(_item=>{
                        if(_item.imgName!=item.imgName){

                            return _item
                        }
                    })

                    Toast.info('删除成功',1)

                    this.setState({
                        imgArr:a
                    },()=>{
                        this.props.addPic(this.state.imgArr)
                    })

                }else if(res.data.code==1){
                    Toast.info(res.data.msg,1)
                }
            })
            .catch(function (error) {
                console.log(error);
            })

    };

    cancelSelected=()=>{

    };


    deleteImg=(item)=>{

        console.log(item);

        Alert.alert('删除','确认删除吗？',
            [
                {text:"取消", onPress:this.cancelSelected},
                {text:"确认", onPress:()=>this.comfirmSelected(item)}
            ],
            { cancelable: false }
        );

    };






    render(){



        return (



            <View style={{backgroundColor:"#fff"}}>
                <View style={styles.allLine}>
                    <View style={{flex:1,}}><Text >添加图片:</Text></View>
                    <View style={{flex:3,}}>
                        <TouchableHighlight underlayColor={"#fff"} onPress={()=>{this.addPic()} } style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                            <View><Image source={add} style={{width:30,height:30}}/></View>
                        </TouchableHighlight>

                    </View>

                </View>

                {
                    this.state.imgArr.length>0&&
                    <View style={styles.allLine}>
                        <View style={{flex:1,}}><Text >{}</Text></View>
                        <View style={{flex:3,}}>


                            {
                                this.state.imgArr.map((item,index)=>
                                    <TouchableHighlight underlayColor="transparent" key={index} style={{height:110,marginTop:10}} onLongPress={()=>{this.deleteImg(item)}}>
                                        <Image style={{height:100,width:"80%",resizeMode:"stretch"}}
                                               source={{uri:item.imgData}}
                                        />
                                    </TouchableHighlight>
                                )
                            }




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
