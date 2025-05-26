package com.AV.AirVista;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

import com.AV.AirVista.Security.AviationStackConfig;

@SpringBootApplication
@EnableConfigurationProperties(AviationStackConfig.class)
public class AirVistaApplication {

	public static void main(String[] args) {
		SpringApplication.run(AirVistaApplication.class, args);
	}

	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}

}
