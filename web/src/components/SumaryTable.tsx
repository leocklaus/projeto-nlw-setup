import { HabitDay } from "./HabitDay"
import { generateDateFromYearBeginning } from '../utils/generate-dates-from-year-beginning'
import { useEffect, useState } from 'react'
import { api } from '../lib/axios'
import dayjs from "dayjs"
const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S',]

const dates = generateDateFromYearBeginning()
const minimunDates = 18 * 7
const amountofDaysToFill = minimunDates - dates.length

type Sumary = {
    id: string,
    date: string,
    amount: number,
    completed: number
}[]

export function SumaryTable() {

    const [sumary, setSumary] = useState<Sumary>([])

    useEffect(() => {
        api.get('/summary').then((response) => { setSumary(response.data) })
    }, [])

    return (
        <div className="w-full flex">
            <div className="grid grid-rows-7 grid-flow-row gap-3">
                {days.map((day, index) => (
                    <div className="text-zinc-400 text-xl h-10 w-10 flex items-center justify-center font-bold" key={index}>{day}</div>
                ))}
            </div>
            <div className="grid grid-rows-7 grid-flow-col gap-3">
                {sumary.length > 0 && dates.map((date, index) => {

                    const sumaryDates = sumary.find(day => { return dayjs(date).isSame(day.date, 'day') })

                    return (
                        <HabitDay key={index} completed={sumaryDates?.completed || 0} amount={sumaryDates?.amount || 0}
                            date={date}
                        />
                    )
                })}
                {amountofDaysToFill > 0 && Array.from({ length: amountofDaysToFill }).map((_, i) => (
                    <div className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed" key={i}></div>
                ))}
            </div>
        </div>
    )
}