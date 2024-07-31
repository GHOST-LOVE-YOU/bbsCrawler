from crawler.route import crawl_results
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
from asyncio import Semaphore
from utils import authenticate, run_crawler

app = FastAPI()

# 创建一个信号量，最大值为1
crawler_semaphore = Semaphore(1)

# 认证数据模型
class AuthData(BaseModel):
    username: str
    password: str

@app.post("/crawl")
async def crawl(auth_data: AuthData):
    if not authenticate(auth_data.username, auth_data.password):
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    if not crawler_semaphore.locked():
        async with crawler_semaphore:
            try:
                crawl_results.clear()
                await run_crawler()
                # 爬虫任务完成后重启服务器
                return {"status": "success", "data": crawl_results}
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
    else:
        raise HTTPException(status_code=429, detail="Crawler is already running. Please try again later.")

if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=8000)
