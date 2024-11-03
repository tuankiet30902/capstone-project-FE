myApp.registerCtrl("event_calendar_container_controller", [
  "event_calendar_service",
  "$q",
  "$rootScope",
  "$timeout",
  "$filter",
  "$scope",
  "$location",
  function (
    event_calendar_service,
    $q,
    $rootScope,
    $timeout,
    $filter,
    $scope,
    $location
  ) {
    var ctrl = this;
    const _statusValueSet = [
      { name: "EventCalendarContainer", action: "init" },
    ];
    {
      ctrl._ctrlName = "event_calendar_container_controller";
      $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
      ctrl.show_tab_management = false;
      ctrl.show_tab_calendar = false;
    }

    const RULE_EVENT_CALENDAR = {
      USE: "Office.EventCalendar.Use", // Sử dụng lịch công tác
      CREATE: "Office.EventCalendar.Create", // Tạo mới lịch công tác
      APPROVE_DEPARTMENT: "Office.EventCalendar.ApprovalDepartment", // TP duyệt
      APPROVE_LEAD: "Office.EventCalendar.FinalApproval", // Lãnh đạo đơn vị duyệt
      MANAGE: "Office.EventCalendar.Manage", // Quản lý lịch công tác
    };

    function setUrlContent() {
      switch (ctrl.tab) {
        case "Management":
          ctrl._urlContent =
            FrontendDomain +
            "/modules/office/event_calendar/views/management.html";
          break;

        case "Calendar":
          ctrl._urlContent =
            FrontendDomain +
            "/modules/office/event_calendar/views/calendar.html";
          break;
        default:
          ctrl._urlContent =
            FrontendDomain +
            "/modules/office/event_calendar/views/management.html";
          break;
      }
    }

    ctrl.switchTab = function (val) {
      $location.url("/event-calendar?tab=" + val);
      ctrl.tab = val;
      setUrlContent();
    };

    ctrl.logininfo = $rootScope.logininfo;
    
    function init() {
      if(
        $filter('hasRule')(RULE_EVENT_CALENDAR.CREATE) ||
        $filter('hasRule')(RULE_EVENT_CALENDAR.APPROVE_DEPARTMENT) ||
        $filter('hasRule')(RULE_EVENT_CALENDAR.APPROVE_LEAD)
      ){
        ctrl.show_tab_management = true;
      }

      if(
        $filter('hasRule')(RULE_EVENT_CALENDAR.USE) ||
        $filter('hasRule')(RULE_EVENT_CALENDAR.CREATE) ||
        $filter('hasRule')(RULE_EVENT_CALENDAR.APPROVE_DEPARTMENT) ||
        $filter('hasRule')(RULE_EVENT_CALENDAR.APPROVE_LEAD) ||
        $filter('hasRule')(RULE_EVENT_CALENDAR.MANAGE)

      ){
        ctrl.show_tab_calendar = true;
      }

      ctrl.tab = getTab();

      setUrlContent();
    
    }

    function getTab() {
      const tab = $location.search().tab;
    
      if (!ctrl.show_tab_management) {
        return "Calendar";
      }
    
      if (["Management", "Calendar"].includes(tab)) {
        return tab;
      }
    
      return "Management";
    }

    init();
  },
]);

