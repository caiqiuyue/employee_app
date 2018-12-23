
import React, { Component } from 'react';
import {
    StyleSheet,
    View
} from 'react-native';

import {Picker,List} from "antd-mobile"

export default class MyPage1 extends Component {
    constructor(props) {
        super(props);
        this.state={
            value:['2'],
            district:[
                {
                    label:1,
                    value: '1'
                },
                {
                    label:2,
                    value: '2'
                },
                {
                    label:3,
                    value: '3'
                },
                {
                    label:4,
                    value: '4'
                },
            ]
        };

    }


    componentWillMount(){

    }


    render(){
        let {value,district} = this.state;
        return <View>
            <Picker
                data={district}
                cols={1}
                value={value}
                onChange={data => {this.setState({value:data})}}
                onOk={data => {this.setState({value:data})}}
                className="forss">
                <List.Item arrow="horizontal">Single</List.Item>
            </Picker>
        </View>
    }
}


const styles = StyleSheet.create({

});