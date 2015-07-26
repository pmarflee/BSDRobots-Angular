'use strict';

var Entity= function () {
    this.x = 0;
    this.y = 0;
    this.isAlive = true;
};
Entity.prototype = {
    moveTo: function (x, y) {
        this.x = x;
        this.y = y;
    },
    move: function (vector) {
        this.moveTo(this.x + vector.x, this.y + vector.y);
    },
    hasSamePositionAs: function (other) {
        return this.x === other.x && this.y === other.y;
    }
};

angular
    .module('Grid', [])
    .factory('Cell', function () {
        var Cell = function (x, y) {
            this.x = x;
            this.y = y;
        };

        return Cell;
    })
    .factory('Vector', function () {
        var Vector = function (x, y) {
            this.x = x;
            this.y = y;
        }
        Vector.prototype = {
            invert: function () {
                return new Vector(-this.x, -this.y);
            }
        };

        return Vector;
    })
    .factory('Player', function () {
        return Entity;
    })
    .factory('Robot', function (Vector) {
        var Robot = function () {
            Entity.apply(this, arguments);
        };
        Robot.prototype = new Entity();
        Robot.prototype.getMovementVector = function (player) {
            var x, y;
            if (player.x > this.x) {
                x = 1;
            } else if (player.x < this.x) {
                x = -1;
            } else {
                x = 0;
            }
            if (player.y > this.y) {
                y = 1;
            } else if (player.y < this.y) {
                y = -1;
            } else {
                y = 0;
            }
            return new Vector(x, y);
        };

        return Robot;
    })
    .provider('GridService', function () {
        this.cellSize = 20;

        this.setSize = function (x, y) {
            this.size = { x: x, y: y };
        };

        var service = this;

        this.$get = function (Cell, Player, Robot, Vector) {
            var getRandomNumberBetween = function (min, max) {
                return Math.floor(Math.random()*(max-min+1)+min);
            },
            getRandomBoardPosition = function () {
                return {
                    x: getRandomNumberBetween(0, this.size.x - 1),
                    y: getRandomNumberBetween(0, this.size.y - 1)
                };
            };

            this.grid = [];
            this.player = new Player();
            this.robots = [];

            this.prepareNewGame = function (robots) {
                this.buildEmptyGameBoard();
                this.positionPlayer();
                this.createRobots(robots);
            };

            this.buildEmptyGameBoard = function () {
                var self = this;
            
                for (var x = 0; x < service.size.x; x++) {
                    for (var y = 0; y < service.size.y; y++) {
                        this.grid[(y * service.size.x) + x] = new Cell(x, y);
                    }
                }
            };

            this.positionPlayer = function () {
                var position = getRandomBoardPosition.call(this);
                this.player.moveTo(position.x, position.y);
            };

            this.createRobots = function (robots) {
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
                    var robot = new Robot();
                    robot.moveTo(position.x, position.y);
                    this.robots[i++] = robot;
                }
                while (i < robots);
            };

            this.getSize = function () {
                return this.size;
            };

            this.getCellSize = function () {
                return this.cellSize;
            };

            this.robotAt = function (x, y) {
                for (var i = 0; i < this.robots.length; i++) {
                    var robot = this.robots[i];
                    if (robot.x == x && robot.y == y) {
                        return robot;
                    }
                }
                return null;
            };

            this.isValidCellSelection = function (cell) {
                var vector = new Vector(cell.x - this.player.x, cell.y - this.player.y),
                    isValid = (vector.x !== 0 || vector.y !== 0) &&
                        Math.abs(vector.x) < 2 &&
                        Math.abs(vector.y) < 2;
                return {
                    isValid: isValid,
                    vector: vector
                };
            }

            this.moveRobots = function () {
                for (var i = 0; i < this.robots.length; i++) {
                    var robot = this.robots[i];
                    if (robot.isAlive) {
                        robot.move(robot.getMovementVector(this.player));
                    }
                }
            }

            return this;
        };

    });