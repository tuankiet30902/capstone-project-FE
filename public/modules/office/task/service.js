myApp.registerFtr('task_service', ['fRoot', '$filter', '$rootScope', function (fRoot, $filter, $rootScope) {
    var obj = {};
    //**TASK */

    obj.load_task = function (tab, search, from_date, to_date, top, offset, priority, status, state, task_type, label, task_group, projects) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/load",
            method: "POST",
            data: JSON.stringify({ tab, search, from_date, to_date, top, offset, priority, status, state, task_type, label, task_group, projects }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_task_quickhandle = function (search, state, is_get_all, top, offset) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/load_quickhandle",
            method: "POST",
            data: JSON.stringify({ search, top, offset, state, is_get_all }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }


    obj.export_task_personal = function (tab, search, status, from_date, to_date) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/export_personal",
            method: "POST",
            data: JSON.stringify({ tab, search, status, from_date, to_date }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.export_task_department = function (search, status, from_date, to_date, department) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/export_department",
            method: "POST",
            data: JSON.stringify({ search, tab: "all", status, from_date, to_date, department }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.export_task_project = function (search, status, from_date, to_date, project) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/export_project",
            method: "POST",
            data: JSON.stringify({ search, tab: "all", status, from_date, to_date, project }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.export_template_add_task = function (department) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/load_template",
            method: "POST",
            data: JSON.stringify({ department }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        })
    }

    obj.load_label = function (department = "", search, top, offset, sort) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/label/load",
            method: "POST",
            data: JSON.stringify({ department, search, top, offset, sort }),
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


    obj.count_task = function (tab, search, from_date, to_date, priority, status, state, task_type, label, task_group, projects) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/count",
            method: "POST",
            data: JSON.stringify({ search, tab, from_date, to_date, priority, status, state, task_type, label, task_group, projects }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count_task_quickhandle = function (search, state, is_get_all) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/count_quickhandle",
            method: "POST",
            data: JSON.stringify({ search, state, is_get_all }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_base_department = function (search, tab = "all", status, state, from_date, to_date, department, top, offset, employee, priority, task_type, label, task_group, projects) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/load_base_department",
            method: "POST",
            data: JSON.stringify({ search, tab, status, state, from_date, to_date, department, top, offset, employee, priority, task_type, label, task_group, projects }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count_base_department = function (search, tab, status, state, from_date, to_date, department, employee, priority, task_type, label, task_group, projects) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/count_base_department",
            method: "POST",
            data: JSON.stringify({ search, tab, status, state, from_date, to_date, department, employee, priority, task_type, label, task_group, projects }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_base_project = function (search, tab = 'all', from_date, to_date, project, top, offset, participant, priority, status, state, task_type, label) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/load_base_project",
            method: "POST",
            data: JSON.stringify({ search, tab, from_date, to_date, project, top, offset, participant, priority, status, state, task_type, label }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }


    obj.count_base_project = function (search, tab = 'all', from_date, to_date, project, participant, priority, status, state, task_type, label) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/count_base_project",
            method: "POST",
            data: JSON.stringify({ search, tab, from_date, to_date, project, participant, priority, status, state, task_type, label }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    obj.insert = function (
      files,
      title,
      content,
      task_list,
      main_person,
      participant,
      observer,
      from_date,
      to_date,
      has_time,
      hours,
      priority,
      task_type,
      head_task_id,
      parent_id,
      project,
      currentDepartment,
      dispatch_arrived_id,
      level,
      label,
      is_draft,
      parents,
      parent,
      source_id,
      has_repetitive,
      per,
      cycle,
      has_expired,
      expired_date,
      child_work_percent
    ) {
      var formData = new FormData();
      for (var i in files) {
        formData.append("file", files[i].file, files[i].name);
      }
      for (var i in task_list) {
        delete task_list[i].$$hashKey;
      }

      if ((!has_repetitive, !per, !cycle, !has_expired, !expired_date)) {
        has_repetitive = false;
        per = 0;
        cycle = "";
        has_expired = false;
        expired_date = 0;
      }

      project && formData.append("project", project);
      parent_id && formData.append("parent_id", parent_id);
      parents && formData.append("parents", JSON.stringify(parents));
      parent && formData.append("parent", JSON.stringify(parent));
      source_id && formData.append("source_id", JSON.stringify(source_id));
      title && formData.append("title", title);
      content && formData.append("content", content);
      has_time && formData.append("has_time", has_time);
      hours && formData.append("hours", hours);
      task_list && formData.append("task_list", JSON.stringify(task_list));
      main_person &&
        formData.append("main_person", JSON.stringify(main_person));
      participant &&
        formData.append("participant", JSON.stringify(participant));
      observer && formData.append("observer", JSON.stringify(observer));
      from_date && formData.append("from_date", from_date);
      to_date && formData.append("to_date", to_date);
      priority && formData.append("priority", priority);
      task_type && formData.append("task_type", task_type);
      head_task_id && formData.append("head_task_id", head_task_id);
      currentDepartment && formData.append("department", currentDepartment);
      dispatch_arrived_id &&
        formData.append("dispatch_arrived_id", dispatch_arrived_id);
      level && formData.append("level", level);
      JSON && formData.append("label", JSON.stringify(label));
      is_draft && formData.append("is_draft", is_draft);
      has_repetitive && formData.append("has_repetitive", has_repetitive);
      per && formData.append("per", per);
      cycle && formData.append("cycle", cycle);
      has_expired && formData.append("has_expired", has_expired);
      expired_date && formData.append("expired_date", expired_date);
      child_work_percent &&
        formData.append("child_work_percent", child_work_percent);

      return fRoot.requestHTTP({
        url: BackendDomain + "/office/task/insert",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": undefined,
        },
      });
    };

    obj.insert_for_multiple_departments = function (data) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/insert_for_multiple_departments",
            method: "POST",
            data: data,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.insert_for_multiple_projects = function (data) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/insert_for_multiple_projects",
            method: "POST",
            data: data,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.insert_task_from_template = function (data) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/insert_task_from_template",
            method: "POST",
            data: data,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.insertNewExcelTask = function (excelFiles) {
        var formData = new FormData();
        for (var i in excelFiles) {
            formData.append('file', excelFiles[i].file, excelFiles[i].name);
        }
    }

    obj.loadFileInfo = function (id, filename) {
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

    obj.cancel = function (id, comment) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/cancel",
            method: "POST",
            data: JSON.stringify({ id, comment }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }


    obj.update = function (id, title, content, task_list, main_person, participant, observer, from_date, to_date, status, has_time, priority, task_type, workflowPlay_id, label, dispatch_arrived_id, department, has_repetitive, per, cycle, has_expired, expired_date) {
        for (var i in task_list) {
            delete task_list[i].$$hashKey;
        }

        var data = { id, title, content, task_list, main_person, participant, observer, from_date, to_date, status, has_time, priority, task_type, workflowPlay_id, label, dispatch_arrived_id, department, has_repetitive };

        if (has_repetitive) {
            data.per = per;
            data.cycle = cycle;
            data.has_expired = has_expired;
            data.expired_date = expired_date;
        }

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/update",
            method: "POST",
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_child = function (ids) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/load_child",
            method: "POST",
            data: JSON.stringify({ ids }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.statistic_personal_count = function (tab, from_date, to_date) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/statistic_personal_count",
            method: "POST",
            data: JSON.stringify({ tab, from_date, to_date }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.statistic_personal_growth = function (tab, from_date, to_date) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/statistic_personal_growth",
            method: "POST",
            data: JSON.stringify({ tab, from_date, to_date }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.statistic_project_count = function (project, from_date, to_date, participant, priority, status, task_type, label) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/statistic_project_count",
            method: "POST",
            data: JSON.stringify({ project, from_date, to_date, participant, priority, status, task_type, label }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.statistic_project_growth = function (project, from_date, to_date, participant, priority, status, task_type, label) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/statistic_project_growth",
            method: "POST",
            data: JSON.stringify({ project, from_date, to_date, participant, priority, status, task_type, label }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.statistic_department_count = function (department, from_date, to_date, employee, priority, status, task_type, label, task_group, projects) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/statistic_department_count",
            method: "POST",
            data: JSON.stringify({ department, from_date, to_date, employee, priority, status, task_type, label, task_group, projects }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.statistic_department_growth = function (department, from_date, to_date, employee, priority, status, task_type, label, task_group, projects) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/statistic_department_growth",
            method: "POST",
            data: JSON.stringify({ department, from_date, to_date, employee, priority, status, task_type, label, task_group, projects }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.statistic_all_project_count = function (from_date, to_date) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/statistic_all_project_count",
            method: "POST",
            data: JSON.stringify({ from_date, to_date }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.statistic_all_project_growth = function (from_date, to_date) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/statistic_all_project_growth",
            method: "POST",
            data: JSON.stringify({ from_date, to_date }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.statistic_all_department_count = function (from_date, to_date) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/statistic_all_department_count",
            method: "POST",
            data: JSON.stringify({ from_date, to_date }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.statistic_all_department_growth = function (from_date, to_date) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/statistic_all_department_growth",
            method: "POST",
            data: JSON.stringify({ from_date, to_date }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
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

    obj.comment = function (content, type, challenge_id, id, files = []) {
        var formData = new FormData();
        for (var i in files) {
            formData.append('file', files[i].file, files[i].name);
        }
        formData.append('id', id);
        formData.append('content', content);
        formData.append('type', type);
        formData.append('challenge_id', challenge_id);
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/comment",
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }

    obj.loadDetails = function (id, code, currentDepartment) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/loaddetails",
            method: "POST",
            data: JSON.stringify({ id, code, department: currentDepartment || '' }),
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json;odata=verbose",
            },
        });
    };

    //**PROJECT */
    obj.load_project = function (search, top, offset, sort) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/project/project/load",
            method: "POST",
            data: JSON.stringify({ search, top, offset, sort }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count_project = function (search) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/project/project/count",
            method: "POST",
            data: JSON.stringify({ search }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.insert_project = function (title, from_date, to_date, participant, workflowPlay_id, task_id, parents, parent) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/project/project/insert",
            method: "POST",
            data: JSON.stringify({ title, from_date, to_date, participant, workflowPlay_id, task_id, parents, parent }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.update_project = function (id, title, from_date, to_date, workflowPlay_id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/project/project/update",
            method: "POST",
            data: JSON.stringify({ id, title, from_date, to_date, workflowPlay_id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.start_project = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/project/project/start",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.close_project = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/project/project/close",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.delete_project = function (id, title) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/project/project/delete",
            method: "POST",
            data: JSON.stringify({ id, title }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.update_participant_project = function (id, participant) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/project/project/update_participant",
            method: "POST",
            data: JSON.stringify({ id, participant }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.statistic_project_all_project_count = function (from_date, to_date) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/project/project/statistic_count",
            method: "POST",
            data: JSON.stringify({ from_date, to_date }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.statistic_project_all_project_growth = function (from_date, to_date) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/project/project/statistic_growth",
            method: "POST",
            data: JSON.stringify({ from_date, to_date }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    //**DEPARTMENT */
    obj.load_department = function (department_id, department_grade, search, from_date, to_date, sort_by, sorting_order) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/load_department",
            method: "POST",
            data: JSON.stringify({ department_id, department_grade, search, from_date, to_date, sort_by, sorting_order }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_employee = function (department_id) {
        return fRoot.requestHTTP({
            url: BackendDomain + `/office/organization/${department_id}/employee`,
            method: "GET",
            params: { department_id },
            headers: {}
        });
    }

    obj.load_employee_filter = function (department, search, top, offset) {
        return fRoot.requestHTTP({
            url: BackendDomain + `/office/organization/load_multiple_employee`,
            method: "POST",
            data: JSON.stringify({ department, search, top, offset }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_project_by_department = function (department, search, top, offset) {
        return fRoot.requestHTTP({
            url: BackendDomain + `/office/project/project/load_by_department`,
            method: "POST",
            data: JSON.stringify({ department, search, top, offset }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_project_by_personal = function (search, top, offset) {
        return fRoot.requestHTTP({
            url: BackendDomain + `/office/project/project/load_joined`,
            method: "POST",
            data: JSON.stringify({ search, top, offset }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_template = function (department) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/load_template",
            method: "GET",
            params: { department },
            headers: {},
            responseType: 'blob'
        });
    }

    obj.load_template_for_departments = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/load_template_for_departments",
            method: "GET",
            headers: {},
            responseType: 'blob'
        });
    }

    obj.load_template_for_projects = function () {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/load_template_for_projects",
            method: "GET",
            headers: {},
            responseType: 'blob'
        });
    }


    //**WIKI */
    obj.loadWiki = function (search, department, project, top, offset) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/project/wiki/load",
            method: "POST",
            data: JSON.stringify({ search, department, project, top, offset }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.countWiki = function (search, department, project) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/project/wiki/count",
            method: "POST",
            data: JSON.stringify({ search, department, project }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.insertWiki = function (files, title, content, department, project) {
        var formData = new FormData();
        for (var i in files) {
            formData.append('file', files[i].file, files[i].name);
        }
        if (department) {
            formData.append('department', department);
        }
        if (project) {
            formData.append('project', project);
        }
        formData.append('title', title);
        formData.append('content', content);
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/project/wiki/insert",
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }

    obj.loadFileInfo_wiki = function (id, filename) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/project/wiki/loadfileinfo",
            method: "POST",
            data: JSON.stringify({ id, filename }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.uploadImage_wiki = function (formData) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/project/wiki/uploadimage",
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }

    obj.deleteWiki = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/project/wiki/delete",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.updateWiki = function (id, title, content) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/project/wiki/update",
            method: "POST",
            data: JSON.stringify({ id, title, content }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.pushFile_wiki = function (file, id) {
        var formData = new FormData();
        // formData.append('file',files);
        formData.append('file', file.file, file.name);

        return fRoot.requestHTTP({
            url: BackendDomain + "/office/project/wiki/pushattachment/" + id,
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }

    obj.removeFile_wiki = function (id, filename) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/project/wiki/removeattachment",
            method: "POST",
            data: JSON.stringify({ id, filename }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    //**EMPLOYEE */
    obj.loadEmployee = function (department) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/load_employee",
            method: "POST",
            data: JSON.stringify({ department }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadEmployee_Project = function (department) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/employee/load",
            method: "POST",
            data: JSON.stringify({ department, top: 5000, offset: 0, sort: { fullname: 1 } }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.taskPriorityTransform = function (search) {
        const priorityList = [
            { key: 1, value: 'Critical' },
            { key: 2, value: 'High' },
            { key: 3, value: 'Medium' },
            { key: 4, value: 'Low' }
        ];
        return priorityList.find(item => item.key === search || item.value === search) || '';
    }

    obj.taskTypeTransform = function (search) {
        const taskTypeList = [
            { key: 1, value: 'Task' },
            { key: 2, value: 'WorkflowPlay' },
            { key: 3, value: 'Notification' },
        ]
        return taskTypeList.find(item => item.key === search || item.value === search) || taskTypeList[0];
    }

    obj.exportExcelFile = function (tasks, tab) {
        let reportInput = [];
        for (let i in tasks) {
            reportInput.push({});
            reportInput[i]['#'] = parseInt(i) + 1;
            reportInput[i][$filter('l')('TaskName')] = tasks[i].title;
            reportInput[i][$filter('l')('Creator')] = tasks[i].username_title;
            reportInput[i][$filter('l')('FromDate')] = tasks[i].from_date_string;
            reportInput[i][$filter('l')('ToDate')] = tasks[i].to_date_string;
            reportInput[i][$filter('l')('MainPerson')] = tasks[i].main_person_title.toString();
            reportInput[i][$filter('l')('Participant')] = tasks[i].participant_title.toString();
            reportInput[i][$filter('l')('Observer')] = tasks[i].observer_title.toString();
            reportInput[i][$filter('l')('Status')] = $filter('l')(tasks[i].status);
            reportInput[i][$filter('l')('Priority')] = $filter('l')(this.taskPriorityTransform(tasks[i].priority).value);
            reportInput[i][$filter('l')('Progress')] = tasks[i].progress;
            if (tasks[i].department) {
                reportInput[i][$filter('l')('Department')] = tasks[i].department_title[$rootScope.logininfo.data.language.current];
            }

            if (tasks[i].project) {
                reportInput[i][$filter('l')('Project')] = tasks[i].project_title;
            }

        }

        let ws = XLSX.utils.json_to_sheet(reportInput, {
            header: [
                '#',
                $filter('l')('TaskName'),
                $filter('l')('Creator'),
                $filter('l')('FromDate'),
                $filter('l')('ToDate'),
                $filter('l')('MainPerson'),
                $filter('l')('Participant'),
                $filter('l')('Observer'),
                $filter('l')('Status'),
                $filter('l')('Priority'),
                $filter('l')('Progress'),
                $filter('l')('Department'),
                $filter('l')('Project')
            ]
        });

        // auto fix width of the column with content
        ws = autoFixWidthToExportExcel(ws);
        // add hyperlink to the title of the tasks
        for (let i in reportInput) {
            ws[`B${parseInt(i) + 2}`].l = {
                Target: `${window.location.protocol}://${window.location.hostname}${window.modeProduction === "development" && window.location.port !== 80 ? ':' + window.location.port : ''}${tasks[i].link}`,
                Tooltip: $filter('l')('ClickToOpenThisTaskOnYourPortal')
            };
        }

        const wb = XLSX.utils.book_new();
        let nameOfSheet;
        if (tab === 'created') {
            nameOfSheet = $filter('l')('TaskICreated');
        } else if (tab === 'assigned') {
            nameOfSheet = $filter('l')('MyTask');
        }
        XLSX.utils.book_append_sheet(wb, ws, nameOfSheet);
        var excelData = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        var blob = new Blob([excelData], { type: 'application/octet-stream' });
        var url = URL.createObjectURL(blob);

        var link = document.createElement('a');
        link.href = url;
        link.download = 'task_report.xlsx';
        link.click();

        URL.revokeObjectURL(url);
    }

    function autoFixWidthToExportExcel(ws) {
        const columnRange = XLSX.utils.decode_range(ws['!ref']);
        for (let col = columnRange.s.c; col <= columnRange.e.c; col++) {
            let maxLength = 0;
            for (let row = columnRange.s.r; row <= columnRange.e.r; row++) {
                const cell = ws[XLSX.utils.encode_cell({ r: row, c: col })];
                const cellValue = cell ? cell.v.toString() : '';
                if (cellValue.length > maxLength) {
                    maxLength = cellValue.length;
                }
            }
            const columnWidth = maxLength > 5 ? maxLength + 1 : 5;
            ws['!cols'] = ws['!cols'] || [];
            ws['!cols'][col] = { width: columnWidth };
        }
        return ws;
    }

    //**CONFIG TABLE */
    obj.loadConfigTable = function (project) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/config_table/load",
            method: "POST",
            data: JSON.stringify({ project }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.updateConfigTable = function (project, department, config) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/config_table/update",
            method: "POST",
            data: JSON.stringify({ project, department, config }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadDispatchArrived = function (search) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/load",
            method: "POST",
            data: JSON.stringify({ search, tab: "all", top: 999, offset: 0, sort: { _id: -1 } }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    };

    obj.ganttChart_base_project = function (project, from_date, to_date, participant, priority, status, state, task_type, label) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/ganttChart_base_project",
            method: "POST",
            data: JSON.stringify({ project, from_date, to_date, participant, priority, status, state, task_type, label }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    };

    obj.ganttChart_base_department = function (department, from_date, to_date, employee, priority, status, state, task_type, label, task_group, projects) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/ganttChart_base_department",
            method: "POST",
            data: JSON.stringify({ department, from_date, to_date, employee, priority, status, state, task_type, label, task_group, projects }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    };

    obj.insert_recurring_task = function (title, department, priority, task_type, from_date, to_date, repetitive) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task_template/insert",
            method: "POST",
            data: JSON.stringify({ title, department, priority, task_type, from_date, to_date, repetitive }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.update_recurring_task = function (id, title, department, priority, task_type, from_date, to_date, repetitive) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task_template/update",
            method: "POST",
            data: JSON.stringify({ id, title, department, priority, task_type, from_date, to_date, repetitive }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_recurring_task = function (search, top, offset, load_parent_only, skip_load_child, repetitive_cycle, priority, status, series, task_type, from_date, to_date) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task_template/load",
            method: "POST",
            data: JSON.stringify({ search, top, offset, load_parent_only, skip_load_child, repetitive_cycle, priority, status, series, task_type, from_date, to_date }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count_recurring_task = function (search, repetitive_cycle, priority, status, series, from_date, to_date) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task_template/count",
            method: "POST",
            data: JSON.stringify({ search, repetitive_cycle, priority, status, series, from_date, to_date }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_recurring_task_detail = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task_template/load-detail",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.update_status_recurring_tasks = function (id, department, action) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task_template/update-job-status",
            method: "POST",
            data: JSON.stringify({ id, department, action }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadEmployeeDetail = function (id) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/human/employee/loaddetails",
            method: "POST",
            data: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    //WORKLFOW PLAY

    obj.load_workflowplay_tohandle = function (search, document_type, top, offset, sort) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/load",
            method: "POST",
            data: JSON.stringify({ search, document_type, tab: "need_to_handle", top, offset, sort }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count_workflowplay_tohandle = function (search, document_type) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/count",
            method: "POST",
            data: JSON.stringify({ search, document_type, tab: "need_to_handle" }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadFileInfo_workflow = function (id, filename) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/workflow_play/loadfileinfo",
            method: "POST",
            data: JSON.stringify({ id, filename }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.approval = function (id, comment, relatedFiles) {
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

    obj.reject = function (id, comment, relatedFiles) {

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

    obj.return = function (id, comment, relatedFiles) {

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

    //DISPATCH ARRIVED
    obj.load_dispatch_arrived = function (search, top, offset, sort) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/load_quick_handle",
            method: "POST",
            data: JSON.stringify({ search, top, offset, sort }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count_dispatch_arrived = function (search) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/count_quick_handle",
            method: "POST",
            data: JSON.stringify({ search }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadFileInfo_dispatch_arrived = function (id, filename) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/dispatch_arrived/loadfileinfo",
            method: "POST",
            data: JSON.stringify({ id, filename }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    //NEWS 
    obj.load_news = function (search, top, offset, sort) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/load_quick_handle",
            method: "POST",
            data: JSON.stringify({ search, top, offset, sort }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count_news = function (search) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/count_quick_handle",
            method: "POST",
            data: JSON.stringify({ search }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.loadFileInfo_news = function (code, filename) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/notify/load_file_info",
            method: "POST",
            data: JSON.stringify({ code, filename }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.approve_news = function (id, note) {
        return fRoot.requestHTTP({
          url: BackendDomain + "/office/notify/approval",
          method: "POST",
          data: JSON.stringify({ id, note }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json;odata=verbose",
          },
        });
      };
  
      obj.reject_news = function (id, reason) {
        return fRoot.requestHTTP({
          url: BackendDomain + "/office/notify/reject",
          method: "POST",
          data: JSON.stringify({ id , reason}),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json;odata=verbose",
          },
        });
      };

    //MEETING ROOM / CAR / EVENT
    obj.load_registration = function (search, feature, top, offset, sort) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/load_quick_handle",
            method: "POST",
            data: JSON.stringify({ search, feature, top, offset, sort }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.count_registration = function (search, feature) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/count_quick_handle",
            method: "POST",
            data: JSON.stringify({ search, feature }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.change_status_registration_room = function (id, status, roomCode = '', reasonReject = '') {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/change_status",
            method: "POST",
            data: JSON.stringify({ id, status, roomCode, reasonReject }),
            headers: {
                'Content-Type': "application/json;odata=verbose"
            }
        })
    }

    obj.load_meeting_rooms = function (master_key, top = 0, offset = 0){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/load",
            method: "POST",
            data: JSON.stringify({ master_key, top, offset }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.complete = function(id, code){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/complete",
            method: "POST",
            data: JSON.stringify({id, code}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.done = function(id){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/task/done",
            method: "POST",
            data: JSON.stringify({id}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    return obj;
}]);

myApp.registerFtr('registration_service', ['fRoot',  function (fRoot) {
    let obj = {};

    //Room
    obj.load_room_type = function(){
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/directory/load_for_directive",
            method: "POST",
            data: JSON.stringify({
                master_key:"room_type",
                top:0,
                offset:0
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }
    
    obj.load_file_info_room = function(id,filename){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/load_file_info",
            method: "POST",
            data: JSON.stringify({id,filename}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.approve_department_room = function (dataUpdate) {
        var formData = new FormData();
        for (var i in dataUpdate.file) {
            formData.append('file', dataUpdate.file[i].file, dataUpdate.file[i].name);
        }
        formData.append('id', dataUpdate.id);
        formData.append('title', dataUpdate.title);
        formData.append('date_start', dataUpdate.date_start);
        formData.append('date_end', dataUpdate.date_end);
        formData.append('type', dataUpdate.type);
        formData.append('host', dataUpdate.host);
        formData.append('participants', JSON.stringify(dataUpdate.participants));
        formData.append('other_participants', JSON.stringify(dataUpdate.other_participants));
        formData.append('to_department', JSON.stringify(dataUpdate.to_department));
        formData.append('content', dataUpdate.content);
        formData.append('person', dataUpdate.person);
        formData.append('service_proposal', dataUpdate.service_proposal);
        formData.append('service_proposal_text', dataUpdate.service_proposal_text);
        formData.append('helpdesk', dataUpdate.helpdesk);
        formData.append('helpdesk_text', dataUpdate.helpdesk_text);
        formData.append('teabreak', dataUpdate.teabreak);
        formData.append('teabreak_text', dataUpdate.teabreak_text);
        formData.append('removeAtachments', JSON.stringify(dataUpdate.removeAtachments));
        formData.append('note', dataUpdate.note);
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/approve_department",
            method: "POST",
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }

    obj.reject_department_room = function (id,note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/reject_department",
            method: "POST",
            data: JSON.stringify({ id,note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.approve_management_room = function (id, note, room) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/approve_management",
            method: "POST",
            data: JSON.stringify({ id, note, room }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.reject_management_room = function (id,note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/reject_management",
            method: "POST",
            data: JSON.stringify({ id,note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.approve_lead_room = function (id, note, room) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/approve_lead",
            method: "POST",
            data: JSON.stringify({ id, note, room }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.reject_lead_room = function (id,note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/reject_lead",
            method: "POST",
            data: JSON.stringify({ id,note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.request_cancel_room = function (id,note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/request_cancel",
            method: "POST",
            data: JSON.stringify({ id,note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    //recall
    obj.approve_recall_department_room= function (id, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/approve_recall_department",
            method: "POST",
            data: JSON.stringify({ id, note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.reject_recall_department_room = function (id,note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/reject_recall_department",
            method: "POST",
            data: JSON.stringify({ id,note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.approve_recall_management_room = function (id, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/approve_recall_management",
            method: "POST",
            data: JSON.stringify({ id, note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.reject_recall_management_room = function (id,note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/reject_recall_management",
            method: "POST",
            data: JSON.stringify({ id,note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.approve_recall_lead_room = function (id, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/approve_recall_lead",
            method: "POST",
            data: JSON.stringify({ id, note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.reject_recall_lead_room = function (id,note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/meeting_room/reject_recall_lead",
            method: "POST",
            data: JSON.stringify({ id,note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    //Event calendar
    obj.load_file_info_event_calendar = function(id,filename){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/event_calendar/load_file_info",
            method: "POST",
            data: JSON.stringify({id,filename}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.approve_department_event_calendar = function (id, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/event_calendar/approve_department",
            method: "POST",
            data: JSON.stringify({ id, note }),
            headers: {
            "Content-Type": "application/json",
            Accept: "application/json;odata=verbose",
            },
        });
    };
  
    obj.reject_department_event_calendar = function (id, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/event_calendar/reject_department",
            method: "POST",
            data: JSON.stringify({ id, note }),
            headers: {
            "Content-Type": "application/json",
            Accept: "application/json;odata=verbose",
            },
        });
    };

    obj.approve_host_event_calendar = function (id, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/event_calendar/approve_host",
            method: "POST",
            data: JSON.stringify({ id, note }),
            headers: {
            "Content-Type": "application/json",
            Accept: "application/json;odata=verbose",
            },
        });
    };

    obj.reject_host_event_calendar = function (id, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/event_calendar/reject_host",
            method: "POST",
            data: JSON.stringify({ id, note }),
            headers: {
            "Content-Type": "application/json",
            Accept: "application/json;odata=verbose",
            },
        });
    };

    obj.approve_recall_department_event_calendar = function (id, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/event_calendar/approve_recall_department",
            method: "POST",
            data: JSON.stringify({ id, note }),
            headers: {
            "Content-Type": "application/json",
            Accept: "application/json;odata=verbose",
            },
        });
    };

    obj.reject_recall_department_event_calendar = function (id, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/event_calendar/reject_recall_department",
            method: "POST",
            data: JSON.stringify({ id, note }),
            headers: {
            "Content-Type": "application/json",
            Accept: "application/json;odata=verbose",
            },
        });
    };

    obj.approve_recall_host_event_calendar = function (id, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/event_calendar/approve_recall_host",
            method: "POST",
            data: JSON.stringify({ id, note }),
            headers: {
            "Content-Type": "application/json",
            Accept: "application/json;odata=verbose",
            },
        });
    };

    obj.reject_recall_host_event_calendar = function (id, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/event_calendar/reject_recall_host",
            method: "POST",
            data: JSON.stringify({ id, note }),
            headers: {
            "Content-Type": "application/json",
            Accept: "application/json;odata=verbose",
            },
        });
    };

    //car
    obj.loadDriverList = function () {
        const query = { role: 'Driver' }
        return fRoot.requestHTTP({
            url: BackendDomain + "/management/user/load_by_role",
            method: "POST",
            data: JSON.stringify(query),
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json;odata=verbose",
            },
        });
    };

    obj.load_file_info_car = function(code,filename){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/load_file_info",
            method: "POST",
            data: JSON.stringify({code,filename}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.load_file_invoice_car = function(code,filename){
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/load_file_invoice",
            method: "POST",
            data: JSON.stringify({code,filename}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.approve_department_car = function (code, note, files, starting_place, destination, passenger,
        number_of_people, time_to_go, pick_up_time, to_department, content,removed_attachments, title ) {
        var formData = new FormData();
        for (var i in files) {
            formData.append('file', files[i].file, files[i].name);
        }

        if (passenger) {
            formData.append('passenger', JSON.stringify(passenger));
        }

        if (removed_attachments) {
            formData.append('removed_attachments', JSON.stringify(removed_attachments));
        }

        if (to_department) {
            formData.append('to_department', JSON.stringify(to_department));
        }
        formData.append('code', code);
        formData.append('note', note);
        formData.append('starting_place', starting_place);
        formData.append('destination', destination);

        formData.append('number_of_people', number_of_people);
        formData.append('time_to_go', time_to_go);
        formData.append('pick_up_time', pick_up_time);

        formData.append('content', content);
        formData.append('title', title);
        return fRoot.requestHTTP({
            url: BackendDomain + '/office/car_management/approve_department',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': undefined,
            },
        });
    };

    obj.reject_department_car = function (code,note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/reject_department",
            method: "POST",
            data: JSON.stringify({ code,note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }


    obj.approve_car_management_car = function (code,note, assign_card, card, car, driver) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/approve_car_management",
            method: "POST",
            data: JSON.stringify({ code,note, assign_card, card, car, driver }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.reject_car_management_car = function (code,note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/reject_car_management",
            method: "POST",
            data: JSON.stringify({ code,note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.approve_lead_car = function (code, note, assign_card, card, car, driver) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/approve_lead",
            method: "POST",
            data: JSON.stringify({ code, note, assign_card, card, car, driver }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.reject_lead_car = function (code,note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/reject_lead",
            method: "POST",
            data: JSON.stringify({ code,note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.approve_lead_external_car = function (code, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/approve_lead_external",
            method: "POST",
            data: JSON.stringify({ code, note}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.reject_lead_external_car = function (code, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/reject_lead_external",
            method: "POST",
            data: JSON.stringify({ code, note}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.approve_card_management_car = function (code,note, card) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/approve_card_management",
            method: "POST",
            data: JSON.stringify({ code,note,card }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.receive_card_car = function (code, note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/creator_receive_card",
            method: "POST",
            data: JSON.stringify({ code,note,card }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.creator_return_card_car = function (code, note, money, km, invoices) {
        var formData = new FormData();
        formData.append('code', code);
        formData.append('note', note);
        formData.append('money', money);
        formData.append('km', km);
        
        for (var i in invoices) {
            formData.append('invoices', invoices[i].file, invoices[i].name);
        }
        
        return fRoot.requestHTTP({
            url: BackendDomain + '/office/car_management/creator_return_card',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': undefined,
            },
        });
    }

    obj.reject_card_management_car = function (code,note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/reject_card_management",
            method: "POST",
            data: JSON.stringify({ code,note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.manager_assign_card_car = function (code,note,card) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/manager_assign_card",
            method: "POST",
            data: JSON.stringify({ code,note,card }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.creator_receive_card_car = function (code,note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/creator_receive_card",
            method: "POST",
            data: JSON.stringify({ code,note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }

    obj.manager_receive_card_car = function (code,note) {
        return fRoot.requestHTTP({
            url: BackendDomain + "/office/car_management/manager_receive_card",
            method: "POST",
            data: JSON.stringify({ code,note }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json;odata=verbose"
            }
        });
    }


    return obj;
}]);
