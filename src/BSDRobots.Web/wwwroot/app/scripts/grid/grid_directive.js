'use strict';

angular.module('Grid')
.directive('grid', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            onMovePlayer: '&',
            ngModel: '='
        },
        templateUrl: '/app/scripts/grid/grid.html',
        link: function (scope, elem, attrs) {
            var isValidCellSelection = scope.ngModel.isValidCellSelection;

            scope.cellClicked = function () {
                var cellSelectionResult = isValidCellSelection(this.cell);
                if (cellSelectionResult.isValid) {
                    scope.onMovePlayer({ vector: cellSelectionResult.vector });
                }
            }

            scope.isValidCellSelection = function () {
                return isValidCellSelection(this.cell).isValid;
            }
        }
    };
});