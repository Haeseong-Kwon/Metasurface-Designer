/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            width: {
                '85': '21.25rem',
            },
            boxShadow: {
                'premium': '0 0 30px rgba(59, 130, 246, 0.1)',
                'thumb': '0 0 15px rgba(255, 255, 255, 0.8)',
            }
        },
    },
    plugins: [],
}
