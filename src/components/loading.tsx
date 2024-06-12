'use client'

import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";

export default function Loading() {
	const [loadingText, setLoadingText] = useState('carregando')

  useEffect(() => {
		const interval = setInterval(() => {
			setLoadingText((prev) => {
				const dotCount = (prev.match(/\./g) || []).length
				if (dotCount < 3) {
					return prev + '.'
				}
				return 'carregando'
			})
		}, 500)

		return () => clearInterval(interval)
	}, [])

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-fj">
      <Card className="w-full lg:w-[600px]">
        <CardContent className="flex items-center justify-center flex-col p-5 gap-2">
          <FaSpinner className="animate-spin h-6 w-6" />
          <h1 className="text-xl">{loadingText}</h1>
        </CardContent>
      </Card>

  </div>
  )
}