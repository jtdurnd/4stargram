<<<<<<< HEAD
// const {MongoClient} = require('mongodb');
import { getUserInput } from "./userInput.js";
import { MongoClient } from "mongodb";

await getPostInput();
const testUserId = "aaa";
let writerID = {},
  content = " ",
  like = 0,
  imgSrc = "";

async function main() {
  const uri = process.env.DB_ATLAS_URL;
  const client = new MongoClient(uri);
  const dbName = "4stargram";

  try {
    await client.connect();
    const userID = await showProfile(client, "4stargram", "users", testUserId);
    writerID = userID;
    const newPost = { writerID, content, like, imgSrc };
    console.log(newPost);
  } finally {
    await client.close();
  }
}

main().catch(console.error);

async function showProfile(client, dbname, colname, userID) {
  var mysort = {
    userID: 1,
    password: 1,
    name: 1,
    introduction: 1,
    gender: 1,
    age: 1,
  }; // var mysort = { userID: 1, password: 1, name: 1, gender: 1, age: 1, introduction: 1 };
  const result = await client
    .db(dbname)
    .collection(colname)
    .find({ userID })
    .sort(mysort)
    .toArray(); // result.forEach(element => { //     console.table(element); // }); // console.table(element);

  console.log(result);
  return result[0]._id;
}

async function pushNewPost(client, dbName, colName, post) {
  const dbobj = await client.db(dbName);
  const col = dbobj.collection(colName);
  const result = await col.insertOne(user);
  console.log(
    `New document created with the following id: ${result.insertedId}`
  );
  console.log(`${name}님 환영합니다.`);
}

async function getPostInput() {
  console.log("게시물을 입력해주세요.");
  postContent = await getUserInput();
  console.log("첨부할 사진의 링크를 입력해주세요");
  postImg = await getUserInput();
}
=======
import { getUserInput } from "./userInput.js";
import {MongoClient} from "mongodb";


const testUserId = 'aaa';
let writerID = {}, 
    content = " ", 
    like = 0, 
    imgSrc = "";


// 메인 db 연결 
async function main(){
  const uri = process.env.DB_ATLAS_URL;
  const client = new MongoClient(uri);
  const dbName = '4stargram';

  try {
      await client.connect();
      // const userID = await showProfile(client, "4stargram", "users", testUserId);
      // writerID = userID;
      // await getPostInput();
      // const newPost = {writerID, content, like, imgSrc};
      // console.log(newPost);
      // await pushNewPost(client, dbName, "posts", newPost);


      // await showFollowers(client, dbName, "followers", testUserId);
      await showFollowings(client, dbName, "followers", testUserId);

  } finally {
      await client.close();
  }
};


main().catch(console.error);


// 프로필 표시
async function showProfile(client, dbname, colname, userID){
  const result = await client.db(dbname).collection(colname).find({userID}).toArray();
  return(result[0]._id);
};


// 포스트 출력
async function pushNewPost(client, dbName, colName, post){
    const dbobj = await client.db(dbName);
    const col = dbobj.collection(colName);
    const result = await col.insertOne(post);
    console.log(`New document created with the following id: ${result.insertedId}`);
    console.log("성공적으로 포스팅 되었습니다.");
  };


// 포스트 입력
async function getPostInput() {
    console.log("게시물을 입력해주세요.");
    content = await getUserInput();
    console.log("첨부할 사진의 링크를 입력해주세요");
    imgSrc = await getUserInput();
  }

// follower 표시
  async function showFollowers(client, dbName, colName, loginUser){
    const result = await client.db(dbName).collection(colName).find({following_user: loginUser}).toArray();
    
    result.forEach(element => {
      console.log(element.follower_user);
  });

  }

// following 표시
  async function showFollowings(client, dbName, colName, loginUser){
    const result = await client.db(dbName).collection(colName).find({follower_user: loginUser}).toArray();

    result.forEach(element => {
      console.log(element.following_user);
  });

  }
>>>>>>> c0850f21914ac6c6683b032bc6265bf82fbf79a1
