import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import Header from './Header';
import Footer from './Footer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SCOREBOARD_KEY } from '../constants/Game';
import styles from '../style/style';
import { Ionicons } from '@expo/vector-icons';

export default Scoreboard = ( {navigation} ) => {

  const [scores, setScores] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getScoreboardData();
    });
    return unsubscribe;
  }, [navigation]);

  const getScoreboardData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
        if (jsonValue !== null) {
            let tmpScores = JSON.parse(jsonValue);
            setScores(tmpScores);
            scores.sort((a, b) => parseFloat(b.points) - parseFloat(a.points));
        }
    } catch (error) {
        console.log('Read error: ' + error.message);
    }
}


  return (
    <View>
        <Header/>
        <View>
        <Ionicons name="list" size={90} color="steelblue" style={styles.icon}/>
          <Text style={styles.top}>Top Seven</Text>
          {scores.map((player, i) => (
            <Text key={i} style={styles.score}>{i + 1}. {player.name} {player.date} {player.time} {player.points}</Text>
          ))}
        </View>
        <Footer/>
    </View>
  )
};