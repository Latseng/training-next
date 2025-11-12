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
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import SubmitButton from "./SubmitButton";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";

const formSchema = z.object({
  title: z.string().trim().optional(),
  note: z.string().trim().optional(),
});

const categories = [
  {
    id: "strength and conditioning",
    title: "肌力與體能",
    description: "肌力與體能訓練",
  },
  {
    id: "other",
    title: "其他",
    description: "自訂訓練類型",
  },
] as const;

const TrainingSessionDialog = ({ isOpen, setIsOpen, setTrainingSession, date }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      note: "",
    },
  });

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
    const formattedDate = format(new Date(date), "yyyy-MM-dd");
    const sessionData = {
      ...formData,
      date: formattedDate,
    };
    
    const accessToken = localStorage.getItem("access_token")
    try {
      const res = await fetch("http://localhost:8000/training-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify(sessionData),
      });
      
      const data = await res.json();

      if (res.ok) {
        setTrainingSession(formData);
        setIsOpen(false)
        toast.success("建立訓練成功！");
        // router.push("/");
      } else {
        setError(data.detail);
      }
    } catch(err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新增訓練</DialogTitle>
          <DialogDescription>建立一筆訓練計畫</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* <Controller
              name="category"
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldSet>
                  <FieldLegend>類型</FieldLegend>
                  <FieldDescription>請選擇訓練類型</FieldDescription>
                  <RadioGroup
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    className="space-y-2"
                  >
                    {categories.map((category) => (
                      <FieldLabel
                        key={category.id}
                        htmlFor={`form-rhf-radiogroup-${category.id}`}
                      >
                        <Field
                          orientation="horizontal"
                          data-invalid={fieldState.invalid}
                        >
                          <FieldContent>
                            <FieldTitle>{category.title}</FieldTitle>
                            <FieldDescription>
                              {category.description}
                            </FieldDescription>
                          </FieldContent>
                          <RadioGroupItem
                            value={category.id}
                            id={`form-rhf-radiogroup-${category.id}`}
                            aria-invalid={fieldState.invalid}
                          />
                        </Field>
                      </FieldLabel>
                    ))}
                  </RadioGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldSet>
              )}
            /> */}
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
              <SubmitButton actionName="新增" isSubmitting={isSubmitting} />
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingSessionDialog;
