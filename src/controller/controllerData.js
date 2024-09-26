const fs = require('fs');
const path = require("path");

function GetHoraires() {
  return JSON.parse(
    fs.readFileSync(`${(__dirname, "./")}/data/horaire.json`, "utf8")
  );
}

function getGroups() {
  return JSON.parse(
    fs.readFileSync(`${(__dirname, "./")}/data/groups.json`, "utf8")
  );
}

function writeHoraire(horaires) {
  fs.writeFileSync(
    `${path.join(__dirname, "../../")}/data/horaire.json`,
    JSON.stringify(horaires),
    "utf8",
    function (err) {
      if (err) throw err;
    }
  );
}

function writeToday(horaires) {
  fs.writeFileSync(
    `${path.join(__dirname, "../../")}/data/today.json`,
    JSON.stringify(horaires),
    "utf8",
    function (err) {
      if (err) throw err;
    }
  );
}

function writeGroups(groups) {
  fs.writeFileSync(
    `${path.join(__dirname, "../../")}/data/groups.json`,
    JSON.stringify(groups),
    "utf8",
    function (err) {
      if (err) throw err;
    }
  );
}

module.exports = { GetHoraires, getGroups, writeHoraire, writeToday, writeGroups }