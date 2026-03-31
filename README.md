# PdfLynx Backend

A production-ready, scalable, and modular PDF processing platform built with Node.js, Fastify, and TypeScript.

## 🚀 Features

- **Merge PDF**: Combine multiple PDFs into one using `qpdf`.
- **Split PDF**: Extract specific pages from a PDF using `qpdf`.
- **Compress PDF**: Optimize PDF size using `Ghostscript`.
- **PDF to Image**: Convert PDF pages to PNG/JPG using `Poppler (pdftoppm)`.
- **Image to PDF**: Convert multiple images to a PDF using `ImageMagick`.

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Fastify (TypeScript)
- **Validation**: Custom validators + `@fastify/multipart`
- **Logging**: Pino / Pino-pretty
- **CLI Tools**: `qpdf`, `gs`, `pdftoppm`, `convert` (ImageMagick)

## 🏗 Directory Structure

- `src/server.ts`: Entry point.
- `src/app.ts`: Fastify application configuration.
- `src/routes/`: API endpoint definitions.
- `src/controllers/`: Logic to handle requests and responses.
- `src/services/`: Core business logic and CLI orchestration.
- `src/executors/`: Robust command execution module.
- `src/storage/`: Temporary file management.
- `src/utils/`: Shared utilities (logger, validator).
- `src/types/`: TypeScript definitions.

## 🚦 Getting Started

### 1. Install Dependencies

You MUST have the following CLI tools installed on your Linux system:
```bash
sudo apt update
sudo apt install qpdf ghostscript poppler-utils imagemagick
```

### 2. Node Setup
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
npm start
```

## 📡 API Endpoints

All endpoints use `POST` and accept `multipart/form-data`.

- `POST /api/pdf/merge`: Files `file1.pdf`, `file2.pdf`, etc.
- `POST /api/pdf/split`: File `file.pdf`, field `range` (e.g., `1-5`).
- `POST /api/pdf/compress`: File `file.pdf`.
- `POST /api/pdf/pdf-to-image`: File `file.pdf`.
- `POST /api/pdf/image-to-pdf`: Files `image1.jpg`, `image2.png`, etc.

## 🛡 Security & Scalability

- **No Command Injection**: Uses `spawn` with `shell: false`. No raw user input in commands.
- **Isolated Jobs**: Each request gets its own UUID directory in `/tmp/pdflynx/`.
- **Automatic Cleanup**: Job directories are deleted after the response is sent.
- **Resource Limits**: Configured file size limit (50MB) and part count.
- **Streaming**: Large files are streamed to the client to minimize memory usage.
