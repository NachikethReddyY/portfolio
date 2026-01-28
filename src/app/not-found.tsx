import Link from 'next/link'
import FuzzyText from '@/components/ui/fuzzy-text'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 bg-background text-foreground">
            <div className="scale-75 md:scale-100">
                <FuzzyText
                    fontSize={150}
                    fontWeight={900}
                    color="#111"
                    enableHover={true}
                    baseIntensity={0.05}
                    hoverIntensity={0.2}
                    fuzzRange={10}
                >
                    404
                </FuzzyText>
            </div>
            <h2 className="text-2xl font-bold">Page Not Found</h2>
            <p className="text-muted-foreground text-center max-w-md">Could not find the requested resource.</p>
            <Link href="/" className="text-primary hover:underline underline-offset-4">
                Return Home
            </Link>
        </div>
    )
}
