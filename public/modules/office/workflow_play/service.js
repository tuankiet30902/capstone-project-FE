myApp.registerFtr('workflow_play_service', ['fRoot', function (fRoot) {
    var obj = {};
    obj.load = function(checks, search, document_type, status, top, offset, sort, statuses) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/load",
            method: "POST",
            data: JSON.stringify({ 
                checks, search, document_type, status, top, offset, sort, statuses
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }



    obj.count = function (search,document_type,status,checks,is_personal, is_department) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/count",
            method: "POST",
            data: JSON.stringify({ search,document_type,status,checks,is_personal, is_department}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }


    
    obj.loadWorkflow_details = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow/loaddetails",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadWFP_details = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/loaddetails",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.init = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/init",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadCustomTemplatePreview = function (workflowId, tagsValue) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow/custom-template-preview",
            method: "POST",
            data: JSON.stringify({ workflowId, tagsValue }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose",
            },
        });
    };

    obj.parseCustomTemplate = function (file) {
        const formData = new FormData();
        formData.append('file', file.file, file.name);
        return fRoot.requestHTTP({
            url: BackendDomain + '/office/workflow/template-parser',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    };

    obj.insert = function (
        files,
        relatedFiles,
        appendixFiles,
        title,
        flowInfo,
        flow,
        documentType,
        tagsValue,
        archivedDocuments,
        parents,
        parent,
        userAndDepartmentDestination,
        is_personal,
        is_department,
    ) {
        var formData = new FormData();
        for (var i in files) {
            formData.append("file", files[i].file, files[i].name);
        }
        for (var i in relatedFiles) {
            formData.append(
                "relatedfile",
                relatedFiles[i].file,
                relatedFiles[i].name
            );
        }

        for(var i in appendixFiles) {
            formData.append(
                "appendix",
                appendixFiles[i].file,
                appendixFiles[i].name
            )
        }

        if(parents){
            formData.append('parents', JSON.stringify(parents));   
        }

        if(parent){
            formData.append('parent', JSON.stringify(parent));   
        }
        
        formData.append("title", title);
        formData.append("flow_info", JSON.stringify(flowInfo));
        formData.append("flow", JSON.stringify(flow));
        formData.append("document_type", documentType);
        formData.append("tags_value", JSON.stringify(tagsValue));
        formData.append("archived_documents", JSON.stringify(archivedDocuments));
        formData.append("user_and_department_destination", JSON.stringify(userAndDepartmentDestination));
        formData.append("is_personal", is_personal);
        formData.append("is_department", is_department);

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/insert",
            method: "POST",
            data: formData,
            headers: {
                "Content-Type": undefined,
            },
        });
    };

    obj.resubmit = function (
        id,
        title,
        files,
        relatedFiles,
        preserveRelatedFiles,
        tagsValue,
        comment
    ) {
        var formData = new FormData();
        for (var i in files) {
            formData.append("file", files[i].file, files[i].name);
        }
        for (var i in relatedFiles) {
            formData.append(
                "relatedfile",
                relatedFiles[i].file,
                relatedFiles[i].name
            );
        }

        formData.append("id", id);
        formData.append("title", title);
        formData.append("preserve_relatedfile", JSON.stringify(preserveRelatedFiles));
        formData.append("tags_value", JSON.stringify(tagsValue));
        formData.append("comment", comment);

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/resubmit",
            method: "POST",
            data: formData,
            headers: {
                "Content-Type": undefined,
            },
        });
    };

    obj.loadFileInfo = function(id,filename){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/loadfileinfo",
            method: "POST",
            data: JSON.stringify({id,filename}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadFileTemplateInfo = function(name){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow/loadfiletemplateinfo",
            method: "POST",
            data: JSON.stringify({name}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }



    obj.countPending = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/countpending",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.approval = function(id,comment){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/approval",
            method: "POST",
            data: JSON.stringify({id,comment}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.reject = function(id,comment){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/reject",
            method: "POST",
            data: JSON.stringify({id,comment}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }


    
    obj.delete = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/delete",
            method: "POST",
            data: JSON.stringify({id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadUsersByDepartment = function(request){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/user/load_for_pick_user_directive",
            method: "POST",
            data: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadAllUser = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/user/load",
            method: "POST",
            data: JSON.stringify({ isactive: true, offset: 0, top: 0, sort: {} }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadDirectories = function (master_key) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/load_for_directive",
            method: "POST",
            data: JSON.stringify({master_key, top: 999, offset: 0}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadDepartmentDetails = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/organization/loaddetails",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadEmployeeDetail = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/employee/loaddetails",
            method: "POST",
            data: JSON.stringify({id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadArchivedDocumentByCode = function (code) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/outgoing_dispatch/loadArchivedDocument",
            method: "POST",
            data: JSON.stringify({ code }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    
    return obj;
}]);