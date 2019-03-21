/**
 * @Author: John Isaacs <john>
 * @Date:   23-Jan-192019
 * @Filename: SimpleServer.js
 * @Last modified by:   john
 * @Last modified time: 25-Jan-192019
 */




const http = require('http');
const fs = require('fs');

const
const


fs.readFile('suffra2.json', (err, data) => {
  if (err) throw err;
  let student = JSON.parse(data);
  data.forEach(function(location) {
    var url = location
    var file = fs.createWriteStream("file.jpg");
    var request = http.get("http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg", function(response) {
      response.pipe(file);
    });
    console.log(student);
  });
});
