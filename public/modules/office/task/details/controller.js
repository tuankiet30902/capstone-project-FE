myApp.registerCtrl("task_details_controller", [
  "task_details_service",
  "workflow_play_service",
  "languageValue",
  "notify_service",
  "$q",
  "$rootScope",
  "$scope",
  "$filter",
  "$timeout",
  "$window",
  "$location",
  "debounce",
  function (
    task_details_service,
    workflow_play_service,
    languageValue,
    notify_service,
    $q,
    $rootScope,
    $scope,
    $filter,
    $timeout,
    $window,
    $location,
    debounce
  ) {
    /**declare variable */
    const _statusValueSet = [
      { name: "Task", action: "loadDetails" },
      { name: "Task", action: "start" },
      { name: "Task", action: "done" },
      { name: "Task", action: "confirm" },
      { name: "Task", action: 'delete' },
      { name: "Task", action: 'update' },
      { name: "Task", action: "cancel" },
      { name: "Task", action: "complete" },
      { name: "Task", action: "comment" },
      { name: "Task", action: "updateProgress" },
      { name: "Task", action: "insert" },
      { name: "Task", action: "insert_transferTicket" },
      { name: "Task", action: "init" },
      { name: "Task", action: "load" },
      { name: "Task", action: "pushFile" },
      { name: "Task", action: "removeFile" },
      { name: "Task", action: "transferTicketTemplatePreview" },
      { name: "Task", action: "signAFile" },
      { name: "Task", action: "linkWorkflowPlay" },
      { name: "Task", action: "updateProject" },
      { name: "Task", action: "AddProof" },
      { name: "Task", action: "RemoveProof" }
    ];
    var ctrl = this;
    ctrl._ctrlName = "task_details_controller";
    var idEditor_cancel = "cancelTask_content";
    var idEditor_update = "updateTask_content";


    const TASK_RULE = {
      DIRECTOR_MANAGE: "Office.Task.Director_Manage",
      LEADER_MANAGE: "Office.Task.Leader_Mangage",
      DEPARTMENT_LEADER_MANAGE: "Office.Task.Department_Leader_Manage",
      EDIT_TASK_PROJECT: "Office.Task.Edit_Task_Project",
      EDIT_TASK_DEPARTMENT: "Office.Task.Edit_Task_Department",
      DELETE_TASK_DEPARTMENT: "Office.Task.Delete_Task_Department",
      DELETE_TASK_EDIT_TASK_PROJECT: "Office.Task.Delete_Task_Project",
    };

    const TASK_STATUS = {
      NOT_SEEN: "NotSeen",
      PROCESSING: "Processing",
      PENDING_APPROVAL: "PendingApproval",
      WAITING_FOR_APPROVAL: "WaitingForApproval",
      CANCELLED: "Cancelled",
      COMPLETED: "Completed",
    };

    {
      ctrl._update_value = {};

      ctrl._urlDeleteModal = FrontendDomain + "/modules/office/task/details/views/delete_modal.html";
      ctrl._urlCancelModal = FrontendDomain + "/modules/office/task/details/views/cancel_modal.html";
      ctrl._urlUpdateModal = FrontendDomain + "/modules/office/task/details/views/update_modal.html";
      ctrl._urlConfirmModal = FrontendDomain + "/modules/office/task/details/views/confirm_modal.html";
      ctrl._urlApproveDoneAndCompleteModal = FrontendDomain + "/modules/office/task/details/views/done_complete_message_modal.html";
    }

    const getCode = () => {
      let code = $location.search().code;
      if (code) { return code; }
      if ($rootScope.detailsInfo.url && $rootScope.detailsInfo.route === 'task-details') {
        let temp = $rootScope.detailsInfo.url.split("?")[1];
        if (temp.indexOf("code") !== -1) {
          code = temp.split("=")[1];
          return code;
        }
      }
      return undefined;
    };

    const idEditor = "insertTransferTicket_content";
    /** init variable */
    {
      ctrl.task_comment_editor = `task_comment_editor_${new Date().getTime()}_txt`;
      ctrl.Item = {};
      ctrl.tab = "responsibility";
      ctrl.status = "see";
      ctrl.cycle = "";
      ctrl.commentText = "";
      ctrl.proofText = "";
      ctrl.startWatchComment = false;
      ctrl.startWatchProof = false;
      ctrl.files = [];
      ctrl.filesProof = [];
      ctrl.proofErr = "";
      ctrl.proofFileSizeErr = false;
      ctrl._notyetInit = true;
      ctrl._notyetUpdate = false;
      ctrl.workflow_play = [];
      ctrl.notify_detail = null;
      ctrl._insert_value = {};
      ctrl.showPopup = false;
      ctrl.titlePopup = "";
      ctrl.contentPopup = "";
      ctrl.typePopup = "";
      ctrl.progressChanged = false;
      ctrl.originalProgress = 0;
      $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

      ctrl.commentFiles = [];

      {
        ctrl.TaskPriority = {
          master_key: "task_priority",
          load_details_column: "value",
        };
        ctrl.TaskType = {
          master_key: "task_type",
          load_details_column: "value",
        };
      }

      ctrl._urlInsertTransferTicketModal =
        FrontendDomain +
        "/modules/office/task/details/views/insert_transfer_ticket_modal.html";
      ctrl._urlComment =
        FrontendDomain + "/modules/office/task/details/views/comment.html";
      // ctrl._urlInsertModal = FrontendDomain + "/modules/office/task/details/views/insert_subtask_modal.html";
    }

    ctrl.loadfile = function (params) {
      return function () {
        var dfd = $q.defer();
        task_details_service.loadFileInfo(params.id, params.name).then(
          function (res) {
            dfd.resolve({
              display: res.data.display,
              embedUrl: res.data.url,
              guid: res.data.guid,
            });
            res = undefined;
            dfd = undefined;
          },
          function (err) { }
        );
        return dfd.promise;
      };
    };


    ctrl.pickLabel_update = function (value) {
      ctrl._update_value.label = value;
    };

    function loadDetails_service() {
      var dfd = $q.defer();
    
      ctrl.startWatchComment = true;
      ctrl.startWatchProof = true;
      let currentDepartment = ''
      ctrl.label = [];
      if ($rootScope.detailsInfo.params) {
        currentDepartment = $rootScope.detailsInfo.params.currentDepartment;
      }
      task_details_service.loadDetails(undefined, ctrl.code, currentDepartment).then(async function (res) {
        ctrl.Item = res.data;
        ctrl.thisId = ctrl.Item._id;
        ctrl.originalProgress = ctrl.Item.progress;

        if (ctrl.Item.work_items && ctrl.Item.work_items.length > 0) {
          ctrl.percentParentLeft = 100 - ctrl.Item.work_items.filter(i=> i.status !== 'Cancelled').reduce((sum, item) => sum + item.child_work_percent, 0);
          ctrl.disableProgressBar = true;
        } else {
          ctrl.disableProgressBar = false;
          ctrl.percentParentLeft = 100 - ctrl.Item?.parent_task?.progress;
        }
    
        if (ctrl.Item.main_person.indexOf($rootScope.logininfo.data.username) !== -1 && ctrl.Item.status === "NotSeen") {
          ctrl.start()
        } else {
          getTaskPermissionProperties(ctrl.Item).then(function (permission) {
            ctrl.Item.sortedComments = $filter('groupAndSortComments')(ctrl.Item.comment);
            ctrl.onProgressChange()
            ctrl._notyetUpdate = false
            ctrl.breadcrumb = [
              ...(ctrl.Item.parents || []).reverse(),
              { object: "task", code: ctrl.Item.code },
            ];
            ctrl.task_type = task_details_service.taskTypeTransform(
              ctrl.Item.task_type
            ).value;
            ctrl.workflow_play = [ctrl.Item.workflow_play];
            ctrl.notify_detail = ctrl.Item.notify_detail || null;
            ctrl.cycle = ctrl.Item.repetitive
              ? ctrl.Item.repetitive.cycle.charAt(0).toUpperCase() +
              ctrl.Item.repetitive.cycle.slice(1)
              : "";
            loadLabel_details();
            switch (ctrl.Item.status) {
              case "NotSeen":
                ctrl.status = "notseen";
                break;
              case "Processing":
                ctrl.status = "processing";
                break;
              case "WaitingForApproval":
                ctrl.status = "done";
                break;
              case "Cancelled":
                ctrl.status = "cancelled";
                break;
              case "Completed":
                ctrl.status = "completed";
                break;
              default:
                ctrl.status = "see";
            }
            ctrl.Item = { ...ctrl.Item, ...permission };
    
          
    
            $timeout(function () {
              ctrl._notyetInit = false;
            }, 1000);
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
        }
      })
      return dfd.promise;
    }

    ctrl.loadDetails = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "Task",
        "loadDetails",
        loadDetails_service
      );
    };

    function loadLabel_details() {
      var dfd = $q.defer();

      task_details_service.loadLabel_details(ctrl.Item.label).then(
        function (res) {
          ctrl.label = res.data;
          dfd.resolve(true);
        },
        function (err) {
          dfd.reject(err);
        }
      );
      return dfd.promise;
    }

    ctrl.loadfileWFP = function (params) {
      return function () {
        var dfd = $q.defer();
        task_details_service.loadFileInfoWFP(params.id, params.name).then(
          function (res) {
            dfd.resolve({
              display: res.data.display,
              embedUrl: res.data.url,
              guid: res.data.guid,
            });
            res = undefined;
            dfd = undefined;
          },
          function (err) { }
        );
        return dfd.promise;
      };
    };

    //**UPDATE CHILD TASK */

    ctrl.addCheckList_update = function () {
      var d = new Date();
      ctrl._update_value.task_list.push({
        title: "",
        status: false,
        id: d.getTime().toString(),
      });
      ctrl._update_value.focusChecklist = d.getTime().toString();
    };

    ctrl.removeCheckList_update = function (id) {
      ctrl._update_value.task_list = ctrl._update_value.task_list.filter(
        (e) => e.id !== id
      );
    };

    ctrl.Status = [
      {
        title: {
          "vi-VN": "Chưa xem",
          "en-US": "Not Seen"
        },
        key: "NotSeen"
      },
      {
        title: {
          "vi-VN": "Đang triển khai",
          "en-US": "Processing"
        },
        key: "Processing"
      },
      {
        title: {
          "vi-VN": "Chờ phê duyệt",
          "en-US": "Waiting For Approval"
        },
        key: "WaitingForApproval"
      },
      {
        title: {
          "vi-VN": "Hoàn thành",
          "en-US": "Completed"
        },
        key: "Completed"
      }
    ];
    ctrl.loadStatus_details = function (params) {
      let dfd = $q.defer();
      for (var i in ctrl.Status) {
        if (params.id === ctrl.Status[i].key) {
          dfd.resolve(ctrl.Status[i]);
          break;
        }
      }
      return dfd.promise;
    };
    ctrl.chooseEndDate_update = function (val) {
      if (!ctrl._update_value.repetitive) {
        ctrl._update_value.repetitive = {
            has_endDate: false,
            per: 1,
            cycle: "day",
            endDate: null
        };
      }

      ctrl.endDate_ErrorMsg = $rootScope?.isValidEndDate(
        true,
        ctrl._update_value.repetitive.endDate,
        val
      );
      ctrl._update_value.repetitive.endDate = val ? val.getTime() : null;
    };

    ctrl.chooseFromDate_update = function (val) {
      ctrl.fromDate_ErrorMsg = ctrl.toDate_ErrorMsg = '';
      ctrl._update_value.from_date = val ? val.getTime() : undefined;
      if (ctrl._update_value.to_date && ctrl._update_value.from_date >= ctrl._update_value.to_date) {
        ctrl.fromDate_ErrorMsg = $rootScope.isValidFromDate(true, val, ctrl._update_value.to_date);
      }
      if (!ctrl.fromDate_ErrorMsg) {
        ctrl.chooseToDate_update(ctrl._update_value.to_date ? new Date(ctrl._update_value.to_date) : undefined);
      }
    };

    ctrl.chooseToDate_update = function (val) {
      ctrl.fromDate_ErrorMsg = ctrl.toDate_ErrorMsg = '';
      ctrl._update_value.to_date = val ? val.getTime() : undefined;
      if (ctrl._update_value.from_date && ctrl._update_value.to_date <= ctrl._update_value.from_date) {
        ctrl.toDate_ErrorMsg = $rootScope.isValidToDate(false, ctrl._update_value.from_date, val);
      }
    };

    ctrl.chooseStatus_update = function (val) {
      ctrl._update_value.status = angular.copy(val.key);
    };

    ctrl.pickMainperson_update = function (val) {
      ctrl._update_value.main_person = [val];
    };
    ctrl.pickParticipant_update = function (val) {
      ctrl._update_value.participant = val;
    };
    ctrl.pickObserver_update = function (val) {
      ctrl._update_value.observer = val;
    };


    ctrl.pickMainperson_save_update = function (val) {
      ctrl._update_value = angular.copy(ctrl.Item);
      ctrl._update_value.main_person = [val];
      ctrl.update()
    };
    ctrl.pickParticipant_save_update = function (val) {
      ctrl._update_value = angular.copy(ctrl.Item);
      ctrl._update_value.participant = val;
      ctrl.update()
    };
    ctrl.pickObserver_save_update = function (val) {
      ctrl._update_value = angular.copy(ctrl.Item);
      ctrl._update_value.observer = val;
      ctrl.update()
    };

    
    ctrl.saveTitle = function () {
      ctrl._update_value = angular.copy(ctrl.Item);
      ctrl.update()
      ctrl.isEditingTitle = false;
    };
    

    ctrl.pickPriorityUpdate = function (val) {
      ctrl._update_value.priority = task_details_service.taskPriorityTransform(
        val.value
      ).value;
    };

    ctrl.pickTaskTypeUpdate = function (val) {
      ctrl._update_value.task_type = task_details_service.taskTypeTransform(
        val.value
      ).value;
    };

    ctrl.pickDispatchArrived_update = function (val) {
      ctrl._update_value.dispatch_arrived = val;
    };

    ctrl.chooseHasEndDateRepetitive_update = function (val) {
      ctrl._update_value.repetitive.has_endDate = val;
      if (val === false) {
        ctrl._update_value.repetitive.endDate = null;
      }
    };

    ctrl.calculateTotalPercent = function () {
      if (ctrl.Item.work_items && ctrl.Item.work_items.length > 0) {
        return ctrl.Item.work_items.reduce((sum, item) => sum + item.child_work_percent, 0);
      }
      return 0;
    };

    ctrl.validateAndOpenModal = function () {
          if (ctrl.percentParentLeft == 0) {
              ctrl.showPopup = true;
              ctrl.titlePopup = 'Warning';
              ctrl.contentPopup = 'The total percent is 100. Please modify child tasks to create a new one!';
              ctrl.typePopup = 'warning';
          } else {
            ctrl.showPopup = false;
          }
  };

    ctrl.prepareUpdate = function (value) {
      ctrl.workflow_plays = [];
      $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "update");
      if (value.workflowPlay) {
        ctrl.workflow_plays = [value.workflowPlay];
      } else {
        ctrl.workflow_plays = [];
      }
      if (value.notify_detail) {
        ctrl.notify_detail = value.notify_detail;
      } else {
        ctrl.notify_detail = null;
      }
      if (!value.repetitive) {
        value.repetitive = {
          has_endDate: false,
          per: 1,
          cycle: "day", // allow: days, weeks, months, years
          endDate: null // null or "" khi ko hết hạn
        }
      }
      ctrl._update_value = angular.copy(value);
      ctrl._update_value.priority = task_details_service.taskPriorityTransform(ctrl._update_value.priority).value;
      ctrl._update_value.task_type = (task_details_service.taskTypeTransform(ctrl._update_value.task_type) || {}).value;
      ctrl._update_value.child_work_percent = value.child_work_percent
      ctrl._update_value.percent_left = ctrl.percentParentLeft + ctrl._update_value.child_work_percent
      $("#" + idEditor_update).summernote({
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
            task_details_service.uploadImage(formData).then(function (res) {
              var thisImage = $('<img>').attr('src', res.data);
              $("#" + idEditor_update).summernote('insertNode', thisImage[0]);
            }, function (err) {
    
            })
          }
        }
      });
      $("#" + idEditor_update).summernote('code', value.content);
    }

    function update_service() {
      var dfd = $q.defer();
      if (!ctrl._update_value.has_repetitive) {
        ctrl._update_value.repetitive = undefined;
      } else {
        if (!ctrl._update_value.repetitive.has_endDate) {
          ctrl._update_value.repetitive.endDate = null;
        }
      }
      if (
        ctrl._update_value.dispatch_arrived === undefined ||
        Object.keys(ctrl._update_value.dispatch_arrived).length === 0
      ) {
        ctrl._update_value.dispatch_arrived =
          ctrl._update_value.dispatch_arrived || {};
        ctrl._update_value.dispatch_arrived._id = "";
      }
      task_details_service
        .update(
          ctrl._update_value._id,
          ctrl._update_value.title,
          $("#" + idEditor_update).summernote("code"),
          ctrl._update_value.task_list,
          ctrl._update_value.main_person,
          ctrl._update_value.participant,
          ctrl._update_value.observer,
          ctrl._update_value.from_date,
          ctrl._update_value.to_date,
          ctrl._update_value.status,
          ctrl._update_value.has_time,
          task_details_service.taskPriorityTransform(
            ctrl._update_value.priority
          )?.key,
          (
            task_details_service.taskTypeTransform(
              ctrl._update_value.task_type
            ) || {}
          )?.key,
          ctrl._update_value.workflowPlay_id || "",
          ctrl._update_value.label,
          ctrl._update_value.dispatch_arrived._id,
          undefined,
          ctrl._update_value.child_work_percent
        )
        .then(
          function () {
            $("#modal_Task_Update").modal("hide");
            ctrl.loadDetails();
            dfd.resolve(true);
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
        "Task",
        "update",
        update_service
      );
    };

    // CANCEL CHILD TASK
    ctrl.prepareCancel = function (value) {
      $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "cancel");
      ctrl._cancel_value = angular.copy(value);

      $("#" + idEditor_cancel).summernote({
        placeholder: $filter("l")("InputContentHere"),
        callbacks: {
          onImageUpload: function (image) {
            var formData = new FormData();
            formData.append("type", "image");
            formData.append("file", image[0], image[0].name);
            task_details_service.uploadImage(formData).then(
              function (res) {
                var thisImage = $("<img>").attr("src", res.data.data);
                $("#" + idEditor_update).summernote("insertNode", thisImage[0]);
              },
              function (err) { }
            );
          },
        },
      });
      $("#" + idEditor_cancel).summernote("code", value.content);
    };
    function cancel_childtask_details_service() {
      var dfd = $q.defer();
      task_details_service.cancel(ctrl._cancel_value._id, $("#" + idEditor_cancel).summernote("code")).then(
        function (res) {
          $("#modal_Task_Cancel").modal("hide");
          ctrl.loadDetails();
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

    ctrl.canceltask = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "Task",
        "cancel",
        cancel_childtask_details_service
      );
    };

    /**DELETE CHILD TASK */
    ctrl.prepareDelete = function (value) {
      $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "delete");
      ctrl._delete_value = angular.copy(value);
    };

    function delete_service() {
      var dfd = $q.defer();
      task_details_service.delete(ctrl._delete_value._id).then(
        function () {
          $("#modal_Task_Delete").modal("hide");

          if ((ctrl._delete_value.status == "Completed")) {
            updateProgress(
              ctrl.Item._id,
              ctrl.Item?.progress - ctrl._delete_value.child_work_percent
            );
          } else {
            ctrl.loadDetails();
          }
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
        "Task",
        "delete",
        delete_service
      );
    };

    /**TASK - PUSH FILE FOR UPDATE MODAL */

    function pushFile_service(file) {
      return function () {
        var dfd = $q.defer();
        task_details_service.pushFile(file, ctrl._update_value._id).then(
          function (res) {
            ctrl._update_value.attachment.push(res.data);
            ctrl.refreshData();
            dfd.resolve(true);
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

    ctrl.pushFile_update = function (file) {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "Task",
        "pushFile",
        pushFile_service(file)
      );
    };

    /**TASK - REMOVE FILE FOR UPDATE MODAL */
    function removeFile_service(filename) {
      return function () {
        var dfd = $q.defer();
        task_details_service.removeFile(ctrl._update_value._id, filename).then(
          function (res) {
            var temp = [];
            for (var i in ctrl._update_value.attachment) {
              if (ctrl._update_value.attachment[i].name !== filename) {
                temp.push(ctrl._update_value.attachment[i]);
              }
            }
            ctrl._update_value.attachment = temp;
            ctrl.refreshData();
            temp = undefined;
            dfd.resolve(true);
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

    ctrl.loadfileWFP = function (params) {
      return function () {
        var dfd = $q.defer();
        workflow_play_service.loadFileInfo(params.id, params.name).then(
          function (res) {
            dfd.resolve({
              display: res.data.display,
              embedUrl: res.data.url,
              guid: res.data.guid,
            });
            res = undefined;
            dfd = undefined;
          },
          function (err) { }
        );
        return dfd.promise;
      };
    };

    ctrl.reloadModalBox = function (params) {
      $("body").addClass("modal-open");
    };

    ctrl.removeFile_update = function (item) {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "Task",
        "removeFile",
        removeFile_service(item.name)
      );
    };

    ctrl.convertTaskType = function (data) {
      let newValue = '';
      let list = [...ctrl.taskTypeDataExcel];
      for (let i = 0; i < ctrl.taskTypeDataExcel.length; i++) {
        if (i > 0) {
          if (list[i].value === data) {
            newValue = list[i].task_type;
          }
        }
      }
      return newValue;
    }
  

    ctrl.getValuePriority = function (data) {
    let newValue = "";
    let list = [...ctrl.priorityDataExcel];
    for (let i = 0; i < ctrl.priorityDataExcel.length; i++) {
      if (i > 0) {
        if (list[i].value === data) {
          newValue = list[i].priority;
        }
      }
    }
    return newValue;
  };

ctrl.isUsernameUnique = function (username, list) {
  return list.every(function (item) {
    return item.username !== username;
  });
};

ctrl.validateProperties = function (arrayImportedItem) {
  const format = "DD/MM/YYYY";
  let isValidFormatFromDate = false;
  let isValidFormatToDate = false;
  const indexes = [];
  const optionalFields = ["searching", "has_time", "hours"];
  arrayImportedItem.forEach((object, index) => {
    for (const key in object) {
      if (key === "main_person" && object[key][0] != undefined) {
        if (ctrl.isUsernameUnique(object[key][0], ctrl.listEmployeeAPI)) {
          indexes.push({
            index,
            property: key,
            details: ctrl.errorInvalidUser,
          });
        }
      }

      if (key === "observer" && object[key][0] != undefined) {
        if (ctrl.isUsernameUnique(object[key][0], ctrl.listEmployeeAPI)) {
          indexes.push({
            index,
            property: key,
            details: ctrl.errorInvalidUser,
          });
        }
      }

      if (key === "participant" && object[key][0] != undefined) {
        if (ctrl.isUsernameUnique(object[key][0], ctrl.listEmployeeAPI)) {
          indexes.push({
            index,
            property: key,
            details: ctrl.errorInvalidUser,
          });
        }
      }
      if (!object[key] && !optionalFields.includes(key)) {
        indexes.push({ index, property: key, details: ctrl.errorEmpty });
      }
    }
    if (object.from_date) {
      ctrl.converttoISOString(object.from_date);
      isValidFormatFromDate = moment(
        object.from_date,
        format,
        true
      ).isValid();
      if (!isValidFormatFromDate) {
        indexes.push({
          index,
          property: "from_date",
          details:
            "Sai định dạng ngày. Định dạng ngày phải theo format (dd/mm/yyyy).",
        });
      }
    }
    if (object.to_date) {
      isValidFormatToDate = moment(object.to_date, format, true).isValid();
      if (!isValidFormatToDate) {
        indexes.push({
          index,
          property: "to_date",
          details:
            "Sai định dạng ngày. Định dạng ngày phải theo format (dd/mm/yyyy).",
        });
      }
    }

    if (
      isValidFormatFromDate &&
      isValidFormatToDate &&
      moment(object.from_date, format).unix() >
      moment(object.to_date, format).unix()
    ) {
      indexes.push({
        index,
        property: "from_date",
        details: "'Từ ngày' phải nhỏ hơn trường 'Đến ngày'",
      });
    }
  });

  if (indexes.length > 0) {
    ctrl.listErrorExcelImport = indexes;
  } else {
    ctrl.listErrorExcelImport = [];
    console.log("All properties are defined in all objects.");
  }
};

ctrl.valueImportChange = function () {
  ctrl.validateProperties(ctrl.dataExcelConverted);
};

ctrl.checkDateTime = function (value) {
  const now = moment();
  const currentDay = now.startOf("day");
  const timestamp = currentDay.unix();
  if (value < timestamp) {
    return true;
  } else {
    return false;
  }
};

ctrl.visible = true;
ctrl.selectable = true;
ctrl.removable = true;
ctrl.separatorKeysCodes = [13, 188];
ctrl.searchTextPeople = "";

ctrl.employeeSelected = [];
ctrl.selectedItem = [];
ctrl.opened = false;
ctrl.filteredEmployee = function (value) {
  const filterValue = value.toLowerCase();
  return ctrl.listEmployeeAPI.filter(function (empl) {
    return empl.username.toLowerCase().indexOf(filterValue) >= 0;
  });
};
ctrl.transformChip = function (chip) {
  return chip.title;
};
ctrl.add = function (event) {
  const value = ctrl.fruitCtrl.val();

  if ((value || "").trim()) {
    ctrl.fruits.push(value.trim());
  }

  ctrl.fruitCtrl.val("");

  ctrl.fruitCtrl.trigger("input");
};

ctrl.remove = function (fruit) {
  const index = ctrl.fruits.indexOf(fruit);

  if (index >= 0) {
    ctrl.fruits.splice(index, 1);
  }
};

ctrl.selected = function (val, index, type) {
  if (ctrl.searchTextPeople) {
    ctrl.searchTextPeople = "";
  }
  if (
    ctrl.dataExcelConverted[index][type].some((item) => item.id === val.id)
  ) {
    let indexItem = ctrl.dataExcelConverted[index][type].findIndex(
      (item) => item.id === val.id
    );
    ctrl.dataExcelConverted[index][type].splice(indexItem, 1);
  } else {
    ctrl.dataExcelConverted[index][type].push(val);
  }
  ctrl.validateProperties(ctrl.dataExcelConverted);
};

ctrl.handleKeyDown = function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
  }
};

ctrl.isItemSelected = function (empl, list) {
  return list.some(function (selectedItem) {
    return angular.equals(selectedItem, empl);
  });
};

ctrl.openAuto = function () {
  angular
    .element(document.querySelector("#autocompleteTrigger"))
    .triggerHandler("click");
  angular.element(document.querySelector("#fruitInput")).focus();
};

ctrl.filterAccount = function (account) {
  if (account) {
    return account.split("-")[1].trim();
  }
};

ctrl.converttoISOString = function (dateString) {
  if (typeof dateString === "string") {
    var dateParts = dateString.split("/");
    var dateObject = new Date(
      `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`
    );
    return dateObject;
  }
};
ctrl.isDropdownOpen = false;
ctrl.selectedValue = "";
ctrl.searchText = "";
ctrl.userLists = [];
ctrl.userLists = ctrl.listEmployeeAPI;
ctrl.priorityListImport = [
  {
    title: "Thấp",
    value: 4,
  },
  {
    title: "Trung bình",
    value: 3,
  },
  {
    title: "Quan trọng",
    value: 2,
  },
  {
    title: "Nghiêm trọng",
    value: 1,
  },
];
ctrl.activeItemId = "";
ctrl.togglePerson = "";
ctrl.isOpenAddmorePeople = "";
ctrl.toggleDropdown = function (itemId, person) {
  ctrl.activeItemId = ctrl.activeItemId === itemId ? null : itemId;
  ctrl.togglePerson = person;
};

ctrl.openDropdown = function () {
  ctrl.isDropdownOpen = true;
  ctrl.searchText = "";
};

ctrl.closeAddMoreUser = function () {
  ctrl.isOpenAddmorePeople = "";
};

ctrl.removeUserImport = function (indexEmpl, index, type) {
  ctrl.dataExcelConverted[index][type].splice(indexEmpl, 1);
  ctrl.userLists = ctrl.listEmployeeAPI.filter(
    (item) =>
      !ctrl.dataExcelConverted[index][type].some(
        (item2) => item.username === item2.username
      )
  );
};

ctrl.closeAddMorePeople = function () {
  ctrl.isOpenAddmorePeople = "";
};

ctrl.closeDropdown = function (item) {
  ctrl.isDropdownOpen = false;
};

ctrl.selectOption = function (index, option, id, type) {
  ctrl.selectedValue = option;
  ctrl.isDropdownOpen = false;
  if (ctrl.dataExcelConverted[index].id === id) {
    if (type === "priority") {
      ctrl.dataExcelConverted[index][type] = option;
    } else {
      ctrl.dataExcelConverted[index][type].push(option);
      ctrl.userLists = ctrl.userLists.filter(
        (item) =>
          !ctrl.dataExcelConverted[index][type].some(
            (item2) => item.username === item2.username
          )
      );
    }
  }
  ctrl.activeItemId = "";
  ctrl.validateProperties(ctrl.dataExcelConverted);
};

ctrl.validateDataImport = function () {
  let newTask = {};
  ctrl.dataExcelConverted = [];
  ctrl.isWatched = true;
  let dataExcel = ctrl.dataExcelJsonImported;
  try {
    for (let i = 0; i < dataExcel.length; i++) {
      if (i > 1) {
        newTask = {
          id: Math.random().toString(36).substring(2, 9),
          title: dataExcel[i].title,
          content: dataExcel[i].content,
          from_date: ctrl.converttoISOString(dataExcel[i].from_date),
          to_date: ctrl.converttoISOString(dataExcel[i].to_date),
          main_person: ctrl.filterAccount(dataExcel[i].main_person)
            ? [ctrl.filterAccount(dataExcel[i].main_person)]
            : [],
          participant: ctrl.filterAccount(dataExcel[i].participant)
            ? [ctrl.filterAccount(dataExcel[i].participant)]
            : [],
          observer: ctrl.filterAccount(dataExcel[i].observer)
            ? [ctrl.filterAccount(dataExcel[i].observer)]
            : [],
          priority: ctrl.getValuePriority(dataExcel[i].priority),
          has_time: dataExcel[i].hours ? true : false,
          task_type: ctrl.convertTaskType(dataExcel[i].task_type),
          task_list: dataExcel[i].task_list
            ? dataExcel[i].task_list.split("\n").map(function (item) {
              return {
                title: item.trim(),
                id: Math.random().toString(36).substring(2, 9),
                status: false,
              };
            })
            : [],
        };
        ctrl.dataExcelConverted.push(newTask);
      }
    }
  } catch (err) {
    alert("File có lỗi, vui lòng kiểm tra lại!");
    console.log(err);
  }
  ctrl.validateProperties(ctrl.dataExcelConverted);
  $rootScope.$apply();
};

ctrl.loadData = function (params) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.onload = function (e) {
      var data = e.target.result;
      var workbook = XLSX.read(data, { type: "binary" });
      var firstSheetName = workbook.SheetNames[0];
      var secondSheetName = workbook.SheetNames[1];
      var thirdSheetName = workbook.SheetNames[2];
      var jsonData = XLSX.utils.sheet_to_json(
        workbook.Sheets[firstSheetName]
      );
      var jsonPriority = XLSX.utils.sheet_to_json(
        workbook.Sheets[secondSheetName]
      );
      var jsonTaskType = XLSX.utils.sheet_to_json(
        workbook.Sheets[thirdSheetName]
      );
      ctrl.dataExcelJsonImported = jsonData;
      ctrl.priorityDataExcel = jsonPriority;
      ctrl.taskTypeDataExcel = jsonTaskType;

      resolve();
    };
    reader.readAsBinaryString(params);
  });
};

ctrl.filterByDataExcel = function (item) {
  return window
    .removeUnicode(item.title.toLowerCase())
    .includes(window.removeUnicode(ctrl._searchByDataExcel.toLowerCase()));
};

// INSERT WORKFLOW
ctrl.handleInsertWFPSuccess = function (data) {
  $(".task-insert-directive #modal_WFP_Insert").modal("hide");
  return $rootScope.statusValue.execute(
    ctrl._ctrlName,
    "Task",
    "linkWorkflowPlay",
    linkWorkflowPlay_service(data[0]._id)
  );
};

function linkWorkflowPlay_service(workflowPlay_id) {
  task_details_service.link_workflow_play(ctrl.thisId, workflowPlay_id).then(function (res) {
    if (ctrl.status == "start") {
      ctrl.start();
    }
    ctrl.loadDetails();
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

function init() {
  load_employee_info();
  if (ctrl.code) {
    ctrl.loadDetails();
    return
  }
  setUrlContent();

}


function setUrlContent() {
  ctrl.thisUrl = $rootScope.detailsInfo?.url?.split("?")[1];

  switch (ctrl.thisUrl) {
    case "add-task":
      ctrl._urlContent = urlAddTask
      break;

    case "add-tasks-for-departments":
      ctrl._urlContent = urlAddTasksForDepartments
      break;

    case "add-tasks-for-projects":
      ctrl._urlContent = urlAddTasksForProjects
      break;

    case "add-recurring-department-tasks":
      ctrl._urlContent = urlAddRecurringDepartmentTasks
      break;

    case "department":
      ctrl._urlContent = urlDepartmentDetails
      break;
  }
}

$scope.$watch(getCode, function (newVal) {
  if (newVal && newVal !== ctrl.code) {
    ctrl.code = newVal;
    init();
  }
});

init()

//START TASK

function start_service() {
  var dfd = $q.defer();
  task_details_service.start(ctrl.thisId).then(
    function (res) {
      ctrl.loadDetails();
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

ctrl.start = function () {
  return $rootScope.statusValue.execute(
    ctrl._ctrlName,
    "Task",
    "start",
    start_service
  );
};

//DONE TASK

function done_service() {
  var dfd = $q.defer();
  var donePromise;
  if (ctrl.Item.source_id == 1 || ctrl.Item.source_id == 2) {
    donePromise = task_details_service.done(ctrl.thisId, ctrl._assess_value.note);
  } else {
    donePromise = task_details_service.done(ctrl.thisId);
  }
  donePromise.then(
    function (res) {
      $('#modal_Done_Complete_Message').modal('hide');
      ctrl.loadDetails();
      dfd.resolve(true);
      res = undefined;
      dfd = undefined;
      emitTaskReloadEvent(ctrl.code)
    },
    function (err) {
      dfd.reject(err);
      err = undefined;
    }
  );
  return dfd.promise;
}

ctrl.done = function () {
  return $rootScope.statusValue.execute(
    ctrl._ctrlName,
    "Task",
    "done",
    done_service
  );
};

function emitTaskReloadEvent(code) {
  let obj = {
    type: "task",
    value: code
  }

  $rootScope.emitReloadEvent(obj);
}

//COMPLETE TASK

ctrl._assess_value = {
  note: '',
  note_required: true
};

ctrl._hintNoteSet = [
  'I agree',
  'I approve',
  'Well done, I approve',
  'Processed'
];

ctrl.set_hint_note = function(note) {
  ctrl._assess_value.note = $filter('l')(note);
};

ctrl.openModal = function(modalId){
  $(modalId).modal('toggle');
}

function complete_service() {
  var dfd = $q.defer();
  var completePromise;
  if (ctrl.Item.source_id == 1 || ctrl.Item.source_id == 2) {
    completePromise = task_details_service.complete(ctrl.thisId, ctrl.code, ctrl._assess_value.note);
  } else {
    completePromise = task_details_service.complete(ctrl.thisId, ctrl.code);
  }
  completePromise.then(
    function (res) {
      $('#modal_Done_Complete_Message').modal('hide');
      if ((ctrl.Item.level == "Task")) {
        updateProgress(
          ctrl.Item?.parent_task?._id,
          ctrl.Item?.parent_task?.progress + ctrl.Item?.child_work_percent
        );
      } else {
        ctrl.loadDetails();
      }

      dfd.resolve(true);
      res = undefined;
      dfd = undefined;
      emitTaskReloadEvent(ctrl.code)

    },
    function (err) {
      dfd.reject(err);
      err = undefined;
    }
  );
  return dfd.promise;
}

ctrl.complete = function () {
  // if (
  //   (!ctrl.Item.proof || ctrl.Item.proof.length === 0) &&
  //   (!ctrl.Item.comment || ctrl.Item.comment.length === 0)
  // ) {
  //   openPopup("Warning", "ProofOrCommentIsRequiredForTheTask", "warning");
  //   return;
  // }
  return $rootScope.statusValue.execute(
    ctrl._ctrlName,
    "Task",
    "complete",
    complete_service
  );
};

// CANCEL TASK

function cancel_service() {
  var dfd = $q.defer();
  task_details_service.cancel(ctrl.Item._id).then(
    function (res) {
      ctrl.loadDetails();
      dfd.resolve(true);
      res = undefined;
      dfd = undefined;
      emitTaskReloadEvent(ctrl.code)
    },
    function (err) {
      dfd.reject(err);
      err = undefined;
    }
  );
  return dfd.promise;
}

ctrl.cancel = function () {
  return $rootScope.statusValue.execute(
    ctrl._ctrlName,
    "Task",
    "cancel",
    cancel_service
  );
};

function updateProgress(id = ctrl.Item._id, progress=ctrl.Item.progress) {
  var dfd = $q.defer();
  ctrl._notyetUpdate = true
  task_details_service
    .update_progress(id, progress)
    .then(
      function () {
        ctrl.loadDetails();
        dfd.resolve(true);
        dfd = undefined;
      },
      function (err) {
        dfd.reject(err);
        err = undefined;
      }
    );
  return dfd.promise;
    }
    
    ctrl.onProgressChange = function () {
      if (ctrl.Item._id) {
        return ctrl.progressChanged = ctrl.originalProgress !== ctrl.Item.progress
      }
    };

    ctrl.confirmProgressChange = function () {
      ctrl.changeProgressOfTask();
      ctrl.progressChanged = false;
      ctrl.originalProgress = ctrl.Item.progress;
    };

    ctrl.resetProgressChange = function () {
      ctrl.Item.progress = ctrl.originalProgress;
      ctrl.progressChanged = false;
    };

ctrl.changeProgressOfTask = function () {
  if (
    ctrl.Item.work_items.length) {
    ctrl.Item.progress = 0
    return false;
  }
  return $rootScope.statusValue.execute(
    ctrl._ctrlName,
    "Task",
    "updateProgress",
    updateProgress
  );
    };
    
    ctrl.showConfirmModal = function () {
      $(`#modal_Task_Confirm`).modal('show');
    };
    
    ctrl.confirmAction = function () {
      $('#modal_Task_Confirm').modal('hide');
      ctrl.changeProgressOfTask();
      ctrl.progressChanged = false;
      ctrl.originalProgress = ctrl.Item.progress;
    };

// Add Proof
ctrl.addTempText = function () {
  var draftKey = `draft_${ctrl.code}_${$rootScope.logininfo.username}_proof`;
  var inputStr = $("#" + ctrl.task_comment_editor).summernote("code");
  if (inputStr.length == "") {
    $window.localStorage.removeItem(draftKey);
  } else {
    $window.localStorage.setItem(draftKey, inputStr);
  }
};

ctrl.removeFilesProof = function (name) {
  ctrl.filesProof = ctrl.filesProof.filter((e) => e.name !== name);
};

ctrl.onProofFileExceedsLimit = function (params) {
  if (params.error) {
    ctrl.proofFileSizeErr = true;
  } else {
    ctrl.proofFileSizeErr = false;
  }
};

function get_value_error(key) {
  var valueErr = "FailureAction";
  for (var i in languageValue.details) {
    if (languageValue.details[i].key == key) {
      valueErr = languageValue.details[i];
      break;
    }
  }
  return valueErr && valueErr.value ? valueErr.value : "FailureAction";
}

function add_proof_service() {
  var dfd = $q.defer();
  if (ctrl.proofText.length > 0) {
    let filesProof = ctrl.filesProof.map((file) => {
      const date = new Date();
      const dateTime = `${date.getDate().toString().padStart(2, "0")}${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}${date.getFullYear()}-${date
          .getHours()
          .toString()
          .padStart(2, "0")}.${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}.${date
              .getSeconds()
              .toString()
              .padStart(2, "0")}`;
      let fileExtension = file.name.split(".").pop();
      let fileName = file.name.replace(/\.[^/.]+$/, "");
      return {
        ...file,
        name: `${ctrl.Item.code}_${fileName}_${dateTime}.${fileExtension}`,
      };
    });
    task_details_service
      .add_proof(ctrl.thisId, ctrl.code, ctrl.proofText, filesProof)
      .then(
        function (res) {
          ctrl.proofErr = "";
          ctrl.proofText = "";
          ctrl.filesProof = [];
          ctrl.proofFileSizeErr = false;
          ctrl.loadDetails();
          dfd.resolve(true);
          res = undefined;
          dfd = undefined;
        },
        function (err) {
          ctrl.proofErr = get_value_error(err.data.mes);
          dfd.reject(err);
          err = undefined;
        }
      );
  }
  return dfd.promise;
}
ctrl.addProof = function () {
  return $rootScope.statusValue.execute(
    ctrl._ctrlName,
    "Task",
    "AddProof",
    add_proof_service
  );
};

function remove_proof_service(proofId) {
  var dfd = $q.defer();
  if (ctrl.Item.proof.length > 0) {
    task_details_service.remove_proof(ctrl.thisId, proofId).then(
      function (res) {
        ctrl.loadDetails();
        dfd.resolve(true);
        res = undefined;
        dfd = undefined;
      },
      function (err) {
        dfd.reject(err);
        err = undefined;
      }
    );
  }
  return dfd.promise;
}

ctrl.removeProof = function (proofId) {
  return $rootScope.statusValue.execute(
    ctrl._ctrlName,
    "Task",
    "RemoveProof",
    remove_proof_service(proofId)
  );
};

//COMMENT
ctrl.resetFileInput = function () {
  var fileInput = document.getElementById("file_upload");
  fileInput.value = "";
};

ctrl.removeFiles = function (name) {
  ctrl.commentFiles = ctrl.commentFiles.filter((e) => e.name !== name);
  ctrl.resetFileInput();
};

ctrl.blurPushComment = function () {
  ctrl.showPushComment = false;
  ctrl.commentFiles = [];
  ctrl.resetFileInput();
};

ctrl.addTempTextComment = function () {
  var draftKey = `draft_${ctrl.code}_${$rootScope.logininfo.username}_comment`;
  var inputStr = $("#" + ctrl.task_comment_editor).summernote("code");
  if (inputStr.length == "") {
    $window.localStorage.removeItem(draftKey);
  } else {
    $window.localStorage.setItem(draftKey, inputStr);
  }
};

ctrl.focusComment = function () {
  // if (Object.keys(ctrl.userList).length === 0) {
  //     ctrl.loadMembers().then(function (res) {
  //         ctrl.userList = res;
  //     }).catch(function (err) {
  //         console.log(err);
  //     });
  // }
  var draftKey = `draft_${ctrl.code}_${$rootScope.logininfo.username}_comment`;
  
  ctrl.showPushComment = true;

  $("#" + ctrl.task_comment_editor).summernote("height", "350px");
  $("#" + ctrl.task_comment_editor).summernote("foreColor", "#151515");
  $("#" + ctrl.task_comment_editor).summernote(
    "code",
    $window.localStorage.getItem(draftKey) || ""
  );

  var isTypingAt = false;
  var isSearching = false;
  var userList = $("<div/>", {
    id: "userList",
    css: {
      position: "absolute",
      "z-index": "9999",
      "max-height": "200px",
      "overflow-y": "auto",
    },
  });
  $(document).keydown(function (e) {
    if (e.key == "Escape") {
      // If the pressed key is ESC
      userList.empty(); // Clear the user list
      isSearching = false;
      $scope.$apply(function () {
        ctrl.showPushComment = false;
      });
    }
  });

  var currentSearch = "";
  $("#" + ctrl.task_comment_editor).after(userList);
  var currentAtPosition = -1;
  var cursorPosition = 0;
  // var currentSelectedIndex = -1;
  $("#" + ctrl.task_comment_editor).on("summernote.keyup", function (we, e) {
    debounce(ctrl.addTempTextComment);
    var content = $("#" + ctrl.task_comment_editor).summernote("code");
    previousAtPosition = currentAtPosition;
    currentAtPosition = content.lastIndexOf("@");
    if (["Tab"].includes(e.key)) {
      currentSearch = "";
      isTypingAt = false;
      isSearching = false;
      userList.empty();
    }
    if (
      ![
        "Shift",
        "Control",
        "Alt",
        "Enter",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Meta",
        "CapsLock",
      ].includes(e.key)
    ) {
      var text = $("#" + ctrl.task_comment_editor).summernote("code");

      var atIndex = text.indexOf("@");
      var eKeyIndex = text.lastIndexOf(e.key);

      if (atIndex !== -1 && eKeyIndex !== -1) {
        text = text.substring(atIndex, eKeyIndex + 1);
        cursorPosition = atIndex;
      }

      if (e.key === "@" && e.keyCode !== 8) {
        currentSearch = "";
        isTypingAt = true;
        isSearching = true;
      } else if (isTypingAt && e.key !== " " && e.keyCode !== 8) {
        isSearching = true;
      } else if (e.key === " ") {
        userList.empty();
        isTypingAt = false;
        isSearching = false;
      } else if (e.keyCode === 8 && text.indexOf("@") === -1) {
        userList.empty();
        isTypingAt = false;
        isSearching = false;
      } else {
        isTypingAt = false;
      }
      if (e.key === "Backspace") {
        if (currentSearch.length > 0) {
          currentSearch = currentSearch.slice(0, -1);
        }
        if (currentSearch.length === 0) {
          userList.empty();
          isTypingAt = false;
        } else {
          isTypingAt = false;
        }
      } else {
        currentSearch += e.key;
        isTypingAt = false;
      }

      if (isTypingAt || isSearching) {
        userList.empty();
        var filteredMembers;

        const members = ctrl.userList;

        var search = currentSearch.replace("@", "").trim();

        if (search === "") {
          filteredMembers = members;
        } else {
          filteredMembers = members.filter(function (member) {
            return (
              member &&
              member.title_search
                .replace(/\s+/g, "")
                .toUpperCase()
                .includes(search.trim().toUpperCase())
            );
          });
        }

        var range = $("#" + ctrl.task_comment_editor).summernote("createRange");
        var rangePosition = range.getClientRects()[0];

        userList.css({
          position: "absolute",
          left: rangePosition.left - 250 + "px",
          top: rangePosition.top + rangePosition.height - 70 + "px",
        });
        for (var i = 0; i < filteredMembers.length; i++) {
          var userDiv = $("<div/>", {
            "data-username": filteredMembers[i].userName,
            css: {
              width: "300px",
              padding: "10px",
              cursor: "pointer",
              display: "flex",
              "align-items": "center",
              "background-color": "#ffffff",
              border: "1px solid #e0e0e0",
            },
            hover: function () {
              $(this).css("background-color", "#e0e0e0");
            },
            mouseleave: function () {
              $(this).css("background-color", "#ffffff");
            },
            click: function () {
              var id = $(this).find("span").attr("id");
              isSearching = false;
              isTypingAt = false;
              var selectedText = $(this).text();
              var highlightedText =
                '<span id = "' +
                id +
                '" contenteditable="false" style="background-color: #6452c6;color: #f3f3f5;border-radius: 5px;padding: 5px;display: inline-block;">' +
                selectedText +
                "</span>";
              handleUserListSelection(
                highlightedText,
                currentSearch,
                cursorPosition,
                currentAtPosition
              );

              currentSearch = "";
              userList.empty();
              var id = $(this).find("span").attr("id");
              var content = $("#" + ctrl.task_comment_editor).summernote("code");
              var $content = $("<div>").html(content);
              var spanIds = $content
                .find("span")
                .map(function () {
                  return this.id;
                })
                .get();
              if (!spanIds.includes(id)) {
              }
            },
            function (err) {
              dfd.reject(err);
              err = undefined;
            }
            }
          );
      }
      return dfd.promise;
    }

    ctrl.comment = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "Task",
        "comment",
        comment_service
      );
    };

    ctrl.editComment = function (item) {
      item.isEditing = true;
      item.newContent = item.content;
      $timeout(function() {
        $('#summernote-' + item.id).summernote({
            height: 100, 
            focus: true, 
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['insert', ['link', 'picture', 'video']],
                ['view', ['codeview']]
            ]
        });
    }, 0)
    }

    ctrl.saveUpdatedComment = function (item) {
      var dfd = $q.defer();
      var updatedContent = $('#summernote-' + item.id).summernote('code');
      var files = ctrl.commentFiles || [];

      task_details_service.updateComment(ctrl.thisId,item.id, updatedContent, files, 'Comment').then(function (res) {
        item.content = updatedContent;
        item.isEditing = false;
        ctrl.loadDetails();
        dfd.resolve(true);
        res = undefined;
        dfd = undefined;
      },function (err) {
        dfd.reject(err);
        err = undefined;
      });
      return dfd.promise;
    }

    ctrl.cancelEditComment = function (item) {
      item.isEditing = false;
    }

    // UPDATE TASK LIST STATUS
    ctrl.update_task_list_status = function (task_list_id, value) {
      task_details_service.update_task_list_status(
        ctrl.thisId,
        task_list_id,
        value
      );
    };

    //UPDATE TASK LIST
    function update_task_list_service() {
      task_details_service.update_task_list(ctrl.thisId, ctrl.Item.task_list);
    }

    ctrl.removeTaskList = function (id) {
      ctrl.Item.task_list = ctrl.Item.task_list.filter((e) => e.id !== id);
      update_task_list_service();
    };

    ctrl.addTaskList = function () {
      var d = new Date();
      ctrl.Item.task_list.push({
        title: "",
        status: false,
        id: d.getTime().toString(),
      });
      ctrl.Item.focusChecklist = d.getTime().toString();
      update_task_list_service();
    };

    ctrl.changeTextTaskList = function () {
      update_task_list_service();
    };

    ctrl.getCommentCountWithoutCancel = function (comments) {
      var nonCancelComments = (comments || []).filter(function (comment) {
        return comment.type !== "Cancelled";
      });

      return nonCancelComments.length;
    };

    ctrl.handleSuccess = function () {
      ctrl.loadDetails();
    };

    //INSERT SUBTASK

    // handle function for INSERT TRANSFER TICKET

    ctrl.chooseDepartment = function (val) {
      ctrl._insert_value.department = angular.copy(val.id);
    };

    ctrl.prepareInsertTransferTicket = function (val) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "insert");
        if (val) {
            ctrl._parentID = val._id;
            ctrl._parentTitle = val.title;
        } else {
            ctrl._parentID = undefined;
            ctrl._parentTitle = undefined;
        }

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
                    task_details_service.uploadImage(formData).then(function (res) {
                        var thisImage = $('<img>').attr('src', res.data);
                        $("#" + idEditor).summernote('insertNode', thisImage[0]);
                    }, function (err) {

                    })
                }
            }
        });
        $("#" + idEditor).summernote('code', '');
        var today = new Date();

        var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        var endDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        ctrl._filterPriority = "Medium";
        ctrl._filterTaskType = "Task";
        ctrl._insert_value = {
            files: [],
            title: "",
            task_list: [],
            main_person: [],
            participant: [],
            observer: [$rootScope.logininfo.username],
            from_date: myToday.getTime(),
            to_date: endDay.getTime(),
            has_time: false,
            hours: 0,
            priority: "Medium",
            department: "",
            transfer_ticket_values: {
                title: "",
                base: "",
                perform: "",
                content: "",
                recipient: "- Như trên; \n - BGH (để báo cáo); \n - Lưu: VT, (viết tắt người tham mưu)."
            }
        };
    }

    ctrl.choosePriority = function (val) {
      const priority = task_details_service.taskPriorityTransform(val.value);
      ctrl._insert_value.priority = priority.key;
      ctrl._filterPriority = priority.value;
    };

    ctrl.chooseTaskType = function (val) {
      const taskType = task_details_service.taskTypeTransform(val.value);
      ctrl._insert_value.task_type = taskType.key;
      ctrl._filterTaskType = taskType.value;
    };

    ctrl.addCheckList_insert = function () {
      var d = new Date();
      ctrl._insert_value.task_list.push({
        title: "",
        status: false,
        id: d.getTime().toString(),
      });
      ctrl._insert_value.focusChecklist = d.getTime().toString();
    };

    ctrl.removeCheckList_insert = function (id) {
      ctrl._insert_value.task_list = ctrl._insert_value.task_list.filter(
        (e) => e.id !== id
      );
    };

    ctrl.chooseFromDate_insert = function (val) {
      ctrl.fromDate_ErrorMsg = $rootScope.isValidFromDate(
        true,
        val,
        ctrl._insert_value.to_date
      );
      ctrl._insert_value.from_date = val ? val.getTime() : undefined;
    };

    ctrl.chooseToDate_insert = function (val) {
      ctrl.toDate_ErrorMsg = $rootScope.isValidToDate(
        true,
        ctrl._insert_value.from_date,
        val
      );
      ctrl._insert_value.to_date = val ? val.getTime() : undefined;
    };

    ctrl.pickMainperson_insert = function (val) {
      ctrl._insert_value.main_person = val;
    };
    ctrl.pickParticipant_insert = function (val) {
      ctrl._insert_value.participant = val;
    };
    ctrl.pickObserver_insert = function (val) {
      ctrl._insert_value.observer = val;
    };

    /**UPDATE TASK */
    ctrl.addCheckList_update = function () {
      var d = new Date();
      ctrl._update_value.task_list.push({
        title: "",
        status: false,
        id: d.getTime().toString(),
      });
      ctrl._update_value.focusChecklist = d.getTime().toString();
    };

    ctrl.removeCheckList_update = function (id) {
      ctrl._update_value.task_list = ctrl._update_value.task_list.filter(
        (e) => e.id !== id
      );
    };

    function preview_service() {
      var dfd = $q.defer();
      $(".modal-backdrop").remove();
      $("body").removeClass("modal-open");
      $rootScope.FileService.bind({
        display: "",
        embedUrl: "/component/loading.html",
      });
      $rootScope.FileService.show();
      task_details_service
        .transfer_ticket_preview(
          ctrl.Item.department.id,
          ctrl._insert_value.transfer_ticket_values,
          ctrl._insert_value.department
        )
        .then(
          function (res) {
            $rootScope.FileService.bind({
              display: "Phiếu chuyển.docx",
              embedUrl: res.data.url,
              serviceName: "task",
              attachmentId: ""
            });
          });
          var url = "";

          if (filteredMembers[i].hasOwnProperty("avatar")) {
            url = filteredMembers[i].avatar.url;
          }
          var url = filteredMembers[i].avatar
            ? filteredMembers[i].avatar.url
            : "default_url";
          var userLogo = $("<img/>", {
            src: url,
            css: {
              width: "30px",
              height: "30px",
              "border-radius": "50%",
              "margin-right": "10px",
              border: "1px solid #e0e0e0",
            },
          });

          var userName = $("<span/>", {
            text: filteredMembers[i].title,
            id: filteredMembers[i].username,
          });
          userDiv.append(userLogo, userName);
          userList.append(userDiv);
        }
        if (filteredMembers.length === 0) {
          userList.empty();
        }
        if (currentSearch.length > 20) {
          userList.empty();
          isSearching = false;
          isTypingAt = false;
        }
      }
  });
};

