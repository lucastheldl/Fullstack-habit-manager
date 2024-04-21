import { View, Text, ScrollView, Alert } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
//api
import { api } from "../lib/axios";

import { generateDatesFromYearBegnning } from "../utils/generate-dates-from-year-begnning";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
import HabitDay, { day_size } from "../components/HabitDay";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";

const DatesFromYearStart = generateDatesFromYearBegnning();
const minimunSummaryDateSize = 18 * 5;
const amountOfDaysToFill = minimunSummaryDateSize - DatesFromYearStart.length;

type SummaryProps = Array<{
  id: string;
  date: Date;
  amount: number;
  completed: number;
}>;

export function Home() {
  const { navigate } = useNavigation();
  const [summary, setsummary] = useState<SummaryProps>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      setLoading(true);

      const response = await api.get("summary");
      setsummary(response.data);
    } catch (error) {
      Alert.alert("Ops", "Não foi possível carregar o sumario de hábitos");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();

      return () => {};
    }, [])
  );

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-background px-5 pt-16">
      <Header />

      <View className="flex-row mt-6 mb-2 ">
        {weekDays.map((day, i) => {
          return (
            <Text
              key={`${day}-${i}`}
              className="text-zinc-400 text-xl font-bold text-center mx-1"
              style={{ width: day_size }}
            >
              {day}
            </Text>
          );
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {summary.length > 0 && (
          <View className="flex-row flex-wrap">
            {DatesFromYearStart.map((date) => {
              console.log(date);
              const dayWithHabits = summary.find((day) => {
                return dayjs(date).isSame(day.date, "day");
              });
              return (
                <HabitDay
                  key={date.toString()}
                  amountOfHabits={dayWithHabits?.amount}
                  amountCompleted={dayWithHabits?.completed}
                  date={date}
                  onPress={() => {
                    console.log(date.toISOString());
                    navigate("Habit", { date: date.toISOString() });
                  }}
                />
              );
            })}
            {amountOfDaysToFill > 0 &&
              Array.from({ length: amountOfDaysToFill }).map((_, i) => {
                return (
                  <View
                    key={i}
                    className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                    style={{ width: day_size, height: day_size }}
                  />
                );
              })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
