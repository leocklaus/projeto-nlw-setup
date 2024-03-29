import { Check } from "phosphor-react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { useState, FormEvent } from 'react'
import { api } from "../lib/axios";

const availableWeekDays = [
    'Domingo',
    'Segunda-Feira',
    'Terça-Feira',
    'Quarta-Feira',
    'Quinta-Feira',
    'Sexta-Feira',
    'Sábado'
]

export default function NewHabitForm() {

    const [title, setTitle] = useState('')
    const [days, setDays] = useState<number[]>([])

    const createNewHabit = async (event: FormEvent) => {
        event.preventDefault()
        if (!title || days.length === 0) return

        await api.post('/habits', { title, weekDays: days })
        setTitle('')
        setDays([])

        alert('Hábito criado com sucesso')
    }


    const handleChecked = (weekDay: number) => {
        if (days.includes(weekDay)) {
            const newDaysArray = days.filter((day) => day !== weekDay)
            setDays(newDaysArray)
        } else {
            setDays((prev) => [...prev, weekDay])
        }
    }

    return (
        <form className="w-full flex flex-col mt-6" onSubmit={createNewHabit}>
            <label htmlFor="title" className="font-semibold leading-tight">
                Qual seu comprometimento?
            </label>
            <input
                type="text"
                name="title"
                id="title"
                value={title}
                placeholder="ex.: Exercícos, dormir bem, etc..."
                autoFocus
                className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2
                focus:ring-violet-600 focus:ring-outline-500 focus:ring-offset-2 focus:ring-offset-zinc-900'"
                onChange={(e) => setTitle(e.target.value)}
            />
            <label htmlFor="" className="font-semibold leading-tight mt-4">
                Qual a recorrência?
            </label>

            <div className="flex flex-col gap-2 mt-3">
                {availableWeekDays.map((day, index) => (
                    <Checkbox.Root
                        className='flex items-center gap-3 group focus:outline-none'
                        key={index}
                        checked={days.includes(index)}
                        onCheckedChange={() => handleChecked(index)}
                    >
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500  group-data-[state=checked]:border-green-500 transition-colors group-focus:ring-2
                    group-focus:ring-violet-600 group-focus:ring-outline-500 group-focus:ring-offset-2 group-focus:ring-offset-background'">
                            <Checkbox.Indicator>
                                <Check size={20} className='text-white' />
                            </Checkbox.Indicator>
                        </div>
                        <span className="text-white leading-tight">
                            {day}
                        </span>
                    </Checkbox.Root>
                ))}
            </div>

            <button type="submit" className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500 transition-colors focus:outline-none focus:ring-2
                    focus:ring-green-600 focus:ring-outline-500 focus:ring-offset-2 focus:ring-offset-zinc-900'">
                <Check size={20} weight="bold" />
                Confirmar
            </button>

        </form>
    )
}