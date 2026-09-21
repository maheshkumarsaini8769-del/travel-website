const { MongoClient } = require('mongodb');
const uri = 'mongodb://maheshkumarsaini8769_db_user:mahesh99830@ac-cf9ozuy-shard-00-00.bvul13j.mongodb.net:27017,ac-cf9ozuy-shard-00-02.bvul13j.mongodb.net:27017,ac-cf9ozuy-shard-00-01.bvul13j.mongodb.net:27017/sunsky?authSource=admin&retryWrites=true&w=majority&tls=true';
(async () => {
  const client = new MongoClient(uri);
  await client.connect();
  const col = client.db('sunsky').collection('admins');
  const admins = await col.find({}).toArray();
  console.log('Found:', admins.length, 'admins');
  admins.forEach(a => console.log(a.email, 'active:', a.active, 'role:', a.role));

  const result = await col.updateMany({ active: { $ne: true } }, { $set: { active: true } });
  console.log('Enabled:', result.modifiedCount, 'admins');

  await client.close();
})();
