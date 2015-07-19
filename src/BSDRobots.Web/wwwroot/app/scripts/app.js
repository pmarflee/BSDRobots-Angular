(function () {
    'use strict';

    angular
        .module('robotsApp', ['Game', 'Grid', 'ngAnimate'])
        .config(function (GridServiceProvider) {
            GridServiceProvider.setSize(55, 31);
        })
        .controller('RobotsController', function ($scope, $log, GameManager) {
            var ctrl = this;

            this.game = GameManager;

            this.newGame = function () {
                this.game.newGame();
                this.startGame();
            };

            this.startGame = function () {
            };

            this.movePlayer = function (cell) {
                this.game.movePlayer(cell);
            }

            $scope.movePlayer = function (vector) {
                $log.debug('Move player. Vector (' + vector.x + ',' + vector.y + ')');
                this.ctrl.movePlayer(vector);
            };

            this.newGame();
        });
})();