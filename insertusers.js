import { MongoClient } from 'mongodb';

main();
async function main() {
    const uri = process.env.DB_ATLAS_URL;
    const client = new MongoClient(uri);
    const dbname = "4stargram";
    try {
        await client.connect();
        await createdoc(client, dbname, "user", {
            "userID": "test1","password":"qwerty", "Name": "테스트용", "Introduce":"안녕하세요",
            "gender":"남자","age":20
        });
        console.log("Inserted");
    } finally {
        await client.close()
    }
}
export async function createdoc(client, dbname, colname, doc) {
    const dbobj = await client.db(dbname);
    const col = dbobj.collection(colname);
    const result = await col.insertOne(doc);
    console.log(`New document created with the following id: ${result.insertedId}`);
};

