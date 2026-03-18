package com.forbids.service;

import com.forbids.dto.UserStatisticsResponse;
import com.forbids.model.User;
import com.forbids.repository.BidRepository;
import com.forbids.repository.FavoriteRepository;
import com.forbids.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StatisticsService {

    private final BidRepository bidRepository;
    private final ProductRepository productRepository;
    private final FavoriteRepository favoriteRepository;

    public StatisticsService(BidRepository bidRepository,
                           ProductRepository productRepository,
                           FavoriteRepository favoriteRepository) {
        this.bidRepository = bidRepository;
        this.productRepository = productRepository;
        this.favoriteRepository = favoriteRepository;
    }

    @Transactional(readOnly = true)
    public UserStatisticsResponse getUserStatistics(User user) {
        long totalBids = bidRepository.countByBidder(user);

        long wonAuctions = bidRepository.countWonAuctionsByBidder(user);

        double successRate = totalBids > 0 ? (wonAuctions * 100.0) / totalBids : 0.0;

        Double totalSpent = bidRepository.sumTotalSpentByBidder(user);
        if (totalSpent == null) {
            totalSpent = 0.0;
        }

        long activeProducts = productRepository.countByOwnerAndClosed(user, false);

        long closedProducts = productRepository.countByOwnerAndClosed(user, true);

        long totalFavorites = favoriteRepository.countByUser(user);

        long receivedBids = bidRepository.countReceivedBidsByOwner(user);

        return new UserStatisticsResponse(
            totalBids,
            wonAuctions,
            successRate,
            totalSpent,
            activeProducts,
            closedProducts,
            totalFavorites,
            receivedBids
        );
    }
}
