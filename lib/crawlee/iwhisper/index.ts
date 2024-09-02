import { PlaywrightCrawler, log } from "crawlee";
import { router } from "./routes";
import { v4 as uuidv4 } from "uuid";

export const crawlAndStoreIWhisper = async () => {
  log.setLevel(log.LEVELS.DEBUG);
  const crawlId = uuidv4();
  
  const crawler = new PlaywrightCrawler({
    maxRequestsPerCrawl: 20,
    requestHandler: router,
  });

  await crawler.addRequests([
    {
      url: "https://bbs.byr.cn/#!board/IWhisper",
      uniqueKey: `https://bbs.byr.cn/#!board/IWhisper:${crawlId}`,
    },
  ]);

  await crawler.run();
};
