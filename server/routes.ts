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

  const httpServer = createServer(app);

  return httpServer;
}
