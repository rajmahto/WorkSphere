package com.worksphere.worksphere.service;

import com.worksphere.worksphere.entity.Attendance;
import com.worksphere.worksphere.entity.Employee;
import com.worksphere.worksphere.repository.AttendanceRepository;
import com.worksphere.worksphere.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiAnalyticsService {

    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final GeminiService geminiService;

    public AiAnalyticsService(
            EmployeeRepository employeeRepository,
            AttendanceRepository attendanceRepository,
            GeminiService geminiService) {

        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
        this.geminiService = geminiService;
    }

    public Map<String, Object> getAttendanceAnalytics() {

        List<Employee> employees = employeeRepository.findAll();
        List<Attendance> attendanceRecords = attendanceRepository.findAll();

        LocalDate today = LocalDate.now();

        long totalEmployees = employees.size();

        long totalAttendanceRecordsThisMonth =
                attendanceRecords.stream()
                        .filter(attendance ->
                                attendance.getDate() != null &&
                                        attendance.getDate().getMonth() == today.getMonth() &&
                                        attendance.getDate().getYear() == today.getYear()
                        )
                        .count();

        long presentRecordsThisMonth =
                attendanceRecords.stream()
                        .filter(attendance ->
                                attendance.getDate() != null &&
                                        attendance.getDate().getMonth() == today.getMonth() &&
                                        attendance.getDate().getYear() == today.getYear() &&
                                        "PRESENT".equalsIgnoreCase(attendance.getStatus())
                        )
                        .count();

        Map<String, Object> analytics = new LinkedHashMap<>();

        analytics.put("month", today.getMonth().toString());
        analytics.put("year", today.getYear());
        analytics.put("totalEmployees", totalEmployees);
        analytics.put(
                "totalAttendanceRecordsThisMonth",
                totalAttendanceRecordsThisMonth
        );
        analytics.put(
                "presentAttendanceRecordsThisMonth",
                presentRecordsThisMonth
        );

        return analytics;
    }

    public String explainAttendanceAnalytics() {

        Map<String, Object> analytics =
                getAttendanceAnalytics();

        String prompt = """
                You are an HR Analytics Assistant for WorkSphere.

                Analyze the attendance data provided below and give a concise, professional HR summary.

                Attendance data:
                %s

                Instructions:
                - Use ONLY the numbers and information provided.
                - Do not invent or assume any data.
                - Do not repeat the same numbers unnecessarily.
                - Focus on meaningful attendance insights.
                - Clearly distinguish attendance records from an actual attendance rate.
                - Do not calculate or claim an attendance percentage unless the data explicitly provides the required total working days.
                - Keep the response short and easy to understand.
                - Use a professional HR dashboard tone.
                - Start with a simple title without Markdown symbols.
                - Use 2-3 short sentences after the title.
                - Do not use unnecessary technical language.
                - Do not mention that you are an AI.
                """.formatted(analytics);

        return geminiService.askGemini(prompt);
    }
}