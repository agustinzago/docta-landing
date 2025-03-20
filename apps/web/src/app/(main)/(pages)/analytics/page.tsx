"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Calendar,
  Download,
  LineChart,
  PieChart,
  Sliders,
  Filter,
  PanelLeft,
  RefreshCw,
  Clock,
  Zap,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState("30d");
  const [showFilters, setShowFilters] = useState(false);

  // Simulated data for the analytics
  const performanceMetrics = [
    { name: "Successful Workflows", value: 842, change: +15.3, icon: TrendingUp },
    { name: "Failed Workflows", value: 38, change: -8.5, icon: TrendingDown },
    { name: "Avg. Execution Time", value: "1.2s", change: -24.0, icon: Clock },
    { name: "Automations Triggered", value: 1283, change: +32.7, icon: Zap },
  ];

  const serviceUsageData = [
    { name: "Google Drive", usage: 84, color: "bg-blue-500" },
    { name: "Notion", usage: 67, color: "bg-slate-800" },
    { name: "Slack", usage: 52, color: "bg-purple-500" },
    { name: "Discord", usage: 38, color: "bg-indigo-500" },
    { name: "Email", usage: 29, color: "bg-green-500" },
  ];

  const dailyExecutions = [
    { day: "Mon", count: 145 },
    { day: "Tue", count: 240 },
    { day: "Wed", count: 198 },
    { day: "Thu", count: 275 },
    { day: "Fri", count: 215 },
    { day: "Sat", count: 85 },
    { day: "Sun", count: 62 },
  ];

  const maxExecutions = Math.max(...dailyExecutions.map(d => d.count));

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Header */}
      <div className="sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Monitor your workflow performance and usage</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="flex space-x-1 rounded-md border p-1 bg-background">
              <Button
                variant={dateRange === "7d" ? "default" : "ghost"}
                size="sm"
                onClick={() => setDateRange("7d")}
              >
                7D
              </Button>
              <Button
                variant={dateRange === "30d" ? "default" : "ghost"}
                size="sm"
                onClick={() => setDateRange("30d")}
              >
                30D
              </Button>
              <Button
                variant={dateRange === "90d" ? "default" : "ghost"}
                size="sm"
                onClick={() => setDateRange("90d")}
              >
                90D
              </Button>
              <Button
                variant={dateRange === "1y" ? "default" : "ghost"}
                size="sm"
                onClick={() => setDateRange("1y")}
              >
                1Y
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
                {showFilters ? <PanelLeft className="h-4 w-4" /> : <Sliders className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6">
        {/* Filters Panel - Conditionally rendered */}
        {showFilters && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-sm font-medium">Workflow Tags</label>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="bg-blue-50">Email</Button>
                    <Button variant="outline" size="sm">Documents</Button>
                    <Button variant="outline" size="sm">Marketing</Button>
                    <Button variant="outline" size="sm">Data</Button>
                    <Button variant="outline" size="sm">+ Add</Button>
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-sm font-medium">Services</label>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="bg-blue-50">Google</Button>
                    <Button variant="outline" size="sm">Slack</Button>
                    <Button variant="outline" size="sm">Notion</Button>
                    <Button variant="outline" size="sm">Discord</Button>
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-sm font-medium">Status</label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="bg-green-50">Success</Button>
                    <Button variant="outline" size="sm">Failed</Button>
                    <Button variant="outline" size="sm">Running</Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button variant="outline" size="sm" className="mr-2">Reset</Button>
                <Button size="sm">Apply Filters</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {performanceMetrics.map((metric, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.name}</p>
                    <p className="text-3xl font-bold mt-1">{metric.value}</p>
                  </div>
                  <div className={`p-2 rounded-full ${metric.change > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    <metric.icon className={`h-5 w-5 ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  {metric.change > 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span 
                    className={`text-sm font-medium ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {Math.abs(metric.change)}% {metric.change > 0 ? 'increase' : 'decrease'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Analytics View */}
        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Chart */}
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Workflow Executions</span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-1" /> Filter
                      </Button>
                      <Button variant="outline" size="sm">
                        <LineChart className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>Daily workflow executions over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[320px] flex items-end justify-between pt-6">
                    {dailyExecutions.map((day, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 w-full">
                        <div 
                          className="bg-blue-500 rounded-t-md w-2/3" 
                          style={{ height: `${(day.count / maxExecutions) * 240}px` }}
                        ></div>
                        <span className="text-xs font-medium text-muted-foreground">{day.day}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Service Usage */}
              <Card>
                <CardHeader>
                  <CardTitle>Service Usage</CardTitle>
                  <CardDescription>Integration activity by service</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {serviceUsageData.map((service, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{service.name}</span>
                          <span className="text-sm text-muted-foreground">{service.usage}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${service.color}`} 
                            style={{ width: `${service.usage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center mt-8">
                    <div className="h-[160px] w-[160px] rounded-full border-8 border-[#f1f5f9] relative flex items-center justify-center">
                      <div className="absolute inset-0 overflow-hidden rounded-full">
                        <div className="absolute top-0 left-0 w-1/2 h-full bg-blue-500"></div>
                        <div 
                          className="absolute top-0 right-0 w-1/2 h-1/2 origin-bottom-left rotate-45 bg-slate-800"
                          style={{ transform: 'translate(25%, -10%) rotate(45deg)' }}
                        ></div>
                        <div 
                          className="absolute bottom-0 left-0 w-1/3 h-1/3 origin-top-right bg-purple-500"
                          style={{ transform: 'translate(0%, 50%)' }}
                        ></div>
                      </div>
                      <div className="bg-white rounded-full h-[100px] w-[100px] flex items-center justify-center z-10">
                        <PieChart className="h-6 w-6 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="workflows">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Performance</CardTitle>
                <CardDescription>Success rates and execution times by workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs uppercase bg-secondary/50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left">Workflow</th>
                        <th scope="col" className="px-6 py-3 text-left">Executions</th>
                        <th scope="col" className="px-6 py-3 text-left">Success Rate</th>
                        <th scope="col" className="px-6 py-3 text-left">Avg Time</th>
                        <th scope="col" className="px-6 py-3 text-left">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-secondary/20">
                        <td className="px-6 py-4 font-medium">Email Automation</td>
                        <td className="px-6 py-4">423</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Progress value={98} variant="success" className="h-2 w-24" />
                            <span>98%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">0.8s</td>
                        <td className="px-6 py-4 text-green-600">↑ 5%</td>
                      </tr>
                      <tr className="border-b hover:bg-secondary/20">
                        <td className="px-6 py-4 font-medium">Data Sync</td>
                        <td className="px-6 py-4">287</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Progress value={92} variant="success" className="h-2 w-24" />
                            <span>92%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">2.3s</td>
                        <td className="px-6 py-4 text-red-600">↓ 2%</td>
                      </tr>
                      <tr className="border-b hover:bg-secondary/20">
                        <td className="px-6 py-4 font-medium">Notification Service</td>
                        <td className="px-6 py-4">912</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Progress value={99.5} variant="success" className="h-2 w-24" />
                            <span>99.5%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">0.4s</td>
                        <td className="px-6 py-4 text-green-600">↑ 12%</td>
                      </tr>
                      <tr className="border-b hover:bg-secondary/20">
                        <td className="px-6 py-4 font-medium">File Processor</td>
                        <td className="px-6 py-4">156</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Progress value={78} variant="error" className="h-2 w-24" />
                            <span>78%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">5.1s</td>
                        <td className="px-6 py-4 text-red-600">↓ 8%</td>
                      </tr>
                      <tr className="hover:bg-secondary/20">
                        <td className="px-6 py-4 font-medium">Customer Reports</td>
                        <td className="px-6 py-4">89</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Progress value={94} variant="success" className="h-2 w-24" />
                            <span>94%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">3.2s</td>
                        <td className="px-6 py-4 text-green-600">↑ 3%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="services">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Usage</CardTitle>
                  <CardDescription>API calls by integration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-secondary/20 rounded-md">
                    <p className="text-muted-foreground">API usage chart goes here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Service Health</CardTitle>
                  <CardDescription>Integration uptime and performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          Google Drive API
                        </span>
                        <span className="text-green-600 font-medium">99.98% Uptime</span>
                      </div>
                      <Progress value={99.98} variant="success" className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          Slack API
                        </span>
                        <span className="text-green-600 font-medium">100% Uptime</span>
                      </div>
                      <Progress value={100} variant="success" className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          Notion API
                        </span>
                        <span className="text-green-600 font-medium">99.7% Uptime</span>
                      </div>
                      <Progress value={99.7} variant="success" className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                          Discord API
                        </span>
                        <span className="text-yellow-600 font-medium">97.2% Uptime</span>
                      </div>
                      <Progress value={97.2} variant="default" className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                          Email Service
                        </span>
                        <span className="text-red-600 font-medium">92.4% Uptime</span>
                      </div>
                      <Progress value={92.4} variant="error" className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>Recent user interactions with the platform</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">User activity content would be shown here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Upcoming Events Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Scheduled workflows and automations</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" /> View Calendar
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg border bg-secondary/20">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Weekly Analytics Report</p>
                    <p className="text-sm text-muted-foreground">Monday, 8:00 AM</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600">Scheduled</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Monthly Data Backup</p>
                    <p className="text-sm text-muted-foreground">March 31, 12:00 AM</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600">Scheduled</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Quarterly Performance Review</p>
                    <p className="text-sm text-muted-foreground">April 15, 10:00 AM</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600">Scheduled</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;