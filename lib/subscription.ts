import { auth } from "@clerk/nextjs";
import prismadb from "./prisma.db";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const checkSubscription = async () => {
  const { userId } = await auth()

  if (!userId) {
    return false;
  }

  const subscription = await prismadb.userSubscription.findUnique({
    where: {
      userId: userId
    },
    select: {
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      stripePriceId: true,
      stripeCurrentPeriodEnd: true
    }
  })

  if (!subscription) {
    return false;
  }

  const isValid = subscription.stripeSubscriptionId && 
                  subscription.stripePriceId &&
                  subscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now()  // 有效期大于当前时间
  
  // !!表示转换为boolean类型
  return !!isValid
}