myApp.filter('countProperty', function () {
    return function (input) {
        if (!input) { return 0; }
        var count = 0;
        for (var i in input) {
            count++;
        }
        return count;
    }
});
/**filter dùng để hạn chế số chữ hiển thị và thay thế bằng ký hiệu khai báo từ development */
myApp.filter('subString', function () {
    return function (input, number, replacementString) {
        if (!input) { return ""; }
        if (!number) { return input; }
        if (!replacementString) {
            return input.substring(0, number);
        } else {
            if (input.length <= number) {
                return input.substring(0, number);
            } else {
                return input.substring(0, number) + replacementString;
            }

        }
    }
});
/**filter dung de phan trang */
myApp.filter('mypaging_getmax', function () {
    return function (index, dm, per) {

        if (!index && index != 0) { return 0; }
        if (!dm && dm != 0) { return 0; }
        if (!per && per != 0) { return 0; }

        if (dm < per) { return dm };
        if (dm >= (index + 1) * per) { return (index + 1) * per; }
        return dm;
    }
});
/**filter trả về 1 trường dữ liệu từ 1 mảng dữ liệu từ việc so sánh 1 trường*/
myApp.filter("getField", function () {
    return function (val, fma, f, Ar) {

        if (!Ar || !f || !val || !fma) { return "" }
        for (var i in Ar) {
            if (Ar[i][fma] == val) {
                if (Ar[i][f]) { return Ar[i][f]; }
            }
        }
        return "";
    }
});

myApp.filter("getFieldL", ['$rootScope', function ($rootScope) {
    return function (val, fma, f, Ar) {

        if (!Ar || !f || !val || !fma) { return "" }
        for (var i in Ar) {
            if (Ar[i][fma] == val) {
                if (Ar[i][f]) { return Ar[i][f][$rootScope.Language.current]; }
            }
        }
        return "";
    }
}]);

/**Lấy ra 1 mảng con từ việc so sánh 1 trường dữ liệu */
myApp.filter('subArray', function () {
    return function (array, f, val) {
        if (!array
            || !array.length) {
            return [];
        }
        if (!f
            || !val) { return []; }
        var temp = [];
        for (var i in array) {
            if (array[i][f] == val) {
                temp.push(array[i]);
            }
        }
        return temp;
    }
});
myApp.filter("chooseUserGroup", function () {
    return function (ar, dachon, fma) {
        if (!ar
            || !ar.length) { return []; }
        if (!dachon
            || !dachon.length) { return ar; }
        var temp = [];
        for (var i in ar) {
            var check = true;
            for (var j in dachon) {
                if (dachon[j] == ar[i][fma]) {
                    check = false;
                    break;
                }
            }
            if (check) { temp.push(ar[i]); }
        }
        return temp;

    }
});
myApp.filter('childArray', function () {
    return function (number, data) {
        if (!data
            || !data.length) { return []; }
        if (!number) { return data; }
        var temp = [];
        for (var i = 0; i < number; i++) {
            if (i >= data.length) {
                return temp;
            }
            temp.push(data[i]);
        }
        return temp;
    }
});
myApp.filter('test', function () {
    return function (input) {

        return input;
    }

});

/**lấy ra các tính năng có trạng thái sử dụng */
myApp.filter('sudung', function () {
    return function (array) {
        if (!array
            || !array.length) { return []; }
        temp = [];
        for (var i in array) {
            if (array[i].mode == "yes") {
                temp.push(array[i]);
            }
        }
        return temp;
    }
});
/**lấy ra 1 mảng con loại trừ mảng đã chọn*/
myApp.filter('dachon', function () {
    return function (ar, dachon, fma) {
        if (!ar
            || !ar.length) { return []; }
        if (!dachon
            || !dachon.length) { return ar; }
        var temp = [];
        for (var i in ar) {
            var check = true;
            for (var j in dachon) {
                if (dachon[j][fma] == ar[i][fma]) {
                    check = false;
                    break;
                }
            }
            if (check) { temp.push(ar[i]); }
        }
        return temp;
    }
});

/**trả về tên class theo từng loại file */
myApp.filter('fileType', function () {
    return function (url) {
        if (!url) { return ""; }
        var filetype = url.split(".")[url.split(".").length - 1];
        switch (filetype) {
            case "pdf":
                return 'fa-file-pdf';
                break;
            case "doc", "docx":
                return 'fa-file-word';
                break;
            case "xls", "xlsx":
                return 'fa-file-excel';
                break;
        }
    }
});

