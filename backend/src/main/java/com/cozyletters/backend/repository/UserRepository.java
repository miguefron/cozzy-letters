package com.cozyletters.backend.repository;

import com.cozyletters.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    @Query(value = "SELECT * FROM users WHERE id != :excludeId ORDER BY RANDOM() LIMIT :count", nativeQuery = true)
    List<User> findRandomUsersExcluding(@Param("excludeId") Long excludeId, @Param("count") int count);
}
