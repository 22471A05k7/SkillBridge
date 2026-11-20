package com.skillbridge.state;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AppStateRepository extends JpaRepository<AppState, Long> {
    Optional<AppState> findByUserId(Long userId);
}
