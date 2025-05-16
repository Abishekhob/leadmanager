package com.example.leadmanager.repository;

import com.example.leadmanager.model.LeadActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadActivityRepository extends JpaRepository<LeadActivity, Long> {
    List<LeadActivity> findByLeadId(Long leadId);
    List<LeadActivity> findByLeadIdOrderByTimestampDesc(Long leadId);

    void deleteByLeadId(Long id);

    @Query("SELECT la.action, COUNT(la) FROM LeadActivity la GROUP BY la.action")
    List<Object[]> getActivityFrequency();

    @Query("SELECT la.user.name, COUNT(la) FROM LeadActivity la GROUP BY la.user.name")
    List<Object[]> getUserActivityVolume();


}
