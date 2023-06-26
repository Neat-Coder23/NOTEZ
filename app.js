const express = require("express");
const app = express();
const fs = require("fs");
const expressSession = require("express-session");
const port = 8000;

// creating 31 days * 365 from milliseconds
const about1year = 365 * 31 * 1000 * 60 * 60 * 24;

//session middleware
app.use(
  expressSession({
    secret: process.env.secretKey,
    saveUninitialized: true,
    cookie: { maxAge: about1year },
    resave: false,
  })
);

// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//serving public file
app.use(express.static(__dirname));

var sample = {
  username: "",
  password: "",
  notes: [],
};

//homepage
app.get("/", (req, res) => {
  let sessions = JSON.parse(fs.readFileSync("loggedIn-users.json"));
  let loggedIn = sessions.find((e) => e.sessionId == req.sessionID);
  if (loggedIn == undefined) {
    res.sendFile("views/forNewUser.html", { root: __dirname });
  } else {
    res.send(
      '<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8" /> <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <!--<link rel="stylesheet" href="views/index.css" />--> <title>Notez!</title> <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script> <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,700,0,0" /> <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,600,0,0" /> <style> @import url("https://fonts.googleapis.com/css2?family=Rubik:wght@416&display=swap"); * { transition: 0.5s ease; } body { width: 100%; height: 100%; font-family: "Rubik", sans-serif; } button { font-weight: 300; } body div { height: 100%; width: 100%; } .init-content { position: fixed; top: 0; left: 0%; display: flex; align-items: center; justify-content: center; background-image: linear-gradient(330deg, #b121b4 55%, #fff 0); z-index: 3; } #login { left: -100%; } .form { display: flex; flex-direction: column; align-items: center; height: 60%; width: 60%; border: 3px solid #b13bb3; border-radius: 20px; background-color: #fff; } .topic { text-align: center; color: rgb(169, 79, 179); font-size: 43px; font-weight: 700; } input[type="text"], input[type="password"] { height: 10%; width: 60%; border-radius: 20px; border: 2px solid #b13bb3; margin: 10px 0; padding-left: 5px; max-width: 270px; } input[type="submit"] { width: 5rem; height: 2.5rem; border-radius: 20px; border: 2px solid #b13bb3; color: #b13bb3; } input[type="submit"]:hover { background-color: #e559e7; color: aliceblue; cursor: pointer; } #content { max-width: 100%; z-index: 1; } .nav { width: 100%; display: flex; align-items: center; height: 8%; background-color: rgba(222, 17, 216, 1); position: fixed; top: 0; left: 0; } #menu-open { margin-left: 7px; font-size: 35px; color: #f8f8f8; cursor: pointer; transform: scaleX(0.8); } #menu-open:hover { transform: scaleY(1.2); color: #ebb7ec; } .appTitle { font-size: 30px; color: #f8f8f8; margin-left: 10px; letter-spacing: 3px; } #logout { position: absolute; right: 2%; } .notes-cont { height: 92%; position: fixed; top: 8%; max-width: 100%; left: 0; background: linear-gradient( 108deg, rgba(222, 17, 216, 1) 29%, rgba(240, 240, 240, 1) 29%, rgba(240, 240, 240, 1) 72%, rgba(222, 17, 216, 1) 72% ); overflow-y: scroll; display: flex; flex-direction: column; align-items: center; } .note { background-color: #f8f8f8; width: 98%; margin: 10px 0; padding: 8px; box-sizing: border-box; border-radius: 10px; border: 2px solid #b121b4; } .note h2 { font-weight: 600; font-size: 30px; color: #252425; padding-left: 4px; } .note p { color: #4a494a; background-color: #ffffff; padding-left: 3px; box-sizing: border-box; border-radius: 8px; } .note button { cursor: pointer; height: 2rem; border-radius: 10px; margin-bottom: 5px; } .edit { background-color: #fdfdfd; color: #4a494a; border: 1px solid #4a494a; } .delete { background-color: #b10d28; color: #dbd7d7; border: 1px solid #b10d28; } .delete:hover { background-color: #f8f8f8; color: #b10d28; } .form label { margin: 10px 0; } #make-new-note { height: 3rem; width: 3rem; border-radius: 50%; background-color: rgb(172, 40, 208); color: aliceblue; z-index: 2; position: fixed; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; bottom: 10px; right: 10px; cursor: pointer; } #make-new-note span{ font-size: 30px; } #make-new-note:hover{ background-color: #f8f8f8; color: #b13bb3; } #new-note { z-index: 0; left: 0%; } #cancel-new, #cancel-edit { width: 5rem; height: 2.5rem; border-radius: 20px; border: 2px solid #b13bb3; color: #b13bb3; background-color: aliceblue; margin: 10px 0; cursor: pointer; } #edit-note { z-index: -1; } #edit-n-body, #new-n-body { width: 75%; resize: none; font-family: sans-serif; padding: 10px; box-sizing: border-box; border-radius: 10px; border: 2px solid #b13bb3; max-width: 300px; margin: 0 0 10px 0; } .body { word-wrap: break-word; } #logout { cursor: pointer; height: 2rem; border-radius: 10px; background-color: #fdfdfd; color: #4a494a; border: none; } #logout:hover { background-color: #b10d28; color: #dbd7d7; } #menu { height: 100%; width: 100%; background-color: #f0eef0; position: fixed; top: 0; left: -100%; z-index: 6; display: flex; flex-direction: column; align-items: center; transition: left 0.4s ease-in-out; } #menu span { font-size: 20px; margin: 10px 0; cursor: pointer; } #menu span:hover { color: #e559e7; } #close { height: 3rem; border-radius: 50%; width: 3rem; border: 4px solid #f8f8f8; display: flex; align-items: center; justify-content: center; font-size: 35px; margin-top: 15%; margin-bottom: 30px; cursor: pointer; } #close:hover { color: #e559e7; border: 4px solid #e559e7; } .copyright{ font-size: 13px; bottom: 5%; position: absolute; text-align: center; } </style> </head> <body> <div id="make-new-note"><span class="material-symbols-outlined"> add </span></div> <div id="new-note" class="init-content"> <form class="form" id="new-note-form"> <h2 class="topic">Make New Note</h2> <input type="text" id="new-n-title" name="title" placeholder="Enter Title" /> <textarea id="new-n-body" name="body" placeholder="Enter Note" maxlength="600" rows="6" ></textarea> <input type="submit" value="Save" class="submit" /> <input id="cancel-new" type="button" value="Cancel" /> </form> </div> <div id="edit-note" class="init-content"> <form class="form" id="edit-note-form"> <h2 class="topic">Edit Note</h2> <input type="text" id="edit-n-title" name="title" placeholder="Enter Title" /> <textarea type="text" id="edit-n-body" name="body" placeholder="Enter Note" maxlength="600" rows="6" ></textarea> <input type="submit" value="Save" class="submit" /> <input id="cancel-edit" type="button" value="Cancel" /> </form> </div> <div id="content"> <div class="nav"> <span class="material-symbols-outlined" id="menu-open"> menu </span> <p class="appTitle">NOTEZ</p> <button id="logout">Log out</button> </div> <div class="notes-cont" id="notes-cont"></div> </div> <div id="menu"> <div id="close">X</div> <span id="about">About</span> <span id="deleteacc">Delete Account</span> <label class="copyright">Copyright &copy; 2023 Sakindu Dehipitiya.<br>All rights reserved. </label> </div> <script> $(document).ready(() => { var currentUsername = "'+
      loggedIn.username +
        '"; var currentNotes = []; var currentIndex; $.post( "/get-notes", { username: currentUsername, }, (d) => { if (d !== "Authorization required!") { document.getElementById("notes-cont").innerHTML = ""; for (let i = 0; i < d.notes.length; i++) { currentNotes = [...d.notes]; let temp_note = document.createElement("div"); temp_note.classList = "note"; temp_note.innerHTML = `<h2 class="title">${d.notes[i].title}</h2> <p class="body">${d.notes[i].body}</p> <button class="edit" id="e${i}">Edit</button> <button class="delete" id="d${i}">Delete</button>`; document.getElementById("notes-cont").appendChild(temp_note); } } else { alert("something went wrong"); } } ); $("#make-new-note").click(() => { $("#new-note").css("z-index", "4"); }); $("#cancel-new").click(() => { $("#new-note").css("z-index", "0"); }); $("#new-note-form").submit((e) => { e.preventDefault(); $.post( `/${currentUsername}/newnote`, { title: $("#new-n-title").val(), body: $("#new-n-body").val(), }, () => { $.post( "/get-notes", { username: currentUsername, }, (d) => { if (d !== "Authorization required!") { document.getElementById("notes-cont").innerHTML = ""; for (let i = 0; i < d.notes.length; i++) { currentNotes = [...d.notes]; let temp_note = document.createElement("div"); temp_note.classList = "note"; temp_note.innerHTML = `<h2 class="title">${d.notes[i].title}</h2> <p class="body">${d.notes[i].body}</p> <button class="edit" id="e${i}">Edit</button> <button class="delete" id="d${i}">Delete</button>`; document .getElementById("notes-cont") .appendChild(temp_note); $("#new-note").css("z-index", "0"); } } else { alert("something went wrong"); } } ); } ); }); $("#notes-cont").on("click", ".note .delete", (e) => { let id = e.target.id; let index = id.replace("d", ""); console.log(id, index); $.post(`/${currentUsername}/deletenote/${index}`, {}, () => { $.post( "/get-notes", { username: currentUsername, }, (d) => { if (d !== "Authorization required!") { document.getElementById("notes-cont").innerHTML = ""; for (let i = 0; i < d.notes.length; i++) { currentNotes = [...d.notes]; let temp_note = document.createElement("div"); temp_note.classList = "note"; temp_note.innerHTML = `<h2 class="title">${d.notes[i].title}</h2> <p class="body">${d.notes[i].body}</p> <button class="edit" id="e${i}">Edit</button> <button class="delete" id="d${i}">Delete</button>`; document .getElementById("notes-cont") .appendChild(temp_note); } } else { alert("something went wrong"); } } ); }); }); $("#cancel-edit").click(() => { $("#edit-note").css("z-index", "-1"); }); $("#notes-cont").on("click", ".note .edit", (e) => { currentIndex = e.target.id.replace("e", ""); $("#edit-n-title").val(currentNotes[currentIndex].title); $("#edit-n-body").val(currentNotes[currentIndex].body); $("#edit-note").css("z-index", "5"); }); $("#edit-note-form").submit((e) => { e.preventDefault(); $.post( `/${currentUsername}/editnote/${currentIndex}`, { title: $("#edit-n-title").val(), body: $("#edit-n-body").val(), }, () => { $.post( "/get-notes", { username: currentUsername, }, (d) => { if (d !== "Authorization required!") { document.getElementById("notes-cont").innerHTML = ""; for (let i = 0; i < d.notes.length; i++) { currentNotes = [...d.notes]; let temp_note = document.createElement("div"); temp_note.classList = "note"; temp_note.innerHTML = `<h2 class="title">${d.notes[i].title}</h2> <p class="body">${d.notes[i].body}</p> <button class="edit" id="e${i}">Edit</button> <button class="delete" id="d${i}">Delete</button>`; document .getElementById("notes-cont") .appendChild(temp_note); } $("#edit-note").css("z-index", "-1"); } else { alert("something went wrong"); } } ); } ); }); $("#logout").click(() => { $.post("/logout", { username: currentUsername }, (d) => { window.location.pathname = "/"; }); }); $("#menu-open").click(() => { $("#menu").css("left", "0%"); }); $("#close").click(() => { $("#menu").css("left", "-100%"); }); $("#about").click(() => { window.location.pathname = "/about"; }); $("#deleteacc").click(() => { $.get(`/deleteaccount/${currentUsername}`, (d) => { window.location.pathname = d; }); }); }); </script> </body> </html> '
        );
  }
});

