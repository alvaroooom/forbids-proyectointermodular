package com.forbids.service;

import com.forbids.dto.BidResponse;
import com.forbids.model.Bid;
import com.forbids.model.Product;
import com.forbids.model.User;
import com.forbids.repository.BidRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class BidService {

    private final BidRepository bidRepository;

    public BidService(BidRepository bidRepository) {
        this.bidRepository = bidRepository;
    }

    public BidResponse placeBid(Product product, User bidder, BigDecimal amount, String imageUrl) {
        if (Boolean.TRUE.equals(product.getClosed())) {
            throw new RuntimeException("Auction is closed");
        }

        if (product.getOwner().getId().equals(bidder.getId())) {
            throw new RuntimeException("You cannot bid on your own product");
        }

        BigDecimal currentPrice = bidRepository.findTopByProductOrderByAmountDesc(product)
                .map(Bid::getAmount)
                .orElse(product.getStartingPrice());

        if (amount.compareTo(currentPrice) <= 0) {
            throw new RuntimeException("Bid must be higher than current price");
        }

        String bidImageUrl = product.getImageUrl();
        if (bidImageUrl == null || bidImageUrl.isBlank()) {
            bidImageUrl = imageUrl;
        }

        if (bidImageUrl != null) {
            bidImageUrl = bidImageUrl.trim();
            if (bidImageUrl.isBlank()) {
                bidImageUrl = null;
            }
        }

        Bid bid = new Bid(amount, bidImageUrl, product, bidder);
        Bid savedBid = bidRepository.save(bid);

        return toResponse(savedBid);
    }

    public List<BidResponse> getBidsByProduct(Product product) {
        return bidRepository.findAllByProductOrderByAmountDesc(product)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private BidResponse toResponse(Bid bid) {
        return new BidResponse(
                bid.getId(),
                bid.getProduct().getId(),
                bid.getBidder().getId(),
                bid.getBidder().getUsername(),
                bid.getAmount(),
                bid.getImageUrl(),
                bid.getCreatedAt()
        );
    }
}
