package com.example.leadmanager.repository;

import com.example.leadmanager.model.FollowUp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FollowUpRepository extends JpaRepository<FollowUp, Long> {
    List<FollowUp> findByFollowUpDate(LocalDate date);
    List<FollowUp> findByLeadId(Long leadId);
    List<FollowUp> findByLead_AssignedTo_IdAndFollowUpDateAfterOrderByFollowUpDateAsc(Long userId, LocalDate now);
    List<FollowUp> findByLeadIdOrderByFollowUpDateAsc(Long leadId);

    void deleteByLeadId(Long id);

    @Query("SELECT CASE WHEN f.completed = true THEN 'Completed' ELSE 'Pending' END, COUNT(f) FROM FollowUp f GROUP BY f.completed")
    List<Object[]> getFollowUpCompletion();


    long countByLeadId(Long leadId);
}


