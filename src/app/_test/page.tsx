'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Upload, 
  Package, 
  Wrench, 
  Plus, 
  Trash2, 
  Edit3,
  ExternalLink, 
  FileText, 
  Users, 
  Copy,
  Check
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Skill {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

interface UploadedFile {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
}

interface Batch {
  id: number;
  name: string;
  skillIds: number[];
  fileIds: number[];
  createdAt: string;
}

interface Tool {
  id: number;
  name: string;
  description: string;
  skills: string[];
  files: string[];
  batches: string[];
}

interface Integration {
  id: number;
  toolId: number;
  platform: string;
  integratedAt: string;
  status: 'active' | 'draft';
}

const platforms = [
  { name: "Grok (xAI)", value: "grok" },
  { name: "Claude (Anthropic)", value: "claude" },
  { name: "Gemini (Google)", value: "gemini" },
  { name: "ChatGPT (OpenAI)", value: "openai" },
  { name: "Llama (Meta)", value: "llama" },
];

export default function SkillsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock Data - Added Rectangular Area Calculation Skill
  const [skills, setSkills] = useState<Skill[]>([
    { id: 1, name: "Image Analysis", description: "Analyze and describe images", createdAt: "2026-06-28" },
    { id: 2, name: "Data Processing", description: "Process CSV and Excel files", createdAt: "2026-06-27" },
    { id: 3, name: "Rectangular Area Calculation", description: "Calculates the mathematical area of a rectangle based on provided length and width inputs.", createdAt: "2026-06-30" },
  ]);

  const [files, setFiles] = useState<UploadedFile[]>([
    { id: 1, name: "dataset.csv", type: "CSV", size: "2.4 MB", uploadedAt: "2026-06-28" },
    { id: 2, name: "user_manual.pdf", type: "PDF", size: "1.8 MB", uploadedAt: "2026-06-27" },
  ]);

  const [batches, setBatches] = useState<Batch[]>([
    { id: 1, name: "Q2 Data Batch", skillIds: [1, 2], fileIds: [1], createdAt: "2026-06-28" },
  ]);

  // Mock Data - Added Rectangular Area Calculator Tool
  const [tools, setTools] = useState<Tool[]>([
    { 
      id: 1, 
      name: "Customer Insights Tool", 
      description: "Generate insights from customer data", 
      skills: ["Image Analysis", "Data Processing"], 
      files: ["dataset.csv"], 
      batches: ["Q2 Data Batch"] 
    },
    {
      id: 2,
      name: "Rectangular Area Calculator",
      description: "AI capability designed to parse dimensions and output the area computation of standard rectangular structures.",
      skills: ["Rectangular Area Calculation"],
      files: [],
      batches: []
    }
  ]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);

  // Form States
  const [newSkill, setNewSkill] = useState({ name: '', description: '' });
  const [newBatch, setNewBatch] = useState({ name: '', selectedSkills: [] as number[], selectedFiles: [] as number[] });
  const [newTool, setNewTool] = useState({ name: '', description: '', selectedSkills: [] as string[], selectedFiles: [] as string[], selectedBatches: [] as string[] });

  // Dialog & Selection States
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);
  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false);
  const [isToolDialogOpen, setIsToolDialogOpen] = useState(false);
  const [isIntegrateDialogOpen, setIsIntegrateDialogOpen] = useState(false);
  const [selectedToolForIntegration, setSelectedToolForIntegration] = useState<Tool | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [copied, setCopied] = useState(false);

  // Markdown & JSON Preview Feature States
  const [selectedSkillForPreview, setSelectedSkillForPreview] = useState<Skill | null>(null);
  const [selectedToolForPreview, setSelectedToolForPreview] = useState<Tool | null>(null);
  const [isPreviewSkillOpen, setIsPreviewSkillOpen] = useState(false);
  const [isPreviewToolOpen, setIsPreviewToolOpen] = useState(false);

  const addSkill = () => {
    if (!newSkill.name) return;
    setSkills([...skills, {
      id: Date.now(),
      name: newSkill.name,
      description: newSkill.description,
      createdAt: new Date().toISOString().split('T')[0]
    }]);
    setNewSkill({ name: '', description: '' });
    setIsSkillDialogOpen(false);
  };

  const deleteSkill = (id: number) => {
    setSkills(skills.filter(s => s.id !== id));
  };

  const addBatch = () => {
    if (!newBatch.name) return;
    setBatches([...batches, {
      id: Date.now(),
      name: newBatch.name,
      skillIds: newBatch.selectedSkills,
      fileIds: newBatch.selectedFiles,
      createdAt: new Date().toISOString().split('T')[0]
    }]);
    setNewBatch({ name: '', selectedSkills: [], selectedFiles: [] });
    setIsBatchDialogOpen(false);
  };

  const addTool = () => {
    if (!newTool.name) return;
    setTools([...tools, {
      id: Date.now(),
      name: newTool.name,
      description: newTool.description,
      skills: newTool.selectedSkills,
      files: newTool.selectedFiles,
      batches: newTool.selectedBatches
    }]);
    setNewTool({ name: '', description: '', selectedSkills: [], selectedFiles: [], selectedBatches: [] });
    setIsToolDialogOpen(false);
  };

  const deleteItem = (id: number, type: 'skill' | 'file' | 'batch' | 'tool') => {
    if (type === 'skill') setSkills(skills.filter(s => s.id !== id));
    if (type === 'file') setFiles(files.filter(f => f.id !== id));
    if (type === 'batch') setBatches(batches.filter(b => b.id !== id));
    if (type === 'tool') setTools(tools.filter(t => t.id !== id));
  };

  const integrateTool = () => {
    if (!selectedToolForIntegration || !selectedPlatform) return;

    const newIntegration: Integration = {
      id: Date.now(),
      toolId: selectedToolForIntegration.id,
      platform: selectedPlatform,
      integratedAt: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    setIntegrations([...integrations, newIntegration]);
    setIsIntegrateDialogOpen(false);
    setSelectedPlatform('');
    alert(`Tool successfully prepared for ${platforms.find(p => p.value === selectedPlatform)?.name}!`);
  };

  // Upgraded schema engine to handle calculation tool configurations dynamically
  const generateToolSchema = (tool: Tool, platform: string = "generic") => {
    let properties: any = {
      query: { type: "string", description: "User input or instruction" },
      context_files: { type: "array", items: { type: "string" }, description: "Attached files" },
      use_skills: { type: "array", items: { type: "string" }, enum: tool.skills }
    };
    let required = ["query"];

    // Dynamic detection for Rectangular Area calculation tool parameters
    if (tool.name.toLowerCase().includes("rectangular") || tool.name.toLowerCase().includes("area")) {
      properties = {
        length: { type: "number", description: "The measurable horizontal length or extent of the rectangular surface." },
        width: { type: "number", description: "The measurable vertical width or distance across the rectangular surface." },
        unit: { type: "string", description: "The unit of metric/imperial measurement (e.g., meters, centimeters, inches).", default: "meters" }
      };
      required = ["length", "width"];
    }

    const schema = {
      name: tool.name.toLowerCase().replace(/\s+/g, '_'),
      description: tool.description,
      parameters: {
        type: "object",
        properties,
        required
      }
    };

    if (platform === "generic") {
      return JSON.stringify(schema, null, 2);
    }

    return `// Integration Schema for ${platform.toUpperCase()}\n` +
           `// Paste this into your AI provider's tool/function calling section\n\n` +
           JSON.stringify(schema, null, 2);
  };

  // Helper to dynamically build markdown text for skill objects
  const generateSkillMarkdown = (skill: Skill) => {
    return `# AI Core Skill: ${skill.name}\n\n` +
           `## Metadata\n` +
           `- **Internal ID:** \`skill_${skill.id}\`\n` +
           `- **Registration Date:** ${skill.createdAt}\n\n` +
           `## Scope & Objective Description\n` +
           `${skill.description}\n\n` +
           `## Runtime Context Execution\n` +
           `This skill is packaged to interact seamlessly with advanced multi-agent workflows. It provides structural awareness for processing elements inside linked automation pipelines.`;
  };

  const copySchema = async (tool: Tool, platform: string) => {
    const schemaText = generateToolSchema(tool, platform);
    await navigator.clipboard.writeText(schemaText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      {/* Sidebar */}
      <div className="w-72 border-r border-zinc-800 bg-zinc-900 flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">SkillForge</h1>
              <p className="text-xs text-zinc-500">AI Tool Builder</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            <Button 
              variant={activeTab === 'overview' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('overview')}
            >
              <LayoutDashboard className="mr-3 h-4 w-4" />
              Overview
            </Button>
            
            <Button 
              variant={activeTab === 'skills' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('skills')}
            >
              <BookOpen className="mr-3 h-4 w-4" />
              Skills
            </Button>

            <Button 
              variant={activeTab === 'files' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('files')}
            >
              <Upload className="mr-3 h-4 w-4" />
              Files
            </Button>

            <Button 
              variant={activeTab === 'batches' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('batches')}
            >
              <Package className="mr-3 h-4 w-4" />
              Batches
            </Button>

            <Button 
              variant={activeTab === 'tools' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('tools')}
            >
              <Wrench className="mr-3 h-4 w-4" />
              Tools
            </Button>

            <Button 
              variant={activeTab === 'integrations' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('integrations')}
            >
              <ExternalLink className="mr-3 h-4 w-4" />
              Integrations
            </Button>
          </div>
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>John Doe</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="border-b border-zinc-800 bg-zinc-900 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold capitalize">{activeTab}</h2>
            <p className="text-zinc-500 mt-1">Manage your AI building blocks</p>
          </div>
          <div className="flex items-center gap-4">
            {activeTab === 'skills' && (
              <Dialog open={isSkillDialogOpen} onOpenChange={setIsSkillDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Skill
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-900 border-zinc-700">
                  <DialogHeader>
                    <DialogTitle>Create New Skill</DialogTitle>
                    <DialogDescription>Define a reusable AI capability</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label>Skill Name</Label>
                      <Input 
                        value={newSkill.name} 
                        onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                        placeholder="e.g. Sentiment Analysis" 
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea 
                        value={newSkill.description} 
                        onChange={(e) => setNewSkill({...newSkill, description: e.target.value})}
                        placeholder="What does this skill do?" 
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsSkillDialogOpen(false)}>Cancel</Button>
                    <Button onClick={addSkill}>Create Skill</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {activeTab === 'batches' && (
              <Dialog open={isBatchDialogOpen} onOpenChange={setIsBatchDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Batch
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-900 border-zinc-700 max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Batch</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Batch Name</Label>
                      <Input value={newBatch.name} onChange={(e) => setNewBatch({...newBatch, name: e.target.value})} />
                    </div>
                    <div>
                      <Label>Skills</Label>
                      <Select onValueChange={(v) => setNewBatch({...newBatch, selectedSkills: [...newBatch.selectedSkills, parseInt(v)]})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select skills" />
                        </SelectTrigger>
                        <SelectContent>
                          {skills.map(skill => (
                            <SelectItem key={skill.id} value={skill.id.toString()}>{skill.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Files</Label>
                      <Select onValueChange={(v) => setNewBatch({...newBatch, selectedFiles: [...newBatch.selectedFiles, parseInt(v)]})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select files" />
                        </SelectTrigger>
                        <SelectContent>
                          {files.map(file => (
                            <SelectItem key={file.id} value={file.id.toString()}>{file.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={addBatch}>Create Batch</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {activeTab === 'tools' && (
              <Dialog open={isToolDialogOpen} onOpenChange={setIsToolDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Tool
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-900 border-zinc-700">
                  <DialogHeader>
                    <DialogTitle>Implement Tool</DialogTitle>
                    <DialogDescription>Combine skills, files and batches</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Tool Name</Label>
                      <Input value={newTool.name} onChange={(e) => setNewTool({...newTool, name: e.target.value})} />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea value={newTool.description} onChange={(e) => setNewTool({...newTool, description: e.target.value})} />
                    </div>
                    <div>
                      <Label>Skills</Label>
                      <Select onValueChange={(v) => setNewTool({...newTool, selectedSkills: [...newTool.selectedSkills, v]})}>
                        <SelectTrigger><SelectValue placeholder="Add skills" /></SelectTrigger>
                        <SelectContent>{skills.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Files</Label>
                      <Select onValueChange={(v) => setNewTool({...newTool, selectedFiles: [...newTool.selectedFiles, v]})}>
                        <SelectTrigger><SelectValue placeholder="Add files" /></SelectTrigger>
                        <SelectContent>{files.map(f => <SelectItem key={f.id} value={f.name}>{f.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Batches</Label>
                      <Select onValueChange={(v) => setNewTool({...newTool, selectedBatches: [...newTool.selectedBatches, v]})}>
                        <SelectTrigger><SelectValue placeholder="Add batches" /></SelectTrigger>
                        <SelectContent>{batches.map(b => <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={addTool}>Create Tool</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </header>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><BookOpen className="text-violet-400" /> Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{skills.length}</div>
                  <p className="text-sm text-zinc-500">Active capabilities</p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Upload className="text-emerald-400" /> Files</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{files.length}</div>
                  <p className="text-sm text-zinc-500">Uploaded resources</p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Package className="text-amber-400" /> Batches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{batches.length}</div>
                  <p className="text-sm text-zinc-500">Combined datasets</p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Wrench className="text-sky-400" /> Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{tools.length}</div>
                  <p className="text-sm text-zinc-500">Deployed tools</p>
                </CardContent>
              </Card>

              <Card className="col-span-full bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tools.slice(0, 3).map(tool => (
                      <div key={tool.id} className="flex justify-between items-center p-3 bg-zinc-950 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Wrench className="text-sky-400" />
                          <div>
                            <div>{tool.name}</div>
                            <div className="text-xs text-zinc-500">{tool.description}</div>
                          </div>
                        </div>
                        <Badge>Ready</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Skills Library</CardTitle>
                <CardDescription>Reusable AI capabilities you can attach to tools</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-48 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {skills.map(skill => (
                      <TableRow key={skill.id}>
                        <TableCell className="font-medium">{skill.name}</TableCell>
                        <TableCell>{skill.description}</TableCell>
                        <TableCell>{skill.createdAt}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              setSelectedSkillForPreview(skill);
                              setIsPreviewSkillOpen(true);
                            }}
                          >
                            <FileText className="h-4 w-4 mr-1" /> Preview (.md)
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteSkill(skill.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Files Tab */}
          {activeTab === 'files' && (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Uploaded Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-6">
                  <Input placeholder="Search files..." className="max-w-sm" />
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {files.map(file => (
                      <TableRow key={file.id}>
                        <TableCell className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-zinc-400" />
                          {file.name}
                        </TableCell>
                        <TableCell><Badge variant="outline">{file.type}</Badge></TableCell>
                        <TableCell>{file.size}</TableCell>
                        <TableCell>{file.uploadedAt}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => deleteItem(file.id, 'file')}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Batches Tab */}
          {activeTab === 'batches' && (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Batches</CardTitle>
                <CardDescription>Group skills and files together</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch Name</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Files</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {batches.map(batch => (
                      <TableRow key={batch.id}>
                        <TableCell className="font-medium">{batch.name}</TableCell>
                        <TableCell>
                          {batch.skillIds.map(id => {
                            const skill = skills.find(s => s.id === id);
                            return skill ? <Badge key={id} className="mr-1">{skill.name}</Badge> : null;
                          })}
                        </TableCell>
                        <TableCell>
                          {batch.fileIds.map(id => {
                            const file = files.find(f => f.id === id);
                            return file ? <div key={id} className="text-sm">{file.name}</div> : null;
                          })}
                        </TableCell>
                        <TableCell>{batch.createdAt}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => deleteItem(batch.id, 'batch')}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Tools Tab */}
          {activeTab === 'tools' && (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Implemented Tools</CardTitle>
                <CardDescription>Production-ready tools built from your skills, files and batches</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tools.map(tool => (
                    <Card key={tool.id} className="bg-zinc-950 border-zinc-700">
                      <CardHeader>
                       <div className="flex justify-between items-start">
                          <CardTitle>{tool.name}</CardTitle>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedToolForPreview(tool);
                                setIsPreviewToolOpen(true);
                              }}
                            >
                              <Edit3 className="mr-1 h-3.5 w-3.5" />
                              JSON
                            </Button>
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={() => {
                                setSelectedToolForIntegration(tool);
                                setIsIntegrateDialogOpen(true);
                              }}
                            >
                              <ExternalLink className="mr-1 h-3.5 w-3.5" />
                              Integrate
                            </Button>
                          </div>
                        </div>
                        <CardDescription>{tool.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {tool.skills.length > 0 && (
                          <div>
                            <p className="text-xs uppercase text-zinc-500 mb-2">Linked Skills</p>
                            <div className="flex flex-wrap gap-1">
                              {tool.skills.map((s, i) => <Badge key={i} variant="secondary">{s}</Badge>)}
                            </div>
                          </div>
                        )}
                        {tool.files.length > 0 && (
                          <div>
                            <p className="text-xs uppercase text-zinc-500 mb-2">Files</p>
                            <div className="text-sm">{tool.files.join(", ")}</div>
                          </div>
                        )}
                        {tool.batches.length > 0 && (
                          <div>
                            <p className="text-xs uppercase text-zinc-500 mb-2">Batches</p>
                            <div className="text-sm">{tool.batches.join(", ")}</div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>AI Chatbot Integrations</CardTitle>
                <CardDescription>Tools deployed to external AI platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tool</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Integrated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {integrations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-zinc-500">
                          No integrations yet. Go to Tools → Integrate
                        </TableCell>
                      </TableRow>
                    ) : (
                      integrations.map(int => {
                        const tool = tools.find(t => t.id === int.toolId);
                        return (
                          <TableRow key={int.id}>
                            <TableCell className="font-medium">{tool?.name}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{int.platform}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-emerald-500/20 text-emerald-400">Active</Badge>
                            </TableCell>
                            <TableCell>{int.integratedAt}</TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setSelectedToolForIntegration(tool!);
                                  setIsIntegrateDialogOpen(true);
                                }}
                              >
                                View Schema
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* FEATURE: Skill Preview Markdown Dialog */}
      <Dialog open={isPreviewSkillOpen} onOpenChange={setIsPreviewSkillOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700 max-w-xl">
          <DialogHeader>
            <DialogTitle>Markdown File Preview (.md)</DialogTitle>
            <DialogDescription>
              System view of the generated documentation file for this skill.
            </DialogDescription>
          </DialogHeader>
          {selectedSkillForPreview && (
            <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 font-mono text-xs max-h-[400px] overflow-y-auto">
              <pre className="text-amber-400 whitespace-pre-wrap">{generateSkillMarkdown(selectedSkillForPreview)}</pre>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewSkillOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* FEATURE: Tool Preview JSON Dialog */}
      <Dialog open={isPreviewToolOpen} onOpenChange={setIsPreviewToolOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700 max-w-xl">
          <DialogHeader>
            <DialogTitle>JSON Schema Preview</DialogTitle>
            <DialogDescription>
              Structured object syntax used for operational AI execution models.
            </DialogDescription>
          </DialogHeader>
          {selectedToolForPreview && (
            <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 font-mono text-xs max-h-[400px] overflow-y-auto">
              <pre className="text-emerald-400 whitespace-pre-wrap">{generateToolSchema(selectedToolForPreview)}</pre>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewToolOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Integration Dialog */}
      <Dialog open={isIntegrateDialogOpen} onOpenChange={setIsIntegrateDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Deploy Tool to AI Chatbot</DialogTitle>
            <DialogDescription>
              Generate function calling schema for {selectedToolForIntegration?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div>
              <Label>Target Platform</Label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select AI Platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map(p => (
                    <SelectItem key={p.value} value={p.value}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPlatform && selectedToolForIntegration && (
              <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-700">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium">Generated Schema</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => copySchema(selectedToolForIntegration, selectedPlatform)}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    Copy
                  </Button>
                </div>
                <pre className="bg-black p-4 rounded text-xs overflow-auto max-h-96 text-emerald-300 font-mono">
                  {generateToolSchema(selectedToolForIntegration, selectedPlatform)}
                </pre>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsIntegrateDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={integrateTool} disabled={!selectedPlatform}>
              Confirm Integration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}