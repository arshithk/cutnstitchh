import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const args = process.argv.slice(2);
    if (!args[0]) {
        console.error("Please provide the new password as an argument.");
        process.exit(1);
    }
    const newPassword = args[0];
    const adminEmail = "admin@cutnstitch.com";

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.admin.update({
        where: { email: adminEmail },
        data: { password: hashedPassword },
    });

    console.log(`Password for ${adminEmail} updated successfully.`);
}

main()
    .catch((e) => {
        console.error("Error updating password: ", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
