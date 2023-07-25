const colors = require('tailwindcss/colors')
module.exports = {
  darkMode: 'class', // or 'media' or 'class'
  variants: {
    extend: {},
  },
    plugins: [require('@tailwindcss/typography'),
        require('@tailwindcss/forms')],
    content: {
        relative: true,
        files: [
		 './index.html',
		 './src/**/*.{js,ts,jsx,tsx}'
        ]
    },
    safelist: [
        'w-64',
        'w-1/2',
        'rounded-l-lg',
        'rounded-r-lg',
        'bg-gray-200',
        'grid-cols-4',
        'grid-cols-7',
        'h-6',
        'leading-6',
        'h-9',
        'leading-9',
        'shadow-lg',
        'p-6'
    ],
    theme: {
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            slate: colors.slate,
            gray: colors.gray,
            zinc: colors.zinc,
            neutral: colors.neutral,
            stone: colors.stone,
            red: colors.red,
            orange: colors.orange,
            amber: colors.amber,
            yellow: colors.yellow,
            lime: colors.lime,
            green: colors.green,
            emerald: colors.emerald,
            teal: colors.teal,
            cyan: colors.cyan,
            sky: colors.sky,
            blue: colors.blue,
            indigo: colors.indigo,
            violet: colors.violet,
            purple: colors.purple,
            fuchsia: colors.fuchsia,
            pink: colors.pink,
            rose: colors.rose,
            white: colors.white,
            shark: {
                '50': '#f6f6f7',
                '100': '#e0e5e7',
                '200': '#c2c9cd',
                '300': '#9ba7ad',
                '400': '#76828b',
                '500': '#5b6871',
                '600': '#485159',
                '700': '#3c4349',
                '800': '#33373c',
                '900': '#2d3034',
                '950': '#212529',
                DEFAULT: '#212529'
            },
            'ccviolet': {
                '50': '#f3f3ff',
                '100': '#e9e8ff',
                '200': '#d6d5ff',
                '300': '#b7b3ff',
                '400': '#9388fd',
                '500': '#7057fb',
                '600': '#5e35f2',
                '700': '#4f23de',
                '800': '#421dba',
                '900': '#371999',
                '950': '#1c0c5c',
                DEFAULT: '#1c0c5c'
            },
            anzac: {
                '50': '#fbf9eb',
                '100': '#f6f0cb',
                '200': '#efe099',
                '300': '#e5c85f',
                '400': '#dfb642',
                '500': '#cd9a25',
                '600': '#b0781e',
                '700': '#8d571b',
                '800': '#76471d',
                '900': '#653c1e',
                '950': '#3a1e0e',
                DEFAULT: '#dfb642'
            },
        },
        fontFamily: {
                'body': [
                    'Inter',
                    'ui-sans-serif',
                    'system-ui',
                    '-apple-system',
                    'system-ui',
                    'Segoe UI',
                    'Roboto',
                    'Helvetica Neue',
                    'Arial',
                    'Noto Sans',
                    'sans-serif',
                    'Apple Color Emoji',
                    'Segoe UI Emoji',
                    'Segoe UI Symbol',
                    'Noto Color Emoji'
                ],
                'sans': [
                    'Inter',
                    'ui-sans-serif',
                    'system-ui',
                    '-apple-system',
                    'system-ui',
                    'Segoe UI',
                    'Roboto',
                    'Helvetica Neue',
                    'Arial',
                    'Noto Sans',
                    'sans-serif',
                    'Apple Color Emoji',
                    'Segoe UI Emoji',
                    'Segoe UI Symbol',
                    'Noto Color Emoji'
                ]
        },
        extend: {
            colors: {
                primary: {
                    50: "#eff6ff",
                    100: "#dbeafe",
                    200: "#bfdbfe",
                    300: "#93c5fd",
                    400: "#60a5fa",
                    500: "#3b82f6",
                    600: "#2563eb",
                    700: "#1d4ed8",
                    800: "#1e40af",
                    900: "#1e3a8a",
                    950: "#172554"
                },
                
            }
        }
    }
}
