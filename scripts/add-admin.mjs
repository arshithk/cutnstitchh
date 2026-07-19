import bcrypt from "bcryptjs";
import { createRequire } from "module";

const hash = await bcrypt.hash("admin123", 10);
const id = "admin_" + Date.now();
const now = new Date().toISOString();

// Output the SQL for sqlite3
console.log(`INSERT OR REPLACE INTO Admin (id, email, password, createdAt, updatedAt) VALUES ('${id}', 'admin@cutnstitch.com', '${hash}', '${now}', '${now}');`);
console.log(`\nHashed password: ${hash}`);
