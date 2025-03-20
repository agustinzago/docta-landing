import React from 'react';
import WorkflowButton from './_components/workflow-button';
import Workflows from './_components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Grid3X3, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Page = () => {
  return (
    <div className="flex flex-col relative">
      {/* Header with search and actions */}
      <div className="sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg border-b">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Workflows</h1>
            <WorkflowButton />
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search workflows..."
                className="pl-8"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" /> Filter
              </Button>
              <div className="flex border rounded-md overflow-hidden">
                <Button variant="ghost" size="sm" className="rounded-none border-r px-2">
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-none px-2">
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Tabs */}
      <div className="px-6 pt-4">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Workflows</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Workflows />
          </TabsContent>
          
          <TabsContent value="active">
            <Workflows filterStatus="active" />
          </TabsContent>
          
          <TabsContent value="draft">
            <Workflows filterStatus="draft" />
          </TabsContent>
          
          <TabsContent value="archived">
            <Workflows filterStatus="archived" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Page
