const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")




const app = express()
dotenv.config();
app.use(express.urlencoded({extended:true}))
mongoose.connect(process.env.MONGO_URL)//to connect mongoDB
app.use(cors())

//notes schema
const noteSchema = new mongoose.Schema({
    title:String,
    content:String
});

const Note =  mongoose.model("Note",noteSchema)



//////////////////////////////////////////////ROUTE TARGETTING ALL NOTES////////////////////////////////////////////////
app.route("/notes")
.get((req, res) => {
  Note.find(function(err,foundNotes){
    if(err){
        res.send(err);
    }else{
        res.send(foundNotes)
    }
  })
})
.post((req,res)=>{

    const note = new Note({
        title: req.body.title,
        content: req.body.content
    });
    note.save((err) => {
        if(err){
            res.send(err);
        }else{
            res.send("Note has been added Successfully: "+note);
        }
    });
})
.delete((req,res)=>{
    Note.deleteMany(function(err){
        if(err){
            res.send(err)
        }else{
            res.send("All the notes have been deleted")
        }
    })
});

////////////////////////////////////////////ROUTES TARGETTING SINGLE NOTES//////////////////////////////////////////////

app.route("/note/:id")
.get((req, res) => {
    const id = req.params.id;
    Note.findOne({_id:id},(err,foundNote) => {
        if(err){
            res.send(err)
        }else{
            res.send(foundNote)
        }
    })
})
.put((req,res) => {
    const id = req.params.id;

    Note.findOneAndUpdate({_id:id},{$set:{content:req.body.content}},(err)=>{
        if(err){
            res.send(err)
        }else{
            res.send("Note has been update successfully")
        }
    })

})
.delete((req,res) => {
    const id = req.params.id;

    Note.deleteOne({_id:id},(err) => {
        if(err){
            res.send(err)
        }else{
            res.send("Note has been Deleted Successfully")
        }
    })
});

app.listen(process.env.PORT||3001,(req, res) => {
    console.log("Server running on port 3001");
})