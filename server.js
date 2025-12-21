const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // Parse the URL
    let filePath = '.' + req.url;
    
    // Default to index.html for root path
    if (filePath === './') {
        filePath = './index.html';
    }
    
    // Get file extension
    const extname = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    // Read and serve the file
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // File not found
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <html>
                        <head>
                            <title>404 - Not Found</title>
                            <style>
                                body { 
                                    font-family: Arial, sans-serif; 
                                    text-align: center; 
                                    padding: 50px;
                                    background: #0a0a0f;
                                    color: #00d4ff;
                                }
                                h1 { font-size: 3rem; margin-bottom: 1rem; }
                                p { font-size: 1.2rem; color: #b8c5d6; }
                                a { color: #00d4ff; text-decoration: none; }
                                a:hover { text-decoration: underline; }
                            </style>
                        </head>
                        <body>
                            <h1>🚀 404 - Page Not Found</h1>
                            <p>The requested page could not be found in this galaxy.</p>
                            <a href="/">Return to Home</a>
                        </body>
                    </html>
                `);
            } else {
                // Server error
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Space Portfolio Server running at http://localhost:${PORT}`);
    console.log(`📡 Ready to explore the digital universe!`);
    console.log(`\nPress Ctrl+C to stop the server`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛸 Shutting down server...');
    server.close(() => {
        console.log('✅ Server closed successfully');
        process.exit(0);
    });
});
