const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const e = require("express");
// const e = require("express");

const _ = require("lodash");

const date = require(__dirname + "/date.js");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
});
const itemSchema = {
  name: String,
};
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "welcome to our todo list",
});
const item2 = new Item({
  name: "hit the + button add a new item",
});
const item3 = new Item({
  name: "<-- hit this to delete a item",
});

const defaultItems = [item1, item2, item3];
const listSchema = {
  name: String,
  items: [itemSchema],
};

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("items added successfully to the array");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: "today",
        newNotes: foundItems,
      });
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listTitle = req.body.list;

  const item = new Item({
    name: itemName,
  });

  if (listTitle === "today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listTitle }, function (err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listTitle);
    });
  }
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "today") {
    Item.findByIdAndRemove(checkedItemId, function (err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      function (err, foundList) {
        if (!err) {
          res.redirect("/" + listName);
        }
      }
    );
  }
});

app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({ name: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        //means if foundList dosent exists
        console.log("dosen't exists");
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + customListName); //after redirectig to this route,it will again enters to the app.get(.. . )function and then after entering to this fn. it moves to else fn.
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newNotes: foundList.items,
        });
        console.log("exists");
      }
    }
  });
});
app.get("/work", function (req, res) {
  res.render("list", {
    listTitle: "work",
    newNotes: workItems,
  });
});

app.post("/work", function (req, res) {
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(4000, function () {
  console.log("port 4000 is runnning");
});
