import { Code2, ShoppingBag, MonitorPlay, LucideIcon } from 'lucide-react'

export interface ServiceItem {
    id: string
    icon: LucideIcon
    title: string
    desc: string
    price: string
    features: string[]
}

export interface ProjectItem {
    id: string
    title: string
    category: string
    desc: string
    image?: string
    liveUrl?: string
    tech: string[]
    market: 'local' | 'international'
}

export interface TestimonialItem {
    quote: string
    author: string
    role: string
    company: string
}

// 1. SERVICES DATA
export const servicesData = {
    international: [
        {
            id: 'int-build',
            icon: Code2,
            title: 'Enterprise Architecture',
            desc: 'High-performance Next.js full-stack software schemas integrated with secure cloud databases.',
            price: '$2,500+',
            features: ['Next.js 15 App Router', 'Supabase Secure DB Schema', 'Strict TypeScript Auditing']
        },
        {
            id: 'int-purchasable',
            icon: ShoppingBag,
            title: 'SaaS & Subscription Studios',
            desc: 'Robust digital application engines featuring premium user gateways and billing networks.',
            price: '$4,000+',
            features: ['Secure User Portals', 'Automated Usage Metrics', 'Multi-Tenant Permissions']
        }
    ],
    local: [
        {
            id: 'loc-build',
            icon: Code2,
            title: 'Corporate Web Infrastructure',
            desc: 'Lightning-fast corporate storefronts optimized completely for performance and search engine visibility.',
            price: '45,000 Br+',
            features: ['SEO Structural Optimization', 'Localization Frameworks', 'High-Speed Static Deployments']
        },
        {
            id: 'loc-visibility',
            icon: MonitorPlay,
            title: 'Digital Visibility Strategy',
            desc: 'High-conversion business visibility frameworks paired with automated performance tracking dashboards.',
            price: '20,000 Br/mo',
            features: ['Content Engine Workflows', 'Performance Lead Tracking', 'Conversion Architecture']
        }
    ]
}

// 2. PROJECTS DATA
export const projectsData: ProjectItem[] = [
    {
        id: 'proj-1',
        title: 'Aura Hotel',
        category: 'Full-Stack Web App',
        desc: 'An automated web workflow interface engineered to manage high-throughput digital execution tasks.',
        image: '/Aura Standarad project.png',
        liveUrl: 'https://aura-standard-web.netlify.app/',
        tech: ['React', 'Next.js', 'Supabase', 'Tailwind CSS'],
        market: 'international'
    },
    {
        id: 'proj-2',
        title: 'Homebody Workout',
        category: 'Autonomous Systems',
        desc: 'An automated local digital workspace assistant utilizing strict context parsing and semantic rule tracking for corporate file optimization.',
        image: '/21dayhomebody..png',
        liveUrl: 'https://21dayfitnessplan.netlify.app/',
        tech: ['TypeScript', 'Gemini API', 'Zustand', 'Node.js'],
        market: 'international'
    },
    {
        id: 'proj-3',
        title: 'Nova Hotel & Spa',
        category: 'Corporate Infrastructure',
        desc: 'A high-end hospitality engine managing real-time room reservations, secure payment processing, and interactive client booking matrices.',
        image: '/Aura basic project.png',
        liveUrl: 'https://aura-web-service-basic.netlify.app/',
        tech: ['Next.js', 'Tailwind v4', 'Framer Motion'],
        market: 'local'
    }
]

// 3. TESTIMONIALS DATA
export const testimonialsData: TestimonialItem[] = [
    {
        quote: "Aura completely overhauled our client coordination panel. The immediate responsiveness of the frontend architecture reduced our data friction by nearly 40%.",
        author: "Elena Rostov",
        role: "Operations Director",
        company: "Vanguard Tech Labs"
    },
    {
        quote: "The system is incredibly fast, clean, and perfectly suited for our dynamic workflows. Having separate international processing layers built seamlessly into one framework is elite.",
        author: "Marcus Vance",
        role: "Founder",
        company: "Sovereign SaaS Inc."
    }
]