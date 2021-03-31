const express = require('express');
const bodyParser=require('body-parser');
const cors = require('cors')
const {graphqlHTTP} = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const authMiddleware = require('./middleware/auth_check');
const app = express();
app.use(cors());
const port=4000;
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (res.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });
app.use(authMiddleware);
app.use('/graphql', graphqlHTTP({
    schema:schema,
    rootValue:resolvers,
    graphiql:true
}))
app.get('/test',(req,res,next)=>{
    res.send(`Server running on port :${port}`);
})
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@node-rest-services.u82qf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,{ useNewUrlParser: true }).then((res)=>{
console.log("DB connection has been established");    
app.listen(port,()=>{
  console.log(`Server running on port :${port}`);    

});
}).catch((err)=>{
    console.log(err);
    throw err;
})
