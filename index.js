const db = firebase.firestore();

firebase.auth().onAuthStateChanged(user => {
  console.log("hi, user", user);
  if (!user) {
    document.querySelector(".sign-in-container").style.display = "block";
  } else {
    document.querySelector(".sign-in-container").style.display = "none";
    const newGameBtnEl = document.querySelector(".new-game-btn");
    newGameBtnEl.addEventListener("click", function() {
      db.collection("games")
        .add({
          open: true,
          nacBoard: [0, 0, 0, 0, 0, 0, 0, 0, 0],
          availablePos: [0, 1, 2, 3, 4, 5, 6, 7, 8],
          winner: 0,
          turn: "n",
          nId: user.uid
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
                cId: user.uid
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
  }
});
