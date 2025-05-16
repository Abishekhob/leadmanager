package com.example.leadmanager.repository;

import com.example.leadmanager.model.Lead;
import com.example.leadmanager.model.User;
import com.example.leadmanager.model.enums.LeadStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {
    List<Lead> findByAssignedTo(User user);
    List<Lead> findByStatus(LeadStatus status);
    List<Lead> findByAssignedToIsNull();

    @Query("SELECT l.source, COUNT(l) FROM Lead l GROUP BY l.source")
    List<Object[]> getLeadsBySource();

    @Query("SELECT " +
            "CASE WHEN l.status = 'Closed' THEN CAST(l.outcome AS string) ELSE CAST(l.status AS string) END, " +
            "COUNT(l) " +
            "FROM Lead l " +
            "GROUP BY CASE WHEN l.status = 'Closed' THEN CAST(l.outcome AS string) ELSE CAST(l.status AS string) END")
    List<Object[]> getLeadOutcomes();


    @Query("SELECT DISTINCT l.source FROM Lead l WHERE l.source IS NOT NULL")
    List<String> findDistinctSources();


    @Query("SELECT l FROM Lead l WHERE l.assignedTo = :user AND " +
            "(LOWER(l.name) LIKE :keyword OR LOWER(l.email) LIKE :keyword)")
    List<Lead> findByAssignedToAndKeyword(@Param("user") User user, @Param("keyword") String keyword);


}