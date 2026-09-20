package com.worksphere.worksphere.service;

import com.worksphere.worksphere.dto.EmployeeRequest;
import com.worksphere.worksphere.entity.Department;
import com.worksphere.worksphere.entity.Employee;
import com.worksphere.worksphere.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import com.worksphere.worksphere.repository.DepartmentRepository;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    public EmployeeService(EmployeeRepository employeeRepository,
                           DepartmentRepository departmentRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
    }

    public Employee saveEmployee(EmployeeRequest request) {

        Employee employee = new Employee();

        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setDesignation(request.getDesignation());
        employee.setJoiningDate(request.getJoiningDate());
        employee.setSalary(request.getSalary());

        Department department =
                departmentRepository.findById(request.getDepartmentId())
                        .orElse(null);

        employee.setDepartment(department);

        return employeeRepository.save(employee);
    }
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id).orElse(null);
    }

    public Employee updateEmployee(Long id, Employee employee) {

        Employee existingEmployee =
                employeeRepository.findById(id).orElse(null);

        if (existingEmployee == null) {
            return null;
        }

        existingEmployee.setName(employee.getName());
        existingEmployee.setEmail(employee.getEmail());
        existingEmployee.setPhone(employee.getPhone());
        existingEmployee.setDesignation(employee.getDesignation());

        if (employee.getDepartment() != null) {

            Long departmentId = employee.getDepartment().getId();

            Department department =
                    departmentRepository.findById(departmentId).orElse(null);

            existingEmployee.setDepartment(department);
        }

        existingEmployee.setJoiningDate(employee.getJoiningDate());
        existingEmployee.setSalary(employee.getSalary());

        return employeeRepository.save(existingEmployee);
    }

    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }

    public Employee getEmployeeByEmail(String email) {

        return employeeRepository
                .findByEmail(email)
                .orElse(null);
    }
}