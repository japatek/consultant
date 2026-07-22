'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function IntegrationsPage() {
  const integrations = [
    { id: 1, toolName: "Customer Insights Tool", platform: "Claude (Anthropic)", status: "active", integratedAt: "2026-06-28" }
  ];

  return (
    <div className="container mx-auto p-8 bg-zinc-950 text-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Active External Gateways</h1>
        <p className="text-zinc-400 mt-1">Audit active webhook structures and function call endpoints</p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardContent className="pt-6">
          <Table>
            <TableHeader className="border-zinc-800">
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-400">Linked Core Block</TableHead>
                <TableHead className="text-zinc-400">Target Core Gateway</TableHead>
                <TableHead className="text-zinc-400">Network Status</TableHead>
                <TableHead className="text-zinc-400">Deployment Registry</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {integrations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-zinc-500">No external socket pipes active.</TableCell>
                </TableRow>
              ) : (
                integrations.map(int => (
                  <TableRow key={int.id} className="border-zinc-800 hover:bg-zinc-800/40">
                    <TableCell className="font-semibold text-zinc-200">{int.toolName}</TableCell>
                    <TableCell><Badge variant="secondary" className="bg-zinc-950 border-zinc-800 text-zinc-300 font-mono text-xs">{int.platform}</Badge></TableCell>
                    <TableCell><Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-normal">Active Pipeline</Badge></TableCell>
                    <TableCell className="text-zinc-500 text-sm">{int.integratedAt}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}