package com.example.leadmanager.repository;

import com.example.leadmanager.model.ProposalRequest;
import com.example.leadmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProposalRequestRepository extends JpaRepository<ProposalRequest, Long> {

    List<ProposalRequest> findByRequestedById(Long userId);

    List<ProposalRequest> findByAssignedToId(Long userId);

    List<ProposalRequest> findByLeadId(Long leadId);

    List<ProposalRequest> findByAssignedTo(User user);

    List<ProposalRequest> findByRequestedBy(User user);

    void deleteByLeadId(Long id);

    @Query("SELECT CASE WHEN p.completed = true THEN 'Completed' ELSE 'Pending' END, COUNT(p) FROM ProposalRequest p GROUP BY p.completed")
    List<Object[]> getProposalCompletion();



}
