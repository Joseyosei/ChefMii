'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type CurrencyCode = 'GBP' | 'USD' | 'EUR' | 'AED' | 'JPY'

export interface CurrencyInfo {
    code: CurrencyCode
    symbol: string
    name: string
    rate: number // Multiplier from base GBP
    flag: string
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
    GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rate: 1.0, flag: '🇬🇧' },
    USD: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.28, flag: '🇺🇸' },
    EUR: { code: 'EUR', symbol: '€', name: 'Euro', rate: 1.17, flag: '🇪🇺' },
    AED: { code: 'AED', symbol: 'AED ', name: 'UAE Dirham', rate: 4.70, flag: '🇦🇪' },
    JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 192.0, flag: '🇯🇵' },
}

interface CurrencyContextType {
    currency: CurrencyInfo
    setCurrencyCode: (code: CurrencyCode) => void
    formatPrice: (amountInGBP: number) => string
    convertPrice: (amountInGBP: number) => number
}

const CurrencyContext = createContext<CurrencyContextType>({
    currency: CURRENCIES.GBP,
    setCurrencyCode: () => {},
    formatPrice: (amt) => `£${amt.toFixed(2)}`,
    convertPrice: (amt) => amt,
})

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currencyCode, setCurrencyCodeState] = useState<CurrencyCode>('GBP')

    useEffect(() => {
        try {
            const saved = localStorage.getItem('chefmii_currency') as CurrencyCode
            if (saved && CURRENCIES[saved]) {
                setCurrencyCodeState(saved)
            }
        } catch {}
    }, [])

    const setCurrencyCode = (code: CurrencyCode) => {
        setCurrencyCodeState(code)
        try {
            localStorage.setItem('chefmii_currency', code)
        } catch {}
    }

    const currency = CURRENCIES[currencyCode] || CURRENCIES.GBP

    const convertPrice = (amountInGBP: number): number => {
        return amountInGBP * currency.rate
    }

    const formatPrice = (amountInGBP: number): string => {
        const converted = convertPrice(amountInGBP)
        if (currency.code === 'JPY') {
            return `${currency.symbol}${Math.round(converted).toLocaleString()}`
        }
        return `${currency.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }

    return (
        <CurrencyContext.Provider value={{ currency, setCurrencyCode, formatPrice, convertPrice }}>
            {children}
        </CurrencyContext.Provider>
    )
}

export function useCurrency() {
    return useContext(CurrencyContext)
}
