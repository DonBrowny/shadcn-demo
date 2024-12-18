import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const pokemonApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://pokeapi.co/api/v2/',
  }),
  tagTypes: [],
  endpoints: (builder) => ({
    getPokemonByName: builder.query<{ species: { name: string }; sprites: { front_shiny: string } }, string>({
      query: (name) => `pokemon/${name}`,
    }),
    getPokemonList: builder.query<{ results: Array<{ name: string }> }, void>({
      query: () => `pokemon/`,
    }),
  }),
})

// Export hooks for usage in functional components
export const {
  useGetPokemonByNameQuery,
  useGetPokemonListQuery,
  util: { getRunningQueriesThunk },
} = pokemonApi

// export endpoints for use in SSR
export const { getPokemonByName, getPokemonList } = pokemonApi.endpoints
