const axios = require("axios");

const getBase64 = async (url) => {
  return await axios
    .get(url, {
      responseType: "arraybuffer",
    })
    .then((response) =>
      Buffer.from(response.data, "binary").toString("base64")
    );
};

const blogCard = async (data, settings) => {
  const blogImage = await getBase64(data.thumbnail);
  const blogDate = new Date(data.pubDate).toLocaleString("default", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const blogLink = data.link;

  var title_color;
  var text_color;
  var bg_color;

  if(settings.theme) {
    switch(settings.theme) {
      case 'light':
        title_color = "#000";
        text_color = "#000";
        bg_color = "#FFF";
        break;
      case 'dark':
        title_color = "#FFF";
        text_color = "#000";
        bg_color = "#000";
        break;
      case 'dracula':
        title_color = "#A0506C";
        text_color = "#FFF";
        bg_color = "#282A36";
        break;
      default:
        title_color = "#FFF";
        text_color = "#FFF";
        bg_color = "#000";
    }
  } 

  else {
    title_color = settings.title_color || "#FFF";
    text_color = settings.text_color || "#FFF";
    bg_color = settings.bg_color || "#000";
  }

  return `
    <svg height="105px" width="350px">
    <defs>
    <!-- define lines for text lies on -->
    <path id="blogName" d="M0,20 H235 M0,35 H235 M0,50 H240 M0,65 H235">     </path>
      <path id="blogAuthor" d="M0,80 H230 ">     
      </path>
      <path id="blogDate" d="M0,95 H230 ">     
      </path>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${bg_color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${bg_color};stop-opacity:1" />
    </linearGradient>
    <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" style="stop-color:rgb(0,0,0);stop-opacity:1" />
    <stop offset="100%" style="stop-color:rgb(22,22,22);stop-opacity:1" />
  </linearGradient>
   </defs>
   <a href="${blogLink}" target="_blank">
   <rect x="0" y="0" width="100%" height="100%" style="fill:url(#grad1)"></rect>
   <text transform="translate(100,0)" fill="${title_color}" font-size="13" font-family="Arial, Helvetica, sans-serif">
    <textPath xlink:href="#blogName">${data.title}</textPath>
   </text>
   <rect x="5" y="10" height="85px" width="90px" style="fill:url(#grad2);stroke-width:0.5;stroke:rgb(255,255,255)"></rect>
       <image xlink:href="data:image/png;base64,${blogImage}"  x="5" y="10" height="85px" width="90px" />
   <text transform="translate(100,0)" fill="${text_color}" font-size="13">
    <textPath xlink:href="#blogAuthor">${data.author}</textPath>
   </text>
   <text transform="translate(100,0)" fill="${text_color}" font-size="12">
    <textPath xlink:href="#blogDate">${blogDate}</textPath>
   </text>
   </a>
  </svg>
    `;
};

module.exports = blogCard;
