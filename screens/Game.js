import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    View,
} from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';

import { move, movableSquares, isSolved } from '../utils/puzzle';
import Board from '../components/Board';
import Button from '../components/Button';
import PuzzlePropType from '../validators/PuzzlePropType';
import Preview from '../components/Preview';
import Stats from '../components/Stats';
import configureTransition from '../utils/configureTransition';

const State = {
    LoadingImage: 'LoadingImage',
    WillTransitionIn: 'WillTransitionIn',
    RequestTransitionOut: 'RequestTransitionOut',
    WillTransitionOut: 'WillTransitionOut',
};

export default class Game extends React.Component {
    constructor(props) {
        super(props);

        const { image } = props;

        this.state = {
            transitionState: image ? State.WillTransitionIn : State.LoadingImage,
            moves: 0,
            elasped: 0,
            previousMove: 0,
            image: null,
        };

        configureTransition();
    }

    componentWillReceiveProps(nextProps) {
        const { image } = nextProps;
        const { transitionState } = this.state;

        if (image && transitionState === State.LoadingImage) {
            configureTransition(() => {
                this.setState({ transitionState: State.WillTransitionIn });
            });
        }
    }

    render() {
        const { puzzle, puzzle: { size }, image } = this.props;
        const { transitionState, moves, elasped, previousMove } = this.state;

        return (
            <View style={ styles.container }>
                {transitionState == State.LoadingImage && (
                    <ActivityIndicator size={'large'} color={'rgba(255,255,255,0.5)'}/>
                )}
                {transitionState !== State.LoadingImage && (
                    <View style={styles.centered}>
                        <View style={styles.header}>
                            <Preview image={image} boardSize={size} />
                            <State moves={moves} time={elasped} />
                        </View>
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({

});