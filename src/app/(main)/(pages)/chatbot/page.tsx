"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Bot,
  BookOpen,
  Building,
  Calendar,
  ClipboardList,
  Copy,
  Database,
  FileText,
  Folders,
  HelpCircle,
  Info,
  Laptop,
  Loader2,
  MessageSquare,
  Mic,
  Users,
  PanelLeft,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  ThumbsUp,
  ThumbsDown,
  Trash,
  User
} from "lucide-react";

// Mock data for conversation history focused on onboarding
const initialMessages = [
  {
    id: '1',
    content: "👋 Hey there! I'm your Onboarding Assistant. I'm here to help you get settled in your new role. You can ask me anything about company policies, your team, tools, or resources you need access to.",
    role: "bot",
    timestamp: new Date(Date.now() - 60000).toISOString(),
  }
];

// Knowledge bases for context
const knowledgeBases = [
  { name: "Company Handbook", id: "handbook", connected: true },
  { name: "HR Policies", id: "hr", connected: true },
  { name: "IT Documentation", id: "it", connected: true },
  { name: "Team Wiki", id: "team", connected: true },
  { name: "Product Documentation", id: "product", connected: false },
  { name: "Training Materials", id: "training", connected: true },
];

// Company-specific information categories
const infoCategories = [
  { name: "Getting Started", icon: <ClipboardList className="h-4 w-4" /> },
  { name: "HR & Benefits", icon: <Users className="h-4 w-4" /> },
  { name: "Tools & Systems", icon: <Laptop className="h-4 w-4" /> },
  { name: "Company Structure", icon: <Building className="h-4 w-4" /> },
  { name: "Policies", icon: <FileText className="h-4 w-4" /> },
  { name: "Resources", icon: <Folders className="h-4 w-4" /> },
];

// Suggested onboarding questions
const suggestedPrompts = [
  "What's the process for requesting IT equipment?",
  "How do I set up my benefits and payroll?",
  "Who should I contact about training for my role?",
  "What are the company's core values?",
  "What tools will I need for my position?",
  "How does the performance review process work?",
  "What's the vacation policy?",
  "How do I access the team's shared resources?"
];

// Important links for quick access
const quickLinks = [
  { name: "Employee Portal", url: "/employee-portal", icon: <User className="h-4 w-4" /> },
  { name: "IT Help Desk", url: "/help-desk", icon: <HelpCircle className="h-4 w-4" /> },
  { name: "Company Calendar", url: "/calendar", icon: <Calendar className="h-4 w-4" /> },
  { name: "Training Center", url: "/training", icon: <BookOpen className="h-4 w-4" /> },
];

