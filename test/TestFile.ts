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
    const akan = await AKAN.deploy();
    const guz = await GUZ.deploy();

    const [owner, otherAccount] = await hre.ethers.getSigners();

    //transfer 100000 AKAN to contract

    const amount = ethers.parseUnits("100", 18);

    await guz.transfer(tokenSwap.getAddress(), amount);
    await akan.transfer(tokenSwap.getAddress(), amount);

    return {  owner,tokenSwap,akan,guz,otherAccount };
  }

  describe("Deployment", function () {
    it("", async function () {
      // const { stakeEth, owner} = await loadFixture(deployContractAndSetVariables);
      // expect(await  stakeEth.owner()).to.equal(await owner.getAddress());
      
      
    });


    
  });

  
});
