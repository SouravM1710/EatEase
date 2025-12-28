package com.eatease.backend.model;


import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class Student {
    private int id;
    private String name;
    private int marks;

    public Student(int id, String name, int marks) {
        this.id = id;
        this.name = name;
        this.marks = marks;
    }
}