function comment_service() {
  var dfd = $q.defer();
  var draftKey = `draft_${ctrl.code}_${$rootScope.logininfo.username}_comment`;

  const content = $(`#${ctrl.task_comment_editor}`).summernote("code");
  if (content) {
    task_details_service.comment(
      ctrl.thisId,
      content,
      ctrl.commentFiles,
      'Comment',
      ctrl.code
    )
      .then(
        function (res) {
          $window.localStorage.removeItem(draftKey);
          $window.localStorage.setItem(draftKey, "");
          $("#" + ctrl.task_comment_editor).summernote("code", "");
          ctrl.showPushComment = false;
          ctrl.commentFiles = [];
          ctrl.loadDetails();
          ctrl.resetFileInput();
          dfd.resolve(true);
          res = undefined;
          dfd = undefined;
        },
        function (err) {
          dfd.reject(err);
          err = undefined;
        }
      );
  }
  return dfd.promise;
}

ctrl.comment = function () {
  return $rootScope.statusValue.execute(
    ctrl._ctrlName,
    "Task",
    "comment",
    comment_service
  );
};

// UPDATE TASK LIST STATUS
ctrl.update_task_list_status = function (task_list_id, value) {
  task_details_service.update_task_list_status(
    ctrl.thisId,
    task_list_id,
    value
  );
};

