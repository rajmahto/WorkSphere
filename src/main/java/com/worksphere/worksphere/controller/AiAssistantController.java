package com.worksphere.worksphere.controller;

import com.worksphere.worksphere.service.AiAssistantService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.worksphere.worksphere.dto.AiChatRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@RestController
@RequestMapping("/ai/hr-assistant")
public class AiAssistantController {

    private final AiAssistantService aiAssistantService;

    public AiAssistantController(
            AiAssistantService aiAssistantService) {

        this.aiAssistantService = aiAssistantService;
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @GetMapping("/context")
    public Map<String, Object> getEmployeeContext(
            Authentication authentication) {

        return aiAssistantService
                .getEmployeeContext(authentication);
    }
    @PreAuthorize("hasRole('EMPLOYEE')")
    @PostMapping("/chat")
    public String chatWithHrAssistant(
            @RequestBody AiChatRequest request,
            Authentication authentication) {

        return aiAssistantService.chatWithHrAssistant(
                authentication,
                request.getMessage()
        );
    }
}
