// @ts-ignore
import fs from "node:fs";
// @ts-ignore
import path from "node:path";

const dataFilePath = path.join(__dirname, "../test-data/data.json");
const dataFilePath2 = path.join(__dirname, "../test-data/accounts_details_api.json");

// gets data from data.json
export function getData() {
    const raw = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(raw);
}
// gets data from account-details
export function getData_api() {
    const raw = fs.readFileSync(dataFilePath2, "utf-8");
    return JSON.parse(raw);
}

//Returns a unique username by appending the current timestamp.
export function getUniqueUsername(baseUsername: string): string {
    return `${baseUsername}_${Date.now()}`;
}
// saves results to account-details.json
export function saveResults(obj: any) {
    fs.writeFileSync(dataFilePath2, JSON.stringify(obj, null, 2), "utf-8");
}
