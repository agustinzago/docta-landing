'use server'

import { useAuth } from '@/hooks/useAuth'
import { db } from '@/lib/db'

export const onPaymentDetails = async () => {
  const { user } = await useAuth()
  if (user) {
    const connection = await db.user.findFirst({
      where: {
        id: user.id,
      },
      select: {
        tier: true,
        credits: true,
      },
    })

    if (user) {
      return connection
    }
  }
}