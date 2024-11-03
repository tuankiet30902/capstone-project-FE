myApp.registerCtrl("dispatch_arrived_controller", [
  "dispatch_arrived_service",
  "task_service",
  "$q",
  "$rootScope",
  "$filter",
  "$scope",
  function (
    dispatch_arrived_service,
    task_service,
    $q,
    $rootScope,
    $filter,
    $scope
  ) {
    /**declare variable */
    const _statusValueSet = [
      { name: "DA", action: "init" },
      { name: "DA", action: "load" },
      { name: "DA", action: "count" },
      { name: "DA", action: "countPending" },
      { name: "DA", action: "getNumber" },
      { name: "DA", action: "insert" },
      { name: "DA", action: "update" },
      { name: "DA", action: "delete" },
      { name: "Task", action: "delete" },
      { name: "Task", action: "insert" },
      { name: "Task", action: "update" },
    ];
    var ctrl = this;
    var idEditor = "insertTask_content";
    /** init variable */
    {
      ctrl._ctrlName = "dispatch_arrived_controller";
      ctrl.tab = "need_to_handle";
      ctrl.numberPending = 0;
      ctrl.currentPage = 1;
      ctrl.numOfItemPerPage = 30;
      ctrl.totalItems = 0;
      ctrl.offset = 0;
      ctrl.sort = { name: "_id", value: false, query: { _id: -1 } };
      ctrl.dispatch_arriveds = [];
      ctrl._insert_value = {};
      ctrl._insert_task_value = {};
      ctrl._udpate_task_value = {};
      ctrl._update_value = {};
      ctrl._insert_tasks = [];
      ctrl._filterTaskPriority = "";

      ctrl.Departments = [];
      ctrl._notyetInit = true;
      ctrl.initValue = false;

      ctrl._searchByKeyToFilterData = "";
      ctrl._filterDAB = "";
      ctrl._filterDAT = "";
      ctrl._filterPriority = "";
      ctrl._filterReceiveMethod = "";

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
      /** LOAD PRIORITY OPTIONS */
      ctrl.TaskPriority = {
        master_key: "task_priority",
        load_details_column: "value",
      };
      ctrl.TaskType = {
        master_key: "task_type",
        load_details_column: "value",
      };

      $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

      ctrl._urlInsertModal =
        FrontendDomain +
        "/modules/office/dispatch_arrived/views/insert_modal.html";
      ctrl._urlDeleteModal =
        FrontendDomain +
        "/modules/office/dispatch_arrived/views/delete_modal.html";
      ctrl._urlDeleteTaskModal =
        FrontendDomain +
        "/modules/office/dispatch_arrived/views/delete_task_modal.html";
    }

    /**function for logic */
    ctrl.chooseNumberItem = function (val) {
      ctrl.numOfItemPerPage = val;
      ctrl.refreshData();
    };

    ctrl.pickDAB = function (val) {
      ctrl._filterDAB = val.value;
      ctrl.refreshData();
    };

    ctrl.pickDAT = function (val) {
      ctrl._filterDAT = val.value;
      ctrl.refreshData();
    };

    ctrl.choosePriority = function (val) {
      ctrl._filterPriority = val.value;
      ctrl.refreshData();
    };

    ctrl.chooseReceiveMethod = function (val) {
      ctrl._filterReceiveMethod = val.value;
      ctrl.refreshData();
    };

    ctrl.switchTab = function (val) {
      ctrl.tab = val;
      ctrl.refreshData();
    };
    function resetPaginationInfo() {
      ctrl.currentPage = 1;
      ctrl.totalItems = 0;
      ctrl.offset = 0;
    }

    function generateFilter() {
      var obj = {};
      if (ctrl._searchByKeyToFilterData !== "") {
        obj.search = angular.copy(ctrl._searchByKeyToFilterData);
      }

      if (ctrl._filterDAB) {
        obj.da_book = angular.copy(ctrl._filterDAB);
      }

      if (ctrl._filterDAT) {
        obj.type = angular.copy(ctrl._filterDAT);
      }

      if (ctrl._filterPriority) {
        obj.priority = angular.copy(ctrl._filterPriority);
      }

      if (ctrl._filterReceiveMethod) {
        obj.receive_method = angular.copy(ctrl._filterReceiveMethod);
      }

      return obj;
    }

    ctrl.checkItem = function (params) {
      ctrl.checkIdAr = [];
      ctrl.checkAr = [];
      for (var i in ctrl.dispatch_arriveds) {
        if (ctrl.dispatch_arriveds[i]._id === params.params) {
          ctrl.dispatch_arriveds[i].check = params.value;
        }
        if (
          ctrl.dispatch_arriveds[i].check &&
          ctrl.dispatch_arriveds[i].status === "draft"
        ) {
          ctrl.checkIdAr.push(ctrl.dispatch_arriveds[i]._id);
          ctrl.checkAr.push(ctrl.dispatch_arriveds[i]);
        }
      }
      if (ctrl.checkIdAr.length === ctrl.dispatch_arriveds.length) {
        ctrl.checkAll = true;
      } else {
        ctrl.checkAll = false;
      }
    };

    ctrl.uncheckAllItem = function () {
      ctrl.checkIdAr = [];
      ctrl.checkAr = [];
      for (var i in ctrl.dispatch_arriveds) {
        ctrl.dispatch_arriveds[i].check = false;
      }
    };

    ctrl.checkAllItem = function (params) {
      ctrl.checkIdAr = [];
      ctrl.checkAr = [];
      for (var i in ctrl.dispatch_arriveds) {
        ctrl.dispatch_arriveds[i].check = params;
        if (
          ctrl.dispatch_arriveds[i].check &&
          ctrl.dispatch_arriveds[i].status === "draft"
        ) {
          ctrl.checkIdAr.push(ctrl.dispatch_arriveds[i]._id);
          ctrl.checkAr.push(ctrl.dispatch_arriveds[i]);
        }
      }
    };

    /* Init and load necessary resource to the module. */

    ctrl.loadPriority_details = function (params) {
      var dfd = $q.defer();
      for (var i in ctrl.Priority) {
        if (ctrl.Priority[i].key === params.id) {
          dfd.resolve(ctrl.Priority[i]);
          break;
        }
      }
      return dfd.promise;
    };

    ctrl.loadReceiveMethod_details = function (params) {
      var dfd = $q.defer();
      for (var i in ctrl.ReceiveMethod) {
        if (ctrl.ReceiveMethod[i].key === params.id) {
          dfd.resolve(ctrl.ReceiveMethod[i]);
          break;
        }
      }
      return dfd.promise;
    };

    function load_service() {
      var dfd = $q.defer();
      ctrl.dispatch_arriveds = [];
      ctrl.checkIdAr = [];
      let _filter = generateFilter();
      dispatch_arrived_service
        .load(
          _filter.search,
          _filter.da_book,
          _filter.priority,
          _filter.receive_method,
          _filter.type,
          ctrl.tab,
          ctrl.numOfItemPerPage,
          ctrl.offset,
          ctrl.sort.query
        )
        .then(
          function (res) {
            ctrl.dispatch_arriveds = res.data;
            ctrl.dispatch_arriveds.forEach(function (item) {
              if (item.excerpt) {
                item.excerpt = removeHtmlTags(item.excerpt);
              }
            });
            dfd.resolve(true);
          },
          function () {
            dfd.reject(false);
            err = undefined;
          }
        );
      return dfd.promise;
    }

    ctrl.handleTitleDA = function (item) {
      return `${item.typeDirectory[$rootScope.Language.current]} ${
        item.excerpt
      }`;
    };

    function removeHtmlTags(str) {
      return str.replace(/<\/?[^>]+(>|$)/g, "");
    }

    ctrl.load = function (val) {
      if (val != undefined) {
        ctrl.offset = angular.copy(val);
      }
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "DA",
        "load",
        load_service
      );
    };

    function count_service() {
      var dfd = $q.defer();
      var _filter = generateFilter();
      dispatch_arrived_service
        .count(
          _filter.search,
          _filter.da_book,
          _filter.priority,
          _filter.receive_method,
          _filter.type,
          ctrl.tab
        )
        .then(
          function (res) {
            ctrl.totalItems = res.data.count;
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
          },
          function (err) {
            dfd.reject(err);
            err = undefined;
          }
        );
      return dfd.promise;
    }

    ctrl.count = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "DA",
        "count",
        count_service
      );
    };

    function countPending_service() {
      var dfd = $q.defer();
      dispatch_arrived_service.countPending().then(
        function (res) {
          ctrl.numberPending = res.data.count;
          dfd.resolve(true);
          res = undefined;
          dfd = undefined;
        },
        function (err) {
          dfd.reject(err);
          err = undefined;
        }
      );
      return dfd.promise;
    }

    ctrl.countPending = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "DA",
        "countPending",
        countPending_service
      );
    };

    ctrl.refreshData = function () {
      var dfdAr = [];
      resetPaginationInfo();
      dfdAr.push(ctrl.load());
      dfdAr.push(ctrl.count());
      dfdAr.push(ctrl.countPending());
      $q.all(dfdAr);
    };

    function init() {
      var dfdAr = [];
      dfdAr.push(ctrl.load());
      dfdAr.push(ctrl.count());
      dfdAr.push(ctrl.countPending());
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
    init();

    /**load File */

    ctrl.loadfile = function (params) {
      return function () {
        var dfd = $q.defer();
        dispatch_arrived_service.loadFileInfo(params.id, params.name).then(
          function (res) {
            dfd.resolve({
              display: res.data.display,
              embedUrl: res.data.url,
              guid: res.data.guid,
            });
            res = undefined;
            dfd = undefined;
          },
          function (err) {}
        );
        return dfd.promise;
      };
    };

    /**insert */
    function getNumber(da_book) {
      return function () {
        var dfd = $q.defer();
        dispatch_arrived_service.get_number(da_book).then(
          function (res) {
            ctrl._insert_value.number = res.data.number;
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
          },
          function (err) {
            dfd.reject(err);
            err = undefined;
          }
        );
        return dfd.promise;
      };
    }

    ctrl.removeFile_insert = function (item) {
      var temp = [];
      for (var i in ctrl._insert_value.files) {
        if (ctrl._insert_value.files[i].name != item.name) {
          temp.push(ctrl._insert_value.files[i]);
        }
      }
      ctrl._insert_value.files = angular.copy(temp);
    };

    ctrl.pickDAB_insert = function (val) {
      ctrl._insert_value.da_book = val.value;
      $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "DA",
        "getNumber",
        getNumber(ctrl._insert_value.da_book)
      );
    };

    ctrl.pickDAT_insert = function (val) {
      ctrl._insert_value.type = val.value;
    };

    ctrl.choosePriority_insert = function (val) {
      ctrl._insert_value.priority = val.value;
    };

    ctrl.chooseReceiveMethod_insert = function (val) {
      ctrl._insert_value.receive_method = val.value;
    };

    ctrl.chooseTransferDate_insert = function (val) {
      ctrl._insert_value.transfer_date = val.getTime();
    };

    ctrl.pickViewOnlyDepartment_insert = function (val) {
      ctrl._insert_value.view_only_departments = angular.copy(val);
    };

    ctrl.chooseReleaseDate_insert = function (val) {
      ctrl._insert_value.release_date = val.getTime();
    };

    ctrl.chooseExpirationDate_insert = function (val) {
      if (val) {
        ctrl._insert_value.expiration_date = val.getTime();
      } else {
        ctrl._insert_value.expiration_date = undefined;
      }
    };

    ctrl.chooseBriefcase_startDate_insert = function (val) {
      if (val) {
        ctrl._insert_value.briefcase.start_date = val.getTime();
      } else {
        ctrl._insert_value.briefcase.start_date = undefined;
      }
    };

    ctrl.chooseBriefcase_endDate_insert = function (val) {
      if (val) {
        ctrl._insert_value.briefcase.end_date = val.getTime();
      } else {
        ctrl._insert_value.briefcase.end_date = undefined;
      }
    };

    ctrl.chooseFromDate_insert = function (val) {
      ctrl._insert_task_value.from_date = val ? val.getTime() : undefined;
    };
    ctrl.chooseToDate_insert = function (val) {
      ctrl._insert_task_value.to_date = val ? val.getTime() : undefined;
    };
    ctrl.chooseDepartment_insert = function (val) {
      ctrl._insert_task_value.currentDepartment_orig = val;
      ctrl._insert_task_value.currentDepartment = val.id;
    };
    ctrl.chooseTaskPriority = function (val) {
      const priority = dispatch_arrived_service.taskPriorityTransform(
        val.value
      );
      ctrl._insert_task_value.priority = priority.key;
      ctrl._insert_task_value._filterTaskPriority = priority.value;
    };

    ctrl.chooseTaskType = function (val) {
      const taskType = task_service.taskTypeTransform(val.value);
      ctrl._insert_task_value.task_type = taskType.key;
      ctrl._insert_task_value._filterTaskType = taskType.value;
    };
    ctrl.pickLabel_update = function (value) {
      ctrl._insert_task_value.label = value;
    };

    ctrl.loadLabel = function ({ search, top, offset, sort }) {
      var dfd = $q.defer();
      dispatch_arrived_service.load_label(search, top, offset, sort).then(
        function (res) {
          dfd.resolve(res.data);
          dfd = undefined;
        },
        function (err) {
          dfd.reject(err);
          err = undefined;
        }
      );
      return dfd.promise;
    };
    ctrl.loadLabel_details = function ({ ids }) {
      var dfd = $q.defer();
      dispatch_arrived_service.loadLabel_details(ids).then(
        function (res) {
          dfd.resolve(res.data);
          dfd = undefined;
        },
        function (err) {
          dfd.reject(err);
          err = undefined;
        }
      );
      return dfd.promise;
    };

    ctrl.addCheckList_insert = function () {
      var d = new Date();
      ctrl._insert_task_value.task_list.push({
        title: "",
        status: false,
        id: d.getTime().toString(),
      });
      ctrl._insert_task_value.focusChecklist = d.getTime().toString();
    };
    ctrl.removeCheckList_insert = function (id) {
      ctrl._insert_task_value.task_list =
        ctrl._insert_task_value.task_list.filter((e) => e.id !== id);
    };
    ctrl.removeFile_insert = function (item) {
      ctrl._insert_task_value.files = ctrl._insert_task_value.files.filter(
        (e) => e.name !== item.name
      );
    };

    ctrl.prepareInsert = function () {
      $rootScope.statusValue.generate(ctrl._ctrlName, "DA", "insert");
      var today = new Date();
      var myToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0
      );
      var endDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59
      );

      $("#" + idEditor).summernote({
        placeholder: $filter("l")("InputContentHere"),
        callbacks: {
          onImageUpload: function (image) {
            var formData = new FormData();
            formData.append("type", "image");
            formData.append("file", image[0], image[0].name);
            task_service.uploadImage(formData).then(
              function (res) {
                var thisImage = $("<img>").attr("src", res.data.data);
                $("#" + idEditor).summernote("insertNode", thisImage[0]);
              },
              function (err) {}
            );
          },
        },
      });

      ctrl._insert_value = {
        files: [],
        code: "",
        da_book: "",
        number: 1,
        release_date: myToday.getTime(),
        author: "",
        agency_promulgate: "",
        transfer_date: myToday.getTime(),
        note: "",
        type: "office_document_kind_of_dispatch_to",
        priority: "Normal",
        is_legal: false,
        is_assign_task: false,
        excerpt: "",
        view_only_rdepartments: [],
      };

      ctrl._insert_task_value = {
        files: [],
        code: "",
        task_list: [],
        main_person: [],
        participant: [],
        observer: [],
        parent: [],
        label: [],
        da_book: "",
        number: 1,
        to_date: myToday.getTime(),
        author: "",
        agency_promulgate: "",
        to_date: endDay.getTime(),
        note: "",
        type: "",
        priority: "",
        is_legal: false,
        is_assign_task: false,
        excerpt: "",
        level: "task",
        _filterTaskPriority: "",
      };
    };

    // $scope.$watch(function() {
    //     if (ctrl._insert_value.is_assign_task){
    //         $("#" + idEditor).summernote({
    //             placeholder: $filter("l")("InputContentHere"),
    //             callbacks: {
    //                 onImageUpload: function (image) {
    //                     var formData = new FormData();
    //                     formData.append('type', "image");
    //                     formData.append('file', image[0], image[0].name);
    //                     task_service.uploadImage(formData).then(function (res) {
    //                         var thisImage = $('<img>').attr('src', res.data.data);
    //                         $("#" + idEditor).summernote('insertNode', thisImage[0]);
    //                     }, function (err) {

    //                     })
    //                 }
    //             }
    //         });
    //         var taskTitle = "";
    //         if ($rootScope.Language.current === 'vi-VN') {
    //             taskTitle = 'Xử lý Công văn đến ' + ctrl._insert_value.code ;
    //         } else {
    //             taskTitle: 'Incoming Document Processing ' + ctrl._insert_value.code
    //         }
    //     }

    //   });
    $scope.$watch(
      function () {
        $("#" + idEditor).summernote({
            placeholder: $filter("l")("InputContentHere"),
            toolbar: [
                ['style', ['style']], 
                ['style', ['bold', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['insert', ['picture', 'table']],
                ['misc', ['fullscreen', 'help']]
              ],
            callbacks: {
                onImageUpload: function (image) {
                    var formData = new FormData();
                    formData.append('type', "image");
                    formData.append('file', image[0], image[0].name);
                    task_service.uploadImage(formData).then(function (res) {
                        var thisImage = $('<img>').attr('src', res.data);
                        $("#" + idEditor).summernote('insertNode', thisImage[0]);
                    }, function (err) {
                    })
                }
            }
        });
        return ctrl._insert_value.is_assign_task;
      },
      function () {
        var today = new Date();
        var myToday = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          0,
          0,
          0
        );
        var endDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          23,
          59,
          59
        );
        let taskTitle =
          $rootScope.Language.current === "vi-VN"
            ? "Xử lý Công văn đến " + ctrl._insert_value.code
            : "Incoming Document Processing " + ctrl._insert_value.code;
        ctrl._insert_task_value = {
          files: [],
          title: taskTitle,
          code: "",
          task_list: [],
          main_person: [],
          participant: [],
          observer: [],
          parent: [],
          label: [],
          da_book: "",
          number: 1,
          to_date: myToday.getTime(),
          author: "",
          agency_promulgate: "",
          to_date: endDay.getTime(),
          note: "",
          type: 1,
          priority: "Medium",
          is_legal: false,
          is_assign_task: false,
          excerpt: "",
          level: "task",
          _filterTaskPriority: "Medium",
        };
      }
    );

    ctrl.prepareUpdateTask = function (index) {
      ctrl._task_update_value = {
        ...ctrl._insert_tasks[index],
        index,
      };
    };

    ctrl.prepareDeleteTask = function (index) {
      ctrl._task_delete_value = {
        ...ctrl._insert_tasks[index],
        index,
      };
    };

    ctrl.deleteTask = function () {
      const index = ctrl._task_delete_value.index;
      ctrl._insert_tasks.splice(index, 1);
      $("#modal_DA_Task_Delete").modal("hide");
    };

    function insert_service() {
      var dfd = $q.defer();
      let daId = "";
      ctrl._insert_tasks.push({
        currentDepartment_orig: ctrl._insert_value.department,
        ...ctrl._insert_task_value,
        priority: dispatch_arrived_service.taskPriorityTransform(ctrl._insert_task_value._filterTaskPriority).key
      });
      console.log(ctrl._insert_value._filterTaskPriority);
      dispatch_arrived_service
        .insert(
          ctrl._insert_value.files,
          ctrl._insert_value.code,
          ctrl._insert_value.da_book,
          ctrl._insert_value.number,
          ctrl._insert_value.release_date,
          ctrl._insert_value.author,
          ctrl._insert_value.agency_promulgate,
          ctrl._insert_value.transfer_date,
          ctrl._insert_value.note,
          ctrl._insert_value.type,
          ctrl._insert_value.priority,
          ctrl._insert_value.is_legal,
          ctrl._insert_value.excerpt,
          ctrl._insert_value.view_only_departments,
          ctrl._insert_value.is_assign_task
        )
        .then(function (res) {
          daId = res.data._id;
          if (ctrl._insert_value.is_assign_task) {
            return $q.all(
              ctrl._insert_tasks.map((task) =>
                task_service.insert(
                  task.files,
                  task.title,
                  task.note,
                  task.task_list,
                  task.main_person,
                  task.participant,
                  task.observer,
                  task.from_date,
                  task.to_date,
                  task.has_time,
                  task.hours,
                  task.priority,
                  task.task_type,
                  task.head_task_id,
                  null,
                  task.currentProject,
                  task.currentDepartment,
                  daId,
                  task.level,
                  task.label,
                  true,
                  [],
                  {
                    object: "dispatch_arrived",
                    code: res.data.code,
                    id: res.data._id,
                  },
                  1
                )
              )
            );
          }
        })
        .then(
          function () {
            $("#modal_DA_Insert").modal("hide");
            dfd.resolve(true);
            dfd = undefined;
            window.location.href = "/da-details?" + daId;
          },
          function (err) {
            dfd.reject(err);
            err = undefined;
          }
        );
      return dfd.promise;
    }

    ctrl.insert = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "DA",
        "insert",
        insert_service
      );
    };

    /**delete */
    ctrl.prepareDelete = function (value) {
      $rootScope.statusValue.generate(ctrl._ctrlName, "DA", "delete");
      ctrl._delete_value = angular.copy(value);
    };

    function delete_service() {
      var dfd = $q.defer();
      dispatch_arrived_service.delete(ctrl._delete_value._id).then(
        function () {
          $("#modal_DA_Delete").modal("hide");
          dfd.resolve(true);
          ctrl.refreshData();
          dfd = undefined;
        },
        function (err) {
          dfd.reject(err);
          err = undefined;
        }
      );
      return dfd.promise;
    }

    ctrl.delete = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "DA",
        "delete",
        delete_service
      );
    };

    //*Update*//

    ctrl.chooseExpirationDate_update = function (val) {
      if (val) {
        ctrl._update_value.expiration_date = val.getTime();
      } else {
        ctrl._update_value.expiration_date = undefined;
      }
    };
    function getNumber_update(da_book) {
      return function () {
        var dfd = $q.defer();
        dispatch_arrived_service.get_number(da_book).then(
          function (res) {
            ctrl._update_value.number = res.data.number;
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
          },
          function (err) {
            dfd.reject(err);
            err = undefined;
          }
        );
        return dfd.promise;
      };
    }
    ctrl.pickDAB_update = function (val) {
      ctrl._update_value.da_book = val.value;
      $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "DA",
        "getNumber",
        getNumber_update(ctrl._update_value.da_book)
      );
    };

    ctrl.prepareUpdate = function (value) {
      $rootScope.statusValue.generate(ctrl._ctrlName, "DA", "update");
      ctrl._update_value = angular.copy(value);
    };

    function update_service() {
      var dfd = $q.defer();
      dispatch_arrived_service
        .update(
          ctrl._update_value._id,
          ctrl._update_value.number,
          ctrl._update_value.code,
          ctrl._update_value.da_book,
          ctrl._update_value.expiration_date
        )
        .then(
          function () {
            $("#modal_DA_Update").modal("hide");
            dfd.resolve(true);
            ctrl.refreshData();
            dfd = undefined;
          },
          function (err) {
            dfd.reject(err);
            err = undefined;
          }
        );
      return dfd.promise;
    }

    ctrl.update = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "DA",
        "update",
        update_service
      );
    };

    ctrl.export_dispatch_arrived = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "DA",
        "export_dispatch_arrived",
        export_dispatch_arrived_service
      );
    };

    //EXPORT DISPATCH ARRIVED
    ctrl.exportDAReport = function () {
      const table = document.getElementById("daReport");

      // Determine the active tab's name
      let activeTabName = "";
      switch (ctrl.tab) {
        case "created":
          activeTabName = "Created";
          break;
        case "need_to_handle":
          activeTabName = "NeedToHandle";
          break;
        case "forwarded":
          activeTabName = "Forwarded";
          break;
        case "all":
          activeTabName = "All";
          break;
        default:
          activeTabName = "";
      }

      // Clone the table to avoid modifying the original
      const clonedTable = table.cloneNode(true);

      // Remove unwanted text or elements from header cells
      const headers = clonedTable.querySelectorAll("th");
      headers.forEach((header) => {
        // Find and remove .order elements within the header
        const orderElements = header.querySelectorAll("order");
        orderElements.forEach((orderElement) => {
          orderElement.remove();
        });

        // Also remove the unwanted text ".order-active { opacity: 1!important; }" if present
        header.innerHTML = header.innerHTML.replace(
          /\.order-active \{ opacity: 1!important; \}/g,
          ""
        );
      });

      // Convert the cleaned table to a workbook and export it
      const workbook = XLSX.utils.table_to_book(clonedTable);
      XLSX.writeFile(workbook, `${activeTabName}DispatchArrivedReport.xlsx`);
    };
  },
]);
