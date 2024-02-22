import { MongoClient } from 'mongodb';
import { getUserInput } from './userInput.js';


const uri = process.env.DB_ATLAS_URL;
const client = new MongoClient(uri);
const dbname = "4stargram";

async function main() {
    try {
        await client.connect();
        await displayFeed();
    } finally {
        await client.close()
    }
}

/* 
writer_id 에 해당하는 포스트 출력함수
현재 writer_id 즉 작성자와 일치하는 포스트 출력
target_Id로 값을 받아오고 sw가 1일 때는 target_id의 UserPage를
sw가 0일 때는 MainFeed를 출력하게 설계 할 예정.

*/
async function showPost(target_Id, sw) {
    console.log(target_Id);
    let query = "";
    if (sw === 1) {
        //query문을 수정해서 메인 Feed 또는 UserPage를 구분시킬 수 있을 듯.
        query = { writer_id: `${target_Id}` };
    } else if (sw === 0) {
        //나랑 follow 관계인 사람들을 배열로 받아서 query.
    }
    console.log(query);
    const projection = { _id: 0, comment_id: 0 };
    const result = await client.db(dbname).collection("posts").find(query).project(projection).toArray();
    let postindex = 0;

    //포스트 개수
    console.log('result.length :>> ', result.length);
    while (true) {
        //현재 몇번째 post인지
        console.log('postindex :>> ', postindex);
        console.table(result[postindex]);
        console.log("1.댓글 보기 2.이전 포스트 3. 다음 포스트 4. 팔로우하기");
        let cmd_menu = await getUserInput();
        if (cmd_menu === '1') {
            console.log("HELLO");
        } else if (cmd_menu === '2') {
            console.log("이전 포스트");
            if (postindex === 0) {
                postindex = result.length - 1;
            } else {
                postindex--;
            };
            //만약 이게 첫번째 포스트 일 경우 마지막으로 가게 함.
        } else if (cmd_menu === '3') {
            console.log("다음 포스트 ");
            if (postindex === result.length - 1) {
                postindex = 0;
            } else {
                postindex++;
            }
            //만약 이게 마지막 포스트 일 경우 첫번째로 돌아가게 함.
        } else if (cmd_menu === '4') {
            console.log("Follow\n");
            followUser("test", target_Id);
        }
    }
}

async function displayFeed() {
    console.log("검색할 친구의 ID를 입력하세요");
    let target_Id = await getUserInput();
    await showPost(target_Id, 1);
}

async function followUser(loggedId, target_ID) {

    let query = { $and: [{ follower_userID: loggedId }, { following_userID: target_ID }, { state: 1 }] };
    let projection = { state: true };
    let vals = { $set: { state: 0 } };
    const result = await client.db(dbname).collection("follower").find(query).project(projection).toArray();
    //팔로우하기
    if (result.length <= 0) {
        console.log("현재 팔로우가 되어있지 않습니다. 팔로우 하시겠습니까?");
        console.log("1. 예  2. 아니요");
        const doc = { "follower_userID": loggedId, "following_userID": target_ID, "state": 1 };
        let followcmd = await getUserInput();
        if (followcmd === '1') {
            await client.db(dbname).collection("follower").insertOne(doc);
        };
        console.log("팔로우가 완료되었습니다.");
    } else {
        console.log("현재 팔로우 상태입니다. 팔로우를 끊으시겠습니까?");
        console.log("1. 예 2. 아니요");
        let dfollowcmd = await getUserInput();
        if (dfollowcmd === '1') {
            await client.db(dbname).collection("follower").updateOne(query, vals);
            console.log("팔로우가 취소되었습니다.");
        };
    }
}

main();