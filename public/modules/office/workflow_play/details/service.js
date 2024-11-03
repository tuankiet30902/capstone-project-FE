
myApp.registerFtr('sign_details_service', ['fRoot', function (fRoot) {
    var obj = {};
 
    obj.loadDetails = function (id, code) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/loaddetails",
            method: "POST",
            data: JSON.stringify({ id, code }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadFileInfoTask = function (id, filename) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/loadfileinfo",
            method: "POST",
            data: JSON.stringify({ id, filename }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadDepartment_details = function(id){
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

    obj.loadRole_details = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/loaddetails",
            method: "POST",
            data: JSON.stringify({ type: "value", id, master_key: "role" }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }


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
    
    obj.approval = function(id,comment,relatedFiles){
        var formData = new FormData();

        for (var i in relatedFiles) {
            formData.append(
                "relatedfile",
                relatedFiles[i].file,
                relatedFiles[i].name
            );
        }
        formData.append("id", id);
        formData.append("comment", comment);

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/approval",
            method: "POST",
            data: formData,
            headers: {
                "Content-Type": undefined,
            }
        });
    }

    obj.signOther = function(id,comment,relatedFiles){
        var formData = new FormData();

        for (var i in relatedFiles) {
            formData.append(
                "relatedfile",
                relatedFiles[i].file,
                relatedFiles[i].name
            );
        }
        formData.append("id", id);
        formData.append("comment", comment);

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/signOther",
            method: "POST",
            data: formData,
            headers: {
                "Content-Type": undefined,
            }
        });
    }

    obj.reject = function(id,comment,relatedFiles){

        var formData = new FormData();

        for (var i in relatedFiles) {
            formData.append(
                "relatedfile",
                relatedFiles[i].file,
                relatedFiles[i].name
            );
        }
        formData.append("id", id);
        formData.append("comment", comment);

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/reject",
            method: "POST",
            data: formData,
            headers: {
                "Content-Type": undefined,
            }
        });
    }

    obj.return = function(id,comment,relatedFiles){

        var formData = new FormData();

        for (var i in relatedFiles) {
            formData.append(
                "relatedfile",
                relatedFiles[i].file,
                relatedFiles[i].name
            );
        }
        formData.append("id", id);
        formData.append("comment", comment);

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/return",
            method: "POST",
            data: formData,
            headers: {
                "Content-Type": undefined,
            }
        });
    }

    obj.pushAttachment = function (file, id) {
        var formData = new FormData();
        // formData.append('file',files);
        formData.append('file', file.file, file.name);

        formData.append('id', id);

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/pushattachment",
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }

    obj.removeAttachment = function (id, filename) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/removeattachment",
            method: "POST",
            data: JSON.stringify({ id, filename }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.pushRelatedFile = function (file, id) {
        var formData = new FormData();
        // formData.append('file',files);
        formData.append('file', file.file, file.name);

        formData.append('id', id);

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/pushrelatedfile",
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }

    obj.removeRelatedFile = function (id, filename) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/removerelatedfile",
            method: "POST",
            data: JSON.stringify({ id, filename }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.signAFile = function (workflowPlayId, fileName) {
        return fRoot.requestHTTP({
            url: BackendDomain + `/office/workflow_play/${workflowPlayId}/sign`,
            method: "POST",
            data: JSON.stringify({ fileName }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.get_number = function (odb_book) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/outgoing_dispatch/get_number",
            method: "POST",
            data: JSON.stringify({ odb_book}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_odb_detail = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/outgoing_dispatch/loadDetail",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.transformSignOther = function (id, receiver) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/transformSignOther",
            method: "POST",
            data: JSON.stringify({ id, receiver}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.insertODB = function (
        outgoing_dispatch_book,
        workflow_play_id,
        document_date,
        outgoing_documents,
        attach_documents,
        excerpt,
        signers,
        draft_department,
        receiver_notification,
        department_notification,
        document_quantity,
        transfer_date,
        note,
        expiration_date,
        priority,
        outgoing_dispatch_id,
        old_outgoing_documents,
        old_attach_documents,
        parents,
        parent,
        code,
        number
    ) {
        var formData = new FormData();
        for (var i in outgoing_documents) {
            formData.append("outgoing_documents", outgoing_documents[i].file, outgoing_documents[i].name);
        }
        for (var i in attach_documents) {
            formData.append("attach_documents", attach_documents[i].file, attach_documents[i].name);
        }
        if(parents){
            formData.append('parents', JSON.stringify(parents));   
        }

        if(parent){
            formData.append('parent', JSON.stringify(parent));   
        }
        formData.append('outgoing_dispatch_book', outgoing_dispatch_book);
        formData.append('workflow_play_id', workflow_play_id);
        formData.append('document_date', document_date);
        formData.append('excerpt', excerpt);
        formData.append('signers', JSON.stringify(signers));
        formData.append('draft_department', draft_department);
        formData.append('receiver_notification', JSON.stringify(receiver_notification));
        formData.append('department_notification', JSON.stringify(department_notification));
        formData.append('document_quantity', document_quantity);
        formData.append('transfer_date', transfer_date);
        formData.append('note', note);
        formData.append('expiration_date', expiration_date);
        formData.append('priority', priority);
        formData.append('outgoing_dispatch_id', outgoing_dispatch_id);
        formData.append('old_outgoing_documents', JSON.stringify(old_outgoing_documents));
        formData.append('old_attach_documents', JSON.stringify(old_attach_documents));
        formData.append('code', code);
        formData.append('number', number);
        return fRoot.requestHTTP({
          url: BackendDomain + "/office/workflow_play/process",
          method: "POST",
          data: formData,
          headers: {
            'Content-Type':  undefined
          },
        });
    };

    obj.updateODB = function (
        id,
        odb_book,
        signed_date,
        type,
        excerpt,
        expiration_date,
        priority
    ) {
        return fRoot.requestHTTP({
          url: BackendDomain + "/office/outgoing_dispatch/update",
          method: "POST",
          data: JSON.stringify({
              id,
              from: 'origin',
              odb_book,
              signed_date,
              type,
              excerpt,
              expiration_date,
              priority
          }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json;odata=verbose",
          },
        });
    }

    obj.updateReferencesODB = function (
        id,
        references
    ) {
        return fRoot.requestHTTP({
          url: BackendDomain + "/office/outgoing_dispatch/update-references",
          method: "POST",
          data: JSON.stringify({
              id,
              from: 'origin',
              references
          }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json;odata=verbose",
          },
        });
    }

    obj.updateReleaseInfo = function (
        id,
        notification_departments,
        notification_recipients
    ) {
        return fRoot.requestHTTP({
          url: BackendDomain + "/office/outgoing_dispatch/update",
          method: "POST",
          data: JSON.stringify({
              id,
              from: 'transfer',
              notification_departments,
              notification_recipients
          }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json;odata=verbose",
          },
        });
    }

    obj.releaseODB = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/outgoing_dispatch/release",
            method: "POST",
            data: JSON.stringify({ id }),
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

    obj.insertToStorage = function (
        title,
        organ_id,
        file_notation,
        language,
        rights,
        year,
        description,
        maintenance_time,
        reference
      ) {
        var dataInsert = JSON.stringify({
            title,
            organ_id,
          file_notation,
            language,
            rights,
            year,
            description,
            maintenance_time,
            reference
        })
        return fRoot.requestHTTP({
          url: BackendDomain + "/office/briefcase/insert",
          method: "POST",
          data: dataInsert,
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json;odata=verbose"
          },
        });
      };

    obj.complete = function (id, comment, relatedFiles) {
        var formData = new FormData();

        for (var i in relatedFiles) {
            formData.append(
                "relatedfile",
                relatedFiles[i].file,
                relatedFiles[i].name
            );
        }
        formData.append("id", id);
        formData.append("comment", comment);

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/complete",
            method: "POST",
            data: formData,
            headers: {
                "Content-Type": undefined,
            }
        });
    }


    obj.receiver = function(id,comment,relatedFiles){
        var formData = new FormData();

        for (var i in relatedFiles) {
            formData.append(
                "relatedfile",
                relatedFiles[i].file,
                relatedFiles[i].name
            );
        }
        formData.append("id", id);
        formData.append("comment", comment);

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/receiver",
            method: "POST",
            data: formData,
            headers: {
                "Content-Type": undefined,
            }
        });
    }

    obj.loadDepartmentDetails = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/organization/loaddetails",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        })
    }

    obj.getDerectoryDetails = function(type,id,master_key){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/loaddetails",
            method: "POST",
            data: JSON.stringify({ type,id,master_key }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        })
    }

    obj.searchReference = function (search) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/briefcase/search-reference",
            method: "POST",
            data: JSON.stringify({search}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    return obj;
}]);
