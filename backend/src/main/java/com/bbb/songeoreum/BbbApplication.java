package com.bbb.songeoreum;

import com.bbb.songeoreum.config.AppProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@EnableConfigurationProperties(AppProperties.class)
@SpringBootApplication
public class BbbApplication {

    public static void main(String[] args) {
        SpringApplication.run(BbbApplication.class, args);
    }

}
