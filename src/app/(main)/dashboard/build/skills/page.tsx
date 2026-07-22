'use client';

import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function SkillsPage() {
  const [skills, setSkills] = useState([
    { id: 1, name: "Image Analysis", description: "Analyze and describe images", createdAt: "2026-06-28" },
    { id: 2, name: "Data Processing", description: "Process CSV and Excel files", createdAt: "2026-06-27" },
  ]);
  const [newSkill, setNewSkill] = useState({ name: '', description: '' });
  const [isOpen, setIsOpen] = useState(false);

  const addSkill = () => {
    if (!newSkill.name) return;
    setSkills([...skills, {
      id: Date.now(),
      name: newSkill.name,
      description: newSkill.description,
      createdAt: new Date().toISOString().split('T')[0]
    }]);
    setNewSkill({ name: '', description: '' });
    setIsOpen(false);
  };

  return (
    <div className="container mx-auto p-8 bg-zinc-950 text-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skills Library</h1>
          <p className="text-zinc-400 mt-1">Manage core capability nodes for your ecosystem</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-violet-600 hover:bg-violet-700 text-white">
              <Plus className="mr-2 h-4 w-4" /> New Skill
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-700 text-white">
            <DialogHeader>
              <DialogTitle>Create New Skill</DialogTitle>
              <DialogDescription>Define a reusable AI capacity core.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Skill Title</Label>
                <Input value={newSkill.name} onChange={(e) => setNewSkill({...newSkill, name: e.target.value})} placeholder="e.g. Predictive Analysis" className="bg-zinc-950 border-zinc-800" />
              </div>
              <div>
                <Label>Operational Target Instruction</Label>
                <Textarea value={newSkill.description} onChange={(e) => setNewSkill({...newSkill, description: e.target.value})} placeholder="What execution parameters does this target?" className="bg-zinc-950 border-zinc-800" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)} className="border-zinc-700 text-zinc-300">Cancel</Button>
              <Button onClick={addSkill} className="bg-violet-600 hover:bg-violet-700">Deploy Core</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardContent className="pt-6">
          <Table>
            <TableHeader className="border-zinc-800">
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-400">Skill Nodes</TableHead>
                <TableHead className="text-zinc-400">Functional Directives</TableHead>
                <TableHead className="text-zinc-400">Registry Date</TableHead>
                <TableHead className="text-zinc-400 w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skills.map(skill => (
                <TableRow key={skill.id} className="border-zinc-800 hover:bg-zinc-800/40">
                  <TableCell className="font-semibold text-zinc-200">{skill.name}</TableCell>
                  <TableCell className="text-zinc-400">{skill.description}</TableCell>
                  <TableCell className="text-zinc-500">{skill.createdAt}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => setSkills(skills.filter(s => s.id !== skill.id))} className="text-zinc-500 hover:text-red-400 hover:bg-transparent">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}