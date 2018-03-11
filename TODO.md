## server-side

* install mongoDB
* add nginx config

## local-side

* translate to RU
    * `client/src/constants.js`
    * in `server/templates/` 
    * edit `server/services/email.js`
* change styles(colors and images)
    * `client/stylesheets/_custom.scss`
    * rebuild
    * `assets/images`
* change title to pandahack
    * all above
    * check online
* update registration questions
    If you want to change the application questions, edit:
    - `client/views/application/`
    - `server/models/User.js`
    - `client/views/admin/user/` and `client/views/admin/users/` to render the updated form properly in the admin view
    
    If you want stats for your new fields:
    - Recalculate them in `server/services/stats.js`
    - Display them on the admin panel by editing `client/views/admin/stats/` 




----

### Deploying locally
Getting a local instance of Quill up and running takes less than 5 minutes! Start by setting up the database. Ideally, you should run MongoDB as a daemon with a secure configuration (with most linux distributions, you should be able to install it with your package manager, and it'll be set up as a daemon). Although not recommended for production, when running locally for development, you could do it like this

```
mkdir db
mongod --dbpath db --bind_ip 127.0.0.1 --nohttpinterface
```

Install the necessary dependencies:
```
npm install
bower install
npm run config
```

Edit the configuration file in `.env` for your setup, and then run the application:
```
gulp server
```

# Customizing for your event

###### _If you're using Quill for your event, please add yourself to this [list][users]. It takes less than a minute, but knowing that our software is helping real events keeps us going ♥_ 
### Copy
If you’d like to customize the text that users see on their dashboards, edit them at `client/src/constants.js`.

### Branding / Assets
Customize the color scheme and hosted assets by editing `client/stylesheets/_custom.scss`. Don’t forget to use your own email banner, favicon, and logo (color/white) in the `assets/images/` folder as well! 

### Application questions
If you want to change the application questions, edit:
- `client/views/application/`
- `server/models/User.js`
- `client/views/admin/user/` and `client/views/admin/users/` to render the updated form properly in the admin view

If you want stats for your new fields:
- Recalculate them in `server/services/stats.js`
- Display them on the admin panel by editing `client/views/admin/stats/` 

### Email Templates
To customize the verification and confirmation emails for your event, put your new email templates in `server/templates/` and edit `server/services/email.js`
