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

    handleBoardTransitionIn = () => {
        this.intervalId = setInterval(() => {
            const {elasped} = this.state;

            this.setState({ elasped: elasped + 1 });
        }, 1000);
    };

    requestTransitionOut = () => {
        clearInterval(this.intervalId);

        this.setState({ transitionState: State.RequestTransitionOut });
    };

    handlePressQuit = () => {
        Alert.alert(
            'Quit',
            'Do you want to quit and lose progress on this puzzle?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Quit',
                    style: 'destructive',
                    onPress: this.requestTransitionOut,
                }
            ],
        );
    };

    handleBoardTransitionOut = async () => {
        const { onQuit } = this.props;

        await configureTransition(() => {
            this.setState({ transitionState: State.WillTransitionOut });
        });

        onQuit();
    };

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
                            <Stats moves={moves} time={elasped} />
                        </View>
                        <Board 
                            puzzle={puzzle}
                            image={image}
                            previousMove={previousMove}
                            teardown={transitionState === State.RequestTransitionOut}
                            // onMoveSquare={this.handlePressSquare}
                            onTransitionOut={this.handleBoardTransitionOut}
                            onTransitionIn={this.handleBoardTransitionIn}
                        />
                        <Button title={'Quit'} onPress={this.handlePressQuit} />
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    centered: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 16,
        alignSelf: 'stretch',
    },
});