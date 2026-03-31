
package com.cinematch.controller;

import com.cinematch.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin("*")
public class MovieController {

    private final MovieService service;

    @Autowired
    public MovieController(MovieService service) {
        this.service = service;
    }

    @GetMapping("/search")
    public String search(@RequestParam String query) {
        return service.smartSearch(query);
    }

    @GetMapping("/india")
    public String getIndianMovies() {
        return service.getIndianMovies();
    }

    @GetMapping("/language")
    public String getByLanguage(@RequestParam String lang) {
        return service.getMoviesByLanguage(lang);
    }

    @GetMapping("/recommend")
    public String recommend(
            @RequestParam String lang,
            @RequestParam String genre) {
        return service.getRecommendedMovies(lang, genre);
    }

    @GetMapping("/filter")
    public String filterMovies(
            @RequestParam String genre,
            @RequestParam String lang) {
        return service.getMoviesByGenreAndLanguage(genre, lang);
    }

    @GetMapping("/{id}")
    public String getMovie(@PathVariable Long id) {
        return service.getMovieDetails(id);
    }
}
