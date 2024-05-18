import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: `Administrator`,
      email: "admin@pipelineconversionkit.com",
      hashedPassword: "$2b$12$BxVGYze/eSpPd1LtaU48iORo8oOT04y7AV0oGS1AcxqaP62z7v4TC",
      role: "SUPERADMIN",
      status: 1,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