//UPDATE TASK LIST
function update_task_list_service() {
  task_details_service.update_task_list(ctrl.thisId, ctrl.Item.task_list);
}

ctrl.removeTaskList = function (id) {
  ctrl.Item.task_list = ctrl.Item.task_list.filter((e) => e.id !== id);
  update_task_list_service();
};

ctrl.addTaskList = function () {
  var d = new Date();
  ctrl.Item.task_list.push({
    title: "",
    status: false,
    id: d.getTime().toString(),
  });
  ctrl.Item.focusChecklist = d.getTime().toString();
  update_task_list_service();
};

ctrl.changeTextTaskList = function () {
  update_task_list_service();
};

ctrl.getCommentCountWithoutCancel = function (comments) {
  var nonCancelComments = (comments || []).filter(function (comment) {
    return comment.type !== "Cancelled";
  });

  return nonCancelComments.length;
};

ctrl.handleSuccess = function () {
  ctrl.loadDetails();
};

//INSERT SUBTASK

// handle function for INSERT TRANSFER TICKET

ctrl.chooseDepartment = function (val) {
  ctrl._insert_value.department = angular.copy(val.id);
};

ctrl.prepareInsertTransferTicket = function (val) {
  $rootScope.statusValue.generate(ctrl._ctrlName, "Task", "insert");
  if (val) {
    ctrl._parentID = val._id;
    ctrl._parentTitle = val.title;
  } else {
    ctrl._parentID = undefined;
    ctrl._parentTitle = undefined;
  }

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
        task_details_service.uploadImage(formData).then(function (res) {
          var thisImage = $('<img>').attr('src', res.data);
          $("#" + idEditor).summernote('insertNode', thisImage[0]);
        }, function (err) {

        })
      }
    }
  });
  $("#" + idEditor).summernote('code', '');
  var today = new Date();

  var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
  var endDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
  ctrl._filterPriority = "Medium";
  ctrl._filterTaskType = "Task";
  ctrl._insert_value = {
    files: [],
    title: "",
    task_list: [],
    main_person: [],
    participant: [],
    observer: [$rootScope.logininfo.username],
    from_date: myToday.getTime(),
    to_date: endDay.getTime(),
    has_time: false,
    hours: 0,
    priority: "Medium",
    department: "",
    transfer_ticket_values: {
      title: "",
      base: "",
      perform: "",
      content: "",
      recipient: "- Như trên; \n - BGH (để báo cáo); \n - Lưu: VT, (viết tắt người tham mưu)."
    }
  };
}

