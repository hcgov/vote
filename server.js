"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const airtable_1 = __importDefault(require("airtable"));
const app = (0, express_1.default)();
const port = 3297;
const airtableKey = process.env.AIRTABLE_KEY;
const airtableId = process.env.AIRTABLE_DB_ID;
const tableName = process.env.TABLE_NAME;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const base = new airtable_1.default({ apiKey: airtableKey }).base(airtableId);
const table = base(tableName);
async function createRecord(input) {
    await table.create([
        {
            fields: {
                "Slack ID": input.slackId,
                "Voter ID": input.voterId,
                "Vote": input.vote,
            }
        }
    ]);
}
app.post("/submit-vote", async (req, res) => {
    const info = await fetch("data.json");
    const data = await info.json();
    const electionStart = Number(data.electionStart);
    const electionEnd = Number(data.electionEnd);
    const now = Math.floor(Date.now() / 1000);
    if (now < electionStart) {
        return res.status(403).json({ error: "Elections has not started yet." });
    }
    if (now > electionEnd) {
        return res.status(403).json({ error: "Elections has already ended." });
    }
    const { slackId, voterId, rankedCandidates } = req.body;
    if (!slackId || !voterId || !rankedCandidates) {
        return res.status(400).json({ error: "Missing fields" });
    }
    console.log(req.body);
    await createRecord({
        slackId: slackId,
        voterId: voterId,
        vote: rankedCandidates.join(", ")
    });
    res.json({ message: "Vote submitted successfully" });
});
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
