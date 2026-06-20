import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import { exec } from "child_process";

dotenv.config();

// Standard Gemini constructor following the system guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "MOCK_KEY",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI assistant routing proxy
  app.post("/api/ai", async (req: any, res: any) => {
    const { action, prompt, chatHistory } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        success: false,
        error: "GEMINI_API_KEY is not configured. Please add it via Secrets configuration."
      });
    }

    try {
      if (action === "generate_module") {
        // Construct the strict schema instructing Gemini 3.5 Flash to respond with raw JSON structure
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Generate a custom Odoo application module based on this description: "${prompt}". 
          Ensure the python code uses correct odoo.py syntax, defines an '_name', inherits from models.Model, and uses fields.* like fields.Char, fields.Integer, fields.Boolean, fields.Float (include 'string' labels).
          The XML code must define a tree structure with <tree string="..."> and multiple <field name="..."/> matching the fields.`,
          config: {
            systemInstruction: "You are a professional Odoo Core Developer. Output strict JSON representing an Odoo addon with clean Python models and XML views. Ensure all field names defined in Python are represented inside the XML view tree layout.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Odoo Python module technical name (lowercase, snake_case)" },
                shortdesc: { type: Type.STRING, description: "Odoo UI display name (Capitalized)" },
                description: { type: Type.STRING, description: "Detailed description of what the ERP app manages" },
                author: { type: Type.STRING, description: "Author credits name" },
                icon: { type: Type.STRING, description: "Suggested Lucide Icon name: GraduationCap, Home, Heart, ShoppingBag, Layers, ShieldCheck, or Settings" },
                python_code: { type: Type.STRING, description: "The Python models code using from odoo import models, fields imports." },
                xml_view_code: { type: Type.STRING, description: "The XML view file layout utilizing <tree> and <field> elements." }
              },
              required: ["name", "shortdesc", "description", "author", "icon", "python_code", "xml_view_code"]
            }
          }
        });

        const dataStr = response.text.trim();
        const parsedModule = JSON.parse(dataStr);
        return res.json({ success: true, module: parsedModule });

      } else {
        // Default chatting/advising action about configuring and developing Odoo modules
        const messages = (chatHistory || []).map((msg: any) => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }));

        messages.push({
          role: 'user',
          parts: [{ text: prompt }]
        });

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: messages,
          config: {
            systemInstruction: "You are an Odoo ERP Business consultant. You explain Python customization, Odoo XML views, PostgreSQL schemas (e.g. res_partner, crm_lead, sale_order tables), and standard workflows with professional, concise layout advice."
          }
        });

        return res.json({ success: true, text: response.text });
      }
    } catch (err: any) {
      console.error("Gemini Odoo server error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // --- OPENAI COOKBOOK ENDPOINTS ---
  const configPath = path.join(process.cwd(), "openai-cookbook-config.json");
  const logPath = path.join(process.cwd(), "openai-cookbook-clone.log");
  const repoPath = path.join(process.cwd(), "openai-cookbook");

  app.get("/api/cookbook/status", (req: any, res: any) => {
    let config = {
      repository: "https://github.com/teefisher2k20/openai-cookbook",
      cloned: false,
      lastUpdated: "",
      openai_api_key: "",
      primary_model: "gpt-4o",
      temperature: 0.7,
      environment: "production",
      custom_endpoint: "https://api.openai.com/v1",
      max_tokens: 4096,
      status: "unconfigured"
    };

    if (fs.existsSync(configPath)) {
      try {
        const stored = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        config = { ...config, ...stored };
      } catch (e) {}
    }

    const cloned = fs.existsSync(repoPath) && fs.readdirSync(repoPath).length > 0;
    config.cloned = cloned;

    return res.json({ success: true, config });
  });

  app.post("/api/cookbook/config", (req: any, res: any) => {
    const newConfig = req.body;
    let existing: any = {};
    if (fs.existsSync(configPath)) {
      try {
        existing = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      } catch (e) {}
    }

    const merged = { ...existing, ...newConfig, lastUpdated: new Date().toISOString() };
    fs.writeFileSync(configPath, JSON.stringify(merged, null, 2), "utf-8");

    return res.json({ success: true, config: merged });
  });

  app.get("/api/cookbook/log", (req: any, res: any) => {
    if (fs.existsSync(logPath)) {
      const logs = fs.readFileSync(logPath, "utf-8");
      return res.json({ success: true, logs });
    }
    return res.json({ success: true, logs: "No logs found yet. Click Clone & Build to begin configuration." });
  });

  app.post("/api/cookbook/clone", (req: any, res: any) => {
    fs.writeFileSync(logPath, `[${new Date().toISOString()}] Started cloning OpenAI Cookbook from teefisher2k20/openai-cookbook...\n`, "utf-8");

    const command = `rm -rf "${repoPath}" && git clone --depth 1 https://github.com/teefisher2k20/openai-cookbook.git "${repoPath}"`;
    
    res.json({ success: true, message: "Clone request submitted in background." });

    exec(command, (error: any, stdout: any, stderr: any) => {
      if (error) {
        fs.appendFileSync(logPath, `[${new Date().toISOString()}] CLONE ERROR: ${error.message}\n${stderr}\n`);
        return;
      }
      fs.appendFileSync(logPath, `[${new Date().toISOString()}] CLONE SUCCESS:\n${stdout || "Successfully checked out repository."}\n`);
      
      fs.appendFileSync(logPath, `[${new Date().toISOString()}] Installing dependencies and setting up configurations...\n`);
      
      const hasNpm = fs.existsSync(path.join(repoPath, "package.json"));
      const buildCmd = hasNpm ? `cd "${repoPath}" && npm install` : `echo "No package.json found. Setting up Python environment simulation..."`;

      exec(buildCmd, (bErr: any, bStdout: any, bStderr: any) => {
        if (bErr) {
          fs.appendFileSync(logPath, `[${new Date().toISOString()}] BUILD ERROR: ${bErr.message}\n${bStderr}\n`);
        } else {
          fs.appendFileSync(logPath, `[${new Date().toISOString()}] BUILD SUCCESS:\n${bStdout || "Configured dependencies successfully."}\n`);
        }
        fs.appendFileSync(logPath, `[${new Date().toISOString()}] Finished cloning and system compilation! OpenAI Cookbook ready globally.\n`);
      });
    });
  });

  app.get("/api/cookbook/recipes", (req: any, res: any) => {
    if (!fs.existsSync(repoPath)) {
      return res.json({ success: false, error: "Repository is not yet cloned." });
    }

    function scanDir(dir: string): any[] {
      const items = fs.readdirSync(dir);
      const output: any[] = [];
      for (const item of items) {
        if (item === '.git' || item === 'node_modules' || item.startsWith('.')) continue;
        const full = path.join(dir, item);
        const stat = fs.statSync(full);
        const relative = path.relative(repoPath, full);
        if (stat.isDirectory()) {
          const subChildren = scanDir(full);
          if (subChildren.length > 0) {
            output.push({
              name: item,
              type: "directory",
              path: relative,
              children: subChildren
            });
          }
        } else {
          const ext = path.extname(item).toLowerCase();
          if (['.md', '.py', '.ipynb', '.json', '.txt'].includes(ext)) {
            output.push({
              name: item,
              type: "file",
              path: relative,
              size: stat.size
            });
          }
        }
      }
      return output;
    }

    try {
      const list = scanDir(repoPath);
      return res.json({ success: true, recipes: list });
    } catch (e: any) {
      return res.json({ success: false, error: e.message });
    }
  });

  app.get("/api/cookbook/read-file", (req: any, res: any) => {
    const fileRelativePath = req.query.path as string;
    if (!fileRelativePath) {
      return res.status(400).json({ success: false, error: "Missing file path" });
    }

    const fullFilePath = path.join(repoPath, fileRelativePath);
    if (!fullFilePath.startsWith(repoPath)) {
      return res.status(403).json({ success: false, error: "Access denied" });
    }

    if (!fs.existsSync(fullFilePath)) {
      return res.status(404).json({ success: false, error: "File not found" });
    }

    try {
      const content = fs.readFileSync(fullFilePath, "utf8");
      return res.json({ success: true, content });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e.message });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Odoo fullstack server running on http://localhost:${PORT}`);
  });
}

startServer();
