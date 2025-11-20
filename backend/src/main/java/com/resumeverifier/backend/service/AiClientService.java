package com.resumeverifier.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
public class AiClientService {

    private final WebClient webClient;

    public AiClientService(WebClient.Builder webClientBuilder, @Value("${ai.service.url}") String aiServiceUrl) {
        this.webClient = webClientBuilder.baseUrl(aiServiceUrl).build();
    }

    public Mono<Map> verifyResume(String extractedText, String extractedEntitiesJson) {
        Map<String, String> requestBody = Map.of(
                "text", extractedText,
                "entities", extractedEntitiesJson);

        return webClient.post()
                .uri("/verify")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class);
    }
}
