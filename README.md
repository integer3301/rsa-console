Внутренний инструмент, написанный в условиях нехватки времени.
Создан для решения конкретной операционной задачи.
Не предназначен в качестве демонстрационного проекта.
Оставлен здесь для справочных / архивных целе

# rsa-console

Frontend-консоль на **Preact + Vite 4** в dev-режиме, запущенная через **Bun** и проксируемая **Nginx**. Проект разворачивается в Docker с помощью `docker-compose`.

---


Рабочая директория на сервере:

```bash
cd /opt/rsa-console
```

---

## 🧱 Стек

* **Preact**
* **Vite 4.5.3** (dev-режим)
* **Bun** (без Node.js)
* **Nginx** (reverse proxy)
* **Docker / docker-compose**

---

## 📁 Структура проекта

```
rsa-console/
├── app/                 # Preact приложение
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
├── nginx/
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

---

## 📄 package.json (проверенная версия)

```json
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
```

---

## 🐳 docker-compose.yml

```yaml
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
```

---

## 🌐 nginx.conf

```nginx
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
```

---

## ▶️ Запуск проекта (Linux)

```bash
docker compose down -v
docker compose up -d --build
```

Открыть в браузере:

```
http://IP_СЕРВЕРА
```

---

## ✅ Проверка, что всё работает

```bash
docker logs bun-dev
```

Ожидаемый вывод:

```
VITE v4.5.3
Network: http://0.0.0.0:5173/
```

---

## 🛠 Если что-то сломалось

1. Проверь версию Vite в `package.json`:

```
"vite": "4.5.3"
```

2. Удали локальные зависимости:

```bash
rm -rf app/node_modules
rm -f app/bun.lockb
```

3. Пересобери Docker:

```bash
docker compose down -v
docker compose up -d --build
```

---

## 🏪 Редактирование магазинов (store.json)

Данные магазинов лежат в файле:

```
/app/public/data/store.json
```

Это публичный JSON-файл, который фронт читает напрямую (без API).

### Пример `store.json`

```json
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
}
```

---

## ✏️ Как отредактировать магазин

1. Открой файл:

```bash
nano app/public/data/store.json
```

или через любой редактор (VS Code, WinSCP, SFTP).

2. Измени нужные поля.
3. Сохрани файл.

### Нужно ли перезапускать контейнеры?

**Нет.**

Файл лежит в `public/`, поэтому изменения подхватываются сразу.

Просто обнови страницу в браузере.

---

## 📌 Примечания

* Проект работает в **dev-режиме** и не предназначен для production без дополнительной настройки.
* Bun используется как runtime и package manager, Node.js не требуется.


