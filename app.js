var express = require("express");
var app = express();
app.use(express.json());
const axios = require("axios");
const mediumURL =
  "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@";
const blogCard = require("./blogCard");

const getUserData = async (username) => {
  try {
    const result = await axios.get(mediumURL + username);
    const filteredResult = result.data.items.filter(
      (item) =>
        (!item.thumbnail.includes("stat?event") ||
          !item.thumbnail.includes("&referrerSource")) &&
        item.categories.length > 0
    );
    return filteredResult;
  } catch (error) {
    console.error(error);
    return error;
  }
};
console.log(getUserData("sabesan96"));
const asyncForEach = async (array, settings, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, settings, array);
  }
};

app.get("/getMediumBlogs", async (request, response) => {
  try {
    if (!request.query.username) {
      response.write(
        JSON.stringify({
          error: "your medium username is require in the query string",
        })
      );
      response.end();
      return;
    }
    const username = request.query.username;
    let limit = 5;
    let type = "vertical";
    if (request.query.type) {
      type = request.query.type;
    }
    if (request.query.limit) {
      limit = request.query.limit;
    }
    const resultData = await getUserData(username);
    let result = `<svg>`;

    result = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${
      (resultData.length <= 1) ? resultData.length*355 : 710 
    }" version="1.2" height="${ (resultData.length/2)*110 }">`;
    await asyncForEach(resultData, request.query, async (blog, index, settings) => {
      if (index >= limit) {
        return;
      }
      const blogCardObj = await blogCard(blog, settings);
      result += `<g transform="translate(${
        (index%2) ?  355 : 0  
      }, ${ Math.floor(index/2)*110 })">${blogCardObj}</g>`;
    });
  
    result += `</svg>`;
    response.writeHead(200, { "Content-Type": "image/svg+xml" });
    response.write(result);
    response.end();
  } catch (error) {
    console.log(error);
    response.send("Error while fetching the data" + error);
  }
});

var port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log("Server listening " + port);
});
