const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));
//Connecting to mongoose
mongoose.connect("mongodb://localhost:27017/wikiDB");

//Creating Schema
const articleSchema = {
  title: String,
  content: String
};

//Creating Model
const Article = mongoose.model("Article", articleSchema);

//////////////// Requests Targetting all the articles //////////////////
app.route("/articles")
.get(function(req, res){
  Article.find({}, function(err, results){
    if (!err){
      res.send(results);
    }else {
      res.send(err);
    }
  })
})
.post(function(req, res){
  //since we are creating JSON object using these values
  //creating an object out of this data
  const article = new Article({
    title: req.body.title,
    content: req.body.content
  });

  article.save(function(err){
    if(err){
      res.send(err);
    } else {
      res.send("Successfully added a new article");
    }
  });
})
.delete(function(req, res){
  Article.deleteMany(
    {},
    function(err) {
      if(!err) {
        res.send("Successfully deleted all articles");
      } else {
        res.send(err);
      }
    }
  )
});

//////////////// Requests Targetting a specifice article //////////////////
app.route("/articles/:articleTitle")
.get(function(req, res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(!err){
      res.send(foundArticle);
    }else{
      res.send("No article found");
    }
  });
})
.put(function(req, res){

  Article.replaceOne(
    {title: req.params.articleTitle},
    { title: req.body.title,
      content: req.body.content
    },
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully Updated Article");
      }else {
        res.send("Error updating Document");
        console.log(err);
      }
    }
  )
})
.patch(function(req, res){

  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err, results){
      if(!err){
        res.send("Successfully Updated Article");
      }else {
        res.send(err);
      }
    }
  )
})
.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Successfully deleted the article");
      }else{
        res.send("Error deleting the article");
      }
    }
  )
});


app.listen(3000, function(){
  console.log("server started at port 3000");
});
