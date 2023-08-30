const Telesign = require('telesignsdk');

const customerId = '824D5B27-6D47-464D-B7C4-C6EF9C67D897';
const apiKey = 'DYFGlK7tL0GJg9abtcr1oKZGgL8UGs0521dCWZt5ARFOVclRaC7tv0HQi7z19S9iGdYZl/DJrB6aZmmqRjMuJg==';
const restEndpoint = 'https://rest-api.telesign.com';

const client = new Telesign(customerId, apiKey, restEndpoint);
const referenceId = '56291869DE600A6891912AD7EEA84251'; // Replace with your reference ID

client.sms.status((error, response) => {
  if (error) {
    console.error('Error fetching message status', error);
  } else {
    console.log('Message status:', response);
  }
}, referenceId);
