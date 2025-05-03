import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getTracNghiem1(req: any, res: any) {
  const dirPath = path.join(__dirname, '../question-json');
  let allQuestions: any[] = [];
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
  } catch (err: any) {
    res.status(500).json({ message: 'Error combining phan_i questions for trac_nghiem_1', error: err.message });
  }
}

export function getTracNghiem2(req: any, res: any) {
  const dirPath = path.join(__dirname, '../question-json');
  let allQuestions: any[] = [];
  try {
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json')).sort();
    const selectedFiles = files.slice(3, 7);
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
  } catch (err: any) {
    res.status(500).json({ message: 'Error combining phan_i questions for trac_nghiem_2', error: err.message });
  }
}

export function getTracNghiemDungSai(req: any, res: any) {
  const dirPath = path.join(__dirname, '../question-json');
  let allQuestions: any[] = [];
  try {
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json'));
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (Array.isArray(data.phan_ii)) {
        allQuestions = allQuestions.concat(data.phan_ii);
      }
    }
    allQuestions = allQuestions.sort(() => 0.5 - Math.random());
    const selected = allQuestions.slice(0, 5);
    res.json(selected);
  } catch (err: any) {
    res.status(500).json({ message: 'Error combining phan_ii questions for trac_nghiem_dung_sai', error: err.message });
  }
} 