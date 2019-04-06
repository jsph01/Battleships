# Battleships

Current functions
- registration front end input validation
- registration username validation
- registration acount creation in database
- valid registration performs login and saves username as a cookie

- login front end input validation
- login credentials validation
- login saves the username as a cookie

- account page with no query redirects to the user's account page if logged in, or to the login page if not logged in.
- using mantra or image pages will redirect to login page if not logged in.

- account page loads account data for username defined by query
- account page loads image from a static file based on the account's imageID
- edit mantra and update database
- account profile image selection updates the account's imageID in database
- account edditing options are only visible to the user if he is logged in with the username in the url (by checking cookies)

- highscores page shows top 100 accounts ordered by rank

- game selection redirection

- single player game includes the setup stage of battleship

Notes
  - go to localhost:3000/highscores to view the highscores list and to navigate to other users' account pages.
  - currently, the 'rank' of an accout is assigned by order of registartion
  - MongoDB needs to be installed on your computer (eventually it should be hosted from aws or something similar)
  - click to change ship's orientation, drag ship to move it.
