'use strict';

angular
    .module('Game', ['Grid'])
    .service('GameManager', function ($q, $timeout, $log, GridService) {
        this.grid = GridService.grid;
        this.player = GridService.player;
        this.gameSize = GridService.getSize();
        this.cellSize = GridService.getCellSize();

        this.reinit = function () {
            this.gameOver = false;
            this.win = false;
        };
        this.newGame = function () {
            GridService.prepareNewGame();
            this.reinit();
        };

        this.robotAt = function (x, y) {
            return GridService.robotAt(x, y);
        }

        this.isValidCellSelection = function (cell) {
            return GridService.isValidCellSelection(cell);
        }

        this.movePlayer = function (vector) {
            this.player.move(vector);
            GridService.moveRobots();
            for (var i = 0; i < GridService.robots.length; i++) {
                var robot = GridService.robots[i];
                if (this.player.hasSamePositionAs(robot.x)) {
                    this.player.isAlive = false;
                }
                for (var j = 0; j < GridService.robots.length; j++) {
                    var otherRobot = GridService.robots[j];
                    if (robot != otherRobot && robot.hasSamePositionAs(otherRobot)) {
                        robot.isAlive = false;
                        otherRobot.isAlive = false;
                    }
                }
            }
        };
    });