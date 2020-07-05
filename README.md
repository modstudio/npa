# Non-Profit Accounting Application 

## Project Background

### Introduction
This is a basic CRUD application, it’s function is to manage causes, pledges and record transactions for a nonprofit organization. Plus some other useful features.

### Quick Overview
- The user can add Contacts and Categories and Transactions.
- Categories are Causes, Pledges, Loans (loans given), Pikadon (loans taken, typically this is money loaned to the organization by a donor that has extra cash in place of keeping in a savings account).
- Contacts and Categories are relational. For example, a Pledge can be made by a Contact for a Cause.  
- Records are added to the Register for any of Category (record details are Catagory specific so that the user can record relevant info for that Catagory type).
- We can then get a sum for each Category by adding all the line items for a given Category.

### Features 
- Search & Filter
- Transfers
- Reports and Metrics
- Active/Inactive
- Import/Export
- Hebrew (Lunar) / English (Gregorian) Calendar
- Distribution classes

### Tech stack 
- Since this application will need to run on a Windows computer that does not have internet, Electron has been chosen. With Electron we can publish the app as a cross-platform application that can be installed on a Windows or Mac machine. 

### Authentication and users 
- This app is intended for use by a single user, user accounts, authentication, and user settings are not needed.

### Design

- Link to design file can be [found here](https://www.figma.com/file/5Xs4h1S51f7pKcZBwRcKvP/Accounting-App?node-id=0%3A1)
- Design by Shmuel Barkin of [modstud.io](modstud.io)
- Typography: [Rubik Typeface](https://fonts.google.com/specimen/Rubik) was chosen as it is open source and it has a full Hebrew character set (Hebrew character set by [Meir Sadan](https://meirsadan.com/))

-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-

## Technical documentation
_Coming soon_

-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-

## Other

### Contributing & Suggestions 
- Feel free to contribute to this project. If you have a bug fix or feature improvement, just make a pull request for us to review. 
- For suggestions reach out to Shmuel Barkin @ sb@sabrkin.com

### LICENSE
- This project is open sources under the MIT license
