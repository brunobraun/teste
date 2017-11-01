import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput
} from 'react-native';

const styles = StyleSheet.create({
    line: {
        flex: 1,
        height: 1,
        borderWidth: 0.1,
        backgroundColor: '#f1eff2'
    },
    text: {
        marginLeft: 10,
        marginRight: 10,
        color: '#555555'
    }
});

class Hr extends Component {
    constructor(props) {
        super(props);


        this.margin = props.margin;

        this.renderLine = this.renderLine.bind(this);
        this.renderText = this.renderText.bind(this);
        this.renderInner = this.renderInner.bind(this);
    }

    renderLine(key) {
        return <View key={key} style={styles.line} />
    }

    renderText(key) {
        return (
            <View key={key} >
                <Text style={styles.text}>{this.props.text}</Text>
            </View>
        )
    }

    renderInner() {
        if (!this.props.text) {
            return this.renderLine()
        }
        return [
            this.renderLine(1),
            this.renderText(2),
            this.renderLine(3)
        ]
    }

    render() {

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: this.margin, marginRight: this.margin }}>
                {this.renderInner()}
            </View>
        )
    }
}

Hr.defaultProps = {
    marginLeft: 8,
    marginRight: 8
};

export default Hr;