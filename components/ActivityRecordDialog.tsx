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
import type { Dispatch, SetStateAction } from "react";
import { ActivityRecord } from "@/lib/types";
import { Button } from "./ui/button";
import { v4 as uuidv4 } from "uuid";

interface TainingVolumeDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activityName: string;
  setActivityRecordTemp: Dispatch<SetStateAction<ActivityRecord[]>>;
}

const formSchema = z.object({
  set: z.number().min(1).max(20),
  weight: z.number().min(1).max(1000),
  repetition: z.number().min(1).max(100),
});

const TrainingRecordDialog = ({
  isOpen,
  setIsOpen,
  activityName,
  setActivityRecordTemp,
}: TainingVolumeDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      set: 1,
      weight: 1,
      repetition: 1,
    },
  });
  function onSubmit(data: z.infer<typeof formSchema>) {
    const recordsData = Array.from({ length: data.set }, () => {
      return {
        id: uuidv4(),
        weight: data.weight,
        repetition: data.repetition,
      };
    });
    
    setActivityRecordTemp(recordsData);
    form.reset();
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Dialog 關閉時重置表單
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{activityName}</DialogTitle>
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
            <Field>
              <Button onClick={() => setIsOpen(false)}>確定</Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingRecordDialog;
