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

const newGameBtnEl = document.querySelector(".new-game-btn");
newGameBtnEl.addEventListener("click", function() {
  db.collection("games")
    .add({
      open: true,
      nacBoard: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      availablePos: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      winner: 0,
      turn: "n",
      nId: getNCID()
    })
    .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
      window.location = "/game/index.html?gameId=" + docRef.id;
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
});

const gameListEl = document.querySelector(".game-list");

db.collection("games")
  .where("open", "==", true)
  .onSnapshot(function(querySnapshot) {
    gameListEl.innerHTML = "";
    let i = 0;
    querySnapshot.forEach(function(doc) {
      i++;
      const gameItemEl = document.createElement("button");
      gameItemEl.classList.add("game-item");
      gameItemEl.setAttribute("href", "/game/index.html?gameId=" + doc.id);
      gameItemEl.innerHTML = i + ". " + doc.id.substring(0, 8);

      gameItemEl.addEventListener("click", function() {
        db.collection("games")
          .doc(doc.id)
          .update({
            open: false,
            cId: getNCID()
          })
          .then(function() {
            console.log("Document successfully updated!");
            window.location = "/game/index.html?gameId=" + doc.id;
          })
          .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
          });
      });

      gameListEl.append(gameItemEl);
    });
  });
