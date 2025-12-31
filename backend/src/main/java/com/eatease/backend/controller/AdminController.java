package com.eatease.backend.controller;


import com.eatease.backend.model.Order;
import com.eatease.backend.model.Restaurant;
import com.eatease.backend.model.Users;
import com.eatease.backend.service.OrderService;
import com.eatease.backend.service.RestaurantService;
import com.eatease.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private final UserService userService;
    private final RestaurantService restaurantService;
    private final OrderService orderService;

    public AdminController(UserService userService,
                           RestaurantService restaurantService,
                           OrderService orderService) {
        this.userService = userService;
        this.restaurantService = restaurantService;
        this.orderService = orderService;
    }

    @GetMapping("/users")
    public List<Users> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/users/{userId}")
    public Users getUserById(@PathVariable Long userId) {
        return userService.getById(userId);
    }

    @GetMapping("/restaurants")
    public List<Restaurant> getAllRestaurants() {
        return restaurantService.getAllRestaurants();
    }

    // Delete restaurant (admin override)
    @DeleteMapping("/restaurants/{restaurantId}")
    public void deleteRestaurant(@PathVariable Long restaurantId) {
        restaurantService.deleteRestaurantAsAdmin(restaurantId);
    }

    @GetMapping("/orders")
    public List<Order> getAllOrders(Principal principal) {

        Users admin = userService.getByUsername(principal.getName());
        return orderService.getAllOrders(admin);
    }

    @GetMapping("/orders/{orderId}")
    public Order getOrderById(@PathVariable Long orderId) {
        return orderService.getOrderById(orderId);
    }

}
