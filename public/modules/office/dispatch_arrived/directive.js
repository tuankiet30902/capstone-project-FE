myApp.compileProvider.directive("dispatchArrivedDetails", function () {
    return {
        restrict: "E",
        templateUrl:
            FrontendDomain +
            "/modules/office/dispatch_arrived/directives/dispatch_arrived_details.html",
        scope: {
            itemId: "<",
            itemCode: "<",
            setBreadcrumb: "&",
        },
        controller: [
            "da_details_service",
            "dispatch_arrived_service",
            "$q",
            "$scope",
            "$rootScope",
            "$filter",
            function (da_details_service, dispatch_arrived_service, $q, $scope, $rootScope, $filter) {
                /**declare variable */
                const _statusValueSet = [
                    { name: "DA", action: "loadDetails" },
                    { name: "DA", action: "handling" },
                    { name: "DA", action: "forward" },
                    { name: "DA", action: "response" },
                    { name: "DA", action: "update" },
                    { name: "DA", action: "getNumber" },
                    { name: "Task", action: "loadDetails" },
                    { name: "Notify", action: "insert" },
                ];
                var ctrl = $scope.ctrl = this;

                /** init variable */
                {
                    ctrl._ctrlName = "da_details_controller";

                    ctrl.statusList = [
                        {
                            title: "All",
                        },
                        {
                            title: "Processing",
                        },
                        {
                            title: "Completed",
                        },
                        {
                            title: "NotStartedYet",
                        },
                        {
                            title: "Done",
                        },
                    ];

                    ctrl.IncommingDispatchBook_Config = {
                        master_key: "incomming_dispatch_book",
                        load_details_column: "value",
                    };

                    ctrl.IncommingDispatchPririoty_Config = {
                        master_key: "incomming_dispatch_priority",
                        load_details_column: "value",
                    };

                    ctrl.MethodOfSendingDispatchTo_Config = {
                        master_key: "method_of_sending_dispatch_to",
                        load_details_column: "value",
                    };

                    ctrl.KindOfDispatchTo_Config = {
                        master_key: "kind_of_dispatch_to",
                        load_details_column: "value",
                    };

                    ctrl.TaskPriority = {
                        master_key: "task_priority",
                        load_details_column: "value",
                    };

                    ctrl.forward = [];
                    ctrl.Departments = [];
                    ctrl.Item = {};
                    ctrl.status = "see";
                    ctrl.comment = "";
                    ctrl.commentSignKnowledge = "";
                    ctrl.Type = [
                        {
                            title: {
                                "vi-VN": "Một người duyệt cho tất cả",
                                "en-US": "One for all",
                            },
                            key: "one",
                        },
                        {
                            title: {
                                "vi-VN": "Đồng thuận",
                                "en-US": "All Approval",
                            },
                            key: "all",
                        },
                    ];

                    ctrl.task = {};
                    ctrl._update_value = {};
                    ctrl._forward_value = {};

                    $rootScope.statusValue.generateSet(
                        ctrl._ctrlName,
                        _statusValueSet
                    );

                    ctrl._urlUpdateModal =
                        FrontendDomain +
                        "/modules/office/dispatch_arrived/views/update_modal.html";
                }



                ctrl.loadEmployee = function (params) {
                    var dfd = $q.defer();
                    da_details_service.loadEmployee(params.id).then(
                        function (res) {
                            dfd.resolve(res.data);
                        },
                        function () {
                            dfd.reject(false);
                            err = undefined;
                        }
                    );
                    return dfd.promise;
                };

                ctrl.loadEmployee_task = function (params) {
                    var dfd = $q.defer();
                    da_details_service.loadEmployee_task(params.id).then(
                        function (res) {
                            dfd.resolve(res.data);
                        },
                        function () {
                            dfd.reject(false);
                            err = undefined;
                        }
                    );
                    return dfd.promise;
                };

                ctrl.loadfile = function (params) {
                    return function () {
                        var dfd = $q.defer();
                        da_details_service
                            .loadFileInfo(params.id, params.name)
                            .then(
                                function (res) {
                                    dfd.resolve({
                                        display: res.data.display,
                                        embedUrl: res.data.url,
                                        guid: res.data.guid,
                                    });
                                    res = undefined;
                                    dfd = undefined;
                                },
                                function () {}
                            );
                        return dfd.promise;
                    };
                };
                /**show Infomation Details*/

                function loadDetails_service() {
                    var dfd = $q.defer();
                    da_details_service.loadDetails(ctrl.thisId, ctrl.code).then(
                        function (res) {
                            ctrl.Item = res.data;
                            ctrl.thisId = ctrl.Item._id;
                            $scope.setBreadcrumb && $scope.setBreadcrumb({
                                params: [
                                    ...(ctrl.Item.parents || []).reverse(),
                                    { object: 'dispatch_arrived', code: ctrl.Item.code },
                                ]
                            });
                            ctrl.Item.excerpt = removeHtmlTags(ctrl.Item.excerpt);
                            // TODO: Check if the user is the handler
                            if (
                                ctrl.Item.handler && ctrl.Item.handler.indexOf(
                                    $rootScope.logininfo.username
                                ) !== -1
                            ) {
                                ctrl.status = "handling";
                            }
                            ctrl.noteSignKnowledge = "";
                            ctrl.tasks = res.data.tasks;

                            ctrl.tasks.forEach(task => {
                                task.showLink = ctrl.checkRuleToTaskDetails(task);
                            });

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

                function removeHtmlTags(str) {
                    return str.replace(/<\/?[^>]+(>|$)/g, "");
                }
                
                ctrl.checkRuleToTaskDetails = function(task) {
                    if (
                        task.username === $rootScope.logininfo.data.username &&
                        task.department.id === $rootScope.logininfo.data.department
                      ) {
                        return true;
                      }
                    if (task.main_person.indexOf($rootScope.logininfo.username) !== -1
                        || task.participant.indexOf($rootScope.logininfo.username) !== -1
                        || task.observer.indexOf($rootScope.logininfo.username) !== -1) {
                            return true;
                        }

                    const editTaskDepartmentRule = $rootScope.logininfo.data.rule.find(rule => rule.rule === 'Office.Task.View_Task_Department');
                    if (editTaskDepartmentRule) {
                        switch (editTaskDepartmentRule.details.type) {
                            case "All":
                                return true;
                            case "NotAllow":
                                return false;
                            case "Specific":
                                if(editTaskDepartmentRule.details.department.indexOf(task.department) === 1) {
                                    return true;
                                }else{
                                    return false;
                                }
                            case "Working":
                                if(task.department.id === $rootScope.logininfo.data.department){
                                    return true;
                                }
                                else{
                                    return false;
                                }
                        }
                    }
                           
                };
                
                ctrl.loadDetails = function () {
                    return $rootScope.statusValue.execute(
                        ctrl._ctrlName,
                        "DA",
                        "loadDetails",
                        loadDetails_service
                    );
                };

                function init() {
                    ctrl.loadDetails();
                }

                $scope.$watch("itemId", (val) => {
                    if (val) {
                        ctrl.thisId = val;
                        init();
                    }
                });

                $scope.$watch("itemCode", (val) => {
                    if (val) {
                        ctrl.code = val;
                        init();
                    }
                });

                /** Forward */
                function forward_service(to) {
                    var dfd = $q.defer();
                    dispatch_arrived_service.forward(ctrl.thisId, to, ctrl._forward_value.note)
                        .then(
                            function () {
                                ctrl._forward_value.note = "";
                                ctrl.loadDetails();
                                dfd.resolve(true);
                            },
                            function (err) {
                                dfd.reject(err);
                            }
                        );
                    return dfd.promise;
                }

                ctrl.forward = function (to) {
                    return $rootScope.statusValue.execute(
                        ctrl._ctrlName,
                        "DA",
                        "forward",
                        () => forward_service(to)
                    );
                };

                ctrl.forwardToHeadOfDepartment = function () {
                    return ctrl.forward('HeadOfDepartment');
                };

                ctrl.forwardToBoardOfDirectors = function () {
                    return ctrl.forward('BoardOfDirectors');
                };

                ctrl.forwardToDepartments = function () {
                    return ctrl.forward('Departments');
                };

                ctrl.isWaitingForAccept = function () {
                    return (ctrl.Item.tasks || []).some(task =>
                        task.department.id === $rootScope.logininfo.data.department &&
                        task.status === 'WaitingForAccept'
                    );
                };

                ctrl.isWaitingForRead = function () {
                    return (ctrl.Item.view_only_departments || []).some(department =>
                        department.department.id === $rootScope.logininfo.data.department &&
                        department.status === 'Unread'
                    );
                };

                function response_service(type) {
                    var dfd = $q.defer();
                    dispatch_arrived_service
                        .response(ctrl.thisId, type, ctrl._forward_value.note)
                        .then(
                            function () {
                                ctrl._forward_value.note = "";
                                ctrl.loadDetails();
                                dfd.resolve(true);
                            },
                            function (err) {
                                dfd.reject(err);
                            }
                        );
                    return dfd.promise;
                }

                ctrl.response = function (type) {
                    return $rootScope.statusValue.execute(ctrl._ctrlName, "DA", "response", () => response_service(type));
                }

                ctrl.accept = function () {
                    return ctrl.response('Accept');
                }

                ctrl.reject = function () {
                    return ctrl.response('Reject');
                }

                ctrl.markAsRead = function () {
                    return ctrl.response('Read');
                }

                ctrl.handleUpdateSuccess = function () {
                    console.log('handleUpdateSuccess');
                    ctrl.loadDetails();
                };

                $(document).on(
                    "hide.bs.modal",
                    "#modal_DA_Dir_Update",
                    function (e) {
                        if (e.target.id == "modal_DA_Dir_Update") {
                            init();
                        }
                    }
                );
            },
        ],
    };
});

myApp.compileProvider.directive("dispatchArrivedUpdate", function () {
    return {
        restrict: "E",
        templateUrl:
            FrontendDomain +
            "/modules/office/dispatch_arrived/directives/dispatch_arrived_update.html",
        scope: {
            item: "<",
            handleSuccessFunc: "&",
            insertDispatchArrivedId: '<',
            insertCurrentProject: '<',
            draft: '<',
            target: '@',
            noCommit: '<',
            initValue: '<',
            parentItem:"<",
            parentType:"<"
        },
        controller: [
            "dispatch_arrived_service",
            "task_service",
            "$q",
            "$scope",
            "$rootScope",
            "$filter",
            function (dispatch_arrived_service, task_service, $q, $scope, $rootScope, $filter) {
                /**declare variable */
                const _statusValueSet = [
                    { name: "DA", action: "getNumber" },
                    { name: "DA", action: "update" },
                    { name: "DA", action: "pushFile" },
                    { name: "DA", action: "removeFile" },
                    { name: "Task", action: "delete" },
                    { name: "Task", action: "insert" },
                    { name: "Task", action: "update" }
                ];
                var ctrl = ($scope.ctrl = this);
                var idEditor = "updateTask_content";
                /** init variable */
                {
                    ctrl._ctrlName = "da_update_controller";
                    ctrl._update_value = {};
                    ctrl._update_tasks = [];
                    ctrl._task_value =[];
                    
                    ctrl.IncommingDispatchBook_Config = {
                        master_key: "incomming_dispatch_book",
                        load_details_column: "value",
                    };

                    ctrl.KindOfDispatchTo_Config = {
                        master_key: "kind_of_dispatch_to",
                        load_details_column: "value",
                    };

                    ctrl.IncommingDispatchPririoty_Config = {
                        master_key: "incomming_dispatch_priority",
                        load_details_column: "value",
                    };
                    ctrl.TaskPriority = {
                        master_key: "task_priority",
                        load_details_column: "value"
                    };
                    ctrl.TaskType = {
                        master_key: "task_type",
                        load_details_column: "value"
                    };

                    ctrl._urlDeleteTaskModal = FrontendDomain + "/modules/office/dispatch_arrived/views/delete_task_modal.html";

                    $rootScope.statusValue.generateSet(
                        ctrl._ctrlName,
                        _statusValueSet
                    );
                }

                ctrl.prepareUpdate = function () {
                    $rootScope.statusValue.generate(
                        ctrl._ctrlName,
                        "DA",
                        "update"
                    );
                    ctrl._update_value = angular.copy($scope.item);             
                    ctrl._update_value.view_only_departments = ($scope.item.view_only_departments || []).map(department => department.department.id);
                    ctrl._update_value.files = ($scope.item.attachments || []).map((attachment) => ({
                        origName: attachment.name,
                        name: attachment.display,
                    }));
                    if (ctrl._update_value.is_assign_task){
                        ctrl._task_value = $scope.item.tasks[0] || [];
                        const priority = dispatch_arrived_service.taskPriorityTransform(ctrl._task_value.priority);
                        ctrl._task_value._filterTaskPriority = priority.value;
                        const taskType = task_service.taskTypeTransform(ctrl._task_value.task_type);
                        ctrl._task_value._filterTaskType = taskType.value;
                        $("#" + idEditor).summernote('code',ctrl._task_value.content);
                    }
                };

                ctrl.pickDAB_update = function (val) {
                    ctrl._update_value.da_book = val.value;
                    $rootScope.statusValue.execute(ctrl._ctrlName, "DA", "getNumber", getNumber(ctrl._update_value.da_book));
                };

                ctrl.chooseReleaseDate_update = function (val) {
                    ctrl._update_value.release_date = val.getTime();
                };
    
                ctrl.chooseTransferDate_update = function (val) {
                    ctrl._update_value.transfer_date = val.getTime();
                };

                ctrl.pickDAT_update = function (val) {
                    ctrl._update_value.type = val.value;
                };

                ctrl.choosePriority_update = function (val) {
                    ctrl._update_value.priority = val.value;
                };

                ctrl.removeFile_update = function (item) {
                    ctrl._update_value.files = ctrl._update_value.files.filter((file) => file.name !== item.name);
                }

                ctrl.pickViewOnlyDepartment_update = function(val){
                    ctrl._update_value.view_only_departments = angular.copy(val);
                };
                ctrl.pickLabel_update = function (value) {
                    ctrl._task_value.label = value;
                }
            
                ctrl.loadLabel = function ({search, top, offset, sort}) {
                    var dfd = $q.defer();
                    dispatch_arrived_service.load_label(search, top, offset, sort).then(function (res) {
                        dfd.resolve(res.data);
                        dfd = undefined;
                    }, function (err) {
                        dfd.reject(err);
                        err = undefined;
                    });
                    return dfd.promise;
                }
                ctrl.loadLabel_details = function ({ids}) {
                    var dfd = $q.defer();
                    dispatch_arrived_service.loadLabel_details(ids).then(function (res) {
                        dfd.resolve(res.data);
                        dfd = undefined;
                    }, function (err) {
                        dfd.reject(err);
                        err = undefined;
                    });
                    return dfd.promise;
                }
                ctrl.addCheckList_insert = function () {
                    var d = new Date();
                    ctrl._task_value.task_list.push({
                        title: "",
                        status: false,
                        id: d.getTime().toString()
                    });
                    ctrl._task_value.focusChecklist = d.getTime().toString();
                }
                ctrl.chooseFromDate_insert = function (val) {
                    ctrl._task_value.from_date = val ? val.getTime() : undefined;;
                }
                ctrl.chooseToDate_insert = function (val) {
                    ctrl._task_value.to_date = val ? val.getTime() : undefined;;
                }
                ctrl.chooseDepartment_insert = function (val) {
                    ctrl._task_value.currentDepartment_orig = val;
                    ctrl._task_value.currentDepartment = val.id;
                }
                ctrl.chooseTaskPriority = function (val) {
                    const priority = dispatch_arrived_service.taskPriorityTransform(val.value);
                    ctrl._task_value.priority = priority.key;
                    ctrl._task_value._filterTaskPriority = priority.value;
                }
                
                ctrl.chooseTaskType = function (val) {
                    const taskType = task_service.taskTypeTransform(val.value);
                    ctrl._task_value.task_type = taskType.key;
                    ctrl._task_value._filterTaskType = taskType.value;
                }
                ctrl.addCheckList_insert = function () {
                    var d = new Date();
                    ctrl._task_value.task_list.push({
                        title: "",
                        status: false,
                        id: d.getTime().toString()
                    });
                    ctrl._task_value.focusChecklist = d.getTime().toString();
                }
                ctrl.removeCheckList_insert = function (id) {
                    ctrl._task_value.task_list = ctrl._task_value.task_list.filter(e => e.id !== id);
                }
                ctrl.removeFile_insert = function (item) {
                    ctrl._task_value.attachment = ctrl._task_value.attachment.filter(e => e.name !== item.name);
                };
                $scope.$watch(function() {
                    $("#" + idEditor).summernote({
                        placeholder: $filter("l")("InputContentHere"),
                        callbacks: {
                            onImageUpload: function (image) {
                                var formData = new FormData();
                                formData.append('type', "image");
                                formData.append('file', image[0], image[0].name);
                                task_service.uploadImage(formData).then(function (res) {
                                    var thisImage = $('<img>').attr('src', res.data.data);
                                    $("#" + idEditor).summernote('insertNode', thisImage[0]);
                                }, function (err) {
                                })
                            }
                        }
                    });
                    return ctrl._update_value.is_assign_task;
                  }, function(newValue) {
                    if (ctrl._task_value.length === 0) {
                        var today = new Date();
                        var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
                        var endDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
                        $("#" + idEditor).summernote('code', '');
                        ctrl._task_value = {
                            files: [],
                            title: "",
                            task_list: [],
                            main_person: [],
                            participant: [],
                            observer: [],
                            department: "",
                            from_date: myToday.getTime(),
                            to_date: endDay.getTime(),
                            has_time: false,
                            hours: 0,
                            priority: 1,
                            head_task_id: $scope.insertHeadTaskId,
                            currentDepartment:"",
                            dispatch_arrived_id:ctrl._update_value._id ,
                            currentDepartment_orig: [],
                            level: 'Task',
                            label: []
                        };
                        ctrl.selectedTask = null; // Clear the selected task
                        ctrl.initValue = false; 
                    }
                  });

                function update_service() {
                    // unchanged files
                    const keep_files = ctrl._update_value.files
                        .filter((file) => !file.file)
                        .map((file) => ({ name: file.origName }));
                    // new files
                    const files = ctrl._update_value.files.filter((file) => !!file.file);

                    var dfd = $q.defer();
                    if(ctrl._update_value.is_assign_task){
                        if (ctrl._task_value._id == null){
                            insert_service();
                        }
                        else {
                            update_task_service();
                        }
                        
                    } else {
                        task_service.delete( ctrl._task_value._id).then(function (){
                            ctrl._task_value = [];
                        });
                    }
                    dispatch_arrived_service.update(
                        $scope.item._id,
                        keep_files,
                        files,
                        ctrl._update_value.code,
                        ctrl._update_value.da_book,
                        ctrl._update_value.number,
                        ctrl._update_value.release_date,
                        ctrl._update_value.author,
                        ctrl._update_value.agency_promulgate,
                        ctrl._update_value.transfer_date,
                        ctrl._update_value.note,
                        ctrl._update_value.type,
                        ctrl._update_value.priority,
                        ctrl._update_value.is_legal,
                        ctrl._update_value.excerpt,
                        ctrl._update_value.view_only_departments,
                        ctrl._update_value.is_assign_task
                    )
                    .then(function () {
                        $("#modal_DA_Dir_Update").modal("hide");
                        dfd.resolve(true);
                        dfd = undefined;
                    }, function (err) {
                        dfd.reject(err);
                        err = undefined;
                    });
                    return dfd.promise;
                }

                ctrl.update = function () {
                    return $rootScope.statusValue.execute(ctrl._ctrlName, "DA", "update", update_service);
                }
                function insert_service() {
                    var dfd = $q.defer();
                    let parent={};
                    let parents=[];
                    parent.id =  ctrl._update_value._id;
                    parent.object = "dispatch_arrived";
                    parent.code = ctrl._update_value.code;   
                    let department = "";
                    if(typeof ctrl._task_value.currentDepartment ==="object"){
                        department = ctrl._task_value.currentDepartment.id;
                    }else{
                        department = ctrl._task_value.currentDepartment;
                    }
                    ctrl._task_value.dispatch_arrived_id = ctrl._update_value._id;
                    task_service.insert(
                        ctrl._task_value.attachment,
                        ctrl._task_value.title,
                        $("#" + idEditor).summernote('code'),
                        ctrl._task_value.task_list,
                        [],
                        [],
                        [],
                        ctrl._task_value.from_date,
                        ctrl._task_value.to_date,
                        ctrl._task_value.has_time,
                        ctrl._task_value.hours,
                        ctrl._task_value.priority,
                        ctrl._task_value.task_type,
                        ctrl._task_value.head_task_id,
                        ctrl._parentID,
                        ctrl._task_value.currentProject,
                        department,
                        ctrl._task_value.dispatch_arrived_id,
                        ctrl._task_value.level,
                        ctrl._task_value.label,
                        $scope.draft,
                        parents,
                        parent
                    ).then(function (res) {
                        dfd.resolve(true);
                        dfd = undefined;
                        ctrl._update_tasks.push({
                            ...res.data,
                            currentDepartment_orig: res.data.department,
                        });
                    }, function (err) {
                        dfd.reject(err);
                        err = undefined;
                    });
                    return dfd.promise;
                }

                function update_task_service() {
                    const dispatch_arrived_id = ctrl._update_value._id;
                    var dfd = $q.defer();
                    task_service.update(
                        ctrl._task_value._id,
                        ctrl._task_value.title,
                        $("#" + idEditor).summernote('code'),
                        ctrl._task_value.task_list,
                        ctrl._task_value.main_person,
                        ctrl._task_value.participant,
                        ctrl._task_value.observer,
                        ctrl._task_value.from_date,
                        ctrl._task_value.to_date,
                        ctrl._task_value.status,
                        ctrl._task_value.has_time,
                        task_service.taskPriorityTransform(ctrl._task_value.priority).key,
                        (task_service.taskTypeTransform(ctrl._task_value.task_type) || {}).key,
                        (ctrl._task_value.workflowPlay_id || ''),
                        ctrl._task_value.label,
                        dispatch_arrived_id,
                        ctrl._task_value.currentDepartment,
                    ).then(function (res) {
                        dfd.resolve(true);
                        dfd = undefined;
                        $scope.handleSuccessFunc({ params: {
                            resData: res.data,
                        }});
                    }, function (err) {
                        dfd.reject(err);
                        err = undefined;
                    });
                    return dfd.promise;
                }

                ctrl.insert = function () {
                    return $rootScope.statusValue.execute(ctrl._ctrlName, "Task", "insert", insert_service);
                }
                $(document).on(
                    "show.bs.modal",
                    "#modal_DA_Dir_Update",
                    function (e) {
                        if (e.target.id == "modal_DA_Dir_Update") {
                            $scope.$apply(function () {
                                ctrl.prepareUpdate();
                            });
                        }
                    }
                );
            },
        ],
    };
});
