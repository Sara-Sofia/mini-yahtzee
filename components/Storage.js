import AsyncStorage from '@react-native-async-storage/async-storage';
import { SCOREBOARD_KEY } from '../constants/Game';

// Save scoreboard data to AsyncStorage
export const saveScoreboardData = async (data) => {
    try {
        await AsyncStorage.setItem(SCOREBOARD_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving scoreboard data:', error);
    }
};

// Retrieve scoreboard data from AsyncStorage
export const getScoreboardData = async () => {
    try {
        const data = await AsyncStorage.getItem(SCOREBOARD_KEY);
        if (data !== null) {
            return JSON.parse(data);
        } else {
            // If no data is found, return an empty array
            return [];
        }
    } catch (error) {
        console.error('Error retrieving scoreboard data:', error);
        return [];
    }
};

export const clearScoreboardData = async () => {
    try {
        await AsyncStorage.removeItem(SCOREBOARD_KEY);
    } catch (error) {
        console.error('Error clearing scoreboard data:', error);
    }
};

