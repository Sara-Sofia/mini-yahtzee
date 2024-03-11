import Home from './components/Home';
import Gameboard from './components/Gameboard';
import Scoreboard from './components/Scoreboard';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { GameStatetContext } from './components/Context';
import { useState } from 'react';
import { useFonts } from 'expo-font';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

export default function App() {

  const [gameEnd, setGameEnd] = useState(false);

  let [fontsLoaded] = useFonts({
    'Alata': require('./assets/fonts/Alata-Regular.ttf'),
    'TitilliumWeb-Bold': require('./assets/fonts/TitilliumWeb-Bold.ttf'),
    'TitilliumWeb-Regular': require('./assets/fonts/TitilliumWeb-Regular.ttf'),
    'TitilliumWeb-Italic': require('./assets/fonts/TitilliumWeb-Italic.ttf')
    // Add more fonts here if needed
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }
  return (
    <NavigationContainer>
      <GameStatetContext.Provider value={{gameEnd, setGameEnd}}>
      <Tab.Navigator
        sceneContainerStyle={{backgroundColor: 'transparent'}}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused
                ? 'home-circle'
                : 'home-circle-outline';
            } else if (route.name === 'Gameboard') {
              iconName = focused 
              ? 'gamepad-variant' 
              : 'gamepad-variant-outline';
            } else if (route.name === 'Scoreboard') {
              iconName = focused 
              ? 'trophy' 
              : 'trophy-outline';
            } 
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#365486',
          tabBarInactiveTintColor: '#636363',
        })}
      >
        <Tab.Screen name="Home" component={Home} options={{tabBarStyle: {display: 'none'}}}/>
        <Tab.Screen name="Gameboard" component={Gameboard}/>
        <Tab.Screen name="Scoreboard" component={Scoreboard}/>
      </Tab.Navigator>
      </GameStatetContext.Provider>
    </NavigationContainer>
  );
}
