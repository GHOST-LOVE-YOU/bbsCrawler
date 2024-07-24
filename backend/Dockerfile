FROM python:3.9

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

# 安装 Playwright 及其依赖项
RUN apt-get update && apt-get install -y \
    libnss3 \
    libnspr4 \
    libdbus-1-3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libatspi2.0-0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libxkbcommon0 \
    libasound2 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

RUN playwright install

COPY ./app /code/app

CMD ["fastapi", "run", "app/main.py", "--proxy-headers", "--port", "80"]