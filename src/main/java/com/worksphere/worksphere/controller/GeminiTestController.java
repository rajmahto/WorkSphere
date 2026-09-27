package com.worksphere.worksphere.controller;

import com.worksphere.worksphere.service.GeminiService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GeminiTestController {

    private final GeminiService geminiService;

    public GeminiTestController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @GetMapping("/test-gemini")
    public String testGemini() {
        return geminiService.askGemini("Say hello to WorkSphere in one short sentence.");
    }
}