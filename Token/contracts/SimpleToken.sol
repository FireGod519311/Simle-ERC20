pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SimpleToken is ERC20, Ownable{
    constructor() ERC20("My Simple Token", "MST") Ownable(msg.sender){}
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

}