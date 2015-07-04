'use strict';

angular
    .module('Grid', [])
    .factory('CellModel', function () {
        var Cell = function (x, y) {
            this.x = x;
            this.y = y;
        };

        return Cell;
    })
    .factory('PlayerModel', function () {
        var Player = function () {
            this.isAlive = true;
        };
        Player.prototype = {
            setPosition: function (x, y) {
                this.x = x;
                this.y = y;
            }
        };

        return Player;
    })
    .factory('RobotModel', function () {
        var Robot = function (x, y) {
            this.x = x;
            this.y = y;
        }

        return Robot;
    })
    .provider('GridService', function () {
        this.size = { x: 55, y: 31 };
        this.cellSize = 25;

        this.setSize = function (x, y) {
            this.size = { x: x, y: y };
        };

        var service = this;

        this.$get = function (CellModel, PlayerModel, RobotModel) {
            var getRandomNumberBetween = function (min, max) {
                return Math.floor(Math.random()*(max-min+1)+min);
            },
            getRandomBoardPosition = function () {
                return {
                    x: getRandomNumberBetween(0, this.size.x),
                    y: getRandomNumberBetween(0, this.size.y)
                };
            };

            this.grid = [];
            this.player = new PlayerModel();
            this.robots = [];

            this.prepareNewGame = function () {
                this.buildEmptyGameBoard();
                this.positionPlayer();
                this.createRobots();
            };

            this.buildEmptyGameBoard = function () {
                var self = this;
            
                for (var x = 0; x < service.size.x; x++) {
                    for (var y = 0; y < service.size.y; y++) {
                        this.grid[(y * service.size.x) + x] = new CellModel(x, y);
                    }
                }
            };

            this.positionPlayer = function () {
                var position = getRandomBoardPosition.call(this);
                this.player.setPosition(position.x, position.y);
            };

            this.createRobots = function () {
                this.robots = [];
                var i = 0;
                do {
                    var position = getRandomBoardPosition.call(this);
                    if (position.x == this.player.x || position.y == this.player.y) {
                        continue;
                    }
                    for (var j = 0; j < this.robots.length; j++) {
                        if (position.x == this.robots[j].x || position.y == this.robots[j].y) {
                            continue;
                        }
                    }
                    this.robots[i++] = new RobotModel(position.x, position.y);
                }
                while (i < 20);
            };

            this.getSize = function () {
                return this.size;
            };

            this.getCellSize = function () {
                return this.cellSize;
            };

            this.hasRobotAt = function (x, y) {
                for (var i = 0; i < this.robots.length; i++) {
                    if (this.robots[i].x == x && this.robots[i].y == y) {
                        return true;
                    }
                }
                return false;
            };

            return this;
        };

    });