import React from 'react'
import Stripe from 'stripe'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import BillingDashboard from './_components/billing-dashboard'
import { CreditCard, Receipt, History } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type Props = {
  searchParams?: { [key: string]: string | undefined }
}

const Billing = async (props: Props) => {
  const { session_id } = props.searchParams ?? {
    session_id: '',
  }
  if (session_id) {
    const stripe = new Stripe(process.env.STRIPE_SECRET!, {
      typescript: true,
      apiVersion: '2025-02-24.acacia',
    })

    const session = await stripe.checkout.sessions.listLineItems(session_id)
    const user = await currentUser()
    if (user) {
      await db.user.update({
        where: {
          clerkId: user.id,
        },
        data: {
          tier: session.data[0].description,
          credits:
            session.data[0].description == 'Unlimited'
              ? 'Unlimited'
              : session.data[0].description == 'Pro'
              ? '100'
              : '10',
        },
      })
    }
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg border-b">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Billing</h1>
            <p className="text-muted-foreground">Manage your subscription and credit usage</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-6 pt-4">
        <Tabs defaultValue="subscription" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="subscription">
              <CreditCard className="h-4 w-4 mr-2" />
              Subscription
            </TabsTrigger>
            <TabsTrigger value="usage">
              <History className="h-4 w-4 mr-2" />
              Usage
            </TabsTrigger>
            <TabsTrigger value="invoices">
              <Receipt className="h-4 w-4 mr-2" />
              Invoices
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="subscription">
            <BillingDashboard />
          </TabsContent>
          
          <TabsContent value="usage">
            <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/20 rounded-lg">
              <History className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Usage History</h3>
              <p className="text-muted-foreground max-w-md mt-2">
                Track your workflow usage and credit consumption over time.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="invoices">
            <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/20 rounded-lg">
              <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Invoice History</h3>
              <p className="text-muted-foreground max-w-md mt-2">
                View and download your past invoices and payment history.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Billing
