package com.eatease.backend.repo;

import com.eatease.backend.model.Order;
import com.eatease.backend.model.Restaurant;
import com.eatease.backend.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepo extends JpaRepository<Order, Long> {
    List<Order> findByCustomer(Users customer);

    List<Order> findByRestaurant(Restaurant restaurant);
}
