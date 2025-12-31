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
@RequestMapping("/owner")
public class OwnerController {
    private final RestaurantService restaurantService;
    private final DishService dishService;
    private final OrderService orderService;
    private final UserService userService;

    public OwnerController(RestaurantService restaurantService, DishService dishService, OrderService orderService, UserService userService) {
        this.restaurantService = restaurantService;
        this.dishService = dishService;
        this.orderService = orderService;
        this.userService = userService;
    }

    @PostMapping("/restaurants")
    public Restaurant createRestaurant(@RequestBody Restaurant restaurant,
                                       Principal principal) {
        Users owner = userService.getByUsername(principal.getName());
        return restaurantService.createRestaurant(restaurant, owner);
    }

    @GetMapping("/restaurants")
    public List<Restaurant> getMyRestaurants(Principal principal) {

        Users owner = userService.getByUsername(principal.getName());
        return restaurantService.getRestaurantsForOwner(owner);
    }

    @PostMapping("/restaurants/{restaurantId}/dishes")
    public Dish addDish(@PathVariable Long restaurantId,
                        @RequestBody Dish dish,
                        Principal principal) {

        Users owner = userService.getByUsername(principal.getName());
        Restaurant restaurant = restaurantService.getById(restaurantId);

        return dishService.addDish(dish, restaurant, owner);
    }

    @PutMapping("/restaurants/{restaurantId}/dishes/{dishId}")
    public Dish updateDish(@PathVariable Long restaurantId,
                           @PathVariable Long dishId,
                           @RequestBody Dish dish,
                           Principal principal) {

        Users owner = userService.getByUsername(principal.getName());
        Restaurant restaurant = restaurantService.getById(restaurantId);

        return dishService.updateDish(dishId, dish, restaurant, owner);
    }

    @DeleteMapping("/restaurants/{restaurantId}/dishes/{dishId}")
    public void deleteDish(@PathVariable Long restaurantId,
                           @PathVariable Long dishId,
                           Principal principal) {

        Users owner = userService.getByUsername(principal.getName());
        Restaurant restaurant = restaurantService.getById(restaurantId);

        dishService.deleteDish(dishId, restaurant, owner);
    }

    @GetMapping("/restaurants/{restaurantId}/orders")
    public List<Order> getOrdersForRestaurant(@PathVariable Long restaurantId,
                                              Principal principal) {

        Users owner = userService.getByUsername(principal.getName());
        Restaurant restaurant = restaurantService.getById(restaurantId);

        return orderService.getOrdersForRestaurant(restaurant, owner);
    }

    @PutMapping("/orders/{orderId}/status")
    public Order updateOrderStatus(@PathVariable Long orderId,
                                   @RequestParam OrderStatus status,
                                   Principal principal) {

        Users owner = userService.getByUsername(principal.getName());
        return orderService.updateOrderStatus(orderId, status, owner);
    }
}
