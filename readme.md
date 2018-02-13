# Jira logging

Kiedy skończyła Ci się maść na ból pupy i nie chcesz już przeklikiwać się przez interface jiry a jest bagieta jak tego nie robisz sklonuj sobie to repo

## Getting Started

Clone this project anywhere on your hard drive.

### Prerequisites

You need to install Node.js to run this sh!t, written on Node.js 6.11.0
Authentication with jira is done by basic base64 auth, you need to encrypt your email address and password to base64 in following format:
email:password
```
var jira = new JiraClient({
    host: 'freeportmetrics.atlassian.net',
    basic_auth: {
        base64: 'YourBase64Code'
    }
});
```



### Installing

All you need to do is npm install to download dependencies from npm. to execute script you can type


```
node jiraLog.js
```

from the project directory, if you want to run the script from anywhere on windows machine you need to add a path to your system variables
i.e. system variable name: "jira", value:"C:/projects/logger/jiraLog.js" will enable running the script by typing

```
node $jira
```


## Usage

once you run the script it will start collecting data as a comma separated string (whitespaces are ignored)
[ticket number],[timeToLog],[comment],[jiraTicket - optional]
If jiraTicket is not provided, it will default to _defaultTicket

```
14200, 5, test comment
14200, 5, test comment, [jiraIssueNumber]
```

### Shortcuts

There is a list of shortcut commands for easier entry of common logs:

break - logs 15 minutes to _miscTicket (time cannot be overriden)
standup - logs 30 minutes to _defaultTicket
retro - logs 1 hour to _defaultTicket
planning - logs 1 hour to _defaultTicket
demo - logs 45 minutes to _defaultTicket
meeting - logs 30 minutes to _defaultTicket

```
14200, 5 test comment,
break
standup
demo
```
Above input will log 5 hours for story 14200 to _defaultTicket, 15 minutes break to _miscTicket, 30 minutes to _defaultTicket as standup and 45 minutes to _defaultTicket as demo

every shortcut except for break can be ovveriden with custom time.

```
14200, 5, test comment
break
standup, 1
demo, 2
```
Above input will log 5 hours for story 14200 to _defaultTicket, 15 minutes break to _miscTicket, 1 hour standup to _defaultTicket, 2 hour demo to _defaultTicket
## Execution

Once done with entering the time logs type "go", script will as to make sure you want to execute logging and summarize time, type "y" to continue, "e" to exit, "a" to add more logs