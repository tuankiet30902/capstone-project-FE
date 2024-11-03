myApp.registerCtrl('notify_details_controller', ['$location', 'notify_details_service', '$q', '$rootScope', '$scope', function ($location, notify_details_service, $q, $rootScope, $scope) {
    /**declare variable */
    const _statusValueSet = [
        { name: "Notify", action: "load_details" },
        { name: "Notify", action: "approval" },
        { name: "Notify", action: "reject" },
        { name: "Notify", action: "like" },
        { name: "Notify", action: "unlike" }
    ];
    var ctrl = this;
    /** init variable */
    {
        ctrl._ctrlName = "notify_details_controller";
        ctrl.tab = 'content';
        ctrl.comment = "";
        ctrl.Item = {};
        ctrl.NotifyGroup_Config = {
            master_key: "notify_group",
            load_details_column: "value"
        };
        
        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
    }



    /**show Infomation Details*/
    const getCode = () => {
        let code = $location.search().code;
        if(code){ return code;}
        if ($rootScope.detailsInfo.url && $rootScope.detailsInfo.route === 'notify-details') {
            let temp = $rootScope.detailsInfo.url.split("?")[1];
            if(temp.indexOf("code")!==-1){
                code = temp.split("=")[1];
                return code;
            }
        }
        return undefined;
      };

    ctrl.code = getCode();

    function load_details_service() {
        var dfd = $q.defer();
        notify_details_service.load_details(ctrl.code).then(function (res) {
            ctrl.Item = res.data;
            ctrl.thisId = res.data._id;
            var check = true;
            if(ctrl.Item.username === $rootScope.logininfo.username || ctrl.Item.employee === $rootScope.logininfo.data.employee){
                check = false;
            }
            for(var i in ctrl.Item.event){
                if(ctrl.Item.event[i].username === $rootScope.logininfo.username 
                    && ctrl.Item.event[i].employee === $rootScope.logininfo.data.employee
                    && ctrl.Item.event[i].action ==='Seen'
                    ){
                        check = false;
                        break;
                    }
            }

            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }

    function reloadDetails_service() {
        var dfd = $q.defer();
        notify_details_service.reload_details(ctrl.thisId).then(function (res) {
            ctrl.Item = res.data;
            var check = true;
            if(ctrl.Item.username === $rootScope.logininfo.username || ctrl.Item.employee === $rootScope.logininfo.data.employee){
                check = false;
            }
            for(var i in ctrl.Item.event){
                if(ctrl.Item.event[i].username === $rootScope.logininfo.username 
                    && ctrl.Item.event[i].employee === $rootScope.logininfo.data.employee
                    && ctrl.Item.event[i].action ==='Seen'
                    ){
                        check = false;
                        break;
                    }
            }

            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }


    ctrl.load_file_info = function (params) {
        return function () {
            var dfd = $q.defer();
            notify_details_service.load_file_info(params.id, params.name).then(function (res) {
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

    ctrl.load_details = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Notify", "load_details", load_details_service);
    }

    ctrl.reload_details = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Notify", "load_details", reloadDetails_service);
    }

    ctrl.loadDepartment_details = function (params) {
        let dfd = $q.defer();
        notify_details_service.loadDepartment_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    /**approval */
    function approval_service() {
        var dfd = $q.defer();
        notify_details_service.approval(ctrl.thisId, ctrl.comment).then(function (res) {
            ctrl.status = "approved";
            ctrl.reload_details();
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }


    ctrl.approval = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Notify", "approval", approval_service);
    }

    function reject_service() {
        var dfd = $q.defer();
        notify_details_service.reject(ctrl.thisId, ctrl.comment).then(function (res) {
            ctrl.status = "rejected";
            ctrl.reload_details();
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }


    ctrl.reject = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Notify", "reject", reject_service);
    }

    function like_service() {
        var dfd = $q.defer();
        notify_details_service.like(ctrl.thisId).then(function (res) {
            ctrl.reload_details();
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }



    function unlike_service() {
        var dfd = $q.defer();
        notify_details_service.unlike(ctrl.thisId).then(function (res) {
            ctrl.reload_details();
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }


    ctrl.like = function (val) {
        val ? like_service() : unlike_service();
    }

    function init() {
        if (ctrl.code) {
            ctrl.load_details();
        }
    }
    
    init();
}]);