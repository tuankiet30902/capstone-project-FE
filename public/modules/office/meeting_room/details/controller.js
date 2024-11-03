myApp.registerCtrl('meeting_room_details_controller', ['$location', 'meeting_room_details_service', '$q', '$rootScope', '$scope', function ($location, meeting_room_details_service, $q, $rootScope, $scope) {
    /**declare variable */
    const _statusValueSet = [
        { name: "Registration", action: "loadDetail" },
    ];
    var ctrl = this;
    /** init variable */
    {
        ctrl._ctrlName = "meeting_room_details_controller";
        ctrl.NotifyGroup_Config = {
            master_key: "notify_group",
            load_details_column: "value"
        };
        ctrl.room_config = {
          master_key: "meeting_room",
          load_details_column: "value",
        };
        
        
        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
    }

    /**show Infomation Details*/
    const getId = () => {
        let code = $location.search().code;
        if(code){ return code;}
        if ($rootScope.detailsInfo.url && $rootScope.detailsInfo.route === 'meeting-room-details') {
            let temp = $rootScope.detailsInfo.url.split("?")[1];
            if(temp.indexOf("code")!==-1){
                code = temp.split("=")[1];
                return code;
            }
        }
        return undefined;
      };

    ctrl.id = getId();
    ctrl.Item = {};
    ctrl.load_detail= function(){
      return $rootScope.statusValue.execute(ctrl._ctrlName, "Registration", "loadDetail", load_detail_service);
    }

    ctrl.load_file_info = function (params) {
      return function () {
          var dfd = $q.defer();
          meeting_room_details_service.load_file_info(params.id, params.name).then(function (res) {
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

    function load_detail_service(){
      let dfd = $q.defer();
      meeting_room_details_service.loadDetail(ctrl.id).then(
          function (res) {
              ctrl.Item = res.data;
              dfd.resolve(true);
          },
          function () {
              dfd.reject(false);
              err = undefined;
          }
      );
      return dfd.promise;
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
  
    
      $scope.$watch(getId, function (newVal) {
        if (newVal && newVal !== ctrl.id) {
          ctrl.id = newVal;
          init();
        }
      });
    
      init();
}]);
