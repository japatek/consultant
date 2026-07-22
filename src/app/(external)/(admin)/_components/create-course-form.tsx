"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { createCourse } from "../_upcontent/actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// A small component to handle the loading state of the button
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Uploading Course..." : "Publish Course"}
    </Button>
  );
}

export function CreateCourseForm() {
  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Create New Course</CardTitle>
        <CardDescription>
          Fill out the details below. Use Markdown in the content area for formatting.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* The 'action' attribute connects this form to our Server Action */}
        <form action={createCourse} className="space-y-6">
          
          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input id="title" name="title" placeholder="e.g., Introduction to Next.js" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              placeholder="A brief summary of what students will learn..." 
              required 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" name="category" placeholder="e.g., Frontend" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input id="duration" name="duration" placeholder="e.g., 45 mins" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Difficulty Level</Label>
              <Select name="level" required defaultValue="Easy">
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Course Content (Markdown)</Label>
            <Textarea 
              id="content" 
              name="content" 
              placeholder="## Welcome to the course!&#10;&#10;Write your markdown here..." 
              className="min-h-[300px] font-mono"
              required 
            />
          </div>

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}