/** trả về mảng dữ liệu với cặp điều kiến lớn hơn hoặc bằng và nhỏ hơn hoặc bằng*/
myApp.filter('GTEandLTE', function () {
    return function (input, gte, lte, F) {
        if (!input) { return []; }
        var temp = [];
        for (var i in input) {
            if (input[i][F] >= gte && input[i][F] <= lte) {
                temp.push(input[i]);
            }
        }
        return temp;
    };
});

/**trả về giá trị thời điểm của 1 đối tượng Date */
myApp.filter('getTime', function () {
    return function (input) {
        if (!input || !input.getTime()) { return 0; }
        return input.getTime();
    }
});

/**trả về chuỗi hiển thị ngày giờ từ giá trị thời điểm đưa vào */
myApp.filter('showTime', function () {
    return function (input) {
        if (!input) { return ""; }
        var d = new Date();
        d.setTime(parseInt(input));
        return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "." + d.getMilliseconds();
    }
});
myApp.filter('showDate', function () {
    return function (input) {
        if (!input) { return ""; }
        var d = new Date();
        d.setTime(input);

        return d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
    }
});


myApp.filter('showDate2', function () {
    return function (input) {
        if (!input) { return ""; }
        var d = new Date(input);
        return d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
    }
});
myApp.filter('showFullDateTime', function () {
    return function (input) {
        if (!input) { return ""; }
        var d = new Date();
        d.setTime(input);
        return d.getHours() + " giờ " + d.getMinutes() + " phút " + d.getSeconds() + " giây " + " - " + "Ngày " + d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
    }
});
/**trả về mảng chứa các phần tử của 2 mảng */

myApp.filter('conceptArray', function () {
    return function (one, two) {
        if (!one && !two) { return []; }
        if (!one) { return two; }
        if (!two) { return one; }
        var temp = one;
        for (var i in two) {
            temp.push(two[i]);
        }
        return temp;
    }
});

/**localization */

myApp.filter('l', ['languageValue', function (languageValue) {
    function localization(key, param) {
        if (!key) { return "nonekey" }
        var value;
        for (var i in languageValue.details) {
            if (languageValue.details[i].key == key) { value = languageValue.details[i]; break; }
        }
        if (!value || !value.value) { return "Please Regist For :" + key; }
        if (!param) { return value.value };
        var result = value.value;
        for (var i in param) {
            result = result.replace("{{" + i + "}}", param[i]);
        }
        return result;
    }
    localization.$stateful = true;
    return localization;
}]);

myApp.filter('byteFormat', function () {
    return function (bytes) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
        if (bytes === 0) return '0 KB';

        var k = 1024;
        var sizes = ['KB', 'MB', 'GB'];

        var i = Math.floor(Math.log(bytes) / Math.log(k));
        var formattedSize = (bytes / Math.pow(k, i)).toFixed(2);

        return formattedSize + ' ' + sizes[i - 1];
    };
});

myApp.filter('checkRule', ['$rootScope', function ($rootScope) {
    return function (rule) {
        if (!rule
            || !$rootScope.logininfo
            || !$rootScope.logininfo.data
            || !$rootScope.logininfo.data.rule
        ) { return false; }

        if ($rootScope.logininfo.data.rule.filter(e => e.rule === "*").length > 0 || rule.length === 0) {
            return true;
        }

        for (var i in rule) {
            if ($rootScope.logininfo.data.rule.filter(e => e.rule === rule[i]).length > 0) {
                return true;
            }
        }

        return false;
    }
}]);

myApp.filter('getFriendUsername', ['$rootScope', function ($rootScope) {
    return function (members) {
        if (!members) {
            return "";
        }
        for (var i in members) {
            if (members[i] !== $rootScope.logininfo.username) {
                return members[i];
            }
        }
        return true;
    }
}]);

myApp.filter('getName', ['$rootScope', function ($rootScope) {
    return function (title) {
        if (!title) { return "---"; }
        var name = title.split(" ")[title.split(" ").length - 1];
        if (name.length > 10) {
            name = name.substring(0, 9) + "..";
        }
        return name;
    }
}]);

myApp.filter('isMe', ['$rootScope', function ($rootScope) {
    return function (username) {
        if (!username) { return false; }
        return username === $rootScope.logininfo.username;
    }
}]);

