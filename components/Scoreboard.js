import React, { useContext, useEffect, useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { DataTable } from 'react-native-paper';
import { getScoreboardData, clearScoreboardData } from './Storage';
import { MAX_NBR_OF_SCOREBOARD_ROWS } from '../constants/Game';
import styles from '../styles/style';
import { GameStatetContext } from './Context';
import Header from './Header';
import Footer from './Footer';
import style from '../styles/style';

export default Scoreboard = ({ navigation }) => {
    const {gameEnd} = useContext(GameStatetContext);
    const [scoreboardData, setScoreboardData] = useState([]);

    useEffect(() => {
        fetchScoreboardData();
    }, [gameEnd]);

    const fetchScoreboardData = async () => {
        const data = await getScoreboardData();
        if (data) {
            const sortedData = data.sort((a, b) => b.score - a.score);
            const topEntries = sortedData.slice(0, MAX_NBR_OF_SCOREBOARD_ROWS);
            setScoreboardData(topEntries);
        }
    };

    const clearScoreboard = async () => {
        try {
            await clearScoreboardData();
            setScoreboardData([]);
        } catch (error) {
            console.error('Error clearing scoreboard:', error);
        }
    };
    
    return (
    <>
        <Header/>
        <View style={style.container}>
            <Text style={style.title}>Top Scores</Text>
            {scoreboardData.length === 0 ? (
                <Text style={style.statusText}>Scoreboard is empty</Text>
            ) : (
                <DataTable style={style.scoreboard}>
                    {scoreboardData.map((item, index) => (
                        <DataTable.Row key={index}>
                            <DataTable.Cell textStyle={style.scoreRow}>{index + 1 + '.'}</DataTable.Cell>
                            <DataTable.Cell textStyle={style.scoreRow}>{item.playerName}</DataTable.Cell>
                            <DataTable.Cell textStyle={style.scoreRow}>{new Date(item.timestamp).toLocaleDateString()}</DataTable.Cell>
                            <DataTable.Cell textStyle={style.scoreRow}>{new Date(item.timestamp).toLocaleTimeString([],{ hour: '2-digit', minute: '2-digit' })}</DataTable.Cell>
                            <DataTable.Cell textStyle={style.scoreRow}>{item.score}</DataTable.Cell>
                        </DataTable.Row>
                    ))}
                </DataTable>
            )}
            <Pressable onPress={clearScoreboard} style={style.button}>
                <Text style={style.buttonText}>Clear Scores</Text>
            </Pressable>
        </View>
    <Footer/>
    </>
)
};
    




