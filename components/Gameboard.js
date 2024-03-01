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
    const [remainingForBonus, setRemainingForBonus] = useState(BONUS_POINTS_LIMIT);
    const [score, setScore] = useState(0);
    const [allSpotsChosen, setAllSpotsChosen] = useState(false);
    const [totalThrows, setTotalThrows]=useState(0);

    // Are dices selected or not?
    const [selectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false));

    // Dice spots (1, 2, 3, 4, 5, 6) for eacth dice
    const [diceSpots, setDiceSpots] = useState(new Array(NBR_OF_DICES).fill(0));

    // Are dice points selected or not?
    const [selectedDicePoints, setSelectedDicePoints] = useState(new Array(MAX_SPOT).fill(false));


    const [dicePointsTotal, setDicePointsTotal] = useState(new Array(MAX_SPOT).fill(0));

    // This one is for passing the player name to the screen
    useEffect(()=> {
        if (playerName === '' && route.params?.player) {
            setPlayerName(route.params.player);
        }

    }, []);

    // This useEffect is for reading scoreboard from the asyncstorage when user is navigating back to screen ( code is in the assignment instructions). Trigger here is the navigation for the useEffect.

    //This useEffect is for handling the gameflow so that the game does not stop too early or does not continue after it should not. Trigger here is number of thorws left. Another reason for putting the number of throws left as a trigger is to avoid the one step behind problem.
    
    useEffect(() => {
        if (numberOfThrowsLeft === 0) {
            if (totalThrows === 18) {
                // If the total number of throws is 18, end the game
                setGameEndStatus(true);
                setStatus('Game Ended: reached 18 throws');
            } else {
                // If it's the end of the turn, start a new turn
                setStatus('Select points for the combination.');
            }
        }
    }, [numberOfThrowsLeft, totalThrows]);

    useEffect(() => {
        const totalScore = dicePointsTotal.reduce((sum, points) => sum + points, 0);
        const untilBonus = Math.max(0, BONUS_POINTS_LIMIT - totalScore);
        setRemainingForBonus(untilBonus);

        if (totalScore >= 63) {
            setScore(totalScore+BONUS_POINTS);
        } else {
            setScore(totalScore); // Set total score without bonus points
        }
    }, [selectedDicePoints, dicePointsTotal]);

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

    const pointsRow = [];
    for ( let spot = 0 ; spot < MAX_SPOT; spot++) {
        pointsRow.push(
            <Col key={'pointsRow' + spot}>
                <Text key={'pointsRow' + spot}>
                    {getSpotTotal(spot)}
                </Text>
            </Col>
        )
    }

    const pointsToSelectRow = [];
    for (let diceButton = 0; diceButton < MAX_SPOT; diceButton++) {
    pointsToSelectRow.push(
    <Col key={'buttonsRow' + diceButton}>
        <Pressable
        key={'buttonsRow' + diceButton}
        onPress={()=> selectDicePoints(diceButton)}>
        <MaterialCommunityIcons
        name={'numeric-'+(diceButton +1) +'-circle'}
        key={'buttonsRow' + diceButton}
        size={30}
        color={getPointColor(diceButton)}>
        </MaterialCommunityIcons>
        </Pressable>
    </Col>
    );
    }

function getDiceColor (i) {
    return selectedDices[i] ? 'black' : 'steelblue';
}

const selectDice = (i) => {
    // Check if the game has ended and not all spots are chosen
    if (gameEndStatus && !allSpotsChosen) {
        let dices = [...selectedDices];
        dices[i] = !selectedDices[i];
        setSelectedDices(dices);
    } else {
        // Check if there are throws left
        if (numberOfThrowsLeft < NBR_OF_THROWS && !gameEndStatus) {
            let dices = [...selectedDices];
            dices[i] = !selectedDices[i];
            setSelectedDices(dices);
        } else {
            setStatus('You cannot select dices at this point.');
        }
    }
}

