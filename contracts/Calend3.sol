// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Calend3 {
  // million dollar dap goes here
  uint private rate;
  address payable private owner;

  struct Appointment {
    string title;       // title of the meeting
    address attendee;   // person you are meeting
    uint startTime;     // start time of meeting
    uint endTime;       // end time of the meeting
    uint amountPaid;    // amount paid for the meeting
  }

  Appointment[] private appointments;

  constructor() {
    /* 
    What is msg.sender? 
    msg is a globally defined variable and the sender attribute contains the 
    address that called the function. Since we set this value in the constructor, 
    and the constructor is only called on deployment, the msg.sender will be 
    the Ethereum address that deployed the contract. 
    
    Since whoever deploys the contract owns the Calendar, we will be able to 
    verify that any configuration functions are only being called by the contract owner.
    */
    owner = payable(msg.sender);
  }

  function getAppointments() public view returns (Appointment[] memory) {
    return appointments;
  }

  /**
    creates a new appointment and appends to the appointments array
   */
  function createAppointment(string memory title, uint startTime, uint endTime) public payable {

    Appointment memory appointment;
    appointment.title = title;
    appointment.startTime = startTime;
    appointment.endTime = endTime;
    appointment.amountPaid = ((endTime - startTime) / 60) * rate;
    appointment.attendee = msg.sender;

    require(msg.value >= appointment.amountPaid, "Sorry, you require more ether to create an appointment");


    (bool success,) = owner.call{value: appointment.amountPaid}("");  // send ether to the owner

    require(success, "Failed to send Ether");

    appointments.push(appointment);
  }

  function getOwner() public view returns (address) {
    return owner;
  }

  function getRate() public view returns (uint) {
    return rate;
  }

  function setRate(uint _rate) public {
    require(msg.sender == owner, "Only the owner can set the rate");
    rate = _rate;
  }

}