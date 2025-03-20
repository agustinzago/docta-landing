'use client'
import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { onFlowPublish } from '../_actions/workflow-connections'
import { Calendar, MoreHorizontal, ArrowRight, Clock, Edit3, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Props = {
  name: string
  description: string
  id: string
  publish: boolean | null
  createdAt?: string // Optional props for additional info
  lastRun?: string
  runCount?: number
}

const Workflow = ({ description, id, name, publish, createdAt, lastRun, runCount }: Props) => {
  const [isPublished, setIsPublished] = useState(publish);
  const [isLoading, setIsLoading] = useState(false);
  
  const onPublishFlow = async (checked: boolean) => {
    setIsLoading(true);
    
    try {
      const response = await onFlowPublish(id, checked);
      if (response) toast.message(response);
      setIsPublished(checked);
    } catch {
      toast.error("Failed to update workflow status");
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <Card className="transition-all duration-200 hover:shadow-md overflow-hidden flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant={isPublished ? "default" : "outline"} className={isPublished ? "bg-green-600 text-white" : "text-muted-foreground"}>
            {isPublished ? "Active" : "Draft"}
          </Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Edit3 className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ExternalLink className="mr-2 h-4 w-4" /> View Logs
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <CardTitle className="text-lg">
          <Link href={`/workflows/editor/${id}`} className="hover:text-primary transition-colors">
            {name}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex -space-x-2">
            <div className="bg-blue-100 rounded-full p-1.5 border-2 border-background z-30">
              <Image
                src="/googleDrive.png"
                alt="Google Drive"
                height={20}
                width={20}
                className="object-contain"
              />
            </div>
            <div className="bg-slate-100 rounded-full p-1.5 border-2 border-background z-20">
              <Image
                src="/notion.png"
                alt="Notion"
                height={20}
                width={20}
                className="object-contain"
              />
            </div>
            <div className="bg-indigo-100 rounded-full p-1.5 border-2 border-background z-10">
              <Image
                src="/discord.png"
                alt="Discord"
                height={20}
                width={20}
                className="object-contain"
              />
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" /> 
          Last run: {lastRun || "Never"} 
          {runCount && <span className="ml-2">({runCount} executions)</span>}
        </div>
      </CardContent>
      
      <CardFooter className="pt-4 mt-auto flex items-center justify-between border-t">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          Created {createdAt || "Recently"}
        </div>
        
        <div className="flex items-center gap-2">
          <Label htmlFor={`workflow-${id}`} className="text-xs text-muted-foreground sr-only">
            {isPublished ? 'Active' : 'Disabled'}
          </Label>
          <div className="flex items-center space-x-2">
            <Label htmlFor={`workflow-${id}`} className="text-xs text-muted-foreground">
              {isPublished ? 'On' : 'Off'}
            </Label>
            <Switch
              id={`workflow-${id}`}
              checked={isPublished || false}
              onCheckedChange={onPublishFlow}
              disabled={isLoading}
              aria-label="Toggle workflow status"
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default Workflow
