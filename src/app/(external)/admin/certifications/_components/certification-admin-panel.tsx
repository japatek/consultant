"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/use-language";
import { apiRequest } from "@/lib/api-client";
import type { UploadedFile } from "@/lib/storage";
import type {
  CertificationFormValues,
  AdminCertificationRow,
  CertificationRecord,
} from "@/lib/certificate/admin-certification-actions";

type T = ReturnType<typeof useLanguage>["t"];

export function CertificationAdminPanel({
  initialCertifications,
}: {
  initialCertifications: AdminCertificationRow[];
}) {
  const { t } = useLanguage();
  const [certifications, setCertifications] = useState(initialCertifications);
  const [editing, setEditing] = useState<AdminCertificationRow | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }
  function openEdit(cert: AdminCertificationRow) {
    setEditing(cert);
    setDialogOpen(true);
  }
  function handleSaved(cert: AdminCertificationRow) {
    setCertifications((prev) => {
      const exists = prev.some((c) => c.id === cert.id);
      return exists ? prev.map((c) => (c.id === cert.id ? { ...c, ...cert } : c)) : [...prev, cert];
    });
    setDialogOpen(false);
  }
  function toggleActive(cert: AdminCertificationRow) {
    setCertifications((prev) =>
      prev.map((c) => (c.id === cert.id ? { ...c, isActive: !c.isActive } : c))
    );
    void apiRequest(`/api/admin/certifications/${cert.id}/active`, {
      method: "PATCH",
      body: { isActive: !cert.isActive },
    });
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t.certAdminTitle}</h1>
          <p className="text-muted-foreground">{t.certAdminSubtitle}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-1.5 h-4 w-4" />
              {t.certAdminAdd}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <CertificationForm t={t} initialValues={editing ?? undefined} onSaved={handleSaved} />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t.questFieldTitle}</TableHead>
            <TableHead>{t.certAdminLinkedQuests}</TableHead>
            <TableHead>{t.certAdminEarnedBy}</TableHead>
            <TableHead>{t.adminActive}</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {certifications.map((cert) => (
            <TableRow key={cert.id}>
              <TableCell className="font-medium">{cert.title}</TableCell>
              <TableCell>{cert._count.requiredQuests}</TableCell>
              <TableCell>{cert._count.unlockedBy}</TableCell>
              <TableCell>
                <Switch checked={cert.isActive} onCheckedChange={() => toggleActive(cert)} />
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => openEdit(cert)}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function CertificationForm({
  t,
  initialValues,
  onSaved,
}: {
  t: T;
  initialValues?: AdminCertificationRow;
  onSaved: (cert: AdminCertificationRow) => void;
}) {
  const [values, setValues] = useState<CertificationFormValues>(
    initialValues ?? { slug: "", title: "", description: "", badgeUrl: null, isActive: true }
  );
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function uploadBadge(file: File) {
    setError(null);
    setIsUploading(true);
    void (async () => {
      try {
        const formData = new FormData();
        formData.set("file", file);
        const uploaded = await apiRequest<UploadedFile>("/api/admin/certifications/badge-upload", {
          formData,
        });
        setValues((v) => ({ ...v, badgeUrl: uploaded.url }));
      } catch (err) {
        setError(err instanceof Error ? err.message : t.questSaveError);
      } finally {
        setIsUploading(false);
      }
    })();
  }

  function save() {
    setError(null);
    startTransition(() => {
      void (async () => {
        try {
          const saved = await apiRequest<CertificationRecord>("/api/admin/certifications", {
            method: "POST",
            body: { ...values, id: initialValues?.id },
          });
          onSaved({
            ...saved,
            _count: initialValues?._count ?? { requiredQuests: 0, unlockedBy: 0 },
          });
        } catch (err) {
          setError(err instanceof Error ? err.message : t.questSaveError);
        }
      })();
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{initialValues ? t.certAdminEdit : t.certAdminAdd}</DialogTitle>
      </DialogHeader>

      <div className="space-y-4 py-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t.questFieldTitle}</Label>
            <Input value={values.title} onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={values.slug} onChange={(e) => setValues((v) => ({ ...v, slug: e.target.value }))} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t.questFieldDescription}</Label>
          <Textarea
            rows={3}
            value={values.description}
            onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label>{t.certAdminBadge}</Label>
          <div className="flex items-center gap-3">
            {values.badgeUrl && (
              // eslint-disable-next-line @next/next/no-img-element -- admin-only preview thumbnail
              <img src={values.badgeUrl} alt="" className="h-12 w-12 rounded-full border object-cover" />
            )}
            <label className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm text-muted-foreground hover:border-primary/50 hover:text-primary">
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {isUploading ? t.questUploading : t.questUploadFile}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isUploading}
                onChange={(e) => e.target.files?.[0] && uploadBadge(e.target.files[0])}
              />
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="cert-active"
            checked={values.isActive}
            onCheckedChange={(v) => setValues((s) => ({ ...s, isActive: v }))}
          />
          <Label htmlFor="cert-active" className="font-normal">
            {t.adminActive}
          </Label>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <DialogFooter>
        <Button onClick={save} disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t.adminSave}
        </Button>
      </DialogFooter>
    </>
  );
}
