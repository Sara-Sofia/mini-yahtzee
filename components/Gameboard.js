import { useContext, useEffect, useState } from 'react';
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
import { horizontalScale, moderateScale, verticalScale } from '../styles/Metrics';
import { saveScoreboardData, getScoreboardData } from './Storage';
import { GameStatetContext } from './Context';
import style from '../styles/style';


let board = [];

export default Gameboard = ({navigation, route}) => {

    const {setGameEnd} = useContext(GameStatetContext);

    const [playerName, setPlayerName] = useState('');
    const [numberOfThrowsLeft, setNumberOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState('Throw Dices to start the game');
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

    useEffect (() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getScoreboardData();
        });
        return unsubscribe;
    }, [navigation])

    
    useEffect(() => {
        if (numberOfThrowsLeft === 0) {
            if (totalThrows === 18 && allSpotsChosen) {
                // If the total number of throws is 18 or all spots are chosen, end the game
                setGameEndStatus(true);
                setStatus('Game Ended.');
                endGame(playerName);
            } else {
                // If it's the end of the turn, start a new turn
                setStatus('Select points for the combination.');
            }
        }
    }, [numberOfThrowsLeft, totalThrows, allSpotsChosen]);


    const calculateScore = () => {
        const totalScore = dicePointsTotal.reduce((sum, points) => sum + points, 0);
        const untilBonus = Math.max(0, BONUS_POINTS_LIMIT - totalScore);
        setRemainingForBonus(untilBonus);
    
        if (totalScore >= 63) {
            setScore(totalScore + BONUS_POINTS);
        } else {
            setScore(totalScore); // Set total score without bonus points
        }
    };

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
                <Text key={'pointsRow' + spot} style={style.row}>
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
        color={getPointColor(diceButton)}
        style={style.pointRow}>
        </MaterialCommunityIcons>
        </Pressable>
    </Col>
    );
    }

function getDiceColor (i) {
    return selectedDices[i] ? '#FFBE98' : '#365486';
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
        return allSpotsChosen || selectedDicePoints[i] ? '#FFBE98' : '#365486';
    } else {
        return selectedDicePoints[i] ? '#FFBE98' : '#365486';
    }
}

const selectDicePoints = (i) => {
    if (numberOfThrowsLeft === 0 && !gameEndStatus) {
        if (!selectedDicePoints[i]) {
            let selectedPoints = [...selectedDicePoints];
            let points = [...dicePointsTotal];
            selectedPoints[i] = true;
            let nbrOfDices = diceSpots.reduce((total, x) => (x === (i + 1) ? total + 1 : total), 0);
            points[i] = nbrOfDices * (i + 1);
            setDicePointsTotal(points);
            setSelectedDicePoints(selectedPoints);

            const allChosen = selectedPoints.every((point) => point);
            setAllSpotsChosen(allChosen);

            calculateScore();

            // Start a new turn only if the total number of throws has not been reached
            if (totalThrows < 18) {
                setNumberOfThrowsLeft(NBR_OF_THROWS); // Reset throws for the next turn
                setSelectedDices(Array(NBR_OF_DICES).fill(false)); // Reset selected dice
                setStatus('New turn: throw dices.');
            } 
        } else {
            setStatus('You have already selected this point.');
        }
    } else if (gameEndStatus && !allSpotsChosen) {
        let selectedPoints = [...selectedDicePoints];
        let points = [...dicePointsTotal];
        selectedPoints[i] = true;
        let nbrOfDices = diceSpots.reduce((total, x) => (x === (i + 1) ? total + 1 : total), 0);
        points[i] = nbrOfDices * (i + 1);
        setDicePointsTotal(points);
        setSelectedDicePoints(selectedPoints);

        const allChosen = selectedPoints.every((point) => point);
        setAllSpotsChosen(allChosen);
        calculateScore();
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

const resetGame = () => {
    setNumberOfThrowsLeft(NBR_OF_THROWS);
    setStatus('Throw Dices to start the game');
    setGameEndStatus(false);
    setRemainingForBonus(BONUS_POINTS_LIMIT);
    setScore(0);
    setAllSpotsChosen(false);
    setTotalThrows(0);
    setSelectedDices(new Array(NBR_OF_DICES).fill(false));
    setDiceSpots(new Array(NBR_OF_DICES).fill(0));
    setSelectedDicePoints(new Array(MAX_SPOT).fill(false));
    setDicePointsTotal(new Array(MAX_SPOT).fill(0));
    setGameEnd(false);
};

const startNewGame = () => {
    resetGame();
};

const endGame = (playerName) => {

    setScore(score);
    // Get current timestamp
    const timestamp = new Date().toISOString();

    // Create a new game data object
    const gameData = { playerName, score, timestamp };

    // Save game data to AsyncStorage
    saveGameScoreToStorage(gameData);
};

const saveGameScoreToStorage = async (gameData) => {
    // Retrieve existing scoreboard data
    let scoreboardData = await getScoreboardData();

    // Append the new game data to the existing scoreboard data
    scoreboardData = [...scoreboardData, gameData];

    // Save updated scoreboard data to AsyncStorage
    saveScoreboardData(scoreboardData);
    setGameEnd(true);
    
};

let dicesContent;

// Check if the dices have been thrown
if (totalThrows === 0) {
    // If dices haven't been thrown, render a placeholder icon or text
    dicesContent = <MaterialCommunityIcons
    name={'information-outline'}
    size={moderateScale(70)}
    color={'#365486'}
    style={style.infoIcon}>
    </MaterialCommunityIcons>;
} else {
    // If dices have been thrown, render the actual dices
    dicesContent = <Container fluid><Row>{dicesRow}</Row></Container>;
}

    return (
        <>
        <Header/>
        <View style={style.container}>
        <Text style={style.title}>Player: {playerName}</Text>
            {dicesContent}
            <Text style={style.statusText}>{status}</Text>
            {gameEndStatus ? (
        <Pressable onPress={startNewGame} style={style.button}>
            <Text style={style.buttonText}>Start New Game</Text>
        </Pressable>
         ) : (
        <Pressable onPress={throwDices} style={style.button}>
            <Text style={style.buttonText}>THROW DICES</Text>
        </Pressable>
         )}
            <Text style={style.text}>Throws Left: {numberOfThrowsLeft}</Text>
            <Text style={style.text}>Total Score: {score}</Text>
            <Text style={style.text}>
                {remainingForBonus > 0 ? `You are ${remainingForBonus} points away from bonus!` : 'Bonus points added to your total score!'}
            </Text>
            <Container fluid>
                <Row>{pointsRow}</Row>
            </Container>
            <Container fluid>
                <Row>{pointsToSelectRow}</Row>
            </Container>
        </View>
        <Footer/>
        </>
    )
}