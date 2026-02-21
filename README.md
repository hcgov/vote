# DRHC eBallot (front+backend)
---
ts is uh... do i really have to explain this ughhhhh i don't want to but apparently a readme is required idk
anyway yeah uh voter ballot. for general election. for nation.
back-end uses airtable because of course it does welcome to hack club.

---
## 1. Config
Set up `data.json`:
```json
{
  "electionStart": "UNIX TIME STAMP (accurate up to second) (e.g. 1771632000)",
  "electionEnd": "UNIX TIME STAMP (accurate up to second) (e.g. 1772323199)",
  "electionCycle": "YYYY-MM-DD (add 1 day if you set the DD to 01) (e.g. 2026-02-02)",
  "candidates": {
    "0": {
      "fullName": "Full Party Name (e.g. ABC Party)",
      "abbreviation": "Party Abbreviation (e.g. ABC)",
      "leaderSlack": "Slack ID of leader (e.g. U1234567890)"
    },
    "1": {
      "fullName": "DEF Party",
      "abbreviation": "DEF",
      "leaderSlack": "U9876543210"
    },
    "2": {
      ...
    },
    "3": {
      ...
    },
    "..."
  }
}
```

Set up `.env`
```dotenv
AIRTABLE_KEY="Airtable API Key"
AIRTABLE_DB_ID="ID of Airtable base (starts with app...)"
TABLE_NAME="Name of the table (e.g. Table 2)"
```
# 2. Run server.ts