'use strict';

angular
    .module('Game', ['Grid'])
    .service('GameManager', function ($q, $timeout, $log, GridService) {
        var gameSize = GridService.getSize(),
            cellSize = GridService.getCellSize(),
            updateBoard = function () {
                GridService.moveRobots();
                handleCollisions.call(this);
            },
            handleCollisions = function () {
                for (var i = 0; i < GridService.robots.length; i++) {
                    var robot = GridService.robots[i];
                    if (this.player.hasSamePositionAs(robot)) {
                        this.player.isAlive = false;
                        this.gameOver = true;
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

        this.grid = GridService.grid;
        this.player = GridService.player;
        this.gameSize = gameSize;
        this.cellSize = cellSize;
        this.gameWidth = (gameSize.x + 1) * cellSize;
        this.gameHeight = (gameSize.y + 1) * cellSize;
        this.teleports = 0;
        
        this.reinit = function () {
            this.gameOver = false;
            this.win = false;
            this.teleports = 3;
        };

        this.newGame = function () {
            GridService.prepareNewGame();
            this.reinit();
        };

        this.robotAt = function (x, y) {
            return GridService.robotAt(x, y);
        };

        this.isValidCellSelection = function (cell) {
            return GridService.isValidCellSelection(cell);
        };

        this.movePlayer = function (vector) {
            this.player.move(vector);
            updateBoard.call(this);
        };

        this.teleportPlayer = function () {
            if (this.teleports < 1) return;

            var x = this.player.x,
                y = this.player.y;

            do {
                GridService.positionPlayer();
            }
            while (this.player.x === x && this.player.y === y);

            updateBoard.call(this);

            this.teleports -= 1;
        };

        this.robotsRemaining = function () {
            var count = 0,
                robots = GridService.robots;
            for (var i = 0; i < robots.length; i++) {
                if (robots[i].isAlive) {
                    count++;
                }
            }

            return count;
        }
    });