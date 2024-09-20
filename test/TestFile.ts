import { loadFixture,} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("TokenSwap", function () {

  async function deployContractAndSetVariables() {
    const Tokenswap = await ethers.getContractFactory("TokenSwap");
    const tokenSwap = await Tokenswap.deploy();

    //deploy two tokens
    const AKAN = await ethers.getContractFactory("AKAN");
    const GUZ = await ethers.getContractFactory("GUZ");
    const akanToken = await AKAN.deploy();
    const guzToken   = await GUZ.deploy();

    const [owner, otherAccount, depositor] = await hre.ethers.getSigners();

    //transfer 100000 AKAN to contract

    const amount = ethers.parseUnits("10000", 18);

    await guzToken.transfer(tokenSwap.getAddress(), amount);
    await akanToken.transfer(tokenSwap.getAddress(), amount);

    return {  owner,tokenSwap,akanToken,guzToken,otherAccount, depositor,amount };
  }

  describe("Deployment", function () {
    it("should deploy contract", async function () {
      const {  owner,tokenSwap,akanToken,guzToken,otherAccount,amount} = await loadFixture(deployContractAndSetVariables);
      expect(await tokenSwap.getAddress()).to.properAddress;
      expect(await akanToken.getAddress()).to.properAddress;
      expect(await guzToken.getAddress()).to.properAddress;
      expect(await tokenSwap.orderCount()).to.equal(0);
      expect(await guzToken.balanceOf(tokenSwap.getAddress())).to.equal(amount);
      expect(await akanToken.balanceOf(tokenSwap.getAddress())).to.equal(amount);
      // expect(tokenSwap.orders.)

    });
    
  });

  describe("createOrder", function () {
    it("should revert if amount offered is 0", async function () {
      const {  owner,tokenSwap,akanToken,guzToken,otherAccount} = await loadFixture(deployContractAndSetVariables);
      await expect(tokenSwap.connect(otherAccount).createOrder(akanToken.getAddress(), 0, guzToken.getAddress(), 100)).to.be.revertedWith("Amount offered must be greater than zero");
      await expect(tokenSwap.connect(otherAccount).createOrder(akanToken.getAddress(), 100, guzToken.getAddress(), 0)).to.be.revertedWith("Amount requested must be greater than zero");
    });

    it("should create order successfully", async function () {
      const {  owner,tokenSwap,akanToken,guzToken,otherAccount} = await loadFixture(deployContractAndSetVariables);
      const amount = ethers.parseUnits("10000", 18);
      await guzToken.transfer(tokenSwap.getAddress(), amount);
      await akanToken.transfer(tokenSwap.getAddress(), amount);

      const amountOffered  = ethers.parseUnits("1", 18);
      const amountRequested = ethers.parseUnits("1", 18);

      await akanToken.approve(tokenSwap.getAddress(), amountOffered);
      await guzToken.approve(tokenSwap.getAddress(), amountRequested);
      await tokenSwap.createOrder(akanToken.getAddress(), amountOffered, guzToken.getAddress(), amountRequested);
      // const order = await tokenSwap.orders(0);
      // // await expect(order.depositor).to.equal(otherAccount.getAddress());
      // // await expect(order.tokenOffered).to.equal(akanToken.getAddress());
      // // await expect(order.amountOffered).to.equal(amountOffered);
      // // await expect(order.tokenRequested).to.equal(guzToken.getAddress());
      // // await expect(order.amountRequested).to.equal(amountRequested);
      // // await expect(order.isActive).to.be.true;
    });
  });

  describe("fillOrder", function () {
    it("should revert if order is not active", async function () {
      const {  owner,tokenSwap,akanToken,guzToken,otherAccount} = await loadFixture(deployContractAndSetVariables);
      await expect(tokenSwap.connect(otherAccount).fillOrder(0)).to.be.revertedWith("Order is not active");
    });

    it("should fill order successfully", async function () {
      const {  owner,tokenSwap,akanToken,guzToken,otherAccount,depositor} = await loadFixture(deployContractAndSetVariables);
      const amount = ethers.parseUnits("100", 18);
      await guzToken.transfer(otherAccount, amount);
      await akanToken.transfer(depositor, amount);

      const amountOffered  = ethers.parseUnits("1", 18);
      const amountRequested = ethers.parseUnits("1", 18);



      // await akanToken.transfer(depositor, amountOffered);
      await akanToken.connect(depositor).approve(tokenSwap.getAddress(), amountOffered);
      await guzToken.connect(otherAccount).approve(tokenSwap.getAddress(),amountRequested)
      // await guzToken.approve(tokenSwap.getAddress(), amountRequested);
      await tokenSwap.connect(depositor).createOrder(akanToken.getAddress(), amountOffered, guzToken.getAddress(), amountRequested);

      // // Ensure otherAccount approves the tokenSwap contract to spend the requested amount
      // await guzToken.connect(otherAccount).approve(tokenSwap.getAddress(), amountRequested);
      // await akanToken.connect(otherAccount).approve(tokenSwap.getAddress(), amountOffered);

      await expect(tokenSwap.connect(otherAccount).fillOrder(0)).to.emit(tokenSwap, "OrderFilled");
    });
  });

  
});
