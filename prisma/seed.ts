import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // const installmentPlans = await prisma.installmentPlanItem.findMany()

  // await Promise.all(
  //   installmentPlans.map(async (item) => {
  //     await prisma.installmentPlanItem.update({
  //       where: {
  //         id: item.id,
  //       },
  //       data: {
  //         payment_date: format(item.payment_date, "yyyy-MM-dd"),
  //       },
  //     })
  //   })
  // )

  console.log("Success")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
