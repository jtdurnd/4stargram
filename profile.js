// const {MongoClient} = require('mongodb');
import {MongoClient} from "mongodb";

async function main(){
  const uri = process.env.DB_ATLAS_URL;
  const client = new MongoClient(uri);
  const dbName = '4stargram';

  try {
      await client.connect();
      await showProfile(client, "4stargram", "users");
  } finally {
      await client.close();
  }
};

main().catch(console.error);

async function showProfile(client, dbname, colname){
  var mysort = { userID: 1, password: 1, name: 1, introduction: 1, gender: 1, age: 1 };
  // var mysort = { userID: 1, password: 1, name: 1, gender: 1, age: 1, introduction: 1 };

  const result = await client.db(dbname).collection(colname).find({}).sort(mysort).toArray();

  result.forEach(element => {
      console.log(element);
  });

  // console.table(element);
  // console.log(result);
  
};
