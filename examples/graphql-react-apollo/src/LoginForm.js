import React, { useState, useEffect, useCallback } from 'react'
import { gql, useMutation, useLazyQuery } from '@apollo/client'

const LOG_IN = gql`
  mutation Login($username: String!) {
    user {
      id
      firstName
      lastName
    }
  }
`
const GET_USER = gql`
  query GetUser {
    user {
      name
    }
  }
`

export const LoginForm = () => {
  const [username, setUsername] = useState('')

  const [logIn, { data, loading, error }] = useMutation(LOG_IN, {
    variables: {
      username,
    },
  })

  const [fireQuery] = useLazyQuery(GET_USER)

  useEffect(() => {
    const doTheQuery = async () => {
      console.time('GetUser')
      await fireQuery()
      console.timeEnd('GetUser')
    }
    doTheQuery()
  }, [fireQuery])

  // Whenever we change our username input's value
  // update the corresponding state's value.
  const handleUsernameChange = useCallback((event) => {
    setUsername(event.target.value)
  }, [])

  // Handle a submit event of the form
  const handleFormSubmit = useCallback(
    (event) => {
      // Prevent the default behavior, as we don't want
      // for our page to reload upon submit.
      event.preventDefault()
      console.time('Login')
      logIn({
        variables: {
          username,
        },
      })
    },
    [username, logIn],
  )

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error while fetching the user data ({error.message})</p>
  }

  if (data) {
    return (
      <div>
        <h1>
          <span data-testid="firstName">{data.user.firstName}</span>{' '}
          <span data-testid="lastName">{data.user.lastName}</span>
        </h1>
        <p data-testid="userId">{data.user.id}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          name="username"
          value={username}
          onChange={handleUsernameChange}
        />
        <button type="submit">Submit</button>
      </div>
    </form>
  )
}
