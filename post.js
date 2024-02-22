import { MongoClient } from "mongodb";
import { getUserInput } from "./userInput.js";

// async function main() {
//   try {
//     await client.connect();
//     await showPost("test", 0);
//     // await displayFeed();
//   } finally {
//     await client.close();
//   }
// }

/* 
writer_id 에 해당하는 포스트 출력함수
현재 writer_id 즉 작성자와 일치하는 포스트 출력
target_Id로 값을 받아오고 sw가 1일 때는 target_id의 UserPage를
sw가 0일 때는 MainFeed를 출력하게 설계 할 예정.
*/
export async function showPost(target_Id, sw) {
  const uri = process.env.DB_URL;
  const client = new MongoClient(uri);
  const dbname = "4stargram";

  console.log(target_Id);
  let query = "";
  let projection = { _id: 1, comment_id: 0 };
  let result = "";
  if (sw === 1) {
    //query문을 수정해서 메인 Feed 또는 UserPage를 구분시킬 수 있을 듯.
    query = { writer_id: `${target_Id}` };
    result = await client
      .db(dbname)
      .collection("posts")
      .find(query)
      .project(projection)
      .toArray();
  } else if (sw === 0) {
    //나랑 follow 관계인 사람들을 배열로 받아서 query.
    let first_query = { following_userID: `${target_Id}` };
    let first_projection = { follower_userID: 1 };
    let followerList = await client
      .db(dbname)
      .collection("follower")
      .find(first_query)
      .project(first_projection)
      .toArray();

    // followerList 는 현재 객체배열 --> 즉, index와 _id값을 모두 가지고 있는 배열이므로,
    // 여기서 follower_userID값만 추출해서 다시 배열을 만들어 넣어준다.
    let follower_userIDs = followerList.map(
      (follower) => follower.follower_userID
    );

    // 즉 여기서 follower_userIDs는 현재 내가 팔로우 중인 사람들의 ID만을 담는다.
    let follower_query = { writer_id: { $in: follower_userIDs } };
    // console.table(follower_userIDs);
    result = await client
      .db(dbname)
      .collection("posts")
      .find(follower_query)
      .project(projection)
      .toArray();
    // console.table(result);
  }
  let postindex = 0;
  //포스트 개수
  // console.log('result.length :>> ', result.length);
  while (true) {
    //현재 몇번째 post인지
    // console.log('postindex :>> ', postindex);
    console.table(result[postindex]);
    if (sw === 0) {
      console.log("1.이전 포스트 2. 다음 포스트 3. 좋아요");
    } else {
      console.log("1.이전 포스트 2. 다음 포스트 3. 좋아요 0. 팔로우하기");
    }
    let cmd_menu = await getUserInput();
    if (cmd_menu === "4") {
      // 댓글 영역
      console.log("HELLO");
    } else if (cmd_menu === "1") {
      console.log("이전 포스트");
      if (postindex === 0) {
        postindex = result.length - 1;
      } else {
        postindex--;
      }
      //만약 이게 첫번째 포스트 일 경우 마지막으로 가게 함.
    } else if (cmd_menu === "2") {
      //만약 이게 마지막 포스트 일 경우 첫번째로 돌아가게 함.
      console.log("다음 포스트 ");
      if (postindex === result.length - 1) {
        postindex = 0;
      } else {
        postindex++;
      }
      //좋아요 영역
    } else if (cmd_menu === "3") {
      // console.log(result[postindex]._id);
      let current_like = result[postindex].Like;
      let current_id = result[postindex]._id;
      let like_query = { _id: current_id };
      await client
        .db(dbname)
        .collection("posts")
        .updateOne(like_query, { $set: { Like: current_like + 1 } });
      result[postindex].Like = current_like + 1;
      console.log("좋아요를 눌렀습니다.");
    } else if (cmd_menu === "0") {
      console.log("Follow\n");
      // 여기서 "test"부분을 loggedID정보로 바꿔야함.
      followUser("test", target_Id);
    }
  }
}

// ID를 검색했을 때, 나오는 함수
export async function displayFeed() {
  const uri = process.env.DB_URL;
  const client = new MongoClient(uri);
  const dbname = "4stargram";

  console.log("검색할 친구의 ID를 입력하세요");
  let target_Id = await getUserInput();
  await showPost(target_Id, 1);
  await client.close();
}

// ID를 검색해서 특정 User의 Page에 들어갔을 때, 해당 User를 팔로우할지를 결정하는 함수
async function followUser(loggedId, target_ID) {
  // query문 : 검색한 ID를 내가 팔로우 중인 상태를 찾는 문
  let query = {
    $and: [
      { follower_userID: target_ID },
      { following_userID: loggedId },
      { state: 1 },
    ],
  };

  // 상태만 뽑기
  let projection = { state: true };

  const result = await client
    .db(dbname)
    .collection("follower")
    .find(query)
    .project(projection)
    .toArray();
  //팔로우하기
  if (result.length <= 0) {
    console.log("현재 팔로우가 되어있지 않습니다. 팔로우 하시겠습니까?");
    console.log("1. 예  2. 아니요");
    let followcmd = await getUserInput();
    if (followcmd === "1") {
      // 여기서 만약 follow했다가 끊었던 상태이면 update
      let check_query = {
        $and: [
          { follower_userID: target_ID },
          { following_userID: loggedId },
          { state: 0 },
        ],
      };
      let check_first = await client
        .db(dbname)
        .collection("follower")
        .find(check_query)
        .toArray();
      if (check_first.length <= 0) {
        const doc = {
          follower_userID: target_ID,
          following_userID: loggedId,
          state: 1,
        };
        await client.db(dbname).collection("follower").insertOne(doc);
      } else {
        await client
          .db(dbname)
          .collection("follower")
          .updateOne(check_query, { $set: { state: 1 } });
      }
      console.log("팔로우가 완료되었습니다.");
    }
  } else {
    console.log("현재 팔로우 상태입니다. 팔로우를 끊으시겠습니까?");
    console.log("1. 예 2. 아니요");
    let dfollowcmd = await getUserInput();
    if (dfollowcmd === "1") {
      let vals = { $set: { state: 0 } };
      await client.db(dbname).collection("follower").updateOne(query, vals);
      console.log("팔로우가 취소되었습니다.");
    }
  }
}

// main();
