# Popup Engine
Platform to control popups shown on the Kent Union website. Hooks with a [Firebase](http://www.firebase.com) back-end to store both popup and login info.

## Requirements
- [NodeJS](https://nodejs.org/dist/v4.4.2/)
- [gulp](https://github.com/gulpjs/gulp)
- [AngularJS](https://github.com/angular/angular.js)

## Installing
Use `npm install` to download the required NodeJS modules.

Run `gulp prod` to compile. Gulp a will create a directory called `./dist/prod`, containing the compiled files, which must run along the `./views` directory.