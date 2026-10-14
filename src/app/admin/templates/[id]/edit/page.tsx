"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase-browser";
import TemplateForm from "@/components/admin/TemplateForm";

export default function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [record, setRecord] = useState<any>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!supabase) return;
    supabase.from("website_templates").select("*").eq("id", id).maybeSingle()
      .then(({ data, error }: { data: any; error: { message: string } | null }) => { if (error) setError(error.message); else setRecord(data); });
  }, [id]);
  if (error) return <p className="text-red-600">{error}</p>;
  return record ? <TemplateForm initialData={record} /> : <p className="text-gray-500">Loading template...</p>;
}
