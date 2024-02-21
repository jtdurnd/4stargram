import { createdoc } from "./insertusers";

main();
async function main() {
    const uri = process.env.DB_ATLAS_URL;
    const client = new MongoClient(uri);
    const dbname = "4stargram";
    try {
        await client.connect();
        await createdoc(client, dbname, "comments", {
            "comments_text": "집에 가고 싶다.","writer_id":"storyoser", "postid":[]});
        console.log("Inserted");
    } finally {
        await client.close()
    }
}