function getPointColor(i) {
    if (gameEndStatus) {
        return allSpotsChosen || selectedDicePoints[i] ? 'black' : 'steelblue';
    } else {
        return selectedDicePoints[i] ? 'black' : 'steelblue';
    }
}

const selectDicePoints = (i) => {
    // Check if there are throws left
    if (numberOfThrowsLeft === 0 && !gameEndStatus) {
        // Only allow selecting points if there are no throws left and the game hasn't ended
        if (!selectedDicePoints[i]) {
            // Check if the point has not been selected already
            let selectedPoints = [...selectedDicePoints];
            let points = [...dicePointsTotal];
            selectedPoints[i] = true;
            let nbrOfDices = diceSpots.reduce((total, x) => (x === (i + 1) ? total + 1 : total), 0);
            points[i] = nbrOfDices * (i + 1);
            setDicePointsTotal(points);
            setSelectedDicePoints(selectedPoints);

            // Start a new turn after selecting points
            setNumberOfThrowsLeft(NBR_OF_THROWS); // Reset throws for the next turn
            setSelectedDices(Array(NBR_OF_DICES).fill(false)); // Reset selected dice
            setStatus('New turn: throw dices.');
        } else {
            setStatus('You have already selected this point.');
        }
    } else if (gameEndStatus && !allSpotsChosen) {
        // Allow selecting points if the game has ended and all the spots are not selected yet.
        let selectedPoints = [...selectedDicePoints];
        let points = [...dicePointsTotal];
        selectedPoints[i] = true;
        let nbrOfDices = diceSpots.reduce((total, x) => (x === (i + 1) ? total + 1 : total), 0);
        points[i] = nbrOfDices * (i + 1);
        setDicePointsTotal(points);
        setSelectedDicePoints(selectedPoints);
    } else {
        setStatus('You cannot select points at this point.');
    }
};


function getSpotTotal(i) {
    return dicePointsTotal[i];
}


const throwDices = () => {
    // Check if there are throws left
    if (numberOfThrowsLeft === 0 && !gameEndStatus) {
        setStatus('Select your points before next throw');
        return;
    }

    // Check if the game has ended
    if (numberOfThrowsLeft === 0 && gameEndStatus) {
        setStatus('The game has ended. Please start a new game.');
        return;
    }
    // Throw the dices and update the state
    let spots = [...diceSpots];
    for (let i = 0; i < NBR_OF_DICES; i++) {
        if (!selectedDices[i]) {
            let randomNumber = Math.floor(Math.random() * 6 + 1);
            board[i] = 'dice-' + randomNumber;
            spots[i] = randomNumber;
        }
    }
    setNumberOfThrowsLeft(numberOfThrowsLeft - 1);
    setDiceSpots(spots);
    setStatus('Select and throw dices again');
    setTotalThrows(totalThrows + 1);
    
}

let dicesContent;

// Check if the dices have been thrown
if (totalThrows === 0) {
    // If dices haven't been thrown, render a placeholder icon or text
    dicesContent = <MaterialCommunityIcons
    name={'information-outline'}
    size={55}
    color={'steelblue'}>
    </MaterialCommunityIcons>;
} else {
    // If dices have been thrown, render the actual dices
    dicesContent = <Container fluid><Row>{dicesRow}</Row></Container>;
}

    return (
        <>
        <Header/>
        <View>
            {dicesContent}
            <Text>{status}</Text>
            <Text>Throws Left: {numberOfThrowsLeft}</Text>
            <Pressable
                onPress={() => throwDices()}
            >
                <Text>THROW DICES</Text>
            </Pressable>
            <Text>Total Score: {score}</Text>
            <Text>
                {remainingForBonus > 0 ? `You are ${remainingForBonus} points away from bonus!` : 'Bonus points added to your total score!'}
            </Text>
            <Container fluid>
                <Row>{pointsRow}</Row>
            </Container>
            <Container fluid>
                <Row>{pointsToSelectRow}</Row>
            </Container>
            <Text>Player: {playerName}</Text>
        </View>
        <Footer/>
        </>
    )
}