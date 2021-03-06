import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Text, View} from 'react-native';

class AlphabeticScrollBarPointer extends Component {
    render() {
        return (
            <View
                style={[
                    {
                        ...styles.container,
                        top: this.props.top - 15,
                        backgroundColor: this.props.color,
                    },
                    this.props.style
                ]}
            >
                <Text style={styles.letter}>
                    {this.props.letter}
                </Text>
            </View>
        );
    }
}

AlphabeticScrollBarPointer.propTypes = {
    top: PropTypes.number,
    color: PropTypes.string,
    letter: PropTypes.string
};

const styles = {
    container: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 20,
        borderRadius: 25,
        width: 45,
        height: 45,
        zIndex: 999,
        right: 45
    },
    letter: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        alignSelf: 'center',
        textAlign: 'center',
    }
};

export default AlphabeticScrollBarPointer;
