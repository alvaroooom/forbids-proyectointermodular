package com.forbids.repository;

import com.forbids.model.Bid;
import com.forbids.model.Product;
import com.forbids.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {

    Optional<Bid> findTopByProductOrderByAmountDesc(Product product);

    List<Bid> findAllByProductOrderByAmountDesc(Product product);

    long countByProduct(Product product);

    long countByBidder(User bidder);

    @Query("SELECT COUNT(DISTINCT b.product) FROM Bid b WHERE b.bidder = :bidder AND b.product.closed = true AND b = (SELECT b2 FROM Bid b2 WHERE b2.product = b.product ORDER BY b2.amount DESC, b2.createdAt ASC LIMIT 1)")
    long countWonAuctionsByBidder(User bidder);

    @Query("SELECT COALESCE(SUM(b.amount), 0) FROM Bid b WHERE b.bidder = :bidder AND b.product.closed = true AND b = (SELECT b2 FROM Bid b2 WHERE b2.product = b.product ORDER BY b2.amount DESC, b2.createdAt ASC LIMIT 1)")
    Double sumTotalSpentByBidder(User bidder);

    @Query("SELECT COUNT(DISTINCT b) FROM Bid b WHERE b.product.owner = :owner")
    long countReceivedBidsByOwner(User owner);

    @Query("SELECT DISTINCT b.product FROM Bid b JOIN FETCH b.product.owner WHERE b.bidder = :bidder ORDER BY b.createdAt DESC")
    List<Product> findDistinctProductsByBidder(User bidder);
}