ctrl.choosePriority = function (val) {
  const priority = task_details_service.taskPriorityTransform(val.value);
  ctrl._insert_value.priority = priority.key;
  ctrl._filterPriority = priority.value;
};

ctrl.chooseTaskType = function (val) {
  const taskType = task_details_service.taskTypeTransform(val.value);
  ctrl._insert_value.task_type = taskType.key;
  ctrl._filterTaskType = taskType.value;
};

ctrl.addCheckList_insert = function () {
  var d = new Date();
  ctrl._insert_value.task_list.push({
    title: "",
    status: false,
    id: d.getTime().toString(),
  });
  ctrl._insert_value.focusChecklist = d.getTime().toString();
};

ctrl.removeCheckList_insert = function (id) {
  ctrl._insert_value.task_list = ctrl._insert_value.task_list.filter(
    (e) => e.id !== id
  );
};

ctrl.chooseFromDate_insert = function (val) {
  ctrl.fromDate_ErrorMsg = $rootScope.isValidFromDate(
    true,
    val,
    ctrl._insert_value.to_date
  );
  ctrl._insert_value.from_date = val ? val.getTime() : undefined;
};

ctrl.chooseToDate_insert = function (val) {
  ctrl.toDate_ErrorMsg = $rootScope.isValidToDate(
    true,
    ctrl._insert_value.from_date,
    val
  );
  ctrl._insert_value.to_date = val ? val.getTime() : undefined;
};

