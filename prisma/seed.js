import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import moment from "moment";
const prisma = new PrismaClient();
async function main() {
   const hashedPassword = await bcrypt.hash("admin@123", 10);
   const adminUsers = [
      {
         full_name: "Rathod Rahul",
         email: "rahul@intelivita.com",
         phone: "+911234567890",
         dob: "1998-06",
         password: hashedPassword,
         status: "active",
         role: "admin",
         created_at: moment().unix()
      }
   ];

   for (const user of adminUsers) {
      await prisma.user.upsert({
         where: { email: user.email, redcap_id: "A0001" },
         update: {},
         create: user
      });
   }

   console.log("✅ Seeded admin users");
}

main()
   .catch(e => {
      console.error("❌ Error seeding admins:", e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });
