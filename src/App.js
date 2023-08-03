import React,{useState} from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies,setMovies]=useState([]);
  const [isLoading,setIsLoading]=useState(false);
  const [error,setError]=useState(null);
 async function fetchMovieHandler(){
  try{
    setIsLoading(true);
    setError(null);
    const response = await fetch('https://swapi.dev/api/film/');
    console.log(response)
    if(!response.ok){
      throw new Error("Something Went Wrong")
    }
    const data=await response.json();
    
    const transformedMovies=data.results.map((movie)=>{
      return {
        id:movie.episode_id,
        title:movie.title,
        openingText:movie.opening_crawl,
        releaseDate:movie.release_date
      }
    })
    setMovies(transformedMovies)

  }catch(error){
    console.log(error.message);
    setError(error.message)
  }
  setIsLoading(false);
 }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>
      {!isLoading && movies.length>0 && <MoviesList movies={movies} />}
      {!isLoading && movies.length===0 && !error && <p>No Movies Found</p>}
      {isLoading && <p>Loading....</p>}
      {error &&<p>{error}</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
