import { Request, Response } from 'express';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOG_FILE = path.join(__dirname, '../../prize_logs.txt');

export async function logPrize(req: Request, res: Response) {
  try {
    const { prize } = req.body;
    // Create date in UTC+7 timezone
    const now = new Date();
    // Format as YYYY-MM-DD HH:MM:SS in UTC+7
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String((now.getUTCHours() + 7) % 24).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} +07:00`;
    const logEntry = `[${timestamp}] Prize won: ${prize}\n`;
    
    // Create logs directory if it doesn't exist
    await fs.mkdir(path.dirname(LOG_FILE), { recursive: true });
    
    // Append to log file
    await fs.appendFile(LOG_FILE, logEntry, 'utf-8');
    
    res.status(200).json({ success: true, message: 'Prize logged successfully' });
  } catch (error) {
    console.error('Error logging prize:', error);
    res.status(500).json({ success: false, error: 'Failed to log prize' });
  }
}

export async function getPrizeLogs(req: Request, res: Response) {
  try {
    const data = await fs.readFile(LOG_FILE, 'utf-8').catch(() => '');
    res.status(200).send(data);
  } catch (error) {
    console.error('Error reading prize logs:', error);
    res.status(500).json({ error: 'Failed to read prize logs' });
  }
}
