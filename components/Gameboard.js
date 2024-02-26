import { useEffect, useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import Header from './Header';
import Footer from './Footer';
import { 
    NBR_OF_DICES,
    NBR_OF_THROWS,
    MIN_SPOT,
    MAX_SPOT,
    BONUS_POINTS_LIMIT,
    BONUS_POINTS } from '../constants/Game';
import styles from '../styles/style';
import { Container, Row, Col } from 'react-native-flex-grid';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

let board = [];

export default Gameboard = ({navigation, route}) => {

    const [playerName, setPlayerName] = useState('');
    const [numberOfThrowsLeft, setNumberOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState('Throw Dices');
    const [gameEndStatus, setGameEndStatus] = useState(false);

    // Are dices selected or not?
    const [selectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false));

    // Dice spots (1, 2, 3, 4, 5, 6) for eacth dice
    const [diceSpots, setDiceSpots] = useState(new Array(NBR_OF_DICES).fill(0));

    // Are dice points selected or not?
    const [selectedDicePoints, setSelectedDicePoints] = useState(new Array(MAX_SPOT).fill(false));


    const [dicePointsTotal, setDicePointsTotal] = useState(new Array(MAX_SPOT).fill(0));

    useEffect(()=> {
        if (playerName === '' && route.params?.player) {
            setPlayerName(route.params.player);
        }

    }, []);

    const dicesRow = [];
    for (let dice = 0; dice < NBR_OF_DICES; dice++) {
    dicesRow.push(
    <Col key={'dice' + dice}>
        <Pressable
        key={'dice' + dice}
        onPress={()=> selectDice(dice)}>
        <MaterialCommunityIcons
        name={board[dice]}
        key={'dice' + dice}
        size={50}
        color={getDiceColor(dice)}>
        </MaterialCommunityIcons>
        </Pressable>
    </Col>
    );
}

function getDiceColor (i) {
    return selectedDices[i] ? 'black' : 'steelblue';
}

const selectDice = (i) => {
    if(numberOfThrowsLeft < NBR_OF_THROWS && !gameEndStatus){
        let dices = [...selectedDices];
        dices[i] = selectedDices[i] ? false : true;
        setSelectedDices(dices);
    }
}

const throwDices = () => {
    let sum = 0;
    for ( let i = 0; i < NBR_OF_DICES; i++) {
        if (!selectedDices[i]) {
         let randomNumber = Math.floor(Math.random() * 6 + 1);
         board[i] = 'dice-' + randomNumber;
        }
    }
    setNumberOfThrowsLeft(numberOfThrowsLeft-1);
}

    return (
        <>
        <Header/>
        <View>
            <Text>This will be the gameboard..</Text>
            <Container fluid>
                <Row>{dicesRow}</Row>
            </Container>
            <Pressable
                onPress={() => throwDices()}
            >
                <Text>THROW DICES</Text>
            </Pressable>
            <Text>Player: {playerName}</Text>
        </View>
        <Footer/>
        </>
    )
}