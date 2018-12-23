
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getData} from '../../components/active/reducer';



class MyPage1 extends Component {

    componentWillMount() {
    }

    determineRoom = () => {
        let data = {
            name: '蔡秋月',
            age: 88
        };
        this.props.getData(data);
    };

    render(){
        console.log(this.props.reduxData);
        return <View>
            <TouchableHighlight onPress={this.determineRoom} underlayColor="#fff" style={{backgroundColor:"#f8bd49",alignItems:"center",marginLeft:"70%",padding:5,marginTop:100}}>
                <Text style={{color:"#fff"}}>确定</Text>
            </TouchableHighlight>
        </View>
    }
}


const styles = StyleSheet.create({

});

export default connect (
    state => ({reduxData: state.reduxData}),
    dispath => bindActionCreators({getData},dispath)
)(MyPage1);