import type { Express } from "express";
import { createServer, type Server } from "http";
import * as quizHandlers from "./handlers/quizHandlers";

export async function registerRoutes(app: Express): Promise<Server> {
  // get question set for each section
  app.get('/api/questions/combined/trac_nghiem_1', quizHandlers.getTracNghiem1);
  app.get('/api/questions/combined/trac_nghiem_2', quizHandlers.getTracNghiem2);
  app.get('/api/questions/combined/trac_nghiem_dung_sai', quizHandlers.getTracNghiemDungSai);
  const httpServer = createServer(app);
  return httpServer;
}
