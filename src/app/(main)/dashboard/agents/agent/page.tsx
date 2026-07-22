'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Bot, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function AgentsPage() {
  const [agents, setAgents] = useState([
    { id: 1, name: "Autonomous Research Agent", description: "Automated agent specializing in processing raw batch records and dataset cleaning.", systemPrompt: "You are a senior data architect agent. Utilize your attached tools to extract metadata from files.", model: "claude", attachedSkillIds: [2], attachedToolIds: [1], attachedBatchIds: [1], attachedFileIds: [1], createdAt: "2026-06-29" }
  ]);

  const [skills] = useState([{ id: 2, name: "Data Processing" }]);
  const [tools] = useState([{ id: 1, name: "Customer Insights Tool" }]);
  const [batches] = useState([{ id: 1, name: "Q2 Data Batch" }]);
  const [files] = useState([{ id: 1, name: "dataset.csv" }]);

  const [isOpen, setIsOpen] = useState(false);
  const [newAgent, setNewAgent] = useState({ name: '', description: '', systemPrompt: '', model: 'claude' });

  const deployAgent = () => {
    if (!newAgent.name) return;
    setAgents([...agents, {
      id: Date.now(),
      name: newAgent.name,
      description: newAgent.description,
      systemPrompt: newAgent.systemPrompt,
      model: newAgent.model,
      attachedSkillIds: [2],
      attachedToolIds: [1],
      attachedBatchIds: [],
      attachedFileIds: [1],
      createdAt: new Date().toISOString().split('T')[0]
    }]);
    setNewAgent({ name: '', description: '', systemPrompt: '', model: 'claude' });
    setIsOpen(false);
  };

  return (
    <div className="container mx-auto p-8 bg-zinc-950 text-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Agents Core Hub</h1>
          <p className="text-zinc-400 mt-1">Consolidate prompts, custom actions, and parameters into functional personas</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-violet-600 text-white hover:bg-violet-700">
              <Plus className="mr-2 h-4 w-4" /> Assemble Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Bot className="text-violet-400" /> Construct Agent Core</DialogTitle>
              <DialogDescription>Inject custom functional block configurations down into an LLM brain layout.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label>Agent Identity Label</Label>
                <Input value={newAgent.name} onChange={(e) => setNewAgent({...newAgent, name: e.target.value})} placeholder="e.g. Security Analyzer Core" className="bg-zinc-950 border-zinc-800" />
              </div>
              <div>
                <Label>Operational Mandate Mandate</Label>
                <Input value={newAgent.description} onChange={(e) => setNewAgent({...newAgent, description: e.target.value})} placeholder="Primary mission objective" className="bg-zinc-950 border-zinc-800" />
              </div>
              <div>
                <Label>System Instruction Prompt Override</Label>
                <Textarea value={newAgent.systemPrompt} onChange={(e) => setNewAgent({...newAgent, systemPrompt: e.target.value})} placeholder="You are an expert engine system..." className="font-mono text-xs h-24 bg-zinc-950 border-zinc-800" />
              </div>
              <div>
                <Label>Base Computational LLM Foundation</Label>
                <Select value={newAgent.model} onValueChange={(v) => setNewAgent({...newAgent, model: v})}>
                  <SelectTrigger className="bg-zinc-950 border-zinc-800"><SelectValue placeholder="Model Select" /></SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                    <SelectItem value="claude">Claude v4 (Anthropic)</SelectItem>
                    <SelectItem value="openai">GPT-5 Turbo (OpenAI)</SelectItem>
                    <SelectItem value="gemini">Gemini Pro Ultra (Google)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter><Button onClick={deployAgent} className="bg-violet-600 w-full mt-2">Deploy Otonom Agent Core</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agents.map(agent => (
          <Card key={agent.id} className="bg-zinc-900 border-zinc-800 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <Badge className="bg-violet-500/10 text-violet-400 border border-violet-500/20 font-mono text-xs capitalize">Engine: {agent.model}</Badge>
              <Button variant="ghost" size="sm" onClick={() => setAgents(agents.filter(a => a.id !== agent.id))} className="text-zinc-600 hover:text-red-400 p-0 h-6 w-6 hover:bg-transparent"><Trash2 className="w-4 h-4" /></Button>
            </div>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400"><Bot className="w-5 h-5" /></div>
                <div>
                  <CardTitle className="text-lg">{agent.name}</CardTitle>
                  <span className="text-[10px] text-zinc-500 block mt-0.5">Assembled Registry {agent.createdAt}</span>
                </div>
              </div>
              <CardDescription className="text-zinc-300 mt-3 text-xs leading-relaxed">{agent.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs pt-2">
              <Separator className="bg-zinc-800/80" />
              <div className="space-y-1.5">
                <span className="flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider text-zinc-500"><Terminal className="w-3.5 h-3.5 text-violet-400" /> System Directives Block</span>
                <div className="bg-zinc-950 p-3 rounded font-mono text-[11px] text-zinc-400 border border-zinc-800 max-h-20 overflow-y-auto leading-relaxed">"{agent.systemPrompt}"</div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-1 text-[11px]">
                <div><span className="text-zinc-500 block mb-1">Injected Tool Actions</span><div className="flex flex-wrap gap-1">{agent.attachedToolIds.map(id => <Badge key={id} className="bg-sky-500/10 text-sky-400 border-none font-normal text-[10px]">{tools.find(t=>t.id===id)?.name}</Badge>)}</div></div>
                <div><span className="text-zinc-500 block mb-1">Active Core Skills</span><div className="flex flex-wrap gap-1">{agent.attachedSkillIds.map(id => <Badge key={id} className="bg-violet-500/10 text-violet-400 border-none font-normal text-[10px]">{skills.find(s=>s.id===id)?.name}</Badge>)}</div></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}