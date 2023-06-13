import React, { useState, useEffect, useRef } from "react";
import Card from "./Card";
import axios from "axios";

const CardList = () => {
  const [deckId, setDeckId] = useState(null);
  const [cardsDrawn, setCardsDrawn] = useState([]);
  const [buttonText, setButtonText] = useState("Start Drawing");
  const interval = useRef(null);

  useEffect(() => {
    async function loadDeck() {
      const res = await axios.get(
        `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`
      );
      setDeckId(res.data.deck_id);
    }
    loadDeck();
  }, []);

  async function getCard() {
    setButtonText((btnText) =>
      btnText === "Start Drawing" ? "Stop Drawing" : "Start Drawing"
    );

    if (buttonText === "Stop Drawing") {
      return clearInterval(interval.current);
    }

    interval.current = setInterval(async () => {
      const res = await axios.get(
        `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
      );
      const deck = res.data;
      console.log(deck.remaining);
      const card = deck.cards[0];
      setCardsDrawn((deck) => [
        ...deck,
        {
          image: card.image,
        },
      ]);
    }, 1000);
  }

  useEffect(() => {
    return () => {
      if (cardsDrawn.length === 51) {
        clearInterval(interval.current);
      }
    };
  }, [cardsDrawn]);

  const cards = cardsDrawn.map((card) => <Card imageUrl={card.image} />);

  return (
    <div>
      {cardsDrawn.length <= 51 ? (
        <button onClick={getCard}>{buttonText}</button>
      ) : (
        alert("No cards remaning")
      )}
      {cards}
    </div>
  );
};

export default CardList;
