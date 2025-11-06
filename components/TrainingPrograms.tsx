"use client"

import { Button } from "@/components/ui/button";
import { SquarePlus, X } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useState } from "react";
import TrainingItemDialog from "./TrainingItemDialog";
import { Exercise } from "@/lib/types";

const TrainingPrograms = () => {
  const [programCardOpen, setProgramCardOpen] = useState(false)
  const [isTrainingItemDialogOpen, setIsTrainingItemDialogOpen] = useState(false)
  const [tainingProgram, setTrainingProgram] = useState<
    "strength" | "power" | "endurance" | "other"
  >("strength");
  const [exercises, setExercises] = useState<Exercise[]>([])

const handleTrainingItemDialogOpen = (
  program: "strength" | "power" | "endurance" | "other"
) => {
  setIsTrainingItemDialogOpen(true);
  setTrainingProgram(program);
};
const handleDeleteExercise = () => {
  console.log("刪除");
  
}

  return (
    <div className="px-4 md:py-4">
      {programCardOpen ? (
        <Card>
          <CardHeader>
            <CardTitle>訓練項目</CardTitle>
            <CardDescription>請選擇訓練項目</CardDescription>
            <CardAction>
              <Button variant="ghost" onClick={() => setProgramCardOpen(false)}>
                <X />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-8">
            <Button onClick={() => handleTrainingItemDialogOpen("strength")}>
              肌力 Strength
            </Button>
            <Button onClick={() => handleTrainingItemDialogOpen("power")}>
              爆發力 Power
            </Button>
            <Button
              disabled
              onClick={() => handleTrainingItemDialogOpen("endurance")}
            >
              耐力 Endurance
            </Button>
            <Button
              disabled
              onClick={() => handleTrainingItemDialogOpen("other")}
            >
              其他
            </Button>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      ) : (
        <div className="flex flex-col items-center">
          <Button
            className="text-blue-700 hover:text-blue-900"
            onClick={() => setProgramCardOpen(true)}
            variant="ghost"
            size="icon-2xl"
            asChild
          >
            <SquarePlus strokeWidth={1.2} />
          </Button>
          <p className="text-gray-500 font-semibold text-lg md:text-xl">
            新增訓練
          </p>
        </div>
      )}

      <TrainingItemDialog
        isOpen={isTrainingItemDialogOpen}
        setIsOpen={setIsTrainingItemDialogOpen}
        setExercises={setExercises}
        program={tainingProgram}
      />
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>範例</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
        {exercises.map((exercise, index) => (
          <AccordionItem key={index} value={exercise.name}>
            <AccordionTrigger>
              <span>{exercise.name}</span>

              <Button onClick={handleDeleteExercise}>x</Button>
            </AccordionTrigger>

            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default TrainingPrograms;