ctrl.pickMainperson_insert = function (val) {
  ctrl._insert_value.main_person = val;
};
ctrl.pickParticipant_insert = function (val) {
  ctrl._insert_value.participant = val;
};
ctrl.pickObserver_insert = function (val) {
  ctrl._insert_value.observer = val;
};

/**UPDATE TASK */
ctrl.addCheckList_update = function () {
  var d = new Date();
  ctrl._update_value.task_list.push({
    title: "",
    status: false,
    id: d.getTime().toString(),
  });
  ctrl._update_value.focusChecklist = d.getTime().toString();
};

ctrl.removeCheckList_update = function (id) {
  ctrl._update_value.task_list = ctrl._update_value.task_list.filter(
    (e) => e.id !== id
  );
};

function preview_service() {
  var dfd = $q.defer();
  $(".modal-backdrop").remove();
  $("body").removeClass("modal-open");
  $rootScope.FileService.bind({
    display: "",
    embedUrl: "/component/loading.html",
  });
  $rootScope.FileService.show();
  task_details_service
    .transfer_ticket_preview(
      ctrl.Item.department.id,
      ctrl._insert_value.transfer_ticket_values,
      ctrl._insert_value.department
    )
    .then(
      function (res) {
        $rootScope.FileService.bind({
          display: "Phiếu chuyển.docx",
          embedUrl: res.data.url,
          serviceName: "task",
          attachmentId: ""
        });

        dfd.resolve(true);
      },
      function (err) {
        dfd.reject(err);
      }
    );

  return dfd.promise;
}

