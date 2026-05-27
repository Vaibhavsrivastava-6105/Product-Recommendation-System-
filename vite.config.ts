import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import handler from './api/recommend'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables into Node's process.env so our backend function can read them in dev
  const env = loadEnv(mode, process.cwd(), '');
  process.env.AI_API_KEY = env.AI_API_KEY;
  process.env.AI_BASE_URL = env.AI_BASE_URL;
  process.env.AI_MODEL = env.AI_MODEL;

  return {
    plugins: [
      react(),
      {
        name: 'vercel-api-mock',
        configureServer(server) {
          server.middlewares.use('/api/recommend', async (req: any, res: any) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Method Not Allowed' }));
              return;
            }

            // Standard Connect Body Parser
            let body = '';
            req.on('data', (chunk: any) => {
              body += chunk;
            });

            req.on('end', async () => {
              try {
                req.body = body ? JSON.parse(body) : {};

                // Mock Express-like response helpers for Vercel Serverless Function compatibility
                res.status = (code: number) => {
                  res.statusCode = code;
                  return res;
                };
                
                res.json = (data: any) => {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                  return res;
                };

                // Invoke the actual serverless function handler!
                await handler(req, res);
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ 
                  error: 'Local dev middleware server error', 
                  details: err.message 
                }));
              }
            });
          });
        }
      }
    ]
  }
})
