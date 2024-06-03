const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose"); 
const methodOverride = require("method-override");
const morgan = require("morgan");

const app = express();

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const Dog = require("./models/dogs.js");

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); 
app.use(morgan("dev")); 
app.use(express.static('public'));

app.get("/", async (req, res) => {
    res.render("index.ejs");
  });

app.get("/dogs", async (req, res) => {
    const allDogs = await Dog.find();
    res.render("dogs/index.ejs", { dogs: allDogs });
  });

app.get("/dogs/new", (req, res) => {
    res.render('dogs/new.ejs');
  });

app.post("/dogs", async (req, res) => {
    if (req.body.isComingToPlay === "on") {
      req.body.isComingToPlay = true;
    } else {
      req.body.isComingToPlay = false;
    }
    await Dog.create(req.body);
    res.redirect("/dogs/new");
});



app.get("/dogs/:dogId/edit", async (req, res) => {
    const foundDog = await Dog.findById(req.params.dogId);
    res.render("dogs/edit.ejs", {
        dog: foundDog,
    });
  });

app.get("/dogs/:dogId", async (req, res) => {
    const foundDog = await Dog.findById(req.params.dogId);
    res.render('dogs/show.ejs', { dog: foundDog });
});

app.put("/dogs/:dogId", async (req, res) => {
    if (req.body.isComingToPlay === "on") {
      req.body.isComingToPlay = true;
    } else {
      req.body.isComingToPlay = false;
    }
    
    await Dog.findByIdAndUpdate(req.params.dogId, req.body);
  
    res.redirect(`/dogs/${req.params.dogId}`);
  });

app.delete("/dogs/:dogId", async (req, res) => {
  await Dog.findByIdAndDelete(req.params.dogId);
  res.redirect("/dogs");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
