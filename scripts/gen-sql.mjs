import bcrypt from "bcryptjs";
import { writeFileSync } from "fs";

const hash = bcrypt.hashSync("admin123", 10);
const id = "admin_" + Date.now();
const now = new Date().toISOString();

const sql = `INSERT OR REPLACE INTO Admin (id, email, password, createdAt, updatedAt) VALUES ('${id}', 'admin@cutnstitch.com', '${hash}', '${now}', '${now}');`;

writeFileSync("scripts/admin-insert.sql", sql);
console.log("SQL written to scripts/admin-insert.sql");
console.log(sql);
