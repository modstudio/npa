# Non Profit Accounting Application 

## Project Background

### Introduction
This application is a basic CRUD application, it’s function is to record transactions and pledges for a nonprofit organization.

### Quick Overview
- The user can add Contacts and Categories and Transactions
- Categories are: Causes, Pledges, Loans (loans given), Pikadon (loans taken, typically this is money loaned to the organization by a donor that has extra cash in place of keeping in a savings account)
- Contacts and categories are relational. For example, a Pledge can be made by a Conact for a Cause.  
- Line items are added to the Register for any of category (each category has different line items that can be added that are relevant to it)
- We can then get a sum for each category by adding all the line items for a given catgory.

### Features 
- Search & Filter
- Reports and Metrics
- Active/Inactive
- Import/Export
- Hebrew (Lunar) / English (Gregorian) Calendar
- Distribution classes

### Tech stack 
- Since this application will need to run on a Windows computer that does not have internet, Electron has been chosen. With Electron we can publish the app as a cross-platform applicaiton that can be installed on a Windows or Mac machine. 

### Authentication and users 
- This app is intended for use by a single user, user accounts and authentication or user settings are not needed.

### Design
- Link to design file can be [found here](https://sketch.cloud/s/r0w8x) (The styleguide is not fully comprehensive as it was based on an existing project which has a comprehensive styleguide.)
- Desing by Shmuel Barkin of [modstud.io](modstud.io)
- Typography: [Rubik Typeface](https://fonts.google.com/specimen/Rubik) was choosen as it is open source and it has a full Hebrew character set (Hebrew character set by [Meir Sadan](https://meirsadan.com/))

-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-

## Technical documentation
_coming soon_

-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-

## Other

### Contributing & Suggestions 
- Feel free to contribute to this project. If you have a bug fix or feature improvement, just make a pull request for us to review. 
- For suggestions reach out to Shmuel Barkin @ sb@sabrkin.com

### LICENSE
- This project is open sources under the MIT licence
