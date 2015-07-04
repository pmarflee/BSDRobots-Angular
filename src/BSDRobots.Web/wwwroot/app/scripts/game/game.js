'use strict';

angular
    .module('Game', ['Grid'])
    .service('GameManager', function ($q, $timeout, GridService) {
        this.grid = GridService.grid;
        this.player = GridService.player;
        this.robots = GridService.robots;
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

        this.hasRobotAt = function (x, y) {
            return GridService.hasRobotAt(x, y);
        }

        this.move = function () {

        };
    });