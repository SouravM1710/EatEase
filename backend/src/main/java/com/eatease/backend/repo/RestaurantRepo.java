package com.eatease.backend.repo;

import com.eatease.backend.model.Restaurant;
import com.eatease.backend.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RestaurantRepo extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByOwner(Users owner);
}
