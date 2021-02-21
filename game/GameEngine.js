import { getPointsForCards, getSuit } from "./cardUtils";
import shuffle from "lodash/shuffle";
import flatten from "lodash/flatten";
import dropRightWhile from "lodash/dropRightWhile";
import range from "lodash/range";

const PASS_BID = "P";
const POINT_BID = "Y";
const BID = "bid";
const THROW = "throw";
const MONKEY = "monkey";

export const generateGame = (rounds = []) => ({
  rounds,
  initializeRound(roundData) {
    this.rounds.push({
      trickCards: [],
      shuffle: shuffle(range(40)),
      bidActions: [],
      monkeySuit: undefined,
      ...roundData
    });
  },
  loadRound(roundData) {
    if (roundData === undefined) {
      roundData = this.roundData;
    }
    return {
      // this counts on the chance of two decks shuffled identically
      // being infinitessimally small.
      roundFirstPlayerIndex:
        this.rounds.findIndex(
          rnd =>
            JSON.stringify(rnd.shuffle) === JSON.stringify(roundData.shuffle)
        ) % 5,

      // round state getters
      get nextAction() {
        if (!this.bidIsFinal) {
          return BID;
        } else if (this.trickCards.length === 5 && isNaN(this.monkeySuit)) {
          return MONKEY;
        } else {
          return THROW;
        }
      },
      get isFinal() {
        return this.trickCards.length === this.shuffle.length;
      },
      get roundScore() {
        if (!this.isFinal) {
          return [0, 0, 0, 0, 0];
        }

        return range(5).map(playerIndex => this.scorePlayer(playerIndex));
      },
      get partnerCard() {
        return this.monkeySuit * 10 + this.bidRank;
      },
      get bidTeamWins() {
        if (!this.isFinal) {
          return null;
        }
        return this.bidTeamPoints >= this.bidPoints;
      },

      // bid state getters
      get bidRank() {
        if (!this.bidActions.length) {
          return Number.POSITIVE_INFINITY;
        }
        const onlyRanks = this.bidActions.filter(ba => !isNaN(ba));
        return onlyRanks[onlyRanks.length - 1];
      },
      get bidPoints() {
        const onlyPointBids = this.bidActions.filter(ba => ba === POINT_BID);
        return onlyPointBids.length * 2 + 61;
      },
      get bidIsFinal() {
        // bid is final if the points have been incremented to 119
        // or the last 4 bid actions are passes
        return (
          this.bidPoints === 119 ||
          this.bidActions
            .slice(this.bidActions.length - 4, this.bidActions.length)
            .filter(ba => ba === PASS_BID).length === 4
        );
      },

      // trick state getters
      get tricks() {
        const ret = [];
        if (!this.bidIsFinal) return ret;
        const copy = [...this.trickCards];
        while (copy.length) {
          ret.push(copy.splice(0, 5));
        }
        // initialize empty trick if conditions right
        if (
          !ret[0] ||
          (ret[ret.length - 1].length === 5 && !isNaN(this.monkeySuit))
        )
          ret.push([]);
        return ret;
      },
      get trick() {
        return this.tricks.pop();
      },

      get previousTrick() {
        if (isNaN(this.monkeySuit)) {
          return undefined;
        } else {
          return this.tricks[this.tricks.length - 2];
        }
      },
      get bidTeamTricks() {
        return this.tricks.filter(
          trick =>
            [this.bidderIndex, this.partnerIndex].indexOf(
              this.resolveTrickWinner(trick)
            ) !== -1
        );
      },
      get defendTeamTricks() {
        return this.tricks.filter(
          trick =>
            [this.bidderIndex, this.partnerIndex].indexOf(
              this.resolveTrickWinner(trick)
            ) === -1
        );
      },
      get bidTeamPoints() {
        return getPointsForCards(flatten(this.bidTeamTricks));
      },
      get defendTeamPoints() {
        return getPointsForCards(flatten(this.defendTeamTricks));
      },

      // player getters
      get playerHands() {
        const ret = this.playerHandsDealt.map(cards =>
          cards.filter(cardNum => this.trickCards.indexOf(cardNum) === -1)
        );
        return ret;
      },
      get playerHandsDealt() {
        return range(5).map(i => this.shuffle.slice(i * 8, (i + 1) * 8));
      },
      get trickFirstPlayerIndex() {
        if (!this.previousTrick) {
          return this.roundFirstPlayerIndex;
        } else {
          return this.resolveTrickWinner(this.previousTrick);
        }
      },
      get partnerIndex() {
        // index position of partner in this.players
        if (isNaN(this.monkeySuit)) {
          return null;
        }
        return this.playerHandsDealt.findIndex(
          hand => hand.indexOf(this.partnerCard) !== -1
        );
      },

      get playerIndex() {
        // gives index position (0-4) of current player
        let premodulo;
        if (!this.bidIsFinal) {
          premodulo = this.roundFirstPlayerIndex + this.bidActions.length;
        } else if (this.nextAction == MONKEY) {
          premodulo = this.bidderIndex;
        } else {
          premodulo = this.trickFirstPlayerIndex + this.trickCards.length;
        }
        return premodulo % 5;
      },

      get bidderIndex() {
        // index position of bidder
        if (!this.bidActions.length) return null;
        const ignoreEndPasses = dropRightWhile(
          this.bidActions,
          ba => ba === PASS_BID
        );
        return (this.roundFirstPlayerIndex + ignoreEndPasses.length - 1) % 5;
      },

      get bidderIsPartner() {
        return this.bidderIndex === this.partnerIndex;
      },

      get partnerIsRevealed() {
        return this.trickCards.indexOf(this.partnerCard) !== -1;
      },

      // trick-parameterized functions
      ledSuit(trick) {
        return getSuit(trick[0]);
      },
      resolveTrickWinner(trick) {
        if (isNaN(this.monkeySuit)) {
          return -1;
        }
        const cardValues = trick.map(cardNum =>
          getSuit(cardNum) === this.monkeySuit
            ? 1000 + cardNum
            : getSuit(cardNum) === this.ledSuit(trick)
            ? 100 + cardNum
            : cardNum
        );
        return this.playerHandsDealt.findIndex(
          hand =>
            hand.indexOf(trick[cardValues.indexOf(Math.max(...cardValues))]) !==
            -1
        );
      },
      //  player-parameterized functions
      playerTricks(playerIndex) {
        return this.tricks.filter(
          trick =>
            trick.length === 5 && this.resolveTrickWinner(trick) === playerIndex
        );
      },
      playerPointsTaken(playerIndex) {
        return getPointsForCards(flatten(this.playerTricks(playerIndex)));
      },
      isBidTeam(playerIndex) {
        return (
          [this.bidderIndex, this.partnerIndex].indexOf(playerIndex) !== -1
        );
      },
      scorePlayer(playerIndex) {
        return (
          (this.isBidTeam(playerIndex) === this.bidTeamWins ? 1 : -1) *
          (playerIndex === this.bidderIndex
            ? this.bidderIsPartner
              ? 4
              : 2
            : 1)
        );
      },
      // bid parameterized functions
      validateBidAction(bidAction) {
        const currentBidRank = this.bidRank;
        return (
          ((this.bidActions.length && bidAction === PASS_BID) ||
            (currentBidRank === 0 && bidAction === POINT_BID) ||
            (bidAction > -1 && bidAction < currentBidRank)) &&
          bidAction
        );
      },
      ...roundData
    };
  },

  get roundData() {
    return this.rounds[this.rounds.length - 1];
  },

  get roundScores() {
    return this.rounds.map(roundData => {
      const round = this.loadRound(roundData);
      return round.roundScore;
    });
  },

  get gameScore() {
    const { roundScores } = this;
    return range(5).map(idx =>
      range(roundScores.length).reduce(
        (sum, idx2) => sum + roundScores[idx2][idx],
        0
      )
    );
  },
  // state changers -- game state should only be mutated with these.
  pushBidAction(bidAction) {
    const { roundData } = this;
    const round = this.loadRound(roundData);
    if (round.validateBidAction(bidAction) !== false) {
      roundData.bidActions.push(bidAction);
      return this.loadRound(roundData);
    } else {
      return false;
    }
  },

  setSuit(suit) {
    const { roundData } = this;
    if (!isNaN(roundData.monkeySuit)) {
      return false;
    }
    roundData.monkeySuit = suit;
    return this.loadRound(roundData);
  },

  pushTrickCard(trickCardNum) {
    const { roundData } = this;
    const round = this.loadRound(roundData);
    if (round.playerHands[round.playerIndex].indexOf(trickCardNum) === -1) {
      return false;
    }
    roundData.trickCards.push(trickCardNum);
    return this.loadRound(roundData);
  }
});
