"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
var express_1 = __importDefault(require("express"));
var http_1 = require("http");
var ws_1 = require("ws");
var uuid_1 = require("uuid");
var cors_1 = __importDefault(require("cors"));
var db_1 = require("./db");
var games = new Map();
var connections = new Map();
var app = (0, express_1["default"])();
app.use((0, cors_1["default"])({
    // origin: 'https://chess-web-ten.vercel.app*',
    origin: 'http://localhost:3000*'
}));
app.use(express_1["default"].json());
var httpServer = (0, http_1.createServer)(app);
var wss = new ws_1.WebSocketServer({ server: httpServer, path: '/ws' });
app.get('/create', function (req, res) {
    var whiteId = (0, uuid_1.v4)();
    var blackId = (0, uuid_1.v4)();
    var gameId = (0, uuid_1.v4)();
    var watchKey = (0, uuid_1.v4)();
    games.set(gameId, {
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
    // delete game when no one is playing the game in 3 minutes
    setTimeout(function () {
        var game = games.get(gameId);
        if (!game)
            return;
        if (!game.black.ws || !game.white.ws) {
            games["delete"](gameId);
            console.log('closing game (' + gameId + ') due to inactivity');
        }
    }, 
    // 3 minutes
    1000 * 60 * 3);
    res.status(201).send(JSON.stringify({
        gameId: gameId,
        whiteId: whiteId,
        blackId: blackId,
        watchKey: watchKey
    }));
});
wss.on('connection', function (ws, _req) {
    var connectionID = (0, uuid_1.v4)();
    ws.on('message', function (data) {
        var _a, _b;
        var json = JSON.parse(data.toString());
        if (json.type === 'connectToGame') {
            var roleKey = json.roleKey;
            var gameId = json.gameId;
            var game = games.get(gameId);
            if (!game) {
                ws.send(JSON.stringify({
                    type: 'error',
                    errorType: 'game-not-found'
                }));
                ws.close();
                return;
            }
            var res_role = '';
            if (roleKey === game.watchKey) {
                res_role = 'watching';
                var res_1 = JSON.stringify({
                    type: 'watcherJoin'
                });
                game.watchers.forEach(function (w) { return w.send(res_1); });
                game.watchers.push(ws);
                (_a = game.white.ws) === null || _a === void 0 ? void 0 : _a.send(res_1);
                (_b = game.black.ws) === null || _b === void 0 ? void 0 : _b.send(res_1);
                connections.set(connectionID, gameId);
            }
            else {
                if (roleKey === game.black.id) {
                    res_role = 'black';
                    if (game.black.ws) {
                        ws.send(JSON.stringify({
                            type: 'error',
                            errorType: 'link-already-clicked'
                        }));
                        ws.close();
                        return;
                    }
                    connections.set(connectionID, gameId);
                    if (game.white.ws) {
                        var res_2 = JSON.stringify({
                            type: 'start'
                        });
                        game.white.ws.send(res_2);
                        game.watchers.forEach(function (w) { return w.send(res_2); });
                    }
                    game.black.ws = ws;
                }
                else if (roleKey === game.white.id) {
                    res_role = 'white';
                    if (game.white.ws) {
                        ws.send(JSON.stringify({
                            type: 'error',
                            errorType: 'link-already-clicked'
                        }));
                        ws.close();
                        return;
                    }
                    connections.set(connectionID, gameId);
                    if (game.black.ws) {
                        var res_3 = JSON.stringify({
                            type: 'start'
                        });
                        game.black.ws.send(res_3);
                        game.watchers.forEach(function (w) { return w.send(res_3); });
                    }
                    game.white.ws = ws;
                }
            }
            var res = JSON.stringify({
                type: 'connectToGame',
                role: res_role,
                moves: game.moves,
                watchers: game.watchers.length,
                waiting: !game.white.ws || !game.black.ws
            });
            ws.send(res);
        }
        else if (json.type === 'move') {
            var move = json.move;
            var game = games.get(json.gameId);
            var res_4 = JSON.stringify({
                type: 'move',
                move: move
            });
            game.moves.push(move);
            if (json.role === 'black') {
                if (game.white.ws) {
                    game.white.ws.send(res_4);
                }
            }
            else {
                if (game.black.ws) {
                    game.black.ws.send(res_4);
                }
            }
            game.watchers.forEach(function (w) {
                w.send(res_4);
            });
        }
    });
    ws.on('close', function () { return __awaiter(void 0, void 0, void 0, function () {
        var gameId, game, res_5, enemy, index, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gameId = connections.get(connectionID);
                    if (!gameId) return [3 /*break*/, 4];
                    game = games.get(gameId);
                    if (!game) return [3 /*break*/, 4];
                    if (!(game.black.ws == ws || game.white.ws == ws)) return [3 /*break*/, 3];
                    res_5 = {
                        type: 'playerLeave',
                        color: ''
                    };
                    res_5.color = game.black.ws === ws ? 'black' : 'white';
                    enemy = game.white.ws === ws ? game.black.ws : game.white.ws;
                    if (enemy) {
                        enemy.send(JSON.stringify(res_5));
                        game.watchers.forEach(function (w) {
                            w.send(JSON.stringify(res_5));
                            w.close();
                        });
                    }
                    if (!game.moves.length) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, db_1.post)('games', 'insertOne', {
                            document: {
                                _id: gameId,
                                moves: game.moves
                            }
                        })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    games["delete"](gameId);
                    return [3 /*break*/, 4];
                case 3:
                    index = game.watchers.indexOf(ws);
                    if (index !== -1) {
                        // on watcher leave
                        game.watchers.splice(index, 1);
                        res = {
                            type: 'watcherLeave'
                        };
                        if (game.black.ws) {
                            game.black.ws.send(JSON.stringify(res));
                        }
                        if (game.white.ws) {
                            game.white.ws.send(JSON.stringify(res));
                        }
                    }
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); });
});
app.post('/games', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var gameId, game;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gameId = req.body.gameId;
                return [4 /*yield*/, (0, db_1.post)('games', 'findOne', {
                        filter: {
                            _id: gameId
                        }
                    })];
            case 1:
                game = _a.sent();
                res.status(200).send(JSON.stringify(game.document));
                return [2 /*return*/];
        }
    });
}); });
app.get('/gameCount', function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, _d;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _b = (_a = res.status(200)).send;
                _d = (_c = JSON).stringify;
                _e = {
                    current: games.size
                };
                return [4 /*yield*/, (0, db_1.post)('games', 'find', {})];
            case 1:
                _b.apply(_a, [_d.apply(_c, [(_e.played = (_f.sent()).documents.length,
                            _e)])]);
                return [2 /*return*/];
        }
    });
}); });
app.get('/', function (_req, res) {
    res.status(200).send('Hello API');
});
var PORT = process.env.PORT || 3333;
httpServer.listen(PORT, function () {
    console.log('Server listening at port ' + PORT);
});
//# sourceMappingURL=server.js.map