export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Bigood",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Sistema de gestao para barbearias com agenda, caixa, clientes e planos de assinatura.",
    author: {
      "@type": "Organization",
      name: "Bigood",
      url: "https://bigood.app",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
