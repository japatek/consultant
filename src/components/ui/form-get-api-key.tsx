'use client'

import { useState } from "react"
import {
    Field,
    FieldDescription,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Check, Copy } from "lucide-react"

// ✅ Pindahkan kembali ke lokal agar tidak perlu hubungin database dulu
const localWorkspaces = [
    "Default Workspace",
    "Project Alpha",
    "Workspace Eksternal"
]

export function GetApiKey() {
    // State Form & Validasi
    const [name, setName] = useState("");
    const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);
    const [errors, setErrors] = useState({ name: false, workspace: false });
    
    // State Transisi Tampilan Dialog
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [generatedKey, setGeneratedKey] = useState("");

    const handleGenerateClick = () => {
        // 1. Validasi Input Form
        const isNameEmpty = name.trim() === "";
        const isWorkspaceEmpty = !selectedWorkspace || selectedWorkspace.trim() === "";

        setErrors({
            name: isNameEmpty,
            workspace: isWorkspaceEmpty,
        });

        // Jika ada yang belum diisi, gaya/styles otomatis berubah merah dan berhenti di sini
        if (isNameEmpty || isWorkspaceEmpty) {
            return;
        }

        // 2. Jika valid, ubah tombol jadi "Generating..." sebentar
        setIsLoading(true);

        // 3. Simulasi instan (0.5 detik) langsung mengubah halaman dialog
        setTimeout(() => {
            const randomKey = "sk_live_" + Math.random().toString(36).substring(2, 15).toUpperCase();
            setGeneratedKey(randomKey);
            setIsLoading(false);
            setIsSuccess(true); // Tampilan dialog langsung berubah ke sukses
        }, 600);
    };

    // ─── TAMPILAN KEDUA: JIKA BERHASIL (HALAMAN DIALOG BERUBAH) ───
    if (isSuccess) {
        return (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center justify-center py-4 space-y-3">
                    <div className="h-12 w-12 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                        <Check className="size-6" />
                    </div>
                    <h3 className="text-lg font-semibold">API Key Berhasil Dibuat!</h3>
                    <p className="text-sm text-muted-foreground text-center max-w-xs">
                        Catat rahasia ini. Anda tidak akan bisa melihat kunci ini lagi demi alasan keamanan.
                    </p>
                </div>

                <div className="flex items-center gap-2 p-3 bg-muted/50 border rounded-md">
                    <code className="text-xs font-mono flex-1 truncate select-all">{generatedKey}</code>
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8"
                        onClick={() => navigator.clipboard.writeText(generatedKey)}
                    >
                        <Copy className="size-3.5" />
                    </Button>
                </div>

                <div className="flex justify-end pt-2">
                    <Button onClick={() => {
                        // Reset form jika ingin buat lagi
                        setIsSuccess(false);
                        setName("");
                        setSelectedWorkspace(null);
                    }} variant="outline">
                        Tutup
                    </Button>
                </div>
            </div>
        );
    }

    // ─── TAMPILAN PERTAMA: FORM INPUT ASLI ───
    return (
        <div className="space-y-4 text-left">
            {/* Input Name */}
            <Field>
                <FieldLabel htmlFor="input-field-username" className={errors.name ? "text-destructive" : ""}>
                    Name
                </FieldLabel>
                <Input
                    id="input-field-username"
                    type="text"
                    placeholder="Enter your API Key Name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: false }));
                    }}
                    className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                <FieldDescription className={errors.name ? "text-destructive font-medium" : ""}>
                    {errors.name ? "Give a name frist to your key" : "Choose a name for your new API Key."}
                </FieldDescription>
            </Field>

            {/* Input Workspace */}
            <Field>
                <FieldLabel className={errors.workspace ? "text-destructive" : ""}>
                    Workspace
                </FieldLabel>
                <Combobox 
                    items={localWorkspaces} 
                    onValueChange={(val) => {
                        setSelectedWorkspace(val as string);
                        if (errors.workspace) setErrors((prev) => ({ ...prev, workspace: false }));
                    }}
                >
                    <ComboboxInput 
                        placeholder="Select a workspace" 
                        className={errors.workspace ? "border-destructive text-destructive placeholder:text-destructive/50" : ""} 
                    />
                    <ComboboxContent
                        onWheel={(e) => e.stopPropagation()}
                        className="pointer-events-auto"
                    >
                        <ComboboxEmpty>No items found.</ComboboxEmpty>
                        <ComboboxList>
                            {localWorkspaces.map((item) => (
                                <ComboboxItem key={item} value={item}>
                                    {item}
                                </ComboboxItem>
                            ))}
                        </ComboboxList>
                    </ComboboxContent>
                    <FieldDescription className={errors.workspace ? "text-destructive font-medium" : ""}>
                         {errors.workspace ? "You must choose a workspace." : "Choose a workspace."}
                    </FieldDescription>
                </Combobox>
            </Field>

            {/* Tombol Pemicu Perubahan Halaman */}
            <div className="flex justify-end pt-2">
                {isLoading ? (
                    <Button variant="outline" disabled className="w-4xs mt-4">
                        <Spinner data-icon="inline-start" className="mr-2" />
                        Generating...
                    </Button>
                ) : (
                    <Button onClick={handleGenerateClick} className="w-4xs mt-4">
                        Generate API Key
                    </Button>
                )}
            </div>
        </div>
    )
}