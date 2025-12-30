package com.eatease.backend.repo;

import com.eatease.backend.model.Dish;
import com.eatease.backend.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DishRepo extends JpaRepository<Dish,Long> {
    List<Dish> findByRestaurant(Restaurant restaurant);
}
