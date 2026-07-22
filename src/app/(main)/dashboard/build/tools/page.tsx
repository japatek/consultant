'use client';

import React, { useState } from 'react';
import { Plus, ExternalLink, Check, Copy, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function ToolsPage() {
  const [tools, setTools] = useState([
    { id: 1, name: "Customer Insights Tool", description: "Generate insights from customer data", skills: ["Image Analysis", "Data Processing"], files: ["dataset.csv"], batches: ["Q2 Data Batch"] },
  ]);

  const [isToolOpen, setIsToolOpen] = useState(false);
  const [isIntegrateOpen, setIsIntegrateOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<typeof tools[0] | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [copied, setCopied] = useState(false);

  const [newTool, setNewTool] = useState({ name: '', description: '' });

  const addTool = () => {
    if (!newTool.name) return;
    setTools([...tools, {
      id: Date.now(),
      name: newTool.name,
      description: newTool.description,
      skills: ["Image Analysis"],
      files: ["dataset.csv"],
      batches: []
    }]);
    setNewTool({ name: '', description: '' });
    setIsToolOpen(false);
  };

  const generateSchema = (tool: typeof tools[0], platform: string) => {
    return JSON.stringify({
      name: tool.name.toLowerCase().replace(/\s+/g, '_'),
      description: tool.description,
      parameters: { type: "object", properties: { query: { type: "string" } }, required: ["query"] }
    }, null, 2);
  };

  return (
    <div className="container mx-auto p-8 bg-zinc-950 text-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Production Tools</h1>
          <p className="text-zinc-400 mt-1">Deploy action schemas ready for LLM invocation</p>
        </div>
        <Dialog open={isToolOpen} onOpenChange={setIsToolOpen}>
          <DialogTrigger asChild>
            <Button className="bg-violet-600 text-white hover:bg-violet-700">
              <Plus className="mr-2 h-4 w-4" /> New Tool
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-700 text-white">
            <DialogHeader>
              <DialogTitle>Implement Action Tool Block</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Tool Signature Name</Label>
                <Input value={newTool.name} onChange={(e) => setNewTool({...newTool, name: e.target.value})} className="bg-zinc-950 border-zinc-800" />
              </div>
              <div>
                <Label>Functional Target Scope</Label>
                <Textarea value={newTool.description} onChange={(e) => setNewTool({...newTool, description: e.target.value})} className="bg-zinc-950 border-zinc-800" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addTool} className="bg-violet-600 w-full mt-2">Deploy Assembly</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map(tool => (
          <Card key={tool.id} className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-sky-400" />
                  <CardTitle className="text-xl">{tool.name}</CardTitle>
                </div>
                <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800" onClick={() => { setSelectedTool(tool); setIsIntegrateOpen(true); }}>
                  <ExternalLink className="mr-2 h-4 w-4" /> Integrate
                </Button>
              </div>
              <CardDescription className="text-zinc-400 mt-2">{tool.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 border-t border-zinc-800/60 pt-4 text-xs">
              <div>
                <span className="text-zinc-500 uppercase font-mono tracking-wider block mb-1.5">Capabilities Attached</span>
                <div className="flex flex-wrap gap-1">{tool.skills.map((s, i) => <Badge key={i} className="bg-zinc-950 border-zinc-800 font-normal text-zinc-300">{s}</Badge>)}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-zinc-400">
                <div><span className="text-zinc-500 block">Static Data Source</span> <span className="font-mono text-zinc-300">{tool.files.join(", ")}</span></div>
                <div><span className="text-zinc-500 block">Active Dynamic Batch</span> <span className="font-mono text-zinc-300">{tool.batches.join(", ") || 'None'}</span></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Integration Modal Overlay Dialog */}
      <Dialog open={isIntegrateOpen} onOpenChange={setIsIntegrateOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Function Calling Schema Deployment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 my-2">
            <div>
              <Label>Target LLM Agent Core Gateway</Label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="bg-zinc-950 border-zinc-800"><SelectValue placeholder="Select Ecosystem Provider" /></SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                  <SelectItem value="openai">ChatGPT (OpenAI)</SelectItem>
                  <SelectItem value="claude">Claude (Anthropic)</SelectItem>
                  <SelectItem value="gemini">Gemini (Google)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedPlatform && selectedTool && (
              <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                <div className="flex items-center justify-between mb-2 text-xs text-zinc-400">
                  <span>Structured Schema Manifest</span>
                  <Button variant="ghost" size="sm" className="h-7 hover:bg-zinc-800 text-zinc-300" onClick={() => { navigator.clipboard.writeText(generateSchema(selectedTool, selectedPlatform)); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />} Copy
                  </Button>
                </div>
                <pre className="bg-black p-3 rounded font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-60">{generateSchema(selectedTool, selectedPlatform)}</pre>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}