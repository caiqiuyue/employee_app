import React,{Component} from 'react';
import {View, Text,Dimensions} from 'react-native';
import Mine from './Mine'
// import Dimensions from 'Dimensions';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getData} from "../../components/active/reducer";


class MineBox extends Component {
    constructor(props) {
        super(props);
    }


    render(){
        const navRoot = this.props.reduxData.navRoot;
        return (
            <View style={{height: Dimensions.get("window").height,backgroundColor:"#fff"}}>
                {
                    navRoot === '4' ? (
                        <Mine key="213"  navigation={this.props.navigation}/>
                    ) : (
                        <Mine key="111"   navigation={this.props.navigation}/>
                    )
                }
            </View>
        )
    }
}

export default connect (
    state => ({reduxData: state.reduxData}),
    dispath => bindActionCreators({getData},dispath)
)(MineBox)