myApp.registerCtrl("event_calendar_management_controller", [
  "event_calendar_service",
  "car_registration_service",
  "$q",
  "$rootScope",
  "$timeout",
  "$filter",
  "$scope",
  "languageValue",
  function (
    event_calendar_service,
    car_registration_service,
    $q,
    $rootScope,
    $timeout,
    $filter,
    $scope,
    $languageValue
  ) {
    const _statusValueSet = [
      { name: "EventCalendar", action: "load" },
      { name: "EventCalendar", action: "count" },
      { name: "EventCalendar", action: "removeFile" },
      { name: "EventCalendar", action: "pushFile" },
      { name: "EventCalendar", action: "insert" },
      { name: "EventCalendar", action: "update" },
      { name: "EventCalendar", action: "creator_update" },
      { name: "EventCalendar", action: "RegisterMeetingRoom" },
      { name: "EventCalendar", action: "loadRoomType" },

      { name: "EventCalendar", action: "approve_department" },
      { name: "EventCalendar", action: "reject_department" },
      { name: "EventCalendar", action: "approve_host" },
      { name: "EventCalendar", action: "reject_host" },
      { name: "EventCalendar", action: "request_cancel" },
      { name: "EventCalendar", action: "creator_delete" },
      { name: "EventCalendar", action: "approve_recall_department" },
      { name: "EventCalendar", action: "reject_recall_department" },
      { name: "EventCalendar", action: "approve_recall_host" },
      { name: "EventCalendar", action: "reject_recall_host" },

      { name: "CarManagement", action: "insert" },
    ];

    var ctrl = this;

    ctrl.logininfo = $rootScope.logininfo;

    {
      ctrl._ctrlName = "event_calendar_management_controller";
      ctrl.$languageValue = $languageValue;
      ctrl.eventCalendarList = [];
      ctrl.currentPage = 1;
      ctrl.numOfItemPerPage = 20;
      ctrl.tab = "Management";
      ctrl.totalItems = 0;
      ctrl.offset = 0;
      ctrl._notyetInit = true;
      ctrl.sort = { from_date: -1 };
      ctrl._searchByKeyToFilterData = "";
      const today = new Date();
      ctrl._filterFromDate = new Date(today.getFullYear(), today.getMonth(), 1);
      ctrl._filterToDate = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      );

      ctrl.checkbox_responsibility = false;
      ctrl.checkbox_created = false;
      ctrl.checkbox_hanlded = false;
      ctrl.checkbox_rejected = false;
      ctrl.checkbox_needhandle = false;
      ctrl.checkbox_personally_involved = false;
      ctrl.checkbox_level_1 = false;
      ctrl.checkbox_level_2 = false;


      ctrl.show_checkbox_responsibility = false;
      ctrl.show_checkbox_created = false;
      ctrl.show_checkbox_hanlded = false;
      ctrl.show_checkbox_rejected = false;
      ctrl.show_checkbox_needhandle = false;
      ctrl.show_checkbox_personally_involved = false;
      ctrl.show_checkbox_level_1 = false;
      ctrl.show_checkbox_level_2 = false;

      $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

      ctrl._update_item = {};
      ctrl._delete_item = {};
      ctrl._request_cancel_item = {};
      ctrl._value_insert_registration_room = {};
      ctrl._roomTypes = [];

      ctrl._assess_value = {};
      ctrl._insert_car_value = {};

      ctrl._urlRegisterModal = FrontendDomain + "/modules/office/event_calendar/views/insert_event_modal.html";
      ctrl._urlUpdateModal = FrontendDomain + "/modules/office/event_calendar/views/update_event_modal.html";

      ctrl._urlAssessModal = FrontendDomain + "/modules/office/event_calendar/views/assess_event_calendar_modal.html";

      ctrl._urlConfirmDeleteModal = FrontendDomain + "/modules/office/event_calendar/views/delete_event_calendar_modal.html";
      ctrl._urlConfirmRequestCancelModal = FrontendDomain + "/modules/office/event_calendar/views/request_cancel_event_calendar_modal.html";
      ctrl._urlInsertRoomRegistrationModal = FrontendDomain + "/modules/office/event_calendar/views/insert_room_registration_modal.html";
      ctrl._urlInsertCarRegistrationModal = FrontendDomain + "/modules/office/event_calendar/views/insert_car_registration_modal.html";

      ctrl._urlAssessEventCalendarModal = FrontendDomain + "/modules/office/event_calendar/views/assess_event_calendar_modal.html";
      ctrl._customToastScope = angular.element(document.querySelector("#custom-toast-container")).scope();

      ctrl.location_config = {
        master_key: "location_list",
        load_details_column: "value",
      };

      ctrl.room_config = {
        master_key: "meeting_room",
        load_details_column: "value",
      };

      ctrl.now = new Date();

      ctrl._hintNoteSet = [
        'I agree',
        'I refuse',
        'Incorrect information',
        'Out of cars',
        'Out of cards',
    ];
    }

    const EVENT_CALENDAR_TYPE = {
      ONLINE: "Online",
      OFFLINE_ONSITE: "OfflineOnSite",
      OFFLINE_OFFSITE: "OfflineOffSite",
    };

    const STATUS_EVENT_CALENDAR = {
      CREATED: "Registered",
      LEADER_DEPARTMENT_APPROVED: "DepartmentApproved",
      CONFIRMER_APPROVED: "ManagerApproved",
      LEAD_APPROVED: "OrganizationApproved",
      REQUEST_CANCEL: "RequestCancel",
      CANCELLED: "Cancelled",
      REJECTED: "Rejected",
    };

    const RULE_EVENT_CALENDAR = {
      APPROVE_DEPARTMENT: "Office.EventCalendar.ApprovalDepartment", // TP duyệt
      CONFIRM: "Office.EventCalendar.OtherApproval", // Quản lý lịch công tác duyệt
      APPROVE_LEAD: "Office.EventCalendar.FinalApproval", // Lãnh đạo đơn vị duyệt
      CREATE: "Office.EventCalendar.Create", // Tạo mới lịch công tác
      EDIT: "Office.EventCalendar.Edit", // Chỉnh sửa lịch công tác
      USE: "Office.EventCalendar.Use", // Sử dụng lịch công tác
      CREATE: "Office.EventCalendar.Create", // Sử dụng lịch công tác
      DELETE: "Office.EventCalendar.Delete", // Xóa lịch công tác
      MANAGE: "Office.EventCalendar.Manage", // Quản lý lịch công tác
    };

    const FLOW_STATUS = {
      APPROVE: "Approve",
      CANCEL: "Cancel",
    };

    const LEVEL_EVENT_CALENDAR = {
      LEVEL_1: "Level_1",
      LEVEL_2: "Level_2",
    }

    const ROOM_RULE = {
      REGISTER: "Office.MeetingRoomSchedule.register",
    };

    const ROOM_TYPE = {
      MEETING: "MeetingRoom",
      CLASS: "LectureHallClassroom",
    };

    ctrl.level_event_calendar = [
      {
        value: LEVEL_EVENT_CALENDAR.LEVEL_1,
        label: "Level_1",
      },
      {
        value: LEVEL_EVENT_CALENDAR.LEVEL_2,
        label: "Level_2",
      },
    ]

    ctrl.getTextStatusByFlow = function (status, flow) {
      switch (status) {
        case STATUS_EVENT_CALENDAR.CREATED:
          if (flow === FLOW_STATUS.APPROVE) {
            return $filter("l")("Registered");
          }

          if (flow === FLOW_STATUS.CANCEL) {
            return $filter("l")("RegisteredRecall");
          }
          break;
        case STATUS_EVENT_CALENDAR.LEADER_DEPARTMENT_APPROVED:
          if (flow === FLOW_STATUS.APPROVE) {
            return $filter("l")("DepartmentApproved");
          }

          if (flow === FLOW_STATUS.CANCEL) {
            return $filter("l")("ApprovedRecallByDepartmentLeader");
          }
          break;
        case STATUS_EVENT_CALENDAR.CONFIRMER_APPROVED:
          if (flow === FLOW_STATUS.APPROVE) {
            return $filter("l")("Confirmed");
          }

          if (flow === FLOW_STATUS.CANCEL) {
            return $filter("l")("ConfirmedEventCalendarRecall");
          }
          break;

        case STATUS_EVENT_CALENDAR.LEAD_APPROVED:
          if (flow === FLOW_STATUS.APPROVE) {
            return $filter("l")("Approved");
          }
          break;
        case STATUS_EVENT_CALENDAR.CANCELLED:
          return $filter("l")("cancelled");
        case STATUS_EVENT_CALENDAR.REJECTED:
          return $filter("l")("RejectedRegistration");
      }
    };

    ctrl.loadfile = function (params) {
      return function () {
          var dfd = $q.defer();
          event_calendar_service.load_file_info(params.id, params.name).then(
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

    ctrl.department_config = {
      master_key: "department",
      load_details_column: "value",
    };

    ctrl.getStatusLocalized = function (statusKey) {
      return $filter("l")(ctrl.statusMap[statusKey]);
    };

    function resetPaginationInfo() {
      ctrl.currentPage = 1;
      ctrl.totalItems = 0;
      ctrl.offset = 0;
    }

    function generateFilter_created() {
      var obj = {};
      obj.checks = [];
      obj.levels = [];
      if(ctrl._searchByKeyToFilterData){
        obj.search = ctrl._searchByKeyToFilterData;
      }

      if (ctrl._filterFromDate) {
        obj.from_date = angular.copy(ctrl._filterFromDate.getTime());
      }

      if (ctrl._filterToDate) {
        obj.to_date = angular.copy(ctrl._filterToDate.getTime());
      }

      if (ctrl._filterStatus) {
        obj.status = angular.copy(ctrl._filterStatus);
      }

      if (ctrl.checkbox_responsibility && ctrl.show_checkbox_responsibility) {
        obj.checks.push("ResponsibleUnit");
      }

      if (ctrl.checkbox_created && ctrl.show_checkbox_created) {
        obj.checks.push("Created");
      }

      if (ctrl.checkbox_needhandle && ctrl.show_checkbox_needhandle) {
        obj.checks.push("NeedToHandle");
      }

      if (ctrl.checkbox_personally_involved && ctrl.show_checkbox_personally_involved) {
        obj.checks.push("PersonallyInvolved");
      }

      if (ctrl.checkbox_hanlded && ctrl.show_checkbox_hanlded) {
        obj.checks.push("Handled");
      }

      if (ctrl.checkbox_rejected && ctrl.show_checkbox_rejected) {
        obj.checks.push("Rejected");
      }

      if(ctrl.checkbox_level_1 && ctrl.show_checkbox_level_1){
        obj.levels.push(LEVEL_EVENT_CALENDAR.LEVEL_1);
      }

      if(ctrl.checkbox_level_2 && ctrl.show_checkbox_level_2){
        obj.levels.push(LEVEL_EVENT_CALENDAR.LEVEL_2);
      }

      return obj;
    }

    ctrl.refreshData = function () {
      ctrl.loadList();
      ctrl.countGroup();
      resetPaginationInfo();
    };

    function loadEventCalendarList() {
      var dfd = $q.defer();
      ctrl.eventCalendarList = [];
      const filter = generateFilter_created();
      event_calendar_service
        .load(
          ctrl.tab,
          ctrl.offset,
          ctrl.numOfItemPerPage,
          filter.search,
          ctrl.sort,
          filter.checks,
          filter.levels
        )
        .then(
          function (res) {
            ctrl.eventCalendarList = res.data.map((event) => ({
              ...event,
              ...getPermissionProperties(event),
            }));
            dfd.resolve(true);
          },
          function (err) {
            dfd.reject(err);
          }
        );
      return dfd.promise;
    }

    ctrl.loadList = function (val) {
      if (val != undefined) {
        ctrl.offset = angular.copy(val);
      }
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "EventCalendar",
        "load",
        loadEventCalendarList
      );
    };

    function countEventCalendarList() {
      var dfd = $q.defer();
      const filter = generateFilter_created();
      event_calendar_service
        .count(
          ctrl.tab,
          filter.checks,
          filter.search,
          filter.levels,
        )
        .then(
          function (res) {
            ctrl.totalItems = res.data[0].count;
            dfd.resolve(true);
          },
          function (err) {
            dfd.reject(err);
          }
        );
      return dfd.promise;
    }

    ctrl.countGroup = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "EventCalendar",
        "count",
        countEventCalendarList
      );
    };

    function getPermissionProperties(item) {
      let allow_edit = false;
      let allow_creator_edit = false;
      let allow_assess_department = false;
      let allow_assess_host = false;
      let allow_delete = false;
      let allow_cancel = false;
      let allow_request_cancel = false;
      let allow_assesst_recall_department = false;
      let allow_assess_host_recall = false;
      let allow_assess_recall_host = false;
      
      let status_show = '';

      if(item.flow_status === FLOW_STATUS.APPROVE){
        switch(item.status){
          case STATUS_EVENT_CALENDAR.CREATED:
            if ($rootScope.logininfo.username === item.username) {
              allow_creator_edit = true;
              allow_delete = true;
            }
            if ($filter('checkRuleDepartmentRadio')(item.department, RULE_EVENT_CALENDAR.APPROVE_DEPARTMENT)) {
              allow_assess_department = true;
            }
            status_show = "Registered";
            break;

          case STATUS_EVENT_CALENDAR.LEADER_DEPARTMENT_APPROVED:
            if(item.level === LEVEL_EVENT_CALENDAR.LEVEL_2){
              if ($filter('checkRuleDepartmentRadio')(item.department, RULE_EVENT_CALENDAR.APPROVE_DEPARTMENT)){
                allow_edit = true;
                allow_request_cancel = true;
              }

              if($rootScope.logininfo.username === item.username){
                allow_edit = true;
                allow_request_cancel = true;
              }
              status_show = 'Approved';
              break;
            }

            // Nếu là cấp 1 thì ban giám hiệu/ người chủ trì phải duyệt
            status_show = 'DepartmentApproved';
            if($rootScope.logininfo.username === item.main_person){
              allow_assess_host = true;
            }

            break;
          case STATUS_EVENT_CALENDAR.LEAD_APPROVED:
            status_show = 'Approved';

            // Người tạo/ trưởng phòng/ ban giám hiệu đc chỉnh sửa
            if(
              $rootScope.logininfo.username === item.username ||
              $rootScope.logininfo.username === item.main_person ||
              $filter('checkRuleDepartmentRadio')(item.department, RULE_EVENT_CALENDAR.APPROVE_DEPARTMENT)
            ){
              allow_edit = true;
              allow_request_cancel = true;
            }
            break;
        }
      }else if(item.flow_status === FLOW_STATUS.CANCEL){
        switch(item.status) {
          case STATUS_EVENT_CALENDAR.CREATED:
            if ($filter('checkRuleDepartmentRadio')(item.department, RULE_EVENT_CALENDAR.APPROVE_DEPARTMENT)) {
              allow_assesst_recall_department = true;
            }
            status_show = 'Requestcanceled';
            break;
          case STATUS_EVENT_CALENDAR.LEADER_DEPARTMENT_APPROVED:
            if(item.level === LEVEL_EVENT_CALENDAR.LEVEL_2){
              status_show = 'Cancelled';
              break;
            }

            status_show = 'DepartmentApprovedCancel';
            if($rootScope.logininfo.username === item.main_person){
              allow_assess_recall_host = true;
            }
            break;
          
          case STATUS_EVENT_CALENDAR.CANCELLED:
            status_show = 'Cancelled';
            break;
        }
      }

      if(item.status === STATUS_EVENT_CALENDAR.REJECTED){
        status_show = 'Rejected';
      }

      if(item.status === STATUS_EVENT_CALENDAR.CANCELLED){
        status_show = 'Cancelled';
      }

      if(item.end_date < new Date()) {
        return {status_show};
      }

      return {
        allow_edit,
        allow_assess_department,
        allow_assess_host,
        allow_delete,
        allow_cancel,
        status_show,
        allow_creator_edit,
        allow_request_cancel,
        allow_assess_host_recall,
        allow_assesst_recall_department,
        allow_assess_recall_host
      }
    }

    //Start assess
    ctrl.set_hint_note = function(note) {
      ctrl._assess_value.note = $filter('l')(note);
    }

    ctrl.prepareAssess = function ({ item, action }) {
      console.log(item);
      ctrl._assess_value = angular.copy(item);
      ctrl._assess_value.action = action;
      ctrl._assess_value.note = "";
      ctrl._assess_value.note_required = true;
      switch (action) {
          case "approve_department":
              ctrl._assess_value.note_placeholder = $filter('l')('You can note for accept');
              break;
          case "reject_department":
              ctrl._assess_value.note_placeholder = $filter('l')('You need to note for reject');
              ctrl._assess_value.note_required = true;
              break;
          case "approve_host":
              ctrl._assess_value.note_placeholder = $filter('l')('You can note for accept');
              break;
          case "reject_host":
            ctrl._assess_value.note_placeholder = $filter('l')('You need to note for reject');
            ctrl._assess_value.note_required = true;
            break;
          case "request_cancel":
            ctrl._assess_value.note_placeholder = $filter('l')('You need to note for request cancel');
            ctrl._assess_value.note_required = true;
            break;
          case "creator_delete":
            ctrl._assess_value.note_placeholder = '';
            break;
          
          case "approve_recall_department":
            ctrl._assess_value.note_placeholder = $filter('l')('You can note for accept');
            break;
          case "reject_recall_department":
            ctrl._assess_value.note_placeholder = $filter('l')('You need to note for reject');
            ctrl._assess_value.note_required = true;
            break;
          case "approve_recall_host":
            ctrl._assess_value.note_placeholder =$filter('l')('You can note for accept');
            break;
          case "reject_recall_host":
            ctrl._assess_value.note_placeholder = $filter('l')('You need to note for reject');
            ctrl._assess_value.note_required = true;
            break;
      }
      $rootScope.statusValue.generate(ctrl._ctrlName, "EventCalendar", action);
    }

    ctrl.approve_department = function(){
      return $rootScope.statusValue.execute(ctrl._ctrlName, "EventCalendar", "approve_department", access_service("approve_department"));
    }

    ctrl.reject_department = function(){
      return $rootScope.statusValue.execute(ctrl._ctrlName, "EventCalendar", "reject_department", access_service("reject_department"));
    }

    ctrl.approve_host = function(){
      return $rootScope.statusValue.execute(ctrl._ctrlName, "EventCalendar", "approve_host", access_service("approve_host"));
    }

    ctrl.reject_host = function(){
      return $rootScope.statusValue.execute(ctrl._ctrlName, "EventCalendar", "reject_host", access_service("reject_host"));
    }

    ctrl.request_cancel = function(){
      return $rootScope.statusValue.execute(ctrl._ctrlName, "EventCalendar", "request_cancel", access_service("request_cancel"));
    }

    ctrl.approve_recall_department = function(){
      return $rootScope.statusValue.execute(ctrl._ctrlName, "EventCalendar", "approve_recall_department", access_service("approve_recall_department"));
    }

    ctrl.reject_recall_department = function(){
      return $rootScope.statusValue.execute(ctrl._ctrlName, "EventCalendar", "reject_recall_department", access_service("reject_recall_department"));
    }

    ctrl.approve_recall_host = function(){
      return $rootScope.statusValue.execute(ctrl._ctrlName, "EventCalendar", "approve_recall_host", access_service("approve_recall_host"));
    }

    ctrl.reject_recall_host = function(){
      return $rootScope.statusValue.execute(ctrl._ctrlName, "EventCalendar", "reject_recall_host", access_service("reject_recall_host"));
    }

    ctrl.creator_delete = function(){
      return $rootScope.statusValue.execute(ctrl._ctrlName, "EventCalendar", "creator_delete", access_service("creator_delete"));
    }

    function access_service(action) {
      return function () {
          var dfd = $q.defer();
          let dfdAr = [];
          let messageSuccess = '';
          switch (action) {
              case "approve_department":
                messageSuccess = $filter('l')('Accept registration successfully');
                dfdAr.push(event_calendar_service.approve_department(ctrl._assess_value._id, ctrl._assess_value.note));
                break;
              case "reject_department":
                messageSuccess = $filter('l')('RejectedRegistration');
                dfdAr.push(event_calendar_service.reject_department(ctrl._assess_value._id, ctrl._assess_value.note));
                break;
              case "approve_host":
                messageSuccess = $filter('l')('Accept registration successfully');
                dfdAr.push(event_calendar_service.approve_host(ctrl._assess_value._id, ctrl._assess_value.note));
                break;
              case "reject_host":
                messageSuccess = $filter('l')('RejectedRegistration');
                dfdAr.push(event_calendar_service.reject_host(ctrl._assess_value._id, ctrl._assess_value.note));
                break;
              case "request_cancel":
                messageSuccess = $filter('l')('Requestcanceled');
                dfdAr.push(event_calendar_service.request_cancel(ctrl._assess_value._id, ctrl._assess_value.note));
                break;
              case "creator_delete":
                messageSuccess = $filter('l')('Deleted');
                dfdAr.push(event_calendar_service.creator_delete(ctrl._assess_value._id));
                break;
              case "approve_recall_department":
                messageSuccess = $filter('l')('Accept registration successfully');
                dfdAr.push(event_calendar_service.approve_recall_department(ctrl._assess_value._id, ctrl._assess_value.note));
                break;
              case "reject_recall_department":
                messageSuccess = $filter('l')('RejectedRegistration');
                dfdAr.push(event_calendar_service.reject_recall_department(ctrl._assess_value._id, ctrl._assess_value.note));
                break;
              case "approve_recall_host":
                messageSuccess = $filter('l')('Accept registration successfully');
                dfdAr.push(event_calendar_service.approve_recall_host(ctrl._assess_value._id, ctrl._assess_value.note));
                break;
              case "reject_recall_host":
                messageSuccess = $filter('l')('RejectedRegistration');
                dfdAr.push(event_calendar_service.reject_recall_host(ctrl._assess_value._id, ctrl._assess_value.note));
                break;
          }
          $q.all(dfdAr).then(function () {
              ctrl.refreshData();
              $rootScope.statusValue.generate(ctrl._ctrlName, "EventCalendar", action);
              $("#modal_EventCalendarRegistration_Assess").modal('hide');
              ctrl._customToastScope.addToastValue({
                message: messageSuccess,
                type: 'success'
              });
              dfd.resolve(true);
              dfd = undefined;
          }, function (err) {
              dfd.reject(err);
              err = undefined;
          });
          return dfd.promise;
      }
  }


    //Start insert
    ctrl.chooseDateStartDate_insert = function (val) {
      if(ctrl._insert_value !== undefined){
          ctrl._insert_value.start_date = val.getTime();
      }
    }

    ctrl.chooseDateEndDate_insert = function (val) {
      if(ctrl._insert_value !== undefined){
          ctrl._insert_value.end_date = val.getTime();
      }
    }

    ctrl.prepareInsert = function () {
      let today = new Date();
      let now = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), 0);
      let endTime = new Date(now.getTime() + 1 * 60 * 60 * 1000);
      ctrl._insert_value = {
        title: "", //1
        type: "Online", //1
        departments: [], //1
        mainPerson: null, //1
        start_date: now, //1
        end_date: endTime, //1
        content: "", //1
        attachments: [], //1
        participant: [],
        participants: [], //1
        meeting_link: "", //1
        room_booking_id: "",
        vehicle_booking_id: "",
        level: ctrl.level_event_calendar[0].value
      };

      $rootScope.statusValue.generate(
        ctrl._ctrlName,
        "EventCalendar",
        "insert"
      );
    };

    ctrl.pickMainperson_insert = function (params) {
      ctrl._insert_value.mainPerson = params;
    };

    ctrl.chooseDepartment_insert = function (params) {
      ctrl._insert_value.departments = params;
    };

    ctrl.pickEmployee_insert = function (params) {
      ctrl._insert_value.participants = params;
    };

    ctrl.removeFile = function (params) {
      ctrl._insert_value.attachments = ctrl._insert_value.attachments.filter(
        (file) => file.name !== params.name
      );
    };

    ctrl.insert = function () {
      // Add validation for required fields before insertion
      if (ctrl._insert_value.start_date >= ctrl._insert_value.end_date) {
        alert("Start date must be before end date");
        return;
      }

      // Call the insert service method
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "EventCalendar",
        "insert",
        insert_service
      );
    };

    function insert_service() {
      let dfd = $q.defer();
      const dataInsert = genDataInsert();
      event_calendar_service.insert(dataInsert).then(
        function (res) {
          dfd.resolve(true);
          ctrl.loadList();
          $("#modal_Event_Calendar_Insert").modal("hide");
          ctrl._customToastScope.addToastValue({
            message: $filter("l")("RegisterEventCalendarSuccess"),
            type: "success",
          });
        },
        function (err) {
          //
        }
      );
      return dfd.promise;
    }

    function genDataInsert() {
      const data = {
        title: ctrl._insert_value.title,
        start_date: new Date(ctrl._insert_value.start_date).getTime(),
        end_date: new Date(ctrl._insert_value.end_date).getTime(),
        main_person: ctrl._insert_value.mainPerson,
        departments: ctrl._insert_value.departments,
        participants: ctrl._insert_value.participants,
        content: ctrl._insert_value.content,
        type: ctrl._insert_value.type,
        room_booking_id: "",
        vehicle_booking_id: "",
        attachments: ctrl._insert_value.attachments,
        level: ctrl._insert_value.level,
        meeting_link: ctrl._insert_value.meeting_link,
      };

      switch (ctrl._insert_value.type) {
        case EVENT_CALENDAR_TYPE.OFFLINE_ONSITE:
          data.room_booking_id = ctrl._insert_value.room_booking_id;
          break;
        case EVENT_CALENDAR_TYPE.OFFLINE_OFFSITE:
          data.vehicle_booking_id = ctrl._insert_value.vehicle_booking_id;
          break;
      }

      return data;
    }
    //End insert

    //Start update
    ctrl.chooseStartDate_update = function (val) {
      if(ctrl._update_item !== undefined){
          ctrl._update_item.start_date = val.getTime();
      }
    }

    ctrl.chooseEndDate_update = function (val) {
      if(ctrl._update_item !== undefined){
          ctrl._update_item.end_date = val.getTime();
      }
    }

    ctrl.prepareUpdate = function (item) {
      ctrl._update_item = angular.copy(item);
      ctrl._update_item = {
        ...ctrl._update_item,
        start_date: new Date(ctrl._update_item.start_date),
        end_date: new Date(ctrl._update_item.end_date),
        new_attachments: [],
        remove_attachments: [],
      };
    };

    ctrl.removeFileUpdate = function (item) {
      ctrl._update_item.remove_attachments.push(item.id);
      ctrl._update_item.attachments = ctrl._update_item.attachments.filter(
        (file) => file.id !== item.id
      );
    };

    ctrl.removeNewFileUpdate = function (item) {
      ctrl._update_item.new_attachments =
        ctrl._update_item.new_attachments.filter(
          (file) => file.name !== item.name
        );
    };

    ctrl.pickMainperson_update = function (params) {
      ctrl._update_item.main_person = params;
    };

    ctrl.chooseDepartment_update = function (params) {
      ctrl._update_item.departments = params;
    };

    ctrl.pickEmployee_update = function (params) {
      ctrl._update_item.participants = params;
    };

    ctrl.creator_update = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "EventCalendar",
        "creator_update",
        creator_update_service
      );
    };

    function creator_update_service() {
      let dfd = $q.defer();
      const dataUpdate = genDataUpdate();
      event_calendar_service.creator_update(dataUpdate).then(
        function (res) {
          dfd.resolve(true);
          ctrl.loadList();
          $("#modal_Event_Calendar_Update").modal("hide");
          ctrl._customToastScope.addToastValue({
            message: $filter("l")("UpdateInfoSuccess"),
            type: "success",
          });
        },
        function (err) {
          //
        }
      );
      return dfd.promise;
    }

    function genDataUpdate() {
      const data = {
        id: ctrl._update_item._id,
        title: ctrl._update_item.title,
        type: ctrl._update_item.type,
        start_date: new Date(ctrl._update_item.start_date).getTime(),
        end_date: new Date(ctrl._update_item.end_date).getTime(),
        main_person: ctrl._update_item.main_person,
        departments: ctrl._update_item.departments,
        title: ctrl._update_item.title,
        participants: ctrl._update_item.participants,
        content: ctrl._update_item.content,
        meeting_link: "",
        room_booking_id: "",
        vehicle_booking_id: "",
        remove_attachments: ctrl._update_item.remove_attachments,
        new_attachments: ctrl._update_item.new_attachments,
      };

      switch (ctrl._update_item.type) {
        case EVENT_CALENDAR_TYPE.ONLINE:
          data.meeting_link = ctrl._update_item.meeting_link;
          break;
        case EVENT_CALENDAR_TYPE.OFFLINE_ONSITE:
          data.room_booking_id = ctrl._update_item.room_booking_id;
          break;
        case EVENT_CALENDAR_TYPE.OFFLINE_OFFSITE:
          data.vehicle_booking_id = ctrl._update_item.vehicle_booking_id;
          break;
      }

      return data;
    }

    //End update

    //Insert registration room
    function generateResetRegistrationRoomValue() {
      ctrl._value_insert_registration_room = {
        title: ctrl._insert_value.title,
        type: ROOM_TYPE.MEETING,
        date_start: ctrl._insert_value.start_date,
        date_end: ctrl._insert_value.end_date,
        host: ctrl._insert_value.mainPerson,
        participants: ctrl._insert_value.participants,
        to_department: ctrl._insert_value.departments,
        otherHosts: [],
        otherHost: "",
        content: ctrl._insert_value.content,
        person: 10,
        helpdesk: false,
        helpdesk_text: "",
        service_proposal: false,
        service_proposal_text: "",
        teabreak: false,
        teabreak_text: "",
        files: ctrl._insert_value.attachments,
      };
    }

    ctrl.prepareInsertRegistrationRoom = function () {
      generateResetRegistrationRoomValue();
      if (ctrl._roomTypes.length < 1) {
        ctrl.load_room_type();
      }
      $("#modal_EventCalendar_Insert_RegistrationRoom").modal("show");
    };

    ctrl.load_room_type = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "EventCalendar",
        "loadRoomType",
        load_room_type_service
      );
    };

    function load_room_type_service() {
      var dfd = $q.defer();
      event_calendar_service.load_room_type().then(
        function (res) {
          dfd.resolve(true);
          ctrl._roomTypes = res.data.map((type) => ({
            label: type.title,
            val: type.value,
          }));
          ctrl._value_insert_registration_room.type = ctrl._roomTypes[0].val;
        },
        function (err) {
          dfd.reject(err);
          err = undefined;
        }
      );
      return dfd.promise;
    }

    ctrl._choose_host_insert_registration_room = function (params) {
      ctrl._value_insert_registration_room.host = params;
    };

    ctrl.pickEmployee_insert_registration_room = function (params) {
      ctrl._insert_value.participants = params;
    };

    ctrl.chooseDepartment_insert_registration_room = function (params) {
      ctrl._value_insert_registration_room.to_department = params;
    };

    ctrl.removeFileInsertRoomRegistration = function (file) {
      ctrl._value_insert_registration_room.files =
        ctrl._value_insert_registration_room.files.filter(
          (item) => item.name !== file.name
        );
    };

    ctrl.add_other_host_registration_room = function () {
      if (!ctrl._value_insert_registration_room.otherHost) {
        return;
      }
      const id =
        Date.now().toString() + Math.random().toString(36).substring(2, 10);
      ctrl._value_insert_registration_room.otherHosts.push({
        id: id,
        name: ctrl._value_insert_registration_room.otherHost,
      });
      ctrl._value_insert_registration_room.otherHost = "";
    };

    ctrl.delete_other_host_registration_room = function (id) {
      ctrl._value_insert_registration_room.otherHosts =
        ctrl._value_insert_registration_room.otherHosts.filter(
          (item) => item.id !== id
        );
    };

    ctrl.register_registration_room = function () {
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "EventCalendar",
        "RegisterMeetingRoom",
        register_registration_room_service
      );
    };

    function register_registration_room_service() {
      var dfd = $q.defer();
      const dataRegister = {
        title: ctrl._value_insert_registration_room.title,
        date_start: new Date(
          ctrl._value_insert_registration_room.date_start
        ).getTime(),
        date_end: new Date(
          ctrl._value_insert_registration_room.date_end
        ).getTime(),
        type: ctrl._value_insert_registration_room.type,
        host: ctrl._value_insert_registration_room.host,
        participants: ctrl._value_insert_registration_room.participants,
        other_participants: ctrl._value_insert_registration_room.otherHosts.map(
          (person) => person.name
        ),
        to_department: ctrl._value_insert_registration_room.to_department,
        content: ctrl._value_insert_registration_room.content,
        person: ctrl._value_insert_registration_room.person,
        teabreak: ctrl._value_insert_registration_room.teabreak,
        helpdesk: ctrl._value_insert_registration_room.helpdesk,
        service_proposal: ctrl._value_insert_registration_room.service_proposal,
        files: ctrl._value_insert_registration_room.files,
      };

      if (dataRegister.teabreak) {
        dataRegister.teabreak_text =
          ctrl._value_insert_registration_room.teabreak_text;
      }

      if (dataRegister.helpdesk) {
        dataRegister.helpdesk_text =
          ctrl._value_insert_registration_room.helpdesk_text;
      }

      if (dataRegister.service_proposal) {
        dataRegister.service_proposal_text =
          ctrl._value_insert_registration_room.service_proposal_text;
      }
      event_calendar_service.registerRegistrationRoom(dataRegister).then(
        function (response) {
          $("#modal_EventCalendar_Insert_RegistrationRoom").modal("hide");
          ctrl._insert_value.room_booking_id = response.data._id;
          dfd.resolve(true);
          ctrl._customToastScope.addToastValue({
            message: $filter("l")("RegisterRoomSCheduleSuccess"),
            type: "success",
          });
        },
        function (err) {
          dfd.reject(err);
          err = undefined;
        }
      );
      return dfd.promise;
    }
    //End insert registration room

    //Start insert registration car

    ctrl.prepareInsertCar = function(){
      ctrl._insert_car_value.title = ctrl._insert_value.title;
      ctrl._insert_car_value.files = [];
      ctrl._insert_car_value.destination = "";
      ctrl._insert_car_value.passenger = angular.copy(ctrl._insert_value.participants);
      ctrl._insert_car_value.time_to_go = new Date(angular.copy(ctrl._insert_value.start_date));
      ctrl._insert_car_value.pick_up_time = new Date(angular.copy(ctrl._insert_value.end_date));
      ctrl._insert_car_value.to_department = angular.copy(ctrl._insert_value.departments);
      ctrl._insert_car_value.content = ctrl._insert_value.content;
      ctrl._insert_car_value.number_of_people = ctrl._insert_car_value.passenger.length;
      ctrl._insert_car_value.min_of_people = ctrl._insert_car_value.number_of_people;
      $('#modal_CarRegistration_Insert').modal('show');

    }

    ctrl.pick_department_insert_car = function(params){
      ctrl._insert_car_value.to_department = params;
    }

    ctrl.removeFile_insert_car = function(item){
      ctrl._insert_car_value.files = ctrl._insert_car_value.files.filter(file => file.name !== item.name);
    }

    ctrl.insert_car = function(){
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "CarManagement",
        "insert",
        insert_car_service
      );
    }

    ctrl.pick_starting_place_insert_car = function (val) {
      ctrl._insert_car_value.starting_place = val.value;
    }

    function insert_car_service() {
      var dfd = $q.defer();
      car_registration_service.insert(
          ctrl._insert_car_value.files,
          ctrl._insert_car_value.starting_place,
          ctrl._insert_car_value.destination,
          ctrl._insert_car_value.passenger,
          ctrl._insert_car_value.number_of_people,
          ctrl._insert_car_value.time_to_go.getTime(),
          ctrl._insert_car_value.pick_up_time.getTime(),
          ctrl._insert_car_value.to_department,
          ctrl._insert_car_value.content,
          ctrl._insert_car_value.title,
      )
          .then(function (dataInsert) {
              ctrl._insert_value.vehicle_booking_id = dataInsert.data._id;
              dfd.resolve(true);

              $("#modal_CarRegistration_Insert").modal("hide");
              dfd = undefined;
          }, function (err) {
              dfd.reject(err);
              err = undefined;
          });
      return dfd.promise;
    }

    //End insert registration car

    function init() {
      var dfdAr = [];

      
      // ctrl.show_checkbox_rejected = true;
      // ctrl.checkbox_needhandle = true;
      // ctrl.show_checkbox_needhandle = true;
      // ctrl.show_checkbox_hanlded = true;

      if(
        $filter('hasRule')(RULE_EVENT_CALENDAR.CREATE)
      ){
        ctrl.checkbox_created = true;
        ctrl.show_checkbox_created = true;
      }

      if(
        $filter('hasRule')(RULE_EVENT_CALENDAR.APPROVE_DEPARTMENT) ||
        $filter('hasRule')(RULE_EVENT_CALENDAR.APPROVE_LEAD)
      ){
        ctrl.checkbox_needhandle = true;

        ctrl.show_checkbox_needhandle = true;
        ctrl.show_checkbox_hanlded = true;
        ctrl.show_checkbox_responsibility = true;
        ctrl.show_checkbox_personally_involved = true;
        ctrl.show_checkbox_level_1 = true;
        ctrl.show_checkbox_level_2 = true;
      }

      resetPaginationInfo();
      dfdAr.push(ctrl.loadList());
      dfdAr.push(ctrl.countGroup());
      $q.all(dfdAr).then(
        function () {
          ctrl._notyetInit = false;
        },
        function (err) {
          console.log(err);
        }
      );
    }

    init();
  },
]);

