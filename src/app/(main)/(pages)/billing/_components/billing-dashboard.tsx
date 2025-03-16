'use client'

import { useBilling } from '@/providers/billing-provider'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { SubscriptionCard } from './subscription-card'
import CreditTracker from './credits-tracker'
import { Award, ShieldCheck, Info } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'

const BillingDashboard = () => {
  const { credits, tier } = useBilling()
  const [stripeProducts, setStripeProducts] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(true)

  const onStripeProducts = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get('/api/payment')
      if (data) {
        setStripeProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    onStripeProducts()
  }, [])

  const onPayment = async (id: string) => {
    try {
      setLoading(true)
      const { data } = await axios.post(
        '/api/payment',
        {
          priceId: id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      window.location.assign(data)
    } catch (error) {
      console.error('Payment error:', error)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Current Subscription Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium mb-1 flex items-center">
              Current Plan: <span className="ml-2 font-bold">{tier}</span>
              {tier !== 'Free' && <ShieldCheck className="h-5 w-5 ml-2 text-green-500" />}
            </h3>
            <p className="text-muted-foreground">
              You have <span className="font-semibold">{credits === 'Unlimited' ? 'Unlimited' : credits}</span> credits available this month
            </p>
          </div>
          {/* [TODO] Add next billing cycle date */}
        </div>
      </div>

      {/* Credit Tracker */}
      <div className="pb-6">
        <h3 className="text-lg font-medium mb-4">Credit Usage</h3>
        <CreditTracker
          tier={tier}
          credits={parseInt(credits) || 0}
        />
      </div>
  
      {/* Plans */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-medium">Available Plans</h3>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
            <Info className="h-3.5 w-3.5 mr-1" /> 
            Monthly billing
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[250px] w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          <SubscriptionCard
            onPayment={onPayment}
            tier={tier}
            products={stripeProducts}
          />
        )}
      </div>

      {/* Benefits Alert */}
      <Alert className="bg-amber-50 border border-amber-200 text-amber-800">
        <Award className="h-4 w-4" />
        <AlertTitle>Unlock premium benefits</AlertTitle>
        <AlertDescription>
          Upgrade your plan to get access to premium features, priority support, and higher credit limits.
        </AlertDescription>
      </Alert>
    </div>
  )
}

export default BillingDashboard
