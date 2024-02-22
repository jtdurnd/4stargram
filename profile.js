import { login } from "./login.js";
import { getUserInput } from "./userInput.js";
import { MongoClient } from "mongodb";

// 메인 db 연결
export async function post(writerID) {
  const uri = process.env.DB_URL;
  const client = new MongoClient(uri);
  const dbName = "4stargram";

  try {
    await client.connect();
    await getPostInput();
    const newPost = { writerID, content, like, imgSrc };
    await pushNewPost(client, dbName, "posts", newPost);
  } finally {
    await client.close();
  }
}

// 포스트 DB 넣기
async function pushNewPost(client, dbName, colName, post) {
  const dbobj = await client.db(dbName);
  const col = dbobj.collection(colName);
  const result = await col.insertOne(post);

  console.log("성공적으로 포스팅 되었습니다.");
}

// 포스트 입력
async function getPostInput() {
  console.log("게시물을 입력해주세요.");
  content = await getUserInput();
  console.log("첨부할 사진의 링크를 입력해주세요");
  imgSrc = await getUserInput();
}

// follower 표시
export async function showFollowings(loginUser) {
  const uri = process.env.DB_URL;
  const client = new MongoClient(uri);
  const dbName = "4stargram";

  const result = await client
    .db(dbName)
    .collection("followers")
    .find({ following_userID: loginUser })
    .toArray();
  if (result[0] === undefined) {
    console.log("내가 팔로우 하는 유저가 없습니다.");
  } else {
    result.forEach((element) => {
      console.log(`- ${element.follower_userID}`);
    });
  }
  console.log("");
  await client.close();
}

// following 표시
export async function showFollowers(loginUser) {
  const uri = process.env.DB_URL;
  const client = new MongoClient(uri);
  const dbName = "4stargram";

  const result = await client
    .db(dbName)
    .collection("followers")
    .find({ follower_userID: loginUser })
    .toArray();
  if (result[0] === undefined) {
    console.log("나를 팔로우 하는 사람이 없습니다.");
  } else {
    result.forEach((element) => {
      console.log(`- ${element.following_userID}`);
    });
  }

  console.log("");
  await client.close();
}
