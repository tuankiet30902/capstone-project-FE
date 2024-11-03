
myApp.registerFtr('da_details_service', ['fRoot', function (fRoot) {
    var obj = {};
 
    obj.loadDetails = function (id, code) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/loaddetails",
            method: "POST",
            data: JSON.stringify({id, code}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadDepartment = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/load_department",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadFileInfor = function (id, filename) {
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

    obj.loadEmployee = function(department){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/load_employee",
            method: "POST",
            data: JSON.stringify({ department}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadDepartment_task = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/load_department",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadEmployee_task = function(department){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/load_employee",
            method: "POST",
            data: JSON.stringify({ department}),
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
            url: BackendDomain + "/office/dispatch_arrived/loadfileinfo",
            method: "POST",
            data: JSON.stringify({id,filename}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    
    obj.handling = function(id,comment,forward){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/handling",
            method: "POST",
            data: JSON.stringify({id,comment,forward}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.insert_task = function(id,title,content,main_person,participant,observer,from_date,to_date,priority){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/insert_task",
            method: "POST",
            data: JSON.stringify({id,title,content,main_person,participant,observer,from_date,to_date,priority}),
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

    obj.updateTask = function (id, title, content, task_list, main_person, participant, observer, from_date, to_date, status, has_time, hours, priority) {
        for (var i in task_list) {
            delete task_list[i].$$hashKey;
        }
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/update",
            method: "POST",
            data: JSON.stringify({ id, title, content, task_list, main_person, participant, observer, from_date, to_date, status, has_time, hours, priority }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.delete = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/delete",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.uploadImage = function (formData) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/uploadimage",
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }

    obj.pushFile = function (file, id) {
        var formData = new FormData();
        // formData.append('file',files);
        formData.append('file', file.file, file.name);

        formData.append('id', id);

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/pushfile",
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }

    obj.removeFile = function (id, filename) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/removefile",
            method: "POST",
            data: JSON.stringify({ id, filename }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.signAcknowledge = function (id, note, with_task) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/sign_acknowledge",
            method: "POST",
            data: JSON.stringify({ id, note, with_task }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    return obj;
}]);