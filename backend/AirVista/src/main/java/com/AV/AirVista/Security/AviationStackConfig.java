package com.AV.AirVista.Security;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Component
@ConfigurationProperties(prefix = "aviationstack.api")
@Data
public class AviationStackConfig {
    private String baseUrl;
    private String accessKey;
}
