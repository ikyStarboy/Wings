export const COLORS = ['red', 'blue', 'green', 'yellow'];
export const VALUES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'skip', 'reverse', 'draw2'];
export const WILDS = ['wild', 'wild_draw4'];

export const createDeck = () => {
  let deck = [];
  // Kartu berwarna
  COLORS.forEach(color => {
    deck.push({ id: `${color}_0`, color, value: '0' });
    VALUES.slice(1).forEach(value => {
      // Sisa kartu ada 2 per warna
      deck.push({ id: `${color}_${value}_1`, color, value });
      deck.push({ id: `${color}_${value}_2`, color, value });
    });
  });
  // Kartu hitam (Wild)
  for (let i = 0; i < 4; i++) {
    deck.push({ id: `wild_${i}`, color: 'black', value: 'wild' });
    deck.push({ id: `wild_draw4_${i}`, color: 'black', value: 'wild_draw4' });
  }
  return shuffle(deck);
};

export const shuffle = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};
