package com.worksphere.worksphere.repository;

import com.worksphere.worksphere.entity.Leave;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaveRepository extends JpaRepository<Leave, Long> {
}