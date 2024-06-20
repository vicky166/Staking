import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("Turbo ICO", function () {
  ``;
  async function deployOneYearLockFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, bob, jack, alice] = await hre.ethers.getSigners();

    const Turbo = await hre.ethers.getContractFactory("Staking");
    const turbo = await Turbo.deploy();

    const TurboIco = await hre.ethers.getContractFactory("Stake");
    const turboIco = await TurboIco.deploy(turbo.getAddress());

    return { turboIco, turbo, owner, bob, alice, jack };
  }

  it("Should mint token", async function () {
    const { turbo, owner } = await loadFixture(deployOneYearLockFixture);

    const ownerBalance = await turbo.balanceOf(owner.getAddress());
    const toalSupply = await turbo.totalSupply();
    expect(ownerBalance).to.equal(toalSupply);
  });

  it("should approve allowance", async function () {
    const { turbo, owner, alice } = await loadFixture(deployOneYearLockFixture);

    await turbo.connect(owner).mint();
    const allowanceAmount = hre.ethers.parseEther("100");

    await turbo.connect(owner).approve(alice.getAddress(), allowanceAmount);
    const allowance = await turbo.allowance(
      owner.getAddress(),
      alice.getAddress()
    );

    expect(allowance).to.equal(allowanceAmount);
  });

  it("should stake", async function () {
    const { turbo, turboIco, bob, owner } = await loadFixture(
      deployOneYearLockFixture
    );
    const initialBalance = hre.ethers.parseEther("10");
    await turbo.connect(owner).mint();
    await turbo.connect(owner).approve(bob.address, initialBalance);
    await turbo.connect(bob).approve(turboIco, initialBalance);
    await turboIco.connect(bob).stake({ value: initialBalance });
    const stakedBalance = await turboIco.stakedAmount(bob.address);
    expect(stakedBalance).to.equal(initialBalance);
  });

  it("should unstake", async function () {
    const { turbo, turboIco, bob, owner } = await loadFixture(
      deployOneYearLockFixture
    );
    const initialBalance = hre.ethers.parseEther("10");
    const unstakeAmount = hre.ethers.parseEther("2");

    await turbo.connect(owner).mint();
    await turbo.connect(owner).approve(bob.address, initialBalance);
    await turbo.connect(bob).approve(turboIco, initialBalance);
    await turboIco.connect(bob).stake({ value: initialBalance });
    await turboIco.connect(bob).unstake(unstakeAmount);
    const stakedBalance = await turboIco.stakedAmount(bob.address);
    expect(stakedBalance).to.equal(initialBalance);
  });

  it("should getreward", async function () {
    const { turbo, turboIco, bob } = await loadFixture(
      deployOneYearLockFixture
    );
    const initialBalance = hre.ethers.parseEther("3");
    await turbo.mint();
    await turboIco.connect(bob).stake({ value: initialBalance });
    await turboIco.stake();
    const StakingMoney = 3 * 10 ** 18;
    const stakedTimeSeconds = 1;
    const rewardRatePerDays = (5 * 1e18) / 10;
    const reward =
      ((StakingMoney * rewardRatePerDays) / 1e18) * (stakedTimeSeconds / 10);
    const totalReward = (reward * 2) / 100;
    const rewardAmount = await turboIco.connect(bob).getReward();
    const totalreward = await turboIco.MIN_STAKE_PERIOD();
  });
});
