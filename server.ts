import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

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

  // Serve static files and route fallback
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
