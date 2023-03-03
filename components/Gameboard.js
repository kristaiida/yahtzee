import React, { useState, useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import Header from './Header';
import Footer from './Footer';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import styles from '../style/style';
import { NBR_OF_DICES, NBR_OF_THROWS, MAX_SPOT, SCOREBOARD_KEY } from '../constants/Game';
import { Col, Grid } from 'react-native-easy-grid';
import AsyncStorage from '@react-native-async-storage/async-storage';


let board = [];

export default Gameboard = ({route}) => {

    const [playerName, setPlayerName] = useState('');
    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState('');
    // whether dice is selected or not
    const [selectedDices, setSelectedDices] = 
      useState(new Array(NBR_OF_DICES).fill(false));
    //dice spots for throw
    const [diceSpots, setDiceSpots] = useState(new Array(NBR_OF_DICES).fill(0));
    // whether the spot count has been selected or not
    const [selectedDicePoints, setSelectedDicePoints] = 
        useState(new Array(MAX_SPOT).fill(false));
    // total points different spot counts
    const [dicePointsTotal, setDicePointsTotal] = useState(new Array(NBR_OF_DICES).fill(0));
    const [scores, setScores] = useState([]);

    const row = [];
    for (let i = 0; i < NBR_OF_DICES; i++) {
    row.push(
        <Pressable 
          key={"row" + i}
          onPress={() => selectDice(i)}>
        <MaterialCommunityIcons
            name={board[i]}
            key={"row" + i}
            size={50} 
            color={getDiceColor(i)}>
        </MaterialCommunityIcons>
        </Pressable>
    );
    }

    const pointsRow = [];
    for (let spot = 0; spot < MAX_SPOT; spot++) {
        pointsRow.push(
            <Col key={"points" + spot}>
                <Text key={"points" + spot} style={styles.points}>{getSpotsTotal(spot)}</Text>
            </Col>
        )
    }

    const buttonsRow = [];
    for (let diceButton = 0; diceButton < MAX_SPOT; diceButton++) {
        buttonsRow.push(
        <Col key={"buttonsRow" + diceButton}>
            <Pressable
                key={"buttonsRow" + diceButton}
                onPress={() => selectDicePoints(diceButton)}>
                <MaterialCommunityIcons
                    name={"numeric-" + (diceButton + 1) + "-circle"}
                    key={"buttonsRow" + diceButton}
                    size={40}
                    color={getDicePointsColor(diceButton)}
                ></MaterialCommunityIcons>
            </Pressable>
        </Col>
        )
    }

    useEffect(() => {
        if (playerName === '' && route.params?.player ) {
            setPlayerName(route.params.player);
            getScoreboardData();
        }
    }, []);

    useEffect(() => {
        if (nbrOfThrowsLeft === 0) {
            setStatus('Select your points');
        } else if (nbrOfThrowsLeft < 0) {
            setNbrOfThrowsLeft(NBR_OF_THROWS-1);
        } else if (selectedDicePoints.every(x => x)) {
            savePlayerPoints();
        }
    }, [nbrOfThrowsLeft]);

    function getDiceColor(i) {
          return selectedDices[i] ? "black" : "steelblue";
        }

    function getDicePointsColor(i) {
        if(selectedDicePoints[i]) {
            return "black";
        } else {
            return "steelblue";
        }
    }
    
    function selectDice(i) {
        let dices = [...selectedDices];
        dices[i] = selectedDices[i] ? false : true;
        setSelectedDices(dices);
    }

    function getSpotsTotal(i) {
        return dicePointsTotal[i];
    }

    function selectDicePoints(i) {
        let selected = [...selectedDices];
        let selectedPoints = [...selectedDicePoints];
        let points = [...dicePointsTotal];
        if (!selectedPoints[i]) {
            selectedPoints[i] = true;
            let nbrOfDices = diceSpots.reduce((total, x) => (x === (i + 1) ? total + 1: total), 0);
            points[i] = nbrOfDices + (i + 1);
            setDicePointsTotal(points);
        };
        selected.fill(false);
        setSelectedDices(selected);
        setSelectedDicePoints(selectedPoints);
        setNbrOfThrowsLeft(NBR_OF_THROWS);
        return points[i];
    }

    function throwDices() {
        let spots = [...diceSpots];
        for (let i = 0; i < NBR_OF_DICES; i++) {
          if (!selectedDices[i]) {
            let randomNumber = Math.floor(Math.random() * 6 + 1);
            board[i] = 'dice-' + randomNumber;
            spots[i] = randomNumber;
          }
        }
        setNbrOfThrowsLeft(nbrOfThrowsLeft-1);
        setDiceSpots(spots);
        setStatus('Select and throw dices again');
    }

    const getScoreboardData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
            if (jsonValue !== null) {
                let tmpScores = JSON.parse(jsonValue);
                setScores(tmpScores);
            }
        } catch (error) {
            console.log('Read error: ' + error.message);
        }
    }



    const savePlayerPoints = async () => {
        const playerPoints = {
            name: playerName,
            date: getCurrentDate(),
            time: getCurrentTime(),
            points: total
        }
        try {
            const newScore = [...scores, playerPoints];
            const jsonValue = JSON.stringify(newScore);
            await AsyncStorage.setItem(SCOREBOARD_KEY, jsonValue);
        } catch (error) {
            console.log("Save error: " + error.message);
        }
    }

    const getCurrentDate = () => {
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
   
        return date + '.' + month + '.' + year;
    }

    const getCurrentTime = () => {
        var hours = new Date().getHours();
        var minutes = new Date().getMinutes();

        return hours + ':' + minutes;
    }

    const total = dicePointsTotal.reduce(function(a, b) {
        return a + b;
    });

  return (
    <View style={styles.gameboard}>
        <Header/>
        <View style={styles.flex}>{row}</View>
        <Text style={styles.gameinfo}>Throws left: {nbrOfThrowsLeft}</Text>
        <Text style={styles.gameinfo}>{status}</Text>
        <Pressable style={styles.button}
            onPress={() => throwDices()}>
          <Text style={styles.buttonText}>
            THROW DICES
          </Text>
      </Pressable>
        <Text style={styles.total}>Total: {total}</Text>
        <View style={styles.dicepoints}><Grid>{pointsRow}</Grid></View>
        <View style={styles.dicepoints}><Grid>{buttonsRow}</Grid></View>
            <Text style={styles.player}>Player: {playerName}</Text>
        <Footer/>
    </View>
  )
};