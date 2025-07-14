import { db } from "../server/db";
import { admins } from "../shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function createAdminAccounts() {
  try {
    // Delete existing admin accounts first
    await db.delete(admins);
    
    // Create first admin: Glitch
    const hashedPassword1 = await bcrypt.hash("Glitch56??", 10);
    await db.insert(admins).values({
      username: "Glitch",
      password: hashedPassword1,
    });
    
    // Create second admin: Beel
    const hashedPassword2 = await bcrypt.hash("Beel235??", 10);
    await db.insert(admins).values({
      username: "Beel",
      password: hashedPassword2,
    });
    
    console.log("Admin accounts created successfully!");
    console.log("Admin 1 - Username: Glitch, Password: Glitch56??");
    console.log("Admin 2 - Username: Beel, Password: Beel235??");
  } catch (error) {
    console.error("Error creating admin accounts:", error);
  }
  
  process.exit(0);
}

createAdminAccounts();