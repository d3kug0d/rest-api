const express = require('express') // commonJS
const movies = require('./movies.json')
const crypto = require('node:crypto');
const {validateMovie, validatePartialMovie} = require('./schemas/movies')
const app = express()
const PORT = process.env.PORT ?? 1234
const cors = require('cors')

app.disable('x-powered-by') // unabled powerby
app.use(express.json())
app.use(cors({
  origin: (origin,callback) =>{
  // normal Methods: GET/HEAD/POST
  // Complex method: PUT/PATCH/DELETE

  // CORS PRE-FLIGHT
  // OPTIONS

  const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:1234',
  'https://movies.com'

  ]  

  if(ACCEPTED_ORIGINS.includes(origin)){
    return callback(null,true)
  }

  if(!origin){
    return callback(null,true)
  }

  return callback(new Error('Not Allowed by CORS'))
}
}))



app.get('/', (req, res) => {
  // read the query param format
  res.json({ movies})
})

// all the resource wich be MOVIES identify as /movies
app.get('/movies' , ( req, res ) => {
  // when u are the same path u cannot get the req

  
  
  const { genre } = req.params
  if(genre){
    const filteredMovies = movies.filter(
      movie => movie.genre.includes(filteredMovies)
    )
  }
  res.json(movies)
})

app.get('/movies/:id', (req, res)=>{
  const {id} = req.params
  const movie = movies.find( movie => movie.id === id)
  if (movie) return res.json(movie)
  res.status(404).json({message:"Movie not found"})
})


app.post('/movies', (req,res) => {

  const result = validateMovie(req.body)

  /* 

  for validate the params we could do it each one with an if
  */

  /*

  if(!title || !director || !release_year || !genre || !rating ){
    return res.status(400).json({message: "Missing required fields"})
  }

  if(!title ){
    return res.status(400).json({message: "Does not have Title"})
  }

  if(!director){
    return res.status(400).json({message: "Must have a director"})
  }

  */

  if(!result.success){
    //422 Unaprocessable Entity
    return res.status(400).json({ error : JSON.parse(result.error.message)})
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data // isnt te same req.body
  } 

  movies.push(newMovie)
  res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updateMovie

  return res.json(updateMovie)
})

app.delete('/movies/:id', (req, res) => {
  const {id} = req.params
  const movieIndex = movies.findIndex( index => index.id === id)
  

  if(movieIndex === - 1){
    res.status(404).json({message: "Movie not found"})
  }

  movies.slice(movieIndex,1)
  return res.json({message: "Movie Delete"})
})

app.options('/movies/:id', (req,res) =>{

 
  res.sendStatus(200)
})

app.listen(port, () => {
  console.log(`the api its listen in http://localhost:${port}`)
})
