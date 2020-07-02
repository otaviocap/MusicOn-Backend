![MusicOn Logo](../docs/media/Logo.png)

# Music On (Backend)

This is the backend for the application Music On, the music guessing game

## Topics
- [Music On (Backend)](#music-on-backend)
  - [Topics](#topics)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [License](#license)



## Installation

First we need to have all the requirements installed in your system

- A Redis Server
- A MongoDB Server
  - You can use if you want the MongoDB Atlas service, with the free tier
- NodeJS ^14.4.0

After all this you need to configure the secret.js, in the **src** folder you
will find a file named **secret.template.js**. Please copy and rename to just
**secret.js**, there you will find some variables to edit.

|      Variable       |                   Description                    |                                                          How to get it                                                           |
| :-----------------: | :----------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------: |
|      Username       |               The MongoDB Username               |                       When configuring you database, please create an user with read and write permissions                       |
|      Password       | The MongoDB Password for the user created before |                                                     The password you gave it                                                     |
|        dbUrl        |           Your ip, or the MongoDB URL            |                     If you are running in your machine probably will be 127.0.0.1 or localhost and the port                      |
|         key         |           A key used to someoperations           |                                     Just a simple key to use for some operations in the API                                      |
| spotifyClientPublic |              The public Spotify key              | For this you will need to register your application at the [Spotify developer website](https://developer.spotify.com/dashboard/) |
| spotifyClientSecret |              The secret Spotify key              |                                                    Same process as the public                                                    |

After this need to install all the dependencies

```bash
npm install
```

## Usage

It's simple, you can start using
```bash
npm start
```
Or if you want to develop, you can start using nodemon
```bash
npm run dev
```

If everything went right you will see as output *Cleared all the rooms*, this is a procedure, so when you restart the server all previous rooms will be cleared, so some bugs with the room connection will be fixed. To disable this just comment the first line of the function *registerAndHandleEvents* in the file *GameHelper* located in the services folder

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[GPL-3.0](https://choosealicense.com/licenses/gpl-3.0/)
