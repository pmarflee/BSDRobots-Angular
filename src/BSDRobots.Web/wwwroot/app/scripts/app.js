(function () {
    'use strict';

    angular
        .module('robotsApp', ['Game', 'Grid', 'ngAnimate'])
        .config(function (GridServiceProvider) {
            GridServiceProvider.setSize(55, 31);
        })
        .controller('RobotsController', function ($scope, GameManager) {
            this.game = GameManager;

            this.newGame = function () {
                this.game.newGame();
                this.startGame();
            };

            this.startGame = function () {
                var self = this;
            };

            $scope.cellClicked = function () {
                alert('clicked!');
            };

            this.newGame();
        });
})();