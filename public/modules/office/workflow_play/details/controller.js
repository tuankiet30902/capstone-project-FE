myApp.registerCtrl('sign_details_controller', ['sign_details_service', '$q', '$rootScope', '$filter', '$scope','$location', function ( sign_details_service, $q, $rootScope, $filter, $scope,$location) {
    /**declare variable */
    const _statusValueSet = [
        { name: "WFP", action: "loadDetails" },
        { name: "WFP", action: "approval" },
        { name: "WFP", action: "reject" },
        { name: "WFP", action: "return" },
        { name: "WFP", action: "resubmit" },
        { name: "WFP", action: "removeAttachment" },
        { name: "WFP", action: "pushAttachment" },
        { name: "WFP", action: "removeRelatedFile" },
        { name: "WFP", action: "pushRelatedFile" },
        { name: "WFP", action: "signAFile" },
        { name: "WFP", action: "transformSign" },
        { name: "WFP", action: "signOther" },
        { name: "WFP", action: "complete" },
        { name: "WFP", action: "received" },
        { name: "ODB", action: "insert" },
        { name: "ODB", action: "update" },
        { name: "ODB", action: "reset" },
        { name: "ODB", action: "release" },
        { name: "ODB", action: "updateRelease" },
        { name: "ODB", action: "getNumber" },
        { name: "ODB", action: "updateReferences"},
        { name: "waiting_storage", action: "insert" }
    ];
    var ctrl = this;
    const getCode = () => {
        let code = $location.search().code;
        if(code){ return code;}
        if ($rootScope.detailsInfo.url && $rootScope.detailsInfo.route === 'signing-details') {
            let temp = $rootScope.detailsInfo.url.split("?")[1];
            if(temp.indexOf("code")!==-1){
                code = temp.split("=")[1];
                return code;
            }
        }
        return undefined;
        
    };

    ctrl.code = getCode();

    var idEditor = "insertODB_excerpt";
    const Expiration_Date_Error_Msg = $filter('l')('ExpirationDateErrorMsg');

    var today = new Date();
    var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    var endDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    /** init variable */
    {
        ctrl._ctrlName = "sign_details_controller";

        ctrl.DocumentType_Config = {
            master_key: "document_type",
            load_details_column: "value"
        };

        ctrl.StatusOfSigning_Config = {
            master_key: "status_of_signing",
            load_details_column: "value"
        };
        ctrl.Competence_Config = {
            master_key: "competence",
            load_details_column: "value"
        };

        ctrl.Type = [
            { title: { "vi-VN": "Một người duyệt cho tất cả", "en-US": "One for all" }, key: "one" },
            { title: { "vi-VN": "Đồng thuận", "en-US": "All Approval" }, key: "all" },
            { title: { "vi-VN": "Xử lý văn bản", "en-US": "Word Processing" }, key: "process" },
            { title: { "vi-VN": "Nhận thông báo xử lý nghiệp vụ", "en-US": "Business Process Notification" }, key: "receiver" }
        ];

        ctrl.OutgoingDispatchBook_Config = {
            master_key: "outgoing_dispatch_book",
            load_details_column: "value"
        };

        ctrl.IncommingDispatchPririoty_Config = {
            master_key: "incomming_dispatch_priority",
            load_details_column: "value"
        };

        ctrl.KindOfDispatchTo_Config = {
            master_key: "kind_of_dispatch_to",
            load_details_column: "value"
        };


        ctrl.MethodOfSendingDispatchTo_Config = {
            master_key: "method_of_sending_dispatch_to",
            load_details_column: "value"
        };


        ctrl.LaborContractType_Config = {
            master_key: "larbor_contract_type",
            load_details_column: "value"
        };

        ctrl._insert_value = {
            outgoing_dispatch_book: "",
            workflow_play_id: "",
            document_date: myToday,
            outgoing_documents: [],
            attach_documents: [],
            signers: [],
            excerpt: "",
            userAndDepartment: {
                user: [],
                department: []
            },
            document_quantity: 1,
            transfer_date: myToday,
            expiration_date: myToday,
            note: "",
            priority: "",
        };

        ctrl.ODBreferences = {};
        ctrl.outgoing_dispatch_references = {};
        ctrl._insert_to_storage_value = {};
        ctrl._urlInsertModal = FrontendDomain + "/modules/office/workflow_play/details/views/store-briefcase-modal.html";
        ctrl._urlForwardModal = FrontendDomain + "/modules/office/workflow_play/details/views/forward_modal.html";
        ctrl._urlReleaseModal = FrontendDomain + "/modules/office/workflow_play/details/views/confirm_release_modal.html";
        ctrl.department_detail = {};
        ctrl.applyNewStorageFlow = false;
        $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);
    }

    function reset() {
        ctrl.Item = {};
        ctrl.task = [];
        ctrl.status = "see";
        ctrl.comment = "";
        ctrl.listTransformSign = [];
        ctrl.sign = "";
        ctrl.isSignOther = false;
        ctrl.odbDetail = {};
        ctrl.signer = [];
        ctrl.signerStr = '';
        ctrl.isProcess = false;
    }

    reset();

    ctrl.pickODB_insert = function (val) {
        ctrl._insert_value.outgoing_dispatch_book = val.value;
    }

    ctrl.isValidExpirationDate = function (isInsert, expiration_date) {
        let today = new Date();
        let currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        if (isInsert) {
            return (!expiration_date || expiration_date < currentDate) ? Expiration_Date_Error_Msg : '';
        } else {
            return expiration_date < currentDate ? Expiration_Date_Error_Msg : '';
        }
    }

    /**insert */
    function getNumber(odb_book) {
        return function () {
            var dfd = $q.defer();
            sign_details_service.get_number(odb_book).then(function (res) {
                
                dfd.resolve(res.data.number);
                res = undefined;
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }
    }

    ctrl.chooseDocumentDate_insert = function (val) {
        ctrl._insert_value.document_date = val.getTime();
    }

    ctrl.pickDocumentType_insert = function (val) {
        ctrl._insert_value.type = val.value;
    }

    ctrl.removeOutgoingDocuments_insert = function (item) {
        var temp = [];
        for (var i in ctrl._insert_value.outgoing_documents) {
            if (ctrl._insert_value.outgoing_documents[i].name != item.name) {
                temp.push(ctrl._insert_value.outgoing_documents[i]);
            }
        }
        ctrl._insert_value.outgoing_documents = angular.copy(temp);
    }

    ctrl.removeAttachDocuments_insert = function (item) {
        var temp = [];
        for (var i in ctrl._insert_value.attach_documents) {
            if (ctrl._insert_value.attach_documents[i].name != item.name) {
                temp.push(ctrl._insert_value.attach_documents[i]);
            }
        }
        ctrl._insert_value.attach_documents = angular.copy(temp);
    }

    ctrl.pickUserAndDepartment_insert = function (val) {
        ctrl._insert_value.userAndDepartment = val;
    }

    ctrl.choosePriority_insert = function (val) {
        ctrl._insert_value.priority = val.value;
    }

    ctrl.chooseTransferDate_insert = function (val) {
        ctrl._insert_value.transfer_date = val.getTime();
    }

    ctrl.chooseExpirationDate_insert = function (val) {
        ctrl.expirationDate_ErrorMsg = ctrl.isValidExpirationDate(true, val);
        ctrl._insert_value.expiration_date = val ? val.getTime() : null;
    }

    ctrl.chooseReceiveMethod_insert = function (val) {
        ctrl._insert_value.send_method = val.value;
    }

    ctrl.removeFile_insert = function (item) {
        var temp = [];
        for (var i in ctrl._insert_value.files) {
            if (ctrl._insert_value.files[i].name != item.name) {
                temp.push(ctrl._insert_value.files[i]);
            }
        }
        ctrl._insert_value.files = angular.copy(temp);
    }


    ctrl.transformSignOther = function (val) {
        ctrl._insert_value.transformSignOther = val;
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "transformSign", transform_sign_service);

    }

    function transform_sign_service() {
        var dfd = $q.defer();
        sign_details_service.transformSignOther(
            ctrl.thisId,
            ctrl._insert_value.transformSignOther,
        ).then(function () {
            ctrl.loadDetails();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.insertODB = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "ODB", "insert", insert_ODB_service);
    }

    function insert_ODB_service() {
        var dfd = $q.defer();
        const [outgoing_documents, old_outgoing_documents] = ctrl._insert_value.outgoing_documents.reduce(([newDocuments, oldDocuments], currentValue) => {
            if (currentValue.content) {
                newDocuments.push(currentValue);
            } else {
                oldDocuments.push({ name: currentValue.name });
            }
            return [newDocuments, oldDocuments];
        }, [[], []]);

        const [attach_documents, old_attach_documents] = ctrl._insert_value.attach_documents.reduce(([newDocuments, oldDocuments], currentValue) => {
            if (currentValue.content) {
                newDocuments.push(currentValue);
            } else {
                oldDocuments.push({ name: currentValue.name });
            }
            return [newDocuments, oldDocuments];
        }, [[], []]);

        if (ctrl.Item.status === 'SaveODB') {
            ctrl._insert_value.outgoing_dispatch_id = ctrl.odbDetail._id;
        } else {
            ctrl._insert_value.outgoing_dispatch_id = "";
        }

        sign_details_service.insertODB(
            ctrl._insert_value.outgoing_dispatch_book,
            ctrl.thisId,
            ctrl._insert_value.document_date,
            outgoing_documents,
            attach_documents,
            ctrl._insert_value.excerpt,
            ctrl._insert_value.signers,
            ctrl.Item.department,
            ctrl._insert_value.userAndDepartment.user,
            ctrl._insert_value.userAndDepartment.department,
            ctrl._insert_value.document_quantity,
            ctrl._insert_value.transfer_date,
            ctrl._insert_value.note,
            ctrl._insert_value.expiration_date,
            ctrl._insert_value.priority,
            ctrl._insert_value.outgoing_dispatch_id,
            old_outgoing_documents,
            old_attach_documents,
            ctrl.Item.parents || [],
            {
                object: "workflow_play",
                code: ctrl.Item.code,
                id: ctrl.Item._id
            },
            ctrl._insert_value.code,
            ctrl._insert_value.orderNumber
        ).then(function () {
            ctrl.loadDetails();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    // INSERT TO STORAGE
    ctrl.prepareInsertToStorage = function () {
        var currentYear = new Date().getFullYear();
        ctrl._insert_to_storage_value = {
            title: ctrl.odbDetail.title,
            organ_id: '000.00.45.429',
            file_notation: ``,
            language: "",
            rights: "",
            description: "",
            year: currentYear,
            maintenance_time: {
                amount: 1,
                unit: "day",
            },
            reference: [
                {
                    type: "OutgoingDispatch",
                    id: ctrl.odbDetail._id,
                },
            ],
        };
    };

    function insertStorage_service() {
        var dfd = $q.defer();
        sign_details_service.insertToStorage(
            ctrl._insert_to_storage_value.title,
            ctrl._insert_to_storage_value.organ_id,
            ctrl._insert_to_storage_value.file_notation,
            ctrl._insert_to_storage_value.language,
            ctrl._insert_to_storage_value.rights,
            ctrl._insert_to_storage_value.year,
            ctrl._insert_to_storage_value.description,
            ctrl._insert_to_storage_value.maintenance_time,
            ctrl._insert_to_storage_value.reference,
        ).then(function () {
            $(".workflow-play-detail #modal_insert_storage").modal("hide");
            ctrl.loadDetails();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.insertToStorage = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "waiting_storage", "insert", insertStorage_service);
    }

    ctrl.isWFPCompleted = function () {
        return ctrl.Item.status === 'Completed' || ctrl.isOutgoingDispatchReleased();
    }

    ctrl.isProcessSaveODB = function () {
        if(ctrl.Item.node == -1 || ctrl.Item.node == 0){
            return false;
        } 
        if(ctrl.Item.status === 'SaveODB'){
            return false;
        }
        if(ctrl.Item.flow[ctrl.Item.node -1].type == 'process'){
            return false;
        }
        return true;
    }

    ctrl.isShowCreatedProcessSaveODB = function () {
        if( $rootScope.logininfo.username == ctrl.Item.username && ctrl.Item.status === 'SaveODB' && ctrl.Item.node == -1){
            return false;
        } 
        return true;
    }
    ctrl.isOutgoingDispatchReleased = function () {
        return ctrl.Item.outgoing_dispatch && ['Released', 'SaveBriefCase'].includes(ctrl.Item.outgoing_dispatch.status);
    }

    ctrl.archiveProfileCompleted = function () {
        return ctrl.Item.outgoing_dispatch && ['Released'].includes(ctrl.Item.outgoing_dispatch.status) && $rootScope.logininfo.username == ctrl.Item.username;
    }
    ctrl.searchReference = function (search) {
        if(search.search == undefined){
            search.search = ' ';
        }
        var dfd = $q.defer();
        sign_details_service.searchReference(search.search)
            .then(({ data }) => {
                dfd.resolve(data);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
        return dfd.promise;
    }

    ctrl.chooseReference = function (item) {
        ctrl.ODBreferences = item.map(data =>{
            return {
                ...data,
                isDefault: false
            }
        });
    }

    ctrl.isShowWFPDetails = function () {
        return !(ctrl.isWFPCompleted() && ctrl.applyNewStorageFlow);
    }

    init();
    function init() {
        var dfdAr = [];
        ctrl.relatedFiles = []
        dfdAr.push(load_employee_detail());
        $(".modal-backdrop").remove();
        $("body").removeClass("modal-open");

        for (var i in $rootScope.Settings) {
            if ($rootScope.Settings[i].key === "applyNewStorageFlow") {
                ctrl.applyNewStorageFlow = $rootScope.Settings[i].value;
                break;
            }
        }

        $q.all(dfdAr).then(
            function () {
            }, function (err) {
                console.log(err);
                err = undefined;
            }
        );
    }

    function load_employee_detail() {
        var dfd = $q.defer();
        sign_details_service.loadEmployeeDetail($rootScope.logininfo.data.employee).then(function (res) {
            ctrl.sign = res.data.signature.link;
            ctrl.quotationMark = res.data.quotationMark.link;
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.transformWritenBy = function (text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    ctrl.loadDepartment_details = function (params) {
        let dfd = $q.defer();
        sign_details_service.loadDepartment_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

    ctrl.loadfileTask = function (params) {
        return function () {
            var dfd = $q.defer();
            sign_details_service.loadFileInfoTask(params.id, params.name).then(function (res) {
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

    ctrl.loadRole_details = function (params) {
        let dfd = $q.defer();
        sign_details_service.loadRole_details(params.id).then(function (res) {
            dfd.resolve(res.data);
            res = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }
    ctrl.loadfile = function (params) {
        return function () {
            var dfd = $q.defer();
            sign_details_service.loadFileInfo(params.id, params.name).then(function (res) {
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
    /**show Infomation Details*/

    function setCodeOutgoing(orderNumber){
        ctrl.Item.code = orderNumber;
        let template  = angular.copy(ctrl.currentOutGoingBook.number_and_notation);
        let ordernumber = angular.copy(orderNumber);
        $q.all([
            sign_details_service.loadDepartmentDetails(ctrl.Item.department),
            sign_details_service.getDerectoryDetails(ctrl.DocumentType_Config.load_details_column,ctrl.Item.document_type,ctrl.DocumentType_Config.master_key )
        ]).then(function([departmentDetails,documentTypeDetails]){
            let documenttype = documentTypeDetails.data.abbreviation;
            let department = departmentDetails.data.abbreviation;
            let theCode = template.replace(/{{ordernumber}}/g, ordernumber)
            .replace(/{{department}}/g, department).replace(/{{documenttype}}/g, documenttype);
            ctrl._insert_value.code = theCode;
        },function(err){console.log(err);});


    }

    function setOutgoingNumber() {
        let dfd = $q.defer();
        getNumber(ctrl._insert_value.outgoing_dispatch_book)().then(function(orderNumber){
            ctrl._insert_value.orderNumber = orderNumber;
            dfd.resolve(true);
        },function(err){console.log(err);});
        return dfd.promise;
    }

    function autoSetOutGoingBook(odbRes) {
        const odbs = odbRes.data || [];
        if (odbs.length) {
            const matchOdb = odbs.find(odb => odb.document_type.indexOf(ctrl.Item.document_type) !== -1 && odb.year === new Date().getFullYear());
            if (matchOdb) {
                ctrl.currentOutGoingBook = matchOdb;
                ctrl._insert_value.outgoing_dispatch_book = matchOdb.value;
            }
        }
    }
    function initDataForProcessStep(odbRes) {
        autoSetOutGoingBook(odbRes);
        if (ctrl._insert_value.outgoing_dispatch_book) {
            setOutgoingNumber().then(function(){
                setCodeOutgoing(ctrl._insert_value.orderNumber);
            },function(){})
            
        }
    }

    function loadDetails_service() {
        var dfd = $q.defer();
        ctrl.isLoadSuccess = false;
        ctrl.task = [];
        ctrl.signer = [];
        ctrl.signerStr = '';
        ctrl.mergedRelatedFiles = [];
        $q.all([
            sign_details_service.loadDetails(ctrl.thisId, ctrl.code),
            sign_details_service.loadDirectories(ctrl.OutgoingDispatchBook_Config.master_key),
        ]).then(function ([res, odbRes]) {
            ctrl.Item = res.data;
            if (ctrl.Item.outgoing_dispatch && ctrl.Item.outgoing_dispatch.references) {
                ctrl.outgoing_dispatch_references = ctrl.Item.outgoing_dispatch.references;
                ctrl.ODBreferences = ctrl.outgoing_dispatch_references.filter(reference => reference.isDefault === false);
            } 
            
            ctrl.thisId = ctrl.Item._id;
            ctrl.breadcrumb = [
                ...(ctrl.Item.parents || []).reverse(),
                { object: 'workflow_play', code: ctrl.Item.code },
            ];
            ctrl.task = res.data.task || [];
            ctrl.display_status = ctrl.Item.status;
            ctrl._insert_value.type = res.data.document_type;
            ctrl._insert_value.title = res.data.title;




            res.data.event.forEach((item) => {
                if (item.action && item.action === 'Signed') {
                    ctrl._insert_value.signers.push(item.username)
                }
            });
            ctrl.mergedRelatedFiles = res.data.relatedfile.map((item) => {
                return Object.assign(item, { owner: res.data.username })
            });
            res.data.event.forEach((item) => {
                if (Array.isArray(item.relatedfile) && item.relatedfile.length) {
                    ctrl.mergedRelatedFiles = ctrl.mergedRelatedFiles.concat(item.relatedfile.map((ele) => Object.assign(ele, { owner: item.username })))
                }
            })
            // ctrl.signerStr = ctrl.signer.join(', ');
            if (ctrl.Item && ctrl.Item.play_now) {
                for (var i in ctrl.Item.play_now) {
                    if (ctrl.Item.play_now[i].username == $rootScope.logininfo.username) {
                        ctrl.status = "pending";
                        if (ctrl.Item.event && ctrl.Item.node) {
                            let eventList = JSON.parse(JSON.stringify(ctrl.Item.event));
                            eventList = eventList.reverse();
                            for (const e of eventList) {
                                if (e.action.toLowerCase() === 'returned') {
                                    break;
                                }
                                if (e.node === ctrl.Item.node
                                    && e.username === $rootScope.logininfo.username
                                    && e.action.toLowerCase() === 'approved'
                                    && e.valid === true) {
                                    ctrl.status = "see";
                                }
                            }
                        }
                        break;
                    }
                }
            }

            ctrl.listTransformSign = ctrl.Item.event.filter(event => event.valid && event.action === 'transformSign');

            if (ctrl.listTransformSign.some(ts => ts.node === ctrl.Item.node && ts.receiver === $rootScope.logininfo.username)) {
                ctrl.isSignOther = true;
            }

            if (
                ctrl.Item.node === ctrl.Item.flow.length &&
                ctrl.Item.flow[ctrl.Item.node - 1].type === 'process' &&
                ctrl.Item.play_now.some(usr => usr.username === $rootScope.logininfo.username)
            ) {
                ctrl.isProcess = true;
            }
            ctrl.outgoing_dispatch = res.data.outgoing_dispatch || {};
            if (ctrl.Item.status === 'SaveODB') {
                ctrl.isProcess = true;
                ctrl.odbDetail = res.data.outgoing_dispatch || {};
                ctrl._insert_value = ctrl.odbDetail;
                ctrl.status = 'SaveODB';
                ctrl._insert_value.userAndDepartment = {
                    user: ctrl.odbDetail.receiver_notification,
                    department: ctrl.odbDetail.department_notification
                };
            } else {
                ctrl._insert_value.userAndDepartment = ctrl.Item.user_and_department_destination || {};
            }

            dfd.resolve(true);
            // if this step is process step
            if (ctrl.isProcess) {
                initDataForProcessStep(odbRes);
            }

            ctrl.isLoadSuccess = true;
            res = undefined;
            dfd = undefined;
        }, function (err) {
            if (err.status === 403) {
                $rootScope.urlPage = urlNotPermissionPage;
            } else {
                $rootScope.urlPage = urlNotFoundPage;
            }
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }

    ctrl.loadDetails = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "loadDetails", loadDetails_service);
    }

    if (ctrl.code) {
        ctrl.loadDetails();
    } else if ($rootScope.detailsInfo.url && $rootScope.detailsInfo.route === 'signing-details') {
        
        ctrl.thisId = $rootScope.detailsInfo.url.split("?")[1];
        if (!ctrl.thisId || ctrl.thisId.length !== 24) {
            $rootScope.detailsInfo.urlPage = urlNotFoundPage;
        } else {
            ctrl.loadDetails();
        }
    } else {
        ctrl.thisId = $rootScope.currentPath.split("?")[1];
        if (!ctrl.thisId || ctrl.thisId.length !== 24) {
            $rootScope.urlPage = urlNotFoundPage;
        } else {
            ctrl.loadDetails();
        }
    }

    $scope.$watch(getCode, function (newVal) {
        if (newVal && newVal !== ctrl.code) {
            ctrl.code = newVal;
            ctrl.loadDetails();
        }
    });

    function getCurrentNode() {
        if (!ctrl.Item.flow || !ctrl.Item.flow.length) {
            return undefined;
        }
        const index = ctrl.Item.node > 0 ? ctrl.Item.node - 1 : ctrl.Item.flow.length - 1;
        return ctrl.Item.flow[index];
    }

    ctrl.getNodeType = function () {
        const currentNode = getCurrentNode();
        return currentNode ? currentNode.type : '';
    };

    ctrl.isPendingSign = function () {
        if (ctrl.status !== 'pending') {
            return false;
        }

        const currentNode = getCurrentNode();
        const flowItems = currentNode ? currentNode.items : [];
        const playNow = ctrl.Item.play_now.find(p => p.username === $rootScope.logininfo.username);
        const playNowItems = flowItems.filter(item => (playNow.items || []).includes(item.id));
        const isNeedSign = playNowItems.some(item => !!item.signature || !!item.quotationMark);

        return !isNeedSign ? false : playNowItems.some(item => {
            const isSignedSignature = ctrl.Item.signatureTags.some(tag => tag.name === item.signature && tag.isSigned);
            const isSignedQuotationMark = ctrl.Item.signatureTags.some(tag => tag.name === item.quotationMark && tag.isSigned);
            return !isSignedSignature && !isSignedQuotationMark;
        });
    };

    /**approval */
    function approval_service() {
        var dfd = $q.defer();
        sign_details_service.approval(ctrl.thisId, ctrl.comment, ctrl.relatedFiles).then(function (res) {
            ctrl.status = "approved";
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
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "approval", approval_service);
    }

    /**approval */
    function complete_exploit_document_service() {
        var dfd = $q.defer();
        sign_details_service.complete(ctrl.thisId, ctrl.comment, ctrl.relatedFiles).then(function (res) {
            ctrl.status = "completed";
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }


    ctrl.completeDocument = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "complete", complete_exploit_document_service);
    }

    ctrl.receivedNotification = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "received", received_exploit_document_service);
    }

    /**approval */
    function received_exploit_document_service() {
        var dfd = $q.defer();
        sign_details_service.receiver(ctrl.thisId, ctrl.relatedFiles).then(function (res) {
            ctrl.status = "received";
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }

    function sign_other_service() {
        var dfd = $q.defer();
        sign_details_service.signOther(ctrl.thisId, ctrl.comment, ctrl.relatedFiles).then(function (res) {
            ctrl.status = "approved";
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }

    ctrl.signOther = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "signOther", sign_other_service);
    }

    /**reject */

    function reject_service() {
        var dfd = $q.defer();
        sign_details_service.reject(ctrl.thisId, ctrl.comment, ctrl.relatedFiles).then(function (res) {
            ctrl.status = "rejected";
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
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "reject", reject_service);
    }

    /**return */

    function return_service() {
        var dfd = $q.defer();
        sign_details_service.return(ctrl.thisId, ctrl.comment, ctrl.relatedFiles).then(function (res) {
            ctrl.status = "returned";
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }


    ctrl.return = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "return", return_service);
    }

    /**resubmit */

    function resubmit_service() {
        var dfd = $q.defer();
        sign_details_service.resubmit(ctrl.thisId, ctrl.comment).then(function (res) {
            ctrl.status = "resubmitted";
            // dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;

    }


    ctrl.resubmit = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "resubmit", resubmit_service);
    }

    /**remove file */
    function removeAttachment_service(filename) {
        return function () {
            var dfd = $q.defer();
            sign_details_service.removeAttachment(ctrl.Item._id, filename).then(function (res) {
                var temp = [];
                for (var i in ctrl.Item.attachment) {
                    if (ctrl.Item.attachment[i].name !== filename) {
                        temp.push(ctrl.Item.attachment[i]);
                    }
                }
                ctrl.Item.attachment = temp;
                temp = undefined;
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }
    }

    ctrl.removeAttachment = function (item) {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "removeAttachment", removeAttachment_service(item.name));
    }

    function removeRelatedFile_service(filename) {
        return function () {
            var dfd = $q.defer();
            sign_details_service.removeRelatedFile(ctrl.Item._id, filename).then(function (res) {
                var temp = [];
                for (var i in ctrl.Item.relatedfile) {
                    if (ctrl.Item.relatedfile[i].name !== filename) {
                        temp.push(ctrl.Item.relatedfile[i]);
                    }
                }
                ctrl.Item.relatedfile = temp;
                temp = undefined;
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }
    }

    ctrl.removeRelatedFile = function (item) {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "removeRelatedFile", removeRelatedFile_service(item.name));
    }


    /** add file*/

    function pushAttachment_service(file) {
        return function () {
            var dfd = $q.defer();
            sign_details_service.pushAttachment(file, ctrl.Item._id).then(function (res) {
                ctrl.Item.attachment.push(res.data);
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }

    }

    ctrl.pushAttachment = function (file) {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "pushAttachment", pushAttachment_service(file));
    }


    function pushRelatedFile_service(file) {
        return function () {
            var dfd = $q.defer();
            sign_details_service.pushRelatedFile(file, ctrl.Item._id).then(function (res) {
                ctrl.Item.relatedfile.push(res.data);
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }

    }

    ctrl.pushRelatedFile = function (file) {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "pushRelatedFile", pushRelatedFile_service(file));
    }


    /**sign a file */
    function signAFile_service(params) {
        let fileName = params.name;
        return function () {
            var dfd = $q.defer();
            sign_details_service.signAFile(ctrl.Item._id, fileName).then(function (res) {
                ctrl.loadDetails();
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }

    }

    ctrl.signAFile = function (filename) {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "WFP", "signAFile", signAFile_service(filename));
    }

    ctrl.handleUpdateWFPSuccess = function () {
        reset();
        ctrl.loadDetails();
    };

    //reset data
    ctrl.resetData = function () {
        ctrl._update_value.odb_book = "";
        ctrl._update_value.priority = ""
    }

    //update release info
    ctrl.updateRelease = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "ODB", "updateRelease", update_release_service);
    }

    function update_release_service() {
        var dfd = $q.defer();
        sign_details_service.updateReleaseInfo(
            ctrl.odbDetail._id,
            ctrl._update_value.notification_departments,
            ctrl._update_value.notification_recipients).then(function () {
                ctrl.loadDetails();
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            })
        return dfd.promise;
    }

    //update ODB
    ctrl.updateODB = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "ODB", "update", updateODB_service);
    }
    function updateODB_service() {
        var dfd = $q.defer();
        sign_details_service.updateODB(
            ctrl._update_value._id,
            ctrl._update_value.odb_book,
            ctrl._update_value.signed_date,
            ctrl._update_value.type,
            $("#" + idEditor_update).summernote('code'),
            ctrl._update_value.expiration_date,
            ctrl._update_value.priority
        ).then(function () {
            ctrl.loadDetails();
            dfd.resolve(true);
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }

        //update ODB
        ctrl.updateReferencesODB_service = function () {
            return $rootScope.statusValue.execute(ctrl._ctrlName, "ODB", "updateReferences", updateReferencesODB_service);
        }
        function updateReferencesODB_service() {
            const defaultReferences = ctrl.outgoing_dispatch_references.filter(reference => reference.isDefault === true);
            const combinedReferences = [...defaultReferences, ...ctrl.ODBreferences];
            var dfd = $q.defer();
            sign_details_service.updateReferencesODB(
                ctrl.outgoing_dispatch._id,
                combinedReferences
            ).then(function () {
                ctrl.loadDetails();
                dfd.resolve(true);
                dfd = undefined;
            }, function (err) {
                dfd.reject(err);
                err = undefined;
            });
            return dfd.promise;
        }
    ctrl.loadDetailsReference = function (params) {
        return $q.resolve(params.ids)
    }
    ctrl.pickODB_update = function (val) {
        ctrl._update_value.odb_book = val.value;
    }

    ctrl.pickDAT_update = function (val) {
        ctrl._update_value.type = val.value;
    }

    ctrl.chooseSignedDate_update = function (val) {
        ctrl._update_value.signed_date = val.getTime();
    }

    ctrl.choosePriority_update = function (val) {
        ctrl._update_value.priority = val.value;
    }
    //forward ODB
    ctrl.forwardODB = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "ODB", "forward", forwardODB_service);
    }

    ctrl.chooseExpirationDate_update = function (val) {
        ctrl.expirationDate_ErrorMsg = ctrl.isValidExpirationDate(true, val);
        ctrl._update_value.expiration_date = val ? val.getTime() : null;
    }

    ctrl.pickHost_release = function (val) {
        ctrl._update_value.host = val;
    }

    ctrl.pickCoordinator_release = function (val) {
        ctrl._update_value.coordinator = val;
    }

    ctrl.pickNotificationDepartments_release = function (val) {
        ctrl._update_value.notification_departments = val;
    }

    ctrl.pickNotificationPerson_release = function (val) {
        ctrl._update_value.notification_recipients = val;
    }

    ctrl.releaseODB = function () {
        return $rootScope.statusValue.execute(ctrl._ctrlName, "ODB", "release", release_service);
    }

    ctrl.pickCurrentItem = function () {
        ctrl.currentItem = ctrl.odbDetail
    }

    function release_service() {
        var dfd = $q.defer();
        sign_details_service.releaseODB(ctrl.odbDetail._id).then(function (res) {
            ctrl.loadDetails();
            $("#modal_ODB_Release_Confirm").modal("hide");
            dfd.resolve(true);
            res = undefined;
            dfd = undefined;
        }, function (err) {
            dfd.reject(err);
            err = undefined;
        });
        return dfd.promise;
    }
}]);

