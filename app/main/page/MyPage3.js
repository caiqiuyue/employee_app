
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getData} from "../../components/active/reducer";


class MyPage3 extends Component {


    render(){
        return <View>
           <Text>page3</Text>
        </View>
    }
}


const styles = StyleSheet.create({

});

export default connect (
    state => ({reduxData: state.reduxData}),
    dispath => bindActionCreators({getData},dispath)
)(MyPage3);
