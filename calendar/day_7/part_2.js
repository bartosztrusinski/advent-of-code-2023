const fs = require('fs');
const readline = require('readline');
const path = require('path');

const handTypes = {
  fiveOfKind: [],
  fourOfKind: [],
  fullHouse: [],
  threeOfKind: [],
  twoPair: [],
  onePair: [],
  highCard: [],
};

const cardValues = {
  J: 1,
  T: 10,
  Q: 12,
  K: 13,
  A: 14,
};

const rl = readline.createInterface({
  input: fs.createReadStream(path.resolve(__dirname, '../../inputs/day_7.txt')),
  crlfDelay: Infinity,
});

const run = () => {
  rl.on('line', (inputLine) => {
    const [hand, bid] = inputLine.split(' ');
    const handType = computeHandType(hand);

    handTypes[handType].push({ hand, bid });
  }).on('close', () => {
    const sortedHands = Object.values(handTypes)
      .map((handType) =>
        handType.toSorted((a, b) => sortHandsByStrength(a.hand, b.hand))
      )
      .flat();

    const totalWinnings = sortedHands.reduce(
      (result, hand, currentIndex, hands) => {
        const handRank = hands.length - currentIndex;
        return result + hand.bid * handRank;
      },
      0
    );

    console.log(totalWinnings);
  });
};

const computeHandType = (hand) => {
  const groupedCards = hand.split('').reduce((groupedCards, card) => {
    groupedCards[card] = (groupedCards[card] ?? 0) + 1;
    return groupedCards;
  }, {});

  const jokerCount = groupedCards['J'] ?? 0;
  delete groupedCards['J'];

  const groupedValues = Object.values(groupedCards);

  const handType = getHandType(
    groupedValues.length,
    hand.length - jokerCount,
    groupedValues
  );

  return applyJokers(handType, jokerCount);
};

const getHandType = (uniqueCardCount, totalCardCount, groupedValues) => {
  switch (totalCardCount - uniqueCardCount) {
    case 4:
      return 'fiveOfKind';
    case 3:
      const isFourOfKind = groupedValues.find((value) => value === 4);
      return isFourOfKind ? 'fourOfKind' : 'fullHouse';
    case 2:
      const isThreeOfKind = groupedValues.find((value) => value === 3);
      return isThreeOfKind ? 'threeOfKind' : 'twoPair';
    case 1:
      return 'onePair';
    case 0:
      return 'highCard';
  }
};

const applyJokers = (handType, jokerCount) => {
  for (let i = 0; i < jokerCount; i++) {
    handType = useJoker(handType);
  }

  return handType;
};

const useJoker = (handType) => {
  switch (handType) {
    case 'fiveOfKind':
    case 'fullHouse':
    case 'fourOfKind':
      return 'fiveOfKind';
    case 'threeOfKind':
      return 'fourOfKind';
    case 'twoPair':
      return 'fullHouse';
    case 'onePair':
      return 'threeOfKind';
    case 'highCard':
      return 'onePair';
  }
};

const sortHandsByStrength = (handA, handB) => {
  for (let i = 0; i < handA.length; i++) {
    const cardAValue = getCardValue(handA[i]);
    const cardBValue = getCardValue(handB[i]);

    if (cardAValue > cardBValue) {
      return -1;
    } else if (cardAValue < cardBValue) {
      return 1;
    }
  }

  return 0;
};

const getCardValue = (card) => {
  return Number(card) || cardValues[card];
};

run();
