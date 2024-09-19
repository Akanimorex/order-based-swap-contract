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

    const [owner, otherAccount] = await hre.ethers.getSigners();

    //transfer 100000 AKAN to contract

    const amount = ethers.parseUnits("100", 18);

    await guzToken.transfer(tokenSwap.getAddress(), amount);
    await akanToken.transfer(tokenSwap.getAddress(), amount);

    return {  owner,tokenSwap,akanToken,guzToken,otherAccount };
  }

  describe("Deployment", function () {
    it("should deploy contract", async function () {
      const {  owner,tokenSwap,akanToken,guzToken,otherAccount} = await loadFixture(deployContractAndSetVariables);
      // expect(await  stakeEth.owner()).to.equal(await owner.getAddress());
      expect(await tokenSwap.getAddress()).to.properAddress;
    });


    
  });

  
});
