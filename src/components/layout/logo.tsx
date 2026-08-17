'use client'

import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
    className?: string
    variant?: 'full' | 'mark' | 'text'
    size?: 'sm' | 'md' | 'lg' | 'xl'
    href?: string
    priority?: boolean
}

const SIZE_MAP = {
    sm: { height: 28, width: 110, text: 'text-lg' },
    md: { height: 36, width: 140, text: 'text-2xl' },
    lg: { height: 44, width: 175, text: 'text-3xl' },
    xl: { height: 56, width: 220, text: 'text-4xl' },
}

export function BrandLogo({
    className = '',
    size = 'md',
    href = '/',
    priority = false,
}: LogoProps) {
    const dimensions = SIZE_MAP[size] || SIZE_MAP.md

    const content = (
        <div className={`flex items-center gap-2 select-none group transition-transform ${className}`}>
            <div className="relative flex items-center justify-center">
                <Image
                    src="/images/logo.png"
                    alt="ChefMii Logo"
                    width={dimensions.width}
                    height={dimensions.height}
                    priority={priority}
                    unoptimized
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                    style={{
                        height: dimensions.height,
                        width: 'auto',
                    }}
                />
            </div>
        </div>
    )

    if (href) {
        return (
            <Link href={href} className="inline-flex items-center focus:outline-none">
                {content}
            </Link>
        )
    }

    return content
}