//get Notes
app.post("/get-notes", (req, res) => {
  let sessions = JSON.parse(fs.readFileSync("loggedIn-users.json"));
  let loggedIn = sessions.find(
    (e) => e.sessionId == req.sessionID && e.username == req.body.username
  );
  if (loggedIn !== undefined) {
    let readf = JSON.parse(fs.readFileSync("data.json"));
    let user = readf.data.find((e) => e.username == req.body.username);
    res.json(user);
  } else {
    res.send("Authorization required!");
  }
});

//create account
app.post("/newaccount", (req, res) => {
  let readf = JSON.parse(fs.readFileSync("data.json"));
  if (readf.data.find((e) => e.username == req.body.username) == undefined) {
    sample.username = req.body.username;
    sample.password = req.body.password;
    sample.notes = [];
    readf.data.push(sample);
    fs.writeFileSync("data.json", JSON.stringify(readf));
    let sessions = JSON.parse(fs.readFileSync("loggedIn-users.json"));
    sessions.push({ sessionId: req.sessionID, username: req.body.username });
    fs.writeFileSync("loggedIn-users.json", JSON.stringify(sessions));
    res.send("/");
  } else {
    res.send("username taken");
  }
});

//remove account
app.get("/deleteaccount/:username", (req, res) => {
  let sessions = JSON.parse(fs.readFileSync("loggedIn-users.json"));
  let loggedIn = sessions.find(
    (e) => e.sessionId == req.sessionID && e.username == req.params.username
  );
  if (loggedIn !== undefined) {
    let readf = JSON.parse(fs.readFileSync("data.json"));
    let user = readf.data.find((e) => e.username == req.params.username);
    readf.data.splice(readf.data.indexOf(user), 1);
    sessions.splice(sessions.indexOf(loggedIn), 1);
    fs.writeFileSync("data.json", JSON.stringify(readf));
    fs.writeFileSync("loggedIn-users.json", JSON.stringify(sessions));
    res.send("/");
  } else {
    res.send("Authorization required!");
  }
});

