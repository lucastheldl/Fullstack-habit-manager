import clsx from "clsx";
import dayjs from "dayjs";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Dimensions,
} from "react-native";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";

const weekDays = 7;
const screen_horizontal_padding = (32 * 2) / 5;

export const day_margin_between = 8;
export const day_size =
  Dimensions.get("screen").width / weekDays - (screen_horizontal_padding + 5);

interface Props extends TouchableOpacityProps {
  amountOfHabits?: number;
  amountCompleted?: number;
  date: Date;
}

const HabitDay = ({
  amountOfHabits = 0,
  amountCompleted = 0,
  date,
  ...rest
}: Props) => {
  const completedPercentage =
    amountOfHabits > 0
      ? generateProgressPercentage(amountOfHabits, amountCompleted)
      : 0;
  const today = dayjs().startOf("day").toDate();
  const isCurrentDay = dayjs(date).isSame(today);

  //{isCurrentDay && console.log(date, amountCompleted, amountOfHabits)}

  return (
    <TouchableOpacity
      className={clsx("rounded-lg border-2 m-1", {
        ["bg-zinc-900 border-zinc-800 "]: completedPercentage === 0,
        ["bg-violet-900 border-violet-700"]:
          completedPercentage > 0 && completedPercentage < 20,
        ["bg-violet-800 border-violet-600"]:
          completedPercentage >= 20 && completedPercentage < 40,
        ["bg-violet-700 border-violet-500"]:
          completedPercentage >= 40 && completedPercentage < 60,
        ["bg-violet-600 border-violet-500"]:
          completedPercentage >= 60 && completedPercentage < 80,
        ["bg-violet-500 border-violet-400"]: completedPercentage >= 80,
        ["border-white border-4"]: isCurrentDay,
      })}
      style={{ width: day_size, height: day_size }}
      activeOpacity={0.7}
      {...rest}
    />
  );
};

export default HabitDay;
