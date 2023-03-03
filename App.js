import React from 'react';
import Home from './components/Home.js';
import Gameboard from './components/Gameboard.js';
import Scoreboard from './components/Scoreboard.js';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const Tab  = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused
                ? 'home'
                : 'home-outline';
            } else if (route.name === 'Gameboard') {
              iconName = focused ? 'game-controller' : 'game-controller-outline';
            } else if (route.name === 'Scoreboard') {
              iconName = focused ? 'list-circle' : 'list-circle-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'turquoise',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={Home} options={{tabBarStyle: {display:"none"}}}/>
        <Tab.Screen name="Gameboard" component={Gameboard}/>
        <Tab.Screen name="Scoreboard" component={Scoreboard}/>
      </Tab.Navigator>
    </NavigationContainer>
)};