//loginto account
app.post("/login", (req, res) => {
  let readf = JSON.parse(fs.readFileSync("data.json"));
  if (
    readf.data.find(
      (e) => e.username == req.body.username && e.password == req.body.password
    ) !== undefined
  ) {
    let sessions = JSON.parse(fs.readFileSync("loggedIn-users.json"));
    sessions.push({ sessionId: req.sessionID, username: req.body.username });
    fs.writeFileSync("loggedIn-users.json", JSON.stringify(sessions));
    res.send("/");
  } else {
    res.send("Invalid credentials");
  }
});

//make new note
app.post("/:username/newnote", (req, res) => {
  let sessions = JSON.parse(fs.readFileSync("loggedIn-users.json"));
  let loggedIn = sessions.find(
    (e) => e.sessionId == req.sessionID && e.username == req.params.username
  );
  if (loggedIn !== undefined) {
    let readf = JSON.parse(fs.readFileSync("data.json"));
    let exist = readf.data.find((e) => e.username == req.params.username);
    readf.data[readf.data.indexOf(exist)].notes.push({
      title: req.body.title,
      body: req.body.body,
    });
    fs.writeFileSync("data.json", JSON.stringify(readf));
    res.send("success");
  } else {
    res.send("Authorization required!");
  }
});

//delete a note
app.post("/:username/deletenote/:i", (req, res) => {
  let sessions = JSON.parse(fs.readFileSync("loggedIn-users.json"));
  let loggedIn = sessions.find(
    (e) => e.sessionId == req.sessionID && e.username == req.params.username
  );
  if (loggedIn !== undefined) {
    let readf = JSON.parse(fs.readFileSync("data.json"));
    let exist = readf.data.find((e) => e.username == req.params.username);
    readf.data[readf.data.indexOf(exist)].notes.splice(Number(req.params.i), 1);
    fs.writeFileSync("data.json", JSON.stringify(readf));
    res.send("success");
  } else {
    res.send("Authorization required!");
  }
});

