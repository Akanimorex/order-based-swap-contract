// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";




contract TokenSwap {
    struct Order {
        address depositor;
        address tokenOffered;
        uint256 amountOffered;
        address tokenRequested;
        uint256 amountRequested;
        bool isActive;
    }

    mapping(uint256 => Order) public orders;
    uint256 public orderCount;

    event OrderCreated(uint256 orderId, address indexed depositor, address tokenOffered, uint256 amountOffered, address tokenRequested, uint256 amountRequested);
    event OrderFilled(uint256 orderId, address indexed buyer);

    function createOrder(address _tokenOffered, uint256 _amountOffered, address _tokenRequested, uint256 _amountRequested) external {
        require(_amountOffered > 0, "Amount offered must be greater than zero");
        require(_amountRequested > 0, "Amount requested must be greater than zero");

        IERC20(_tokenOffered).transferFrom(msg.sender, address(this), _amountOffered);

        Order memory newOrder;

        newOrder.depositor = msg.sender;
        newOrder.tokenOffered = _tokenOffered;
        newOrder.amountOffered = _amountOffered;
        newOrder.tokenRequested = _tokenRequested;
        newOrder.amountRequested = _amountRequested;
        newOrder.isActive = true;

        orders[orderCount] = newOrder;
        orderCount++;

      

        emit OrderCreated(orderCount - 1, msg.sender, _tokenOffered, _amountOffered, _tokenRequested, _amountRequested);
    }

    function fillOrder(uint256 _orderId) external {
        Order storage order = orders[_orderId];
        require(order.isActive, "Order is not active");

        IERC20(order.tokenRequested).transferFrom(msg.sender, order.depositor, order.amountRequested);
        IERC20(order.tokenOffered).transfer(msg.sender, order.amountOffered);

        order.isActive = false;

        emit OrderFilled(_orderId, msg.sender);
    }
}



