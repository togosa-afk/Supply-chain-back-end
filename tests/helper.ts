import axios from 'axios'

export const baseUrl = `http://localhost:3000`

const resetDatabase = async () => {
  await axios.post(`${baseUrl}/reset`)
}

export const createUser = async (email:string, name:string, password:string) => {
  try {
    const response = await axios.post(`${baseUrl}/users`, {
      email,
      name,
      password
    })
    return response.data
  } catch (error) {
    if (error.response) {
      const divider = '>'.repeat(28)
      const hint = [
        'Hint: adding a new user must handle requests with a',
        'password field even if you just ignore the value.',
        'Check that POST /api/users is not rejecting the',
        'request because of the password field.'
      ].join('\n')

      throw new Error(
        `${error.message}\n\n${divider}\n\n${hint}\n\n${divider}\n`,
        { cause: error }
      )
    }
    throw error
  }
}

export const login = async (email:string, password:string) => {
  const response = await axios.post(`${baseUrl}/login`, {
    email,
    password
  })
  return response.data.token
}

export const resetAndSeed = async () => {
  await resetDatabase()

  const user1 = await createUser('test1@example.com', 'Test User 1', 'password123')
  const user2 = await createUser('test2@example.com', 'Test User 2', 'password456')

  const token1 = await login('test1@example.com', 'password123')
  const token2 = await login('test2@example.com', 'password456')

  return {
    users: [user1, user2],
    tokens: [token1, token2]
  }
}
