import React,{Component} from 'react';
import { Image,Text ,View,Platform, TouchableHighlight} from 'react-native';
import { Badge} from 'antd-mobile';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setData} from '../../components/active/reducer';
import Message from "../../MyHome/Message/message";
import Mine from "../../MyHome/Mine/Mine";
import GoodSelect from "../../MyHome/GoodSelect/GoodSelect";
import TabHome from "../../MyHome/HomePage/homePage";
import Order from "../../MyHome/Order/Order";


class TabBarItem extends Component {

    getRoot = () => {
        // console.log(this.props);
        const callback = () => {
            if(this.props.nameKey === '1') {
                this.props.navigation.navigate('TabHome',{ user: '' })
            } else if(this.props.nameKey === '2') {
                this.props.navigation.navigate('Message',{ user: '' })
            } else if(this.props.nameKey === '3') {
                this.props.navigation.navigate('GoodSelect',{ user: '' })
            } else if(this.props.nameKey === '5'){

                this.props.navigation.navigate('Order',{ user: '' })
            }
            else {
                this.props.navigation.navigate('Mine',{ user: '' })
            }
        };
        this.props.setData(this.props.nameKey, callback);
    };

    render() {
        const unread = this.props.reduxData.data && this.props.reduxData.data.length > 0;
        return(
            <TouchableHighlight underlayColor="transparent" onPress={this.getRoot}>
                <View>

                    {this.props.type ?

                        <View  style={{
                            ...Platform.select({
                                android: {
                                    padding: 10
                                }
                            }),
                        }}>

                            <Image source={ this.props.focused ? this.props.selectedImage : this.props.normalImage }
                                   style={ { tintColor:this.props.tintColor,width:20,height:20} }
                                   resizeMode={'stretch'}
                            />

                            {
                                this.props.type && unread ? (
                                    <View  style={{
                                        ...Platform.select({
                                            android: {
                                                left:15,bottom:16
                                            },
                                            ios:{
                                                left:21,bottom:21
                                            }
                                        }),
                                    }}>
                                        <Badge style={{
                                            ...Platform.select({
                                                android: {
                                                    left: 4, bottom: 3
                                                }
                                            }),
                                        }} dot />
                                    </View>
                                ) : null
                            }

                        </View>
                        :
                        <View>

                            <Image source={ this.props.focused ? this.props.selectedImage : this.props.normalImage }
                                   style={ { tintColor:this.props.tintColor,width:20,height:20} }
                                   resizeMode={'stretch'}
                            />
                        </View>}


                </View>
            </TouchableHighlight>
        )
    }

}
export default connect (
    state => ({reduxData: state.reduxData}),
    dispath => bindActionCreators({setData},dispath)
)(TabBarItem);
