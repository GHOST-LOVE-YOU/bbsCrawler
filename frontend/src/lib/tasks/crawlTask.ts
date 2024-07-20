import "server-only";

import axios from 'axios';

const data = JSON.stringify({
  username: process.env.AUTH_BACKEND_USERNAME,
  password: process.env.AUTH_BACKEND_PASSWORD
});

const config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'http://127.0.0.1:8000/crawl',
  headers: { 
    'Content-Type': 'application/json'
  },
  data: data
};

async function handleCrawlTask() {
  try {
    const response = await axios.request(config);
    console.log('Crawl task response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error executing crawl task:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export default handleCrawlTask;
