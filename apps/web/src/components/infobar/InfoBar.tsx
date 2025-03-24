'use client'
import React, { useEffect } from 'react'
import { Book, Headphones, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useBilling } from '@/providers/billing-provider'
import { onPaymentDetails } from '@/app/(main)/(pages)/billing/_actions/payment-connections'


const InfoBar = () => {
  const { credits, tier, setCredits, setTier } = useBilling()

  const onGetPayment = async (): Promise<void> => {
    const response = await onPaymentDetails()
    if (response) {
      setTier(response.tier!)
      setCredits(response.credits!)
    }
  }

  useEffect(() => {
    onGetPayment()
  }, [])

  return (
    <div className="flex flex-row justify-end gap-6 items-center px-4 py-4 w-full dark:bg-black ">
<span className="flex items-center gap-2 font-bold">
  <p className="text-sm font-light text-gray-500">Credits</p>
  <span className="px-2 py-1 text-sm font-medium rounded-md bg-gray-100">
    {tier === "Unlimited" ? (
      <span className="text-green-600">Unlimited</span>
    ) : (
      <span>
        {credits}/
        <span className="text-gray-500">
          {tier === "Free" ? "10" : tier === "Pro" ? "100" : ""}
        </span>
      </span>
    )}
  </span>
</span>

      <span className="flex items-center rounded-full bg-muted px-4">
        <Search />
        <Input
          placeholder="Quick Search"
          className="border-none bg-transparent"
        />
      </span>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger>
            <Headphones />
          </TooltipTrigger>
          <TooltipContent>
            <p>Contact Support</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger>
            <Book />
          </TooltipTrigger>
          <TooltipContent>
            <p>Guide</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default InfoBar
