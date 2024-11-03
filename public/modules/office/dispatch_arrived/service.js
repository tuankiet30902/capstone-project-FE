myApp.registerFtr('dispatch_arrived_service', ['fRoot', function (fRoot) {
    var obj = {};
    
    obj.load = function(search,da_book,priority,receive_method,type,tab,top,offset,sort){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/load",
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
            url: BackendDomain + "/office/dispatch_arrived/count",
            method: "POST",
            data: JSON.stringify({ search,da_book,priority,receive_method,type,tab}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.get_number = function (da_book) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/get_number",
            method: "POST",
            data: JSON.stringify({ da_book}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    obj.taskPriorityTransform = function (search) {
        const priorityList = [
            {key: 1, value: 'Critical'},
            {key: 2, value: 'High'},
            {key: 3, value: 'Medium'},
            {key: 4, value: 'Low'}
        ];
        return priorityList.find(item => item.key === search || item.value === search);
    }

    obj.load_label = function (search, top, offset, sort) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/label/load",
            method: "POST",
            data: JSON.stringify({ search, top, offset, sort }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        })
    }

    obj.loadLabel_details = function (ids) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/label/load-multiple",
            method: "POST",
            data: JSON.stringify({ ids }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        })
    }

    obj.insert_label = function (title, parent_label, is_has_department, departments) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/label/insert",
            method: "POST",
            data: JSON.stringify({ title, parent_label, is_has_department, departments }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        })
    }

    obj.update_label = function (id, title, parent_label, is_has_department, departments) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/label/update",
            method: "POST",
            data: JSON.stringify({ id, title, parent_label, is_has_department, departments }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        })
    }

    obj.insert = function (files, code, da_book, number, release_date, author, agency_promulgate, transfer_date, note, type, priority, is_legal, excerpt, view_only_departments,is_assign_task) {
        var formData = new FormData();
        for (var i in files) {
            formData.append('attachments', files[i].file, files[i].name);
        }

        formData.append('code', code);
        formData.append('da_book', da_book);
        formData.append('number', number);
        formData.append('release_date', release_date);
        formData.append('author', author);
        formData.append('agency_promulgate', agency_promulgate);
        formData.append('transfer_date', transfer_date);
        formData.append('note', note);
        formData.append('type', type);
        formData.append('priority', priority);
        formData.append('is_legal', is_legal);
        formData.append('excerpt', excerpt);
        formData.append('view_only_departments', JSON.stringify(view_only_departments));
        formData.append('is_assign_task', is_assign_task);
        
        return fRoot.requestHTTP({
            url: BackendDomain + '/office/dispatch_arrived/insert',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': undefined,
            },
        });
    };

    obj.update = function (id, keep_files, files, code, da_book, number, release_date, author, agency_promulgate, transfer_date, note, type, priority, is_legal, excerpt, view_only_departments, is_assign_task) {
        var formData = new FormData();
        for (var i in files) {
            formData.append('attachments', files[i].file, files[i].name);
        }

        formData.append('id', id);
        formData.append('keep_attachments', JSON.stringify(keep_files));
        formData.append('code', code);
        formData.append('da_book', da_book);
        formData.append('number', number);
        formData.append('release_date', release_date);
        formData.append('author', author);
        formData.append('agency_promulgate', agency_promulgate);
        formData.append('transfer_date', transfer_date);
        formData.append('note', note);
        formData.append('type', type);
        formData.append('priority', priority);
        formData.append('is_legal', is_legal);
        formData.append('excerpt', excerpt);
        formData.append('view_only_departments', JSON.stringify(view_only_departments));
        formData.append('is_assign_task', is_assign_task);
        
        return fRoot.requestHTTP({
            url: BackendDomain + '/office/dispatch_arrived/update',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': undefined,
            },
        });
    };

    obj.loadFileInfo = function(id,filename){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/loadfileinfo",
            method: "POST",
            data: JSON.stringify({id,filename}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.countPending = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/countpending",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.delete = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/delete",
            method: "POST",
            data: JSON.stringify({ id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.forward = function (id, to, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/forward",
            method: "POST",
            data: JSON.stringify({ id, to, note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.response = function (id, type, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/response",
            method: "POST",
            data: JSON.stringify({ id, type, note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.pushFile = function (file, id) {
        var formData = new FormData();
        formData.append('file', file.file, file.name);
        formData.append('id', id);

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/pushfile",
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }

    obj.removeFile = function (id, filename) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/removefile",
            method: "POST",
            data: JSON.stringify({ id, filename }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    
    return obj;
}]);