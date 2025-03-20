'use client'

import React, { useState } from 'react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import Image from 'next/image'
import Link from 'next/link'
import { ConnectionTypes } from '@/types'
import { Check, Info, RefreshCw, Settings, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

type Props = {
  type: ConnectionTypes
  icon: string
  title: ConnectionTypes
  description: string
  callback?: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  connected: {} & any
}

const ConnectionCard = ({
  description,
  type,
  icon,
  title,
  connected,
}: Props) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const isConnected = connected[type];
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh operation
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
    // In a real scenario, you would reconnect/refresh the app connection here
  };
  
  // Get connection URL based on app type
  const getConnectionUrl = () => {
    if (title === 'Discord') return process.env.NEXT_PUBLIC_DISCORD_REDIRECT!;
    if (title === 'Notion') return process.env.NEXT_PUBLIC_NOTION_AUTH_URL!;
    if (title === 'Slack') return process.env.NEXT_PUBLIC_SLACK_REDIRECT!;
    return '#';
  };
  
  // Get additional info for each connection type
  const getConnectionInfo = () => {
    switch (title) {
      case 'Google Drive':
        return {
          permissions: ['Read files', 'Write files', 'Create folders'],
          lastSync: 'Today, 10:45 AM',
          status: 'Healthy'
        };
      case 'Discord':
        return {
          permissions: ['Read messages', 'Send messages', 'Manage webhooks'],
          lastSync: isConnected ? '2 days ago' : 'Never',
          status: isConnected ? 'Healthy' : 'Disconnected'
        };
      case 'Slack':
        return {
          permissions: ['Access channels', 'Send messages', 'Use bot features'],
          lastSync: isConnected ? 'Yesterday, 3:20 PM' : 'Never',
          status: isConnected ? 'Healthy' : 'Disconnected'
        };
      case 'Notion':
        return {
          permissions: ['Read content', 'Write content', 'Create pages'],
          lastSync: isConnected ? '3 days ago' : 'Never',
          status: isConnected ? 'Needs refresh' : 'Disconnected'
        };
      default:
        return {
          permissions: ['Read data', 'Write data'],
          lastSync: isConnected ? 'Recently' : 'Never',
          status: isConnected ? 'Healthy' : 'Disconnected'
        };
    }
  };
  
  const connectionInfo = getConnectionInfo();

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <CardHeader className="flex flex-row items-center gap-4 pb-2 md:pb-6">
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="bg-muted/30 p-2 rounded-lg">
                <Image
                  src={icon}
                  alt={title}
                  height={40}
                  width={40}
                  className="object-contain"
                />
              </div>
              {isConnected && (
                <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-background" />
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{title}</CardTitle>
              {connectionInfo.status === 'Needs refresh' && (
                <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50">
                  Needs refresh
                </Badge>
              )}
            </div>
            <CardDescription className="line-clamp-2">{description}</CardDescription>
          </div>
        </CardHeader>
        
        <div className="px-6 py-3 md:py-6 md:pr-6 flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Info className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-80">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-1">Status</h4>
                        <div className="flex items-center gap-2">
                          {connectionInfo.status === 'Healthy' ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none">
                              <Check className="h-3 w-3 mr-1" /> Healthy
                            </Badge>
                          ) : connectionInfo.status === 'Needs refresh' ? (
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-none">
                              <RefreshCw className="h-3 w-3 mr-1" /> Needs refresh
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-none">
                              <X className="h-3 w-3 mr-1" /> Disconnected
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-1">Permissions</h4>
                        <ul className="text-sm space-y-1">
                          {connectionInfo.permissions.map((perm, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <Check className="h-3 w-3 text-green-600" /> {perm}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {isConnected && (
                        <div className="text-sm text-muted-foreground">
                          Last synchronized: {connectionInfo.lastSync}
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </TooltipTrigger>
              <TooltipContent>
                <p>Connection details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {isConnected && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh connection</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {isConnected ? (
            <Button variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
              <Check className="mr-2 h-4 w-4" />
              Connected
            </Button>
          ) : (
            <Link href={getConnectionUrl()}>
              <Button>
                Connect
              </Button>
            </Link>
          )}
        </div>
      </div>

      {isConnected && (
        <CardFooter className="bg-muted/10 py-2 px-6 flex justify-between items-center border-t">
          <span className="text-xs text-muted-foreground">
            Connected {connectionInfo.lastSync !== 'Never' ? connectionInfo.lastSync : 'just now'}
          </span>
          <Button variant="ghost" size="sm" className="h-7">
            <Settings className="h-3 w-3 mr-1" /> Configure
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

export default ConnectionCard
