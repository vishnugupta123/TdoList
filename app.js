const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const date = require(__dirname + "/date.js");
let day = date.getdate();
console.log(day);

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//127.0.0.1:27017/todoListDB
mongodb: mongoose.connect(
  "mongodb+srv://user1:v123@cluster1.kye60fk.mongodb.net/todoListDB",
  {
    useNewUrlParser: true,
  }
);

const itemSchema = {
  name: String,
};
const Item = mongoose.model("Item", itemSchema);
const item1 = new Item({
  name: "Welcome to your Todolist !",
});
const item2 = new Item({
  name: "Hit + to add new task ",
});
const item3 = new Item({
  name: "Hit - delete the  task ",
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemSchema],
};
const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  Item.find({}, function (err, founditems) {
    if (founditems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("success!");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newlistItems: founditems });
    }
  });
});
app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({ name: customListName }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        // creating a new list
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        // showing up a exiting list
        res.render("list", {
          listTitle: foundList.name,
          newlistItems: foundList.items,
        });
      }
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newitem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName,
  });
  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, (err, foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});
app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName ==="Today") {
    Item.findByIdAndRemove(checkedItemId, (err) => {
      if (!err) {
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      (err, foundList) => {
        if (!err) {
          res.redirect("/" + listName);
        }
      });
  }
});


app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("server is listening at Port 3000");
});

//try it in best internent condtions to perfomnace checking in good manner
