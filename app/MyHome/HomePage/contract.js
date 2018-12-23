import React, { Component } from 'react';
import {StyleSheet, TextInput,Text, View, Image,ListView,TouchableHighlight, Platform,ScrollView,Dimensions,Modal} from 'react-native';

import callIcon from './style/60.png'
import contract from './style/contract.jpeg'
import axios from "axios";

export default class A extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imglist:[],
            aa:false
        };

    }


    componentDidMount(){


    }

    componentWillMount(){

        let {data} = this.props;
        
        console.log(data,'合同data');

        //读取
        storage.load({
            key: 'url',
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: false
        }).then(ret => {
            
            console.log(ret.url,'ret.url');

            axios.post(`${ret.url}/contract/getMyContract`, {
                checkinNo:data.tradeId,
                hotelNo:data.hotelNo,
                tokenKey:""
            })
                .then((response) =>{
                    console.log(response,'合同');

                    this.setState({
                        aa:true,
                        message: response.data.message,
                    },()=>{
                        if(response.data.code==0){
                            
                            console.log(response.data.data.imgList,'response.data.data.imglist');
                            
                            this.setState({
                                imglist:response.data.data.imgList
                            })
                        }
                    })





                })
                .catch(function (error) {
                    console.log(error);
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





    render(){

        let {imglist,message} = this.state;


        return (


            <ScrollView style={{backgroundColor:"#fff",}}>

                {
                    imglist&&imglist.length>0?

                        <View>


                            {
                                this.state.imglist.map((item,index)=>

                                    <TouchableHighlight key={index} style={{marginBottom:10,paddingBottom:5,borderBottomColor:"#f0f0f0",borderBottomWidth:1}} underlayColor="transparent" onLongPress={()=>this.saveImg(item)}>
                                        <Image style={{flex:1,resizeMode:"stretch",width: Dimensions.get('window').width,
                                            height: Dimensions.get('window').height}}
                                               source={{uri:item,cache: 'force-cache'}}/>
                                    </TouchableHighlight>
                                )
                            }




                        </View>:
                        <View style={{height: Dimensions.get('window').height,alignItems:"center",marginTop:30}}>
                            <Text>
                                {this.state.aa?message:'查询合同中'}
                            </Text>
                        </View>

                }

            </ScrollView>

        )

    }
}


