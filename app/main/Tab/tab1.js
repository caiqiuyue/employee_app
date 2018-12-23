import React,{Component} from 'react';
import { Image,Text ,View,Platform} from 'react-native';
import { Badge} from 'antd-mobile';
import { TabNavigator, TabBarBottom} from 'react-navigation';

import TabHome from '../../MyHome/HomePage/homePage';
//import TabHome from '../../MyHome/Mine/contract';
//import TabHome from '../../MyHome/HomePage/thirdRow/refundRentDetail';
import Message from '../../MyHome/Message/message';
import GoodSelect from '../../MyHome/GoodSelect/GoodSelect';
import Mine from '../../MyHome/Mine/Mine';


const Tab = TabNavigator(
    {
        TabHome:{
            screen:TabHome,
        },

        Message:{
            screen:Message,
        },
        GoodSelect:{
            screen:GoodSelect,
        },
        Mine:{
            screen:Mine,
        },
    },
    {
        navigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                console.log(routeName)
                let normalImage = null;
                let selectedImage = null;
                if(routeName === 'TabHome') {
                    normalImage = require('./homeIcon.png');
                    selectedImage = require('./homeIcon.png');
                } else if(routeName === 'Message') {
                    normalImage = require('./messageIcon.png');
                    selectedImage = require('./messageIcon.png');
                } else if(routeName === 'GoodSelect') {
                    normalImage = require('./goodSelectIcon.png');
                    selectedImage = require('./goodSelectIcon.png');
                } else if(routeName === 'Mine') {
                    normalImage = require('./mineIcon.png');
                    selectedImage = require('./mineIcon.png');
                }
                return (
                    <TabBarItem
                        tintColor={tintColor}
                        focused={focused}
                        normalImage={normalImage}
                        selectedImage={selectedImage}
                    />
                );
            },
            tabBarLabel: ({focused,tintColor}) => {
                const { routeName } = navigation.state;
                let tabName = '';
                if(routeName === 'TabHome') {
                    tabName = '首页';
                } else if(routeName === 'Message') {
                    tabName = '消息';
                } else if(routeName === 'GoodSelect') {
                    tabName = '优选';
                } else if(routeName === 'Mine') {
                    tabName = '我的';
                }
                return (
                    <Text style={{...Platform.select({
                            android: {
                                left:"37%"
                            },
                            ios:{
                                top:25
                            }
                        }),color: focused ? '#5cd9e7' : '#333',fontSize:12}}>{tabName}</Text>)
            }
        }),
        tabBarComponent:TabBarBottom,
        tabBarPosition:'bottom',
        swipeEnabled:true,
        animationEnabled:false,
        lazy:true,
        tabBarOptions:{
            initialRouteName: 'TabHome',
            order: ['TabHome','Message', 'GoodSelect','Mine'],
            paths: ['TabHome','Message', 'GoodSelect','Mine'],
            activeTintColor:'#5cd9e7',
            inactiveTintColor:'grey',
            style:{backgroundColor:'#fff',...Platform.select({
                    android: {

                    },
                    ios:{
                        paddingBottom:26,
                    }
                }),},
            labelStyle: {
                fontSize: 8,
                color: '#333'
            },
        }
    },
);


class TabBarItem extends Component {

    render() {
        return(
            <View>
                {this.props.type ?

                        <View
                            style={{ ...Platform.select({
                                    android: {

                                        alignItems:"center",
                                    },
                                    ios:{

                                        //marginTop:25,
                                        alignItems:"center",

                                    }
                            })}}

                        >
                            <Badge dot style={{left:15}}></Badge>

                            <Image source={ this.props.focused ? this.props.selectedImage : this.props.normalImage }
                                   style={ { tintColor:this.props.tintColor,width:20,height:20} }
                                   resizeMode={'stretch'}
                            />
                        </View>
                    :
                    <View
                        style={{ ...Platform.select({
                            android: {
                                alignItems:"center",



                            },
                            ios:{

                                //margintop:25,
                                alignItems:"center",

                            }
                        })}}
                        >

                        <Image source={ this.props.focused ? this.props.selectedImage : this.props.normalImage }
                               style={ { tintColor:this.props.tintColor,width:20,height:20} }
                               resizeMode={'stretch'}
                        />
                    </View>}
            </View>


        )
    }

}


export default Tab;


