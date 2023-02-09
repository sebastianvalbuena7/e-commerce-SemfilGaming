package com.mindhub.semfilgaming.DTOs;

import java.util.List;

public class PurchaseTicketDTO {
    private List<ProductPurchaseApplicationDTO> products;
    private Double totalAmount;

    PurchaseTicketDTO() {}
    PurchaseTicketDTO(List<ProductPurchaseApplicationDTO> products, Double totalAmount) {
        this.products = products;
        this.totalAmount = totalAmount;
    }

    public List<ProductPurchaseApplicationDTO> getProducts() {
        return products;
    }

    public void setProducts(List<ProductPurchaseApplicationDTO> products) {
        this.products = products;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
}
