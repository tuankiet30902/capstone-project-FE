myApp.registerCtrl('meeting_room_controller', ['meeting_room_service', '$q', '$rootScope', '$filter', '$location', 'languageValue', function (meeting_room_service, $q, $rootScope, $filter, $location, $languageValue) {

    const _statusValueSet = [
        { name: "MeetingRoom", action: "load" },
        { name: "MeetingRoom", action: "getOrderNumber" },
        { name: "MeetingRoom", action: "count" },
        { name: "MeetingRoom", action: "insert" },
        { name: "MeetingRoom", action: "update" },
        { name: "MeetingRoom", action: "delete" },
        { name: "MeetingRoom", action: "register" },
        { name: "MeetingRoom", action: "loadForUpdate" },
        { name: "MeetingRoom", action: "changeStatus" },
        { name: "MeetingRoom", action: "loadSchedule" },
        { name: "MeetingRoom", action: "countSchedule" },
        { name: "MeetingRoom", action: "loadCalendar" },
        { name: "MeetingRoom", action: "loadRoomType" },
        { name: "MeetingRoom", action: "loadRoomRegister" },
        { name: "Registration", action: "delete" },
        { name: "Register", action: "load" },
        { name: "Register", action: "loadHost" },
        { name: "Register", action: "loadRoom" },
        { name: "Update", action: "load" },

        { name: "MeetingRoom", action: "approve_department" },
        { name: "MeetingRoom", action: "reject_department" },
        { name: "MeetingRoom", action: "approve_management" },
        { name: "MeetingRoom", action: "reject_management" },
        { name: "MeetingRoom", action: "approve_lead" },
        { name: "MeetingRoom", action: "reject_lead" },

        { name: "MeetingRoom", action: "approve_recall_department" },
        { name: "MeetingRoom", action: "reject_recall_department" },
        { name: "MeetingRoom", action: "approve_recall_management" },
        { name: "MeetingRoom", action: "reject_recall_management" },
        { name: "MeetingRoom", action: "approve_recall_lead" },
        { name: "MeetingRoom", action: "reject_recall_lead" },

        { name: "MeetingRoom", action: "export_excel" },
    ];
    var ctrl = this;

    /** init variable */
    {
        ctrl._ctrlName = "meeting_room_controller";
        ctrl.validPermission = $filter('checkRuleCheckbox')('Office.MeetingRoom.Use');
        ctrl.master_key = 'meeting_room';
        ctrl.tab = 'schedule';
        ctrl.$languageValue = $languageValue;
        ctrl._departments = [];

        ctrl.currentPage = 1;
        ctrl.numOfItemPerPage = 20;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
        ctrl.sort = { name: "_id", value: false, query: { _id: -1, priority: -1 } };
        ctrl.meetingRooms = [];
        ctrl.listRooms = [];
        ctrl._roomCalendar = [];
        ctrl._roomTypes = [];
        ctrl.weekDays = [];
        ctrl._rooms = [];
        ctrl._room_types = [];

        ctrl.numDateShowCalendar = 20;
        ctrl.currentPageRegistered = 1;
        ctrl.numOfItemPerPageRegistered = 20;
        ctrl.totalItemsRegistered = 0;
        ctrl.offsetRegistered = 0;
        ctrl.sortRegistered = { name: "_id", value: false, query: { _id: -1, priority: -1 } };
        ctrl.registeredList = [];
        ctrl._notyetInit = true;
        ctrl._activeFilterData = true;
        ctrl._searchByKeyToFilterData = "";
        ctrl._idEdit = "";
        ctrl._idCancel = "";
        ctrl.rooms = [];
        ctrl.selectedRoom = null;
        ctrl.selectedRoomId = null;
        ctrl._assess_value = {};

        ctrl.checkbox_responsibility = false;
        ctrl.checkbox_created = false;
        ctrl.checkbox_handled = false;
        ctrl.checkbox_rejected = false;
        ctrl.checkbox_needhandle = true;
        ctrl._searchFilter_schedule = "";

        ctrl.show_checkbox_handled = false;
        ctrl.show_checkbox_rejected = false;
        ctrl.show_checkbox_approved = false;
        ctrl.show_checkbox_needhandle = false;
        ctrl.show_checkbox_created = false;
        ctrl.show_checkbox_responsibility = false;

        ctrl.calendar_checkbox_created = false;
        ctrl.calendar_checkbox_responsibility = false;

        ctrl.show_calendar_checkbox_created = false;
        ctrl.show_calendar_checkbox_responsibility = false;

        ctrl.show_tab_management = false;

        ctrl.room_list_config = {
            master_key: "meeting_room",
            load_details_column: "value",
        };

        // Modal 
        ctrl._urlInsertModal = FrontendDomain + "/modules/office/meeting_room/views/insert_room_modal.html";
        ctrl._urlUpdateModal = FrontendDomain + "/modules/office/meeting_room/views/update_room_modal.html";
        ctrl._urlDeleteModal = FrontendDomain + "/modules/office/meeting_room/views/delete_room_modal.html";
        ctrl._urlRegisterModal = FrontendDomain + "/modules/office/meeting_room/views/room_registration_modal.html";
        ctrl._urlUpdateRegisterModal = FrontendDomain + "/modules/office/meeting_room/views/update_room_registration_modal.html";
        ctrl._urlCancelModal = FrontendDomain + "/modules/office/meeting_room/views/cancel_registration_modal.html";

        ctrl._urlDepartmentApprove = FrontendDomain + "/modules/office/meeting_room/views/department_approve.html";
        ctrl._urlRoomAssess = FrontendDomain + "/modules/office/meeting_room/views/room_assess_modal.html";
        
        ctrl._customToastScope = angular.element(document.querySelector('#custom-toast-container')).scope();
        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

        ctrl._hintNoteSet = [
            'I agree',
            'I refuse',
            'Incorrect information',
            'Out of cars',
            'Out of cards',
        ];

        ctrl.now = new Date();

        ctrl.calendar_checkbox_room_type = {};
    }

    ctrl.set_hint_note = function(note) {
        ctrl._assess_value.note = $filter('l')(note);
    }

    ctrl.set_hint_note_department = function(note) {
        ctrl._update_register_value.note = $filter('l')(note);
    }

    const MEETING_ROOM_SCHEDULE_STATUS = {
        REGISTERED: "Registered",
        APPROVED: "Approved",
        DEPARTMENT_APPROVED: "DepartmentApproved",
        CONFIRMED: "Confirmed",
        REQUEST_CANCEL: "RequestCancel",
        CANCELLED: "Cancelled",
        REJECTED: "Rejected"
    }

    const ROOM_TYPE = {
        MEETING: "MeetingRoom",
        CLASS: "LectureHallClassroom"
    }

    const ROOM_RULE = {
        USE: "Office.MeetingRoomSchedule.use",
        REGISTERED_ROOM: "Office.MeetingRoomSchedule.register",
        APPROVE_LEVEL_DEPARTMENT: "Office.RoomSchedule.ApprovalDepartment",
        CLASS_ROOM_APPROVE_LEAD: "Office.LectureHallClassroom.Approval",
        CLASS_ROOM_CONFIRM: "Office.LectureHallClassroom.Confirm",
        MEETING_ROOM_APPROVE_LEAD: "Office.MeetingRoomSchedule.Approval",
        MEETING_ROOM_CONFIRM: "Office.MeetingRoomSchedule.Confirm",
        MANAGE_INFORMATION: "Office.RoomSchedule.Manange",
        REQUEST_CANCEL:"Office.RoomSchedule.RequestCancel",
    }

    const ROOM_FLOW_STATUS ={
        APPROVE:"approve",
        CANCEL:"cancel"
    }
    /** Start Load */
    ctrl.load_room = function (val) {
        if (val != undefined) {
            ctrl.offset = angular.copy(val);
        }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "load", load_service_room);
    }

    ctrl.count_room = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "count", count_service_room);
    }

    ctrl.loadListByStatus = function (val) {
        if (val != undefined) {
            ctrl.offsetRegistered = angular.copy(val);
        }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "load", loadServiceByStatus);
    }

    ctrl.countRegistered = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "count", countRegisteredService);
    }

    ctrl.getOrderNumber = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "getOrderNumber", getOrderNumberService);
    }

    ctrl.chooseNumberItem = function (val) {
        ctrl.numOfItemPerPage = val;
        ctrl.refreshData_Room();
    }

    ctrl.onRoomSelected = function () {

        if (ctrl.selectedRoom) {
            ctrl.selectedRoomId = ctrl.selectedRoom.code;
        } else {
            ctrl.selectedRoomId = null;
        }
    };

    ctrl.refreshData_Room = function () {
        var dfdAr = [];
        resetPaginationInfo_Room();
        dfdAr.push(ctrl.load_room());
        dfdAr.push(ctrl.count_room());

        $q.all(dfdAr);
    }

    ctrl.switchTab = function (val) {
        ctrl.tab = val;
        $location.url("/meeting-room?tab=" + val);
        setUrlContent();
    }
    ctrl.switchSubTab = function (val) {
        ctrl.subTab = val;
        ctrl.refreshData();
    }

    function setUrlContent() {
        switch (ctrl.tab) {
            case "Management":
                ctrl._urlContent = FrontendDomain + "/modules/office/meeting_room/views/schedule.html";
                break;
            case "list":
                ctrl._urlContent = FrontendDomain + "/modules/office/meeting_room/views/list.html";
                break;
            case "Calendar":
                ctrl._urlContent = FrontendDomain + "/modules/office/meeting_room/views/room_meeting_calendar.html";
                break;
            default:
                ctrl._urlContent = FrontendDomain + "/modules/office/meeting_room/views/schedule.html";
                break;
        }
    }

    ctrl.getTextStatusByFlow = function(status, flow) {
        switch (status) {
            case MEETING_ROOM_SCHEDULE_STATUS.REGISTERED:
                if(flow === ROOM_FLOW_STATUS.APPROVE){
                    return $filter('l')('Registered');
                }

                if(flow === ROOM_FLOW_STATUS.CANCEL){
                    return $filter('l')('RegisteredRecall');
                }
                break;
            case MEETING_ROOM_SCHEDULE_STATUS.DEPARTMENT_APPROVED:
                if(flow === ROOM_FLOW_STATUS.APPROVE){
                    return $filter('l')('DepartmentApproved');
                }

                if(flow === ROOM_FLOW_STATUS.CANCEL){
                    return $filter('l')('ApprovedRecallByDepartmentLeader');
                }
                break;
            case MEETING_ROOM_SCHEDULE_STATUS.CONFIRMED:
                if(flow === ROOM_FLOW_STATUS.APPROVE){
                    return $filter('l')('Confirmed');
                }

                if(flow === ROOM_FLOW_STATUS.CANCEL){
                    return $filter('l')('ConfirmedRoomRecall');
                }
                break;

            case MEETING_ROOM_SCHEDULE_STATUS.APPROVED:
                if(flow === ROOM_FLOW_STATUS.APPROVE){
                    return $filter('l')('Approved');
                }
                break;
            case MEETING_ROOM_SCHEDULE_STATUS.CANCELLED:
                return $filter('l')('cancelled');
            case MEETING_ROOM_SCHEDULE_STATUS.REJECTED:
                return $filter('l')('RejectedRegistration');
        }
    }

    function load_service_room() {
        var dfd = $q.defer();
        var filter = generateFilterLoad_Room();
        meeting_room_service.load_room(filter.search, ctrl.master_key, ctrl.numOfItemPerPage, ctrl.offset, ctrl.sort.query).then(function (res) {
            ctrl.listRooms = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    function count_service_room() {
        var dfd = $q.defer();
        var filter = generateFilterLoad_Room();
        meeting_room_service.count_room(filter.search, ctrl.master_key).then(function (res) {
            ctrl.totalItems = res.data.count;
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }

    function countRegisteredService() {
        var dfd = $q.defer();
        meeting_room_service.countRegistered(ctrl.subTab).then(function (res) {
            ctrl.totalItemsRegistered = res.data.count;
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }

    function getOrderNumberService() {
        var dfd = $q.defer();
        meeting_room_service.getOrderNumber(ctrl.master_key).then(function (res) {
            ctrl._insert_value.ordernumber = res.data.ordernumber;
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }

    function generateFilterLoad_Room() {
        var obj = {};
        if (ctrl._checkActive === true) {
            obj.isactive = angular.copy(ctrl._activeFilterData);
        }
        if (ctrl._searchByKeyToFilterData !== "") {
            obj.search = angular.copy(ctrl._searchByKeyToFilterData);
        }
        return obj;
    }

    function resetPaginationInfo_Room() {
        if (ctrl.tab == 'list') {
            ctrl.currentPage = 1;
            ctrl.totalItems = 0;
            ctrl.offset = 0;
        } else if (ctrl.tab == 'schedule') {
            ctrl.currentPageRegistered = 1;
            ctrl.totalItemsRegistered = 0;
            ctrl.offsetRegistered = 0;
        }

    }

    ctrl.export_excel = function(){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "export_excel", export_excel_service);
    }

    function export_excel_service(){
        const dfd = $q.defer();
        const filter = generateFilter_export();

        meeting_room_service.export_excel(
            filter.date_start,
            filter.date_end,
            filter.checks,
            filter.room_type,
        )
            .then(function (res) {
                const file_name = `${$filter('l')('MeetingRoomScheduleConferenceRoom')}_${$filter('showDate')(filter.date_start)}_to_${$filter('showDate')(filter.date_end)}`;
                const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = `${file_name}.xlsx`;
                document.body.appendChild(a);
                a.click();

                window.URL.revokeObjectURL(url);
                a.remove();

                dfd.resolve(true);
            }, function () {
                dfd.reject(false);
                err = undefined;
            });
        return dfd.promise;
    }

    function generateFilter_export() {
        var obj = {};
        obj.checks = [];
        obj.room_type = [];
        const CHECKS_ON_UI = {
            CREATED: "Created",
            RESPOSIBILITY_DEPARTMENT: "Responsibility",
        }

        if (ctrl.calendar_checkbox_created && ctrl.show_calendar_checkbox_created) {
            obj.checks.push(CHECKS_ON_UI.CREATED);
        }

        if (ctrl.calendar_checkbox_responsibility && ctrl.show_calendar_checkbox_responsibility) {
            obj.checks.push(CHECKS_ON_UI.RESPOSIBILITY_DEPARTMENT);
        }

        Object.keys(ctrl.calendar_checkbox_room_type).forEach(key => {
            if (ctrl.calendar_checkbox_room_type[key]) {
                obj.room_type.push(key);
            }
        });

        obj.date_start = $filter('convertToStartOfDay')(ctrl.weekDays[0].date).getTime();
        obj.date_end = $filter('convertToStartOfDay')(ctrl.weekDays[ctrl.weekDays.length - 1].date).getTime();
        return obj;
    }

    function calculateDays(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
    
        const timeDifference = end - start;
        const dayDifference = timeDifference / (1000 * 3600 * 24);
    
        return dayDifference + 1; // Cộng thêm 1 để bao gồm cả ngày đầu và ngày cuối
    }

    function getMonday(){
        let currentDate = new Date();
        let dayOfWeek = currentDate.getDay(); 
        let diff = (dayOfWeek === 0 ? 6 : dayOfWeek - 1); 
        return new Date(currentDate.setDate(currentDate.getDate() - diff));
    }

    ctrl.generateWeekDays = function () {
        const days = [];
        let currentDate = getMonday();
        let numDateShow = 7;
        if(ctrl.weekDays!==undefined && ctrl.weekDays.length> 1){
            const start = new Date(ctrl.weekDays[0].date);
            const end = new Date(ctrl.weekDays[ctrl.weekDays.length - 1].date);
            numDateShow = calculateDays(start,end);
            currentDate = new Date(start);
        }
        //get monday
        const dayKeyMap = {
            0: 'Sunday',
            1: 'Monday',
            2: 'Tuesday',
            3: 'Wednesday',
            4: 'Thursday',
            5: 'Friday',
            6: 'Saturday'
        };

        for (let i = 0; i < numDateShow; i++) {
            const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ...
            const dayKey = dayKeyMap[dayOfWeek];
            days.push({
                date: new Date(currentDate),
                dayKey: dayKey,
                day: currentDate.getDate(),
                fullDate: currentDate.toISOString().split('T')[0] // YYYY-MM-DD format
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return days;
    };

    // Get the week days

    ctrl.previousWeek = function () {
        load_service_calendar();
    };

    ctrl.nextWeek = function () {
        load_service_calendar();
    };

    ctrl.shiftWeek = function (direction) {
        ctrl.weekDays = ctrl.weekDays.map(day => {
            let newDate = new Date(day.date);
            newDate.setDate(newDate.getDate() + (direction * 7));
            return {
                ...day,
                date: newDate,
                fullDate: newDate.toISOString().split('T')[0], // Update the full date format
                day: newDate.getDate()
            };
        });

        // No need to refresh other data; the date shifting will just update the UI
    };

    // A method to filter events based on the date for each room
    ctrl.getEventsForDay = function (room, day) {
        if (!ctrl._roomCalendar || !Array.isArray(ctrl._roomCalendar)) {
            return [];
        }
        // Filter and sort events based on room code and matching dates
        return ctrl._roomCalendar
            .filter(event =>
                event.room == room.value &&
                (new Date(event.date_start)).toDateString() === day.date.toDateString()
            )
            .sort((a, b) => new Date(a.date_start) - new Date(b.date_start)) // Sort by start time
            .map(event => {
                // Format the start and end times in 24-hour format
                const startTime = new Date(event.date_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                const endTime = new Date(event.date_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                const event_text = `${startTime} - ${endTime}: ${event.title}`;
                return {
                    ...event,
                    event_text,
                    startTime,
                    endTime
                };
            });
    };


    ctrl.load_file = function (params) {
    return function () {
        var dfd = $q.defer();
        meeting_room_service.load_file(params.id, params.name).then(function (res) {
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



    /** Start Insert */
    ctrl.chooseDateStart_insert = function (val) {
        if(ctrl._register_value !== undefined) {
            ctrl._register_value.date_start = val.getTime();
        }
    }

    ctrl.chooseDateEnd_insert = function (val) {
        if(ctrl._register_value !== undefined) {
            ctrl._register_value.date_end = val.getTime();
        }
    }

    ctrl.prepareInsert = function () {
        generateResetInsertValue();
        if(!ctrl._roomTypes.length>0){
            ctrl.load_room_type();
        }
        ctrl.getOrderNumber();
        $rootScope.statusValue.generate(ctrl._ctrlName, "MeetingRoom", "insert");
    }

    ctrl.load_room_type = function (){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "loadRoomType", load_room_type_service);
    }

    function load_room_type_service(){
        var dfd = $q.defer();
        meeting_room_service.load_room_type().then(function (res) {
            dfd.resolve(true);
            ctrl._roomTypes = res.data.map(type=>({
                label: type.title,
                val: type.value
            }));

            ctrl._roomTypes.forEach(type => {
                ctrl.calendar_checkbox_room_type[type.val] = true;
            });
            
            ctrl._insert_value.item.room_type = ctrl._roomTypes[0].val;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.insert = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "insert", insertService);
    };
    ctrl.changeInsertRoomType = function(val){
        ctrl._insert_value.item.room_type = val;
    }

    ctrl.changeUpdateRoomType = function(val){
        ctrl._update_value.room_type = val;
    }

    function generateResetInsertValue() {
        ctrl._insert_value = {
            ordernumber: '',
            title: {
                'vi-VN': '',
                'en-US': ''
            },
            value: "",
            item: {
                code: "",
                size: "",
                room_type:'',
            },
            isactive: true,
        };
    }

    function insertService() {
        if (!ctrl.validPermission) {
            alert($filter('l')('InvalidRuleMeetingRoom'));
            return 0;
        }
        var dfd = $q.defer();
        meeting_room_service.insert(
            ctrl._insert_value.ordernumber,
            ctrl._insert_value.title,
            camelize(ctrl._insert_value.title['en-US']),
            ctrl._insert_value.item,
            ctrl._insert_value.isactive,
            ctrl.master_key
        ).then(function () {
            dfd.resolve(true);
            ctrl.load_room();
            $("#modal_MeetingRoom_Insert").modal("hide");
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    function camelize(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '') +'-'+ Date.now().toString() + Math.random().toString(36).substring(2,4);
    }

    /** End Insert */

    /** Start Update */

    ctrl.prepareUpdate = function (val) {
        ctrl._update_value = angular.copy(val);
        console.log(ctrl._update_value);
        if(!ctrl._roomTypes.length>0){
            ctrl.load_room_type();
        }
        $rootScope.statusValue.generate(ctrl._ctrlName, "MeetingRoom", "update");
    };

    ctrl.update = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "update", updateService);
    };

    function updateService() {
        if (!ctrl.validPermission) {
            alert($filter('l')('InvalidRuleMeetingRoom'));
            return 0;
        }
        var dfd = $q.defer();
        meeting_room_service.update(ctrl._update_value._id,
            ctrl._update_value.ordernumber,
            {
                'vi-VN': ctrl._update_value.title['vi-VN'],
                'en-US': ctrl._update_value.title['en-US']
            },
            ctrl._update_value.value,
            {
                code: ctrl._update_value.code,
                size: ctrl._update_value.size,
                room_type: ctrl._update_value.room_type
            },
            ctrl._update_value.isactive
        ).then(function () {
            ctrl.load_room();
            dfd.resolve(true);
            $timeout(function () {
                $rootScope.statusValue.generate(ctrl._ctrlName, "MeetingRoom", "update");
            }, 1000);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    /** End Update */

    /** Start Delete */
    ctrl.prepareDelete = function (val) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "MeetingRoom", "delete");
        generateResetDeleteValue(val);
    };

    ctrl.delete = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "delete", deleteService);
    };

    function generateResetDeleteValue(val) {
        ctrl._delete_value = angular.copy(val);
    }

    function deleteService() {
        if (!ctrl.validPermission) {
            alert($filter('l')('InvalidRuleMeetingRoom'));
            return 0;
        }
        var dfd = $q.defer();
        meeting_room_service.delete(ctrl._delete_value._id).then(function () {
            $("#modal_MeetingRoom_Delete").modal('hide');
            ctrl.load_room();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }
    /** End Delete */

    /** Start Register */
    ctrl.prepareRegister = function () {
        generateResetRegisterValue();
        ctrl.load_department_register();
        ctrl.load_room_register();
        $rootScope.statusValue.generate(ctrl._ctrlName, "MeetingRoom", "register");
    };

    ctrl.register = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "register", register_service);
    };

    function register_service() {
        var dfd = $q.defer();
        const dataRegister = {
            title: ctrl._register_value.title,
            date_start: (new Date(ctrl._register_value.date_start)).getTime(),
            date_end: (new Date(ctrl._register_value.date_end)).getTime(),
            type: ctrl._register_value.type,
            host: ctrl._register_value.host,
            participants: ctrl._register_value.join_employees,
            other_participants: ctrl._register_value.otherHosts.map(person => person.name),
            to_department: ctrl._register_value.to_department,
            content: ctrl._register_value.content,
            person: ctrl._register_value.person,
            teabreak: ctrl._register_value.teabreak,
            helpdesk: ctrl._register_value.helpdesk,
            service_proposal: ctrl._register_value.service_proposal,
            files: ctrl._register_value.files,
        }

        if(dataRegister.teabreak){
            dataRegister.teabreak_text = ctrl._register_value.teabreak_text;
        }

        if(dataRegister.helpdesk){
            dataRegister.helpdesk_text = ctrl._register_value.helpdesk_text;
        }

        if(dataRegister.service_proposal){
            dataRegister.service_proposal_text = ctrl._register_value.service_proposal_text;
        }
        meeting_room_service.register(dataRegister).then(function (response) {
            $("#modal_MeetingRoomSchedule_Register").modal("hide");
            ctrl.refreshData_Schedule();
            dfd.resolve(true);
            ctrl._customToastScope.addToastValue({
                message: $filter('l')('RegisterRoomSCheduleSuccess'),
                type: 'success'
            });
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.change_type_register = function (val) {
        ctrl._register_value.type = val;
        ctrl._register_value._filteredRooms = ctrl._register_value._rooms.filter((room)=> room.room_type === ctrl._register_value.type);
        ctrl._register_value._has_rule_choose_room = ctrl.has_rule_choose_room();
    };

    ctrl.removeFileRegister = function (item) {
        var temp = [];
        for (var i in ctrl._register_value.files) {
            if (ctrl._register_value.files[i].name != item.name) {
                temp.push(ctrl._register_value.files[i]);
            }
        }
        ctrl._register_value.files = angular.copy(temp);
    };

    function generateResetRegisterValue() {
        let today = new Date();
        let now = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), 0);
        let endTime = new Date(now.getTime() + 1 * 60 * 60 * 1000);
        ctrl._register_value = {
            _rooms:[],
            _filteredRooms:[],
            _departments: [],
            _hosts:[],
            _has_rule_choose_room: false,

            service_proposal: false,
            host:{},
            room:{},
            choosedDepartments: [],
            isOrtherHosts: false,
            otherHosts: [],
            date_start: now,
            date_end: endTime,
            helpdesk: false,
            teabreak: false,
            files: [],
            email: '',
            phone_number: '',
            type: ROOM_TYPE.MEETING,
            content: '',
            title: '',
            person: 10,
            service_proposal_text: '',
            helpdesk_text: '',
            teabreak_text: '',
            join_employees:[],
            to_department:[],
        };
    }

    ctrl.chooseDepartment_register = function (val) {
        ctrl._register_value.to_department = angular.copy(val);
    };

    ctrl.chooseDepartment_update = function (val) {
        ctrl._update_register_value.to_department = angular.copy(val);
    };


    ctrl.isEmpty = function (obj = {}) {
        return Object.keys(obj).length === 0;
    }

    ctrl.invalidRegister = function() {
        if(true && empty(ctrl._register_value.host)){
            return true;
        }
        return false;
    }

    function load_department_register_service(){
        let dfd = $q.defer();
        meeting_room_service.load_department().then(
            function (res) {
                ctrl._register_value._departments = res.data;
                dfd.resolve(true);
            },
            function () {
                dfd.reject(false);
                err = undefined;
            }
        );
        return dfd.promise;
    }

    ctrl.load_department_register = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Register", "load", load_department_register_service);
    }

    ctrl.pickEmployee_register = (params) => {
        ctrl._register_value.join_employees = params;
    }

    ctrl.load_room_register = function(){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Register", "loadRoom", load_room_register_service);
    }

    function load_room_register_service(){
        let dfd = $q.defer();
        meeting_room_service.load_room_register().then(
            function (res) {
                ctrl._rooms = res.data;
                ctrl._register_value._rooms = res.data;
                ctrl._register_value._filteredRooms = ctrl._register_value._rooms.filter((room)=> room.room_type === ctrl._register_value.type);
                dfd.resolve(true);
            },
            function () {
                dfd.reject(false);
                err = undefined;
            }
        );
        return dfd.promise;
    }

    ctrl.add_other_host_register = function(){
        if(!ctrl._register_value.otherHost){
            return;
        }
        const id = Date.now().toString() + Math.random().toString(36).substring(2, 10);
        ctrl._register_value.otherHosts.push({
            id:id,
            name:ctrl._register_value.otherHost
        });
        ctrl._register_value.otherHost='';
    }

    ctrl.delete_other_host_register = function(id){
        ctrl._register_value.otherHosts = ctrl._register_value.otherHosts.filter(host => host.id !== id);
    }

    ctrl._choose_host_register = function(param){
        ctrl._register_value.host = param;
    }

    ctrl._choose_room_register = function(room){
        ctrl._register_value.room = room;
    }

    ctrl.prepareDeleteRegistration = function(id){
        ctrl._delete_registration_value = {};
        ctrl._delete_registration_value = ctrl.registeredList.find(registration => registration._id === id);
        $('#detele_registration_modal').modal('show');
    }

    ctrl.delete_registration = function(){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Registration", "delete", delete_registration_service);
    }

    function delete_registration_service(){
        let dfd = $q.defer();
        meeting_room_service.delete_registration(ctrl._delete_registration_value._id).then(
            function (res) {
                ctrl.load_schedule();
                ctrl._customToastScope.addToastValue({
                    message:'Xóa thành công',
                    type: 'success'
                });
                $('#detele_registration_modal').modal('hide');
                dfd.resolve(true);
            },
            function () {
                dfd.reject(false);
                err = undefined;
            }
        );
        return dfd.promise;
    }

    ctrl.confirm_request_cancel = function(){
        $('#cancelReasonModalLabel').modal('show');
    }

    /** End Register */

    /** Start Update Registered */
    
    ctrl.chooseDateStart_update = function (val) {
        if(ctrl._update_register_value !== undefined){
            ctrl._update_register_value.date_start = val.getTime();
        }
    }

    ctrl.chooseDateEnd_update = function (val) {
        if(ctrl._update_register_value !== undefined){
            ctrl._update_register_value.date_end = val.getTime();
        }
    }

    ctrl.prepareUpdateRoomRegistration = function (val) {
        ctrl._idEdit = val._id;
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "loadForUpdate", loadDetailForUpdateService);
    };

    ctrl._choose_host_update = function(param){
        ctrl._update_register_value.host = param;
    }

    function load_department_update_service(){
        let dfd = $q.defer();
        meeting_room_service.load_department().then(
            function (res) {
                ctrl._update_register_value._departments = res.data;
                ctrl._update_register_value.choosedDepartments = ctrl._update_register_value._departments.filter(department =>ctrl._update_register_value.departments.includes(department.id));
                dfd.resolve(true);
            },
            function () {
                dfd.reject(false);
                err = undefined;
            }
        );
        return dfd.promise;
    }

    ctrl.load_department_update= function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "Update", "load", load_department_update_service);
    }

    ctrl.load_room_register = function(){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "loadRoomRegister", load_room_register_service);
    }

    ctrl._choose_room_update = function(params){
        ctrl._update_register_value.room_update = params.value;
    }

    function load_room_update_service(){
        let dfd = $q.defer();
        meeting_room_service.load_room_register().then(
            function (res) {
                ctrl._update_register_value.room_text='';
                ctrl._update_register_value._rooms = res.data;
                if(ctrl._update_register_value.room){
                    ctrl._update_register_value.room_text = res.data.find(room => room.id == ctrl._update_register_value.room).title;
                }
                ctrl._update_register_value._filteredRooms = res.data.filter((room)=> room.room_type === ctrl._update_register_value.type);
                dfd.resolve(res);
            },
            function () {
                dfd.reject(false);
                err = undefined;
            }
        );
        return dfd.promise;
    }

    ctrl.load_room_update = function(){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "loadRoomRegister", load_room_update_service);
    }

    ctrl.add_other_host_update = function(){
        if(!ctrl._update_register_value.otherHost){
            return;
        }
        const id = Date.now().toString() + Math.random().toString(36).substring(2, 10);
        ctrl._update_register_value.otherHosts.push({
            id:id,
            name:ctrl._update_register_value.otherHost
        });
        ctrl._update_register_value.otherHost='';
    }

    ctrl.delete_other_host_update = function(id){
        ctrl._update_register_value.otherHosts = ctrl._update_register_value.otherHosts.filter(host => host.id !== id);
    }

    ctrl.removeFileUpdate = function(file){
        ctrl._update_register_value.attachments = ctrl._update_register_value.attachments.filter(item => item.id !== file.id);
        ctrl._update_register_value.removeAtachments.push(file);
    }

    ctrl.removeFileUpdateRegister = function (item) {
        ctrl._update_register_value.files = ctrl._update_register_value.files.filter((file)=>file.name!=item.name);
    };

    function loadDetailForUpdateService() {
        var dfd = $q.defer();
        ctrl._update_value = {};
        meeting_room_service.loadDetailForUpdate(ctrl._idEdit).then(function (res) {
            ctrl._update_register_value = res.data;
            ctrl._update_register_value.id = res.data._id;
            ctrl._update_register_value._host_update='';
            ctrl._update_register_value.date_start = new Date(ctrl._update_register_value.date_start);
            ctrl._update_register_value.date_end = new Date(ctrl._update_register_value.date_end);
            ctrl._update_register_value.otherHosts = ctrl._update_register_value.other_participants.map(other=>({
                id:Date.now().toString() + Math.random().toString(36).substring(2, 10),
                name:other
            }));
            ctrl._update_register_value.otherHost = '';
            ctrl._update_register_value.files = [];
            ctrl._update_register_value.removeAtachments = [];
            Object.assign(ctrl._update_register_value, getPermissionProperties(ctrl._update_register_value));
            
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.update_register = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "register", update_register_service);
    };

    function update_register_service() {
        var dfd = $q.defer();
        const dataUpdate = genDataUpdate();
        meeting_room_service.update_register(dataUpdate).then(function () {
            dfd.resolve(true);
            $("#modal_MeetingRoomSchedule_Update").modal("hide");
            ctrl.refreshData_Schedule();
            ctrl._customToastScope.addToastValue({
                message: $filter('l')('UpdateRoomSCheduleSuccess'),
                type:"success",
            })
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    function genDataUpdate(){
        const data = {
            id: ctrl._update_register_value.id,
            title: ctrl._update_register_value.title,
            date_start: (new Date(ctrl._update_register_value.date_start)).getTime(),
            date_end: (new Date(ctrl._update_register_value.date_end)).getTime(),
            type: ctrl._update_register_value.type,
            host: ctrl._update_register_value.host,
            participants: ctrl._update_register_value.participants,
            to_department: ctrl._update_register_value.to_department,
            other_participants: ctrl._update_register_value.otherHosts.map(host => host.name),
            content: ctrl._update_register_value.content,
            person: ctrl._update_register_value.person,
            service_proposal: ctrl._update_register_value.service_proposal,
            service_proposal_text: ctrl._update_register_value.service_proposal_text,
            helpdesk: ctrl._update_register_value.helpdesk,
            helpdesk_text: ctrl._update_register_value.helpdesk_text,
            teabreak: ctrl._update_register_value.teabreak,
            teabreak_text: ctrl._update_register_value.teabreak_text,
        };

        if(ctrl._update_register_value._host_update.username){
            data.host = ctrl._update_register_value._host_update.username;
        }
        
        if(ctrl._update_register_value.files){
            data.file = ctrl._update_register_value.files;
        }

        if(ctrl._update_register_value.removeAtachments){
            data.removeAtachments = ctrl._update_register_value.removeAtachments.map((file)=>file.id);
        }
        return data;
    }

    ctrl.pickEmployee_update = (params) => {
        ctrl._update_register_value.participants = params;
    }

    ctrl.changeUpdateRegisterType = function (val) {
        ctrl._update_register_value.type = val;
        ctrl._update_register_value._filteredRooms = ctrl._update_register_value._rooms.filter((room)=> room.room_type === ctrl._update_register_value.type);
    }


    //Start assess
    function getPermissionProperties(item) {
        let allow_edit = false;
        let allow_delete = false;
        let allow_approve_department = false;
        let allow_approve_management = false;
        let allow_approve_lead = false;
        let allow_request_cancel = false;
        let allow_approve_recall_department = false;
        let allow_approve_recall_management = false;
        let allow_approve_recall_lead = false;
        let status_show;
        let filter_room = [ { room_type: item.type } ];

        if(item.flow === ROOM_FLOW_STATUS.APPROVE){
            switch(item.status){
                case MEETING_ROOM_SCHEDULE_STATUS.REGISTERED:
                    if ($filter('checkRuleDepartmentRadio')(item.department, ROOM_RULE.APPROVE_LEVEL_DEPARTMENT)) {
                        allow_approve_department = true;
                    }

                    if(item.username === $rootScope.logininfo.username){
                        allow_edit = true;
                        allow_delete = true;
                    }

                    status_show = 'Registerd';
                    break;
                case MEETING_ROOM_SCHEDULE_STATUS.DEPARTMENT_APPROVED:
                    status_show = 'DepartementApproved';
                    // if(item.type === ROOM_TYPE.CLASS && $filter('checkRuleCheckbox')(ROOM_RULE.CLASS_ROOM_APPROVE_LEAD)){
                    //     allow_approve_lead = true;
                    //    break; 
                    // }  

                    // if(item.type === ROOM_TYPE.MEETING && $filter('checkRuleCheckbox')(ROOM_RULE.MEETING_ROOM_APPROVE_LEAD)){
                    //     allow_approve_lead = true;
                    //     break;
                    // }

                    if(item.type === ROOM_TYPE.CLASS && $filter('checkRuleCheckbox')(ROOM_RULE.CLASS_ROOM_CONFIRM)){
                        allow_approve_management = true;
                        //
                    }

                    if(item.type === ROOM_TYPE.MEETING && $filter('checkRuleCheckbox')(ROOM_RULE.MEETING_ROOM_CONFIRM)){
                        allow_approve_management = true;
                        //
                    }

                    
                    break;
                case MEETING_ROOM_SCHEDULE_STATUS.CONFIRMED:
                    if(item.type === ROOM_TYPE.CLASS && $filter('checkRuleCheckbox')(ROOM_RULE.CLASS_ROOM_APPROVE_LEAD)){
                        allow_approve_lead = true;
                        //
                    }

                    if(item.type === ROOM_TYPE.MEETING && $filter('checkRuleCheckbox')(ROOM_RULE.MEETING_ROOM_APPROVE_LEAD)){
                        allow_approve_lead = true;
                        //
                    }
                    status_show = 'ManagermentConfirmed';
                    break;
                case MEETING_ROOM_SCHEDULE_STATUS.APPROVED:
                    status_show = 'Approved';

                    if(item.username === $rootScope.logininfo.username){
                        allow_request_cancel = true;
                    }

                    if ($filter('checkRuleDepartmentRadio')(item.department, ROOM_RULE.APPROVE_LEVEL_DEPARTMENT)) {
                        allow_request_cancel = true;
                    }
                    break;
            }
        }else{
            switch(item.status){
                case MEETING_ROOM_SCHEDULE_STATUS.REGISTERED:
                    if ($filter('checkRuleDepartmentRadio')(item.department, ROOM_RULE.APPROVE_LEVEL_DEPARTMENT)) {
                        allow_approve_recall_department = true;
                    }

                    break;
                case MEETING_ROOM_SCHEDULE_STATUS.DEPARTMENT_APPROVED:
                    // if(item.type === ROOM_TYPE.CLASS && $filter('checkRuleCheckbox')(ROOM_RULE.CLASS_ROOM_APPROVE_LEAD)){
                    //     allow_approve_recall_lead = true;
                    //    break; 
                    // }  

                    // if(item.type === ROOM_TYPE.MEETING && $filter('checkRuleCheckbox')(ROOM_RULE.MEETING_ROOM_APPROVE_LEAD)){
                    //     allow_approve_recall_lead = true;
                    //     break;
                    // }

                    if(item.type === ROOM_TYPE.CLASS && $filter('checkRuleCheckbox')(ROOM_RULE.CLASS_ROOM_CONFIRM)){
                        allow_approve_recall_management = true;
                    }

                    if(item.type === ROOM_TYPE.MEETING && $filter('checkRuleCheckbox')(ROOM_RULE.MEETING_ROOM_CONFIRM)){
                        allow_approve_recall_management = true;
                    }
                    break;
                case MEETING_ROOM_SCHEDULE_STATUS.CONFIRMED:
                    if(item.type === ROOM_TYPE.CLASS && $filter('checkRuleCheckbox')(ROOM_RULE.CLASS_ROOM_APPROVE_LEAD)){
                        allow_approve_recall_lead = true;
                    }

                    if(item.type === ROOM_TYPE.MEETING && $filter('checkRuleCheckbox')(ROOM_RULE.MEETING_ROOM_APPROVE_LEAD)){
                        allow_approve_recall_lead = true;
                    }
                    break;
            }
        }

        if(item.end_time < new Date()){
            return {
                status_show
            }
        }

        return {
            allow_approve_department,
            allow_approve_management,
            allow_edit,
            allow_delete,
            allow_approve_lead,
            allow_request_cancel,
            allow_approve_recall_department,
            allow_approve_recall_management,
            allow_approve_recall_lead,
            status_show,
            filter_room
        }
    }

    ctrl.prepareDepartmentApproval = ({item}) =>{
        ctrl._idEdit = item._id;
        ctrl._update_register_value = item;
        ctrl._update_register_value.id = item._id;
        ctrl._update_register_value._host_update='';
        ctrl._update_register_value.date_start = new Date(ctrl._update_register_value.date_start);
        ctrl._update_register_value.date_end = new Date(ctrl._update_register_value.date_end);
        ctrl._update_register_value.otherHosts = ctrl._update_register_value.other_participants.map(other=>({
            id:Date.now().toString() + Math.random().toString(36).substring(2, 10),
            name:other
        }));
        ctrl._update_register_value.otherHost = '';
        ctrl._update_register_value.files = [];
        ctrl._update_register_value.removeAtachments = [];
        return $rootScope.statusValue.generate(ctrl._ctrlName, "MeetingRoom", "approve_department");
    }

    function genDataApproveDepartment(){
        const data = {
            id: ctrl._update_register_value.id,
            title: ctrl._update_register_value.title,
            date_start: (new Date(ctrl._update_register_value.date_start)).getTime(),
            date_end: (new Date(ctrl._update_register_value.date_end)).getTime(),
            type: ctrl._update_register_value.type,
            host: ctrl._update_register_value.host,
            participants: ctrl._update_register_value.participants,
            to_department: ctrl._update_register_value.to_department,
            other_participants: ctrl._update_register_value.otherHosts.map(host => host.name),
            content: ctrl._update_register_value.content,
            person: ctrl._update_register_value.person,
            service_proposal: ctrl._update_register_value.service_proposal,
            service_proposal_text: ctrl._update_register_value.service_proposal_text,
            helpdesk: ctrl._update_register_value.helpdesk,
            helpdesk_text: ctrl._update_register_value.helpdesk_text,
            teabreak: ctrl._update_register_value.teabreak,
            teabreak_text: ctrl._update_register_value.teabreak_text,
            note: ctrl._update_register_value.note,
        };

        if(ctrl._update_register_value._host_update.username){
            data.host = ctrl._update_register_value._host_update.username;
        }
        
        if(ctrl._update_register_value.files){
            data.file = ctrl._update_register_value.files;
        }

        if(ctrl._update_register_value.removeAtachments){
            data.removeAtachments = ctrl._update_register_value.removeAtachments.map((file)=>file.id);
        }
        return data;
    }

    ctrl.approve_department = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "approve_department", approve_department_service);
    };

    function approve_department_service() {
        var dfd = $q.defer();
        const dataUpdate = genDataApproveDepartment();
        meeting_room_service.approve_department(dataUpdate).then(function () {
            dfd.resolve(true);
            $("#modal_RoomRegistration_DepartmentApproval").modal("hide");
            ctrl.refreshData_Schedule();
            ctrl._customToastScope.addToastValue({
                message: $filter('l')('UpdateRoomSCheduleSuccess'),
                type:"success",
            });
            
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.pick_room_assess = (val) =>{
        ctrl._assess_value.room = val.value;
    }

    ctrl.prepareAssess = function ({ item, action }) {
        console.log(item);
        ctrl._assess_value = angular.copy(item);
        ctrl._assess_value.action = action;
        ctrl._assess_value.note = "";
        ctrl._assess_value.note_required = true;
        ctrl._assess_value.assign_room = false;
        switch (action) {
            case "reject_department":
                ctrl._assess_value.note_placeholder = $filter('l')('You need to note for reject');
                break;
            case "approve_management":
                ctrl._assess_value.assign_room = true;
                ctrl._assess_value.note_placeholder = $filter('l')('You can note for accept');
                break;
            case "reject_management":
                ctrl._assess_value.note_placeholder = $filter('l')('You need to note for reject');
                break;
            case "approve_lead":
                ctrl._assess_value.assign_room = true;
                ctrl._assess_value.note_placeholder = $filter('l')('You can note for accept');
                break;
            case "reject_lead":
                ctrl._assess_value.note_placeholder = $filter('l')('You need to note for reject');
                break;
            case "request_cancel":
                ctrl._assess_value.note_placeholder = $filter('l')('You need to note for request cancel');
                break;

            case "approve_department":
                ctrl._assess_value.note_placeholder = $filter('l')('You can note for accept');
                break;
            case "reject_department":
                ctrl._assess_value.note_placeholder = $filter('l')('You need to note for reject');
                break;
            case "approve_management":
                ctrl._assess_value.note_placeholder = $filter('l')('You can note for accept');
                break;
            case "reject_management":
                ctrl._assess_value.note_placeholder = $filter('l')('You need to note for reject');
                break;
            case "approve_lead":
                ctrl._assess_value.note_placeholder = $filter('l')('You can note for accept');
                break;
            case "reject_lead":
                ctrl._assess_value.note_placeholder = $filter('l')('You need to note for reject');
                break;

        }
        $rootScope.statusValue.generate(ctrl._ctrlName, "MeetingRoom", action);
    }

    ctrl.reject_department = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "reject_department", access_service("reject_department"));
    }

    ctrl.approve_management = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "approve_management", access_service("approve_management"));
    }

    ctrl.reject_management = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "reject_management", access_service("reject_management"));
    }

    ctrl.approve_lead = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "approve_lead", access_service("approve_lead"));
    }

    ctrl.reject_lead = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "reject_lead", access_service("reject_lead"));
    }

    ctrl.request_cancel = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "request_cancel", access_service("request_cancel"));
    }

    //Recall
    ctrl.approve_recall_department = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "approve_recall_department", access_service("approve_recall_department"));
    }
    ctrl.reject_recall_department = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "reject_recall_department", access_service("reject_recall_department"));
    }

    ctrl.approve_recall_management = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "approve_recall_management", access_service("approve_recall_management"));
    }

    ctrl.reject_recall_management = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "reject_recall_management", access_service("reject_recall_management"));
    }

    ctrl.approve_recall_lead = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "approve_recall_lead", access_service("approve_recall_lead"));
    }

    ctrl.reject_recall_lead = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "reject_recall_lead", access_service("reject_recall_lead"));
    }
    //End recall

    function access_service(action) {
        return function () {
            var dfd = $q.defer();
            let dfdAr = [];
            let messageSuccess = '';
            switch (action) {
                case "reject_department":
                    messageSuccess = $filter('l')('RejectedRegistration');
                    dfdAr.push(meeting_room_service.reject_department(ctrl._assess_value._id, ctrl._assess_value.note));
                    break;
                case "approve_management":
                    messageSuccess = $filter('l')('Accept registration successfully');
                    dfdAr.push(meeting_room_service.approve_management(ctrl._assess_value._id, ctrl._assess_value.note, ctrl._assess_value.room));
                    break;
                case "reject_management":
                    messageSuccess = $filter('l')('RejectedRegistration');
                    dfdAr.push(meeting_room_service.reject_management(ctrl._assess_value._id, ctrl._assess_value.note));
                    break;
                case "approve_lead":
                    messageSuccess = $filter('l')('Accept registration successfully');
                    dfdAr.push(meeting_room_service.approve_lead(ctrl._assess_value._id, ctrl._assess_value.note, ctrl._assess_value.room));
                    break;
                case "reject_lead":
                    messageSuccess = $filter('l')('RejectedRegistration');
                    dfdAr.push(meeting_room_service.reject_lead(ctrl._assess_value._id, ctrl._assess_value.note));
                    break;
                case "request_cancel":
                    messageSuccess = $filter('l')('Requestcanceled');
                    dfdAr.push(meeting_room_service.request_cancel(ctrl._assess_value._id, ctrl._assess_value.note));
                    break;
                //recall
                case "approve_recall_department":
                    messageSuccess = $filter('l')('Accept registration successfully');
                    dfdAr.push(meeting_room_service.approve_recall_department(ctrl._assess_value._id, ctrl._assess_value.note));
                    break;
                case "reject_recall_department":
                    messageSuccess = $filter('l')('RejectedRegistration');
                    dfdAr.push(meeting_room_service.reject_recall_department(ctrl._assess_value._id, ctrl._assess_value.note));
                    break;
                case "approve_recall_management":
                    messageSuccess = $filter('l')('Accept registration successfully');
                    dfdAr.push(meeting_room_service.approve_recall_management(ctrl._assess_value._id, ctrl._assess_value.note));
                    break;
                case "reject_recall_management":
                    messageSuccess = $filter('l')('RejectedRegistration');
                    dfdAr.push(meeting_room_service.reject_recall_management(ctrl._assess_value._id, ctrl._assess_value.note));
                    break;
                case "approve_recall_lead":
                    messageSuccess = $filter('l')('Accept registration successfully');
                    dfdAr.push(meeting_room_service.approve_recall_lead(ctrl._assess_value._id, ctrl._assess_value.note));
                    break;
                case "reject_recall_lead":
                    messageSuccess = $filter('l')('RejectedRegistration');
                    dfdAr.push(meeting_room_service.reject_recall_lead(ctrl._assess_value._id, ctrl._assess_value.note));
                    break;
            }
            $q.all(dfdAr).then(function () {
                ctrl.refreshData_Schedule();
                $rootScope.statusValue.generate(ctrl._ctrlName, "MeetingRoom", action);
                $("#modal_RoomRegistration_Assess").modal('hide');
                ctrl._customToastScope.addToastValue({
                    message: messageSuccess,
                    type: 'success',
                })
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }
    }

    //end assess

    // LOAD SCHEDULE
    function generateFilter_schedule() {
        var obj = {};
        if (ctrl._searchFilter_task !== "") {
            obj.search = angular.copy(ctrl._searchFilter_task);
        }
        obj.checks = [];

        if (ctrl.checkbox_responsibility && ctrl.show_checkbox_responsibility) {
            obj.checks.push("Responsibility");
        }

        if (ctrl.checkbox_created && ctrl.show_checkbox_created) {
            obj.checks.push("Created");
        }

        if (ctrl.checkbox_needhandle && ctrl.show_checkbox_needhandle) {
            obj.checks.push("NeedToHandle");
        }

        if (ctrl.checkbox_handled && ctrl.show_checkbox_handled) {
            obj.checks.push("Handled");
        }

        if (ctrl.checkbox_rejected && ctrl.show_checkbox_rejected) {
            obj.checks.push("Rejected");
        }

        if (ctrl.checkbox_approved && ctrl.show_checkbox_approved) {
            obj.checks.push("Approved");
        }

        obj.tab = ctrl.tab;
        return obj;
    }

    function resetPaginationInfo_Schedule() {
        ctrl.currentPageRegistered = 1;
        ctrl.totalItemsRegistered = 0;
        ctrl.offsetRegistered = 0;
    }

    function load_service_schedule() {
        var dfd = $q.defer();
        ctrl.registeredList = [];
        let _filter = generateFilter_schedule();
        meeting_room_service
            .load_schedule(
                _filter.search,
                _filter.tab,
                _filter.checks,
                undefined,
                ctrl.numOfItemPerPage,
                ctrl.offsetRegistered,
                ctrl.sortRegistered.query
            )
            .then(
                function (res) {
                    ctrl.registeredList = res.data;
                    for (let i in ctrl.registeredList) {
                        Object.assign(ctrl.registeredList[i], getPermissionProperties(ctrl.registeredList[i]));
                    }
                    ctrl.registeredList = ctrl.registeredList.map(registration =>({
                        ...registration,
                        ...getPermissionProperties(registration),
                    }))
                    dfd.resolve(true);
                },
                function () {
                    dfd.reject(false);
                    err = undefined;
                }
            );
        return dfd.promise;
    }

    ctrl.load_schedule = function (val) {
        if (val != undefined) { ctrl.offsetRegistered = angular.copy(val); }
        if(!ctrl._roomTypes.length>0){
            ctrl.load_room_type();
        }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "loadSchedule", load_service_schedule);
    }

    ctrl.load_calendar = function(){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "loadCalendar", load_service_calendar);
    }

    ctrl.load_calendar_check_date = function(){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "loadCalendar", load_service_calendar);
    }

    function load_service_calendar(){
        var dfd = $q.defer();
        ctrl.weekDays = ctrl.generateWeekDays();
        let _filter = generateFilter_calendar();
        meeting_room_service
        .load_schedule(
            _filter.search,
            _filter.tab,
            _filter.checks, //need handle
            _filter.room_type, //need handle
            0,
            0,
            ctrl.sortRegistered.query,
            _filter.dateStart,
            _filter.dateEnd,
        )
        .then(
            function (res) {
                ctrl._roomCalendar = res.data;
                dfd.resolve(true);
                ctrl.load_room_calendar();

            },
            function () {
                dfd.reject(false);
                err = undefined;
            }
        );

        return dfd.promise;
    }

    ctrl.load_room_calendar = function(){
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "load", load_service_room_calendar);
    }

    function load_service_room_calendar(){
        var dfd = $q.defer();
        ctrl.meetingRooms = [];
        ctrl.calendar_checkbox_room_type;

        meeting_room_service.load_room_register().then(function (res) {
            ctrl.meetingRooms = res.data.filter(item => ctrl.calendar_checkbox_room_type[item.room_type]);
            ctrl.meetingRooms.forEach(room =>{
               ctrl.getRoomEvents(room)
            })
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.getRoomEvents = function(room){
        room.events = [];
        ctrl.weekDays.forEach(day =>{
            room.events.push(ctrl.getEventsForDay(room, day));
        })
    }

    function generateFilter_calendar() {
        var obj = {};
        if (ctrl._searchFilter_task !== "") {
            obj.search = angular.copy(ctrl._searchFilter_task);
        }
        obj.checks = [];
        obj.room_type = [];

        if (ctrl.calendar_checkbox_responsibility) {
            obj.checks.push("Responsibility");
        }

        if (ctrl.calendar_checkbox_created) {
            obj.checks.push("Created");
        }

        Object.keys(ctrl.calendar_checkbox_room_type).forEach(key => {
            if (ctrl.calendar_checkbox_room_type[key]) {
                obj.room_type.push(key);
            }
        });

        if(ctrl.weekDays.length > 0){
            //reset to time start date
            obj.dateStart =  (new Date(ctrl.weekDays[0].date)).setHours(0,0,0,0);

            //reset to time end date
            obj.dateEnd = (new Date( ctrl.weekDays[ctrl.weekDays.length - 1].date)).setHours(23, 59, 59, 999);
        }

        obj.tab = ctrl.tab;
        return obj;
    }

    function count_service_schedule() {
        var dfd = $q.defer();
        let _filter = generateFilter_schedule();
        meeting_room_service
            .count_schedule(
                _filter.search,
                _filter.tab,
                _filter.checks,
            )
            .then(
                function (res) {
                    ctrl.totalItemsRegistered = res.data?.count[0].count || 0;
                    dfd.resolve(true);
                },
                function () {
                    dfd.reject(false);
                    err = undefined;
                }
            );
        return dfd.promise;
    }

    ctrl.count_schedule = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "MeetingRoom", "countSchedule", count_service_schedule);
    }

    ctrl.refreshData_Schedule = function () {
        var dfdAr = [];
        resetPaginationInfo_Schedule();

        dfdAr.push(ctrl.load_schedule());
        dfdAr.push(ctrl.count_schedule());

        $q.all(dfdAr);
    }

    ctrl.refreshData_Calendar = function () {
        var dfdAr = [];

        dfdAr.push(ctrl.load_schedule());
        dfdAr.push(ctrl.count_schedule());

        $q.all(dfdAr);
    }

    ctrl.getNameRoom = function (id){
        return ctrl._rooms.find(room=>room.id == id);
    }

    const getTextSearch = () => {
        let q = $location.search().q;
        if(q){ return q;}
        if ($rootScope.detailsInfo.url && $rootScope.detailsInfo.route === 'notify') {
            let temp = $rootScope.detailsInfo.url.split("?")[1];
            $location.search('q', null);
            if(temp.indexOf("q")!==-1){
                q = temp.split("=")[1];
                $rootScope.detailsInfo.url = $rootScope.detailsInfo.url.split("?")[0];
  
                return q;
            }
        }
        return undefined;
      };

    /** End Request cancel Registered */
    function init() {
        ctrl.show_checkbox_rejected = true;
        ctrl.show_checkbox_approved = true;
        if($filter('checkRuleCheckbox')(ROOM_RULE.REGISTERED_ROOM)){
            ctrl.show_checkbox_created = true;
            ctrl.checkbox_created = true;
            ctrl.show_calendar_checkbox_created = true;
            ctrl.calendar_checkbox_created = true;
            ctrl.show_tab_management = true;
        }

        if(
            $filter('checkRuleCheckbox')(ROOM_RULE.CLASS_ROOM_APPROVE_LEAD) ||
            $filter('checkRuleCheckbox')(ROOM_RULE.CLASS_ROOM_CONFIRM) ||
            $filter('checkRuleCheckbox')(ROOM_RULE.MEETING_ROOM_APPROVE_LEAD) ||
            $filter('checkRuleCheckbox')(ROOM_RULE.MEETING_ROOM_CONFIRM) ||
            $filter('hasRuleRadio')(ROOM_RULE.APPROVE_LEVEL_DEPARTMENT)
        ){
            ctrl.show_checkbox_handled = true;
            ctrl.show_checkbox_needhandle = true;
            ctrl.show_checkbox_responsibility = true;
            ctrl.show_calendar_checkbox_responsibility = true;
            ctrl.calendar_checkbox_responsibility = true;

            ctrl.show_tab_management = true;
        }

        if(
            $filter('checkRuleCheckbox')(ROOM_RULE.CLASS_ROOM_APPROVE_LEAD) ||
            $filter('checkRuleCheckbox')(ROOM_RULE.REGISTERED_ROOM)
        ){
            ctrl.show_export = true;
            ctrl.show_tab_management = true;
        }

        var dfdAr = [];
        var tab = $location.search().tab;
        ctrl.tab = tab || "Management";

        if(!ctrl.show_tab_management){
            ctrl.tab = tab || "Calendar";
        }
        dfdAr.push(ctrl.load_room_type());
        switch (ctrl.tab) {
            case "Management":
                ctrl._searchFilter_task = getTextSearch();
                resetPaginationInfo_Schedule();
                dfdAr.push(ctrl.load_schedule());
                dfdAr.push(ctrl.count_schedule());
                break;
            case "Calendar":
                dfdAr.push(ctrl.load_calendar());
                break;
            case "list":
                dfdAr.push(ctrl.load_room());
                dfdAr.push(ctrl.count_room());
                break;

        };
        setUrlContent();
        $q.all(dfdAr).then(
            function () {
                ctrl._notyetInit = false;
            }, function (err) {
                console.log(err);
                err = undefined;
            }
        );
    }

    init();
}]);
