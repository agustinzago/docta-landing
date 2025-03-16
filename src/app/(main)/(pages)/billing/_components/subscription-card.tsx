'use client'
import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Zap, Infinity, Star } from 'lucide-react'

type Props = {
  onPayment(id: string): void
  products: any[]
  tier: string
}

export const SubscriptionCard = ({ onPayment, products, tier }: Props) => {
  const getBenefits = (plan: string) => {
    const commonBenefits = ["Access to all basic automations", "Email support"];
    
    if (plan === 'Free') {
      return [...commonBenefits, "10 credits per month", "Standard response time"];
    }
    
    if (plan === 'Pro') {
      return [
        ...commonBenefits,
        "100 credits per month",
        "Priority email support",
        "Advanced automations",
        "Custom integrations"
      ];
    }
    
    // Unlimited plan
    return [
      ...commonBenefits,
      "Unlimited credits",
      "Priority 24/7 support",
      "All advanced features",
      "Custom solutions",
      "Dedicated success manager"
    ];
  }
  
  const getPlanIcon = (plan: string) => {
    if (plan === 'Free') return <Zap className="h-5 w-5 text-blue-500" />;
    if (plan === 'Pro') return <Star className="h-5 w-5 text-purple-500" />;
    return <Infinity className="h-5 w-5 text-indigo-500" />;
  }

  return (
    <section className="grid md:grid-cols-3 gap-6 w-full">
      {products &&
        products.map((product: any) => {
          const isCurrentPlan = product.nickname === tier;
          const benefits = getBenefits(product.nickname);
          const planIcon = getPlanIcon(product.nickname);
          
          return (
            <Card
              key={product.id}
              className={`border transition-all flex flex-col h-full ${
                isCurrentPlan ? 'border-primary shadow-md dark:border-primary' : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center mb-2">
                  {planIcon}
                  <CardTitle className="ml-2">{product.nickname}</CardTitle>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">
                    {product.nickname === 'Free'
                      ? '$0'
                      : product.nickname === 'Pro'
                      ? '$29.99'
                      : '$99.99'}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              
              <CardContent className="pb-2 flex-grow">
                <CardDescription className="mb-4">
                  {product.nickname === 'Unlimited'
                    ? 'Enjoy a monthly torrent of credits flooding your account, empowering you to tackle even the most ambitious automation tasks effortlessly.'
                    : product.nickname === 'Pro'
                    ? 'Experience a monthly surge of credits to supercharge your automation efforts. Ideal for small to medium-sized projects seeking consistent support.'
                    : 'Get a monthly wave of credits to automate your tasks with ease. Perfect for starters looking to dip their toes into automation capabilities.'}
                </CardDescription>
                
                <div className="space-y-3">
                  {benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center">
                      <div className="mr-2 h-4 w-4 bg-primary/10 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="pt-4 mt-auto border-t">
                {isCurrentPlan ? (
                  <Button
                    disabled
                    variant="outline"
                    className="w-full"
                  >
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    onClick={() => onPayment(product.id)}
                    variant={product.nickname === 'Pro' ? 'default' : 'outline'}
                    className={`w-full ${product.nickname === 'Unlimited' ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-none' : ''}`}
                  >
                    {product.nickname === 'Free' ? 'Downgrade' : 'Upgrade'}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
    </section>
  )
}
