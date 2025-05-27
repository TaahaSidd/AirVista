package com.AV.AirVista.Security;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

@ConfigurationProperties(prefix = "aviationstack.api")
@Data
public class AviationStackConfig {
    private String baseUrl;
    private String accessKey;
}
