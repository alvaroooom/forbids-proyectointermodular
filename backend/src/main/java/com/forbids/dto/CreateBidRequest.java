package com.forbids.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class CreateBidRequest {

    @NotNull(message = "El importe de la puja es obligatorio")
    @DecimalMin(value = "0.01", message = "La puja debe ser al menos 0,01")
    private BigDecimal amount;

    @Size(max = 500, message = "La URL de imagen no puede superar 500 caracteres")
    private String imageUrl;

    public CreateBidRequest() {
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
