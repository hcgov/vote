import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();
import axios, {AxiosError} from "axios";
import Airtable from "airtable";
import fs from "fs";
import path from "path";

const dataPath = path.join(__dirname, "data.json");
const rawData = fs.readFileSync(dataPath, "utf8");
const electionData = JSON.parse(rawData);

const electionStart = Number(electionData.electionStart);
const electionEnd = Number(electionData.electionEnd);

const app = express();
const port = 3297;

const airtableKey = process.env.AIRTABLE_KEY as string;
const airtableId = process.env.AIRTABLE_DB_ID as string;
const tableName = process.env.TABLE_NAME as string;

app.use(cors());
app.use(express.json());

type airtableRecord = {
    slackId:string;
    voterId:string;
    vote:any;
}

const base = new Airtable({apiKey: airtableKey}).base(airtableId);
const table = base(tableName);

async function createRecord(input:airtableRecord){
    await table.create([
        {
            fields:{
                "Slack ID":input.slackId,
                "Voter ID":input.voterId,
                "Vote":input.vote,
            } as any
        }
    ])
}

app.post("/submit-vote", async (req, res) => {
    const now = Math.floor(Date.now()/ 1000);

    if(now< electionStart){
        return res.status(403).json({error: "Elections has not started yet."})
    }
    if (now > electionEnd){
        return res.status(403).json({error: "Elections has already ended."})
    }

    const {slackId, voterId, rankedCandidates} = req.body;
    if (!slackId || !voterId || !rankedCandidates) {
        return res.status(400).json({error: "Missing fields"});
    }

    console.log(req.body);
    await createRecord({
        slackId: slackId,
        voterId: voterId,
        vote: rankedCandidates.join(", ")
    })
    res.json({message: "Vote submitted successfully"});
});

app.listen(port, () => {
    console.log(`server running on port ${port}`);
})
