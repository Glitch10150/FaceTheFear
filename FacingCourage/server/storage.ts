import { applications, admins, type Application, type InsertApplication, type Admin, type InsertAdmin } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getApplication(id: number): Promise<Application | undefined>;
  getApplications(): Promise<Application[]>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplicationStatus(id: number, status: string, reviewedBy: string): Promise<Application | undefined>;
  // Admin methods
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
}

export class DatabaseStorage implements IStorage {
  async getApplication(id: number): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application || undefined;
  }

  async getApplications(): Promise<Application[]> {
    const result = await db.select().from(applications).orderBy(applications.submittedAt);
    return result;
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const applicationData = {
      ...insertApplication,
      availability: JSON.stringify(insertApplication.availability),
      previousGroups: insertApplication.previousGroups || null,
    };
    
    const [application] = await db
      .insert(applications)
      .values(applicationData)
      .returning();
    return application;
  }

  async updateApplicationStatus(id: number, status: string, reviewedBy: string): Promise<Application | undefined> {
    const [application] = await db
      .update(applications)
      .set({ 
        status, 
        reviewedBy, 
        reviewedAt: new Date()
      })
      .where(eq(applications.id, id))
      .returning();
    return application || undefined;
  }

  // Admin methods
  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin || undefined;
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const [newAdmin] = await db
      .insert(admins)
      .values(admin)
      .returning();
    return newAdmin;
  }
}

export const storage = new DatabaseStorage();
