'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function BatchesPage() {
  const [batches, setBatches] = useState([
    { id: 1, name: "Q2 Data Batch", skillIds: [1, 2], fileIds: [1], createdAt: "2026-06-28" }
  ]);
  const [skills] = useState([{ id: 1, name: "Image Analysis" }, { id: 2, name: "Data Processing" }]);
  const [files] = useState([{ id: 1, name: "dataset.csv" }]);
  
  const [newBatch, setNewBatch] = useState({ name: '', selectedSkills: [] as number[], selectedFiles: [] as number[] });
  const [isOpen, setIsOpen] = useState(false);

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
    setIsOpen(false);
  };

  return (
    <div className="container mx-auto p-8 bg-zinc-950 text-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Structured Batches</h1>
          <p className="text-zinc-400 mt-1">Bind dataset instances with targeting evaluation nodes</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-violet-600 hover:bg-violet-700 text-white">
              <Plus className="mr-2 h-4 w-4" /> Create Batch
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>Assemble Data Batch Packet</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label>Batch Identitifer</Label>
                <Input value={newBatch.name} onChange={(e) => setNewBatch({...newBatch, name: e.target.value})} className="bg-zinc-950 border-zinc-800" />
              </div>
              <div>
                <Label>Link Functional Node Skill</Label>
                <Select onValueChange={(v) => setNewBatch({...newBatch, selectedSkills: [...newBatch.selectedSkills, parseInt(v)]})}>
                  <SelectTrigger className="bg-zinc-950 border-zinc-800"><SelectValue placeholder="Mount Skills" /></SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                    {skills.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Link Knowledge File Target</Label>
                <Select onValueChange={(v) => setNewBatch({...newBatch, selectedFiles: [...newBatch.selectedFiles, parseInt(v)]})}>
                  <SelectTrigger className="bg-zinc-950 border-zinc-800"><SelectValue placeholder="Mount Files" /></SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                    {files.map(f => <SelectItem key={f.id} value={f.id.toString()}>{f.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addBatch} className="bg-violet-600 w-full mt-2">Deploy Aggregation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardContent className="pt-6">
          <Table>
            <TableHeader className="border-zinc-800">
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-400">Batch Target Name</TableHead>
                <TableHead className="text-zinc-400">Mounted Capabilities</TableHead>
                <TableHead className="text-zinc-400">Mounted Datasets</TableHead>
                <TableHead className="text-zinc-400">Deployed Timestamp</TableHead>
                <TableHead className="text-zinc-400 w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map(batch => (
                <TableRow key={batch.id} className="border-zinc-800 hover:bg-zinc-800/40">
                  <TableCell className="font-semibold text-zinc-200 flex items-center gap-2">
                    <Package className="w-4 h-4 text-amber-500" /> {batch.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {batch.skillIds.map(id => (
                        <Badge key={id} className="bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs font-normal">
                          {skills.find(s => s.id === id)?.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-400 text-xs font-mono">
                    {batch.fileIds.map(id => files.find(f => f.id === id)?.name).join(", ")}
                  </TableCell>
                  <TableCell className="text-zinc-500 text-sm">{batch.createdAt}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => setBatches(batches.filter(b => b.id !== batch.id))} className="text-zinc-500 hover:text-red-400 hover:bg-transparent">
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