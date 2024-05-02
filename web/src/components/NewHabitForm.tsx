import { Check } from "phosphor-react";
import * as Checkbox from "@radix-ui/react-checkbox";
import React, { FormEvent, useEffect, useState } from "react";
import { api } from "../lib/axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

type Props = {};
const weekDays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const NewHabitForm = (props: Props) => {
  const [title, setTitle] = useState("");
  const [wDays, setWDays] = useState<number[]>([]);
  const [userId, setUserId] = useState("");
  const isAuthenticated = Cookies.get("jwt");

  useEffect(() => {
    if (isAuthenticated) {
      // Decode the JWT token
      const decodedToken = jwtDecode(isAuthenticated) as {
        sub: string;
        name: string;
      };
      // Extract user ID and username from the decoded token
      const { sub: user_Id, name: username } = decodedToken;
      setUserId(user_Id);
    }
  }, [isAuthenticated]);

  async function createNewHabit(e: FormEvent) {
    e.preventDefault();

    if (!title || !wDays || !userId) {
      return;
    }
    await api.post(
      `/${userId}/habits`,
      {
        title: title,
        weekDays: wDays,
      },
      {
        headers: {
          Authorization: `Bearer ${isAuthenticated}`,
        },
      }
    );
    console.log(userId);
    setTitle("");
    setWDays([]);

    alert("Hábito criado com sucesso!");
  }

  function toggleWeekDays(weekDay: number) {
    if (wDays.includes(weekDay)) {
      const newWeekDaysWithRemoved = wDays.filter((day) => day != weekDay);

      setWDays(newWeekDaysWithRemoved);
    } else {
      const newWeekDaysWithRemoved = [...wDays, weekDay];

      setWDays(newWeekDaysWithRemoved);
    }
  }

  return (
    <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
      <label htmlFor="title" className="font-semibold leading-tight mb-4">
        Qual seu comprometimento?
      </label>
      <input
        id="title"
        type="text"
        placeholder="ex: Exercicios, dormir bem, etc..."
        className="p-4 rounded-lg bg-zinc-800 text-white placeholder:text-zinc-400
        focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-zinc-900"
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label htmlFor="" className="font-semibold leading-tight mt-4">
        Qual a recorrencia?
      </label>

      <div className="flex flex-col gap-2 mt-3">
        {weekDays.map((day, i) => {
          return (
            <Checkbox.Root
              className="flex items-center gap-3 group focus:outline-none"
              checked={wDays.includes(i)}
              onCheckedChange={() => toggleWeekDays(i)}
              key={day}
            >
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors
               group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-2 group-focus:ring-offset-background"
              >
                <Checkbox.Indicator>
                  <Check size={20} className="text-white" />
                </Checkbox.Indicator>
              </div>
              <span className="text-white leading-tight ">{day}</span>
            </Checkbox.Root>
          );
        })}
      </div>

      <button
        type="submit"
        className="flex flex-row mt-6 rounded-lg p-4 gap-3 items-center font-semibold bg-green-600 justify-center hover:bg-green-500 transition-colors
      focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
      >
        <Check size={20} weight="bold" />
        Confirmar
      </button>
    </form>
  );
};

export default NewHabitForm;
