# appsscript-metabase
Apps Script for Metabase users.

## Usage
1. Script Trigger
- Copy the code in Code.gs to your script on Apps Script.
- Edit declared global variables in the code.
- Update function `getMetabase()` to write the result to your Google Sheet.
- Setup trigger to run function `getMetabase()`.
2. In cell
- Call `=getMetabase(<domain>, <username>, <password>, <token>, <cardid>, <parameters>)` in a cell show the result. You can imagine this function is like `IMPORTRANGE()`, if it's familiar to you.

## Behind the scene
You can read more about why does this script exist and maybe some in-depth details for usage via the link below.

[Google App Script for Metabase User](https://medium.com/@quancao2802/google-apps-script-for-metabase-users-edfb934fb70c)
