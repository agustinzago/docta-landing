import { CONNECTIONS } from '@/lib/constant'
import ConnectionCard from './_components/connection-card'
import { onDiscordConnect } from './_actions/discord-connection'
import { onSlackConnect } from './_actions/slack-connection'
import { getUserData } from './_actions/get-user'
import { onNotionConnect } from './_actions/notion-connection'
import { Button } from '@/components/ui/button'
import { Plus, RefreshCw, Shield } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConnectionTypes } from '@/types'
import { currentUser } from '@clerk/nextjs/server'

type Props = {
  searchParams?: { [key: string]: string | undefined }
}

const Connections = async (props: Props) => {
  const {
    webhook_id,
    webhook_name,
    webhook_url,
    guild_id,
    guild_name,
    channel_id,
    access_token,
    workspace_name,
    workspace_icon,
    workspace_id,
    database_id,
    app_id,
    authed_user_id,
    authed_user_token,
    slack_access_token,
    bot_user_id,
    team_id,
    team_name,
  } = props.searchParams ?? {
    webhook_id: '',
    webhook_name: '',
    webhook_url: '',
    guild_id: '',
    guild_name: '',
    channel_id: '',
    access_token: '',
    workspace_name: '',
    workspace_icon: '',
    workspace_id: '',
    database_id: '',
    app_id: '',
    authed_user_id: '',
    authed_user_token: '',
    slack_access_token: '',
    bot_user_id: '',
    team_id: '',
    team_name: '',
  }

  const user = await currentUser()
  if (!user) return null

  const onUserConnections = async () => {
    console.log(database_id)
    await onDiscordConnect(
      channel_id!,
      webhook_id!,
      webhook_name!,
      webhook_url!,
      user.id,
      guild_name!,
      guild_id!
    )
    await onNotionConnect(
      access_token!,
      workspace_id!,
      workspace_icon!,
      workspace_name!,
      database_id!,
      user.id
    )

    await onSlackConnect(
      app_id!,
      authed_user_id!,
      authed_user_token!,
      slack_access_token!,
      bot_user_id!,
      team_id!,
      team_name!,
      user.id
    )

    const connections: Record<ConnectionTypes, boolean> = {} as Record<ConnectionTypes, boolean>;

    const user_info = await getUserData(user.id)

    //get user info with all connections
user_info?.connections.forEach((connection) => {
  connections[connection.type as ConnectionTypes] = true
})

    // Google Drive connection will always be true
    // as it is given access during the login process
    return { ...connections, 'Google Drive': true }
  }

  const connections = await onUserConnections()

  // Group connections by category
  const productivityConnections = CONNECTIONS.filter(conn => 
    ['Google Drive', 'Notion', 'Trello'].includes(conn.title)
  );
  
  const communicationConnections = CONNECTIONS.filter(conn => 
    ['Discord', 'Slack'].includes(conn.title)
  );

  // Count connected apps
  const connectedCount = Object.values(connections).filter(Boolean).length;
  const totalCount = CONNECTIONS.length;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg border-b">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Connections</h1>
            <p className="text-muted-foreground">Connect your apps to create powerful automations</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh All
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" /> Add Connection
            </Button>
          </div>
        </div>
      </div>
      
      {/* Connection Status Overview */}
      <div className="p-6 border-b">
        <div className="flex flex-col md:flex-row gap-6 justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-medium">Connection Status</h2>
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500"
                  style={{ width: `${(connectedCount / totalCount) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium">{connectedCount}/{totalCount}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
            <Shield className="h-5 w-5 text-blue-500" />
            <p className="text-sm text-blue-800 dark:text-blue-400">
              Connections are securely stored with end-to-end encryption
            </p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="p-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Connections</TabsTrigger>
            <TabsTrigger value="productivity">Productivity</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="connected">Connected ({connectedCount})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            <div className="grid gap-4">
              {CONNECTIONS.map((connection) => (
                <ConnectionCard
                  key={connection.title}
                  description={connection.description}
                  title={connection.title}
                  icon={connection.image}
                  type={connection.title}
                  connected={connections}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="productivity" className="space-y-6">
            <div className="grid gap-4">
              {productivityConnections.map((connection) => (
                <ConnectionCard
                  key={connection.title}
                  description={connection.description}
                  title={connection.title}
                  icon={connection.image}
                  type={connection.title}
                  connected={connections}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="communication" className="space-y-6">
            <div className="grid gap-4">
              {communicationConnections.map((connection) => (
                <ConnectionCard
                  key={connection.title}
                  description={connection.description}
                  title={connection.title}
                  icon={connection.image}
                  type={connection.title}
                  connected={connections}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="connected" className="space-y-6">
            <div className="grid gap-4">
              {CONNECTIONS.filter(conn => connections[conn.title]).map((connection) => (
                <ConnectionCard
                  key={connection.title}
                  description={connection.description}
                  title={connection.title}
                  icon={connection.image}
                  type={connection.title}
                  connected={connections}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Documentation link */}
        <div className="mt-8 p-4 bg-muted/30 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            Need help connecting your apps?{" "}
            <a href="/docs/connections" className="text-primary font-medium hover:underline">
              View the connection guide
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Connections
