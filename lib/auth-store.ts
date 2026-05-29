type StoredUser = {
  email: string
  name: string
  companyName: string
  password: string
  createdAt: string
}

const users = new Map<string, StoredUser>()

export function registerUser(
  email: string,
  name: string,
  password: string,
  companyName = "Minha Barbearia"
) {
  if (users.has(email)) {
    throw new Error("Este e-mail já possui cadastro.")
  }

  const user: StoredUser = {
    email,
    name,
    companyName,
    password,
    createdAt: new Date().toISOString(),
  }
  users.set(email, user)
  return { email, name, companyName }
}

export function findUser(email: string) {
  return users.get(email) ?? null
}

export function validatePassword(email: string, password: string) {
  const user = findUser(email)
  if (!user) return null
  if (user.password !== password) return null
  return { email: user.email, name: user.name, companyName: user.companyName }
}
