# Taskwarrior for Thunderbird

## General

Non-official thunderbird addon for Taskwarrior. This addon adds a toolbar button to the message view window. Using this button lets you easily transform a mail message into a task for Taskwarrior.

## Assembling the task

After pressing the button, a dialog pops up to view and edit the data that is sent to Taskwarrior. The data is pre-defined as follows:

|Description|Tags|Due Date|Annotation|
|:---|:---|:---|:---|
| Subject of the mail | Tag from entry field | Due date from entry field | Mail "To" <br/>Mail "From"<br/>Mail body text (first 2000 characters) |

All data can be edited before creating the task in Taskwarrior. 

**Attention**
1. When editing the Tag field, don't add the '+' as you would need to do on command line. It is added automatically.
1. When editing the Due Date field, don't add the 'due:' keyword as you would need to do on command line. It is added automatically.
1. For the Due Date use the pattern configured for your Taskwarrior installation. Taskwarriors default is "Y-M-D".

## Default settings

The addon uses Thunderbirds preferences to store some variables:

|Variable|Default value|
|:---|:---|
|extensions.taskwarrior.firstRun|true|
|extensions.taskwarrior.default-tag|""|
|extensions.taskwarrior.binary|/usr/bin/task|
|extensions.taskwarrior.addAnnotations|false|

"default-tag" sets a pre-defined value for tags. This is usefull if you are using mainly the same tag when creating them from Thunderbird. Feel free to adjust the settings with the 'about:config' dialog of Thunderbird if needed.

## Known issues

* Adding multiple tags at once is not supported
