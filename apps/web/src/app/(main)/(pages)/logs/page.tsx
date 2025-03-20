"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type LogLevel = "info" | "error" | "warning" | "success";

interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
  details: string;
  workflow?: string;
}

const LogsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("24h");
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Simulated log data
  const logs: LogEntry[] = [
    {
      id: "log-1",
      timestamp: "2025-03-16T10:45:23Z",
      level: "error",
      source: "workflow-engine",
      message: "Failed to execute workflow 'Email Campaign'",
      details: "Error connecting to SMTP server. Timeout after 30 seconds. Check your network connection and SMTP server configuration. The workflow has been paused and will retry in 15 minutes.",
      workflow: "Email Campaign"
    },
    {
      id: "log-2",
      timestamp: "2025-03-16T10:42:15Z",
      level: "info",
      source: "auth-service",
      message: "User authentication successful",
      details: "User authenticated via Google OAuth. Session created with expiration in 24 hours. User permissions verified and access granted to requested resources."
    },
    {
      id: "log-3",
      timestamp: "2025-03-16T10:38:05Z",
      level: "success",
      source: "workflow-engine",
      message: "Workflow 'Data Sync' completed successfully",
      details: "All 342 records processed successfully. Sync completed in 4.2 seconds. Next scheduled run: 2025-03-16T22:00:00Z",
      workflow: "Data Sync"
    },
    {
      id: "log-4",
      timestamp: "2025-03-16T10:35:47Z",
      level: "warning",
      source: "api-gateway",
      message: "Rate limit approaching for Google Drive API",
      details: "Current usage: 85% of allocated quota. Consider implementing throttling or requesting a quota increase to prevent service disruption."
    },
    {
      id: "log-5",
      timestamp: "2025-03-16T10:30:12Z",
      level: "info",
      source: "system",
      message: "System health check completed",
      details: "All services operational. CPU usage: 42%, Memory usage: 65%, Disk space: 78% used. No anomalies detected."
    },
    {
      id: "log-6",
      timestamp: "2025-03-16T10:26:53Z",
      level: "success",
      source: "notification-service",
      message: "Push notification delivered to all devices",
      details: "Notification ID: PUSH-2025-03-16-001. Delivered to 128 devices. Read receipt received from 42 devices.",
      workflow: "User Notifications"
    },
    {
      id: "log-7",
      timestamp: "2025-03-16T10:15:22Z",
      level: "error",
      source: "database",
      message: "Database connection pool exhausted",
      details: "All 100 connections in use. Consider increasing max connections or implementing better connection management. Transactions are being queued which may impact performance."
    },
    {
      id: "log-8",
      timestamp: "2025-03-16T10:10:05Z",
      level: "warning",
      source: "workflow-engine",
      message: "Workflow 'Customer Report' execution time exceeds threshold",
      details: "Execution took 4.5 seconds, threshold is 3.0 seconds. Consider optimizing the database queries or increasing the threshold if this is expected behavior.",
      workflow: "Customer Report"
    },
    {
      id: "log-9",
      timestamp: "2025-03-16T10:05:39Z",
      level: "info",
      source: "cron-service",
      message: "Scheduled job 'Daily Backup' triggered",
      details: "Job ID: CRON-2025-03-16-005. Expected completion time: 10:15 UTC. Previous execution completed successfully."
    },
    {
      id: "log-10",
      timestamp: "2025-03-16T10:01:14Z",
      level: "success",
      source: "api-gateway",
      message: "API endpoint 'users/preferences' updated successfully",
      details: "New endpoint version deployed: v2.3.0. Backward compatibility maintained. Documentation updated."
    }
  ];

  // Filter logs based on search and filters
  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === "" || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesLevel = selectedLevel === "all" || log.level === selectedLevel;
    const matchesSource = selectedSource === "all" || log.source === selectedSource;
    
    return matchesSearch && matchesLevel && matchesSource;
  });

  // Get unique sources for the filter dropdown
  const sources = Array.from(new Set(logs.map(log => log.source)));

  // Toggle log details expansion
  const toggleLogDetails = (logId: string) => {
    if (expandedLogId === logId) {
      setExpandedLogId(null);
    } else {
      setExpandedLogId(logId);
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  // Get badge color and icon based on log level
  const getLevelBadge = (level: LogLevel) => {
    switch (level) {
      case "error":
        return { 
          color: "bg-red-100 text-red-800 hover:bg-red-200", 
          icon: <XCircle className="h-4 w-4 mr-1 text-red-800" /> 
        };
      case "warning":
        return { 
          color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200", 
          icon: <AlertTriangle className="h-4 w-4 mr-1 text-yellow-800" /> 
        };
      case "success":
        return { 
          color: "bg-green-100 text-green-800 hover:bg-green-200", 
          icon: <CheckCircle className="h-4 w-4 mr-1 text-green-800" /> 
        };
      default:
        return { 
          color: "bg-blue-100 text-blue-800 hover:bg-blue-200", 
          icon: <Info className="h-4 w-4 mr-1 text-blue-800" /> 
        };
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Header */}
      <div className="sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg border-b">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">System Logs</h1>
            <p className="text-muted-foreground">Monitor application events and errors</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-1" /> Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex flex-1 gap-4">
                <div className="w-full md:w-1/3">
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full md:w-1/3">
                  <Select value={selectedSource} onValueChange={setSelectedSource}>
                    <SelectTrigger>
                      <SelectValue placeholder="Source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      {sources.map((source, index) => (
                        <SelectItem key={index} value={source}>{source}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full md:w-1/3">
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Time Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">Last Hour</SelectItem>
                      <SelectItem value="24h">Last 24 Hours</SelectItem>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Filter className="h-4 w-4 mr-1" /> 
                Showing {filteredLogs.length} of {logs.length} logs
              </div>
              
              <Button variant="outline" size="sm" onClick={() => {
                setSearchTerm("");
                setSelectedLevel("all");
                setSelectedSource("all");
                setTimeRange("24h");
              }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Event Log</span>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>All times are in UTC</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Timestamp</TableHead>
                    <TableHead className="w-[100px]">Level</TableHead>
                    <TableHead className="w-[150px]">Source</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead className="w-[80px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <React.Fragment key={log.id}>
                      <TableRow className="group hover:bg-muted/50">
                        <TableCell className="font-mono text-xs">
                          {formatTimestamp(log.timestamp)}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`flex items-center w-fit ${getLevelBadge(log.level).color}`}
                          >
                            {getLevelBadge(log.level).icon}
                            {log.level}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.source}</TableCell>
                        <TableCell className="max-w-md truncate">
                          {log.workflow && (
                            <span className="font-semibold text-primary mr-1">[{log.workflow}]</span>
                          )}
                          {log.message}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleLogDetails(log.id)}
                          >
                            {expandedLogId === log.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>

                      {/* Expanded details */}
                      {expandedLogId === log.id && (
                        <TableRow>
                          <TableCell colSpan={5} className="bg-muted/30 p-4">
                            <div className="text-sm space-y-2">
                              <div className="font-medium">Details:</div>
                              <div className="bg-background p-3 rounded-md whitespace-pre-wrap">{log.details}</div>
                              
                              <div className="pt-2 flex flex-wrap gap-4">
                                <div>
                                  <span className="font-semibold mr-1">Log ID:</span>
                                  <code className="text-xs bg-muted px-1 py-0.5 rounded">{log.id}</code>
                                </div>
                                
                                {log.workflow && (
                                  <div>
                                    <span className="font-semibold mr-1">Workflow:</span>
                                    <span>{log.workflow}</span>
                                  </div>
                                )}
                                
                                <div>
                                  <span className="font-semibold mr-1">Source:</span>
                                  <span>{log.source}</span>
                                </div>
                              </div>
                              
                              <div className="flex justify-end">
                                <Button variant="outline" size="sm">
                                  Copy Details
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}

                  {filteredLogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No logs found matching your filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {filteredLogs.length > 0 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Log Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Error Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Gateway</span>
                    <span className="text-sm text-muted-foreground">3 errors</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-full w-[45%] rounded-full bg-red-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <span className="text-sm text-muted-foreground">2 errors</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-full w-[30%] rounded-full bg-red-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Workflow Engine</span>
                    <span className="text-sm text-muted-foreground">1 error</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-full w-[15%] rounded-full bg-red-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Log Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[150px] w-full flex items-end justify-between">
                {["12AM", "4AM", "8AM", "12PM", "4PM", "8PM"].map((hour, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div 
                      className={`w-8 rounded-t-sm ${
                        i === 4 ? "bg-primary h-28" : 
                        i === 3 ? "bg-primary h-24" : 
                        i === 2 ? "bg-primary h-16" : 
                        i === 5 ? "bg-primary h-12" : "bg-primary h-8"
                      }`} 
                    />
                    <span className="text-xs text-muted-foreground">{hour}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Log Level Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div className="flex flex-col gap-4 mt-2">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 bg-green-500 rounded-full" />
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm">Success</span>
                      <span className="text-sm font-medium">30%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 bg-blue-500 rounded-full" />
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm">Info</span>
                      <span className="text-sm font-medium">40%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 bg-yellow-500 rounded-full" />
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm">Warning</span>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 bg-red-500 rounded-full" />
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm">Error</span>
                      <span className="text-sm font-medium">10%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LogsPage;