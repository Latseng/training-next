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
import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { TrainingActivity } from "@/lib/types";

interface TainingVolumeDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  exercise: string;
  setTrainingSessios: Dispatch<SetStateAction<TrainingActivity[]>>;
}

const formSchema = z.object({
  set: z.number().min(1).max(20),
  weight: z.number().min(1).max(1000),
  repetition: z.number().min(1).max(100),
  // note: z.string().trim().optional(),
});

const TrainingVolumeDialog = ({
  isOpen,
  setIsOpen,
  exercise,
  setTrainingSessios: setTrainingSessions,
}: TainingVolumeDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      set: 1,
      weight: 1,
      repetition: 1,
      // note: "",
    },
  });
  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const activityData = {
      name: exercise,
      records: Array.from({ length: data.set }, (_, index) => {
        return {
          set: index + 1,
          weight: data.weight,
          repetition: data.repetition,
        };
      }),
    };
    setTrainingSessions((prev) => [...prev, activityData]);
    console.log(activityData);
    setIsSubmitting(false);
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Dialog 關閉時重置表單
      form.reset();
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{exercise}</DialogTitle>
          <DialogDescription>訓練量設定</DialogDescription>
        </DialogHeader>
        <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="set"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="set">組數 Sets</FieldLabel>
                  <Input
                    {...field}
                    id="set"
                    aria-invalid={fieldState.invalid}
                    type="number"
                    min={1}
                    required
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="weight"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="weight">重量（Kg）</FieldLabel>
                  <Input
                    {...field}
                    id="weight"
                    aria-invalid={fieldState.invalid}
                    type="number"
                    min={1}
                    required
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="repetition"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="repetitiont">反覆次數 Reps</FieldLabel>
                  <Input
                    {...field}
                    id="repetition"
                    aria-invalid={fieldState.invalid}
                    type="number"
                    min={1}
                    required
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* <Controller
              name="note"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="note">備註</FieldLabel>
                  <Textarea
                    {...field}
                    id="note"
                    aria-invalid={fieldState.invalid}
                    className="min-h-12"
                  />
                  <FieldDescription>
                    可註記該次訓練的狀況，供日後分析（AI）、追蹤用
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            /> */}
            <Field>
              <SubmitButton actionName="確認" isSubmitting={isSubmitting} />
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingVolumeDialog;
