# UofT-Meals-API

*This project was made in 4 days as a challenge. Only the README has been changed recently. The rest of the code is unchanged since February 29th, 2020, when I initially wrote it.*

This API returns menu data of New College's Cafeteria. Back when I still lived on residence, I wanted a convenient way to check the menu without having to go there in person. I emailed Food Services and they were nice enough to point me towards PDF menus that they had on record.

This API is hosted using Google Cloud App Engine and written with NodeJS. It scrapes and stores data from menu PDFs, updating every week when the menus change.

I also made an simple client with React that calls my API, formats, then displays my data. Unfortunately I didn't have the time to optimize for mobile, but desktop view works just fine.

### Client Example:  
  https://uoft-dining-menu-api.web.app/

### Example Endpoints:

  -https://uoft-dining-menu-api.appspot.com/new_college  
  Returns all available data about this week's menues.  
  
  -https://uoft-dining-menu-api.appspot.com/new_college/[DAY]  
  Returns [DAY]'s menu, where day is ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] 
