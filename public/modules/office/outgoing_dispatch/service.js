myApp.registerFtr('dispatch_outgoing_service', ['fRoot', function (fRoot) {
    var obj = {};
    
    obj.load = function(search,da_book,priority,receive_method,type,tab,top,offset,sort){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/outgoing_dispatch/load",
            method: "POST",
            data: JSON.stringify({ search,da_book,priority,receive_method,type,tab,top,offset,sort}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count = function (search,da_book,priority,receive_method,type,tab) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/outgoing_dispatch/count",
            method: "POST",
            data: JSON.stringify({ search,da_book,priority,receive_method,type,tab}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadFileInfo = function(id,filename){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/outgoing_dispatch/loadfileinfo",
            method: "POST",
            data: JSON.stringify({id,filename}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.insert = function (
        code,
        orderNumber,
        outgoing_dispatch_book,
        type,
        document_date,
        priority,
        transfer_date,
        expiration_date,
        note,
        document_quantity,
        department,
        receiver_notification,
        department_notification,
        outgoing_documents,
        attach_documents,
        signers,
        excerpt) {
            var formData = new FormData();

            for (var i in outgoing_documents) {
                formData.append("outgoing_documents", outgoing_documents[i].file, outgoing_documents[i].name);
            }

            for (var i in attach_documents) {
                formData.append("attach_documents", attach_documents[i].file, attach_documents[i].name);
            }

            formData.append('outgoing_dispatch_book', outgoing_dispatch_book);
            formData.append('document_date', document_date);
            formData.append('excerpt', excerpt);
            formData.append('signers', JSON.stringify(signers));
            formData.append('department', department);
            formData.append('type', type);
            formData.append('receiver_notification', JSON.stringify(receiver_notification));
            formData.append('department_notification', JSON.stringify(department_notification));
            formData.append('document_quantity', document_quantity);
            formData.append('transfer_date', transfer_date);
            formData.append('note', note);
            formData.append('expiration_date', expiration_date);
            formData.append('priority', priority);
            formData.append('code', code);
            formData.append('number', orderNumber);

            return fRoot.requestHTTP({
                url: BackendDomain + "/office/outgoing_dispatch/insertSepatate",
                method: 'POST',
                data: formData,
                headers: {
                    'Content-Type': undefined
                }
            });
        }

    return obj;
}]);