myApp.filter('showNormTimeUnit', ['$filter', function ($filter) {
    return function (unit) {
        let value = '';
        switch (unit) {
            case "business_day":
                value = "BusinessDay";
                break;
            case "day":
                value = "Day";
                break;
            case "hour":
                value = "Hour";
                break;
            case "minute":
                value = "Mintue";
                break;
        }
        return $filter('l')(value);
    }
}]);

myApp.filter('checkRuleCreateTaskAll', ['$rootScope', function ($rootScope) {
    return function () {
        let rule = $rootScope.logininfo.data.rule.filter(e => e.rule === "Office.Task.Create_Task_Department")

        if (rule[0] && rule[0].details.type === "All") {
            return true
        }
        return false;
    }
}]);

myApp.filter('checkRuleDepartmentRadio', ['$rootScope', function ($rootScope) {
    return function (department, rule) {
        const ruleDetails = $rootScope.logininfo.data.rule.filter(e => e.rule === rule)[0];
        if (ruleDetails && ruleDetails.details) {
            switch (ruleDetails.details.type) {
                case "All":
                    return true;
                    break;
                case "Working":
                    if($rootScope.logininfo.data.department === department){
                        return true;
                    }
                    break;
                case "Specific":
                    if(ruleDetails.details.department.indexOf(department)!==-1){
                        return true;
                    }
                    break;
            }
        }

        return false;
    }
}]);

myApp.filter('hasRuleRadio', ['$rootScope', function ($rootScope) {
    return function (rule) {
        const ruleDetails = $rootScope.logininfo.data.rule.filter(e => e.rule === rule)[0];
        if (!ruleDetails || !ruleDetails.details || ruleDetails.details.type === 'None') {
            return false;
        }

        return true;
    }
}]);

myApp.filter('checkRuleCheckbox', ['$rootScope', function ($rootScope) {
    return function (rule) {
        return $rootScope.logininfo.data.rule.some(e => e.rule === rule);
    }
}]);

myApp.filter('checkLessThan',  function () {
    return function (model,val) {
        return model<val;
    }
});

myApp.filter('currencyFormat',  function () {
    return function (amount, currency = 'VND') {
        return amount.toLocaleString('vi-VN') + ' ' + currency;
    }
});


myApp.filter('convertToStartOfDay',  function () {
    return function (date) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    }
});

myApp.filter('convertToEndOfDay',  function () {
    return function (date) {
        const d = new Date(date);
        d.setHours(23, 59, 59, 59);
        return d;
    }
});

myApp.filter('isDateInRange', function () {
    return function (startDate, endDate, checkDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const check = new Date(checkDate); 
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        check.setHours(0, 0, 0, 0);

        return check >= start && check <= end;
      }
})

myApp.filter('compareDate', function () {
    return function (date1,date2) {
        const d1 = new Date(date1).setHours(0, 0, 0, 0);
        const d2 = new Date(date2).setHours(0, 0, 0, 0);
        return Math.sign(d1 - d2);
      }
})
myApp.filter('groupAndSortComments', function () {
    return function (listComments) {
        const comments = angular.copy(listComments);
        const groupedComments = new Map();
        comments.forEach(comment => {
            if (!comment.challenge_id) {
            groupedComments.set(comment.id, {
                ...comment,
                reply: [],
            });
            } else if (groupedComments.has(comment.challenge_id)) {
                groupedComments.get(comment.challenge_id).reply.push(comment);
            }
        });
        const sortedComments = Array.from(groupedComments.values()).map(challenge => {
            challenge.reply.sort((a, b) => b.time - a.time); 
            return challenge;
        });
        sortedComments.sort((a, b) => b.time - a.time);
        return sortedComments;
    }
});

myApp.filter('checkLessThan',  function () {
    return function (model,val) {
        return model<val;
    }
});

myApp.filter('currencyFormat',  function () {
    return function (amount, currency = 'VND') {
        return amount.toLocaleString('vi-VN') + ' ' + currency;
    }
});

myApp.filter('checkStringNull',  function () {
    return function (str) {
        return !!!(typeof str === 'string' && str.length > 0);
    }
});

myApp.filter('checkObjNull',  function () {
    return function (obj) {
        return Object.keys(obj).length > 0;
    }
});

myApp.filter('hasRule', ['$rootScope', function ($rootScope) {
    return function (rule) {
        const ruleDetails = $rootScope.logininfo.data.rule.filter(e => e.rule === rule)[0];
        if(!ruleDetails){
            return false;
        }

        if(ruleDetails && ruleDetails.details && ruleDetails.details.type === 'None'){
            return false;
        }
        return true;
    }
}]);
