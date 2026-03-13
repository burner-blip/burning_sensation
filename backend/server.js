import express from "express";
import { connectSqlDB, getSqlDB } from "./dbsql.js";
import { connectDB } from "./dbmongo.js";
import cors from "cors";

const app = express();

app.use(cors());    
app.use(express.json());
app.use(express.urlencoded({extended:true}));   

let mongoDB;

app.get("/", (req, res) => {
    res.send("Complaint System Running");
});

app.post("/register", async (req, res) => {
    const {name, email, phone, password} = req.body;
    const db = getSqlDB();
    await db.query(
        "INSERT INTO users(name,email,phone,password) VALUES(?,?,?,?)",
        [name,email,phone,password]
    );
    res.json({message:"User Registered"});
});


app.post("/login", async (req,res)=>{

    const {email,password}=req.body;

    const db = getSqlDB();

    const [rows] = await db.query(
        "SELECT * FROM users WHERE email=? AND password=?",
        [email,password]
    );

    if(rows.length===0){
        res.json({status:"fail"});
    }else{
        res.json({status:"success", user:rows[0]});
    }

});



app.post("/complaint", async (req,res)=>{

    const {user_id,title,category,priority,description}=req.body;

    const db = getSqlDB();

    const [result] = await db.query(
        "INSERT INTO complaints(user_id,title,category,priority,status) VALUES(?,?,?,?,?)",
        [user_id,title,category,priority,"Pending"]
    );

    const complaintId = result.insertId;

    const collection = mongoDB.collection("complaint_logs");

    await collection.insertOne({
        complaint_id: complaintId,
        description: description,
        updates: [
            {
                status:"Pending",
                date:new Date()
            }
        ]
    });

    res.json({message:"Complaint submitted"});
});



app.get("/complaints", async (req,res)=>{

    const db = getSqlDB();

    const [rows] = await db.query("SELECT * FROM complaints");

    res.json(rows);
});



app.put("/complaint/status", async (req,res)=>{

    const {complaint_id,status}=req.body;

    const db = getSqlDB();

    await db.query(
        "UPDATE complaints SET status=? WHERE complaint_id=?",
        [status,complaint_id]
    );

    const collection = mongoDB.collection("complaint_logs");

    await collection.updateOne(
        {complaint_id:complaint_id},
        {
            $push:{
                updates:{
                    status:status,
                    date:new Date()
                }
            }
        }
    );

    res.json({message:"Status Updated"});
});



app.listen(3000, async ()=>{

    await connectSqlDB();
    mongoDB = await connectDB();

    console.log("Server running on port 3000");

});