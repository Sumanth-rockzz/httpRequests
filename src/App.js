import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://createhttp-eadcb-default-rtdb.firebaseio.com/movies.json');
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const data = await response.json();
      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          ...data[key]
        });
      }
      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  const addMovieHandler = useCallback(async (movie) => {
    try {
      const response = await fetch('https://createhttp-eadcb-default-rtdb.firebaseio.com/movies.json', {
        method: 'POST',
        body: JSON.stringify(movie),
        headers: {
          'Content-type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to add movie');
      }

      const data = await response.json();
      console.log(data);
      setMovies(prevMovies => [...prevMovies, { id: data.name, ...movie }]);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const deleteMovieHandler = useCallback(async (movieId) => {
    try {
      const response = await fetch(`https://createhttp-eadcb-default-rtdb.firebaseio.com/movies/${movieId}.json`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete movie');
      }

      setMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} onDeleteMovie={deleteMovieHandler} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
