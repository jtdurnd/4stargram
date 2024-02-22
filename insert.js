// const {MongoClient} = require('mongodb');
import {MongoClient} from "mongodb";

async function main(){
   const uri = process.env.DB_ATLAS_URL;
   const client = new MongoClient(uri);
   const dbName = '4stargram';

   try {
      await client.connect();
      await createProfile(client, "4stargram", "users", 
      { "userID": "     ABC      ", "password": "     DEF      ", "name": "      GHI      ", "introduction": "    ABCDEF      ", "gender": "    G     ", "age": "    H     " });
   
   } finally {
      await client.close();
   }
};

main().catch(console.error);

async function createProfile(client, dbname, colname, profile){
   const dbobj = await client.db(dbname);
   const col = dbobj.collection(colname);
   const result = await col.insertOne(profile);
   console.log(`New document created with the following id: ${result.insertedId}`);
};
