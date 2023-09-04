package com.ssafy.jarviser.repository;

import com.ssafy.jarviser.domain.User;
import com.ssafy.jarviser.dto.RequestUpdateUserDto;
import com.ssafy.jarviser.dto.ResponseMypageDto;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long>{
    User findByEmail(String email);
    User findUserByName(String name);
    User findUserById(Long id);
    User findUserByNameAndEmail(String name,String email);

//    @Modifying
//    @Query("UPDATE User u SET u.password = :password, u.name = :name WHERE u.id = :id")
//    void updateUserById(long id,String name,String password);

}
