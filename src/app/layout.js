import './globals.css'

export const metadata = {
  title: 'Devora — Apprenez à coder gratuitement',
  description: "Plateforme d'apprentissage du code en profondeur. IA intégrée, gamification, parcours complet. 100% gratuit, 100% en français.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
