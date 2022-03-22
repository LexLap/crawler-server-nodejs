const Axios = require('axios')
const cheerio = require('cheerio')

const initScrap = async (url)=>{
  try {
    const response = await Axios.get(url);
    const $ = await cheerio.load(response.data)
    const result = { title:'', url, links:[] }

    $('title').each((i, title) => {
      // console.log(title.children[0].data)
      result.title = title.children[0].data
    });

    $('a').each((i, link) => {
      const href = link.attribs.href;
      if(href)if(href.includes('https://'))result.pages.push(href);
      // if(href)if(href.includes('https://'))sendRequest(href)
    });

    // console.log(result)
    return result

  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  initScrap
}