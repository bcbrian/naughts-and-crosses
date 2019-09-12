//
//Do you have time to make a noughts and crosses app
//where two players can play each other each selects a team.
//or if no other player you can play an ai.
//-ai picks randon number 1-9 to pick a square.
//If noughts are active crosses carnt play or vice versa till its thier turn.
const N = "n";
const C = "c";

const firebaseConfig = {
  apiKey: "AIzaSyCBMFsTwKFAu_hS6qPtIn-kspzlegCTK98",
  authDomain: "cq-noughts-and-crosses.firebaseapp.com",
  databaseURL: "https://cq-noughts-and-crosses.firebaseio.com",
  projectId: "cq-noughts-and-crosses",
  storageBucket: "cq-noughts-and-crosses.appspot.com",
  messagingSenderId: "894776809536",
  appId: "1:894776809536:web:97ce08e818f698a9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get("gameId");

function getRandomPosition(num) {
  return Math.floor(Math.random() * num);
}

function renderBoard(nacBoard) {
  nacBoard.forEach(function(value, i) {
    document.querySelector(".pos-" + i).innerHTML = value ? value : "";
  });
}

function updateGame(updates) {
  db.collection("games")
    .doc(gameId)
    .update(updates)
    .then(function() {
      console.log("Document updated!");
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
}

db.collection("games")
  .doc(gameId)
  .onSnapshot(function(doc) {
    const docData = doc.data();
    const turn = docData.turn;
    const nacBoard = docData.nacBoard;
    const availablePos = docData.availablePos;
    const hasWinner = !!docData.winner;
    const turnId = docData[turn + "Id"];
    // docdata.nId or cId
    renderBoard(nacBoard);

    playNoughtsAndCrosses(turnId, turn, nacBoard, availablePos, hasWinner);
  });

function playNoughtsAndCrosses(
  turnId,
  turn,
  nacBoard,
  availablePos,
  hasWinner
) {
  const colEls = document.querySelectorAll(".col");
  /*************************************************/
  // TODO: use local storage to give computer an id.
  /*************************************************/
  if (hasWinner) {
    return colEls.forEach(function(colEl) {
      colEl.onclick = () => {};
    });
  }
  function checkForWin(turn) {
    if (
      // check rows
      (nacBoard[0] === turn && nacBoard[1] === turn && nacBoard[2] === turn) ||
      (nacBoard[3] === turn && nacBoard[4] === turn && nacBoard[5] === turn) ||
      (nacBoard[6] === turn && nacBoard[7] === turn && nacBoard[8] === turn) ||
      // check columns
      (nacBoard[0] === turn && nacBoard[3] === turn && nacBoard[6] === turn) ||
      (nacBoard[1] === turn && nacBoard[4] === turn && nacBoard[7] === turn) ||
      (nacBoard[2] === turn && nacBoard[5] === turn && nacBoard[8] === turn) ||
      // check diagonal
      (nacBoard[0] === turn && nacBoard[4] === turn && nacBoard[8] === turn) ||
      (nacBoard[2] === turn && nacBoard[4] === turn && nacBoard[6] === turn)
    ) {
      return turn;
    }
    return 0;
  }

  function playTurn(userPos) {
    if (availablePos.length < 1) {
      return;
    }
    if (turnId !== getNCID()) {
      return alert("yo not your turn");
    }
    if (!availablePos.includes(userPos)) {
      return alert("space already taken!");
    }
    nacBoard[userPos] = turn;
    availablePos.splice(availablePos.indexOf(userPos), 1);
    const winner = checkForWin(turn);
    updateGame({ nacBoard, availablePos, winner, turn: turn === N ? C : N });
  }

  // TODO: dumb ai for computer
  // if (turn === C) {
  //   const newCross = availablePos[getRandomPosition(availablePos.length)];
  //   playTurn(newCross);
  //   return colEls.forEach(function(colEl) {
  //     colEl.onclick = () => {};
  //   });
  // }

  colEls.forEach(function(colEl) {
    colEl.onclick = function(event) {
      console.log("HI");
      if (hasWinner) {
        return;
      }
      playTurn(parseInt(event.target.getAttribute("data-pos"), 10));
    };
  });
}
