myApp.compileProvider.directive("briefcaseInfo", function () {
    return {
        restrict: "E",
        templateUrl:
            FrontendDomain +
            "/modules/office/briefcase/directives/briefcase_info.html",
        scope: {
            item: "<",
        },
        controller: [
            "$scope",
            function ($scope) {
            },
        ],
    };
});
