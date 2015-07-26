(function () {
    'use strict';

    angular
        .module('robotsApp', ['Game', 'Grid', 'ngAnimate', 'ui.bootstrap'])
        .config(function (GridServiceProvider) {
            GridServiceProvider.setSize(57, 33);
        })
        .controller('RobotsController', function ($scope, $log, GameManager) {
            var ctrl = this;

            this.game = GameManager;

            this.newGame = function () {
                this.game.newGame();
            };

            this.movePlayer = function (cell) {
                this.game.movePlayer(cell);
            }

            this.teleportPlayer = function () {
                this.game.teleportPlayer();
            };

            $scope.movePlayer = function (vector) {
                this.ctrl.movePlayer(vector);
            };

            this.newGame();
        });
})();