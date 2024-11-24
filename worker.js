// Main Worker script
export default {
    async fetch(request, env) {
      try {
        if (request.method === "OPTIONS") {
          return new Response(null, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type",
            },
          });
        }
  
        if (request.method === "GET") {
          return new Response(generateHTML(), {
            headers: {
              "content-type": "text/html;charset=UTF-8",
              "Access-Control-Allow-Origin": "*",
            },
          });
        }
  
        if (request.method === "POST") {
          const data = await request.json();
          console.log("Received app description:", data.description);
  
          const systemPrompt = `You are an application code generator that specializes in creating simple HTML applications for the Apple Watch. Given a user's app description, write the HTML code that implements the core functionality. Focus on responding with ONLY the core code, no explanation. The HTML should always be dark mode, suited for Apple Watch UI.`;
  
          const prompt = `System: ${systemPrompt}\n\nUser: ${data.description}`;
  
          console.log("Sending prompt to Workers AI:", prompt);
  
          const aiResponse = await fetch(
            'https://gateway.ai.cloudflare.com/v1/YOUR_ACCOUNT_ID/infinite-watch-apps/workers-ai/@cf/meta/llama-3.1-70b-instruct-preview',
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${env.CF_AI_TOKEN}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ prompt }),
            }
          );
  
          if (!aiResponse.ok) {
            console.error("Workers AI API error:", await aiResponse.text());
            throw new Error('Workers AI API error: ' + aiResponse.status);
          }
  
          const result = await aiResponse.json();
          console.log("Workers AI response:", result);
  
          if (!result.success) {
            throw new Error('Workers AI request failed: ' + JSON.stringify(result.errors));
          }
  
          return new Response(JSON.stringify(result), {
            headers: {
              "content-type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          });
        }
  
        throw new Error('Unsupported method: ' + request.method);
      } catch (error) {
        console.error("Worker error:", error);
        return new Response(JSON.stringify({ 
          error: error.message,
          stack: error.stack
        }), {
          status: 500,
          headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
    }
  };
  
  function generateHTML() {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <title>♾️⌚ Apps</title>
          <style>
              /* Apple Watch Series optimization */
              :root {
                  --watch-width: 184px;
                  --accent-color: #007AFF;
              }
              
              body {
                  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro', sans-serif;
                  width: var(--watch-width);
                  margin: 0 auto;
                  padding: 12px 8px;
                  background: #000;
                  color: #fff;
                  -webkit-text-size-adjust: none;
                  -webkit-user-select: none;
                  user-select: none;
                  overflow-x: hidden;
              }
              
              .container {
                  display: flex;
                  flex-direction: column;
                  gap: 12px;
              }
              
              h1 {
                  font-size: 20px;
                  text-align: center;
                  margin: 0;
                  padding: 4px 0;
                  font-weight: 600;
              }
  
              .watch-input {
                  width: 100%;
                  padding: 12px;
                  background: rgba(255, 255, 255, 0.1);
                  border: 2px solid var(--accent-color);
                  border-radius: 20px;
                  color: #fff;
                  font-size: 16px;
                  margin: 8px 0;
                  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro', sans-serif;
                  -webkit-appearance: none;
                  appearance: none;
              }
              
              .watch-input:focus {
                  outline: none;
                  background: rgba(255, 255, 255, 0.15);
              }
              
              button {
                  background: var(--accent-color);
                  color: white;
                  border: none;
                  padding: 16px;
                  border-radius: 24px;
                  font-size: 18px;
                  font-weight: 600;
                  width: 100%;
                  margin: 4px 0;
              }
              
              button:active {
                  transform: scale(0.98);
              }
              
              button:disabled {
                  background: #333;
                  opacity: 0.7;
              }
              
              .preview {
                  display: none;
                  border-radius: 24px;
                  overflow: hidden;
                  margin: 8px 0;
                  border: 1.5px solid #333;
              }
              
              #generatedApp {
                  width: 100%;
                  height: 300px;
                  border: none;
                  background: #fff;
              }
              
              #codeView {
                  white-space: pre-wrap;
                  background: rgba(255, 255, 255, 0.1);
                  padding: 12px;
                  border-radius: 24px;
                  font-family: 'SF Mono', monospace;
                  font-size: 14px;
                  display: none;
                  max-height: 300px;
                  overflow-y: auto;
              }
              
              #error {
                  color: #ff453a;
                  background: rgba(255, 69, 58, 0.2);
                  padding: 12px;
                  border-radius: 24px;
                  margin: 8px 0;
                  display: none;
                  font-size: 14px;
                  text-align: center;
              }
              
              .buttons {
                  display: grid;
                  grid-template-columns: 1fr;
                  gap: 8px;
              }
              
              #viewCodeButton {
                  background: rgba(255, 255, 255, 0.2);
                  font-size: 16px;
              }
  
              .placeholder {
                  color: rgba(255, 255, 255, 0.5);
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>♾️⌚ Apps</h1>
              <form id="inputForm">
                  <input 
                      type="text" 
                      id="description" 
                      placeholder="Tap to describe your app..."
                      class="watch-input"
                  />
                  <div class="buttons">
                      <button type="submit" id="buildButton">Build App</button>
                      <button type="button" id="viewCodeButton">View Code</button>
                  </div>
              </form>
              <div id="preview" class="preview">
                  <iframe id="generatedApp" sandbox="allow-scripts"></iframe>
              </div>
              <pre id="codeView"></pre>
              <div id="error" class="error"></div>
          </div>
          <script>
              const inputForm = document.getElementById('inputForm');
              const description = document.getElementById('description');
              const buildButton = document.getElementById('buildButton');
              const viewCodeButton = document.getElementById('viewCodeButton');
              const preview = document.getElementById('preview');
              const generatedApp = document.getElementById('generatedApp');
              const codeView = document.getElementById('codeView');
              const error = document.getElementById('error');
              
              let currentCode = '';
  
              // Handle form submission
              inputForm.addEventListener('submit', async (e) => {
                  e.preventDefault();
                  
                  try {
  
                      error.style.display = 'none';
                      preview.style.display = 'none';
                      codeView.style.display = 'none';
                      buildButton.disabled = true;
                      buildButton.textContent = 'Building...';
  
                      const response = await fetch(window.location.href, {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                              description: description.value.trim()
                          })
                      });
  
                      if (!response.ok) {
                          throw new Error('HTTP error! status: ' + response.status);
                      }
  
                      const data = await response.json();
                      
                      if (data.error) {
                          throw new Error(data.error);
                      }
  
                      currentCode = data.result.response;
                      generatedApp.srcdoc = currentCode;
                      preview.style.display = 'block';
                      codeView.textContent = currentCode;
                      
                  } catch (err) {
                      error.textContent = 'Error: ' + err.message;
                      error.style.display = 'block';
                  } finally {
                      buildButton.disabled = false;
                      buildButton.textContent = 'Build App';
                  }
              });
  
              // Handle view code button tap
              viewCodeButton.addEventListener('click', () => {
                  if (codeView.style.display === 'none' && currentCode) {
                      codeView.style.display = 'block';
                      viewCodeButton.textContent = 'Hide Code';
                  } else {
                      codeView.style.display = 'none';
                      viewCodeButton.textContent = 'View Code';
                  }
              });
          </script>
      </body>
      </html>
    `;
  }