module.exports = {
  googleClientID:
    '964808011168-29vqsooppd769hk90kjbjm5gld0glssb.apps.googleusercontent.com',
  googleClientSecret: 'KnH-rZC23z4fr2CN4ISK4srN',
  mongoURI: `mongodb://dev:${process.env.ENV_VAR_MONGO}@cluster0-shard-00-00-bjhre.mongodb.net:27017,cluster0-shard-00-01-bjhre.mongodb.net:27017,cluster0-shard-00-02-bjhre.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`,
  cookieKey: '123123123'
};
