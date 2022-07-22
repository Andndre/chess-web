"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var http_1 = require("http");
var ws_1 = require("ws");
var uuid_1 = require("uuid");
var cors_1 = __importDefault(require("cors"));
var games = [];
var app = (0, express_1["default"])();
app.use((0, cors_1["default"])());
var httpServer = (0, http_1.createServer)(app);
var wss = new ws_1.WebSocketServer({ server: httpServer, path: '/ws' });
app.get('/create', function (_req, res) {
    var whiteId = (0, uuid_1.v4)();
    var blackId = (0, uuid_1.v4)();
    var gameId = (0, uuid_1.v4)();
    var watchKey = (0, uuid_1.v4)();
    games.push({
        gameId: gameId,
        white: {
            id: whiteId
        },
        black: {
            id: blackId
        },
        watchKey: watchKey,
        watchers: [],
        moves: []
    });
    setTimeout(function () {
        for (var i = 0; i < games.length; i++) {
            if (games[i].gameId === gameId) {
                if (!games[i].watchers.length &&
                    !games[i].black.ws &&
                    !games[i].white.ws) {
                    games.splice(i, 1);
                }
                return;
            }
        }
    }, 
    // 10 minutes
    1000 * 60 * 10);
    // TODO: close this when the game is finished, not if 60 minutes have passed.
    setTimeout(function () {
        for (var i = 0; i < games.length; i++) {
            if (games[i].gameId === gameId) {
                games.splice(i, 1);
                return;
            }
        }
    }, 1000 * 60 * 60);
    res.status(201).send(JSON.stringify({
        gameId: gameId,
        whiteId: whiteId,
        blackId: blackId,
        watchKey: watchKey
    }));
});
wss.on('connection', function (ws, _req) {
    ws.on('message', function (data) {
        var json = JSON.parse(data.toString());
        if (json.type === 'connectToGame') {
            var roleKey = json.roleKey;
            var gameId_1 = json.gameId;
            var game = games.find(function (e) { return e.gameId === gameId_1; });
            var res_role = '';
            if (roleKey === (game === null || game === void 0 ? void 0 : game.watchKey)) {
                res_role = 'watching';
                game.watchers.push(ws);
            }
            else {
                if (roleKey === (game === null || game === void 0 ? void 0 : game.black.id)) {
                    res_role = 'black';
                    game.black.ws = ws;
                }
                else if (roleKey === (game === null || game === void 0 ? void 0 : game.white.id)) {
                    res_role = 'white';
                    game.white.ws = ws;
                }
            }
            var res = JSON.stringify({
                type: 'connectToGame',
                role: res_role,
                moves: game === null || game === void 0 ? void 0 : game.moves
            });
            ws.send(res);
        }
        else if (json.type === 'move') {
            var move = json.move;
            var game = games.find(function (e) { return e.gameId === json.gameId; });
            var res_1 = JSON.stringify({
                type: 'move',
                move: move
            });
            game.moves.push(move);
            if (json.role === 'black') {
                if (game.white.ws) {
                    game.white.ws.send(res_1);
                }
            }
            else {
                if (game.black.ws) {
                    game.black.ws.send(res_1);
                }
            }
            game.watchers.forEach(function (w) {
                w.send(res_1);
            });
        }
    });
});
app.get('/', function (_req, res) {
    res.status(200).send('Hello API');
});
var PORT = process.env.PORT || 3333;
httpServer.listen(PORT, function () {
    console.log('Server listening at port ' + PORT);
});
//# sourceMappingURL=server.js.map