const OnboardingChatbot = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("developer");
  const [selectedDepartment, setSelectedDepartment] = useState("engineering");
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "" || isLoading) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate bot response after delay with onboarding-focused content
    setTimeout(() => {
      // Generate contextual responses based on the user's query
      let botResponse = "";
      const query = input.toLowerCase();
      
      if (query.includes("it equipment") || query.includes("laptop") || query.includes("computer")) {
        botResponse = "To request IT equipment, you'll need to:\n\n1. Log into the Employee Portal\n2. Navigate to 'IT Requests'\n3. Fill out the Equipment Request form\n4. Your manager will receive a notification to approve\n\nTypically, new equipment is ready within 2-3 business days. If you need something urgently, reach out to the IT Help Desk at extension 4567.";
      } 
      else if (query.includes("benefits") || query.includes("payroll") || query.includes("salary")) {
        botResponse = "For benefits and payroll setup:\n\n1. Complete your onboarding paperwork (check your email from HR)\n2. Set up direct deposit in the Employee Portal > Payroll section\n3. Select your benefits package by the end of your first month\n\nThe HR team holds benefits orientation every Tuesday at 10am. Check your calendar for the invite. If you have specific questions about your benefits options, Sarah from HR (sarah@company.com) is your point of contact.";
      }
      else if (query.includes("training") || query.includes("learning")) {
        botResponse = `Great question about training for your ${selectedRole} role in the ${selectedDepartment} department! Here's what you should know:\n\n1. Required trainings are already assigned in your Learning Dashboard\n2. Technical training is coordinated by your team lead, Alex\n3. For additional skill development, explore the Training Center\n\nYour onboarding buddy, Michael, can help guide you through any department-specific resources as well.`;
      }
      else if (query.includes("vacation") || query.includes("time off") || query.includes("pto")) {
        botResponse = "Our vacation policy provides:\n\n• 15 days of PTO annually, accrued monthly\n• 10 paid holidays\n• 5 sick days\n• Optional purchase of 5 additional vacation days each year\n\nTo request time off:\n1. Go to the Employee Portal > Time Off\n2. Submit your request at least 2 weeks in advance for vacation\n3. Your manager will review and approve\n\nRefer to the Employee Handbook section 5.2 for complete details.";
      }
      else {
        botResponse = `Based on your role as a ${selectedRole} in the ${selectedDepartment} department, let me help answer your question about "${input}".\n\nI've searched our company knowledge base and found some relevant information. The best resource would be in our ${knowledgeBases[Math.floor(Math.random() * 3)].name}.\n\nWould you like me to connect you with someone specific who could provide more detailed information about this topic? Your department lead, Jamie Chen, or your HR representative, Taylor Williams, would be good contacts for this question.`;
      }
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        role: "bot",
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleClearChat = () => {
    setMessages(initialMessages);
  };

  const handleUsePrompt = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg border-b">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">Onboarding Assistant</h1>
            <p className="text-muted-foreground">Your guide to getting started and finding what you need</p>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setShowSidebar(!showSidebar)}>
                    <PanelLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle resources panel</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => {}}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh knowledge base</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleClearChat}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear conversation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button>
              <Plus className="h-4 w-4 mr-2" /> New Conversation
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Resource Sidebar - New Employee Context */}
        {showSidebar && (
          <div className="w-72 border-r overflow-y-auto p-4 flex flex-col space-y-6">
            {/* Profile Section */}
            <div className="pb-4 border-b">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>JD</AvatarFallback>
                  <AvatarImage src="/assets/user-avatar.png" />
                </Avatar>
                <div>
                  <p className="font-medium">Jane Doe</p>
                  <p className="text-xs text-muted-foreground">Day 5 at Company Name</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="text-xs border rounded-lg p-2">
                  <div className="text-muted-foreground mb-1">Your Role</div>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="bg-transparent border-none p-0 h-auto text-xs">
                      <SelectValue placeholder="Select role"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="developer">Software Developer</SelectItem>
                      <SelectItem value="designer">UX Designer</SelectItem>
                      <SelectItem value="manager">Product Manager</SelectItem>
                      <SelectItem value="marketing">Marketing Specialist</SelectItem>
                      <SelectItem value="sales">Sales Representative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-xs border rounded-lg p-2">
                  <div className="text-muted-foreground mb-1">Department</div>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="bg-transparent border-none p-0 h-auto text-xs">
                      <SelectValue placeholder="Select dept"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Onboarding Progress */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Your Onboarding</h3>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  55% Complete
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center">
                    <ThumbsUp className="h-3 w-3 text-green-500" />
                  </div>
                  <p className="text-sm line-through text-muted-foreground">Complete HR paperwork</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center">
                    <ThumbsUp className="h-3 w-3 text-green-500" />
                  </div>
                  <p className="text-sm line-through text-muted-foreground">Set up workstation</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center">
                    <ThumbsUp className="h-3 w-3 text-green-500" />
                  </div>
                  <p className="text-sm line-through text-muted-foreground">Complete security training</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-muted border-muted border flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground"></div>
                  </div>
                  <p className="text-sm">Meet with your team (Scheduled tomorrow)</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-muted border-muted border flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground"></div>
                  </div>
                  <p className="text-sm">Complete role-specific training</p>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="w-full mt-3">
                View all tasks
              </Button>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="font-medium mb-3">Quick Links</h3>
              <div className="grid grid-cols-2 gap-2">
                {quickLinks.map((link, i) => (
                  <Button 
                    key={i} 
                    variant="outline" 
                    size="sm" 
                    className="justify-start w-full"
                    asChild
                  >
                    <a href={link.url}>
                      <span className="mr-2">{link.icon}</span>
                      <span className="text-xs">{link.name}</span>
                    </a>
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Search Knowledge Base */}
            <div>
              <h3 className="font-medium mb-3">Search Resources</h3>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text"
                  placeholder="Search company resources..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-md border bg-background text-sm"
                />
              </div>
            </div>
            
            {/* Information Categories */}
            <div className="flex-1">
              <h3 className="font-medium mb-3">Information Categories</h3>
              <div className="space-y-1">
                {infoCategories.map((category, i) => (
                  <Button 
                    key={i} 
                    variant="ghost" 
                    className="w-full justify-start font-normal h-auto py-2"
                  >
                    <div className="mr-2">{category.icon}</div>
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Knowledge Base Status */}
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Connected Sources</h3>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                  <Settings className="h-3 w-3 mr-1" /> Manage
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {knowledgeBases.filter(kb => kb.connected).slice(0, 3).map((kb, i) => (
                  <Badge key={i} variant="outline" className="bg-background">
                    <Database className="h-3 w-3 mr-1 text-primary" /> {kb.name}
                  </Badge>
                ))}
                {knowledgeBases.filter(kb => kb.connected).length > 3 && (
                  <Badge variant="outline" className="bg-background">
                    +{knowledgeBases.filter(kb => kb.connected).length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
                <Bot className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Welcome to your onboarding assistant!</h3>
                <p className="text-muted-foreground mb-6">
                  I am here to help you navigate your first weeks at the company. Ask me anything about your role, company policies, or where to find resources.
                </p>
                <div className="grid grid-cols-1 gap-2 w-full mb-4">
                  {suggestedPrompts.slice(0, 4).map((prompt, i) => (
                    <Button 
                      key={i} 
                      variant="outline" 
                      onClick={() => handleUsePrompt(prompt)}
                      className="justify-start text-left h-auto py-3"
                    >
                      <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                      <span className="truncate">{prompt}</span>
                    </Button>
                  ))}
                </div>
                <Card className="w-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <Info className="h-4 w-4 mr-2 text-blue-500" />
                      Todays Onboarding Tip
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>Schedule 1:1 meetings with your teammates to learn about their roles and how you will work together. This helps build relationships early!</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`flex max-w-[85%] ${
                        msg.role === "user" 
                          ? "flex-row-reverse" 
                          : "flex-row"
                      }`}
                    >
                      <div className={`flex-shrink-0 mt-1 ${msg.role === "user" ? "ml-3" : "mr-3"}`}>
                        {msg.role === "user" ? (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>JD</AvatarFallback>
                            <AvatarImage src="/assets/user-avatar.png" />
                          </Avatar>
                        ) : (
                          <Avatar className="h-8 w-8 bg-primary/10">
                            <AvatarFallback className="text-primary">AI</AvatarFallback>
                            <AvatarImage src="/assets/bot-avatar.png" />
                          </Avatar>
                        )}
                      </div>
                      
                      <div>
                        <div 
                          className={`p-3 rounded-lg ${
                            msg.role === "user" 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted"
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{msg.content}</div>
                        </div>
                        <div 
                          className={`text-xs text-muted-foreground mt-1 flex items-center ${
                            msg.role === "user" ? "justify-end" : ""
                          }`}
                        >
                          {formatTime(msg.timestamp)}
                          {msg.role === "bot" && (
                            <div className="flex items-center ml-2">
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <ThumbsUp className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <ThumbsDown className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex max-w-[80%]">
                      <div className="flex-shrink-0 mt-1 mr-3">
                        <Avatar className="h-8 w-8 bg-primary/10">
                          <AvatarFallback className="text-primary">AI</AvatarFallback>
                          <AvatarImage src="/assets/bot-avatar.png" />
                        </Avatar>
                      </div>
                      <div className="p-3 rounded-lg bg-muted">
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 bg-primary rounded-full animate-bounce" />
                          <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="relative">
                <Textarea 
                  ref={inputRef}
                  value={input} 
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about company policies, your role, or needed resources..."
                  className="min-h-[80px] pr-24 resize-none"
                  disabled={isLoading}
                />
                <div className="absolute bottom-2 right-2 flex items-center gap-1">
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="ghost" 
                    disabled={isLoading}
                    className="h-8 w-8"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={isLoading || input.trim() === ""}
                    className="h-8 w-8"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </form>

            {/* Suggested prompts */}
            {messages.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2">Suggested questions</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedPrompts.slice(4, 7).map((prompt, i) => (
                    <Button 
                      key={i} 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleUsePrompt(prompt)}
                      className="text-xs h-auto py-1"
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Source attribution */}
            <div className="mt-4 text-xs text-muted-foreground">
              <p>Answers are generated based on your company&apos;s official documentation, policies, and resources.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingChatbot;