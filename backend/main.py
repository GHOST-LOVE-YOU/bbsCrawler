from crawler.route import crawl_results
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn

from utils import authenticate, run_crawler

app = FastAPI()

# 认证数据模型
class AuthData(BaseModel):
    username: str
    password: str

@app.post("/crawl")
async def crawl(auth_data: AuthData):
    if not authenticate(auth_data.username, auth_data.password):
        raise HTTPException(status_code=401, detail="Unauthorized")
    try:
        crawl_results.clear()
        await run_crawler()
        return {"status": "success", "results": crawl_results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=8000)
