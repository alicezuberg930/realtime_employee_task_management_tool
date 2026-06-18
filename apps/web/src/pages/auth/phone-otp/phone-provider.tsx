import React, { useState } from 'react'

type Stage = 'phone' | 'verify'

type PhoneContextType = {
    stage: Stage
    setStage: React.Dispatch<React.SetStateAction<Stage>>
    phone: string
    setPhone: React.Dispatch<React.SetStateAction<string>>
}

const PhoneContext = React.createContext<PhoneContextType | null>(null)

export function PhoneProvider({ children }: { children: React.ReactNode }) {
    const [stage, setStage] = useState<Stage>('phone')
    const [phone, setPhone] = useState<string>('')

    return (
        <PhoneContext value={{ stage, setStage, phone, setPhone }}>
            {children}
        </PhoneContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePhone = () => {
    const phoneContext = React.useContext(PhoneContext)

    if (!phoneContext) {
        throw new Error('usePhone has to be used within <PhoneContext>')
    }

    return phoneContext
}
