import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { generateDatesFromYearBegnning } from "../utils/generate-dates-from-year-begnning";
//components
import HabitDay from "./HabitDay";

type Props = {};

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

const summaryDates = generateDatesFromYearBegnning();
const minimunSummaryDatesSize = 18 * 8; //18 weeks
const amountOfDaysToFill = minimunSummaryDatesSize - summaryDates.length;

type SummaryTable = Array<{
  id: string;
  date: string;
  amount: number;
  completed: number;
}>;
const Summary = (props: Props) => {
  const [summary, setSummary] = useState<SummaryTable>([]);

  useEffect(() => {
    api.get("summary").then((response) => {
      setSummary(response.data);
    });
  }, []);

  return (
    <div className="w-full flex ">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDays.map((day, i) => {
          return (
            <div
              key={`${weekDays}-${i}`}
              className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center"
            >
              {day}
            </div>
          );
        })}
      </div>
      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {summary.length > 0 &&
          summaryDates.map((date) => {
            const dayInSummary = summary.find((day) => {
              return dayjs(date).isSame(day.date, "day"); //checa se é o mesmo dia, apena dia nao horas e segundos
            });

            return (
              <HabitDay
                key={date.toString()}
                date={date}
                defaultCompleted={dayInSummary?.completed}
                amount={dayInSummary?.amount}
              />
            );
          })}

        {amountOfDaysToFill > 0 &&
          Array.from({ length: amountOfDaysToFill }).map((_, i) => {
            return (
              <div
                key={i}
                className="w-10 h-10 bg-zinc-900 boder-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"
              />
            );
          })}
      </div>
    </div>
  );
};

export default Summary;
