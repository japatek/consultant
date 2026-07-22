'use client';

import React, { useState } from 'react';
import { Upload, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function FilesPage() {
  const [files, setFiles] = useState([
    { id: 1, name: "dataset.csv", type: "CSV", size: "2.4 MB", uploadedAt: "2026-06-28" },
    { id: 2, name: "user_manual.pdf", type: "PDF", size: "1.8 MB", uploadedAt: "2026-06-27" },
  ]);

  return (
    <div className="container mx-auto p-8 bg-zinc-950 text-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Static Knowledge Base Files</h1>
          <p className="text-zinc-400 mt-1">Upload unstructured manual instructions or records</p>
        </div>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardContent className="pt-6">
          <div className="flex justify-between gap-4 mb-6">
            <Input placeholder="Filter files by nomenclature..." className="max-w-sm bg-zinc-950 border-zinc-800" />
            <Button className="bg-zinc-800 hover:bg-zinc-700 text-white">
              <Upload className="mr-2 h-4 w-4" /> Inject New File
            </Button>
          </div>

          <Table>
            <TableHeader className="border-zinc-800">
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-400">File Nomenclature</TableHead>
                <TableHead className="text-zinc-400">MIME Type</TableHead>
                <TableHead className="text-zinc-400">Disk Weight</TableHead>
                <TableHead className="text-zinc-400">Injection Timestamp</TableHead>
                <TableHead className="text-zinc-400 w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map(file => (
                <TableRow key={file.id} className="border-zinc-800 hover:bg-zinc-800/40">
                  <TableCell className="flex items-center gap-3 font-medium text-zinc-200">
                    <FileText className="h-4 w-4 text-zinc-500" />
                    {file.name}
                  </TableCell>
                  <TableCell><Badge variant="outline" className="border-zinc-700 text-zinc-400 font-mono">{file.type}</Badge></TableCell>
                  <TableCell className="text-zinc-400 text-sm">{file.size}</TableCell>
                  <TableCell className="text-zinc-500 text-sm">{file.uploadedAt}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => setFiles(files.filter(f => f.id !== file.id))} className="text-zinc-500 hover:text-red-400 hover:bg-transparent">
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