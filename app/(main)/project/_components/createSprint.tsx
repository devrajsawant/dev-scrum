"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";

import useFetch from "@/hooks/useFetch";
import { sprintSchema } from "@/lib/validator";
import { createSprint } from "@/actions/sprint";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format } from "date-fns";
import { z } from "zod";
import { toast } from "sonner";

type DateRange = {
  from?: Date;
  to?: Date;
};

type SprintFormValues = z.infer<typeof sprintSchema>;

interface SprintCreationFormProps {
  projectTitle: string;
  projectKey: string;
  projectId: string;
  sprintKey: number | string;
}

export default function SprintCreationForm({
  projectTitle,
  projectKey,
  projectId,
  sprintKey,
}: SprintCreationFormProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  // ✅ empty by default (user must pick)
  const [dateRange, setDateRange] = useState<DateRange>({});

  const { loading: createSprintLoading, fn: createSprintFn } =
    useFetch(createSprint);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SprintFormValues>({
    resolver: zodResolver(sprintSchema),
    defaultValues: {
      name: `${projectKey}-${sprintKey}`,
    },
  });

  const onSubmit: SubmitHandler<SprintFormValues> = async (data) => {
    if (!dateRange.from || !dateRange.to) {
      toast.error("Please select sprint duration");
      return;
    }

    await createSprintFn(projectId, {
      ...data,
      startDate: dateRange.from,
      endDate: dateRange.to,
    });

    toast.success("Sprint created successfully");
    setShowForm(false);
    router.refresh();
  };

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-8 gradient-title-purple">
          {projectTitle}
        </h1>

        <Button
          className="mt-2"
          onClick={() => setShowForm(!showForm)}
          variant={!showForm ? "default" : "destructive"}
        >
          {!showForm ? "Create New Sprint" : "Cancel"}
        </Button>
      </div>

      {showForm && (
        <Card className="pt-4 mb-4">
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex gap-4 items-end"
            >
              {/* Sprint Name */}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Sprint Name
                </label>

                <Input
                  {...register("name")}
                  readOnly
                  className="bg-slate-950"
                />

                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Sprint Duration */}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Sprint Duration
                </label>

                <Controller
                  control={control}
                  name="startDate"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-slate-950"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />

                          {dateRange.from && dateRange.to ? (
                            `${format(
                              dateRange.from,
                              "LLL dd, y",
                            )} - ${format(dateRange.to, "LLL dd, y")}`
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent
                        className="w-auto bg-slate-900"
                        align="start"
                      >
                        <DayPicker
                          mode="range"
                          disabled={[{ before: new Date() }]}
                          selected={dateRange}
                          onSelect={(range) => {
                            if (!range) return;
                            setDateRange(range);
                            setValue("startDate", range.from);
                            setValue("endDate", range.to);
                            field.onChange(range.from);
                          }}
                          classNames={{ chevron: "fill-blue-500", range_start: "bg-blue-700 rounded-lg", range_end: "bg-blue-700 rounded-lg", range_middle: "bg-blue-400 rounded-lg", day_button: "border-none ", today: "border-1 border-blue-700", }}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />

                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              {/* hidden field so RHF tracks endDate */}
              <input type="hidden" {...register("endDate")} />

              <Button
                type="submit"
                disabled={
                  createSprintLoading || !dateRange.from || !dateRange.to
                }
              >
                {createSprintLoading ? "Creating..." : "Create Sprint"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}
