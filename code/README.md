# Battleships

Current functions
- registration front end input validation
- registration username validation
- registration acount creation in database
- valid registration performs login

- login front end input validation
- login credentials validation
- login saves the username as a cookie

- account page loads account data for username defined by query
- account page loads image from a static file based on the account's imageID
- edit mantra and update database
- account profile image selection updates the account's imageID in database
- account edditing options are only visible to the user if he is logged in with the username in the url (by checking cookies)

- highscores page shows top 100 accounts ordered by rank

Notes
  - go to localhost:3000/highscores to view the highscores list and to navigate to other users' account pages.
  - currently, the 'rank' of an accout is assigned by order of registartion

Todo
  - login through registration should save the username as a cookie
