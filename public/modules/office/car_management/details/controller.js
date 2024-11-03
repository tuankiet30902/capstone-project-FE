myApp.registerCtrl('car_registration_details_controller', ['$location', 'car_registration_details_service', '$q', '$rootScope', '$scope', function ($location, car_registration_details_service, $q, $rootScope, $scope) {
    /**declare variable */
    const _statusValueSet = [
        { name: "CarRegistration", action: "loadDetail" },
    ];
    var ctrl = this;
    /** init variable */
    {
        ctrl._ctrlName = "car_registration_details_controller";
        ctrl.location_config = {
          master_key: "location_list",
          load_details_column: "value",
        };
        
        ctrl.vehicle_list_config = {
          master_key: "vehicle_list",
          load_details_column: "value",
        };

        ctrl.card_list_config = {
            master_key: "card_list",
            load_details_column: "value",
        };
        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
    }

    /**show Infomation Details*/
    const getCode = () => {
        let code = $location.search().code;
        if(code){ return code;}
        if ($rootScope.detailsInfo.url && $rootScope.detailsInfo.route === 'car-registration-details') {
            let temp = $rootScope.detailsInfo.url.split("?")[1];
            if(temp.indexOf("code")!==-1){
                code = temp.split("=")[1];
                return code;
            }
        }
        return undefined;
      };

    ctrl.code = getCode();
    ctrl.Item = {};

    ctrl.load_detail = function(){
      return $rootScope.statusValue.execute(ctrl._ctrlName, "CarRegistration", "loadDetail", load_detail_service);
    }

    function load_detail_service(){
      let dfd = $q.defer();
      const code = ctrl.code;
      car_registration_details_service.loadDetail(code)
        .then(
          function (res) {
            dfd.resolve(true);
            ctrl.Item = res.data[0];
          },
          function (err) {
            //
          }
        );
      return dfd.promise;
    }

    ctrl.load_file_info = function (params) {
        return function () {
            var dfd = $q.defer();
            car_registration_details_service.load_file_info(params.id, params.name).then(function (res) {
                dfd.resolve({
                    display: res.data.display,
                    embedUrl: res.data.url,
                    guid: res.data.guid
                });
                res = undefined;
                dfd = undefined;
            }, function (err) {
            });
            return dfd.promise;
        }
    }

    function init() {
      var dfdAr = [];
      dfdAr.push(ctrl.load_detail());
      $q.all(dfdAr).then(
        function () {
          ctrl._notyetInit = false;
        },
        function (err) {
          console.log(err);
          err = undefined;
        }
      );
    }
  
    
    $scope.$watch(getCode, function (newVal) {
        if (newVal && newVal !== ctrl.code) {
            ctrl.code = newVal;
            init();
        }
    });
    
      init();
}]);
