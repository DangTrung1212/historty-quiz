import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserProgressSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for quiz sections
  app.get("/api/sections", async (req, res) => {
    try {
      const sections = await storage.getSections();
      res.json(sections);
    } catch (error) {
      res.status(500).json({ message: "Error fetching quiz sections" });
    }
  });
  
  app.get("/api/sections/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid section ID" });
      }
      
      const section = await storage.getSection(id);
      if (!section) {
        return res.status(404).json({ message: "Section not found" });
      }
      
      res.json(section);
    } catch (error) {
      res.status(500).json({ message: "Error fetching quiz section" });
    }
  });
  
  // API routes for user progress
  app.get("/api/users/:userId/progress", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user progress" });
    }
  });
  
  app.get("/api/users/:userId/progress/:sectionId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const sectionId = parseInt(req.params.sectionId);
      
      if (isNaN(userId) || isNaN(sectionId)) {
        return res.status(400).json({ message: "Invalid user ID or section ID" });
      }
      
      const progress = await storage.getSectionProgress(userId, sectionId);
      if (!progress) {
        return res.status(404).json({ message: "Progress not found" });
      }
      
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Error fetching section progress" });
    }
  });
  
  app.post("/api/users/:userId/progress", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Validate request body
      const validationResult = insertUserProgressSchema.safeParse({
        ...req.body,
        userId
      });
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid progress data", 
          errors: validationResult.error.errors 
        });
      }
      
      const progress = await storage.updateUserProgress(validationResult.data);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Error updating user progress" });
    }
  });

  // API endpoint to serve question data from JSON files
  const fs = require('fs');
  const path = require('path');

  app.get('/api/questions/:setName', async (req, res) => {
    const setName = req.params.setName;
    const filePath = path.join(__dirname, 'question-json', `${setName}.json`);
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(404).json({ message: 'Question set not found' });
      }
      try {
        const jsonData = JSON.parse(data);
        res.json(jsonData);
      } catch (parseErr) {
        res.status(500).json({ message: 'Error parsing question data' });
      }
    });
  });

  // API endpoint to combine all phan_i questions from all JSON files and return 10 random questions
  app.get('/api/questions/combined/phan_i', (req, res) => {
    const fs = require('fs');
    const path = require('path');
    const dirPath = path.join(__dirname, 'question-json');
    let allQuestions = [];
    try {
      const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json'));
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (Array.isArray(data.phan_i)) {
          allQuestions = allQuestions.concat(data.phan_i);
        }
      }
      // Shuffle and pick 10
      allQuestions = allQuestions.sort(() => 0.5 - Math.random());
      const selected = allQuestions.slice(0, 10);
      res.json(selected);
    } catch (err) {
      res.status(500).json({ message: 'Error combining phan_i questions', error: err.message });
    }
  });

  // API endpoint for trac_nghiem_1: random 10 phan_i questions from first 3 files
  app.get('/api/questions/combined/trac_nghiem_1', (req, res) => {
    const fs = require('fs');
    const path = require('path');
    const dirPath = path.join(__dirname, 'question-json');
    let allQuestions = [];
    try {
      const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json')).sort();
      const selectedFiles = files.slice(0, 3);
      for (const file of selectedFiles) {
        const filePath = path.join(dirPath, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (Array.isArray(data.phan_i)) {
          allQuestions = allQuestions.concat(data.phan_i);
        }
      }
      allQuestions = allQuestions.sort(() => 0.5 - Math.random());
      const selected = allQuestions.slice(0, 10);
      res.json(selected);
    } catch (err) {
      res.status(500).json({ message: 'Error combining phan_i questions for trac_nghiem_1', error: err.message });
    }
  });

  // API endpoint for trac_nghiem_2: random 10 phan_i questions from last 4 files
  app.get('/api/questions/combined/trac_nghiem_2', (req, res) => {
    const fs = require('fs');
    const path = require('path');
    const dirPath = path.join(__dirname, 'question-json');
    let allQuestions = [];
    try {
      const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json')).sort();
      const selectedFiles = files.slice(3, 7); // 4 files after the first 3
      for (const file of selectedFiles) {
        const filePath = path.join(dirPath, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (Array.isArray(data.phan_i)) {
          allQuestions = allQuestions.concat(data.phan_i);
        }
      }
      allQuestions = allQuestions.sort(() => 0.5 - Math.random());
      const selected = allQuestions.slice(0, 10);
      res.json(selected);
    } catch (err) {
      res.status(500).json({ message: 'Error combining phan_i questions for trac_nghiem_2', error: err.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
