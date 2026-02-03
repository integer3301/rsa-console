



Стек:
Preact + Vite 4 (dev‑режим)

Bun (без Node.js)

Nginx (reverse proxy)

Docker / docker‑compose   

rsa-console/
├── app/                 # Preact приложение
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
├── nginx/
│   └── nginx.conf
├── docker-compose.yml
└── README.md

package.json (проверенная версия)
{
  "name": "rsa-console",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@mui/material": "^7.3.6",
    "preact": "^10.27.2"
  },
  "devDependencies": {
    "@preact/preset-vite": "^2.9.1",
    "typescript": "~5.4.5",
    "vite": "4.5.3"
  }
}

docker-compose.yml
services:
  bun:
    image: oven/bun:1.1.0
    container_name: bun-dev
    working_dir: /app
    command: sh -c "bun install && bun run dev --host 0.0.0.0"
    volumes:
      - ./app:/app
    expose:
      - "5173"
    networks:
      - frontend

  nginx:
    image: nginx:alpine
    container_name: nginx-dev
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - bun
    networks:
      - frontend

networks:
  frontend:
    driver: bridge

nginx.conf
server {
    listen 80;

    location / {
        proxy_pass http://bun:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
Запуск проекта (Linux)
docker compose down -v
docker compose up -d --build

Открыть в браузере:

http://IP_СЕРВЕРА
Проверка, что всё ок
docker logs bun-dev

Должно быть:

VITE v4.5.3
Network: http://0.0.0.0:5173/

Если что‑то сломалось


Проверь версию Vite (vite": "4.5.3")

Удали всё лишнее:

rm -rf app/node_modules
rm -f app/bun.lockb

Пересобери Docker:

docker compose down -v
docker compose up -d --build


Редактирование магазинов (store.json)
Данные магазинов лежат здесь:

/app/public/data/store.json

Это публичный JSON, который фронт читает напрямую (без API).

Пример store.json
  {
    "index": null,
    "store_code": 86,
    "store_name": "БВ 1",
    "company": "ООО \"Столица-Бонвин\"",
    "address": "г. Хабаровск, ул. Ким-Ю-Чена, д. 23",
    "department": "Магазин 1 г.Хабаровск, ул. Ким-Ю-Чена, 23",
    "opening_date": "22.02.2014",
    "workstation_ip": "192.168.8.1",
    "utm_ip": "192.168.8.211:8080"
  },



 Как отредактировать магазин
Открой файл:

nano app/public/data/store.json

или через любой редактор (VS Code, WinSCP, SFTP).

      2. Измени нужные поля
      3. Сохрани файл.

Нужно ли перезапускать контейнеры?
 НЕТ

Так как файл лежит в public/, изменения подхватываются сразу.

Просто обнови страницу в браузере 
