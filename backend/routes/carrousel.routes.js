const express = require('express');
const axios = require('axios');
const parser = require('xml2json');
const carrouselRouter = express.Router();

carrouselRouter.get('', async (req, res) => {
  try {
    const url = `https://stage-bucket-thibaud.s3.amazonaws.com/`;

    const response = await axios.get(url);
    const xmlData = response.data;

    const jsonData = JSON.parse(parser.toJson(xmlData));
    const contents = jsonData.ListBucketResult.Contents;

    const imageUrls = contents.map(content => {
      return {
        url: `${url}${content.Key}`
      };
    });

    res.json(imageUrls);
  } catch (error) {
    console.error('Error retrieving images from AWS S3:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = carrouselRouter;
