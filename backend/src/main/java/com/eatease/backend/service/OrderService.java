package com.eatease.backend.service;

import com.eatease.backend.model.*;
import com.eatease.backend.repo.OrderItemRepo;
import com.eatease.backend.repo.OrderRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class OrderService {
    private final OrderRepo orderRepo;
    private final OrderItemRepo orderItemRepo;

    public OrderService(OrderRepo orderRepo,
                        OrderItemRepo orderItemRepo) {
        this.orderRepo = orderRepo;
        this.orderItemRepo = orderItemRepo;
    }

    public Order placeOrder(Users customer,
                            Restaurant restaurant,
                            List<OrderItem> items) {

        if (customer.getRole() != Role.USER) {
            throw new RuntimeException("Only USER can place orders");
        }

        Order order = new Order();
        order.setCustomer(customer);
        order.setRestaurant(restaurant);
        order.setOrderTime(LocalDateTime.now());
        order.setStatus(OrderStatus.PLACED);

        Order savedOrder = orderRepo.save(order);

        for (OrderItem item : items) {
            item.setOrder(savedOrder);
            orderItemRepo.save(item);
        }

        return savedOrder;
    }
    public List<Order> getOrdersForCustomer(Users customer) {

        if (customer.getRole() != Role.USER) {
            throw new RuntimeException("Only USER can view their orders");
        }
        return orderRepo.findByCustomer(customer);
    }
    public List<Order> getOrdersForRestaurant(Restaurant restaurant, Users owner) {

        if (owner.getRole() != Role.OWNER && owner.getRole() != Role.ADMIN) {
            throw new RuntimeException("Access denied");
        }

        if (owner.getRole() != Role.ADMIN &&
                !Objects.equals(restaurant.getOwner().getId(), owner.getId())) {
            throw new RuntimeException("You do not own this restaurant");
        }

        return orderRepo.findByRestaurant(restaurant);
    }
    public Order updateOrderStatus(Long orderId,
                                   OrderStatus newStatus,
                                   Users owner) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (owner.getRole() != Role.ADMIN &&
                !Objects.equals(order.getRestaurant().getOwner().getId(),
                        owner.getId())) {
            throw new RuntimeException("Access denied");
        }

        order.setStatus(newStatus);
        return orderRepo.save(order);
    }
    public Order cancelOrder(Long orderId, Users customer) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!Objects.equals(order.getCustomer().getId(), customer.getId())) {
            throw new RuntimeException("You can cancel only your own orders");
        }

        if (order.getStatus() != OrderStatus.PLACED) {
            throw new RuntimeException("Order cannot be cancelled now");
        }

        order.setStatus(OrderStatus.CANCELLED);
        return orderRepo.save(order);
    }
    public List<Order> getAllOrders(Users admin) {

        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only ADMIN can view all orders");
        }

        return orderRepo.findAll();
    }
    public Order getOrderById(Long orderId) {
        return orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }
}
