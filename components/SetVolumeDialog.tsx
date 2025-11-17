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
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { ActivityRecord } from "@/lib/types";
import { Button } from "./ui/button";
import { v4 as uuidv4 } from "uuid";

interface SelectedSetData {
  id: string;
  weight: number;
  repetition: number;
  set: number;
}
interface SetVolumeDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activityName: string;
  setActivityRecord: Dispatch<SetStateAction<ActivityRecord[]>>;
  selectedSetData?: SelectedSetData | null;
  setSelectedSetData?: Dispatch<SetStateAction<SelectedSetData | null>>;
}

const formSchema = z.object({
  weight: z.number().min(1).max(1000),
  repetition: z.number().min(1).max(100),
});

const SetVolumeDialog = ({
  isOpen,
  setIsOpen,
  activityName,
  setActivityRecord,
  selectedSetData,
  setSelectedSetData,
}: SetVolumeDialogProps) => {
  const isEditMode = !!selectedSetData;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: 1,
      repetition: 1,
    },
  });

  useEffect(() => {
      if (isOpen && selectedSetData) {
        
        form.reset({
          weight: selectedSetData?.weight ?? 1,
          repetition: selectedSetData?.repetition ?? 1,
        });
      }
    }, [form, isOpen, selectedSetData]);

  function onSubmit(data: z.infer<typeof formSchema>) {
    if (isEditMode) {
      setActivityRecord((prev) =>
        prev.map((item) => {
          if (item.id === selectedSetData.id) {
            return {
              ...item,
              weight: data.weight,
              repetition: data.repetition,
            };
          }
          return item;
        })
      );
    } else {
      setActivityRecord((prev) => [
        ...prev,
        {
          id: uuidv4(),
          set: prev.length + 1,
          weight: data.weight,
          repetition: data.repetition,
        },
      ]);
    }

    form.reset({
      weight: 1,
      repetition: 1,
    });
    if (setSelectedSetData) {
      setSelectedSetData(null);
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Dialog 關閉時重置表單
      
      if(setSelectedSetData){
        console.log("清空選擇資料");
        setSelectedSetData(null)
      }
      form.reset({
        weight: 1,
        repetition: 1,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{activityName}</DialogTitle>
          <DialogDescription>
            {isEditMode ? `Set ${selectedSetData.set} 訓練量設定` : "新增組數"}
          </DialogDescription>
        </DialogHeader>
        <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
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

export default SetVolumeDialog;
