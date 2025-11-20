"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import SubmitButton from "./SubmitButton";
import { useEffect, useState } from "react";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";

import type { KeyedMutator } from "swr";
import { TrainingSession } from "@/lib/types";
import { API_PROXY } from "@/lib/fetcher";

interface TrainingSessionDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  date: Date;
  mutate: KeyedMutator<TrainingSession[]>;
  initialData?: TrainingSession | null;
}

const formSchema = z.object({
  title: z.string().trim().optional(),
  note: z.string().trim().optional(),
});

const TrainingSessionDialog = ({
  isOpen,
  setIsOpen,
  date,
  mutate,
  initialData,
}: TrainingSessionDialogProps) => {
  const isEditMode = !!initialData;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title:  "",
      note: "",
    },
  });

  useEffect(() => {
    if (isOpen && initialData) {
      form.reset({
        title: initialData.title ?? "",
        note: initialData.note ?? "",
      });
    }
  }, [isOpen, initialData, form]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Dialog 關閉時重置表單
      form.reset();
      setIsSubmitting(false);
    }
  };

  async function onSubmit(formData: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const sessionData: Partial<TrainingSession> = {
      ...formData,
    };

    let url = `${API_PROXY}/training-sessions`;
    let method = "POST";
    let successMessage = "建立訓練成功！";

    if (isEditMode) {
      // 編輯模式
      url = `${url}/${initialData.id}`;
      method = "PUT";
      successMessage = "修改訓練成功！";
    } else {
      // 新增模式
      const formattedDate = format(new Date(date), "yyyy-MM-dd");
      sessionData.date = formattedDate; // 只有新增時才加入 date
    }

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(sessionData),
      });

      mutate();

      const data = await res.json();

      if (res.ok) {
        setIsOpen(false);
        toast.success(successMessage)
      } else {
        toast.warning(data.detail);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "修改訓練" : "新增訓練"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "修改" : "新增"}訓練計畫
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="title">計劃名稱 / 主題</FieldLabel>
                  <Input
                    {...field}
                    id="title"
                    aria-invalid={fieldState.invalid}
                    placeholder="選填。範例：HIIT循環訓練"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="note"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="note">備註</FieldLabel>
                  <Textarea
                    {...field}
                    id="note"
                    aria-invalid={fieldState.invalid}
                    placeholder="選填，可註記該次訓練的狀況，供日後分析（AI）、追蹤用"
                    className="min-h-20"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Field>
              <SubmitButton
                actionName={isEditMode ? "修改" : "新增"}
                isSubmitting={isSubmitting}
              />
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingSessionDialog;
