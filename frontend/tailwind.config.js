/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./views/**/*.ejs",
        "./public/**/*.html",
        "./public/js/**/*.js"
    ],
    theme: {
        extend: {
            colors: {
                'health-good': '#10b981',
                'health-warning': '#f59e0b',
                'health-danger': '#ef4444',
                'bio-safe': '#059669',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}
