myApp.registerCtrl('da_details_controller', ['$rootScope', '$scope','$location', function ($rootScope, $scope,$location) {
    var ctrl = this;

    const getCode = () =>{
        return $location.search().code;
    };

    ctrl.code = getCode();

    ctrl.setBreadcrumb = function name(breadcrumb) {
        ctrl.breadcrumb = breadcrumb;
    }

    if (!ctrl.code) {
        if ($rootScope.detailsInfo.url && $rootScope.detailsInfo.route==='da-details') {
            ctrl.thisId = $rootScope.detailsInfo.url.split("?")[1];
            if (!ctrl.thisId || ctrl.thisId.length !==24){
                $rootScope.detailsInfo.urlPage = urlNotFoundPage;
            }
        } else {
            ctrl.thisId = $rootScope.currentPath.split("?")[1];
            if (!ctrl.thisId || ctrl.thisId.length !==24) {
                $rootScope.urlPage = urlNotFoundPage;
            }
        }
    }

    $scope.$watch(getCode, function (newVal) {
        if (newVal && newVal !== ctrl.code) {
            ctrl.code = newVal;
        }
    });
}]);