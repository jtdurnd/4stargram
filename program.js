import { MongoClient } from "mongodb";

import { getUserInput, wait } from "./userInput.js";
import { printTitle } from "./title.js";
import { table } from "table";
import { login } from "./login.js";
import { join } from "./join.js";
import { post, showFollowers, showFollowings } from "./profile.js";
import { showPost, displayFeed } from "./post.js";

let loggedInUser = {};

async function main() {
  while (true) {
    // 0. index
    printTitle();
    const indexMenu = [["1. Login", "2. Join", "3. Exit"]];
    console.log(table(indexMenu));
    const indexInput = await getUserInput();

    if (indexInput === "1") {
      loggedInUser = await login();
      if (loggedInUser[0] !== undefined) {
        while (true) {
          // 1. 4stagram 접속
          const programMenu = [
            [`1. ${loggedInUser[0].name}`, "2. 메인", "3. 유저 검색"],
          ];
          console.log(table(programMenu));

          const programIndex = await getUserInput();
          if (programIndex === "1") {
            // 1-1. profile page
            while (true) {
              const profileMenu = [
                [
                  `1. 내 정보`,
                  "2. Post 작성",
                  "3. 팔로워 목록",
                  "4. 팔로잉 목록",
                  "5. 뒤로 가기",
                ],
              ];
              console.log(table(profileMenu));
              const profileInput = await getUserInput();
              if (profileInput === "1") {
                const tmp = Object.assign({}, loggedInUser[0]);
                delete tmp._id;
                delete tmp.password;
                const userData = Object.entries(tmp);
                console.log(table(userData));
              } else if (profileInput === "2") {
                await post(loggedInUser[0].userID);
              } else if (profileInput === "3") {
                await showFollowers(loggedInUser[0].userID);
              } else if (profileInput === "4") {
                await showFollowings(loggedInUser[0].userID);
              } else if (profileInput === "5") {
                break;
              } else {
                console.log("잘못된 입력입니다.");
              }
            }
          } else if (programIndex === "2") {
            // main
            await showPost(loggedInUser[0].userID, loggedInUser[0].userID, 0);
          } else if (programIndex === "3") {
            // search
            await displayFeed(loggedInUser[0].userID);
          } else {
            console.log("잘못된 입력입니다.");
          }
        }
      }
    } else if (indexInput === "2") {
      await join();
    } else if (indexInput === "3") {
      process.exit();
    } else {
      console.log("잘못된 입력입니다.");
    }
  }
}

main();
