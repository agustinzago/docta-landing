import React from 'react';
import Workflow from './workflow';
import { onGetWorkflows } from '../_actions/workflow-connections';
import MoreCredits from './more-credits';
import { Bot } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface WorkflowsProps {
  filterStatus?: string;
}

const Workflows = async ({ filterStatus }: WorkflowsProps = {}) => {
  const workflows = await onGetWorkflows();
  
  // Apply filter if provided
  const filteredWorkflows = filterStatus 
    ? workflows?.filter(flow => {
        if (filterStatus === 'active') return flow.publish === true;
        if (filterStatus === 'draft') return flow.publish === false;
        // Add more filters as needed
        return true;
      })
    : workflows;
    
  return (
    <div className="relative flex flex-col gap-6 pb-6">
      <MoreCredits />
      
      {filteredWorkflows?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWorkflows.map((flow) => (
            <Workflow
              key={flow.id}
              {...flow}
            />
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center py-16 px-4 bg-muted/30">
          <Bot className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No Workflows Found</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Create your first workflow to automate tasks between your favorite applications.
          </p>
          <Button>Create Workflow</Button>
        </Card>
      )}
    </div>
  )
}

export default Workflows;
