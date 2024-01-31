import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";

const SYMBOLS = ["♥️", "♣️", "♠️", "♦️"];
const DEFAULT_SYMBOL = "🃏";

const generateRandomSymbol = () => {
  const randomIndex = Math.floor(Math.random() * SYMBOLS.length);
  return SYMBOLS[randomIndex];
};

export default function App() {
  const [cards, setCards] = useState(generateInitialCards());
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [selectedCards, setSelectedCards] = useState([]);

  function generateInitialCards() {
    const initialCards = [];
    let cardId = 0; // Initialize cardId
  
    for (let i = 0; i < 8; i++) {
      const cardsInRow = [];
      for (let j = 0; j < 8; j++) {
        cardsInRow.push({
          id: cardId++, // Use a single incrementing ID
          symbol: generateRandomSymbol(),
        });
      }
      initialCards.push(cardsInRow);
    }
    return initialCards;
  }
  
  const resetCard = () => {
    const updatedCards = generateInitialCards();
    setCards(updatedCards);

  };

  const resetGame = () => {
    const updatedCards = generateInitialCards();
    setCards(updatedCards);
    setPlayer1Score(0);

  };

  const handleCardPress = (rowIndex, columnIndex) => {
    const updatedCards = [...cards];
    const card = updatedCards[rowIndex][columnIndex];

    // Toggle the flipped state of the selected card
    card.isFlipped = !card.isFlipped;

    // Check if two cards are flipped
    const flippedCards = updatedCards.flat().filter((c) => c.isFlipped);

    if (flippedCards.length === 2) {
      checkMatch(flippedCards);
    }

    setCards(updatedCards);
  };
  const celebrationStyle = {
    transform: [
      {
        scale: celebrationAnimation.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 1.2, 1],
        }),
      },
    ],
  };
  const checkMatch = (flippedCards) => {
    const [card1, card2] = flippedCards;
  
    if (card1.symbol === card2.symbol) {
      setPlayer1Score((prevScore) => prevScore + 20);
      Animated.timing(celebrationAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false, // 'false' for animated styles
      }).start(() => {
        celebrationAnimation.setValue(0);
      });
      // Update the matching cards in the state
      setTimeout(() => {
        const resetCards = cards.map((row) =>
          row.map((card) => ({ ...card, isFlipped: false }))
        );
        console.log("remaining cards",resetCards)
        console.log("remaining cards",resetCards.length)
        resetCard()
      }, 1000);
      // Update scores or perform any other actions
    } else {
      // Reset flipped state after a delay if no match
      setTimeout(() => {
        const resetCards = cards.map((row) =>
          row.map((card) => ({ ...card, isFlipped: false }))
        );
        setCards(resetCards);
      }, 1000);
    }
  };
  
  
 
  
  
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      // After 10 seconds, replace symbols with DEFAULT_SYMBOL
      const updatedCards = cards.map((row) =>
        row.map((card) => ({
          ...card,
          symbol: DEFAULT_SYMBOL,
        }))
      );
      setCards(updatedCards);
    }, 5000);

    // Cleanup the timeout on component unmount
    return () => clearTimeout(timeout);
  }, [cards]);

  return (
    <View style={styles.container}>
      <View style={styles.gameContainer}>
        {cards.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.cardRow}>
            {row.map((card, columnIndex) => (
              <TouchableOpacity
                key={card.id}
                style={styles.card}
                onPress={() => handleCardPress(rowIndex, columnIndex)}
              >
                <Text style={styles.symbolText}>
                  {card.isFlipped ? card.symbol : DEFAULT_SYMBOL}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
         <Text style={styles.scoreText}>Player Score: {player1Score}</Text>
        <TouchableOpacity 
        
        style={styles.resetButton} onPress={resetGame}>
          <Text style={styles.buttonText}>Reset Game</Text>
        </TouchableOpacity>
      </View>
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  gameContainer: {
    flex: 4,
  },
  cardRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  card: {
    width: 100,
    height: 100,
    borderWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  symbolText: {
    fontSize: 90, // Adjust the font size as needed
  },
  sideContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 50,
  },
  scoreText: {
    fontSize: 20,
    marginBottom: 10,
  },
  resetButton: {
    backgroundColor: "blue",
    width: 400,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
