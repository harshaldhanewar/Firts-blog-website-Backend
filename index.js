import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "blogWebSite",
  password: "Harshal@23",
  port: 5432
});

db.connect();

const app = express();
const port = 5000;

app.use(bodyParser.json()); // Use JSON parsing middleware
app.use(express.static("public"));
app.use(cors());

let getuserID={
    userID:0
}

app.post("/write", async(req, res) => {
  

  const queryText = 'INSERT INTO public.blogdata (image, title, discription) VALUES ($1, $2, $3)';
  const values = [req.body.image, req.body.title, req.body.discription];
const result = await db.query(queryText, values);

  // Handle the received data (e.g., save to database)
  // Example: const { title, disc, image } = req.body;
  // Insert data into PostgreSQL using pg.Client (db) instance
});



app.get("/", async (req, res) => {
    
    const blogdata = await db.query("SELECT * FROM blogdata");
res.send(blogdata);
// db.end()
});


app.get('/singlepost/:id', async (req, res) => {
    const { id } = req.params;
    const blogdata = await db.query(`SELECT * FROM blogdata where id=${id}`);
res.send(blogdata);
});



app.get('/deletepost/:id', async (req, res) => {
    const { id } = req.params;
   const blogdata = await db.query(`DELETE FROM blogdata WHERE id=${id}`);
res.send(blogdata);
});



app.get('/editpost/:id', async (req, res) => {
    const { id } = req.params;
   const blogdata = await db.query(`SELECT * FROM blogdata where id=${id}`);
res.send(blogdata);
});



app.put("/saveEditPost/:id", async(req, res) => {
    const { id } = req.params;
  
 
    const result = await db.query( 'UPDATE blogdata SET image = $1, title = $2, discription = $3 WHERE id = $4',
    [req.body.image, req.body.title, req.body.discription, id]);
res.send(result)

});

app.post("/register",async (req,res)=>{
    
    const queryText = 'INSERT INTO public.userdetails (username, passwords, email) VALUES ($1, $2, $3)';
    const values = [req.body.username, req.body.password, req.body.email];
  const result = await db.query(queryText, values);
   
})

app.post("/loginUser",async (req,res)=>{
    const userDetails = await db.query(`SELECT COUNT(*) FROM userdetails WHERE email='${req.body.email}' AND passwords='${req.body.password}'`);
   console.log("userdetails...",userDetails.rows[0].count)
    userDetails.rows[0].count==1?await db.query('UPDATE userdetails SET loginstatus=1'):await db.query('UPDATE userdetails SET loginstatus=0');
try{const getid=await db.query(`SELECT id FROM userdetails WHERE email='${req.body.email}'`);
const id=getid.rows[0].id
// getuserID.userID=10;
console.log("getting id........",getid.rows[0].id);
    res.send({userDetails,id});}    
    catch{
        res.send({userDetails,"hello":"hello"});
    }


    
})


app.get("/loginStatus", async (req, res) => {
    const loginStatus = await db.query("SELECT loginStatus FROM userdetails");
res.send(loginStatus);
// db.end()
});

app.get("/logOutStatus", async (req, res) => {
    const updatelogOut = await db.query('UPDATE userdetails SET loginstatus=0');
    const logOutStatus = await db.query("SELECT loginStatus FROM userdetails");
    console.log("having id from setting page",getuserID.userID)

// console.log("LogoutStaus",logOutStatus);
res.send(logOutStatus);
// db.end()
});

app.get("/logOutStatuss", async (req, res) => {
    const logOutStatus = await db.query("SELECT loginStatus FROM userdetails");

res.send(logOutStatus);
// db.end()
});


app.post("/setting",async (req,res)=>{
    const userDetails = await db.query(`SELECT * FROM userdetails WHERE email='${req.body.email}'`);
    
    // const queryText = await db.query(' UPDATE userdetails SET loginstatus=1');
    // console.log(userDetails.rows[0])
    res.send(userDetails);
    
})

app.post("/settingData",async (req,res)=>{
    // const userDetails = await db.query(`SELECT * FROM userdetails WHERE id='${req.body.userID}'`);
    
    // const queryText = await db.query(' UPDATE userdetails SET loginstatus=1');
    // console.log("having id from setting page",req.body)
    // res.send(userDetails);

    
})


app.post("/gettingid",async (req,res)=>{
    // const userDetails = await db.query(`SELECT * FROM userdetails WHERE id='${req.body.userID}'`);
    
    // const queryText = await db.query(' UPDATE userdetails SET loginstatus=1');
    // res.send(userDetails);
    
})


app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
