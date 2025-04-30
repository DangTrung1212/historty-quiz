import { users, type User, type InsertUser, quizSections, userProgress, type QuizSection, type InsertQuizSection, type UserProgress, type InsertUserProgress } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Quiz section methods
  getSections(): Promise<QuizSection[]>;
  getSection(id: number): Promise<QuizSection | undefined>;
  
  // User progress methods
  getUserProgress(userId: number): Promise<UserProgress[]>;
  getSectionProgress(userId: number, sectionId: number): Promise<UserProgress | undefined>;
  updateUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private sections: Map<number, QuizSection>;
  private progress: Map<string, UserProgress>;
  private currentUserId: number;
  private currentSectionId: number;
  private currentProgressId: number;

  constructor() {
    this.users = new Map();
    this.sections = new Map();
    this.progress = new Map();
    this.currentUserId = 1;
    this.currentSectionId = 1;
    this.currentProgressId = 1;
    
    // Initialize with sample quiz sections
    this.initializeSections();
  }

  private initializeSections() {
    const sampleSections: InsertQuizSection[] = [
      {
        title: "Các Triều Đại",
        questions: [
          {
            id: 1,
            text: "Triều đại nào đánh đuổi quân Nguyên Mông 3 lần?",
            options: [
              { id: "1a", text: "Triều Lý" },
              { id: "1b", text: "Triều Trần" },
              { id: "1c", text: "Triều Lê" },
              { id: "1d", text: "Triều Nguyễn" }
            ],
            correctOptionId: "1b"
          }
        ],
        order: 1
      },
      {
        title: "Các Cuộc Chiến",
        questions: [
          {
            id: 1,
            text: "Cuộc kháng chiến chống Mỹ cứu nước của nhân dân Việt Nam kết thúc vào thời gian nào?",
            options: [
              { id: "1a", text: "Tháng 4 năm 1975" },
              { id: "1b", text: "Tháng 1 năm 1973" },
              { id: "1c", text: "Tháng 5 năm 1954" },
              { id: "1d", text: "Tháng 10 năm 1954" }
            ],
            correctOptionId: "1a"
          }
        ],
        order: 2
      },
      {
        title: "Lịch Sử Sau 1945",
        questions: [
          {
            id: 1,
            text: "Nước Việt Nam Dân chủ Cộng hòa được thành lập vào thời gian nào?",
            options: [
              { id: "1a", text: "2/9/1945" },
              { id: "1b", text: "19/8/1945" },
              { id: "1c", text: "3/2/1930" },
              { id: "1d", text: "6/3/1946" }
            ],
            correctOptionId: "1a"
          }
        ],
        order: 3
      },
      {
        title: "Lịch Sử Thế Giới",
        questions: [
          {
            id: 1,
            text: "Chiến tranh thế giới thứ nhất diễn ra trong khoảng thời gian nào?",
            options: [
              { id: "1a", text: "1914-1918" },
              { id: "1b", text: "1939-1945" },
              { id: "1c", text: "1915-1919" },
              { id: "1d", text: "1917-1921" }
            ],
            correctOptionId: "1a"
          }
        ],
        order: 4
      }
    ];
    
    // Add sample sections
    sampleSections.forEach(section => {
      const id = this.currentSectionId++;
      this.sections.set(id, { ...section, id });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getSections(): Promise<QuizSection[]> {
    return Array.from(this.sections.values())
      .sort((a, b) => a.order - b.order);
  }
  
  async getSection(id: number): Promise<QuizSection | undefined> {
    return this.sections.get(id);
  }
  
  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.progress.values())
      .filter(progress => progress.userId === userId);
  }
  
  async getSectionProgress(userId: number, sectionId: number): Promise<UserProgress | undefined> {
    const key = `${userId}-${sectionId}`;
    return this.progress.get(key);
  }
  
  async updateUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const { userId, sectionId } = insertProgress;
    const key = `${userId}-${sectionId}`;
    const existingProgress = this.progress.get(key);
    
    if (existingProgress) {
      const updatedProgress: UserProgress = {
        ...existingProgress,
        ...insertProgress,
      };
      this.progress.set(key, updatedProgress);
      return updatedProgress;
    } else {
      const id = this.currentProgressId++;
      const newProgress: UserProgress = {
        ...insertProgress,
        id,
      };
      this.progress.set(key, newProgress);
      return newProgress;
    }
  }
}

export const storage = new MemStorage();
