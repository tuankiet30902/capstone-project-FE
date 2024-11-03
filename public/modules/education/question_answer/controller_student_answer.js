
myApp.registerCtrl('student_answer_controller', ['question_answer_service', '$q', '$rootScope', '$scope', '$filter', function (question_answer_service, $q, $rootScope, $scope, $filter) {
    /**declare variable */
    var ctrl = this;
    /** init variable */
    const _statusValueSet = [
        { name: "QuestionAnswer", action: "init" },
        { name: "QuestionAnswer", action: "count_student_question" },
        { name: "QuestionAnswer", action: "load_student_question" },
        { name: "QuestionAnswer", action: "insert" },
        { name: "QuestionAnswer", action: "update" },
        { name: "QuestionAnswer", action: "delete" },
        { name: "QuestionAnswer", action: "load_type_question" },
        { name: "QuestionAnswer", action: "load" },
        { name: "Task", action: "update" },
        { name: "ForwordQuestionAnswer", action: "update" },
    ];
    ctrl._ctrlName = "student_answer_controller";
    ctrl.currentPage = 1;
    ctrl.totalItems = 0;
    ctrl.numOfItemPerPage = 30;
    ctrl.studentQuestions = [];
    ctrl._searchByKeyToFilterData = "";
    ctrl.offset = 0;
    ctrl._notyetInit = true;
    // ctrl._urlUpdateModal = FrontendDomain + "/modules/education/question_answer/view/update_modal.html";
    ctrl._urlInsertModal = FrontendDomain + "/modules/education/question_answer/view/insert_modal.html";
    ctrl._urlDeleteModal = FrontendDomain + "/modules/education/question_answer/view/delete_modal.html";
    ctrl._urlForwardModal = FrontendDomain + "/modules/education/question_answer/view/forward_modal.html";
    ctrl.listTypeQuestions = [];
    ctrl._insert_value = {}
    ctrl._update_value = {};
    ctrl._filterDepartment = {};
    
    ctrl._delete_value = {};
    $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);


    ctrl.pickTypeQuestion = function (value, type) {
        type == 'insert' ? ctrl._insert_value.type_question = value.title_vi : ctrl._update_value.type_question = value.title_vi;
        console.log(ctrl._update_value);
    }
    ctrl.refreshData = function () {
        ctrl.count_student_question();
        ctrl.count_question();
        
    }
    function resetPaginationInfo() {
        ctrl.currentPage = 1;
        ctrl.totalItems = 0;
        ctrl.offset = 0;
    }

    function resetvalue () {
        ctrl._insert_value = {};
        ctrl._update_value = {};
        ctrl._delete_value = {};
        ctrl._filterDepartment = {};
    }

    ctrl.count_question = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "QuestionAnswer", "count_student_question", count_question_service);
    }

    function count_question_service() {
        var dfd = $q.defer();
        var _filter = generateFilter_created();
        question_answer_service.count_student_question(_filter.search, _filter.from_date, _filter.last_update_date).then(function (res) {
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

    function setValueFilter() {
        var today = new Date();
        if (today.getDate() < 10) {
            ctrl._filterFromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0);
        } else {
            ctrl._filterFromDate = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
        }

        ctrl._filterToDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

    }
    function generateFilter_created() {
        var obj = {};
        if (ctrl._searchByKeyToFilterData !== '') {
            obj.search = angular.copy(ctrl._searchByKeyToFilterData);
        }

        if (ctrl._filterFromDate) {
            obj.from_date = angular.copy(ctrl._filterFromDate.getTime());
        }

        if (ctrl._filterToDate) {
            obj.last_update_date = angular.copy(ctrl._filterToDate.getTime());
        }
        return obj;
    }

    ctrl.prepareInsert = function () {
        $rootScope.statusValue.generate(ctrl._ctrlName, "QuestionAnswer", "insert");
    }

    ctrl.prepareUpdate = function (value) {
        console.log("🚀 ~ file: controller_student_answer.js:107 ~ value:", value)
        $rootScope.statusValue.generate(ctrl._ctrlName, "QuestionAnswer", "update");
        ctrl._update_value = angular.copy(value);
    }

    ctrl.prepareDelete = function (value) {
        $rootScope.statusValue.generate(ctrl._ctrlName, "QuestionAnswer", "delete");
        ctrl._delete_value = angular.copy(value);
    }

    ctrl.delete = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "QuestionAnswer", "delete", delete_service);
    }

    ctrl.update_common_question = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "QuestionAnswer", "update", update_service);
    }
    ctrl.forward_common_question = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "ForwordQuestionAnswer", "update", forward_service);
    }

    ctrl.insert_common_question = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "QuestionAnswer", "insert", insert_service);
    }
    ctrl.chooseDepartment = function (department) {
        ctrl._filterDepartment.id = department.id;  // Assuming 'id' is the correct property for the department ID
        // $q.all(dfdAr).then(function () {
        //     ctrl._notyetInit = false;
        // });
    }
    

    function update_service() {
        var dfd = $q.defer();
        question_answer_service.update_common_question(
            ctrl._update_value._id,
            ctrl._update_value.question,
            ctrl._update_value.answer,
            ctrl._update_value.type_question,
            ctrl._update_value.status
        ).then(function () {
            ctrl.load_common_question();
            ctrl.count_question();
            resetvalue();
            $("#modal_Question_Update").modal("hide");
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    function forward_service() {
        var dfd = $q.defer();
        question_answer_service.forward_common_question(
            ctrl._update_value._id,
            ctrl._update_value.question,
            ctrl._filterDepartment.id,
            ctrl._update_value.status
        ).then(function () {
            ctrl.refreshData();
            $("#modal_Forward_Update").modal("hide");
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    function insert_service() {
        var dfd = $q.defer();
        question_answer_service.insert_common_question(
            ctrl._insert_value.question,
            ctrl._insert_value.answer,
            ctrl._insert_value.type_question
        ).then(function () {
            ctrl.load_common_question();
            ctrl.count_question();
            resetvalue();
            $("#modal_Question_Update").modal("hide");
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    function delete_service() {
        var dfd = $q.defer();
        question_answer_service.delete_common_question(
            ctrl._delete_value._id,
        ).then(function () {
            ctrl.load_common_question();
            ctrl.count_question();
            resetvalue();
            $("#modal_Question_Delete").modal("hide");
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.refreshData = function () {
        resetPaginationInfo()
        ctrl.load_student_questions();
        ctrl.count_question();
    }

    ctrl.load_student_questions = function (val) {
        if (val != undefined) { ctrl.offset = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "QuestionAnswer", "load_student_question", load_student_questions_service);
    }

    function load_student_questions_service() {
        var dfd = $q.defer();
        let _filter = generateFilter_created();
        question_answer_service.load_student_questions(_filter.search, _filter.from_date, _filter.last_update_date, ctrl.numOfItemPerPage, ctrl.offset).then(function (res) {
            ctrl.studentQuestions = res.data;
            ctrl.totalItems_created = res.data.length;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.load_type_question = function (val) {
        if (val != undefined) { ctrl.offset = angular.copy(val); }
        return $rootScope.statusValue.execute(ctrl._ctrlName, "QuestionAnswer", "load_type_question", load_type_question_service);
    }

    function load_type_question_service() {
        var dfd = $q.defer();
        let _filter = generateFilter_created();
        question_answer_service.load_type_questions(_filter.search, ctrl.numOfItemPerPage, ctrl.offset).then(function (res) {
            ctrl.listTypeQuestions = res.data;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    function init() {
        setValueFilter();
        // ctrl.load_common_question();
        var dfdAr = [ctrl.load_student_questions()];
        var dfdAr = [ctrl.count_question()];
        dfdAr.push();
        $q.all(dfdAr).then(function () {
            ctrl._notyetInit = false;
        });
    }
    init();
}]);