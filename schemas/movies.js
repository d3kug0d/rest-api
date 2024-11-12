const z = require('zod')


const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'movie title must be a string',
    required_error: 'Movie title is required '
  }),
  release_year: z.number().int().min(1900).max(2024),
  director: z.string(),
  rating: z.number().min(0).max(10),
  genre: z.array(
    z.enum(["Action", "Adventure", "Comedy", "Drama", "Locuras","Problemas"]),
  {
    required_error: 'Movie Genre is Required',
    invalid_type_error: 'Movie genre must be an array of enum Genre',
  })
})


function validateMovie(input) {
    return movieSchema.safeParse(input)
}

function validatePartialMovie(input){
    return movieSchema.partial().safeParse(input)
}

module.exports = {
    validateMovie,
    validatePartialMovie
}