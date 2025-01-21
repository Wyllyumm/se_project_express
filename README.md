# WTWR (What to Wear?): Back End

This project focuses on creating a server that will identify, authenticate, and authorize users who login to the application. In this project we create middleware that will keep users logged with a JWT, as well as differentiate between which users are logged in along with the permissions that they may have. Using mongoose, we are able to connect to the MongoDB database in order to test the backend of the "WTWR" website. With the use of a custom mongoose method, we are also able to maintain unique email addresses within the server.

Features:

- In this sprint(sprint 15) we register our application for a subdomain name, so that users can actually pull up the website with the name instead of the IP addres, Making it more ideal and practical for users.
  Domain Names:
  - idk-wtwr.mindhackers.org, www.idk-wtwr.mindhackers.org, api.idk-wtwr.mindhackers.org
- We use Nginx so that request sent to the domain name are redirected to port 3001 which is what the application is set up on
- Through the use of certbot, we are able to issue an SSL certificate to activate https for our website so requests sent to our backend are more secure.
- Now with the subdomains registered and the frontend deployed, we are able to utilize nginx to work with the frontend so that when users send in requests such as registering to the website, logging in, adding clothing items, etc from the frontend server, this being www.idk-wtwr.mindhackers.org(with/without "wwww"), are sent to the backend server (api.idk-wtwr.mindhackers).
- From the home page users will be able to see the current date, weather, and a section of clothes filtered based on the type of weather they may be experiencing.
- Once Logged in, users will be able to like/dislike/delete their own items, and even add clothing items that they feel will be fitting for the current weather.
https://drive.google.com/file/d/1JfxFVMsN-OCvPOr3XPzWZcGt6S-zo1dN/view?usp=sharing
https://drive.google.com/file/d/1dKwhrdLmaIP-rOJg-ZHbCcw5Be11CatZ/view?usp=sharing
https://drive.google.com/file/d/1Liq4EC8rtVV3GbLIkKBmR7AShqlLalED/view?usp=sharing
