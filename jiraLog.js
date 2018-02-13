var JiraClient = require('jira-connector');
var format = require('dateformat');
var prompt = require('prompt')
    , arr = [];
var worklogArr = [];
var totalTime = 0;
var jira = new JiraClient({
    host: '',
    basic_auth: {
        base64: ''
    }
});
var _projName = '';
var _defaultTicket = '';
var _miscTicket = '';

var getDate = function () {
    var date = new Date();
    console.log('formatting...')
    //moment().format(date, "YYYY-MM-DDTHH:mm");
    var day = format(date, "yyyy-mm-dd");
    var hours = format(date, "HH:MM:ss");
    return day + 'T' + hours;
}

function addWorkLog(issueKey, timeSpent, comment) {
    jira.issue.addWorkLog({
        issueKey: issueKey,
        "worklog": {
            "timeSpent": timeSpent,
            'comment': comment
        }
        
    }, function (error, issue) {
        console.log(error);
        console.log(issue);
    });    
}

function getAnother() {
    prompt.get('string', function (err, result) {
        if (result.string == 'go') {
            processInput();
        }
        else {
            arr.push(result.string);
            getAnother();
        }
    })
}

function logWorkLogs() {
    worklogArr.forEach(function (worklog) {
        console.log('Issue: ' + worklog.issue + ' time spent: ' + worklog.time + ' comment: ' + worklog.comment)
        addWorkLog(worklog.issue, worklog.time, worklog.comment);
    });
}

function processInput() {
    console.log('You are about to log:')
    arr.forEach(function (element) {
        var worklog = element.split(',');
        if (worklog[0] == 'break' || worklog[0] == 'standup' || worklog[0] == 'retro' || worklog[0] == 'planning' || worklog[0] == 'demo' || worklog[0] == 'meeting') {
            switch (worklog[0]) {
            case 'break':
                totalTime = totalTime + 0.25;
                worklogArr.push({ issue: _miscTicket, comment: 'break', time: 0.25 })
                break
            case 'standup':
                var time = worklog.length > 1 ? parseFloat(worklog[1]) : 0.5
                totalTime = totalTime + time;
                worklogArr.push({ issue: _defaultTicket, comment: _projName + ' Standup', time: time })
                break
            case 'retro':
                var time = worklog.length > 1 ? parseFloat(worklog[1]) : 1
                totalTime = totalTime + time;
                worklogArr.push({ issue: _defaultTicket, comment: _projName + ' Retrospective', time: time })
                break
            case 'planning':
                var time = worklog.length > 1 ? parseFloat(worklog[1]) : 1
                totalTime = totalTime + time;
                worklogArr.push({ issue: _defaultTicket, comment: _projName + ' Iteration Planning', time: time })
                break
            case 'demo':
                var time = worklog.length > 1 ? parseFloat(worklog[1]) : 0.75
                totalTime = totalTime + time;
                worklogArr.push({ issue: _defaultTicket, comment: _projName + ' Standup', time: time })
                break
            case 'meeting':
                var time = worklog.length > 1 ? parseFloat(worklog[1]) : 0.5
                totalTime = totalTime + time;
                worklogArr.push({ issue: _defaultTicket, comment: _projName + ' meeting', time: time })
                break
            }
        } else {
            if (!parseFloat(worklog[0])) {
                console.log('ticket number' + worklog[0] + ' is not an integer');
                process.exit();
            }
            if ((parseFloat(worklog[1]) % 0.25) != 0) {
                console.log('time logged is not dividable by 15 minutes');
                process.exit();
            }
            if (worklog.length == 4) {
                totalTime = totalTime + parseFloat(worklog[1].trim())
                worklogArr.push({ issue: worklog[3].trim(), comment: worklog[0] + ' ' + worklog[2].trim(), time: worklog[1].trim() })
            } else {
                totalTime = totalTime + parseFloat(worklog[1].trim())
                worklogArr.push({ issue: _defaultTicket, comment: '#' + worklog[0] + ' ' + worklog[2].trim(), time: worklog[1].trim() })

            }

        }

    });
    console.log('total amount of time is ' + totalTime + 'h, press "y" to continue, "e" to exit or "a" to add more logs')
    prompt.get('string', function (err, result) {
        if (result.string == 'y') {
            logWorkLogs();
        }
        if (result.string == 'e') {
            process.exit();
        }
        if (result.string == 'a') {
            getAnother();
        }
    })
}


prompt.start();
getAnother();
