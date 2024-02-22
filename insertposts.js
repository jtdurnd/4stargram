import { MongoClient } from 'mongodb';
import { createdoc } from './insertusers';
main();
async function main() {
    const uri = process.env.DB_ATLAS_URL;
    const client = new MongoClient(uri);
    const dbname = "4stargram";
    try {
        await client.connect();
        await createdoc(client, dbname, "posts", {
            "comment_id": [],"writer_id":"storyoser", "content":"두번째로 적은 테스트 내용입니다.",
            "Like":0, "imgSrc":"test.jpg"
        });
        console.log("Inserted");
    } finally {
        await client.close()
    }
}

