package com.eatease.backend.controller;

import com.eatease.backend.model.*;
import com.eatease.backend.service.DishService;
import com.eatease.backend.service.OrderService;
import com.eatease.backend.service.RestaurantService;
import com.eatease.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/customer")
public class CustomerController {
    private final RestaurantService restaurantService;
    private final DishService dishService;
    private final OrderService orderService;
    private final UserService userService;

    public CustomerController(RestaurantService restaurantService, DishService dishService, OrderService orderService, UserService userService) {
        this.restaurantService = restaurantService;
        this.dishService = dishService;
        this.orderService = orderService;
        this.userService = userService;
    }

    @GetMapping("/restaurants")
    public List<Restaurant> getAllRestaurants() {
        return restaurantService.getAllRestaurants();
    }

    @GetMapping("/restaurants/{restaurantId}/menu")
    public List<Dish> getMenu(@PathVariable Long restaurantId) {
        Restaurant restaurant = restaurantService.getById(restaurantId);
        return dishService.getMenu(restaurant);
    }

    @PostMapping("/restaurants/{restaurantId}/orders")
    public Order placeOrder(@PathVariable Long restaurantId,
                            @RequestBody List<OrderItem> items,
                            Principal principal) {

        Users customer = userService.getByUsername(principal.getName());
        Restaurant restaurant = restaurantService.getById(restaurantId);

        return orderService.placeOrder(customer, restaurant, items);
    }

    @GetMapping("/orders")
    public List<Order> getMyOrders(Principal principal) {

        Users customer = userService.getByUsername(principal.getName());
        return orderService.getOrdersForCustomer(customer);
    }

    @DeleteMapping("/orders/{orderId}")
    public Order cancelOrder(@PathVariable Long orderId,
                             Principal principal) {

        Users customer = userService.getByUsername(principal.getName());
        return orderService.cancelOrder(orderId, customer);
    }
}
