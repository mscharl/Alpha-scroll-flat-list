import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, View, Dimensions } from 'react-native';
import debounce from 'lodash/debounce';

import AlphabeticScrollBar from './components/AlphabeticScrollBar';
import AlphabeticScrollBarPointer from './components/AlphabeticScrollBarPointer';

export default class AlphaScrollFlatList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeLetterViewTop: 0,
            activeLetter: undefined,
            isPortrait: this.isPortrait()
        };

        this.scrollToEnd = this.scrollToEnd.bind(this);
        this.scrollToIndex = this.scrollToIndex.bind(this);
        this.scrollToItem = this.scrollToItem.bind(this);
        this.scrollToOffset = this.scrollToOffset.bind(this);
        this.recordInteraction = this.recordInteraction.bind(this);
        this.flashScrollIndicators = this.flashScrollIndicators.bind(this);
    }

    //Forwarded flat list methods
    scrollToEnd (...params) {
        if (this.list)
            this.list.scrollToEnd(...params);
    }

    scrollToIndex (...params) {
        if (this.list)
            this.list.scrollToIndex(...params);
    }

    scrollToItem (...params) {
        if (this.list)
            this.list.scrollToItem(...params);
    }

    scrollToOffset (...params) {
        if (this.list)
            this.list.scrollToOffset(...params);
    }

    recordInteraction (...params) {
        if (this.list)
            this.list.recordInteraction(...params);
    }

    flashScrollIndicators (...params) {
        if (this.list)
            this.list.flashScrollIndicators(...params);
    }

    //Proper methods
    handleOnScroll (letter, activeLetterViewTop) {
        if (letter) {
            let index = 0;
            let viewPos = 0;
            if (this.state.activeLetter === undefined) {
                this.props.onScrollStarts();
            }

            this.setState({
                activeLetter: letter,
                activeLetterViewTop
            });

            if (letter === '#') {
                const firstIndex = 0;
                const lastIndex = this.props.data.length - 1;

                index = this.props.reverse ? firstIndex : lastIndex;
            } else {
                index = this.props.data.findIndex(item => {
                    return item[this.props.scrollKey].charAt(0).localeCompare(letter) === 0
                });
            }

            if(index >= 0) {
                this.list.scrollToIndex({
                    animated: !this.props.disableScrollAnimation,
                    index: index,
                    viewOffset: this.props.activeHeaderviewOffset,
                    viewPosition: viewPos,
                });
            }
        }
    }

    handleOnScrollEnds () {
        this.setState({
            activeLetter: undefined,
            activeLetterViewTop: 0
        }, () => this.props.onScrollEnds());
    }

    getItemLayout (data, index) {
        const { itemHeight } = this.props;

        return {
            length: itemHeight,
            offset: itemHeight * index,
            index
        };
    }

    isPortrait () {
        const { width, height } = Dimensions.get('window');

        return width < height;
    }

    handleOnLayout () {
        const isPortrait = this.isPortrait();

        if (isPortrait !== this.state.isPortrait)
            this.setState({
                isPortrait
            });
    }

    render () {
        return (
            <View onLayout={this.handleOnLayout.bind(this)}>
                <FlatList
                    {...this.props}
                    ref={elem => this.list = elem}
                />
                {this.props.hideSideBar ? null : (
                    <AlphabeticScrollBar
                        isPortrait={this.state.isPortrait}
                        reverse={this.props.reverse}
                        activeColor={this.props.activeColor}
                        fontColor={this.props.scrollBarColor}
                        scrollBarContainerStyle={this.props.scrollBarContainerStyle}
                        fontSizeMultiplier={this.props.scrollBarFontSizeMultiplier}
                        onScroll={debounce(this.handleOnScroll.bind(this))}
                        onScrollEnds={debounce(this.handleOnScrollEnds.bind(this))}
                    />
                )}
                {this.state.activeLetter && !this.props.hideSideBar && !this.props.hideScrollBarPointer
                    ? <AlphabeticScrollBarPointer
                        letter={this.state.activeLetter}
                        color={this.props.activeColor}
                        top={this.state.activeLetterViewTop}
                        style={this.props.scrollBarPointerContainerStyle}
                    />
                    : null
                }
            </View>
        );
    }
}

AlphaScrollFlatList.propTypes = {
    hideSideBar: PropTypes.bool,
    hideScrollBarPointer: PropTypes.bool,
    disableScrollAnimation: PropTypes.bool,
    activeHeaderviewOffset: PropTypes.number,
    scrollKey: PropTypes.string,
    reverse: PropTypes.bool,
    itemHeight: PropTypes.number,
    data: PropTypes.array,
    activeColor: PropTypes.string,
    scrollBarColor: PropTypes.string,
    scrollBarFontSizeMultiplier: PropTypes.number,
    onScrollEnds: PropTypes.func,
    onScrollStarts: PropTypes.func,
    scrollBarContainerStyle: PropTypes.object
};

AlphaScrollFlatList.defaultProps = {
    activeHeaderviewOffset: 0,
    hideSideBar: false,
    scrollKey: 'name',
    activeColor: '#D52B1E',
    reverse: false,
    itemHeight: 20,
    scrollBarFontSizeMultiplier: 1,
    onScrollEnds: () => { },
    onScrollStarts: () => { },
    scrollBarContainerStyle: { }
};
