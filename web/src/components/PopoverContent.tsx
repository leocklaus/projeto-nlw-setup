import * as Checkbox from '@radix-ui/react-checkbox'
import dayjs from 'dayjs'
import { Check } from 'phosphor-react'
import PreviousMap from 'postcss/lib/previous-map'
import { useEffect, useState } from 'react'
import { api } from '../lib/axios'

type Props = {
    date: Date,
    setCompleted: (newAmout: number) => void
}

export function PopoverContent({ date, setCompleted }: Props) {

    type Habits = {
        possibleHabits?: {
            id: string,
            title: string,
            created_at: string,
        }[],
        completedHabits: string[]
    }

    const [habitsInfo, setHabitsInfo] = useState<Habits>()

    const toggleChecked = async (id: string) => {
        await api.patch(`/habits/${id}/toogle`)

        const isHabitAlreadyCompleted = habitsInfo!.completedHabits.includes(id)

        let completedHabits: string[]

        if (isHabitAlreadyCompleted) {
            completedHabits = habitsInfo!.completedHabits.filter((HabitId) => HabitId !== id)
        } else {
            completedHabits = [...habitsInfo!.completedHabits, id]
        }

        setCompleted(completedHabits.length)

        const newHabits = { ...habitsInfo, completedHabits: completedHabits }
        setHabitsInfo(newHabits)
    }
    useEffect(() => {
        api.get('/day', { params: { date: date.toISOString() } }).then((response) => setHabitsInfo(response.data))
    }, [])


    const today = dayjs(new Date()).startOf('day')
    const isDateInPast = dayjs(date).isBefore(today)

    return (
        <div className="mt-6 flex flex-col gap-3">
            {habitsInfo?.possibleHabits?.map((habit) => (
                <Checkbox.Root
                    className='flex items-center gap-3 group outline-none disabled:cursor-not-allowed'
                    key={habit.id}
                    checked={habitsInfo.completedHabits?.includes(habit.id)}
                    disabled={isDateInPast}
                    onCheckedChange={() => toggleChecked(habit.id)}
                >
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500  group-data-[state=checked]:border-green-500 transition-color group-focus:ring-2
                    group-focus:ring-violet-600 group-focus:ring-outline-500 group-focus:ring-offset-2 group-focus:ring-offset-background'">
                        <Checkbox.Indicator>
                            <Check
                                size={20}
                                className='text-white'
                            />
                        </Checkbox.Indicator>
                    </div>
                    <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
                        {habit.title}
                    </span>
                </Checkbox.Root>

            ))}
        </div>
    )
}