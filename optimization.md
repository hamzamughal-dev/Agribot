### 1. CPU-Bound Tasks & Machine Learning (Backend)
Node.js is single-threaded, which means heavy computational tasks will block the event loop, causing all other users to experience delays or timeouts while one user's image is being processed.
*   **The Issue:** Running the ONNX model (`mobilenet_leaf.onnx`) and image preprocessing (via `sharp`) directly in the HTTP request-response cycle in `predictionController.js`.
*   **Optimization:** Offload ML inference and heavy image processing to a background worker queue (using **Redis** and **BullMQ** or RabbitMQ), or extract the ML inference into a separate microservice written in a language better suited for CPU-bound ML tasks (like Python with FastAPI).

### 2. Image Handling & Storage
*   **The Issue:** Images are currently uploaded directly into memory (`req.file.buffer`). During high traffic, bulk uploads of high-resolution images can crash your Node.js server with Out-Of-Memory (OOM) errors. Furthermore, there is no scalable persistent storage for these images.
*   **Optimization:** Stream uploads directly to a scalable object storage service like **AWS S3**, **Cloudinary**, or **Google Cloud Storage** using signed URLs, or at least pipe the upload stream directly to the cloud rather than storing it in RAM.

### 3. Asynchronous Tasks (Emails & 3rd Party APIs)
*   **The Issue:** In `utils/sendEmail.js` and `controllers/openaiController.js`, tasks like sending SMTP emails and awaiting OpenAI API responses are blocking the HTTP request. If the SMTP server or OpenAI experiences a latency spike, the user's connection will hang, tying up server resources.
*   **Optimization:** 
    *   Push email sending to a background job queue (e.g., BullMQ). Return a generic "Email sent" response to the user immediately while the worker handles the actual SMTP request in the background.
    *   For OpenAI, consider implementing **Server-Sent Events (SSE)** or WebSockets to stream the AI response back to the client, preventing HTTP timeout issues.

### 4. Database & Caching (MongoDB)
*   **The Issue:** Every request hits the MongoDB database. Some fields used for querying (like tokens or OTPs) might be missing indexes, leading to slow full-collection scans as your user base grows.
*   **Optimization:**
    *   **Indexing:** Ensure fields frequently queried (like `resetPasswordToken`, `otpCode`, or temporal data) are properly indexed. Use **TTL (Time-To-Live) indexes** for automated cleanup of expired OTPs or temporary sessions.
    *   **Caching:** Introduce a **Redis** caching layer. Cache frequent, read-heavy operations like finding nearby vendors (`vendorController.js`) or recent general predictions, so you don't have to query the database/external APIs for identical requests.

### 5. Server Architecture & Load Management
*   **The Issue:** `server.js` runs as a single instance. It doesn't take advantage of multi-core processors and is vulnerable to traffic spikes and brute-force/DDoS attacks.
*   **Optimization:**
    *   **Clustering:** Use Node's native `cluster` module or a process manager like **PM2** to run multiple instances of your API (one per CPU core).
    *   **Rate Limiting:** Implement `express-rate-limit` to protect your expensive endpoints (OpenAI chat, ML predictions, OTP generation) from abuse and resource exhaustion.
    *   **Containerization:** Dockerize the application so it can easily be deployed and auto-scaled using orchestration tools like Kubernetes or AWS ECS.

### 6. Frontend Optimizations (React/Vite)
*   **Code Splitting:** Use `React.lazy()` and `Suspense` for heavy components (like `VendorsMap.jsx` or specialized dashboards) so users don't download the entire JavaScript bundle on their first visit.
*   **CDN Delivery:** Serve your static assets, compiled CSS/JS, and images through a Content Delivery Network (CDN) like Cloudflare or AWS CloudFront to reduce server load and improve load times globally.