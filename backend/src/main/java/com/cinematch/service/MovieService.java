package com.cinematch.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class MovieService {

    @Value("${tmdb.api.key}")
    private String apiKey;

    private final WebClient webClient = WebClient.create("https://api.themoviedb.org/3");

    private String getGenreId(String query) {
        query = query.toLowerCase();

        switch (query) {
            case "action": return "28";
            case "comedy": return "35";
            case "drama": return "18";
            case "thriller": return "53";
            case "romance": return "10749";
            case "horror": return "27";
            default: return null;
        }
    }

    public String smartSearch(String query) {
        String genreId = getGenreId(query);

        if (genreId != null) {
            return webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/discover/movie")
                            .queryParam("api_key", apiKey)
                            .queryParam("with_genres", genreId)
                            .queryParam("region", "IN")
                            .build())
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        }

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search/movie")
                        .queryParam("api_key", apiKey)
                        .queryParam("query", query)
                        .queryParam("region", "IN")
                        .build())
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String getIndianMovies() {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/discover/movie")
                        .queryParam("api_key", apiKey)
                        .queryParam("region", "IN")
                        .queryParam("sort_by", "popularity.desc")
                        .build())
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String getMoviesByLanguage(String lang) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/discover/movie")
                        .queryParam("api_key", apiKey)
                        .queryParam("with_original_language", lang)
                        .queryParam("region", "IN")
                        .build())
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String getRecommendedMovies(String language, String genreId) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/discover/movie")
                        .queryParam("api_key", apiKey)
                        .queryParam("with_original_language", language)
                        .queryParam("with_genres", genreId)
                        .queryParam("region", "IN")
                        .queryParam("sort_by", "popularity.desc")
                        .build())
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String getMoviesByGenreAndLanguage(String genreId, String language) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/discover/movie")
                        .queryParam("api_key", apiKey)
                        .queryParam("with_genres", genreId)
                        .queryParam("with_original_language", language)
                        .queryParam("region", "IN")
                        .queryParam("sort_by", "popularity.desc")
                        .build())
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String getMovieDetails(Long id) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/" + id)
                        .queryParam("api_key", apiKey)
                        .queryParam("append_to_response", "credits,reviews,watch/providers")
                        .build())
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
