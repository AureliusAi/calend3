const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Calend3", function () {
  let Contract, contract;
  let owner, addr1, addr2;

  // beforeEach will run before each test
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    Contract = await ethers.getContractFactory("Calend3");
    contract = await Contract.deploy();
    await contract.deployed;
  });

  it("Should set the minutely rate", async function () {
    const tx = await contract.setRate(1000);

    // wait until the transaction is mined
    await tx.wait();

    // verify rate is set correctly
    expect(await contract.getRate()).to.equal(1000);
  });

  it("Should fail to set  minutely rate", async function () {
    // call setRate using a different account address
    // this should fail since this address is not the owner
    await expect(contract.connect(addr1).setRate(500)).to.be.revertedWith("Only the owner can set the rate");
  });

  it("Should add two appointments", async function () {
    const tx1 = await contract.setRate(ethers.utils.parseEther("0.001"));
    await tx1.wait();
    const the_minute_rate = await contract.getRate();
    console.log("Rate " + the_minute_rate);

    const ownerBalance = await ethers.provider.getBalance(owner.address);
    const addr1Balance = await ethers.provider.getBalance(addr1.address);
    const addr2Balance = await ethers.provider.getBalance(addr2.address);
    console.log("ownerBalance: " + ownerBalance);

    console.log("addr1 addr1Balance: " + addr1Balance);
    console.log("meeting length in minutes: " + (1644150600 - 1644143400) / 60);
    const tx2 = await contract
      .connect(addr1)
      .createAppointment("Meeting with Part Time Larry", 1644143400, 1644150600, { value: ethers.utils.parseEther("2") });
    await tx2.wait();

    console.log("addr2 addr2Balance: " + addr2Balance);
    console.log("meeting length in minutes: " + (1644159600 - 1644154200) / 60);
    const tx3 = await contract.connect(addr2).createAppointment("Breakfast at Tiffany's", 1644154200, 1644159600, { value: ethers.utils.parseEther("1.5") });
    await tx3.wait();

    const appointments = await contract.getAppointments();
    expect(appointments.length).to.equal(2);

    const ownerBalance2 = await ethers.provider.getBalance(owner.address);
    const addr1Balance2 = await ethers.provider.getBalance(addr1.address);
    const addr2Balance2 = await ethers.provider.getBalance(addr2.address);

    console.log(ownerBalance2);
    console.log(addr1Balance2);
    console.log(addr2Balance2);

    const appointment1Fee = ((1644150600 - 1644143400) / 60) * the_minute_rate;
    const appointment2Fee = ((1644159600 - 1644154200) / 60) * the_minute_rate;

    console.log("appointment1Fee: " + appointment1Fee);
    console.log("appointment1Fee  2: " + appointments[0].amountPaid);
    console.log("appointment2Fee: " + appointment2Fee);
    console.log("appointment2Fee  2: " + appointments[1].amountPaid);

    // console.log("checksum 1");
    // expect(ownerBalance2 - ownerBalance).to.equal(appointment1Fee + appointment2Fee);
    // console.log("checksum 2");
    // expect(addr1Balance - addr1Balance2).to.equal(appointment1Fee);
    // console.log("checksum 3");
    // expect(addr2Balance - addr2Balance2).to.equal(appointment2Fee);
  });
});
