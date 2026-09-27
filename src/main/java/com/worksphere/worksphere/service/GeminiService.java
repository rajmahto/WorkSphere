package com.worksphere.worksphere.service;

import com.google.genai.Client;
import com.google.genai.errors.ApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    private final Client client;

    public GeminiService(@Value("${gemini.api-key}") String apiKey) {
        this.client = Client.builder()
                .apiKey(apiKey)
                .build();
    }

    public String askGemini(String prompt) {

        try {

            System.out.println(">>> Sending request to Gemini...");

            String response = client.models.generateContent(
                    "gemini-3.8-flash",
                    prompt,
                    null
            ).text();

            System.out.println(">>> Gemini response received");

            return response;

        } catch (ApiException e) {

            System.out.println(
                    ">>> Gemini API Error Code: " + e.code()
            );

            System.out.println(
                    ">>> Gemini API Error Message: " + e.getMessage()
            );

            throw new RuntimeException(
                    "Gemini API error: " + e.getMessage()
            );
        }
    }

    public String askHrAssistant(
            String employeeContext,
            String userMessage) {

        String prompt = """
            You are the HR Assistant for WorkSphere.

            Answer the employee's question using ONLY the employee data provided below.

            The employee data may contain:
            - Employee information
            - Leave balances
            - Payroll details including salary components

            Employee data:
            %s

            Employee question:
            %s

            Rules:
            - Never invent or assume employee data.
            - Use the actual payroll values when answering salary-related questions.
            - Use the actual leave balance when answering leave-related questions.
            - If the requested information is not available, clearly say that it is not available.
            - Keep the answer short, clear and friendly.
            - Do not expose sensitive information that is not relevant to the question.
            """.formatted(employeeContext, userMessage);

        return askGemini(prompt);
    }
}