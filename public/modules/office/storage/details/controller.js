myApp.registerCtrl("storage_details_controller", [
  "storage_details_service",
  "$q",
  "$rootScope",
  "$scope",
  function (storage_details_service, $q, $rootScope, $scope) {
    /**declare variable */
    const _statusValueSet = [
      { name: "storage", action: "loadDetail" },
      { name: "storage", action: "handling" },
    ];
    var ctrl = this;

    const getCode = () => {
      const matches = $rootScope.currentPath.match(/\/storage\/(.*)/);
      return matches ? matches[1] : null;
    };

    ctrl.code = getCode();

    /** init variable */
    {
      ctrl._ctrlName = "storage_details_controller";
      ctrl.viewModes = {
        DETAILS: "Details",
        REFERENCE: "Reference",
      };
      ctrl.viewMode = ctrl.viewModes.DETAILS;
      ctrl.viewItem = undefined;
      $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
    }

    ctrl.setView = function (mode, item) {
      ctrl.viewMode = mode;
      ctrl.viewItem = item;
    };

    /**show Infomation Details*/
    function loadDetail_service() {
      var dfd = $q.defer();
      storage_details_service.load_details(ctrl.thisId, ctrl.code).then(
        function (res) {
          ctrl.Item = res.data;
          console.log(ctrl.Item);
          ctrl.thisId = ctrl.Item._id;
          ctrl.breadcrumb = [
            ...(ctrl.Item.parents || []).reverse(),
            { object: "briefcase", code: ctrl.Item.code },
          ];
          dfd.resolve(true);
          res = undefined;
          dfd = undefined;
        },
        function (err) {
          if (err.status === 403) {
            $rootScope.urlPage = urlNotPermissionPage;
          } else {
            $rootScope.urlPage = urlNotFoundPage;
          }
          dfd.reject(err);
          err = undefined;
        }
      );
      return dfd.promise;
    }

    ctrl.loadDetail = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "storage",
        "loadDetail",
        loadDetail_service
      );
    };

    function init() {
      ctrl.loadDetail();
    }

    if (ctrl.code) {
      init();
    } else if (
      $rootScope.detailsInfo.url &&
      $rootScope.detailsInfo.route === "briefcase-details"
    ) {
      ctrl.thisId = $rootScope.detailsInfo.url.split("?")[1];
      if (!ctrl.thisId || ctrl.thisId.length !== 24) {
        $rootScope.detailsInfo.urlPage = urlNotFoundPage;
      } else {
        init();
      }
    } else {
      ctrl.thisId = $rootScope.currentPath.split("?")[1];
      if (!ctrl.thisId || ctrl.thisId.length !== 24) {
        $rootScope.urlPage = urlNotFoundPage;
      } else {
        init();
      }
    }

    $scope.$watch(getCode, function (newVal) {
      if (newVal && newVal !== ctrl.code) {
        ctrl.code = newVal;
        init();
      }
    });
  },
]);
