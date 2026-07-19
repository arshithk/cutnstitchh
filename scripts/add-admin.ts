import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = "admin@cutnstitch.com";
    const password = "admin123";

    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) {
        console.log(`Admin '${email}' already exists. Updating password...`);
        const hashed = await bcrypt.hash(password, 10);
        await prisma.admin.update({ where: { email }, data: { password: hashed } });
        console.log("Password updated.");
    } else {
        const hashed = await bcrypt.hash(password, 10);
        await prisma.admin.create({ data: { email, password: hashed } });
        console.log(`Created admin: ${email}`);
    }
    console.log(`\nAdmin credentials:\n  Email:    ${email}\n  Password: ${password}`);
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