myApp.registerCtrl("event_calendar_controller", ["event_calendar_service", "$q", "$rootScope", "$timeout", "$filter", "$scope", 'languageValue', function (event_calendar_service, $q, $rootScope, $timeout, $filter, $scope, $languageValue) {
  
  {
    var ctrl = this;
    ctrl._ctrlName = 'event_calendar_controller';
    ctrl.weekDays = [];
    ctrl.events = [];
    ctrl.tab = 'Calendar';
    ctrl.offset = 0;
    ctrl.maxDayShowCalendar = 10;
    ctrl.checkbox_responsibility = false;
    ctrl.checkbox_created = false;
    ctrl.checkbox_personally_involved = false;
    ctrl.checkbox_level_1 = false;
    ctrl.checkbox_level_2 = false;
    ctrl.checkbox_manage = false;

    ctrl.show_checkbox_responsibility = false;
    ctrl.show_checkbox_created = false;
    ctrl.show_checkbox_personally_involved = false;
    ctrl.show_checkbox_level_1 = false;
    ctrl.show_checkbox_level_2 = false;
    ctrl.show_checkbox_manage = false;

    ctrl.show_export_manage = false;
    ctrl.show_export_department = false;
    ctrl.show_export = false;

    ctrl.start_date_filter = getMonday();
    ctrl.end_date_filter = new Date(ctrl.start_date_filter);
    ctrl.end_date_filter.setDate(ctrl.start_date_filter.getDate() + 7 - 1);

    ctrl.numDays = "7";
    
    ctrl.currentPage = 1;
    ctrl.numOfItemPerPage = 20;
    ctrl.sort = { time: -1 };
    ctrl._searchByKeyToFilterData = "";

    ctrl.calendarDates = [];

    ctrl.days = [];

    ctrl.$languageValue = $languageValue;

    const _statusValueSet = [
      { name: "EventCalendar", action: "loadCalendar" },
      { name: "EventCalendar", action: "export_excel" },
      { name: "EventCalendar", action: "export_excel_manage" },
    ];

    ctrl.vehicle_list_config = {
      master_key: "vehicle_list",
      load_details_column: "value",
    };

    ctrl.card_list_config = {
      master_key: "card_list",
      load_details_column: "value",
    };
    
    ctrl.room_list_config = {
      master_key: "meeting_room",
      load_details_column: "value",
    };

    $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet)

  }

  const EVENT_CALENDAR_TYPE = {
    ONLINE: "Online",
    OFFLINE_ONSITE: "OfflineOnSite",
    OFFLINE_OFFSITE: "OfflineOffSite",
  };

  const LEVEL_EVENT_CALENDAR = {
    LEVEL_1: "Level_1",
    LEVEL_2: "Level_2",
  }

  const RULE_EVENT_CALENDAR = {
    APPROVE_DEPARTMENT: "Office.EventCalendar.ApprovalDepartment", // TP duyệt
    CONFIRM: "Office.EventCalendar.OtherApproval", // Quản lý lịch công tác duyệt
    APPROVE_LEAD: "Office.EventCalendar.FinalApproval", // Lãnh đạo đơn vị duyệt
    CREATE: "Office.EventCalendar.Create", // Tạo mới lịch công tác
    EDIT: "Office.EventCalendar.Edit", // Chỉnh sửa lịch công tác
    USE: "Office.EventCalendar.Use", // Sử dụng lịch công tác
    CREATE: "Office.EventCalendar.Create", // Sử dụng lịch công tác
    DELETE: "Office.EventCalendar.Delete", // Xóa lịch công tác
    MANAGE: "Office.EventCalendar.Manage", // Quản lý lịch công tác
  };

  ctrl.exportToExcel = function(){
    // Prepare the data array
    let data = [];
    const headerRow = ['STT', 
      $filter('l')('TimeEvent'),
      $filter('l')('TimeEvent'),
      $filter('l')('content'),
      $filter('l')('AddressEvent'),
      $filter('l')('HostPerson'),
      $filter('l')('Participant'),
      $filter('l')('MeetingLink')
    ];
    const headerRow2 = ['', $filter('l')('DayEvent'), $filter('l')('Hour'), '', '', '', ''];
    data.push(headerRow);
    data.push(headerRow2);
    let stt = 1;
    ctrl.calendarDates.forEach(day => {
      if(day.events.length < 1){
        const row = [stt, `${$filter('l')(day.weekDay)} \n ${$filter("date")(day.value, "dd/MM/yyyy")}`, '', '', '', '', ''];
        data.push(row);
        stt++;
      }else{
        day.events.forEach(d =>{
          const row = [
            stt,
            `${$filter('l')(day.weekDay)} \n ${$filter("date")(d.start_date, "dd/MM/yyyy")}`,
            $filter("date")(d.start_date, "dd/MM/yyyy"),
            d.content,
            $filter('l')(d.type),
            d.main_person,
            d.participants.join('\n'),
            d.meeting_link,
          ];
          data.push(row);
          stt++;
        })
      }
    });

    // Convert the data array to a worksheet
    var worksheet = XLSX.utils.aoa_to_sheet(data);

    const headerMerges = [
      { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } },
      { s: { r: 0, c: 3 }, e: { r: 1, c: 3 } },
      { s: { r: 0, c: 4 }, e: { r: 1, c: 4 } },
      { s: { r: 0, c: 5 }, e: { r: 1, c: 5 } },
      { s: { r: 0, c: 1 }, e: { r: 0, c: 2 } },
    ];

    const list_merge = [];
    let dem = 2;
    ctrl.calendarDates.forEach((day,index) => {
      if(day.events.length > 0){
        list_merge.push(
          { s: { r: index + dem, c: 1 }, e: { r: index + dem + day.events.length - 1, c: 1 } }
        )
        dem += day.events.length;
      }
    });

    worksheet['!merges'] = headerMerges.concat(list_merge);
    // Create a new workbook and append the worksheet
    var workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Event Calendar Schedule");

    // Generate file name
    var tabTitle = $filter("l")("EventCalendar");
    var startDate = $filter("date")(ctrl.start_date_filter, "dd/MM/yyyy");
    var endDate = $filter("date")(ctrl.end_date_filter, "dd/MM/yyyy");
    var fileName = `${tabTitle}_${startDate}_to_${endDate}_.xlsx`;

    // Export the workbook to an Excel file
    XLSX.writeFile(workbook, fileName);

  }

  ctrl.export_excel = function(){
    return $rootScope.statusValue.execute(ctrl._ctrlName, "EventCalendar", "export_excel", export_excel_service);
  }

  function export_excel_service(){
    const dfd = $q.defer();
    const filter = generateFilter_calendar();

    event_calendar_service.export_excel(
        filter.from_date,
        filter.to_date,
        filter.checks,
        filter.levels,
    )
        .then(function (res) {
            const file_name = `${$filter('l')('EventManagement')}_${$filter('showDate')(filter.from_date)}_to_${$filter('showDate')(filter.to_date)}`;
            // Kiểm tra xem API có trả về blob không
            const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);

            // Tạo thẻ <a> ẩn để tải file
            const a = document.createElement('a');
            a.href = url;
            a.download = `${file_name}.xlsx`;  // Tên file khi tải về
            document.body.appendChild(a);
            a.click();

            // Sau khi tải xong, giải phóng URL và xóa thẻ <a>
            window.URL.revokeObjectURL(url);
            a.remove();

            // Resolve khi tải thành công
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
    return dfd.promise;
  }

  ctrl.export_excel_manage = function(){
    return $rootScope.statusValue.execute(ctrl._ctrlName, "EventCalendar", "export_excel_manage", export_excel_manage_service);
  }

  function export_excel_manage_service(){
    const dfd = $q.defer();
    const filter = generateFilter_calendar();

    event_calendar_service.export_excel(
        filter.from_date,
        filter.to_date,
        ['Manage'],
        [],
    )
        .then(function (res) {
            const file_name = `${$filter('l')('EventManagement')}_${$filter('showDate')(filter.from_date)}_to_${$filter('showDate')(filter.to_date)}`;
            // Kiểm tra xem API có trả về blob không
            const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);

            // Tạo thẻ <a> ẩn để tải file
            const a = document.createElement('a');
            a.href = url;
            a.download = `${file_name}.xlsx`;  // Tên file khi tải về
            document.body.appendChild(a);
            a.click();

            // Sau khi tải xong, giải phóng URL và xóa thẻ <a>
            window.URL.revokeObjectURL(url);
            a.remove();

            // Resolve khi tải thành công
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
    return dfd.promise;
  }

  function gennerateAdressMeeting(event){
    return $filter('l')(event.type); 
  }

  function generateFilter_calendar() {
    var obj = {};
    if (ctrl._searchFilter_task !== "") {
        obj.search = angular.copy(ctrl._searchFilter_task);
    }
    obj.checks = [];
    obj.levels = [];

    if (ctrl.checkbox_created && ctrl.show_checkbox_created) {
        obj.checks.push("Created");
    }

    if (ctrl.checkbox_responsibility && ctrl.show_checkbox_responsibility) {
        obj.checks.push("ResponsibleUnit");
    }

    if (ctrl.checkbox_personally_involved && ctrl.show_checkbox_personally_involved) {
      obj.checks.push("PersonallyInvolved");
    }

    if (ctrl.checkbox_manage && ctrl.show_checkbox_manage) {
      obj.checks.push("Manage");
    }


    if (ctrl.checkbox_level_1 && ctrl.show_checkbox_level_1) {
      obj.levels.push(LEVEL_EVENT_CALENDAR.LEVEL_1);
    }

    if (ctrl.checkbox_level_2 && ctrl.show_checkbox_level_2) {
      obj.levels.push(LEVEL_EVENT_CALENDAR.LEVEL_2);
    }

    //reset to time start date
    obj.from_date = (new Date(ctrl.start_date_filter)).setHours(0,0,0,0);

    //reset to time end date
    obj.to_date = (new Date(ctrl.end_date_filter)).setHours(23, 59, 59, 999);
    
    return obj;
  }

  ctrl.load_calendar = function(val){
    getStartAndEndDate();
    if (val != undefined) {
      ctrl.offset = angular.copy(val);
    }
    return $rootScope.statusValue.execute(ctrl._ctrlName, "EventCalendar", "loadCalendar", load_calendar_service);
  }

  function load_calendar_service(){
    let dfd = $q.defer();
    const filter = generateFilter_calendar();
    event_calendar_service.load_calendar(
      filter.from_date,
      filter.to_date,
      filter.checks,
      filter.levels,
    ).then(function(res){
      ctrl.calendarDates = transformData(res.data);
    }, function(err){
      console.log(err);
    })

    return dfd.promise;
  }

  function transformData(days){
    let indexNumber = 1;
    const events = [];
    days.forEach(day=>{
      if(day.events.length < 1){
        events.push({
          ...day,
          event:null,
          index: indexNumber++,
        })
      }else{
        day.events.forEach((item, index)=>{
          const event = {
            ...day,
            event:item,
            index: indexNumber++,
          }
          if(index === 0){
            event.colspan = day.events.length;
          }
          events.push(event)
        })
      }
    })
    return events;
  }

  ctrl.today = function(){
    ctrl.start_date_filter = new Date();
    generateCalendar();
  }

  function getMonday(){
    let currentDate = new Date();
    let dayOfWeek = currentDate.getDay(); 
    let diff = (dayOfWeek === 0 ? 6 : dayOfWeek - 1); 
    return new Date(currentDate.setDate(currentDate.getDate() - diff));
}

  function getStartAndEndDate() {
    const endDate = new Date(ctrl.start_date_filter);
    endDate.setDate(ctrl.start_date_filter.getDate() + ctrl.numDays*1 - 1);
    ctrl.end_date_filter = endDate;
  }

  function getDateParts(date) {
    const today = new Date();
    const day = date.getDate().toString().padStart(2, '0');   // Lấy ngày theo múi giờ địa phương
    const month = (date.getMonth() + 1).toString().padStart(2, '0');  // Lấy tháng theo múi giờ địa phương (cộng thêm 1)
    const year = date.getFullYear();  // Lấy năm theo múi giờ địa phương
    const weekDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
    const isToday = (
      day === today.getDate().toString().padStart(2, '0') &&
      month === (today.getMonth() + 1).toString().padStart(2, '0') &&
      year === today.getFullYear()
    );
    return {
        day,
        month,
        year,
        weekDay,
        isToday
    };
  }

  function isDateInRange(dateToCheck, startDate, endDate) {
    // Chuẩn hóa ngày để chỉ so sánh ngày, tháng và năm
    const normalizedDateToCheck = new Date(dateToCheck);
    const normalizedStartDate = new Date(startDate);
    const normalizedEndDate = new Date(endDate);
    
    normalizedDateToCheck.setHours(0, 0, 0, 0);
    normalizedStartDate.setHours(0, 0, 0, 0);
    normalizedEndDate.setHours(0, 0, 0, 0);

    // Kiểm tra xem dateToCheck có nằm trong khoảng từ startDate đến endDate không
    return normalizedDateToCheck >= normalizedStartDate && normalizedDateToCheck <= normalizedEndDate;
  }

  function generate_textEvent(event, day){
    let text_event = '';
    let compareToStartDate = $filter('compareDate')(day, event.start_date);
    let compareToEndDate = $filter('compareDate')(day, event.end_date);
    if(compareToStartDate === 1 && compareToEndDate === -1){
        text_event = $filter('l')('Allday');
    }

    if(compareToStartDate === 1 && compareToEndDate === 0){
        const endTime = new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        text_event = `${$filter('l')('Early in the day')} - ${endTime}`
    }

    if(compareToStartDate === 0 && compareToEndDate === -1){
        const startTime = new Date(event.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        text_event = `${startTime} - ${$filter('l')('Until the end of the day')}`
    }

    if(compareToStartDate === 0 && compareToEndDate === 0){
        const startTime = new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const endTime = new Date(event.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        
        text_event = `${startTime} - ${endTime}`
    }
    text_event = `${text_event}: ${event.title}`;
    return text_event;
  }

  function generateCalendar(){
    ctrl.calendarDates = [];
    let currentDate = new Date(ctrl.start_date_filter);
    let index = 1;
    while (currentDate <= ctrl.end_date_filter) {
        const events = ctrl.events
                        .filter(eventCalendar => isDateInRange(currentDate, new Date(eventCalendar.start_date), new Date(eventCalendar.end_date)))
                        .map((eventCalendar) =>({
                          index,
                          ...eventCalendar,
                          eventText: generate_textEvent(eventCalendar, currentDate)
                        }))
                        .sort((a, b) => a.start_date - b.start_date);
        ctrl.calendarDates.push({
          value: currentDate,
          events: events,
          ...getDateParts(currentDate)
        });
        currentDate.setDate(currentDate.getDate() + 1);
        index++;
    }
  }

  function init() {
    ctrl.show_checkbox_personally_involved = true;
    ctrl.checkbox_personally_involved = true;
    ctrl.show_checkbox_level_1 = true;
    ctrl.show_checkbox_level_2 = true;
    ctrl.checkbox_level_1 = true;
    ctrl.checkbox_level_2 = true;

    if(
      $filter('hasRule')(RULE_EVENT_CALENDAR.CREATE)
    ){
      ctrl.show_checkbox_created = false;
      // ctrl.checkbox_created = true;
    }

    if(
      $filter('hasRule')(RULE_EVENT_CALENDAR.APPROVE_DEPARTMENT) ||
      $filter('hasRule')(RULE_EVENT_CALENDAR.APPROVE_LEAD) ||
      $filter('hasRule')(RULE_EVENT_CALENDAR.MANAGE)
    ){
      // ctrl.checkbox_responsibility = true;

      

      ctrl.show_export = true;
    }

    if($filter('hasRule')(RULE_EVENT_CALENDAR.MANAGE)){
      ctrl.show_checkbox_manage = true;
      ctrl.show_export_manage = true;
    }

    var dfdAr = [];
    dfdAr.push(ctrl.load_calendar());
    $q.all(dfdAr);
  }
  init();

}]);
