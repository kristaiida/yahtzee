import React, { useState } from 'react';
import { Text, View, TextInput, Pressable, Keyboard } from 'react-native';
import styles from '../style/style';
import Header from './Header';
import Footer from './Footer';
import { NBR_OF_DICES, NBR_OF_THROWS, MAX_SPOT, MIN_SPOT, BONUS_POINTS, BONUS_POINTS_LIMIT } from '../constants/Game';
import { Ionicons } from '@expo/vector-icons';

export default Home = ({navigation}) => {
 
    const [playerName, setPlayerName] = useState('');
    const [hasPlayerName, setHasPlayerName] = useState(false);

    const handlePlayerName = (value) => {
        if(value.trim().length > 0) {
            setHasPlayerName(true);
            Keyboard.dismiss();
        }
    }

  return (
    <View style={styles.home}>
        <Header/>
        <Ionicons name="information-circle" size={90} color="steelblue" style={styles.icon}/>
            { !hasPlayerName ?
            <>
            <Text style={styles.text}>For Scoreboard enter your name...</Text>
            <TextInput
              value={playerName}
              onChangeText = {i => {setPlayerName(i)}}
              autoFocus={true}
              textAlign={'center'}
              fontSize={20}
              style={styles.input}
            />
            <Pressable onPress={() => handlePlayerName(playerName)} style={styles.button}>
            <Text style={styles.buttonText}>OK</Text>
            </Pressable>
            </>
            :
            <>
            <Text style={styles.rules}>Rules of the game</Text>
            <Text style={styles.ruletext}>THE GAME: Upper section of the classic Yahtzee
            dice game. You have {NBR_OF_DICES} dices and
            for the every dice you have {NBR_OF_THROWS}
            throws. After each throw you can keep dices in
            order to get same dice spot counts as many as
            possible. In the end of the turn you must select
            your points from {MIN_SPOT} to {MAX_SPOT}.
            Game ends when all points have been selected.
            The order for selecting those is free.
            {"\n"}{"\n"}POINTS: After each turn game calculates the sum
            for the dices you selected. Only the dices having
            the same spot count are calculated. Inside the
            game you can not select same points from
            {MIN_SPOT} to {MAX_SPOT} again.
            {"\n"}{"\n"}GOAL: To get points as much as possible.
            {BONUS_POINTS_LIMIT} points is the limit of
            getting bonus which gives you {BONUS_POINTS}
            points more.</Text>
            <Text style={styles.player}>Good luck, {playerName}!</Text>
            <Pressable onPress={() => navigation.navigate('Gameboard', {player: playerName})} style={styles.button}>
                <Text style={styles.buttonText}>PLAY</Text>
            </Pressable>
            </>
            }
        <Footer/>
    </View>
  )
};