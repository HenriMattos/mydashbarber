export function onlyDigits(value: string, maxLength: number) {
  return value.replace(/\D/g, "").slice(0, maxLength)
}

export function formatPhoneInput(value: string) {
  const digits = onlyDigits(value, 11)

  if (digits.length <= 2) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export function formatDateInput(value: string) {
  const digits = onlyDigits(value, 8)

  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

export function formatCpfInput(value: string) {
  const digits = onlyDigits(value, 11)

  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  }

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

export function formatCnpjInput(value: string) {
  const digits = onlyDigits(value, 14)

  if (digits.length <= 2) return digits
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`
  if (digits.length <= 8) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`
  }
  if (digits.length <= 12) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`
  }

  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`
}

export function formatCnpjCpfInput(value: string) {
  const digits = onlyDigits(value, 14)

  if (digits.length <= 11) return formatCpfInput(value)

  return formatCnpjInput(value)
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function isValidPhone(value: string) {
  const digits = onlyDigits(value, 13)
  return digits.length >= 10
}

export function isValidCpf(value: string) {
  const digits = onlyDigits(value, 11)
  if (digits.length !== 11) return false

  const allSame = digits.split("").every((d) => d === digits[0])
  if (allSame) return false

  let sum = 0
  for (let i = 0; i < 9; i++) sum += Number(digits[i]) * (10 - i)
  let remainder = (sum * 10) % 11
  if (remainder === 10) remainder = 0
  if (remainder !== Number(digits[9])) return false

  sum = 0
  for (let i = 0; i < 10; i++) sum += Number(digits[i]) * (11 - i)
  remainder = (sum * 10) % 11
  if (remainder === 10) remainder = 0

  return remainder === Number(digits[10])
}

export function isValidCnpj(value: string) {
  const digits = onlyDigits(value, 14)
  if (digits.length !== 14) return false

  const allSame = digits.split("").every((d) => d === digits[0])
  if (allSame) return false

  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  let sum = 0
  for (let i = 0; i < 12; i++) sum += Number(digits[i]) * w1[i]
  let remainder = sum % 11
  if (remainder < 2) remainder = 0
  else remainder = 11 - remainder
  if (remainder !== Number(digits[12])) return false

  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  sum = 0
  for (let i = 0; i < 13; i++) sum += Number(digits[i]) * w2[i]
  remainder = sum % 11
  if (remainder < 2) remainder = 0
  else remainder = 11 - remainder

  return remainder === Number(digits[13])
}

export function isValidCnpjCpf(value: string) {
  const digits = onlyDigits(value, 14)
  if (digits.length <= 11) return isValidCpf(value)
  return isValidCnpj(value)
}

export function formatCepInput(value: string) {
  const digits = onlyDigits(value, 8)

  if (digits.length <= 5) return digits

  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

export function formatUfInput(value: string) {
  return value
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 2)
    .toUpperCase()
}

export function formatNumberInput(value: string) {
  return onlyDigits(value, 8)
}

export function formatCurrencyInput(value: string) {
  const digits = onlyDigits(value, 12)
  if (!digits) return ""

  const amount = Number(digits) / 100

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
