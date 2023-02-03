package com.bbb.songeoreum;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class BbbApplication {

    public static void main(String[] args) {
        SpringApplication.run(BbbApplication.class, args);
    }

}
