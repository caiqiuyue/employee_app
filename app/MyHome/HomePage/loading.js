

import React, { Component } from 'react';
import {
    Platform,
    View,
    ActivityIndicator,
    Modal,
} from 'react-native';

import PropTypes from 'prop-types';

export default class Loading extends Component {
    constructor(props) {
        super(props);

    }



    render() {
        if (!this.props.modalVisible) {
            return null
        }
        return (
            <Modal
                animationType={"none"}
                transparent={true}
                visible={this.props.modalVisible}
                onRequestClose={() => {}}
            >

            </Modal>
        );
    }
}

Loading.PropTypes = {
    hide: PropTypes.bool.isRequired,
};

