"use client";

const TextButton = () => {
  const handleButtonClick = async () => {
    // await crawlAndStoreIWhisper();
    fetch("/api/cron/crawler/iwhisper");
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Start Crawler</button>
    </div>
  );
};

const page = async () => {
  return (
    <div>
      <TextButton />
    </div>
  );
};

export default page;
