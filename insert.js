const {MongoClient} = require('mongodb');

async function main(){
  const uri = process.env.DB_LOCAL_URL;
  // const uri = process.env.DB_ATLAS_URL;
  // console.log(uri);
   const client = new MongoClient(uri);

   try {
      await client.connect();
      await createdoc(client, "mydatabase", "products", {
         "ProductID":1, "Name":"Laptop", "Price":25000
      });
       
   } finally {
      await client.close();
   }
};

main().catch(console.error);

async function createdoc(client, dbname, colname, doc){
   const dbobj = await client.db(dbname);
   const col = dbobj.collection(colname);
   const result = await col.insertOne(doc);
   console.log(`New document created with the following id: ${result.insertedId}`);
};
