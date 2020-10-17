"use strict";

const IP = "127.0.0.1";
const PORT = 8081;

const express = require("express");
const app = express();
app.use(express.static("public"));

const gameModule = require("./GameModule");

// socket.io initialization
const http = require("http");
const socketIo = require("socket.io");
const webServer = http.Server(app);
const io = socketIo(webServer);

let game1 = new gameModule;

// log incoming connection
io.on("connection", socket => {
    //count connected sockets
    let numberOfConnections = Object.keys(io.sockets.connected).length;
    
    //handle welcoming messages based on number of connected players
    const checkConnections = () => {
        if (numberOfConnections == 1) {
            return game1.messages.firstConnection;
        } else if (numberOfConnections == 2) {return game1.messages.secondConnection
        };
    };
    io.emit("statusArea", checkConnections());

    const informAboutTurn = (message) => {
        io.emit("infoArea", message);
    };

    //welcome players to game
    const assignSymbolsAndWelcomeMessage = () => {
        let clients = Object.keys(io.clients().sockets);
        if (clients.length == 2) {
           io.to(clients[0]).emit("id", "X");
           io.to(clients[1]).emit("id", "O");
           //inform players about first turn after 5 seconds
           setTimeout(() => informAboutTurn(`Am Zug: ${game1.activePlayer}`), 5000);
        };     
    };
    assignSymbolsAndWelcomeMessage();

    //handle clicks
    socket.on("click", (clickData) => {
        //check if game is still running
        if (game1.gameActive && game1.playingField.includes("")) {
            //check if click comes from active player
            if (clickData.playerID == game1.activePlayer) {
                //check if clicked field is empty
                if (game1.playingField[clickData.id] == "") {                
                //save turn to Gamestate
                game1.move(clickData.playerID, clickData.id);
                //emit updated playing field to players
                io.emit("populateField", game1.playingField);     
                //check if game is over and declare winner               
                if (game1.checkForWinner()) {
                    game1.changeGameActiveState();
                    io.emit("infoArea", `Player ${game1.activePlayer} wins`);
                    io.emit("statusArea", game1.messages.gameOver);
                } else {
                //change status of active player in GameState for next turn
                game1.changeActivePlayer();
                //clear InfoArea on both sockets
                io.emit("infoArea", game1.messages.clearInfoArea);
                //clear statusArea on both sockets
                io.emit("statusArea", "");
                //inform players whos turn it is
                informAboutTurn(`Am Zug: ${game1.activePlayer}`);
                };
                //if clicked field != empty
                } else {socket.emit("statusArea", game1.messages.invalidField)}
            //if player clicked out of turn  
            } else {socket.emit("statusArea", game1.messages.invalidTurn)}
        };
        
        //check for draw --> End-of-game-message
        if (game1.playingField.includes("") == false) {
            io.emit("infoArea", game1.messages.draw)
    };
    }); 
});

webServer.listen(PORT, IP, () => {
    console.log(`Server running at http://${IP}:${PORT}/`);
});