package com.eatease.backend.repo;

import com.eatease.backend.model.Order;
import com.eatease.backend.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepo extends JpaRepository<OrderItem,Long> {
    List<OrderItem> findByOrder(Order order);
}
