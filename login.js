import { getUserInput } from "./userInput.js";
import bcrypt from "bcrypt";
import { MongoClient } from "mongodb";

const dbName = "4stargram";
const colName = "users";
const uri = process.env.DB_URL;
const client = new MongoClient(uri);

let loggedInUser = "Unknown";

async function main() {
  try {
    await client.connect();
    console.log("Connected");
    loggedInUser = await getLoginInput();
    if (!loggedInUser) {
      console.log("비밀번호 5회 오류. 프로그램 종료.");
      process.exit();
    } else {
      console.log(`로그인 아이디: ${loggedInUser}`);
    }
  } catch (e) {
    console.error(e.message);
  } finally {
    await client.close();
  }

  process.exit();
}

let userID = "",
  password = "";

async function getLoginInput() {
  console.log("아이디를 입력해주세요.");
  userID = await getUserInput();
  while (true) {
    const foundUser = await findUser(client, dbName, colName, userID);
    if (!foundUser[0]) {
      console.log("존재하지 않는 아이디입니다. 아이디를 다시 입력해주세요.");
      userID = await getUserInput();
    } else {
      break;
    }
  }
  console.log("비밀번호를 입력해주세요.");
  password = await getUserInput();
  let check = await checkPassword(client, dbName, colName, userID, password);

  let passwordCount = 0;

  while (passwordCount < 5 && !check) {
    console.log("잘못된 비밀번호입니다. 비밀번호를 다시 입력해주세요.");
    password = await getUserInput();
    check = await checkPassword(client, dbName, colName, userID, password);
    passwordCount++;
  }

  if (check) {
    return userID;
  }

  return null;
}

async function findUser(client, dbName, colName, userID) {
  const result = await client
    .db(dbName)
    .collection(colName)
    .find({ userID })
    .toArray();
  return result;
}

async function checkPassword(client, dbName, colName, userID, password) {
  const result = await findUser(client, dbName, colName, userID);
  const check = await bcrypt.compare(password, result[0].password);
  return check;
}

main();

export const getLoggedInUser = () => loggedInUser;
