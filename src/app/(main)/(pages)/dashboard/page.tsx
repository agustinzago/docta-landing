"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Activity, 
  Zap, 
  BarChart3, 
  Clock, 
  CheckCircle 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Datos simulados para el dashboard
  const stats = [
    { title: "Total Workflows", value: "24", icon: Activity, change: "+12%", trend: "up" },
    { title: "Active Automations", value: "18", icon: Zap, change: "+5%", trend: "up" },
    { title: "Completed Tasks", value: "142", icon: CheckCircle, change: "+28%", trend: "up" },
    { title: "Time Saved", value: "32h", icon: Clock, change: "+15%", trend: "up" }
  ];

  const recentActivity = [
    { id: 1, action: "Automation triggered", workflow: "Email campaign", time: "10 mins ago" },
    { id: 2, action: "Workflow completed", workflow: "Data processing", time: "1 hour ago" },
    { id: 3, action: "New connection", workflow: "Google Drive", time: "3 hours ago" },
    { id: 4, action: "Automation failed", workflow: "Customer support", time: "Yesterday" }
  ];

  const upcomingTasks = [
    { id: 1, title: "Weekly report generation", due: "Today, 15:00", status: "Soon" },
    { id: 2, title: "Customer data sync", due: "Tomorrow, 08:00", status: "Scheduled" },
    { id: 3, title: "Email campaign", due: "Mar 18, 09:00", status: "Scheduled" }
  ];

  return (
    <div className="flex flex-col gap-6 relative pb-8">
      <div className="sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg border-b">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" /> Last 30 Days
            </Button>
            <Button>
              <Zap className="h-4 w-4 mr-2" /> New Workflow
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-full ${stat.trend === 'up' ? 'bg-green-100' : 'bg-red-100'}`}>
                    <stat.icon className={`h-5 w-5 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                </div>
                <div className="mt-4">
                  <p className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last month
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs 
          defaultValue="overview" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="mt-8"
        >
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    <span>Performance Overview</span>
                    <Button variant="ghost" size="sm">
                      <BarChart3 className="h-4 w-4 mr-1" /> View All
                    </Button>
                  </CardTitle>
                  <CardDescription>Workflow execution statistics for the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[240px] flex items-center justify-center bg-slate-50 rounded-md">
                    {/* Aquí iría un componente de gráfico real */}
                    <p className="text-muted-foreground">Chart visualization would be here</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Success Rate</span>
                        <span className="text-sm font-bold text-green-600">94%</span>
                      </div>
                      <Progress value={94} variant="success" className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Error Rate</span>
                        <span className="text-sm font-bold text-red-600">6%</span>
                      </div>
                      <Progress value={6} variant="error" className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Tasks</CardTitle>
                  <CardDescription>Scheduled workflows and automations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingTasks.map(task => (
                      <div key={task.id} className="flex items-start justify-between p-3 rounded-lg border">
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-muted-foreground">{task.due}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                          {task.status}
                        </span>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      <Calendar className="h-4 w-4 mr-2" /> View Calendar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions and events from your workflows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs uppercase bg-slate-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left">Action</th>
                        <th scope="col" className="px-6 py-3 text-left">Workflow</th>
                        <th scope="col" className="px-6 py-3 text-left">Time</th>
                        <th scope="col" className="px-6 py-3 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivity.map((activity) => (
                        <tr key={activity.id} className="border-b hover:bg-slate-50">
                          <td className="px-6 py-4">{activity.action}</td>
                          <td className="px-6 py-4">{activity.workflow}</td>
                          <td className="px-6 py-4 text-muted-foreground">{activity.time}</td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="sm">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflows">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center py-8 flex-col gap-4">
                  <div className="rounded-full bg-slate-100 p-4">
                    <Activity className="h-8 w-8 text-slate-600" />
                  </div>
                  <h3 className="text-lg font-medium">Your Workflows</h3>
                  <p className="text-center text-muted-foreground max-w-sm">
                    Create and manage your automated workflows to streamline your processes.
                  </p>
                  <Button>View Workflows</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="connections">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center py-8 flex-col gap-4">
                  <div className="rounded-full bg-slate-100 p-4">
                    <Users className="h-8 w-8 text-slate-600" />
                  </div>
                  <h3 className="text-lg font-medium">Your Connections</h3>
                  <p className="text-center text-muted-foreground max-w-sm">
                    Connect to third-party services and tools to extend your automation capabilities.
                  </p>
                  <Button>View Connections</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center py-8 flex-col gap-4">
                  <div className="rounded-full bg-slate-100 p-4">
                    <TrendingUp className="h-8 w-8 text-slate-600" />
                  </div>
                  <h3 className="text-lg font-medium">Performance Analytics</h3>
                  <p className="text-center text-muted-foreground max-w-sm">
                    Detailed insights and statistics about your automations and workflows.
                  </p>
                  <Button>View Analytics</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default DashboardPage;