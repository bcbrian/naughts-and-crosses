function getNCID() {
  return localStorage.getItem("ncid");
}

function setNCID(ncid) {
  return localStorage.setItem("ncid", ncid);
}

function createId() {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
}

function initNCID() {
  // Check to see if the computer has an identifier for this app
  let ncid = getNCID();
  if (ncid) {
    console.log("Found ID: ", ncid);
    return;
  }
  ncid = createId();
  console.log("Storing ID", ncid);
  setNCID(ncid);
}

initNCID();