ctrl.transferTicketTemplatePreview = function () {
  return $rootScope.statusValue.execute(
    ctrl._ctrlName,
    "Task",
    "transferTicketTemplatePreview",
    preview_service
  );
};

function load_employee_info() {
  var dfdAr = [];
  dfdAr.push(load_employee_detail());
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

function load_employee_detail() {
  var dfd = $q.defer();
  task_details_service
    .loadEmployeeDetail($rootScope.logininfo.data.employee)
    .then(
      function (res) {
        ctrl.sign = res.data.signature.link;
        ctrl.quotationMark = res.data.quotationMark.link;
        dfd.resolve(true);
      },
      function () {
        dfd.reject(false);
        err = undefined;
      }
    );
  return dfd.promise;
}

function insert_transferTicket_service() {
  var dfd = $q.defer();
  let source_id = 2;
  if ($rootScope.logininfo.data && $rootScope.logininfo.data.department_details && $rootScope.logininfo.data.department_details.type) {
    switch ($rootScope.logininfo.data.department_details.type) {
      case "department":
        source_id = 2;
        break;
      case "temporary_department":
        source_id = 3;
        break;
      case "board":
        source_id = 4;
        break;
    }
  }

  task_details_service
    .insert_transfer_ticket(
      ctrl._insert_value.files,
      ctrl._insert_value.title,
      $("#" + idEditor).summernote("code"),
      ctrl._insert_value.task_list,
      ctrl._insert_value.main_person,
      ctrl._insert_value.participant,
      ctrl._insert_value.observer,
      ctrl._insert_value.from_date,
      ctrl._insert_value.to_date,
      ctrl._insert_value.has_time,
      ctrl._insert_value.hours,
      task_details_service.taskPriorityTransform(ctrl._insert_value.priority).key,
      task_details_service.taskTypeTransform(ctrl._insert_value.task_type).key,
      ctrl._insert_value.transfer_ticket_values,
      ctrl.Item.department.id,
      ctrl._insert_value.department,
      ctrl.Item._id,
      ctrl._parentID,
      undefined,
      ctrl.Item.parents || [],
      {
        code: ctrl.Item.code,
        value: ctrl.Item._id,
        object: "task",
      },
      source_id
    )
    .then(
      function () {
        ctrl.loadDetails();
        $("#modal_TranferTicket_Insert").modal("hide");
        dfd.resolve(true);
        dfd = undefined;
      },
      function (err) {
        dfd.reject(err);
        err = undefined;
      }
    );
  return dfd.promise;
}

ctrl.insert_transferTicket = function () {
  return $rootScope.statusValue.execute(
    ctrl._ctrlName,
    "Task",
    "insert_transferTicket",
    insert_transferTicket_service
  );
};

function signAFile_service() {
  return function () {
    var dfd = $q.defer();
    task_details_service.signAFile(ctrl.Item._id).then(
      function (res) {
        console.log(res.data);
        ctrl.loadDetails();
        dfd.resolve(true);
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

ctrl.signAFile = function (filename) {
  return $rootScope.statusValue.execute(
    ctrl._ctrlName,
    "Task",
    "signAFile",
    signAFile_service(filename)
  );
};

ctrl.handle_insert_notify_success = function (data) {
  $(".task-details-container #notify_insert_modal").modal("hide");
  ctrl.Item.notify_detail = data.data;
  ctrl._insert_value.notify_detail = data.data;
  ctrl.notify_detail = data.data;
};

ctrl.load_notify_file = function (params) {
  return function () {
    var dfd = $q.defer();
    notify_service.loadFileInfo(params.id, params.name).then(
      function (res) {
        dfd.resolve({
          display: res.data.display,
          embedUrl: res.data.url,
          guid: res.data.guid,
        });
        res = undefined;
        dfd = undefined;
      },
      function (err) { }
    );
    return dfd.promise;
  };
};

ctrl.closePopup = function () {
  ctrl.showPopup = false;
};

openPopup = (title, content, type) => {
  ctrl.showPopup = true;
  ctrl.titlePopup = title;
  ctrl.contentPopup = content;
  ctrl.typePopup = type;
  $rootScope.$apply();
};

    async function getTaskPermissionProperties() {
  const item = ctrl.Item;
  const sourceId = +item.source_id;
  const SOURCE_ID_LEVEL_1 = [1];
  const SOURCE_ID_LEVEL_2 = [2, 3, 4, 5];

  const isDirectorManage = $filter("checkRuleCheckbox")(TASK_RULE.DIRECTOR_MANAGE);

  const permissions = {
    allowEditTask: false,
    allowDeleteTask: false,
    allowCancelTask: false,
    allowCompleteTask: false,
    allowDoneTask: false,
    allowCreateTransferTicket: false,
    allowHandleTask: false,
  };

  const isUserInvolved = (userList) => userList.indexOf($rootScope.logininfo.data.username) !== -1;
  const isCreator = item.username === $rootScope.logininfo.data.username;

  const setPermissions = (conditions) => {
    permissions.allowEditTask = conditions.allowEditTask ?? permissions.allowEditTask;
    permissions.allowDeleteTask = conditions.allowDeleteTask ?? permissions.allowDeleteTask;
    permissions.allowCancelTask = conditions.allowCancelTask ?? permissions.allowCancelTask;
    permissions.allowCompleteTask = conditions.allowCompleteTask ?? permissions.allowCompleteTask;
    permissions.allowDoneTask = conditions.allowDoneTask ?? permissions.allowDoneTask;
    permissions.allowCreateTransferTicket = conditions.allowCreateTransferTicket ?? permissions.allowCreateTransferTicket;
    permissions.allowDoneTask = conditions.allowDoneTask ?? permissions.allowDoneTask;
    permissions.allowHandleTask = conditions.allowHandleTask ?? permissions.allowHandleTask;
  };

  const getCommonConditions = (departmentId) => {
    const isLeaderManage = $filter("checkRuleDepartmentRadio")(departmentId, TASK_RULE.LEADER_MANAGE);
    const isDepartmentLeaderManage = $filter("checkRuleDepartmentRadio")(departmentId, TASK_RULE.DEPARTMENT_LEADER_MANAGE);
    const isStaffManage = !isDirectorManage && !isLeaderManage && !isDepartmentLeaderManage;

    const isAllowDelete = $filter("checkRuleDepartmentRadio")(departmentId, TASK_RULE.DELETE_TASK_DEPARTMENT);
    const isAllowEdit = $filter("checkRuleDepartmentRadio")(departmentId, TASK_RULE.EDIT_TASK_DEPARTMENT);

    return { isLeaderManage, isDepartmentLeaderManage, isStaffManage, isAllowDelete, isAllowEdit };
  };

  // Check permission for task source 1
  if (SOURCE_ID_LEVEL_1.includes(sourceId)) {
    const { isLeaderManage, isDepartmentLeaderManage, isStaffManage, isAllowDelete, isAllowEdit } = getCommonConditions(item.department?.id);
    const isOnlyHaveDepartmentLeaderManage = isDepartmentLeaderManage && !isDirectorManage && !isLeaderManage;
    const isPIC = isUserInvolved(item.main_person) || isUserInvolved(item.participant) || isUserInvolved(item.observer);

    setPermissions({
      allowEditTask: isDepartmentLeaderManage || isDirectorManage || isLeaderManage || isAllowEdit || isPIC || isCreator,
      allowDeleteTask: (!isStaffManage && !isOnlyHaveDepartmentLeaderManage) || isDirectorManage || isLeaderManage || isAllowDelete || isCreator,
      allowCancelTask: (!isStaffManage && !isOnlyHaveDepartmentLeaderManage) || isDirectorManage || isLeaderManage || isCreator,
      allowCompleteTask: isDirectorManage || isLeaderManage,
      allowDoneTask: isDirectorManage || isLeaderManage || isDepartmentLeaderManage,
      allowCreateTransferTicket: isDirectorManage || isLeaderManage || isDepartmentLeaderManage,
      allowHandleTask: isDepartmentLeaderManage || isDirectorManage || isLeaderManage || isAllowEdit || isPIC || isCreator,

    });

    // Check permission for task source 2,3,4,5
  } else if (item.level == 'TransferTicket') {
    const { isLeaderManage, isDepartmentLeaderManage, isStaffManage, isAllowDelete, isAllowEdit } = getCommonConditions(item.department?.id);
    const isPIC = isUserInvolved(item.main_person) || isUserInvolved(item.participant) || isUserInvolved(item.observer);

    const commonCondition = isDepartmentLeaderManage || isDirectorManage || isLeaderManage
    setPermissions({
      allowEditTask: isAllowEdit || isStaffManage || commonCondition || isLeaderManage || isPIC || isCreator,
      allowHandleTask: isAllowEdit || isStaffManage || commonCondition || isLeaderManage || isPIC || isCreator,
      allowDeleteTask: !isStaffManage && (isAllowDelete || commonCondition || isLeaderManage || isPIC || isCreator),
      allowCancelTask: !isStaffManage && (commonCondition || isPIC || isCreator),
      allowCompleteTask: isLeaderManage || isCreator,
      allowDoneTask: isLeaderManage || isDirectorManage || isDepartmentLeaderManage,
      allowCreateTransferTicket: isLeaderManage || isDirectorManage || isDepartmentLeaderManage
    });

  } else if (item.level === 'Task') {
    const { isLeaderManage, isDepartmentLeaderManage } = getCommonConditions(item.department?.id);
    const result = await task_details_service.loadDetails(item.head_task_id);
    const headTask = result.data;
    const isPIC = isUserInvolved(headTask.main_person) || isUserInvolved(headTask.participant) || isUserInvolved(headTask.observer);

    const commonCondition = isPIC || isCreator || isDirectorManage || isLeaderManage || isDepartmentLeaderManage
    setPermissions({
      allowEditTask: commonCondition,
      allowHandleTask: commonCondition,
      allowDeleteTask: commonCondition,
      allowCancelTask: commonCondition,
      allowCompleteTask: commonCondition,
      allowDoneTask: commonCondition,
      allowCreateTransferTicket: isDirectorManage || isLeaderManage || isDepartmentLeaderManage,
    });
  }
  else if (item.level === 'HeadTask') {
    const { isLeaderManage, isDepartmentLeaderManage, isStaffManage, isAllowDelete, isAllowEdit } = getCommonConditions(item.from_department ?? item.department?.id);
    const isPIC = isUserInvolved(item.main_person) || isUserInvolved(item.participant) || isUserInvolved(item.observer);

    const commonCondition = isDepartmentLeaderManage || isDirectorManage || isLeaderManage
    setPermissions({
      allowEditTask: isAllowEdit || commonCondition || isLeaderManage || isPIC || isCreator,
      allowHandleTask: isAllowEdit || commonCondition || isLeaderManage || isPIC || isCreator,
      allowDeleteTask: !isStaffManage && (isAllowDelete || commonCondition || isLeaderManage || isPIC || isCreator),
      allowCancelTask: !isStaffManage && (commonCondition || isPIC || isCreator),
      allowCompleteTask: commonCondition,
      allowDoneTask: isPIC || commonCondition || isCreator,
      allowCreateTransferTicket: isDirectorManage || isLeaderManage || isDepartmentLeaderManage,
    });
  }

  // check permission base on item status
  if ([TASK_STATUS.PENDING_APPROVAL, TASK_STATUS.WAITING_FOR_APPROVAL, TASK_STATUS.CANCELLED, TASK_STATUS.COMPLETED, TASK_STATUS.NOT_SEEN].includes(item.status)) {
    setPermissions(
      {
        allowEditTask: false,
        allowCancelTask: false,
        allowCreateTransferTicket: false,
      });
  }
  if ([TASK_STATUS.CANCELLED, TASK_STATUS.COMPLETED].includes(item.status)) {
    setPermissions(
      {
        allowHandleTask: false,
      });
  }
  if (![TASK_STATUS.PROCESSING].includes(item.status) || item.progress < 100) {
    setPermissions(
      {
        allowDoneTask: false,
      });
  }
  if (![TASK_STATUS.WAITING_FOR_APPROVAL].includes(item.status) || item.progress < 100) {
    setPermissions(
      {
        allowCompleteTask: false,
      });
  }


  return permissions; }
}
]);
