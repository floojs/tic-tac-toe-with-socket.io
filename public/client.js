"use strict";

const $  = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const statusArea = $("#status");
const infoArea = $("#infoarea");

let playerID = "";

//connect sockets
const socket = io.connect();
  
socket.on("statusArea", (message) => {
    statusArea.textContent = message;
});

socket.on("infoArea", (message) => {
  infoArea.textContent = message;
});

socket.on("id", (id) => {
  playerID = id;
  infoArea.textContent = `You're playing as ${id}`;
})

//react at clicks in tic-tac-toe-field
$$(".cell").forEach(field => field.addEventListener("click", (event) => {
  let clickID = { id: event.target.id, playerID };
  socket.emit("click", clickID)}
));

//map current state of field on table
socket.on("populateField", (arrayField) => {
  arrayField.map((symbol, i) => $$(".cell")[i].textContent = symbol);
});
