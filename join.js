import { getUserInput } from "./userInput.js";
import bcrypt from "bcrypt";
import { MongoClient } from "mongodb";

const dbName = "4stargram";
const colName = "users";
const uri = process.env.DB_URL;
const client = new MongoClient(uri);

export async function join() {
  try {
    await client.connect();
    const newUser = await getJoinInput();
    newUser.password = await bcrypt.hash(newUser.password, 3);
    await pushNewUser(client, dbName, colName, newUser);
  } catch (e) {
    console.error(e.message);
  } finally {
    await client.close();
  }
}

let userID = "",
  password = "",
  name = "",
  gender = "",
  age = 0,
  introduction = "";

async function getJoinInput() {
  console.log("아이디를 입력해주세요.");
  userID = await getUserInput();
  while (true) {
    const foundUser = await findUser(client, dbName, colName, userID);

    if (!foundUser[0]) {
      break;
    } else if (foundUser) {
      console.log("이미 존재하는 아이디입니다. 아이디를 다시 입력해주세요.");
      userID = await getUserInput();
    }
  }
  console.log("비밀번호를 입력해주세요.");
  password = await getUserInput();
  console.log("이름을 입력해주세요.");
  name = await getUserInput();
  console.log("남/여를 입력해주세요.");
  gender = await getUserInput();
  console.log("나이를 입력해주세요.");
  age = await getUserInput();
  console.log("자기소개를 입력해주세요.");
  introduction = await getUserInput();

  return { userID, password, name, gender, age, introduction };
}

async function pushNewUser(client, dbName, colName, user) {
  const dbobj = await client.db(dbName);
  const col = dbobj.collection(colName);
  const result = await col.insertOne(user);
  console.log(`${name}님 환영합니다.`);
}

async function findUser(client, dbName, colName, userID) {
  const result = await client
    .db(dbName)
    .collection(colName)
    .find({ userID })
    .toArray();
  return result;
}