//edit a note
app.post("/:username/editnote/:i", (req, res) => {
  let sessions = JSON.parse(fs.readFileSync("loggedIn-users.json"));
  let loggedIn = sessions.find(
    (e) => e.sessionId == req.sessionID && e.username == req.params.username
  );
  if (loggedIn !== undefined) {
    let readf = JSON.parse(fs.readFileSync("data.json"));
    let exist = readf.data.find((e) => e.username == req.params.username);
    readf.data[readf.data.indexOf(exist)].notes[req.params.i].title =
      req.body.title;
    readf.data[readf.data.indexOf(exist)].notes[req.params.i].body =
      req.body.body;
    fs.writeFileSync("data.json", JSON.stringify(readf));
    res.send(`Note ${req.params.i} edited`);
  } else {
    res.send("Authorization required!");
  }
});

//log out
app.post("/logout", (req, res) => {
  let sessions = JSON.parse(fs.readFileSync("loggedIn-users.json"));
  let loggedIn = sessions.find(
    (e) => e.sessionId == req.sessionID && e.username == req.body.username
  );
  if (loggedIn !== undefined) {
    sessions.splice(sessions.indexOf(loggedIn), 1);
    fs.writeFileSync("loggedIn-users.json", JSON.stringify(sessions));
    res.send("/");
  } else {
    res.send("/");
  }
});

app.get("/about", (req, res) => {
  res.sendFile('views/about.html',{root:__dirname});
});

app.listen(port, () => {
  console.log("Server listening at http://%s:%s", "localhost", port);
});
